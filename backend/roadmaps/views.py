from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Roadmap
from .serializers import RoadmapSerializer


class RoadmapViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = (
        Roadmap.objects
        .select_related("career_goal")
        .prefetch_related("steps")
        .all()
    )

    serializer_class = RoadmapSerializer
    permission_classes = [AllowAny]