from django.contrib import admin

from .models import Roadmap, RoadmapStep


class RoadmapStepInline(admin.TabularInline):
    model = RoadmapStep
    extra = 1


@admin.register(Roadmap)
class RoadmapAdmin(admin.ModelAdmin):

    list_display = [
        "title",
        "career_goal",
        "created_at",
    ]

    inlines = [
        RoadmapStepInline
    ]


@admin.register(RoadmapStep)
class RoadmapStepAdmin(admin.ModelAdmin):

    list_display = [
        "title",
        "roadmap",
        "order",
        "level",
        "is_project",
    ]

    list_filter = [
        "level",
        "is_project",
    ]