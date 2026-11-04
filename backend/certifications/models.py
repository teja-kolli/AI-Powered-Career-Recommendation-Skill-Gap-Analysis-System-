from django.db import models
from profiles.models import StudentProfile


class StudentCertificate(models.Model):

    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="certificates"
    )

    name = models.CharField(
        max_length=200,
        blank=True
    )

    file = models.FileField(
        upload_to="student_certificates/"
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    analyzed = models.BooleanField(
        default=False
    )

    analysis_result = models.JSONField(
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.student.full_name} - {self.name or 'Certificate'}"