import json
import ollama

from skills.models import StudentSkill
from interests.models import StudentInterest
from courses.models import Course
from projects.models import Project
from certifications.models import StudentCertificate


MODEL_NAME = "qwen3:4b"


SYSTEM_PROMPT = """
You are an AI Career Recommendation Assistant.

Your job is to analyze a student's actual profile and
generate personalized career recommendations.

IMPORTANT RULES:

1. Use the student's actual information.
2. Do not invent skills that the student has.
3. Do not invent courses.
4. Do not invent projects.
5. Do not invent certifications.
6. Only recommend courses and projects that exist in the provided data.
7. Consider the student's career goal.
8. Consider current skill proficiency.
9. Consider interests.
10. Consider learning level.
11. Prioritize resources that help close skill gaps.
12. Do not recommend certificates that the student already has.
13. Keep recommendations practical.
14. Return valid JSON only.
15. Do not return markdown.
16. Do not return ```json.
"""


# ============================================================
# BUILD STUDENT INFORMATION
# ============================================================

def build_student_information(profile):

    student_skills = (
        StudentSkill.objects
        .filter(student=profile)
        .select_related("skill")
    )

    skills = []

    for item in student_skills:

        skills.append({
            "name": item.skill.name,
            "proficiency": item.proficiency
        })


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


    # Student's existing certificates

    certificates = (
        StudentCertificate.objects
        .filter(student=profile)
    )

    completed_certificates = []

    for certificate in certificates:

        if certificate.name:

            completed_certificates.append(
                certificate.name
            )


    career_goal = ""

    if profile.career_goal:

        career_goal = profile.career_goal.title


    return {

        "name": profile.full_name,

        "college": profile.college,

        "branch": profile.branch,

        "year": profile.year,

        "career_goal": career_goal,

        "learning_level": profile.learning_level,

        "skills": skills,

        "interests": interests,

        "certificates": completed_certificates,

        "bio": profile.bio,

    }


# ============================================================
# AVAILABLE COURSES
# ============================================================

def get_available_courses():

    courses = Course.objects.all()

    resources = []

    for course in courses:

        resources.append({

            "id": course.id,

            "title": course.title,

            "description": course.description,

            "platform": course.platform,

            "instructor": course.instructor,

            "difficulty": course.difficulty,

            "duration": course.duration,

            "skill": (
                course.skill.name
                if course.skill
                else ""
            ),

            "url": course.url,

            "rating": (
                float(course.rating)
                if course.rating is not None
                else None
            ),

        })

    return resources


# ============================================================
# AVAILABLE PROJECTS
# ============================================================

def get_available_projects():

    projects = (
        Project.objects
        .prefetch_related("skills")
        .all()
    )

    resources = []

    for project in projects:

        project_skills = [
            skill.name
            for skill in project.skills.all()
        ]

        resources.append({

            "id": project.id,

            "title": project.title,

            "description": project.description,

            "difficulty": project.difficulty,

            "skills": project_skills,

            "github_url": project.github_url,

            "demo_url": project.demo_url,

            "estimated_duration":
                project.estimated_duration,

        })

    return resources


# ============================================================
# GENERATE RECOMMENDATIONS
# ============================================================

def generate_recommendations(profile):

    if not profile.career_goal:

        return {
            "error":
                "Please select a career goal first."
        }


    # --------------------------------------------------------
    # STUDENT DATA
    # --------------------------------------------------------

    student_information = (
        build_student_information(profile)
    )


    # --------------------------------------------------------
    # AVAILABLE RESOURCES
    # --------------------------------------------------------

    available_courses = (
        get_available_courses()
    )

    available_projects = (
        get_available_projects()
    )


    # --------------------------------------------------------
    # JSON OUTPUT STRUCTURE
    # --------------------------------------------------------

    output_structure = {

        "career_goal": profile.career_goal.title,

        "summary":
            "Short personalized explanation of what the student should focus on next.",

        "recommended_skills": [

            {
                "skill": "Machine Learning",

                "reason":
                    "Why this skill is important for the student's career and current skill profile.",

                "priority": "High"
            }

        ],

        "recommended_courses": [

            {
                "id": 1,

                "title":
                    "Exact course title from available courses",

                "reason":
                    "Why this course is relevant.",

                "priority": "High"
            }

        ],

        "recommended_projects": [

            {
                "id": 1,

                "title":
                    "Exact project title from available projects",

                "reason":
                    "Why this project is useful.",

                "priority": "High"
            }

        ],

        "next_actions": [

            {
                "step": 1,

                "action":
                    "Specific action the student should take next."
            }

        ]

    }


    # Convert the structure to JSON text.
    # This avoids f-string curly-brace problems.

    output_format = json.dumps(
        output_structure,
        indent=4
    )


    # --------------------------------------------------------
    # PROMPT
    # --------------------------------------------------------

    prompt = f"""
Analyze this student's career profile and generate
personalized recommendations.

STUDENT INFORMATION:

{json.dumps(
    student_information,
    ensure_ascii=False,
    indent=2
)}


AVAILABLE COURSES:

{json.dumps(
    available_courses,
    ensure_ascii=False,
    indent=2
)}


AVAILABLE PROJECTS:

{json.dumps(
    available_projects,
    ensure_ascii=False,
    indent=2
)}


TARGET CAREER:

{profile.career_goal.title}


TASK:

Generate personalized recommendations for this student.

Focus on:

1. Skills the student should learn next.
2. Courses that match the student's career goal.
3. Projects that help improve missing or weak skills.
4. The student's existing certificates.
5. Practical next actions for career preparation.


RETURN JSON USING THIS STRUCTURE:

{output_format}


IMPORTANT RULES:

1. Use exact course IDs from AVAILABLE COURSES.
2. Use exact project IDs from AVAILABLE PROJECTS.
3. Never create fake IDs.
4. Never create a course that is not present.
5. Never create a project that is not present.
6. Recommend 3 to 5 skills.
7. Recommend 3 to 5 courses.
8. Recommend 2 to 4 projects.
9. Recommend 3 to 5 next actions.
10. Do not recommend certifications because there is no
    certification catalog in the provided database.
11. The student's uploaded certificates are existing
    certificates, not recommendations.
12. Consider current skill proficiency.
13. Consider interests.
14. Consider learning level.
15. Prioritize skills important for the target career.
16. Prefer courses and projects that improve weak skills.
17. Keep reasons concise.
18. Return JSON only.
"""


    # --------------------------------------------------------
    # OLLAMA
    # --------------------------------------------------------

    response = ollama.chat(

        model=MODEL_NAME,

        messages=[

            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },

            {
                "role": "user",
                "content": prompt
            }

        ],

        format="json",

        think=False,

        options={

            "temperature": 0.2,

            "num_predict": 1600

        }

    )


    # --------------------------------------------------------
    # PARSE RESPONSE
    # --------------------------------------------------------

    content = (
        response["message"]["content"]
    )


    try:

        result = json.loads(content)

    except json.JSONDecodeError:

        return {

            "error":
                "Ollama returned invalid JSON.",

            "raw_response":
                content

        }


    return result