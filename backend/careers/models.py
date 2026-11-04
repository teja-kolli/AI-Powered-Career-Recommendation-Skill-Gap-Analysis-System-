from django.db import models


class CareerGoal(models.Model):
    title = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.title


class CareerProfile(models.Model):

    LEARNING_LEVELS = [
        ("Beginner", "Beginner"),
        ("Intermediate", "Intermediate"),
        ("Advanced", "Advanced"),
    ]

    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    career_goal = models.ForeignKey(
        CareerGoal,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="students"
    )

  
    learning_level = models.CharField(
        max_length=20,
        choices=LEARNING_LEVELS,
        default="Beginner"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name