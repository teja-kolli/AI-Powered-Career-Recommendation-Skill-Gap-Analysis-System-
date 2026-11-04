from rest_framework import serializers
from .models import CareerGoal, CareerProfile


class CareerGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerGoal
        fields = "__all__"


class CareerProfileSerializer(serializers.ModelSerializer):

    career_goal = CareerGoalSerializer(read_only=True)

    class Meta:
        model = CareerProfile
        fields = "__all__"