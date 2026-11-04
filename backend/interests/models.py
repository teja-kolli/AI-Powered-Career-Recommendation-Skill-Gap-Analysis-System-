from django.db import models
from profiles.models import StudentProfile


class Interest(models.Model):

    name = models.CharField(
        max_length=100,
        unique=True
    )

    description = models.TextField(
        blank=True
    )

    def __str__(self):
        return self.name


class StudentInterest(models.Model):

    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="student_interests"
    )

    interest = models.ForeignKey(
        Interest,
        on_delete=models.CASCADE,
        related_name="student_interests"
    )

    class Meta:
        unique_together = ("student", "interest")

    def __str__(self):
        return f"{self.student.full_name} - {self.interest.name}"