from rest_framework import viewsets

from .models import Interest, StudentInterest
from .serializers import (
    InterestSerializer,
    StudentInterestSerializer
)


class InterestViewSet(viewsets.ModelViewSet):

    queryset = Interest.objects.all().order_by("name")

    serializer_class = InterestSerializer


class StudentInterestViewSet(viewsets.ModelViewSet):

    queryset = StudentInterest.objects.all()

    serializer_class = StudentInterestSerializer