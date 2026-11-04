from rest_framework import serializers
from .models import StudentProfile


class StudentProfileSerializer(serializers.ModelSerializer):

    user = serializers.ReadOnlyField(source="user.id")

    career_goal_title = serializers.CharField(
        source="career_goal.title",
        read_only=True
    )

    class Meta:
        model = StudentProfile

        fields = [
            "id",
            "user",
            "full_name",
            "college",
            "branch",
            "year",
            "career_goal",
            "career_goal_title",
            "bio",
            "learning_level",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "created_at",
            "career_goal_title",
        ]