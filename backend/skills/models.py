from django.db import models
from profiles.models import StudentProfile
from django.core.validators import MaxValueValidator

class Skill(models.Model):

    CATEGORY_CHOICES = [
        ("Programming", "Programming"),
        ("Frontend", "Frontend"),
        ("Backend", "Backend"),
        ("Database", "Database"),
        ("AI/ML", "AI/ML"),
        ("DevOps", "DevOps"),
        ("Cloud", "Cloud"),
        ("Other", "Other"),
    ]

    name = models.CharField(
        max_length=100,
        unique=True
    )

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default="Other"
    )

    description = models.TextField(
        blank=True
    )

    def __str__(self):
        return self.name


class StudentSkill(models.Model):

    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="student_skills"
    )

    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name="student_skills"
    )

    proficiency = models.PositiveIntegerField(
        default=0,
        validators=[
            MaxValueValidator(100)
        ]
    )

    class Meta:
        unique_together = ("student", "skill")

    def __str__(self):
        return f"{self.student.full_name} - {self.skill.name}"