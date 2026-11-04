from rest_framework.routers import DefaultRouter

from .views import (
    SkillViewSet,
    StudentSkillViewSet
)


router = DefaultRouter()

router.register(
    "skills",
    SkillViewSet,
    basename="skills"
)

router.register(
    "student-skills",
    StudentSkillViewSet,
    basename="student-skills"
)


urlpatterns = router.urls