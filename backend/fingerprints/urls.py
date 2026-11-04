from django.urls import path

from .views import (
    GenerateFingerprintView,
    MyFingerprintView,
)


urlpatterns = [

    path(
        "generate/",
        GenerateFingerprintView.as_view(),
        name="generate-fingerprint"
    ),

    path(
        "me/",
        MyFingerprintView.as_view(),
        name="my-fingerprint"
    ),

]