import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./Roadmap.css";

const Roadmap = () => {

    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD ROADMAP
    // =====================================================

    useEffect(() => {
        loadRoadmap();
    }, []);

    const loadRoadmap = async () => {

        try {

            setLoading(true);
            setError("");

            console.log(
                "Generating personalized roadmap..."
            );

            const response = await api.post(
                "rag/roadmap/"
            );

            console.log(
                "RAG ROADMAP RESPONSE:",
                response.data
            );

            // Save complete backend response
            setRoadmap(response.data);

        } catch (err) {

            console.error(
                "Roadmap RAG Error:",
                err
            );

            console.error(
                "Status:",
                err.response?.status
            );

            console.error(
                "Response:",
                err.response?.data
            );

            if (err.response?.status === 401) {

                setError(
                    "Your session has expired. Please login again."
                );

            } else if (err.response?.data?.error) {

                setError(
                    err.response.data.error
                );

            } else {

                setError(
                    "Failed to generate your personalized roadmap."
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
            <div className="roadmap-page">

                <div className="roadmap-header">

                    <span className="roadmap-label">
                        AI CAREER ROADMAP
                    </span>

                    <h1>
                        Creating Your Roadmap
                    </h1>

                    <p>
                        Analyzing your profile and creating
                        your personalized learning path...
                    </p>

                </div>

                <div className="roadmap-loading">

                    <div className="loading-spinner">
                        ⏳
                    </div>

                    <p>
                        Searching the career knowledge base
                        and generating your roadmap.
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
            <div className="roadmap-page">

                <div className="roadmap-header">

                    <span className="roadmap-label">
                        AI CAREER ROADMAP
                    </span>

                    <h1>
                        Your Personalized Roadmap
                    </h1>

                </div>

                <div className="roadmap-error">

                    <div>
                        ⚠️
                    </div>

                    <h2>
                        Unable to Generate Roadmap
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button onClick={loadRoadmap}>
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    // =====================================================
    // EXTRACT ROADMAP
    // =====================================================

    const result = roadmap?.result || {};

    const roadmapSteps = Array.isArray(result.roadmap)
        ? result.roadmap
        : [];


    // =====================================================
    // DEBUG
    // =====================================================

    console.log(
        "ROADMAP RESULT:",
        result
    );

    console.log(
        "ROADMAP STEPS:",
        roadmapSteps
    );


    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (

        <div className="roadmap-page">

            {/* HEADER */}

            <div className="roadmap-header">

                <span className="roadmap-label">
                    AI CAREER ROADMAP
                </span>

                <h1>
                    Your Personalized Roadmap
                </h1>

                <p>
                    A personalized step-by-step learning
                    path generated from your profile.
                </p>

            </div>


            {/* ROADMAP */}

            <div className="roadmap-container">

                <div className="roadmap-result">

                    <h2 className="roadmap-title">
                        🗺️ Learning Roadmap
                    </h2>


                    {roadmapSteps.length > 0 ? (

                        <div className="roadmap-steps">

                            {roadmapSteps.map(
                                (step, index) => (

                                    <div
                                        className="roadmap-step"
                                        key={index}
                                    >

                                        {/* STEP NUMBER */}

                                        <div className="step-number">
                                            {index + 1}
                                        </div>


                                        {/* STEP CONTENT */}

                                        <div className="step-content">

                                            <h3>
                                                {step.title ||
                                                    `Step ${index + 1}`}
                                            </h3>


                                            {step.description && (

                                                <p>
                                                    {step.description}
                                                </p>

                                            )}


                                            {/* SKILLS */}

                                            {Array.isArray(step.skills) &&
                                                step.skills.length > 0 && (

                                                    <div className="step-skills">

                                                        {step.skills.map(
                                                            (skill, skillIndex) => (

                                                                <span
                                                                    key={skillIndex}
                                                                >
                                                                    {skill}
                                                                </span>

                                                            )
                                                        )}

                                                    </div>

                                                )}


                                            {/* LEVEL + DURATION */}

                                            <div className="step-meta">

                                                {step.level && (

                                                    <span className="step-level">
                                                        {step.level}
                                                    </span>

                                                )}


                                                {step.duration && (

                                                    <span className="step-duration">
                                                        ⏱ {step.duration}
                                                    </span>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="roadmap-empty">

                            <div>
                                🗺️
                            </div>

                            <h2>
                                Roadmap content unavailable
                            </h2>

                            <p>
                                The AI did not return a roadmap.
                                Please try again.
                            </p>

                            <button onClick={loadRoadmap}>
                                Generate Again
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};

export default Roadmap;