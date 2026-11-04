from rest_framework.routers import DefaultRouter

from .views import RoadmapViewSet


router = DefaultRouter()

router.register(
    "roadmaps",
    RoadmapViewSet,
    basename="roadmaps"
)

urlpatterns = router.urls