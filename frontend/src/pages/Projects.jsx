import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Projects.css";

function Projects() {

    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // LOAD RAG PROJECTS
    // =====================================================

    useEffect(() => {
        loadProjects();
    }, []);


    const loadProjects = async () => {

        try {

            setLoading(true);
            setError("");

            console.log(
                "Generating personalized projects..."
            );

            const response = await api.post(
                "rag/projects/"
            );

            console.log(
                "RAG PROJECTS RESPONSE:",
                response.data
            );

            const result =
                response.data?.result;


            // Qwen JSON response

            if (Array.isArray(result)) {

                setProjects(result);

            } else if (
                Array.isArray(result?.projects)
            ) {

                setProjects(
                    result.projects
                );

            } else if (
                Array.isArray(result?.recommendations)
            ) {

                setProjects(
                    result.recommendations
                );

            } else {

                console.warn(
                    "Unexpected RAG projects response:",
                    response.data
                );

                setProjects([]);
            }

        } catch (error) {

            console.error(
                "LOAD RAG PROJECTS ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            if (
                error.response?.status === 401
            ) {

                setError(
                    "Your session has expired. Please login again."
                );

            } else if (
                error.response?.data?.error
            ) {

                setError(
                    error.response.data.error
                );

            } else {

                setError(
                    "Unable to generate personalized projects."
                );
            }

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="projects-loading">

                <h2>
                    Creating Your Projects
                </h2>

                <p>
                    Searching the knowledge base and
                    generating projects for your career goal...
                </p>

            </div>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="projects-page">

            <div className="projects-container">

                {/* Back */}

                <button
                    className="projects-back"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>


                {/* Header */}

                <div className="projects-header">

                    <span>
                        AI PROJECT RECOMMENDATIONS
                    </span>

                    <h1>
                        Projects For You
                    </h1>

                    <p>
                        Projects personalized according
                        to your career goal, skills,
                        interests and learning level.
                    </p>

                </div>


                {/* Error */}

                {error && (

                    <div className="projects-error">

                        ⚠️ {error}

                        <button
                            onClick={loadProjects}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* Projects */}

                {!error && projects.length > 0 && (

                    <div className="projects-grid">

                        {projects.map(
                            (project, index) => (

                                <div
                                    className="project-card"
                                    key={
                                        project.id ||
                                        index
                                    }
                                >

                                    <div className="project-icon">
                                        💻
                                    </div>


                                    <span className="project-level">

                                        {project.difficulty ||
                                            project.level ||
                                            "Recommended"}

                                    </span>


                                    <h2>

                                        {project.title ||
                                            project.name ||
                                            "Untitled Project"}

                                    </h2>


                                    <p>

                                        {project.description ||
                                            "A practical project designed to strengthen your technical skills."}

                                    </p>


                                    {/* Skills */}

                                    {project.skills && (

                                        <div className="tech-list">

                                            {Array.isArray(
                                                project.skills
                                            ) ? (

                                                project.skills.map(
                                                    (skill, index) => (

                                                        <span
                                                            key={index}
                                                        >
                                                            {typeof skill ===
                                                            "object"
                                                                ? skill.name
                                                                : skill}
                                                        </span>

                                                    )
                                                )

                                            ) : (

                                                <span>
                                                    {project.skills}
                                                </span>

                                            )}

                                        </div>
                                    )}


                                    {/* Why relevant */}

                                    {project.why_relevant && (

                                        <div className="project-reason">

                                            <strong>
                                                Why this project?
                                            </strong>

                                            <p>
                                                {project.why_relevant}
                                            </p>

                                        </div>
                                    )}


                                    {/* Prerequisites */}

                                    {project.suggested_learning_prerequisites && (

                                        <div className="project-prerequisites">

                                            <strong>
                                                Prerequisites
                                            </strong>

                                            <p>
                                                {
                                                    project
                                                        .suggested_learning_prerequisites
                                                }
                                            </p>

                                        </div>
                                    )}

                                </div>

                            )
                        )}

                    </div>

                )}


                {/* Empty */}

                {!error &&
                    projects.length === 0 && (

                    <div className="projects-empty">

                        <div>
                            💻
                        </div>

                        <h2>
                            No personalized projects found
                        </h2>

                        <p>
                            No relevant projects were
                            retrieved for your current
                            career profile.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Projects;