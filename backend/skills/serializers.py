from rest_framework import serializers
from .models import Skill, StudentSkill


class SkillSerializer(serializers.ModelSerializer):

    class Meta:
        model = Skill
        fields = "__all__"


class StudentSkillSerializer(serializers.ModelSerializer):

    skill_name = serializers.CharField(
        source="skill.name",
        read_only=True
    )

    class Meta:
        model = StudentSkill
        fields = [
            "id",
            "student",
            "skill",
            "skill_name",
            "proficiency",
        ]
        read_only_fields = ["student"]

    def validate_proficiency(self, value):

        if value < 0 or value > 100:
            raise serializers.ValidationError(
                "Proficiency must be between 0 and 100."
            )

        return value