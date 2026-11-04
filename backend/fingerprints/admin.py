from django.contrib import admin

from .models import CareerFingerprint


@admin.register(CareerFingerprint)
class CareerFingerprintAdmin(admin.ModelAdmin):

    list_display = (
        "student",
        "career_goal",
        "career_score",
        "generated_at",
    )

    search_fields = (
        "student__full_name",
        "career_goal",
    )