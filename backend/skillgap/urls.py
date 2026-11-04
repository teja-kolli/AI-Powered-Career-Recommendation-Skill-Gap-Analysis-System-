from django.urls import path

from .views import SkillGapAnalysisView


urlpatterns = [

    path(
        "analyze/",
        SkillGapAnalysisView.as_view(),
        name="skill-gap-analysis"
    ),

]