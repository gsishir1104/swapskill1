from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core.views import (
    SkillViewSet, MeViewSet, UserSkillViewSet, SwipeViewSet,
    SuggestionsViewSet, MatchViewSet, SessionViewSet, CreditTxnViewSet,
    RegisterView,
)

router = DefaultRouter()
router.register(r"skills", SkillViewSet, basename="skills")
router.register(r"me", MeViewSet, basename="me")
router.register(r"user-skills", UserSkillViewSet, basename="user-skills")
router.register(r"swipes", SwipeViewSet, basename="swipes")
router.register(r"suggestions", SuggestionsViewSet, basename="suggestions")
router.register(r"matches", MatchViewSet, basename="matches")
router.register(r"sessions", SessionViewSet, basename="sessions")
router.register(r"credit-txns", CreditTxnViewSet, basename="credit-txns")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/register/", RegisterView.as_view(), name="register"),
    path("api/", include(router.urls)),
]
