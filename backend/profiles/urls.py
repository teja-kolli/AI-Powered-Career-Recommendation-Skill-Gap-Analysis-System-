from rest_framework.routers import DefaultRouter
from .views import StudentProfileViewSet

router = DefaultRouter()

router.register(
    r"profiles",
    StudentProfileViewSet,
    basename="profiles"
)

urlpatterns = router.urls