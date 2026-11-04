import json
import ollama


MODEL_NAME = "qwen3:4b"


SYSTEM_PROMPT = """
You are an AI Career Advisor.

Generate personalized career recommendations using:
- the student's profile
- current skills
- skill proficiency
- interests
- learning level
- retrieved knowledge

IMPORTANT:
- Use retrieved knowledge only.
- Do not invent resources.
- Do not invent URLs.
- Do not invent courses.
- Do not invent projects.
- Do not invent certifications.
- Return valid JSON only.
- Keep the response concise.
- Do not explain your reasoning.
"""


def generate_rag_response(
    student_information,
    retrieved_documents,
    recommendation_type
):

    # =====================================================
    # BUILD COMPACT CONTEXT
    # =====================================================

    context_parts = []

    for index, doc in enumerate(
        retrieved_documents,
        start=1
    ):

        context_parts.append(
            f"""
DOCUMENT {index}

Category:
{doc.get("category", "")}

Domain:
{doc.get("domain", "")}

Content:
{doc.get("content", "")}
"""
        )

    context = "\n".join(context_parts)


    # =====================================================
    # ROADMAP
    # =====================================================

    if recommendation_type == "roadmap":

        task = """
Create a personalized learning roadmap.

Return EXACTLY this JSON:

{
    "roadmap": [
        {
            "title": "Topic",
            "description": "What the student should learn",
            "skills": ["skill 1", "skill 2"],
            "level": "Beginner",
            "duration": "Estimated duration"
        }
    ]
}

Rules:

1. Use the retrieved roadmap.
2. Preserve its logical order.
3. Consider the student's current skills.
4. Consider skill proficiency.
5. Consider learning level.
6. Do not add unrelated topics.
7. Do not include courses.
8. Do not include projects.
9. Do not include certifications.
10. Do not include URLs.
11. Return only JSON.
12. Do not explain the answer.
"""


    # =====================================================
    # COURSES
    # =====================================================

    elif recommendation_type == "course":

        task = """
Create personalized course recommendations.

Return EXACTLY this JSON:

{
    "courses": [
        {
            "title": "Course title",
            "description": "Course description",
            "platform": "Platform",
            "difficulty": "Beginner",
            "skill": "Skill",
            "url": "Course URL",
            "why_relevant": "Why this course is relevant"
        }
    ]
}

Rules:

1. Only recommend retrieved courses.
2. Do not invent course names.
3. Do not invent URLs.
4. Consider career goal.
5. Consider skills.
6. Consider proficiency.
7. Consider learning level.
8. Return only JSON.
"""


    # =====================================================
    # PROJECTS
    # =====================================================

    elif recommendation_type == "project":

        task = """
Create personalized project recommendations.

Return EXACTLY this JSON:

{
    "projects": [
        {
            "title": "Project title",
            "description": "Project description",
            "skills": ["skill 1", "skill 2"],
            "difficulty": "Intermediate",
            "why_relevant": "Why this project is relevant",
            "suggested_learning_prerequisites": "Prerequisites"
        }
    ]
}

Rules:

1. Only recommend retrieved projects.
2. Do not invent projects.
3. Consider career goal.
4. Consider current skills.
5. Consider proficiency.
6. Consider learning level.
7. Return only JSON.
"""


    else:

        task = """
Create personalized recommendations
using only the retrieved knowledge.

Return valid JSON only.
"""


    # =====================================================
    # FINAL PROMPT
    # =====================================================

    prompt = f"""
/no_think

STUDENT:

{json.dumps(
    student_information,
    ensure_ascii=False
)}

RETRIEVED KNOWLEDGE:

{context}

TASK:

{task}

Return JSON only.
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
            "num_predict": 1200
        }
    )


    # =====================================================
    # PARSE RESPONSE
    # =====================================================

    content = response["message"]["content"]

    try:

        return json.loads(content)

    except json.JSONDecodeError:

        return {
            "raw_response": content,
            "warning": "The LLM returned non-JSON output."
        }