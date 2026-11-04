from django.urls import path

from .views import (
    RoadmapRAGView,
    CoursesRAGView,
    ProjectsRAGView,
)


urlpatterns = [

    path(
        "roadmap/",
        RoadmapRAGView.as_view(),
        name="roadmap-rag"
    ),

    path(
        "courses/",
        CoursesRAGView.as_view(),
        name="courses-rag"
    ),

    path(
        "projects/",
        ProjectsRAGView.as_view(),
        name="projects-rag"
    ),

]