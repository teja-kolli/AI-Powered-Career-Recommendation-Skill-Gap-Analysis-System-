from rest_framework import serializers
from .models import StudentCertificate


class StudentCertificateSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentCertificate

        fields = [
            "id",
            "name",
            "file",
            "uploaded_at",
            "analyzed",
            "analysis_result",
        ]

        read_only_fields = [
            "id",
            "uploaded_at",
            "analyzed",
            "analysis_result",
        ]