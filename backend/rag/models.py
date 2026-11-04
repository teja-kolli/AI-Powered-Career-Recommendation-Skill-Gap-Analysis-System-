from django.db import models
from pgvector.django import VectorField


class RagDocument(models.Model):

    content = models.TextField()

    category = models.CharField(
        max_length=100
    )

    domain = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    source = models.CharField(
        max_length=255,
        blank=True
    )

    metadata = models.JSONField(
        null=True,
        blank=True
    )

    embedding = VectorField(
        dimensions=384,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.content[:100]