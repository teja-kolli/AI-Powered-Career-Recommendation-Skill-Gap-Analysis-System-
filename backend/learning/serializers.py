from rest_framework import serializers
from .models import LearningProgress


class LearningProgressSerializer(serializers.ModelSerializer):

    course_name = serializers.CharField(
        source="course.title",
        read_only=True
    )

    student_name = serializers.CharField(
        source="student.full_name",
        read_only=True
    )

    class Meta:
        model = LearningProgress

        fields = [
            "id",
            "student",
            "student_name",
            "course",
            "course_name",
            "progress_percentage",
            "completed",
            "started_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "student_name",
            "course_name",
            "completed",
            "started_at",
            "updated_at",
        ]