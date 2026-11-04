import traceback

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .services import generate_placement_coach


class PlacementCoachView(APIView):

    permission_classes = [IsAuthenticated]

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

            duration = request.data.get("duration")

            if not duration:

                return Response(
                    {
                        "error":
                            "Please select a preparation duration."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            print(
                "REQUESTED PLACEMENT DURATION:",
                duration
            )

            result = generate_placement_coach(
                profile,
                duration
            )

            if result.get("error"):

                return Response(
                    result,
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response(
                result,
                status=status.HTTP_200_OK
            )

        except Exception as e:

            print("\n================================")
            print("PLACEMENT COACH ERROR")
            print("================================")

            print(str(e))

            traceback.print_exc()

            print("================================\n")

            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )