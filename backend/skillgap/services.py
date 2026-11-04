import json
import ollama

from skills.models import StudentSkill
from interests.models import StudentInterest


MODEL_NAME = "qwen3:4b"


SYSTEM_PROMPT = """
You are an AI Skill Gap Analyzer for a career recommendation platform.

Your job is to analyze a student's current skills against
the skills normally expected for their selected career goal.

Use the student's actual profile information.

IMPORTANT RULES:

1. Never change the student's current proficiency values.
2. Use the student's career goal as the target career.
3. Identify important skills normally needed for that career.
4. Compare the student's current skills with those skills.
5. Identify strong skills.
6. Identify developing skills.
7. Identify missing skills.
8. Identify the most important skills the student should learn next.
9. Consider the student's learning level.
10. Consider the student's interests when explaining recommendations.
11. Do not invent information about the student.
12. Keep the recommendations practical.
13. Return valid JSON only.
14. Do not return markdown.
15. Do not return ```json.
16. Do not explain your reasoning outside the JSON.
"""


def build_student_data(profile):

    # =====================================================
    # CURRENT SKILLS
    # =====================================================

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


    # =====================================================
    # INTERESTS
    # =====================================================

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


    # =====================================================
    # CAREER GOAL
    # =====================================================

    career_goal = ""

    if profile.career_goal:

        career_goal = (
            profile.career_goal.title
        )


    # =====================================================
    # STUDENT DATA
    # =====================================================

    return {

        "name": profile.full_name,

        "college": profile.college,

        "branch": profile.branch,

        "year": profile.year,

        "career_goal": career_goal,

        "learning_level":
            profile.learning_level,

        "skills": skills,

        "interests": interests,

        "bio": profile.bio,
    }


def generate_skill_gap(profile):

    # =====================================================
    # CAREER GOAL CHECK
    # =====================================================

    if not profile.career_goal:

        return {
            "error":
            "Please select a career goal first."
        }


    # =====================================================
    # BUILD STUDENT DATA
    # =====================================================

    student_data = build_student_data(
        profile
    )


    # =====================================================
    # PROMPT
    # =====================================================

    prompt = f"""
Analyze the following student's skill gap.

STUDENT INFORMATION:

{json.dumps(
    student_data,
    ensure_ascii=False,
    indent=2
)}


TASK:

Analyze the student for the target career:

{profile.career_goal.title}


Return EXACTLY this JSON structure:

{{
    "career_goal": "{profile.career_goal.title}",

    "overall_coverage": 0,

    "summary": "Short personalized explanation of the student's current skill position.",

    "strong_skills": [
        {{
            "skill": "Python",
            "current_proficiency": 75,
            "required_proficiency": 70,
            "gap": 0,
            "status": "Strong",
            "explanation": "Why this is a strength."
        }}
    ],

    "developing_skills": [
        {{
            "skill": "SQL",
            "current_proficiency": 40,
            "required_proficiency": 70,
            "gap": 30,
            "status": "Developing",
            "explanation": "What needs improvement."
        }}
    ],

    "missing_skills": [
        {{
            "skill": "PyTorch",
            "current_proficiency": 0,
            "required_proficiency": 70,
            "gap": 70,
            "status": "Missing",
            "explanation": "Why this skill matters for the career."
        }}
    ],

    "priority_skills": [
        {{
            "skill": "Machine Learning",
            "priority": "High",
            "reason": "Why the student should learn this next."
        }}
    ],

    "learning_plan": [
        {{
            "step": 1,
            "skill": "Machine Learning",
            "action": "Learn supervised and unsupervised learning fundamentals."
        }},
        {{
            "step": 2,
            "skill": "Scikit-learn",
            "action": "Build practical machine learning models."
        }}
    ]
}}


RULES FOR THE JSON:

1. overall_coverage must be a number from 0 to 100.

2. Calculate overall coverage based on how well the student's
   current skills match the skills needed for the target career.

3. Strong skills:
   Current proficiency meets or exceeds the estimated
   career requirement.

4. Developing skills:
   Student already has the skill but proficiency is below
   the estimated career requirement.

5. Missing skills:
   Student does not currently have the skill.

6. Do not put a skill in both strong_skills and missing_skills.

7. Do not change the student's actual proficiency.

8. required_proficiency should represent the approximate
   proficiency needed for the target career.

9. gap =
   required_proficiency - current_proficiency.

10. Never make gap negative.

11. priority_skills should focus on the most important
    missing or weak skills.

12. learning_plan should contain practical learning steps.

13. Consider the student's learning level.

14. Consider the student's interests.

15. Keep the response concise.

16. Return JSON only.
"""


    # =====================================================
    # OLLAMA
    # =====================================================

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

            "num_predict": 1800

        }

    )


    # =====================================================
    # GET CONTENT
    # =====================================================

    content = (
        response["message"]["content"]
    )


    # =====================================================
    # PARSE JSON
    # =====================================================

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


    # =====================================================
    # ADD STUDENT INFORMATION
    # =====================================================

    result["student"] = {

        "name":
            profile.full_name,

        "learning_level":
            profile.learning_level,

        "skills":
            student_data["skills"],

        "interests":
            student_data["interests"]
    }


    return result