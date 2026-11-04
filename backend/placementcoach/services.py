import json
import ollama

from skills.models import StudentSkill
from interests.models import StudentInterest


MODEL_NAME = "qwen3:4b"


SYSTEM_PROMPT = """
You are an AI Placement Coach.

You create personalized placement preparation plans
for college students.

You MUST follow the requested JSON structure.

You must generate:

1. Placement tips
2. Priority areas
3. A month-by-month placement roadmap
4. DSA preparation
5. Aptitude preparation
6. Core Computer Science preparation
7. Career-domain technical preparation
8. Project preparation
9. Interview preparation
10. Final placement preparation

Use the student's actual skills, proficiency,
interests, learning level and career goal.

Do not simply repeat the student's profile.

IMPORTANT:
The response must contain a "roadmap" array.

Return JSON only.
Do not return markdown.
Do not return the student's profile as the answer.
"""


# ============================================================
# STUDENT INFORMATION
# ============================================================

def build_student_information(profile):

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
            "name": item.skill.name,
            "proficiency": item.proficiency
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
        career_goal = profile.career_goal.title


    return {

        "name": profile.full_name,

        "college": profile.college,

        "branch": profile.branch,

        "year": profile.year,

        "career_goal": career_goal,

        "career_domain": career_goal,

        "learning_level": profile.learning_level,

        "skills": skills,

        "interests": interests,

        "bio": profile.bio,

    }


# ============================================================
# GENERATE PLACEMENT COACH
# ============================================================

def generate_placement_coach(profile, duration):

    if not profile.career_goal:

        return {
            "error":
                "Please select a career goal first."
        }


    # --------------------------------------------------------
    # VALIDATE DURATION
    # --------------------------------------------------------

    try:

        months = int(duration)

    except (TypeError, ValueError):

        return {
            "error":
                "Invalid preparation duration."
        }


    if months < 1 or months > 12:

        return {
            "error":
                "Preparation duration must be between 1 and 12 months."
        }


    # --------------------------------------------------------
    # BUILD STUDENT DATA
    # --------------------------------------------------------

    student_information = (
        build_student_information(profile)
    )


    # --------------------------------------------------------
    # PROMPT
    # --------------------------------------------------------

    prompt = f"""
Create a personalized placement preparation roadmap.

STUDENT PROFILE:

{json.dumps(
    student_information,
    ensure_ascii=False,
    indent=2
)}


PREPARATION DURATION:

{months} months


TARGET CAREER:

{profile.career_goal.title}


IMPORTANT TASK:

Do NOT simply repeat the student profile.

Analyze the student's:

- Current skills
- Skill proficiency
- Interests
- Learning level
- Career goal

Then create a placement preparation plan.


============================================================
PLACEMENT AREAS
============================================================

The plan should consider:

1. DSA
2. Programming
3. Aptitude
4. Quantitative aptitude
5. Logical reasoning
6. Verbal ability
7. OOP
8. DBMS
9. SQL
10. Operating Systems
11. Computer Networks
12. Career-domain technical skills
13. Projects
14. Git and GitHub
15. Resume
16. Technical interviews
17. HR interviews
18. Communication
19. Mock interviews
20. Final revision


============================================================
PERSONALIZATION
============================================================

The student currently has these skills:

{json.dumps(
    student_information["skills"],
    ensure_ascii=False,
    indent=2
)}

The student is interested in:

{json.dumps(
    student_information["interests"],
    ensure_ascii=False,
    indent=2
)}

Career:

{profile.career_goal.title}

Learning level:

{profile.learning_level}


Use this information to decide what the student should
focus on.

Do not spend most of the roadmap teaching skills that
already have high proficiency.

Give more attention to weak or missing skills that are
important for the target career.


============================================================
TIMELINE
============================================================

Create EXACTLY {months} roadmap entries.

Each entry represents ONE MONTH.

Therefore:

1 month = 1 roadmap entry

2 months = 2 roadmap entries

3 months = 3 roadmap entries

...

9 months = 9 roadmap entries

12 months = 12 roadmap entries.


Each month should progressively move the student toward
placement readiness.


============================================================
MONTH CONTENT
============================================================

Every month MUST contain:

- month
- title
- goal
- focus_areas
- dsa
- aptitude
- core_cs
- technical_skills
- projects
- interview_preparation
- weekly_plan


The weekly_plan should contain approximately
2 to 4 weeks depending on the month.

Keep each task concise.


============================================================
PLACEMENT TIPS
============================================================

Generate 6 personalized placement tips.

They should be based on:

- career goal
- current skills
- proficiency
- interests
- learning level
- preparation duration


============================================================
PRIORITY AREAS
============================================================

Generate 4 to 6 priority areas.

Examples:

DSA
Aptitude
SQL
Machine Learning
Projects
Technical Interviews


============================================================
FINAL PREPARATION
============================================================

Generate 5 final placement preparation items.

Examples:

Resume preparation
Technical interview practice
Mock interviews
HR preparation
Final revision


============================================================
VERY IMPORTANT
============================================================

DO NOT return the student's profile as the answer.

DO NOT return:

{json.dumps(student_information, indent=2)}

as your response.

You must generate the placement plan.

Your response MUST contain:

"duration_months"

"career_domain"

"placement_readiness_summary"

"priority_areas"

"placement_tips"

"roadmap"

"final_preparation"


============================================================
RETURN EXACTLY THIS JSON STRUCTURE
============================================================

{{
    "duration_months": {months},

    "career_domain": "{profile.career_goal.title}",

    "placement_readiness_summary": "Personalized summary of the student's placement preparation.",

    "priority_areas": [
        {{
            "area": "DSA",
            "priority": "High",
            "reason": "Reason this area is important for the student."
        }}
    ],

    "placement_tips": [
        {{
            "title": "Tip title",
            "tip": "Practical placement advice.",
            "priority": "High"
        }}
    ],

    "roadmap": [
        {{
            "month": 1,
            "title": "Foundation Building",
            "goal": "Main goal for this month.",

            "focus_areas": [
                "DSA",
                "Aptitude",
                "Core CS"
            ],

            "dsa": [
                "Arrays",
                "Strings",
                "Hashing"
            ],

            "aptitude": [
                "Percentages",
                "Ratios",
                "Averages"
            ],

            "core_cs": [
                "OOP",
                "DBMS",
                "SQL"
            ],

            "technical_skills": [
                "Relevant career-domain skill"
            ],

            "projects": [
                "Practical project activity"
            ],

            "interview_preparation": [
                "Practice technical questions"
            ],

            "weekly_plan": [
                {{
                    "week": 1,
                    "focus": "Foundation",
                    "tasks": [
                        "Task 1",
                        "Task 2",
                        "Task 3"
                    ]
                }}
            ]
        }}
    ],

    "final_preparation": [
        "Resume preparation",
        "Technical interview preparation",
        "HR interview preparation",
        "Mock interviews",
        "Final revision"
    ]
}}

Remember:

Generate exactly {months} objects inside "roadmap".

Do not return the student profile.

Return JSON only.
"""


    # --------------------------------------------------------
    # OLLAMA
    # --------------------------------------------------------

    print("\n====================================")
    print("STARTING OLLAMA PLACEMENT GENERATION")
    print("====================================")

    print(
        "Career:",
        profile.career_goal.title
    )

    print(
        "Duration:",
        months,
        "months"
    )


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
            "num_predict": 5000
        }

    )


    # --------------------------------------------------------
    # GET RESPONSE
    # --------------------------------------------------------

    content = (
        response["message"]["content"]
    )


    print("\n====================================")
    print("OLLAMA PLACEMENT RESPONSE")
    print("====================================")

    print(content)

    print("====================================\n")


    # --------------------------------------------------------
    # PARSE JSON
    # --------------------------------------------------------

    try:

        result = json.loads(content)

    except json.JSONDecodeError:

        return {
            "error":
                "Ollama returned invalid JSON.",

            "raw_response":
                content
        }


    # --------------------------------------------------------
    # CHECK ROADMAP
    # --------------------------------------------------------

    roadmap = result.get(
        "roadmap"
    )


    if not isinstance(
        roadmap,
        list
    ):

        return {

            "error":
                "Ollama did not generate a valid roadmap.",

            "raw_response":
                result

        }


    # --------------------------------------------------------
    # CHECK ROADMAP LENGTH
    # --------------------------------------------------------

    if len(roadmap) < months:

        print(
            f"WARNING: Ollama generated "
            f"{len(roadmap)} months instead of "
            f"{months}."
        )


    # --------------------------------------------------------
    # FINAL DATA
    # --------------------------------------------------------

    result["duration_months"] = months

    result["career_domain"] = (
        profile.career_goal.title
    )


    if "placement_tips" not in result:

        result["placement_tips"] = []


    if "priority_areas" not in result:

        result["priority_areas"] = []


    if "final_preparation" not in result:

        result["final_preparation"] = []


    print(
        "FINAL ROADMAP LENGTH:",
        len(result["roadmap"])
    )


    return result