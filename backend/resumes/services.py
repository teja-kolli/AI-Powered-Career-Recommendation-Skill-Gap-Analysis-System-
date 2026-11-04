import json
import os

import ollama

from PyPDF2 import PdfReader
from docx import Document

from skills.models import StudentSkill
from interests.models import StudentInterest


MODEL_NAME = "qwen3:4b"


SYSTEM_PROMPT = """
You are an AI Resume Analyzer for a personalized career platform.

Analyze a student's resume against their selected career goal.

You must evaluate:

1. ATS compatibility
2. Resume summary
3. Skills
4. Technical skills
5. Projects
6. Education
7. Experience
8. Missing skills
9. Weak areas
10. Keyword optimization
11. Formatting issues
12. Resume improvement suggestions
13. Career alignment

IMPORTANT RULES:

1. Use only information actually present in the resume.
2. Do not invent experience.
3. Do not invent projects.
4. Do not invent education.
5. Do not invent certifications.
6. Do not claim that a skill is present unless it appears in the resume.
7. Compare the resume with the student's selected career goal.
8. Consider the student's existing profile skills as additional context.
9. Do not modify the student's actual skill proficiency.
10. ATS score must be between 0 and 100.
11. Give practical improvement suggestions.
12. Identify missing keywords relevant to the target career.
13. Return valid JSON only.
14. Do not return markdown.
15. Do not return ```json.
"""


# ============================================================
# EXTRACT PDF
# ============================================================

def extract_pdf_text(file_path):

    reader = PdfReader(file_path)

    text = []

    for page in reader.pages:

        page_text = page.extract_text()

        if page_text:
            text.append(page_text)

    return "\n".join(text)


# ============================================================
# EXTRACT DOCX
# ============================================================

def extract_docx_text(file_path):

    document = Document(file_path)

    paragraphs = []

    for paragraph in document.paragraphs:

        if paragraph.text.strip():

            paragraphs.append(
                paragraph.text.strip()
            )

    return "\n".join(paragraphs)


# ============================================================
# EXTRACT TXT
# ============================================================

def extract_txt_text(file_path):

    with open(
        file_path,
        "r",
        encoding="utf-8",
        errors="ignore"
    ) as file:

        return file.read()


# ============================================================
# EXTRACT RESUME TEXT
# ============================================================

def extract_resume_text(file_path):

    extension = os.path.splitext(
        file_path
    )[1].lower()


    if extension == ".pdf":

        return extract_pdf_text(
            file_path
        )


    if extension == ".docx":

        return extract_docx_text(
            file_path
        )


    if extension == ".txt":

        return extract_txt_text(
            file_path
        )


    raise ValueError(
        "Unsupported file format. "
        "Please upload PDF, DOCX or TXT."
    )


# ============================================================
# BUILD STUDENT CONTEXT
# ============================================================

def build_student_context(profile):

    # --------------------------------------------------------
    # SKILLS
    # --------------------------------------------------------

    student_skills = (
        StudentSkill.objects
        .filter(student=profile)
        .select_related("skill")
    )

    skills = []

    for item in student_skills:

        skills.append({

            "name":
                item.skill.name,

            "proficiency":
                item.proficiency

        })


    # --------------------------------------------------------
    # INTERESTS
    # --------------------------------------------------------

    student_interests = (
        StudentInterest.objects
        .filter(student=profile)
        .select_related("interest")
    )

    interests = []

    for item in student_interests:

        interests.append(
            item.interest.name
        )


    # --------------------------------------------------------
    # CAREER
    # --------------------------------------------------------

    career_goal = ""

    if profile.career_goal:

        career_goal = (
            profile.career_goal.title
        )


    return {

        "career_goal":
            career_goal,

        "learning_level":
            profile.learning_level,

        "skills":
            skills,

        "interests":
            interests,

        "branch":
            profile.branch,

        "year":
            profile.year,

        "college":
            profile.college

    }


# ============================================================
# ANALYZE RESUME
# ============================================================

def analyze_resume(
    profile,
    resume_text
):

    if not profile.career_goal:

        return {

            "error":
                "Please select a career goal first."

        }


    if not resume_text.strip():

        return {

            "error":
                "Unable to extract text from the resume."

        }


    student_context = (
        build_student_context(
            profile
        )
    )


    # --------------------------------------------------------
    # JSON STRUCTURE
    # --------------------------------------------------------

    output_structure = {

        "ats_score": 0,

        "career_goal":
            profile.career_goal.title,

        "overall_summary":
            "Short summary of the resume and its alignment with the target career.",

        "career_alignment":
            "Explain how well the resume aligns with the target career.",

        "detected_skills": [

            {
                "skill": "Python",
                "evidence": "Mentioned in the resume."
            }

        ],

        "strong_areas": [

            {
                "area": "Projects",
                "explanation":
                    "Why this is a strength."
            }

        ],

        "missing_skills": [

            {
                "skill": "Machine Learning",
                "importance": "High",
                "reason":
                    "Why this skill would strengthen the resume."
            }

        ],

        "keyword_suggestions": [

            "Machine Learning",
            "PyTorch",
            "Scikit-learn"
        ],

        "resume_sections": {

            "contact_information":
                "Good",

            "summary":
                "Needs improvement",

            "skills":
                "Good",

            "projects":
                "Good",

            "education":
                "Good",

            "experience":
                "Needs improvement",

            "certifications":
                "Good"

        },

        "formatting_issues": [

            "Keep resume to one page if possible.",

            "Use consistent bullet formatting."

        ],

        "content_issues": [

            "Add measurable results to project descriptions."

        ],

        "improvement_suggestions": [

            {
                "priority": "High",

                "area": "Projects",

                "suggestion":
                    "Add measurable outcomes and technologies used."
            }

        ],

        "recommended_resume_structure": [

            "Contact Information",

            "Professional Summary",

            "Technical Skills",

            "Projects",

            "Experience",

            "Education",

            "Certifications"

        ]

    }


    output_format = json.dumps(
        output_structure,
        indent=4
    )


    # --------------------------------------------------------
    # PROMPT
    # --------------------------------------------------------

    prompt = f"""
Analyze the following resume.

============================================================
TARGET CAREER
============================================================

{profile.career_goal.title}


============================================================
STUDENT PROFILE
============================================================

{json.dumps(
    student_context,
    ensure_ascii=False,
    indent=2
)}


============================================================
RESUME TEXT
============================================================

{resume_text}


============================================================
ANALYSIS TASK
============================================================

Analyze the resume for the target career:

{profile.career_goal.title}


Evaluate:

1. ATS compatibility
2. Career alignment
3. Technical skills
4. Projects
5. Education
6. Experience
7. Certifications
8. Resume structure
9. Missing career-relevant skills
10. Missing keywords
11. Formatting problems
12. Content problems
13. Areas that are already strong
14. Specific improvements


============================================================
ATS SCORE
============================================================

Give an ATS score from 0 to 100.

Consider:

- Relevant keywords
- Skills
- Career alignment
- Section structure
- Readability
- Project relevance
- Experience relevance
- Education
- Resume formatting


============================================================
IMPORTANT
============================================================

Do not invent information.

Only identify a skill if:

1. It appears in the resume, OR
2. It is explicitly provided in the student's profile.

When recommending missing skills, clearly identify them
as missing rather than pretending the student already has them.


============================================================
RETURN FORMAT
============================================================

Return JSON exactly following this structure:

{output_format}


Return JSON only.
"""


    # --------------------------------------------------------
    # OLLAMA
    # --------------------------------------------------------

    print("\n====================================")
    print("STARTING RESUME ANALYSIS")
    print("====================================")


    response = ollama.chat(

        model=MODEL_NAME,

        messages=[

            {
                "role":
                    "system",

                "content":
                    SYSTEM_PROMPT
            },

            {
                "role":
                    "user",

                "content":
                    prompt
            }

        ],

        format="json",

        think=False,

        options={

            "temperature":
                0.2,

            "num_predict":
                2500

        }

    )


    content = (
        response["message"]["content"]
    )


    print("\n====================================")
    print("OLLAMA RESUME RESPONSE")
    print("====================================")

    print(content)

    print("====================================\n")


    # --------------------------------------------------------
    # PARSE
    # --------------------------------------------------------

    try:

        result = json.loads(
            content
        )

    except json.JSONDecodeError:

        return {

            "error":
                "Ollama returned invalid JSON.",

            "raw_response":
                content

        }


    # --------------------------------------------------------
    # VALIDATE ATS SCORE
    # --------------------------------------------------------

    try:

        result["ats_score"] = float(
            result.get(
                "ats_score",
                0
            )
        )

    except (
        TypeError,
        ValueError
    ):

        result["ats_score"] = 0


    result["ats_score"] = max(
        0,
        min(
            100,
            result["ats_score"]
        )
    )


    return result