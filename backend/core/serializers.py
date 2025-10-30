# backend/core/serializers.py
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import User, Skill, UserSkill, Swipe, Match, Session, CreditTxn


# ---------- Mini serializers (for embedding) ----------
class UserMiniSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "username", "full_name", "display_name")

    def get_display_name(self, obj):
        # Prefer full name if present, otherwise username
        return (obj.full_name or "").strip() or obj.username


class SkillMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ("id", "name")


# ---------- Skill ----------
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = "__all__"


# ---------- User (signup/profile) ----------
class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(
            queryset=User.objects.all(),
            message="Username already taken."
        )]
    )
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(
            queryset=User.objects.all(),
            message="Email already in use."
        )]
    )
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            "id", "username", "email", "role",
            "full_name", "bio", "timezone",
            "reputation", "credits",
            "password",
        )

    def validate_role(self, value: str):
        v = (value or "").strip().lower()
        if v not in ("user", "admin"):
            raise serializers.ValidationError("Role must be 'user' or 'admin'.")
        return v

    def create(self, validated_data):
        pwd = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(pwd)  # hash
        user.save()
        return user


# ---------- UserSkill (write with skill_id, read with nested skill) ----------
class UserSkillSerializer(serializers.ModelSerializer):
    # Read:
    skill = SkillMiniSerializer(read_only=True)
    # Write:
    skill_id = serializers.UUIDField(write_only=True)
    role = serializers.CharField()

    class Meta:
        model = UserSkill
        fields = ("id", "user", "skill", "skill_id", "role", "level")
        read_only_fields = ("user",)

    def validate_role(self, value):
        v = (value or "").strip().lower()
        if v not in ("teach", "learn"):
            raise serializers.ValidationError("Role must be 'teach' or 'learn'.")
        return v


# ---------- Swipe ----------
class SwipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Swipe
        fields = "__all__"
        read_only_fields = ("swiper",)


# ---------- Match (return nested users & skills) ----------
class MatchSerializer(serializers.ModelSerializer):
    user_a = UserMiniSerializer(read_only=True)
    user_b = UserMiniSerializer(read_only=True)
    skill_a_teaches = SkillMiniSerializer(read_only=True)
    skill_b_teaches = SkillMiniSerializer(read_only=True)

    class Meta:
        model = Match
        fields = (
            "id",
            "user_a",
            "user_b",
            "skill_a_teaches",
            "skill_b_teaches",
            "status",
            "created_at",
        )


# ---------- Session ----------
class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = "__all__"


# ---------- Credit transactions ----------
class CreditTxnSerializer(serializers.ModelSerializer):
    # Optional: include a compact user view if you want it in the wallet history
    user = UserMiniSerializer(read_only=True)

    class Meta:
        model = CreditTxn
        fields = "__all__"
