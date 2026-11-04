from rest_framework.routers import DefaultRouter
from .views import StudentCertificateViewSet


router = DefaultRouter()

router.register(
    r"student-certificates",
    StudentCertificateViewSet,
    basename="student-certificates"
)

urlpatterns = router.urls