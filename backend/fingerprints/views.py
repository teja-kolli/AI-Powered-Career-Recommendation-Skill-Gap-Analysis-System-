import traceback

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import CareerFingerprint
from .serializers import CareerFingerprintSerializer
from .services import generate_fingerprint


class GenerateFingerprintView(APIView):

    permission_classes = [
        IsAuthenticated
    ]


    def post(self, request):

        try:

            profile = request.user.profile


            if not profile.career_goal:

                return Response(
                    {
                        "error":
                            "Please select a career goal first."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            result = generate_fingerprint(
                profile
            )


            if result.get("error"):

                return Response(
                    result,
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )


            return Response(
                result,
                status=status.HTTP_200_OK
            )


        except Exception as e:

            print("\n====================================")
            print("CAREER FINGERPRINT ERROR")
            print("====================================")

            print(str(e))

            traceback.print_exc()

            print("====================================\n")


            return Response(
                {
                    "error":
                        str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MyFingerprintView(APIView):

    permission_classes = [
        IsAuthenticated
    ]


    def get(self, request):

        try:

            profile = request.user.profile


            fingerprint = (
                CareerFingerprint.objects
                .filter(student=profile)
                .first()
            )


            if not fingerprint:

                return Response(
                    {
                        "error":
                            "Career fingerprint has not been generated yet."
                    },
                    status=status.HTTP_404_NOT_FOUND
                )


            serializer = (
                CareerFingerprintSerializer(
                    fingerprint
                )
            )


            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )


        except Exception as e:

            return Response(
                {
                    "error":
                        str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )