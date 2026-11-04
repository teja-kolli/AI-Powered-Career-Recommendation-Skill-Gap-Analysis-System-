from django.contrib import admin

from .models import Recommendation


@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "student",
        "career",
        "recommendation_type",
        "created_at",
    )

    list_filter = (
        "recommendation_type",
        "career",
    )

    search_fields = (
        "title",
        "description",
        "student__full_name",
    )