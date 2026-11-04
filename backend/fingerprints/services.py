import json

import ollama

from skills.models import StudentSkill
from interests.models import StudentInterest

from .models import CareerFingerprint


MODEL_NAME = "qwen3:4b"


SYSTEM_PROMPT = """
You are an AI Career Taste Fingerprint Generator.

Your job is to create a personalized career fingerprint
for a college student.

The fingerprint represents:

- career interests
- current technical skills
- skill proficiency
- career goal
- learning level
- technology preferences
- strengths
- development areas
- suitable career paths
- learning preferences
- career characteristics

IMPORTANT RULES:

1. Use the student's actual information.
2. Never invent a skill the student does not have.
3. Never invent education information.
4. Never invent work experience.
5. Do not change the student's actual skill proficiency.
6. Use the selected career goal as the primary career direction.
7. Consider the student's interests.
8. Consider the student's learning level.
9. Identify strengths from the actual profile.
10. Identify development areas from the actual profile.
11. Explain the student's career profile clearly.
12. Keep the output personalized.
13. Return valid JSON only.
14. Do not return markdown.
15. Do not return ```json.
"""


# ============================================================
# BUILD STUDENT DATA
# ============================================================

def build_student_data(profile):

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

            "category":
                item.skill.category,

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
    # CAREER GOAL
    # --------------------------------------------------------

    career_goal = ""

    if profile.career_goal:

        career_goal = (
            profile.career_goal.title
        )


    # --------------------------------------------------------
    # STUDENT DATA
    # --------------------------------------------------------

    return {

        "name":
            profile.full_name,

        "college":
            profile.college,

        "branch":
            profile.branch,

        "year":
            profile.year,

        "career_goal":
            career_goal,

        "learning_level":
            profile.learning_level,

        "skills":
            skills,

        "interests":
            interests,

        "bio":
            profile.bio,

    }


# ============================================================
# GENERATE FINGERPRINT
# ============================================================

def generate_fingerprint(profile):

    if not profile.career_goal:

        return {

            "error":
                "Please select a career goal first."

        }


    student_data = (
        build_student_data(profile)
    )


    # --------------------------------------------------------
    # JSON STRUCTURE
    #
    # Using json.dumps avoids the f-string brace problem
    # you encountered earlier.
    # --------------------------------------------------------

    output_structure = {

        "career_goal":
            profile.career_goal.title,

        "career_score":
            0,

        "career_identity": {

            "primary_domain":
                profile.career_goal.title,

            "career_direction":
                "Description of the student's career direction.",

            "career_orientation":
                "Description of the student's career orientation."

        },

        "interest_profile": {

            "primary_interests": [],

            "interest_themes": [],

            "technology_interests": [],

            "interest_summary":
                "Summary of the student's interests."

        },

        "skill_profile": {

            "strong_skills": [],

            "developing_skills": [],

            "skill_categories": [],

            "technology_affinity": [],

            "skill_summary":
                "Summary of the student's current skills."

        },

        "strengths": [

            {
                "strength":
                    "Example strength",

                "evidence":
                    "Evidence from the student's profile."

            }

        ],

        "development_areas": [

            {
                "area":
                    "Example development area",

                "reason":
                    "Why this area needs development."

            }

        ],

        "learning_profile": {

            "learning_level":
                profile.learning_level,

            "learning_style":
                "Description of the student's likely learning approach.",

            "recommended_learning_approach":
                "Personalized learning approach."

        },

        "career_characteristics": [

            "Technology-oriented",

            "Problem-solving",

            "Continuous learning"

        ],

        "suitable_career_paths": [

            {
                "career":
                    profile.career_goal.title,

                "reason":
                    "Why this career matches the student.",

                "alignment":
                    "High"

            }

        ],

        "career_fit": {

            "why_this_career":
                "Why the target career matches the student's profile.",

            "important_next_skills": [],

            "career_growth_direction":
                "Potential direction for development."

        },

        "ai_summary":
            "Personalized career taste summary."

    }


    output_structure_text = json.dumps(
        output_structure,
        ensure_ascii=False,
        indent=2
    )


    # --------------------------------------------------------
    # PROMPT
    # --------------------------------------------------------

    prompt = f"""
Create a Career Taste Fingerprint for this student.

============================================================
STUDENT INFORMATION
============================================================

{json.dumps(
    student_data,
    ensure_ascii=False,
    indent=2
)}


============================================================
TARGET CAREER
============================================================

{profile.career_goal.title}


============================================================
TASK
============================================================

Analyze the student's profile and create a personalized
Career Taste Fingerprint.

The fingerprint should explain:

1. What type of career the student is interested in.
2. Which technologies they prefer.
3. Their current skill profile.
4. Their strongest skills.
5. Skills that are developing.
6. Areas that need improvement.
7. Their learning characteristics.
8. Their career orientation.
9. Suitable career paths related to their goal.
10. Why the selected career matches their profile.
11. What skills they should develop next.


============================================================
SKILL ANALYSIS
============================================================

The student's actual skills are:

{json.dumps(
    student_data["skills"],
    ensure_ascii=False,
    indent=2
)}

Do not change these proficiency values.

Use:

70-100 = Strong

40-69 = Developing

0-39 = Early / Needs Development


============================================================
INTEREST ANALYSIS
============================================================

The student's interests are:

{json.dumps(
    student_data["interests"],
    ensure_ascii=False,
    indent=2
)}


============================================================
CAREER SCORE
============================================================

Generate a career alignment score between 0 and 100.

The score should reflect alignment between:

- career goal
- current skills
- skill proficiency
- interests
- learning level

Do not treat this as a prediction of employment or hiring.
It is only a profile-alignment indicator.


============================================================
IMPORTANT
============================================================

Do not invent student information.

If information is not available, do not claim that
the student has it.

Development areas can be recommendations, but clearly
identify them as areas to develop.

Do not put a missing skill into the student's current
skill list.


============================================================
RETURN JSON
============================================================

Return exactly this structure:

{output_structure_text}

Return JSON only.
"""


    # --------------------------------------------------------
    # OLLAMA
    # --------------------------------------------------------

    print("\n====================================")
    print("STARTING CAREER FINGERPRINT")
    print("====================================")

    print(
        "Student:",
        profile.full_name
    )

    print(
        "Career:",
        profile.career_goal.title
    )


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
                3000

        }

    )


    content = (
        response["message"]["content"]
    )


    print("\n====================================")
    print("OLLAMA FINGERPRINT RESPONSE")
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
    # CAREER SCORE
    # --------------------------------------------------------

    try:

        career_score = float(
            result.get(
                "career_score",
                0
            )
        )

    except (
        TypeError,
        ValueError
    ):

        career_score = 0


    career_score = max(
        0,
        min(
            100,
            career_score
        )
    )


    result["career_score"] = (
        career_score
    )


    # --------------------------------------------------------
    # SAVE DATABASE RECORD
    # --------------------------------------------------------

    fingerprint, created = (
        CareerFingerprint.objects.update_or_create(

            student=profile,

            defaults={

                "career_goal":
                    profile.career_goal.title,

                "career_score":
                    career_score,

                "summary":
                    result.get(
                        "ai_summary",
                        ""
                    ),

                "interests":
                    student_data[
                        "interests"
                    ],

                "skills":
                    student_data[
                        "skills"
                    ],

                "strengths":
                    result.get(
                        "strengths",
                        []
                    ),

                "skill_gaps":
                    result.get(
                        "development_areas",
                        []
                    ),

                "learning_progress":
                    result.get(
                        "learning_profile",
                        {}
                    ),

                "fingerprint_data":
                    result

            }

        )
    )


    # --------------------------------------------------------
    # RETURN
    # --------------------------------------------------------

    result["id"] = (
        fingerprint.id
    )

    result["generated_at"] = (
        fingerprint.generated_at
    )


    return result