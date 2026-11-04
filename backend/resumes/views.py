import traceback

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import ResumeAnalysis
from .services import analyze_resume, extract_resume_text


class ResumeAnalyzerView(APIView):

    permission_classes = [
        IsAuthenticated
    ]


    def post(self, request):

        try:

            # ------------------------------------------------
            # PROFILE
            # ------------------------------------------------

            profile = request.user.profile


            if not profile.career_goal:

                return Response(
                    {
                        "error":
                            "Please select a career goal first."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # ------------------------------------------------
            # FILE
            # ------------------------------------------------

            resume_file = request.FILES.get(
                "resume"
            )


            if not resume_file:

                return Response(
                    {
                        "error":
                            "Please upload a resume."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # ------------------------------------------------
            # VALIDATE FILE
            # ------------------------------------------------

            allowed_extensions = [
                ".pdf",
                ".docx",
                ".txt"
            ]


            file_name = (
                resume_file.name
            )


            extension = (
                "." +
                file_name.split(".")[-1].lower()
            )


            if extension not in allowed_extensions:

                return Response(
                    {
                        "error":
                            "Only PDF, DOCX and TXT files are supported."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # ------------------------------------------------
            # CREATE RECORD
            # ------------------------------------------------

            resume_analysis = (
                ResumeAnalysis.objects.create(

                    student=profile,

                    file=resume_file,

                    file_name=file_name

                )
            )


            # ------------------------------------------------
            # EXTRACT TEXT
            # ------------------------------------------------

            resume_text = (
                extract_resume_text(
                    resume_analysis.file.path
                )
            )


            if not resume_text.strip():

                return Response(
                    {
                        "error":
                            "Could not extract text from the uploaded resume."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # ------------------------------------------------
            # OLLAMA ANALYSIS
            # ------------------------------------------------

            result = analyze_resume(
                profile,
                resume_text
            )


            if result.get("error"):

                return Response(
                    result,
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )


            # ------------------------------------------------
            # SAVE RESULT
            # ------------------------------------------------

            resume_analysis.analyzed = True

            resume_analysis.analysis_result = (
                result
            )

            resume_analysis.save(
                update_fields=[
                    "analyzed",
                    "analysis_result"
                ]
            )


            # ------------------------------------------------
            # RESPONSE
            # ------------------------------------------------

            return Response(

                {
                    "id":
                        resume_analysis.id,

                    "file_name":
                        file_name,

                    "analysis":
                        result

                },

                status=status.HTTP_200_OK
            )


        except Exception as e:

            print("\n====================================")
            print("RESUME ANALYZER ERROR")
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