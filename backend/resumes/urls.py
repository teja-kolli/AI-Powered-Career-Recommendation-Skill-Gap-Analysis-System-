from django.urls import path

from .views import ResumeAnalyzerView


urlpatterns = [

    path(
        "analyze/",
        ResumeAnalyzerView.as_view(),
        name="resume-analyze"
    ),

]