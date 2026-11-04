from rest_framework import serializers

from .models import Roadmap, RoadmapStep


class RoadmapStepSerializer(serializers.ModelSerializer):

    class Meta:
        model = RoadmapStep

        fields = [
            "id",
            "title",
            "description",
            "order",
            "level",
            "duration",
            "is_project",
            "prerequisite",
        ]


class RoadmapSerializer(serializers.ModelSerializer):

    steps = RoadmapStepSerializer(
        many=True,
        read_only=True
    )

    career_goal_title = serializers.CharField(
        source="career_goal.title",
        read_only=True
    )

    class Meta:
        model = Roadmap

        fields = [
            "id",
            "title",
            "description",
            "career_goal",
            "career_goal_title",
            "steps",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "career_goal_title",
            "steps",
            "created_at",
        ]
        