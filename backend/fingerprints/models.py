from django.db import models
from profiles.models import StudentProfile


class CareerFingerprint(models.Model):

    student = models.OneToOneField(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="career_fingerprint"
    )

    career_goal = models.CharField(
        max_length=150,
        blank=True
    )

    career_score = models.FloatField(
        default=0
    )

    summary = models.TextField(
        blank=True
    )

    interests = models.JSONField(
        default=list,
        blank=True
    )

    skills = models.JSONField(
        default=list,
        blank=True
    )

    strengths = models.JSONField(
        default=list,
        blank=True
    )

    skill_gaps = models.JSONField(
        default=list,
        blank=True
    )

    learning_progress = models.JSONField(
        default=dict,
        blank=True
    )

    fingerprint_data = models.JSONField(
        default=dict,
        blank=True
    )

    generated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return (
            f"{self.student.full_name} - "
            f"Career Fingerprint"
        )