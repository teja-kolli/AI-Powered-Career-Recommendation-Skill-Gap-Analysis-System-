from rest_framework.routers import DefaultRouter

from .views import LearningProgressViewSet


router = DefaultRouter()

router.register(
    "progress",
    LearningProgressViewSet,
    basename="learning-progress"
)

urlpatterns = router.urls