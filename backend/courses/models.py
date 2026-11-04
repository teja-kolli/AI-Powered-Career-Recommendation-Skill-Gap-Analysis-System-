from django.db import models
from skills.models import Skill


class Course(models.Model):

    DIFFICULTY_LEVELS = [
        ("Beginner", "Beginner"),
        ("Intermediate", "Intermediate"),
        ("Advanced", "Advanced"),
    ]

    title = models.CharField(
        max_length=200
    )

    description = models.TextField()

    platform = models.CharField(
        max_length=100
    )

    instructor = models.CharField(
        max_length=150,
        blank=True
    )

    skill = models.ForeignKey(
        Skill,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="courses"
    )

    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_LEVELS,
        default="Beginner"
    )

    duration = models.CharField(
        max_length=100,
        blank=True
    )

    url = models.URLField()

    rating = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title