from django.contrib import admin
from .models import StudentCertificate


@admin.register(StudentCertificate)
class StudentCertificateAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "student",
        "uploaded_at",
        "analyzed",
    )

    list_filter = (
        "analyzed",
        "uploaded_at",
    )

    search_fields = (
        "name",
        "student__full_name",
    )