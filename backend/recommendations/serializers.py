from rest_framework import serializers
from .models import Recommendation


class RecommendationSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source="student.full_name",
        read_only=True
    )

    career_name = serializers.CharField(
        source="career.title",
        read_only=True
    )

    class Meta:
        model = Recommendation

        fields = [
            "id",
            "student",
            "student_name",
            "career",
            "career_name",
            "recommendation_type",
            "title",
            "description",
            "link",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "student_name",
            "career_name",
            "created_at",
        ]