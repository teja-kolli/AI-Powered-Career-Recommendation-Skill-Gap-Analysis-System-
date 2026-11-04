from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import CareerGoal, CareerProfile
from .serializers import (
    CareerGoalSerializer,
    CareerProfileSerializer
)


class CareerGoalViewSet(viewsets.ModelViewSet):
    queryset = CareerGoal.objects.all().order_by("title")
    serializer_class = CareerGoalSerializer
    permission_classes = [AllowAny]


class CareerProfileViewSet(viewsets.ModelViewSet):
    queryset = CareerProfile.objects.all().order_by("-created_at")
    serializer_class = CareerProfileSerializer
    permission_classes = [IsAuthenticated]