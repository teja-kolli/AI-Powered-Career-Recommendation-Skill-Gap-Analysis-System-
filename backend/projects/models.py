from django.db import models
from skills.models import Skill


class Project(models.Model):

    DIFFICULTY_LEVELS = [
        ("Beginner", "Beginner"),
        ("Intermediate", "Intermediate"),
        ("Advanced", "Advanced"),
    ]

    title = models.CharField(
        max_length=200
    )

    description = models.TextField()

    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_LEVELS,
        default="Beginner"
    )

    skills = models.ManyToManyField(
        Skill,
        related_name="projects",
        blank=True
    )

    github_url = models.URLField(
        blank=True,
        null=True
    )

    demo_url = models.URLField(
        blank=True,
        null=True
    )

    estimated_duration = models.CharField(
        max_length=100,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title