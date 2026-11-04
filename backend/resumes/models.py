from django.db import models

# Create your models here.
from django.db import models
from profiles.models import StudentProfile


class ResumeAnalysis(models.Model):

    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="resume_analyses"
    )

    file = models.FileField(
        upload_to="resumes/"
    )

    file_name = models.CharField(
        max_length=255
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    analyzed = models.BooleanField(
        default=False
    )

    analysis_result = models.JSONField(
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.student.full_name} - {self.file_name}"