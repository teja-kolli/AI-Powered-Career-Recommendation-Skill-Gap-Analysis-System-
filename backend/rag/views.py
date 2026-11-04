from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .services import (
    generate_personalized_roadmap,
    generate_personalized_courses,
    generate_personalized_projects,
)


# =========================================================
# ROADMAP RAG API
# =========================================================

class RoadmapRAGView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        try:

            profile = request.user.profile

            if not profile.career_goal:

                return Response(
                    {
                        "error": (
                            "Please select a "
                            "career goal first."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            result = generate_personalized_roadmap(
                profile
            )

            return Response(
                result,
                status=status.HTTP_200_OK
            )

        except Exception as e:

            print(
                "RAG ROADMAP ERROR:",
                str(e)
            )

            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# =========================================================
# COURSES RAG API
# =========================================================

class CoursesRAGView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        try:

            profile = request.user.profile

            if not profile.career_goal:

                return Response(
                    {
                        "error": (
                            "Please select a "
                            "career goal first."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            result = generate_personalized_courses(
                profile
            )

            return Response(
                result,
                status=status.HTTP_200_OK
            )

        except Exception as e:

            print(
                "RAG COURSES ERROR:",
                str(e)
            )

            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# =========================================================
# PROJECTS RAG API
# =========================================================

class ProjectsRAGView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        try:

            profile = request.user.profile

            if not profile.career_goal:

                return Response(
                    {
                        "error": (
                            "Please select a "
                            "career goal first."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            result = generate_personalized_projects(
                profile
            )

            return Response(
                result,
                status=status.HTTP_200_OK
            )

        except Exception as e:

            print(
                "RAG PROJECTS ERROR:",
                str(e)
            )

            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )