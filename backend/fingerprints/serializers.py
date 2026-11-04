from rest_framework import serializers
from .models import CareerFingerprint


class CareerFingerprintSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source="student.full_name",
        read_only=True
    )

    class Meta:
        model = CareerFingerprint

        fields = [
            "id",
            "student",
            "student_name",
            "career_goal",
            "interests",
            "skills",
            "strengths",
            "skill_gaps",
            "learning_progress",
            "career_score",
            "summary",
            "generated_at",
        ]

        read_only_fields = [
            "id",
            "student_name",
            "generated_at",
        ]