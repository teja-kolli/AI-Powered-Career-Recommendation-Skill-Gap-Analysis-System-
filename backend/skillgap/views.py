import traceback

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .services import generate_skill_gap


class SkillGapAnalysisView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

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


            result = generate_skill_gap(
                profile
            )


            return Response(
                result,
                status=status.HTTP_200_OK
            )


        except Exception as e:

            print(
                "\n=============================="
            )

            print(
                "SKILL GAP OLLAMA ERROR"
            )

            print(
                "=============================="
            )

            print(
                str(e)
            )

            traceback.print_exc()

            print(
                "==============================\n"
            )


            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )