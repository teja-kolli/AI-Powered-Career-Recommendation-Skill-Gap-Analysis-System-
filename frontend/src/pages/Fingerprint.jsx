import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "./Fingerprint.css";


function CareerFingerprint() {

    const navigate = useNavigate();

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [generating, setGenerating] = useState(false);

    const [error, setError] = useState("");


    // =====================================================
    // LOAD EXISTING FINGERPRINT
    // =====================================================

    useEffect(() => {

        loadFingerprint();

    }, []);


    const loadFingerprint = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await api.get(
                "fingerprint/me/"
            );


            console.log(
                "FINGERPRINT RESPONSE:",
                response.data
            );


            setData(
                response.data
            );


        } catch (error) {

            console.error(
                "FINGERPRINT LOAD ERROR:",
                error
            );


            if (
                error.response?.status === 404
            ) {

                setData(null);

            } else {

                setError(
                    error.response?.data?.error ||
                    "Unable to load career fingerprint."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // GENERATE
    // =====================================================

    const generateFingerprint = async () => {

        try {

            setGenerating(true);

            setError("");


            console.log(
                "Generating Career Taste Fingerprint..."
            );


            const response = await api.post(
                "fingerprint/generate/"
            );


            console.log(
                "GENERATED FINGERPRINT:",
                response.data
            );


            if (
                response.data?.error
            ) {

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
                "FINGERPRINT GENERATION ERROR:",
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


            setError(
                error.response?.data?.error ||
                "Unable to generate career fingerprint."
            );

        } finally {

            setGenerating(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="fingerprint-page">

                <div className="fingerprint-loading">

                    <div>
                        🧬
                    </div>

                    <h2>
                        Loading Your Career Fingerprint
                    </h2>

                    <p>
                        Preparing your personalized career profile...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="fingerprint-page">

            <div className="fingerprint-container">


                {/* =================================================
                    BACK
                ================================================= */}

                <button
                    className="fingerprint-back"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="fingerprint-header">

                    <span>
                        🧬 AI CAREER TASTE FINGERPRINT
                    </span>

                    <h1>
                        Your Career Taste Fingerprint
                    </h1>

                    <p>
                        A personalized representation of your
                        career interests, skills, strengths and
                        professional direction.
                    </p>

                </header>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="fingerprint-error">

                        ⚠️

                        <div>

                            <strong>
                                Something went wrong
                            </strong>

                            <p>
                                {error}
                            </p>

                        </div>

                    </div>

                )}


                {/* =================================================
                    NO FINGERPRINT
                ================================================= */}

                {!data && (

                    <div className="fingerprint-empty">

                        <div className="empty-icon">
                            🧬
                        </div>

                        <h2>
                            Build Your Career Fingerprint
                        </h2>

                        <p>
                            AI will analyze your career goal,
                            skills, proficiency, interests and
                            learning level to create your
                            personalized career identity.
                        </p>

                        <button
                            onClick={
                                generateFingerprint
                            }
                            disabled={generating}
                        >

                            {generating
                                ? "Generating..."
                                : "✨ Generate My Fingerprint"}

                        </button>

                    </div>

                )}


                {/* =================================================
                    GENERATING
                ================================================= */}

                {generating && (

                    <div className="fingerprint-generating">

                        <div className="generating-icon">
                            🧠
                        </div>

                        <h2>
                            AI is Building Your Fingerprint
                        </h2>

                        <p>
                            Qwen3 is analyzing your skills,
                            interests and career direction...
                        </p>

                        <div className="fingerprint-progress">
                            <div></div>
                        </div>

                    </div>

                )}


                {/* =================================================
                    RESULTS
                ================================================= */}

                {data && !generating && (

                    <>

                        {/* =================================================
                            CAREER OVERVIEW
                        ================================================= */}

                        <section className="fingerprint-overview">

                            <div className="overview-main">

                                <span>
                                    PRIMARY CAREER DOMAIN
                                </span>

                                <h2>
                                    {
                                        data.career_goal
                                    }
                                </h2>

                                <p>
                                    {
                                        data.career_identity
                                            ?.career_direction ||
                                        data.ai_summary
                                    }
                                </p>

                            </div>


                            <div className="career-score">

                                <span>
                                    CAREER ALIGNMENT
                                </span>

                                <strong>
                                    {Math.round(
                                        data.career_score || 0
                                    )}
                                    %
                                </strong>

                            </div>

                        </section>


                        {/* =================================================
                            AI SUMMARY
                        ================================================= */}

                        <section className="fingerprint-section">

                            <div className="section-heading">

                                <span>
                                    ✨
                                </span>

                                <div>

                                    <small>
                                        AI CAREER PROFILE
                                    </small>

                                    <h2>
                                        Your Career Identity
                                    </h2>

                                </div>

                            </div>


                            <div className="summary-card">

                                <p>
                                    {
                                        data.ai_summary
                                    }
                                </p>

                            </div>

                        </section>


                        {/* =================================================
                            INTEREST PROFILE
                        ================================================= */}

                        <section className="fingerprint-section">

                            <div className="section-heading">

                                <span>
                                    ❤️
                                </span>

                                <div>

                                    <small>
                                        INTEREST FINGERPRINT
                                    </small>

                                    <h2>
                                        What You Are Interested In
                                    </h2>

                                </div>

                            </div>


                            <div className="fingerprint-grid">

                                <div className="profile-card">

                                    <h3>
                                        Primary Interests
                                    </h3>

                                    <div className="tag-list">

                                        {data.interest_profile
                                            ?.primary_interests
                                            ?.map(
                                                (
                                                    item,
                                                    index
                                                ) => (

                                                    <span
                                                        key={index}
                                                    >
                                                        {item}
                                                    </span>

                                                )
                                            )}

                                    </div>

                                </div>


                                <div className="profile-card">

                                    <h3>
                                        Technology Interests
                                    </h3>

                                    <div className="tag-list">

                                        {data.interest_profile
                                            ?.technology_interests
                                            ?.map(
                                                (
                                                    item,
                                                    index
                                                ) => (

                                                    <span
                                                        key={index}
                                                    >
                                                        {item}
                                                    </span>

                                                )
                                            )}

                                    </div>

                                </div>

                            </div>


                            {data.interest_profile
                                ?.interest_summary && (

                                <div className="description-card">

                                    <p>
                                        {
                                            data.interest_profile
                                                .interest_summary
                                        }
                                    </p>

                                </div>

                            )}

                        </section>


                        {/* =================================================
                            SKILL PROFILE
                        ================================================= */}

                        <section className="fingerprint-section">

                            <div className="section-heading">

                                <span>
                                    🛠️
                                </span>

                                <div>

                                    <small>
                                        SKILL FINGERPRINT
                                    </small>

                                    <h2>
                                        Your Current Skills
                                    </h2>

                                </div>

                            </div>


                            <div className="skill-list">

                                {data.skill_profile
                                    ?.strong_skills
                                    ?.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <div
                                                className="skill-row"
                                                key={index}
                                            >

                                                <div>

                                                    <strong>
                                                        {item.name ||
                                                            item.skill}
                                                    </strong>

                                                    <small>
                                                        {item.category ||
                                                            "Technical Skill"}
                                                    </small>

                                                </div>


                                                <div className="skill-progress">

                                                    <div>

                                                        <span
                                                            style={{
                                                                width:
                                                                    `${item.proficiency || 0}%`
                                                            }}
                                                        ></span>

                                                    </div>

                                                    <strong>
                                                        {
                                                            item.proficiency
                                                        }
                                                        %
                                                    </strong>

                                                </div>

                                            </div>

                                        )
                                    )}

                            </div>


                            {data.skill_profile
                                ?.skill_summary && (

                                <div className="description-card">

                                    <p>
                                        {
                                            data.skill_profile
                                                .skill_summary
                                        }
                                    </p>

                                </div>

                            )}

                        </section>


                        {/* =================================================
                            STRENGTHS
                        ================================================= */}

                        {data.strengths?.length > 0 && (

                            <section className="fingerprint-section">

                                <div className="section-heading">

                                    <span>
                                        💪
                                    </span>

                                    <div>

                                        <small>
                                            CAREER STRENGTHS
                                        </small>

                                        <h2>
                                            Your Strengths
                                        </h2>

                                    </div>

                                </div>


                                <div className="strength-grid">

                                    {data.strengths.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <div
                                                className="strength-card"
                                                key={index}
                                            >

                                                <div className="strength-icon">
                                                    ✓
                                                </div>

                                                <div>

                                                    <h3>
                                                        {
                                                            item.strength
                                                        }
                                                    </h3>

                                                    <p>
                                                        {
                                                            item.evidence
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </section>

                        )}


                        {/* =================================================
                            DEVELOPMENT AREAS
                        ================================================= */}

                        {data.development_areas?.length > 0 && (

                            <section className="fingerprint-section">

                                <div className="section-heading">

                                    <span>
                                        📈
                                    </span>

                                    <div>

                                        <small>
                                            DEVELOPMENT
                                        </small>

                                        <h2>
                                            Areas To Develop
                                        </h2>

                                    </div>

                                </div>


                                <div className="development-grid">

                                    {data.development_areas.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <div
                                                className="development-card"
                                                key={index}
                                            >

                                                <h3>
                                                    {
                                                        item.area
                                                    }
                                                </h3>

                                                <p>
                                                    {
                                                        item.reason
                                                    }
                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>

                            </section>

                        )}


                        {/* =================================================
                            LEARNING PROFILE
                        ================================================= */}

                        {data.learning_profile && (

                            <section className="fingerprint-section">

                                <div className="section-heading">

                                    <span>
                                        📚
                                    </span>

                                    <div>

                                        <small>
                                            LEARNING PROFILE
                                        </small>

                                        <h2>
                                            How You Learn
                                        </h2>

                                    </div>

                                </div>


                                <div className="learning-grid">

                                    <div className="learning-card">

                                        <span>
                                            CURRENT LEVEL
                                        </span>

                                        <strong>
                                            {
                                                data.learning_profile
                                                    .learning_level
                                            }
                                        </strong>

                                    </div>


                                    <div className="learning-card">

                                        <span>
                                            LEARNING STYLE
                                        </span>

                                        <p>
                                            {
                                                data.learning_profile
                                                    .learning_style
                                            }
                                        </p>

                                    </div>


                                    <div className="learning-card">

                                        <span>
                                            RECOMMENDED APPROACH
                                        </span>

                                        <p>
                                            {
                                                data.learning_profile
                                                    .recommended_learning_approach
                                            }
                                        </p>

                                    </div>

                                </div>

                            </section>

                        )}


                        {/* =================================================
                            CAREER CHARACTERISTICS
                        ================================================= */}

                        {data.career_characteristics?.length > 0 && (

                            <section className="fingerprint-section">

                                <div className="section-heading">

                                    <span>
                                        🧭
                                    </span>

                                    <div>

                                        <small>
                                            CAREER CHARACTERISTICS
                                        </small>

                                        <h2>
                                            Your Career Orientation
                                        </h2>

                                    </div>

                                </div>


                                <div className="characteristics">

                                    {data.career_characteristics.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <div
                                                key={index}
                                            >

                                                <span>
                                                    ✓
                                                </span>

                                                {item}

                                            </div>

                                        )
                                    )}

                                </div>

                            </section>

                        )}


                        {/* =================================================
                            CAREER PATHS
                        ================================================= */}

                        {data.suitable_career_paths?.length > 0 && (

                            <section className="fingerprint-section">

                                <div className="section-heading">

                                    <span>
                                        🚀
                                    </span>

                                    <div>

                                        <small>
                                            CAREER DIRECTIONS
                                        </small>

                                        <h2>
                                            Suitable Career Paths
                                        </h2>

                                    </div>

                                </div>


                                <div className="career-path-grid">

                                    {data.suitable_career_paths.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <div
                                                className="career-path-card"
                                                key={index}
                                            >

                                                <div>

                                                    <h3>
                                                        {
                                                            item.career
                                                        }
                                                    </h3>

                                                    <span>
                                                        {
                                                            item.alignment
                                                        }
                                                    </span>

                                                </div>

                                                <p>
                                                    {
                                                        item.reason
                                                    }
                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>

                            </section>

                        )}


                        {/* =================================================
                            CAREER FIT
                        ================================================= */}

                        {data.career_fit && (

                            <section className="career-fit-card">

                                <span>
                                    🎯 AI CAREER FIT
                                </span>

                                <h2>
                                    Why This Career Fits Your Profile
                                </h2>

                                <p>
                                    {
                                        data.career_fit
                                            .why_this_career
                                    }
                                </p>


                                {data.career_fit
                                    .important_next_skills
                                    ?.length > 0 && (

                                    <>

                                        <h3>
                                            Important Next Skills
                                        </h3>

                                        <div className="tag-list">

                                            {data.career_fit
                                                .important_next_skills
                                                .map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (

                                                        <span
                                                            key={index}
                                                        >
                                                            {item}
                                                        </span>

                                                    )
                                                )}

                                        </div>

                                    </>

                                )}

                            </section>

                        )}


                        {/* =================================================
                            REGENERATE
                        ================================================= */}

                        <div className="regenerate-container">

                            <button
                                onClick={
                                    generateFingerprint
                                }
                                disabled={generating}
                            >
                                ✨ Regenerate Fingerprint
                            </button>

                        </div>

                    </>

                )}

            </div>

        </div>

    );

}


export default CareerFingerprint;