from rest_framework.routers import DefaultRouter

from .views import (
    CareerGoalViewSet,
    CareerProfileViewSet
)


router = DefaultRouter()

router.register(
    "career-goals",
    CareerGoalViewSet,
    basename="career-goals"
)

router.register(
    "profiles",
    CareerProfileViewSet,
    basename="profiles"
)

urlpatterns = router.urls