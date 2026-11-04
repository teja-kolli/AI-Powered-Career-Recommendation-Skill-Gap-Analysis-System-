from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import StudentProfile
from .serializers import StudentProfileSerializer


class StudentProfileViewSet(viewsets.ModelViewSet):

    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudentProfile.objects.filter(
            user=self.request.user
        ).select_related("career_goal")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)