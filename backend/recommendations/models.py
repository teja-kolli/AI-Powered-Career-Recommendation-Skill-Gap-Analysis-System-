from django.db import models
from profiles.models import StudentProfile
from careers.models import CareerGoal


class Recommendation(models.Model):

    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="recommendations"
    )

    career = models.ForeignKey(
        CareerGoal,
        on_delete=models.CASCADE,
        related_name="recommendations"
    )

    recommendation_type = models.CharField(
        max_length=50,
        choices=[
            ("Course", "Course"),
            ("Project", "Project"),
            ("Certification", "Certification"),
            ("Roadmap", "Roadmap"),
        ]
    )

    title = models.CharField(max_length=200)
    description = models.TextField()
    link = models.URLField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title