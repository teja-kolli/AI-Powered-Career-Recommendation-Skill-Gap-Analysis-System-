import json

from skills.models import StudentSkill
from interests.models import StudentInterest

from .retriever import retrieve_documents
from .generator import generate_rag_response


# =========================================================
# BUILD STUDENT INFORMATION
# =========================================================

def build_student_information(profile):

    # -----------------------------------------------------
    # Skills
    # -----------------------------------------------------

    student_skills = (
        StudentSkill.objects
        .filter(student=profile)
        .select_related("skill")
    )

    skills = []

    for student_skill in student_skills:

        skills.append({
            "name": student_skill.skill.name,
            "proficiency": student_skill.proficiency
        })


    # -----------------------------------------------------
    # Interests
    # -----------------------------------------------------

    student_interests = (
        StudentInterest.objects
        .filter(student=profile)
        .select_related("interest")
    )

    interests = []

    for student_interest in student_interests:

        interests.append(
            student_interest.interest.name
        )


    # -----------------------------------------------------
    # Career Goal
    # -----------------------------------------------------

    career_goal = ""

    if profile.career_goal:

        career_goal = profile.career_goal.title


    # -----------------------------------------------------
    # Student Information
    # -----------------------------------------------------

    student_information = {

        "name": profile.full_name,

        "college": profile.college,

        "branch": profile.branch,

        "year": profile.year,

        "career_goal": career_goal,

        "learning_level": profile.learning_level,

        "skills": skills,

        "interests": interests,

        "bio": profile.bio,

    }

    return student_information


# =========================================================
# BUILD RAG QUERY
# =========================================================

def build_rag_query(
    student_information,
    recommendation_type
):

    return f"""
Find {recommendation_type} resources specifically relevant
to this student's career goal, current skills, skill
proficiency, interests, and learning level.

Career Goal:
{student_information["career_goal"]}

Learning Level:
{student_information["learning_level"]}

Current Skills:
{json.dumps(
    student_information["skills"],
    indent=2
)}

Interests:
{json.dumps(
    student_information["interests"],
    indent=2
)}

Prioritize resources that help the student develop skills
relevant to the career goal.

Avoid resources that are unrelated to the student's
career goal.
"""


# =========================================================
# GENERIC RAG RECOMMENDATION
# =========================================================

def generate_personalized_rag(
    profile,
    category,
    recommendation_type,
    limit=5
):

    # -----------------------------------------------------
    # Career Goal Check
    # -----------------------------------------------------

    if not profile.career_goal:

        return {
            "error": (
                "Please select a career goal first."
            )
        }


    career_goal = (
        profile.career_goal.title
    )


    # -----------------------------------------------------
    # Student Information
    # -----------------------------------------------------

    student_information = (
        build_student_information(profile)
    )


    # -----------------------------------------------------
    # Search Query
    # -----------------------------------------------------

    query = build_rag_query(
        student_information,
        recommendation_type
    )


    # -----------------------------------------------------
    # Retrieve Documents
    # -----------------------------------------------------

    retrieved_documents = retrieve_documents(
        query=query,
        limit=limit,
        category=category,
        domain=career_goal
    )


    # -----------------------------------------------------
    # Generate Response
    # -----------------------------------------------------

    result = generate_rag_response(
        student_information=student_information,
        retrieved_documents=retrieved_documents,
        recommendation_type=recommendation_type
    )


    # -----------------------------------------------------
    # Final Response
    # -----------------------------------------------------

    return {

        "career_goal": career_goal,

        "learning_level": profile.learning_level,

        "student": student_information,

        "retrieved_documents": retrieved_documents,

        "result": result,

    }


# =========================================================
# ROADMAP
# =========================================================

def generate_personalized_roadmap(profile):

    if not profile.career_goal:
        return {
            "error": "Please select a career goal first."
        }

    career_goal = profile.career_goal.title

    student_information = build_student_information(profile)

    # Retrieve the roadmap directly from Supabase
    retrieved_documents = retrieve_documents(
        query=f"{career_goal} roadmap",
        limit=1,
        category="roadmap",
        domain=career_goal
    )

    if not retrieved_documents:
        return {
            "error": f"No roadmap found for {career_goal}."
        }

    document = retrieved_documents[0]

    metadata = document.get("metadata") or {}

    steps = metadata.get("steps", [])

    # If metadata does not contain steps,
    # fall back to the document content.
    if not steps:
        try:
            content = json.loads(
                document.get("content", "{}")
            )

            steps = content.get("steps", [])

        except (json.JSONDecodeError, TypeError):
            steps = []

    roadmap = []

    for step in steps:

        roadmap.append({
            "title": step.get("title", ""),
            "description": step.get("description", ""),
            "skills": step.get("skills", []),
            "level": step.get(
                "level",
                profile.learning_level
            ),
            "duration": step.get(
                "duration",
                ""
            )
        })

    return {
        "career_goal": career_goal,
        "learning_level": profile.learning_level,
        "student": student_information,
        "retrieved_documents": retrieved_documents,
        "result": {
            "roadmap": roadmap
        }
    }


# =========================================================
# COURSES
# =========================================================

def generate_personalized_courses(profile):

    if not profile.career_goal:
        return {
            "error": "Please select a career goal first."
        }

    career_goal = profile.career_goal.title

    student_information = build_student_information(
        profile
    )

    # =====================================================
    # RETRIEVE ALL COURSES FOR CAREER DOMAIN
    # =====================================================

    query = build_rag_query(
        student_information,
        "course"
    )

    retrieved_documents = retrieve_documents(
        query=query,
        limit=10,
        category="course",
        domain=career_goal
    )

    courses = []

    for document in retrieved_documents:

        metadata = document.get(
            "metadata"
        ) or {}

        course = {
            "title": metadata.get(
                "title",
                ""
            ),

            "description": metadata.get(
                "description",
                ""
            ),

            "platform": metadata.get(
                "provider",
                ""
            ),

            "provider": metadata.get(
                "provider",
                ""
            ),

            "instructor": metadata.get(
                "instructor",
                ""
            ),

            "difficulty": metadata.get(
                "level",
                "Beginner"
            ),

            "level": metadata.get(
                "level",
                "Beginner"
            ),

            "skill": (
                ", ".join(
                    metadata.get(
                        "skills",
                        []
                    )
                )
                if isinstance(
                    metadata.get(
                        "skills",
                        []
                    ),
                    list
                )
                else metadata.get(
                    "skills",
                    ""
                )
            ),

            "skills": metadata.get(
                "skills",
                []
            ),

            "duration": metadata.get(
                "duration",
                ""
            ),

            "url": metadata.get(
                "url",
                ""
            ),

            "rating": metadata.get(
                "rating",
                None
            ),

            "why_relevant": (
                f"Relevant to your "
                f"{career_goal} career goal "
                f"and current learning profile."
            )
        }

        courses.append(course)


    return {
        "career_goal": career_goal,
        "learning_level": profile.learning_level,
        "student": student_information,
        "retrieved_documents": retrieved_documents,
        "result": {
            "courses": courses
        }
    }


def generate_personalized_projects(profile):

    if not profile.career_goal:
        return {
            "error": "Please select a career goal first."
        }

    career_goal = profile.career_goal.title

    student_information = build_student_information(profile)

    # =====================================================
    # RETRIEVE PROJECTS FROM RAG
    # =====================================================

    query = build_rag_query(
        student_information,
        "project"
    )

    retrieved_documents = retrieve_documents(
        query=query,
        limit=6,
        category="project",
        domain=career_goal
    )

    projects = []

    for document in retrieved_documents:

        metadata = document.get("metadata") or {}

        project = {
            "title": metadata.get(
                "title",
                ""
            ),

            "description": metadata.get(
                "description",
                ""
            ),

            "skills": metadata.get(
                "skills",
                []
            ),

            "difficulty": metadata.get(
                "difficulty",
                "Intermediate"
            ),

            "why_relevant": (
                f"Relevant to your "
                f"{career_goal} career goal "
                f"and current skills."
            ),

            "suggested_learning_prerequisites":
                metadata.get(
                    "suggested_learning_prerequisites",
                    ""
                )
        }

        projects.append(project)

    return {
        "career_goal": career_goal,
        "learning_level": profile.learning_level,
        "student": student_information,
        "retrieved_documents": retrieved_documents,
        "result": {
            "projects": projects
        }
    }