from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):

    skill_names = serializers.StringRelatedField(
        source="skills",
        many=True,
        read_only=True
    )

    class Meta:
        model = Project

        fields = [
            "id",
            "title",
            "description",
            "difficulty",
            "skills",
            "skill_names",
            "github_url",
            "demo_url",
            "estimated_duration",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "skill_names",
            "created_at",
        ]