
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (('user','user'), ('admin','admin'))
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=8, choices=ROLE_CHOICES, default='user')
    full_name = models.CharField(max_length=120, blank=True)
    bio = models.TextField(blank=True)
    timezone = models.CharField(max_length=64, blank=True)
    reputation = models.IntegerField(default=0)
    credits = models.IntegerField(default=2)  # signup bonus
    REQUIRED_FIELDS = ['email']

class Skill(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=80, unique=True)
    category = models.CharField(max_length=80, blank=True)
    level_hint = models.CharField(max_length=32, blank=True)

    def __str__(self):
        return self.name

class UserSkill(models.Model):
    ROLE_CHOICES = (('teach', 'teach'), ('learn', 'learn'))
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    skill = models.ForeignKey('Skill', on_delete=models.CASCADE)
    role = models.CharField(max_length=8, choices=ROLE_CHOICES)
    level = models.CharField(max_length=32, blank=True)

class Swipe(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    swiper = models.ForeignKey('User', on_delete=models.CASCADE, related_name='swipes_made')
    target = models.ForeignKey('User', on_delete=models.CASCADE, related_name='swipes_received')
    direction = models.CharField(max_length=5)  # 'right' or 'left'
    context = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Match(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_a = models.ForeignKey('User', on_delete=models.CASCADE, related_name='matches_as_a')
    user_b = models.ForeignKey('User', on_delete=models.CASCADE, related_name='matches_as_b')
    skill_a_teaches = models.ForeignKey('Skill', on_delete=models.SET_NULL, null=True, related_name='+')
    skill_b_teaches = models.ForeignKey('Skill', on_delete=models.SET_NULL, null=True, related_name='+')
    status = models.CharField(max_length=12, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

class Session(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    match = models.ForeignKey('Match', on_delete=models.CASCADE)
    start_at = models.DateTimeField()
    duration_min = models.PositiveIntegerField(default=60)
    mode = models.CharField(max_length=12, default='online')
    location = models.CharField(max_length=140, blank=True)
    status = models.CharField(max_length=12, default='scheduled')

class CreditTxn(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    delta = models.IntegerField()
    reason = models.CharField(max_length=24)
    related_id = models.UUIDField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
