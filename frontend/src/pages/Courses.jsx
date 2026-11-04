import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Courses.css";

function Courses() {

    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // LOAD PERSONALIZED RAG COURSES
    // =====================================================

    useEffect(() => {
        loadCourses();
    }, []);


    const loadCourses = async () => {

        try {

            setLoading(true);
            setError("");

            console.log(
                "Generating personalized courses..."
            );


            // =================================================
            // CALL RAG COURSES API
            // =================================================

            const response = await api.post(
                "rag/courses/"
            );


            console.log(
                "RAG COURSES RESPONSE:",
                response.data
            );


            // =================================================
            // GET COURSES FROM BACKEND
            // =================================================

            const recommendedCourses =
                response.data?.result?.courses || [];


            console.log(
                "PERSONALIZED COURSES:",
                recommendedCourses
            );


            if (Array.isArray(recommendedCourses)) {

                setCourses(
                    recommendedCourses
                );

            } else {

                console.warn(
                    "Courses data is not an array:",
                    recommendedCourses
                );

                setCourses([]);

            }


        } catch (error) {

            console.error(
                "LOAD RAG COURSES ERROR:",
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


            // =================================================
            // AUTHENTICATION ERROR
            // =================================================

            if (
                error.response?.status === 401
            ) {

                setError(
                    "Your session has expired. Please login again."
                );

            }


            // =================================================
            // BACKEND ERROR
            // =================================================

            else if (
                error.response?.data?.error
            ) {

                setError(
                    error.response.data.error
                );

            }


            // =================================================
            // GENERAL ERROR
            // =================================================

            else {

                setError(
                    "Unable to generate personalized courses."
                );

            }

        }


        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // DIFFICULTY OPTIONS
    // =====================================================

    const difficulties = [
        "All",

        ...new Set(
            courses
                .map(
                    (course) =>
                        course.difficulty
                )
                .filter(Boolean)
        )
    ];


    // =====================================================
    // FILTER COURSES
    // =====================================================

    const filteredCourses =
        courses.filter((course) => {

            const name =
                course.title ||
                course.name ||
                "";


            const matchesSearch =
                name
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );


            const matchesDifficulty =
                difficulty === "All" ||
                course.difficulty === difficulty;


            return (
                matchesSearch &&
                matchesDifficulty
            );

        });


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="courses-loading">

                <h2>
                    Creating Your Course Recommendations
                </h2>

                <p>
                    Searching the career knowledge base
                    and generating courses based on your
                    profile...
                </p>

            </div>

        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="courses-page">

            <div className="courses-container">


                {/* =================================================
                    BACK BUTTON
                ================================================= */}

                <button
                    className="courses-back"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="courses-header">

                    <div>

                        <span>
                            AI PERSONALIZED LEARNING
                        </span>


                        <h1>
                            Recommended Courses
                        </h1>


                        <p>
                            Courses personalized according
                            to your career goal, skills,
                            interests and learning level.
                        </p>

                    </div>


                    <div className="course-count">

                        {filteredCourses.length}

                        <small>
                            Courses
                        </small>

                    </div>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="courses-error">

                        <span>
                            ⚠️ {error}
                        </span>


                        <button
                            onClick={loadCourses}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* =================================================
                    CONTROLS
                ================================================= */}

                {!error && (

                    <div className="course-controls">


                        {/* SEARCH */}

                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />


                        {/* DIFFICULTY */}

                        <select
                            value={difficulty}
                            onChange={(e) =>
                                setDifficulty(
                                    e.target.value
                                )
                            }
                        >

                            {difficulties.map(
                                (item) => (

                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                )}


                {/* =================================================
                    COURSE GRID
                ================================================= */}

                {!error &&
                    filteredCourses.length > 0 && (

                    <div className="course-grid">

                        {filteredCourses.map(
                            (course, index) => (

                            <div
                                className="course-card"
                                key={
                                    course.id ||
                                    index
                                }
                            >


                                {/* =================================================
                                    TOP
                                ================================================= */}

                                <div className="course-top">

                                    <span className="course-category">

                                        {course.difficulty ||
                                            "Recommended"}

                                    </span>


                                    <span>
                                        📚
                                    </span>

                                </div>


                                {/* =================================================
                                    TITLE
                                ================================================= */}

                                <h2>

                                    {course.title ||
                                        course.name ||
                                        "Untitled Course"}

                                </h2>


                                {/* =================================================
                                    DESCRIPTION
                                ================================================= */}

                                <p>

                                    {course.description ||
                                        "Build valuable skills through this learning resource."}

                                </p>


                                {/* =================================================
                                    COURSE INFO
                                ================================================= */}

                                <div className="course-info">


                                    {course.platform && (

                                        <span>
                                            🏫{" "}
                                            {course.platform}
                                        </span>

                                    )}


                                    {course.instructor && (

                                        <span>
                                            👨‍🏫{" "}
                                            {course.instructor}
                                        </span>

                                    )}


                                    {course.difficulty && (

                                        <span>
                                            📊{" "}
                                            {course.difficulty}
                                        </span>

                                    )}


                                    {course.duration && (

                                        <span>
                                            ⏱{" "}
                                            {course.duration}
                                        </span>

                                    )}


                                    {course.rating && (

                                        <span>
                                            ⭐{" "}
                                            {course.rating}
                                        </span>

                                    )}

                                </div>


                                {/* =================================================
                                    SKILL
                                ================================================= */}

                                {course.skill && (

                                    <div className="course-skill">

                                        Skill:

                                        <strong>
                                            {" "}

                                            {typeof course.skill ===
                                            "object"

                                                ? course.skill.name

                                                : course.skill}

                                        </strong>

                                    </div>

                                )}


                                {/* =================================================
                                    WHY RELEVANT
                                ================================================= */}

                                {course.why_relevant && (

                                    <div className="course-reason">

                                        <strong>
                                            Why this course?
                                        </strong>


                                        <p>
                                            {course.why_relevant}
                                        </p>

                                    </div>

                                )}


                                {/* =================================================
                                    COURSE URL
                                ================================================= */}

                                {course.url && (

                                    <a
                                        href={course.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="course-button"
                                    >
                                        Start Course →
                                    </a>

                                )}

                            </div>

                        ))}

                    </div>

                )}


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {!error &&
                    filteredCourses.length === 0 && (

                    <div className="no-courses">

                        <div>
                            📚
                        </div>


                        <h2>
                            No personalized courses found
                        </h2>


                        <p>

                            {courses.length === 0

                                ? "No relevant courses were retrieved for your current career profile."

                                : "Try another search or difficulty level."

                            }

                        </p>

                    </div>

                )}

            </div>

        </div>

    );

}


export default Courses;