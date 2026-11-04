from django.db import models


class Roadmap(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    career_goal = models.OneToOneField(
        "careers.CareerGoal",
        on_delete=models.CASCADE,
        related_name="roadmap"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class RoadmapStep(models.Model):

    LEVELS = [
        ("Beginner", "Beginner"),
        ("Intermediate", "Intermediate"),
        ("Advanced", "Advanced"),
    ]

    roadmap = models.ForeignKey(
        Roadmap,
        on_delete=models.CASCADE,
        related_name="steps"
    )

    title = models.CharField(max_length=200)

    description = models.TextField(blank=True)

    order = models.PositiveIntegerField()

    level = models.CharField(
        max_length=20,
        choices=LEVELS,
        default="Beginner"
    )

    duration = models.CharField(
        max_length=100,
        blank=True
    )

    is_project = models.BooleanField(
        default=False
    )

    prerequisite = models.CharField(
        max_length=200,
        blank=True
    )

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.roadmap.title} - {self.title}"