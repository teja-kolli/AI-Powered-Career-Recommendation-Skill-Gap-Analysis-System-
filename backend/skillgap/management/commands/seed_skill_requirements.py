from django.core.management.base import BaseCommand

from careers.models import CareerGoal
from skills.models import Skill

from skillgap.models import CareerRequiredSkill


REQUIREMENTS = {

    "AI/ML Engineer": [

        ("Python", 90, 70),
        ("NumPy", 70, 60),
        ("Pandas", 70, 60),
        ("SQL", 60, 60),
        ("Machine Learning", 90, 70),
        ("Scikit-learn", 80, 60),
        ("Deep Learning", 90, 70),
        ("PyTorch", 85, 60),
        ("Computer Vision", 70, 50),
        ("NLP", 70, 50),
        ("Generative AI", 80, 60),

    ],


    "Data Scientist": [

        ("Python", 90, 70),
        ("NumPy", 70, 60),
        ("Pandas", 90, 70),
        ("SQL", 90, 70),
        ("Statistics", 90, 70),
        ("Machine Learning", 90, 70),
        ("Scikit-learn", 80, 60),
        ("Data Visualization", 70, 60),
        ("Deep Learning", 60, 50),
        ("Generative AI", 60, 50),

    ],


    "Web Developer": [

        ("HTML", 80, 70),
        ("CSS", 80, 70),
        ("JavaScript", 90, 70),
        ("React", 85, 60),
        ("Git", 70, 60),
        ("Django", 70, 60),
        ("REST API", 70, 60),
        ("SQL", 70, 60),

    ],


    "Software Developer": [

        ("Java", 80, 70),
        ("Python", 70, 60),
        ("C++", 70, 60),
        ("Data Structures", 95, 70),
        ("Algorithms", 95, 70),
        ("OOP", 90, 70),
        ("SQL", 70, 60),
        ("Computer Networks", 60, 50),
        ("Operating Systems", 70, 60),

    ],


    "Cloud Engineer": [

        ("Linux", 90, 70),
        ("Networking", 90, 70),
        ("Cloud Computing", 90, 70),
        ("AWS", 90, 60),
        ("Azure", 70, 50),
        ("Docker", 80, 60),
        ("Kubernetes", 80, 60),
        ("Terraform", 75, 50),

    ],


    "DevOps Engineer": [

        ("Linux", 90, 70),
        ("Git", 90, 70),
        ("Networking", 80, 60),
        ("Python", 70, 60),
        ("Bash", 80, 60),
        ("Docker", 90, 70),
        ("Kubernetes", 90, 60),
        ("Jenkins", 70, 50),
        ("CI/CD", 90, 60),
        ("Terraform", 80, 50),

    ],
}


class Command(BaseCommand):

    help = (
        "Seed career required skills "
        "for Skill Gap Analysis"
    )


    def handle(
        self,
        *args,
        **options
    ):

        created_count = 0


        for career_name, requirements in REQUIREMENTS.items():

            try:

                career_goal = CareerGoal.objects.get(
                    title=career_name
                )

            except CareerGoal.DoesNotExist:

                self.stdout.write(
                    self.style.WARNING(
                        f"Career not found: "
                        f"{career_name}"
                    )
                )

                continue


            for (
                skill_name,
                importance,
                minimum_proficiency
            ) in requirements:


                skill, created = Skill.objects.get_or_create(
                    name=skill_name,
                    defaults={
                        "category": "Other"
                    }
                )


                if created:
                    self.stdout.write(
                        f"Created skill: {skill_name}"
                    )


                requirement, was_created = (
                    CareerRequiredSkill.objects.update_or_create(

                        career_goal=career_goal,

                        skill=skill,

                        defaults={
                            "importance": importance,
                            "minimum_proficiency":
                                minimum_proficiency
                        }
                    )
                )


                if was_created:
                    created_count += 1


        self.stdout.write(
            self.style.SUCCESS(
                f"Skill requirements seeded: "
                f"{created_count}"
            )
        )