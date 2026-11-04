import json
from pathlib import Path

from django.core.management.base import BaseCommand

from rag.embeddings import create_embedding
from rag.retriever import supabase


class Command(BaseCommand):

    help = (
        "Generate embeddings from RAG JSON files "
        "and store them in Supabase pgvector"
    )


    def handle(self, *args, **options):

        self.stdout.write(
            self.style.SUCCESS(
                "Starting RAG ingestion..."
            )
        )


        # =====================================================
        # DATA DIRECTORY
        # =====================================================

        data_dir = (
            Path(__file__).resolve()
            .parent.parent.parent
            / "data"
        )


        # =====================================================
        # RAG FILES
        # =====================================================

        files = [
            ("roadmaps.json", "roadmap"),
            ("courses.json", "course"),
            ("projects.json", "project"),
        ]


        total_documents = 0


        # =====================================================
        # PROCESS FILES
        # =====================================================

        for filename, category in files:

            file_path = data_dir / filename


            if not file_path.exists():

                self.stdout.write(
                    self.style.WARNING(
                        f"File not found: {file_path}"
                    )
                )

                continue


            self.stdout.write(
                f"\nProcessing {filename}..."
            )


            # =================================================
            # LOAD JSON
            # =================================================

            with open(
                file_path,
                "r",
                encoding="utf-8"
            ) as file:

                data = json.load(file)


            # =================================================
            # DELETE OLD DOCUMENTS
            # =================================================

            supabase.table(
                "rag_documents"
            ).delete().eq(
                "category",
                category
            ).execute()


            self.stdout.write(
                self.style.WARNING(
                    f"Cleared old {category} documents."
                )
            )


            # =================================================
            # ROADMAP
            # =================================================

            if category == "roadmap":

                roadmaps = data.get(
                    "roadmaps",
                    []
                )


                for roadmap in roadmaps:

                    career = roadmap.get(
                        "career"
                    )

                    steps = roadmap.get(
                        "steps",
                        []
                    )


                    if not career:
                        continue


                    content = json.dumps(
                        {
                            "career": career,
                            "steps": steps
                        },
                        ensure_ascii=False,
                        indent=2
                    )


                    embedding = create_embedding(
                        content
                    )


                    metadata = {
                        "career": career,
                        "steps": steps,
                        "step_count": len(steps)
                    }


                    supabase.table(
                        "rag_documents"
                    ).insert(
                        {
                            "content": content,
                            "category": "roadmap",
                            "domain": career,
                            "source": filename,
                            "metadata": metadata,
                            "embedding": embedding,
                        }
                    ).execute()


                    total_documents += 1


                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Added roadmap: {career} "
                            f"({len(steps)} steps)"
                        )
                    )


            # =================================================
            # COURSES
            # =================================================

            elif category == "course":

                career_domains = data.get(
                    "courses",
                    []
                )


                # ---------------------------------------------
                # EACH CAREER DOMAIN
                # ---------------------------------------------

                for domain_data in career_domains:

                    domain = domain_data.get(
                        "domain"
                    )

                    courses = domain_data.get(
                        "courses",
                        []
                    )


                    if not domain:
                        continue


                    self.stdout.write(
                        f"\nCourse domain: {domain}"
                    )


                    # -----------------------------------------
                    # EACH ACTUAL COURSE
                    # -----------------------------------------

                    for course in courses:

                        title = course.get(
                            "title",
                            "Untitled Course"
                        )


                        content = json.dumps(
                            course,
                            ensure_ascii=False,
                            indent=2
                        )


                        embedding = create_embedding(
                            content
                        )


                        # -------------------------------------
                        # STORE COMPLETE COURSE DATA
                        # -------------------------------------

                        metadata = {
                            "title": course.get(
                                "title",
                                ""
                            ),

                            "provider": course.get(
                                "provider",
                                ""
                            ),

                            "level": course.get(
                                "level",
                                ""
                            ),

                            "skills": course.get(
                                "skills",
                                []
                            ),

                            "url": course.get(
                                "url",
                                ""
                            )
                        }


                        supabase.table(
                            "rag_documents"
                        ).insert(
                            {
                                "content": content,
                                "category": "course",
                                "domain": domain,
                                "source": filename,
                                "metadata": metadata,
                                "embedding": embedding,
                            }
                        ).execute()


                        total_documents += 1


                        self.stdout.write(
                            self.style.SUCCESS(
                                f"Added course: "
                                f"{title}"
                            )
                        )


            # =================================================
            # PROJECTS
            # =================================================

            elif category == "project":

                if isinstance(data, list):

                    items = data

                elif isinstance(data, dict):

                    items = data.get(
                        "projects",
                        []
                    )

                else:

                    items = []


                for item in items:

                    content = json.dumps(
                        item,
                        ensure_ascii=False,
                        indent=2
                    )


                    embedding = create_embedding(
                        content
                    )


                    domain = item.get(
                        "domain"
                    )

                    source = item.get(
                        "source",
                        filename
                    )


                    supabase.table(
                        "rag_documents"
                    ).insert(
                        {
                            "content": content,
                            "category": "project",
                            "domain": domain,
                            "source": source,
                            "metadata": item,
                            "embedding": embedding,
                        }
                    ).execute()


                    total_documents += 1


                    name = (
                        item.get("title")
                        or item.get("name")
                        or "Project"
                    )


                    self.stdout.write(
                        f"Added project: {name}"
                    )


        # =====================================================
        # COMPLETE
        # =====================================================

        self.stdout.write(
            "\n" +
            self.style.SUCCESS(
                "RAG ingestion completed!"
            )
        )


        self.stdout.write(
            self.style.SUCCESS(
                f"Total documents inserted: "
                f"{total_documents}"
            )
        )