from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Skill, StudentSkill
from .serializers import (
    SkillSerializer,
    StudentSkillSerializer
)


class SkillViewSet(viewsets.ModelViewSet):

    queryset = Skill.objects.all().order_by("name")

    serializer_class = SkillSerializer


class StudentSkillViewSet(viewsets.ModelViewSet):

    serializer_class = StudentSkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudentSkill.objects.filter(
            student__user=self.request.user
        )

    def perform_create(self, serializer):

        profile = self.request.user.profile

        serializer.save(
            student=profile
        )