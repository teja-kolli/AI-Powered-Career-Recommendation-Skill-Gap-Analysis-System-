from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .models import StudentCertificate
from .serializers import StudentCertificateSerializer


class StudentCertificateViewSet(viewsets.ModelViewSet):

    serializer_class = StudentCertificateSerializer
    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get_queryset(self):
        return StudentCertificate.objects.filter(
            student__user=self.request.user
        ).order_by("-uploaded_at")

    def perform_create(self, serializer):
        student = self.request.user.profile

        serializer.save(
            student=student
        )