from rest_framework import serializers
from .models import Course


class CourseSerializer(serializers.ModelSerializer):

    skill_name = serializers.CharField(
        source="skill.name",
        read_only=True
    )

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "platform",
            "instructor",
            "skill",
            "skill_name",
            "difficulty",
            "duration",
            "url",
            "rating",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "skill_name",
        ]