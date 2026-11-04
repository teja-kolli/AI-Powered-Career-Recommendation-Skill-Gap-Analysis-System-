import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Recommendations.css";


function Recommendations() {

    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // LOAD AI RECOMMENDATIONS
    // =====================================================

    useEffect(() => {
        loadRecommendations();
    }, []);


    const loadRecommendations = async () => {

        try {

            setLoading(true);
            setError("");

            console.log(
                "Loading AI recommendations..."
            );


            const response = await api.get(
                "recommendations/"
            );


            console.log(
                "RECOMMENDATIONS RESPONSE:",
                response.data
            );


            if (response.data?.error) {

                setError(
                    response.data.error
                );

                return;
            }


            setData(
                response.data
            );

        } catch (error) {

            console.error(
                "RECOMMENDATIONS ERROR:",
                error
            );


            if (
                error.response?.data?.error
            ) {

                setError(
                    error.response.data.error
                );

            } else {

                setError(
                    "Unable to generate recommendations."
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

            <div className="recommend-page">

                <div className="recommend-loading">

                    <div className="recommend-loading-icon">
                        ✨
                    </div>

                    <h2>
                        Generating Your Recommendations
                    </h2>

                    <p>
                        AI is analyzing your skills,
                        interests and career goal...
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="recommend-page">

                <div className="recommend-container">

                    <button
                        className="recommend-back"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>


                    <div className="recommend-empty">

                        <div>
                            ⚠️
                        </div>

                        <h2>
                            Unable to Generate Recommendations
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={
                                loadRecommendations
                            }
                        >
                            Try Again
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    if (!data) {
        return null;
    }


    // =====================================================
    // DATA
    // =====================================================

    const careerGoal =
        data.career_goal ||
        "Career goal not specified";


    const summary =
        data.summary ||
        "AI-generated recommendations based on your profile.";


    const recommendedSkills =
        Array.isArray(
            data.recommended_skills
        )
            ? data.recommended_skills
            : [];


    const recommendedCourses =
        Array.isArray(
            data.recommended_courses
        )
            ? data.recommended_courses
            : [];


    const recommendedProjects =
        Array.isArray(
            data.recommended_projects
        )
            ? data.recommended_projects
            : [];


    const nextActions =
        Array.isArray(
            data.next_actions
        )
            ? data.next_actions
            : [];


    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (

        <div className="recommend-page">

            <div className="recommend-container">


                {/* =================================================
                    BACK
                ================================================= */}

                <button
                    className="recommend-back"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="recommend-header">

                    <div>

                        <span>
                            ✨ AI-POWERED RECOMMENDATIONS
                        </span>

                        <h1>
                            Recommended For You
                        </h1>

                        <p>
                            Personalized recommendations
                            generated using your career goal,
                            skills, interests and learning level.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    CAREER
                ================================================= */}

                <div className="recommend-career-card">

                    <div>

                        <span>
                            YOUR TARGET CAREER
                        </span>

                        <h2>
                            {careerGoal}
                        </h2>

                    </div>

                </div>


                {/* =================================================
                    AI SUMMARY
                ================================================= */}

                <div className="recommend-summary">

                    <div className="summary-icon">
                        ✨
                    </div>

                    <div>

                        <span>
                            AI CAREER INSIGHT
                        </span>

                        <p>
                            {summary}
                        </p>

                    </div>

                </div>


                {/* =================================================
                    RECOMMENDED SKILLS
                ================================================= */}

                {recommendedSkills.length > 0 && (

                    <section className="recommend-section">

                        <div className="recommend-section-heading">

                            <div className="recommend-section-icon">
                                🧠
                            </div>

                            <div>

                                <h2>
                                    Recommended Skills
                                </h2>

                                <p>
                                    Skills that can help you
                                    progress toward your target career.
                                </p>

                            </div>

                        </div>


                        <div className="recommend-grid">

                            {recommendedSkills.map(
                                (item, index) => (

                                    <div
                                        className="recommend-card"
                                        key={
                                            item.skill ||
                                            index
                                        }
                                    >

                                        <div className="recommend-card-top">

                                            <div className="recommend-icon">
                                                🧠
                                            </div>

                                            <span>
                                                {item.priority ||
                                                    "Recommended"}
                                            </span>

                                        </div>


                                        <h2>
                                            {item.skill ||
                                                "Skill"}
                                        </h2>


                                        <p>
                                            {item.reason ||
                                                "Recommended based on your career profile."}
                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    </section>

                )}


                {/* =================================================
                    RECOMMENDED COURSES
                ================================================= */}

                {recommendedCourses.length > 0 && (

                    <section className="recommend-section">

                        <div className="recommend-section-heading">

                            <div className="recommend-section-icon">
                                📚
                            </div>

                            <div>

                                <h2>
                                    Recommended Courses
                                </h2>

                                <p>
                                    Courses selected to help you
                                    develop the skills needed for your career.
                                </p>

                            </div>

                        </div>


                        <div className="recommend-grid">

                            {recommendedCourses.map(
                                (item, index) => (

                                    <div
                                        className="recommend-card"
                                        key={
                                            item.id ||
                                            index
                                        }
                                    >

                                        <div className="recommend-card-top">

                                            <div className="recommend-icon">
                                                📚
                                            </div>

                                            <span>
                                                {item.priority ||
                                                    "Recommended"}
                                            </span>

                                        </div>


                                        <h2>
                                            {item.title ||
                                                "Course"}
                                        </h2>


                                        <p>
                                            {item.reason ||
                                                "Recommended based on your career profile."}
                                        </p>


                                        {item.id && (

                                            <button
                                                className="recommend-action"
                                                onClick={() =>
                                                    navigate(
                                                        "/courses"
                                                    )
                                                }
                                            >
                                                View Courses →
                                            </button>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    </section>

                )}


                {/* =================================================
                    RECOMMENDED PROJECTS
                ================================================= */}

                {recommendedProjects.length > 0 && (

                    <section className="recommend-section">

                        <div className="recommend-section-heading">

                            <div className="recommend-section-icon">
                                💻
                            </div>

                            <div>

                                <h2>
                                    Recommended Projects
                                </h2>

                                <p>
                                    Practical projects that can
                                    strengthen your portfolio.
                                </p>

                            </div>

                        </div>


                        <div className="recommend-grid">

                            {recommendedProjects.map(
                                (item, index) => (

                                    <div
                                        className="recommend-card"
                                        key={
                                            item.id ||
                                            index
                                        }
                                    >

                                        <div className="recommend-card-top">

                                            <div className="recommend-icon">
                                                💻
                                            </div>

                                            <span>
                                                {item.priority ||
                                                    "Recommended"}
                                            </span>

                                        </div>


                                        <h2>
                                            {item.title ||
                                                "Project"}
                                        </h2>


                                        <p>
                                            {item.reason ||
                                                "Recommended to improve your practical skills."}
                                        </p>


                                        {item.id && (

                                            <button
                                                className="recommend-action"
                                                onClick={() =>
                                                    navigate(
                                                        "/projects"
                                                    )
                                                }
                                            >
                                                View Projects →
                                            </button>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    </section>

                )}


                {/* =================================================
                    NEXT ACTIONS
                ================================================= */}

                {nextActions.length > 0 && (

                    <section className="next-actions-section">

                        <div className="recommend-section-heading">

                            <div className="recommend-section-icon">
                                🚀
                            </div>

                            <div>

                                <span>
                                    AI LEARNING DIRECTION
                                </span>

                                <h2>
                                    What You Should Do Next
                                </h2>

                                <p>
                                    A practical sequence generated
                                    from your current career profile.
                                </p>

                            </div>

                        </div>


                        <div className="next-actions-list">

                            {nextActions.map(
                                (item, index) => (

                                    <div
                                        className="next-action-item"
                                        key={
                                            item.step ||
                                            index
                                        }
                                    >

                                        <div className="next-action-number">
                                            {item.step ||
                                                index + 1}
                                        </div>


                                        <div>

                                            <h3>
                                                Step{" "}
                                                {item.step ||
                                                    index + 1}
                                            </h3>

                                            <p>
                                                {item.action ||
                                                    "Continue developing your career skills."}
                                            </p>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </section>

                )}


                {/* =================================================
                    EMPTY
                ================================================= */}

                {recommendedSkills.length === 0 &&
                    recommendedCourses.length === 0 &&
                    recommendedProjects.length === 0 &&
                    nextActions.length === 0 && (

                        <div className="recommend-empty">

                            <div>
                                ✨
                            </div>

                            <h2>
                                No Recommendations Generated
                            </h2>

                            <p>
                                Complete your profile, skills,
                                interests and career goal to
                                generate personalized AI recommendations.
                            </p>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/fingerprint"
                                    )
                                }
                            >
                                Build Career Fingerprint
                            </button>

                        </div>

                    )}

            </div>

        </div>

    );

}


export default Recommendations;