from django.db import models
from django.core.validators import MaxValueValidator

from profiles.models import StudentProfile
from courses.models import Course


class LearningProgress(models.Model):

    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="learning_progress"
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="student_progress"
    )

    progress_percentage = models.PositiveIntegerField(
        default=0,
        validators=[
            MaxValueValidator(100)
        ]
    )

    completed = models.BooleanField(
        default=False
    )

    started_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        unique_together = ("student", "course")

    def save(self, *args, **kwargs):

        if self.progress_percentage >= 100:
            self.progress_percentage = 100
            self.completed = True
        else:
            self.completed = False

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student.full_name} - {self.course.title}"