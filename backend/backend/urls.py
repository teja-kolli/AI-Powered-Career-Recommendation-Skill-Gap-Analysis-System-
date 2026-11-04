from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/auth/", include("users.urls")),

    path("api/skills/", include("skills.urls")),

    path("api/interests/", include("interests.urls")),

    path("api/courses/", include("courses.urls")),

    path("api/projects/", include("projects.urls")),

    path("api/certifications/", include("certifications.urls")),

    path("api/learning/", include("learning.urls")),

    path("api/fingerprint/", include("fingerprints.urls")),
    path("api/skill-gap/", include("skillgap.urls")),
    path("api/profiles/", include("profiles.urls")),
    path("api/roadmaps/",include("roadmaps.urls")),
    path("api/rag/",include("rag.urls")),
    path("api/careers/", include("careers.urls")),
    path("api/recommendations/",include("recommendations.urls")),
    path("api/placement-coach/",include("placementcoach.urls")),
    path("api/resumes/",include("resumes.urls")),
]