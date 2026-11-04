from django.conf import settings
from django.db import models
from careers.models import CareerGoal


class StudentProfile(models.Model):

    LEVELS = [
        ("Beginner", "Beginner"),
        ("Intermediate", "Intermediate"),
        ("Advanced", "Advanced"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    full_name = models.CharField(max_length=100)

    college = models.CharField(max_length=150)

    branch = models.CharField(max_length=100)

    year = models.PositiveIntegerField()

    career_goal = models.ForeignKey(
        CareerGoal,
        on_delete=models.SET_NULL,
        null=True,
        related_name="profiles"
    )

    bio = models.TextField(blank=True)

    learning_level = models.CharField(
        max_length=20,
        choices=LEVELS,
        default="Beginner"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name