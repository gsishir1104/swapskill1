
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from rest_framework.response import Response
from django.db.models import Q
from .models import User, UserSkill
from .serializers import UserSerializer

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def suggestions(request):
    me = request.user
    my_learn_skill_ids = UserSkill.objects.filter(user=me, role='learn').values_list('skill_id', flat=True)
    teach_users = UserSkill.objects.filter(role='teach', skill_id__in=my_learn_skill_ids).values_list('user_id', flat=True)
    qs = User.objects.exclude(id=me.id).filter(id__in=set(teach_users))[:50]
    return Response(UserSerializer(qs, many=True).data)
