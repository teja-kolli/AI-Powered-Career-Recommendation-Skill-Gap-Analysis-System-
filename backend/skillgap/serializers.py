from rest_framework import serializers

from .models import CareerRequiredSkill


class CareerRequiredSkillSerializer(
    serializers.ModelSerializer
):

    skill_name = serializers.CharField(
        source="skill.name",
        read_only=True
    )

    career_goal_title = serializers.CharField(
        source="career_goal.title",
        read_only=True
    )

    class Meta:

        model = CareerRequiredSkill

        fields = [
            "id",
            "career_goal",
            "career_goal_title",
            "skill",
            "skill_name",
            "importance",
            "minimum_proficiency",
        ]