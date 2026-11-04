from django.db import models

from careers.models import CareerGoal
from skills.models import Skill


class CareerRequiredSkill(models.Model):

    career_goal = models.ForeignKey(
        CareerGoal,
        on_delete=models.CASCADE,
        related_name="required_skills"
    )

    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name="career_requirements"
    )

    importance = models.PositiveIntegerField(
        default=50
    )

    minimum_proficiency = models.PositiveIntegerField(
        default=60
    )

    class Meta:
        unique_together = (
            "career_goal",
            "skill"
        )

    def __str__(self):
        return (
            f"{self.career_goal.title} - "
            f"{self.skill.name}"
        )