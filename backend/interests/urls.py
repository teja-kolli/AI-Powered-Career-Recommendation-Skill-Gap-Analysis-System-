from rest_framework.routers import DefaultRouter

from .views import (
    InterestViewSet,
    StudentInterestViewSet
)


router = DefaultRouter()

router.register(
    "interests",
    InterestViewSet,
    basename="interests"
)

router.register(
    "student-interests",
    StudentInterestViewSet,
    basename="student-interests"
)


urlpatterns = router.urls