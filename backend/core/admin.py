
from django.contrib import admin
from .models import User, Skill, UserSkill, Swipe, Match, Session, CreditTxn
admin.site.register(User)
admin.site.register(Skill)
admin.site.register(UserSkill)
admin.site.register(Swipe)
admin.site.register(Match)
admin.site.register(Session)
admin.site.register(CreditTxn)
