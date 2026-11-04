from rest_framework import viewsets

from .models import LearningProgress
from .serializers import LearningProgressSerializer


class LearningProgressViewSet(viewsets.ModelViewSet):

    queryset = LearningProgress.objects.all().order_by(
        "-updated_at"
    )

    serializer_class = LearningProgressSerializer