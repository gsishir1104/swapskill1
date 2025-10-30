from django.db import IntegrityError
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, viewsets, permissions, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import User, Skill, UserSkill, Swipe, Match, Session, CreditTxn
from .serializers import (
    UserSerializer, SkillSerializer, UserSkillSerializer, SwipeSerializer,
    MatchSerializer, SessionSerializer, CreditTxnSerializer
)
from .services import record_swipe, settle_session_credit
from .services import find_matching_users


# ---------- Public signup ----------
class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def create(self, request, *args, **kwargs):
        payload = {
            "username": request.data.get("username"),
            "email": request.data.get("email"),
            "password": request.data.get("password"),
            "role": (request.data.get("role") or "").lower(),
        }
        serializer = self.get_serializer(data=payload)
        if serializer.is_valid():
            try:
                user = serializer.save()
            except IntegrityError:
                return Response(
                    {"detail": "Username or email already exists."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------- Skills ----------
class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]


# ---------- Me ----------
class MeViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["get"])
    def profile(self, request):
        return Response(UserSerializer(request.user).data)


# ---------- User skills ----------
class UserSkillViewSet(viewsets.ModelViewSet):
    serializer_class = UserSkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            UserSkill.objects
            .filter(user=self.request.user)
            .select_related("skill")
        )

    def perform_create(self, serializer):
        skill_id = self.request.data.get("skill_id")
        if not skill_id:
            raise serializers.ValidationError({"skill_id": ["This field is required."]})
        skill = get_object_or_404(Skill, id=skill_id)

        role = (self.request.data.get("role") or "").strip().lower()
        if role not in ("teach", "learn"):
            raise serializers.ValidationError({"role": ["Role must be 'teach' or 'learn'."]})

        # Prevent duplicate (user, skill, role)
        if UserSkill.objects.filter(user=self.request.user, skill=skill, role=role).exists():
            raise serializers.ValidationError({"detail": "You already have this skill with the same role."})

        serializer.save(user=self.request.user, skill=skill, role=role)


# ---------- Swipe ----------
class SwipeViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SwipeSerializer

    @action(detail=False, methods=["post"])
    def create_swipe(self, request):
        """Record swipe and possibly create a match instantly."""
        target_id = request.data.get("target_id")
        direction = (request.data.get("direction") or "").strip().lower()
        context = request.data.get("context") or {}

        if not target_id:
            return Response({"target_id": ["This field is required."]}, status=status.HTTP_400_BAD_REQUEST)
        if direction not in ("right", "left"):
            return Response({"direction": ["Direction must be 'right' or 'left'."]}, status=status.HTTP_400_BAD_REQUEST)

        target = get_object_or_404(User, id=target_id)
        data = record_swipe(request.user, target, direction, context)
        return Response(data, status=status.HTTP_200_OK)


# ---------- Suggestions ----------
class SuggestionsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        """Suggest users who teach what I want to learn (and not yet swiped)."""
        u = request.user
        already_swiped = list(Swipe.objects.filter(swiper=u).values_list("target_id", flat=True))
        candidates = find_matching_users(u).exclude(id__in=already_swiped)
        return Response(UserSerializer(candidates, many=True).data)


# ---------- Matches ----------``
class MatchViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return all matches for the current user."""
        u = self.request.user
        return (
            Match.objects
            .filter(Q(user_a=u) | Q(user_b=u))
            .select_related("user_a", "user_b", "skill_a_teaches", "skill_b_teaches")
            .order_by("-created_at")
            .distinct()
        )


# ---------- Sessions ----------
class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        obj = serializer.save()
        m = obj.match
        teacher, learner = m.user_a, m.user_b  # Simplified assumption
        settle_session_credit(obj, teacher, learner)


# ---------- Credit transactions ----------
class CreditTxnViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CreditTxnSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CreditTxn.objects.filter(user=self.request.user).order_by("-created_at")
