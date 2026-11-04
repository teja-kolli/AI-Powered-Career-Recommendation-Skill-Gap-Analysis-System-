from rest_framework import serializers
from .models import Interest, StudentInterest


class InterestSerializer(serializers.ModelSerializer):

    class Meta:
        model = Interest
        fields = "__all__"


class StudentInterestSerializer(serializers.ModelSerializer):

    interest_name = serializers.CharField(
        source="interest.name",
        read_only=True
    )

    class Meta:
        model = StudentInterest
        fields = [
            "id",
            "student",
            "interest",
            "interest_name",
        ]