from django.urls import path

from .views import PlacementCoachView


urlpatterns = [

    path(
        "roadmap/",
        PlacementCoachView.as_view(),
        name="placement-coach-roadmap"
    ),

]