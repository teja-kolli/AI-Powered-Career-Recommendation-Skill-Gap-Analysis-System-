import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./PlacementCoach.css";


function PlacementCoach() {

    const navigate = useNavigate();

    const [duration, setDuration] = useState("1");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // =====================================================
    // GENERATE PLACEMENT ROADMAP
    // =====================================================

    const generateRoadmap = async () => {

        try {

            setLoading(true);
            setError("");
            setData(null);

            console.log(
                "Generating placement roadmap for:",
                duration,
                "months"
            );

            const response = await api.post(
                "placement-coach/roadmap/",
                {
                    duration: duration
                }
            );

            console.log(
                "PLACEMENT COACH RESPONSE:",
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
                "PLACEMENT COACH ERROR:",
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
                "Unable to generate placement roadmap."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="placement-page">

                <div className="placement-loading">

                    <div className="placement-loading-icon">
                        🎯
                    </div>

                    <h2>
                        Creating Your Placement Plan
                    </h2>

                    <p>
                        AI is analyzing your skills,
                        interests and career goal.
                    </p>

                    <p>
                        Your personalized roadmap is being generated...
                    </p>

                    <div className="placement-loading-bar">
                        <div></div>
                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="placement-page">

            <div className="placement-container">


                {/* =================================================
                    BACK
                ================================================= */}

                <button
                    className="placement-back"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="placement-header">

                    <span className="placement-label">
                        🎯 AI PLACEMENT COACH
                    </span>

                    <h1>
                        Placement Coach
                    </h1>

                    <p>
                        Get personalized placement tips and
                        an AI-generated preparation roadmap
                        based on your skills, interests and
                        career goal.
                    </p>

                </div>


                {/* =================================================
                    DURATION CARD
                ================================================= */}

                {!data && (

                    <div className="duration-card">

                        <div className="duration-intro">

                            <span>
                                CHOOSE YOUR PREPARATION DURATION
                            </span>

                            <h2>
                                How much time do you have?
                            </h2>

                            <p>
                                Choose your preparation timeline.
                                AI will create a placement roadmap
                                specifically for that duration.
                            </p>

                        </div>


                        <div className="duration-select-wrapper">

                            <label htmlFor="placement-duration">
                                Preparation Duration
                            </label>

                            <select
                                id="placement-duration"
                                value={duration}
                                onChange={(e) =>
                                    setDuration(
                                        e.target.value
                                    )
                                }
                                className="duration-select"
                            >

                                {Array.from(
                                    {
                                        length: 12
                                    },
                                    (_, index) => {

                                        const months =
                                            index + 1;

                                        return (

                                            <option
                                                key={months}
                                                value={months}
                                            >
                                                {months}{" "}
                                                {months === 1
                                                    ? "Month"
                                                    : "Months"}
                                            </option>

                                        );

                                    }
                                )}

                            </select>

                        </div>


                        <div className="duration-info">

                            <div>
                                <span>
                                    🧠
                                </span>

                                <p>
                                    Personalized using your
                                    current skills
                                </p>
                            </div>


                            <div>
                                <span>
                                    🎯
                                </span>

                                <p>
                                    Focused on your career goal
                                </p>
                            </div>


                            <div>
                                <span>
                                    📚
                                </span>

                                <p>
                                    Includes complete placement preparation
                                </p>
                            </div>

                        </div>


                        <button
                            className="generate-placement-btn"
                            onClick={generateRoadmap}
                        >
                            ✨ Generate My Placement Plan
                        </button>

                    </div>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="placement-error">

                        <div className="placement-error-icon">
                            ⚠️
                        </div>

                        <div>

                            <h3>
                                Unable to Generate Plan
                            </h3>

                            <p>
                                {error}
                            </p>

                            <button
                                onClick={
                                    generateRoadmap
                                }
                            >
                                Try Again
                            </button>

                        </div>

                    </div>

                )}


                {/* =================================================
                    RESULTS
                ================================================= */}

                {data && (

                    <>

                        {/* =================================================
                            RESULT ACTIONS
                        ================================================= */}

                        <div className="result-actions">

                            <button
                                className="change-duration-btn"
                                onClick={() => {
                                    setData(null);
                                    setError("");
                                }}
                            >
                                ← Choose Another Duration
                            </button>

                        </div>


                        {/* =================================================
                            CAREER OVERVIEW
                        ================================================= */}

                        <div className="placement-career-card">

                            <div className="career-main">

                                <span>
                                    TARGET CAREER
                                </span>

                                <h2>
                                    {data.career_domain ||
                                        "Career Goal"}
                                </h2>

                            </div>


                            <div className="career-duration">

                                <span>
                                    PREPARATION TIMELINE
                                </span>

                                <h3>
                                    {data.duration_months ||
                                        duration}{" "}
                                    {Number(
                                        data.duration_months ||
                                        duration
                                    ) === 1
                                        ? "Month"
                                        : "Months"}
                                </h3>

                            </div>

                        </div>


                        {/* =================================================
                            AI SUMMARY
                        ================================================= */}

                        {data.placement_readiness_summary && (

                            <div className="placement-summary">

                                <div className="placement-summary-icon">
                                    🤖
                                </div>

                                <div>

                                    <span>
                                        AI PLACEMENT INSIGHT
                                    </span>

                                    <p>
                                        {
                                            data.placement_readiness_summary
                                        }
                                    </p>

                                </div>

                            </div>

                        )}


                        {/* =================================================
                            PRIORITY AREAS
                        ================================================= */}

                        {data.priority_areas?.length > 0 && (

                            <section className="placement-section">

                                <div className="section-heading">

                                    <div className="section-icon">
                                        🎯
                                    </div>

                                    <div>

                                        <span className="section-label">
                                            AI ANALYSIS
                                        </span>

                                        <h2>
                                            Your Placement Priorities
                                        </h2>

                                        <p>
                                            Areas that deserve the
                                            most attention during
                                            your preparation.
                                        </p>

                                    </div>

                                </div>


                                <div className="priority-grid">

                                    {data.priority_areas.map(
                                        (item, index) => (

                                            <div
                                                className="priority-card"
                                                key={
                                                    item.area ||
                                                    index
                                                }
                                            >

                                                <div className="priority-card-top">

                                                    <div className="priority-number">
                                                        {index + 1}
                                                    </div>

                                                    <span
                                                        className={
                                                            `priority-badge ${
                                                                item.priority
                                                                    ?.toLowerCase()
                                                                    .replace(
                                                                        /\s+/g,
                                                                        "-"
                                                                    ) ||
                                                                "medium"
                                                            }`
                                                        }
                                                    >
                                                        {
                                                            item.priority ||
                                                            "Focus"
                                                        }
                                                    </span>

                                                </div>


                                                <h3>
                                                    {item.area}
                                                </h3>


                                                <p>
                                                    {item.reason}
                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>

                            </section>

                        )}


                        {/* =================================================
                            PLACEMENT TIPS
                        ================================================= */}

                        {data.placement_tips?.length > 0 && (

                            <section className="placement-section">

                                <div className="section-heading">

                                    <div className="section-icon">
                                        💡
                                    </div>

                                    <div>

                                        <span className="section-label">
                                            PLACEMENT GUIDANCE
                                        </span>

                                        <h2>
                                            Placement Tips
                                        </h2>

                                        <p>
                                            Practical advice generated
                                            specifically for your profile.
                                        </p>

                                    </div>

                                </div>


                                <div className="tips-grid">

                                    {data.placement_tips.map(
                                        (tip, index) => (

                                            <div
                                                className="tip-card"
                                                key={index}
                                            >

                                                <div className="tip-number">
                                                    {index + 1}
                                                </div>


                                                <div className="tip-content">

                                                    <div className="tip-top">

                                                        <h3>
                                                            {tip.title}
                                                        </h3>

                                                        {tip.priority && (

                                                            <span className="tip-priority">
                                                                {
                                                                    tip.priority
                                                                }
                                                            </span>

                                                        )}

                                                    </div>


                                                    <p>
                                                        {tip.tip}
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </section>

                        )}


                        {/* =================================================
                            PLACEMENT ROADMAP
                        ================================================= */}

                        {data.roadmap?.length > 0 && (

                            <section className="placement-section">

                                <div className="section-heading">

                                    <div className="section-icon">
                                        🗺️
                                    </div>

                                    <div>

                                        <span className="section-label">
                                            AI-GENERATED ROADMAP
                                        </span>

                                        <h2>
                                            Your Placement Roadmap
                                        </h2>

                                        <p>
                                            A personalized{" "}
                                            {data.duration_months ||
                                                duration}
                                            -month preparation plan
                                            generated from your profile.
                                        </p>

                                    </div>

                                </div>


                                <div className="roadmap-list">

                                    {data.roadmap.map(
                                        (month, index) => (

                                            <div
                                                className="roadmap-month"
                                                key={
                                                    month.month ||
                                                    index
                                                }
                                            >

                                                {/* MONTH NUMBER */}

                                                <div className="month-number">

                                                    <span>
                                                        MONTH
                                                    </span>

                                                    <strong>
                                                        {month.month ||
                                                            index + 1}
                                                    </strong>

                                                </div>


                                                {/* MONTH CONTENT */}

                                                <div className="month-content">

                                                    <div className="month-header">

                                                        <div>

                                                            <span>
                                                                MONTH{" "}
                                                                {month.month ||
                                                                    index + 1}
                                                            </span>

                                                            <h2>
                                                                {month.title ||
                                                                    "Placement Preparation"}
                                                            </h2>

                                                        </div>

                                                    </div>


                                                    {/* MAIN GOAL */}

                                                    {month.goal && (

                                                        <div className="month-goal">

                                                            <div className="block-icon">
                                                                🎯
                                                            </div>

                                                            <div>

                                                                <strong>
                                                                    Main Goal
                                                                </strong>

                                                                <p>
                                                                    {month.goal}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    )}


                                                    {/* FOCUS AREAS */}

                                                    {month.focus_areas?.length > 0 && (

                                                        <div className="roadmap-block">

                                                            <h3>
                                                                Focus Areas
                                                            </h3>

                                                            <div className="topic-tags">

                                                                {month.focus_areas.map(
                                                                    (
                                                                        area,
                                                                        areaIndex
                                                                    ) => (

                                                                        <span
                                                                            key={
                                                                                areaIndex
                                                                            }
                                                                        >
                                                                            {area}
                                                                        </span>

                                                                    )
                                                                )}

                                                            </div>

                                                        </div>

                                                    )}


                                                    {/* DSA */}

                                                    {month.dsa?.length > 0 && (

                                                        <div className="roadmap-block">

                                                            <h3>
                                                                🧠 DSA
                                                            </h3>

                                                            <ul>

                                                                {month.dsa.map(
                                                                    (
                                                                        item,
                                                                        itemIndex
                                                                    ) => (

                                                                        <li
                                                                            key={
                                                                                itemIndex
                                                                            }
                                                                        >
                                                                            {item}
                                                                        </li>

                                                                    )
                                                                )}

                                                            </ul>

                                                        </div>

                                                    )}


                                                    {/* APTITUDE */}

                                                    {month.aptitude?.length > 0 && (

                                                        <div className="roadmap-block">

                                                            <h3>
                                                                🧮 Aptitude
                                                            </h3>

                                                            <ul>

                                                                {month.aptitude.map(
                                                                    (
                                                                        item,
                                                                        itemIndex
                                                                    ) => (

                                                                        <li
                                                                            key={
                                                                                itemIndex
                                                                            }
                                                                        >
                                                                            {item}
                                                                        </li>

                                                                    )
                                                                )}

                                                            </ul>

                                                        </div>

                                                    )}


                                                    {/* CORE CS */}

                                                    {month.core_cs?.length > 0 && (

                                                        <div className="roadmap-block">

                                                            <h3>
                                                                💻 Core CS
                                                            </h3>

                                                            <ul>

                                                                {month.core_cs.map(
                                                                    (
                                                                        item,
                                                                        itemIndex
                                                                    ) => (

                                                                        <li
                                                                            key={
                                                                                itemIndex
                                                                            }
                                                                        >
                                                                            {item}
                                                                        </li>

                                                                    )
                                                                )}

                                                            </ul>

                                                        </div>

                                                    )}


                                                    {/* TECHNICAL SKILLS */}

                                                    {month.technical_skills?.length > 0 && (

                                                        <div className="roadmap-block">

                                                            <h3>
                                                                ⚙️ Career-Domain Skills
                                                            </h3>

                                                            <ul>

                                                                {month.technical_skills.map(
                                                                    (
                                                                        item,
                                                                        itemIndex
                                                                    ) => (

                                                                        <li
                                                                            key={
                                                                                itemIndex
                                                                            }
                                                                        >
                                                                            {item}
                                                                        </li>

                                                                    )
                                                                )}

                                                            </ul>

                                                        </div>

                                                    )}


                                                    {/* PROJECTS */}

                                                    {month.projects?.length > 0 && (

                                                        <div className="project-block">

                                                            <div className="project-block-title">
                                                                🚀 Projects
                                                            </div>

                                                            <ul>

                                                                {month.projects.map(
                                                                    (
                                                                        item,
                                                                        itemIndex
                                                                    ) => (

                                                                        <li
                                                                            key={
                                                                                itemIndex
                                                                            }
                                                                        >
                                                                            {item}
                                                                        </li>

                                                                    )
                                                                )}

                                                            </ul>

                                                        </div>

                                                    )}


                                                    {/* INTERVIEW PREPARATION */}

                                                    {month.interview_preparation?.length > 0 && (

                                                        <div className="roadmap-block">

                                                            <h3>
                                                                🎤 Interview Preparation
                                                            </h3>

                                                            <ul>

                                                                {month.interview_preparation.map(
                                                                    (
                                                                        item,
                                                                        itemIndex
                                                                    ) => (

                                                                        <li
                                                                            key={
                                                                                itemIndex
                                                                            }
                                                                        >
                                                                            {item}
                                                                        </li>

                                                                    )
                                                                )}

                                                            </ul>

                                                        </div>

                                                    )}


                                                    {/* WEEKLY PLAN */}

                                                    {month.weekly_plan?.length > 0 && (

                                                        <div className="roadmap-block">

                                                            <h3>
                                                                📅 Weekly Plan
                                                            </h3>


                                                            <div className="weekly-plan">

                                                                {month.weekly_plan.map(
                                                                    (
                                                                        week,
                                                                        weekIndex
                                                                    ) => (

                                                                        <div
                                                                            className="weekly-item"
                                                                            key={
                                                                                week.week ||
                                                                                weekIndex
                                                                            }
                                                                        >

                                                                            <div className="weekly-number">
                                                                                {week.week ||
                                                                                    weekIndex +
                                                                                    1}
                                                                            </div>


                                                                            <div className="weekly-content">

                                                                                <strong>
                                                                                    Week{" "}
                                                                                    {week.week ||
                                                                                        weekIndex +
                                                                                        1}
                                                                                </strong>


                                                                                {week.focus && (

                                                                                    <h4>
                                                                                        {
                                                                                            week.focus
                                                                                        }
                                                                                    </h4>

                                                                                )}


                                                                                {week.tasks?.length > 0 && (

                                                                                    <ul>

                                                                                        {week.tasks.map(
                                                                                            (
                                                                                                task,
                                                                                                taskIndex
                                                                                            ) => (

                                                                                                <li
                                                                                                    key={
                                                                                                        taskIndex
                                                                                                    }
                                                                                                >
                                                                                                    {task}
                                                                                                </li>

                                                                                            )
                                                                                        )}

                                                                                    </ul>

                                                                                )}

                                                                            </div>

                                                                        </div>

                                                                    )
                                                                )}

                                                            </div>

                                                        </div>

                                                    )}

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </section>

                        )}


                        {/* =================================================
                            FINAL PREPARATION
                        ================================================= */}

                        {data.final_preparation?.length > 0 && (

                            <section className="final-preparation">

                                <span className="section-label">
                                    🏆 FINAL PLACEMENT PREPARATION
                                </span>

                                <h2>
                                    Before You Start Applying
                                </h2>

                                <p className="final-description">
                                    Make sure these areas are covered
                                    before attending placement drives.
                                </p>


                                <div className="final-list">

                                    {data.final_preparation.map(
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

                                                <p>
                                                    {item}
                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>

                            </section>

                        )}

                    </>

                )}

            </div>

        </div>

    );

}


export default PlacementCoach;