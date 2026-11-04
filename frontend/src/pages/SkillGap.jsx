import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "./SkillGap.css";


function SkillGap() {

    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // LOAD SKILL GAP
    // =====================================================

    useEffect(() => {
        loadSkillGap();
    }, []);


    const loadSkillGap = async () => {

        try {

            setLoading(true);
            setError("");

            console.log("Loading Skill Gap Analysis...");

            const response = await api.get(
                "skill-gap/analyze/"
            );

            console.log(
                "SKILL GAP RESPONSE:",
                response.data
            );

            setData(response.data);

        } catch (error) {

            console.error(
                "SKILL GAP ERROR:",
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

            }

            else if (
                error.response?.data?.error
            ) {

                setError(
                    error.response.data.error
                );

            }

            else {

                setError(
                    "Unable to generate skill gap analysis."
                );

            }

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // HELPER FUNCTIONS
    // =====================================================

    const numberValue = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return null;
        }

        const number = Number(value);

        return Number.isNaN(number)
            ? null
            : number;
    };


    const percentage = (value) => {

        const number = numberValue(value);

        if (number === null) {
            return null;
        }

        return Math.max(
            0,
            Math.min(100, number)
        );
    };


    const formatPercentage = (value) => {

        const number = percentage(value);

        if (number === null) {
            return "Not available";
        }

        return `${number}%`;
    };


    const formatProficiency = (value) => {

        const number = percentage(value);

        if (number === null) {
            return "Not specified";
        }

        return `${number}%`;
    };


    const getImportance = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "Not specified";
        }

        if (
            typeof value === "string" &&
            isNaN(Number(value))
        ) {
            return value;
        }

        return `${value}%`;
    };


    const getSkillKey = (item, index) => {

        return (
            item?.skill_id ||
            item?.skill ||
            index
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="skill-gap-page">

                <div className="skill-gap-loading">

                    <div className="skill-gap-spinner">
                        ◌
                    </div>

                    <h2>
                        Analyzing Your Skills
                    </h2>

                    <p>
                        Comparing your current skills
                        with your career requirements...
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

            <div className="skill-gap-page">

                <div className="skill-gap-error">

                    <div>
                        ⚠️
                    </div>

                    <h2>
                        Unable to Analyze Skills
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={loadSkillGap}
                    >
                        Try Again
                    </button>

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

    const learningLevel =
        data.learning_level ||
        data.student?.learning_level ||
        "Not specified";


    const overallCoverage =
        percentage(data.overall_coverage) ?? 0;


    const remainingCoverage =
        Math.max(
            0,
            100 - overallCoverage
        );


    const strongSkills =
        Array.isArray(data.strong_skills)
            ? data.strong_skills
            : [];


    const developingSkills =
        Array.isArray(data.developing_skills)
            ? data.developing_skills
            : [];


    const missingSkills =
        Array.isArray(data.missing_skills)
            ? data.missing_skills
            : [];


    const prioritySkills =
        Array.isArray(data.priority_skills)
            ? data.priority_skills
            : [];


    // Use backend count when available.
    // Otherwise calculate it from the arrays.

    const totalRequiredSkills =
        numberValue(data.total_required_skills) !== null
            ? Number(data.total_required_skills)
            : (
                strongSkills.length +
                developingSkills.length +
                missingSkills.length
            );


    const strongCount =
        numberValue(data.strong_skill_count) !== null
            ? Number(data.strong_skill_count)
            : strongSkills.length;


    const developingCount =
        numberValue(data.developing_skill_count) !== null
            ? Number(data.developing_skill_count)
            : developingSkills.length;


    const missingCount =
        numberValue(data.missing_skill_count) !== null
            ? Number(data.missing_skill_count)
            : missingSkills.length;


    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (

        <div className="skill-gap-page">

            <div className="skill-gap-container">


                {/* =================================================
                    BACK
                ================================================= */}

                <button
                    className="skill-gap-back"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="skill-gap-header">

                    <span>
                        AI SKILL GAP ANALYZER
                    </span>

                    <h1>
                        Skill Gap Analysis
                    </h1>

                    <p>
                        Understand the skills you have,
                        the skills you need, and what to
                        learn next for your career.
                    </p>

                </div>


                {/* =================================================
                    CAREER
                ================================================= */}

                <div className="career-card">

                    <div>

                        <span>
                            TARGET CAREER
                        </span>

                        <h2>
                            {careerGoal}
                        </h2>

                    </div>


                    <div>

                        <span>
                            LEARNING LEVEL
                        </span>

                        <h3>
                            {learningLevel}
                        </h3>

                    </div>

                </div>


                {/* =================================================
                    OVERVIEW
                ================================================= */}

                <div className="gap-overview">


                    {/* COVERAGE */}

                    <div className="coverage-card">

                        <div className="coverage-header">

                            <div>

                                <span>
                                    OVERALL SKILL COVERAGE
                                </span>

                                <h2>
                                    {overallCoverage}%
                                </h2>

                            </div>

                        </div>


                        <div className="progress-bar">

                            <div
                                className="progress-fill"
                                style={{
                                    width:
                                        `${overallCoverage}%`
                                }}
                            />

                        </div>


                        <p>

                            {remainingCoverage === 0

                                ? "Your current skills meet the estimated requirements for this career."

                                : `${remainingCoverage}% of the estimated skill coverage still needs improvement.`

                            }

                        </p>

                    </div>


                    {/* REQUIRED */}

                    <div className="summary-card">

                        <span>
                            REQUIRED SKILLS
                        </span>

                        <strong>
                            {totalRequiredSkills}
                        </strong>

                    </div>


                    {/* STRONG */}

                    <div className="summary-card">

                        <span>
                            STRONG
                        </span>

                        <strong>
                            {strongCount}
                        </strong>

                    </div>


                    {/* DEVELOPING */}

                    <div className="summary-card">

                        <span>
                            DEVELOPING
                        </span>

                        <strong>
                            {developingCount}
                        </strong>

                    </div>


                    {/* MISSING */}

                    <div className="summary-card">

                        <span>
                            MISSING
                        </span>

                        <strong>
                            {missingCount}
                        </strong>

                    </div>

                </div>


                {/* =================================================
                    STRONG SKILLS
                ================================================= */}

                {strongSkills.length > 0 && (

                    <section className="skill-section">

                        <div className="section-heading">

                            <span className="section-icon">
                                ✓
                            </span>

                            <div>

                                <h2>
                                    Strong Skills
                                </h2>

                                <p>
                                    Skills where your current
                                    proficiency meets the
                                    career requirement.
                                </p>

                            </div>

                        </div>


                        <div className="skill-list">

                            {strongSkills.map(
                                (item, index) => {

                                    const current =
                                        percentage(
                                            item.current_proficiency
                                        );

                                    const required =
                                        percentage(
                                            item.required_proficiency
                                        );

                                    const coverage =
                                        percentage(
                                            item.coverage
                                        ) ??
                                        current ??
                                        0;

                                    return (

                                        <div
                                            className="skill-item strong"
                                            key={getSkillKey(
                                                item,
                                                index
                                            )}
                                        >

                                            <div>

                                                <h3>
                                                    {item.skill}
                                                </h3>

                                                <span>

                                                    Current:{" "}
                                                    {formatProficiency(
                                                        current
                                                    )}

                                                    {" · "}

                                                    Required:{" "}
                                                    {formatProficiency(
                                                        required
                                                    )}

                                                </span>

                                            </div>


                                            <div className="skill-progress">

                                                <div
                                                    style={{
                                                        width:
                                                            `${coverage}%`
                                                    }}
                                                />

                                            </div>


                                            <strong>

                                                {coverage > 0
                                                    ? `${coverage}%`
                                                    : "Meets requirement"
                                                }

                                            </strong>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    </section>

                )}


                {/* =================================================
                    DEVELOPING SKILLS
                ================================================= */}

                {developingSkills.length > 0 && (

                    <section className="skill-section">

                        <div className="section-heading">

                            <span className="section-icon">
                                ◐
                            </span>

                            <div>

                                <h2>
                                    Developing Skills
                                </h2>

                                <p>
                                    You already have these skills,
                                    but they need improvement.
                                </p>

                            </div>

                        </div>


                        <div className="skill-list">

                            {developingSkills.map(
                                (item, index) => {

                                    const current =
                                        percentage(
                                            item.current_proficiency
                                        );

                                    const required =
                                        percentage(
                                            item.required_proficiency
                                        );

                                    const gap =
                                        percentage(
                                            item.gap
                                        );


                                    const coverage =
                                        percentage(
                                            item.coverage
                                        ) ??
                                        current ??
                                        0;


                                    return (

                                        <div
                                            className="skill-item developing"
                                            key={getSkillKey(
                                                item,
                                                index
                                            )}
                                        >

                                            <div>

                                                <h3>
                                                    {item.skill}
                                                </h3>

                                                <span>

                                                    Current:{" "}
                                                    {formatProficiency(
                                                        current
                                                    )}

                                                    {" · "}

                                                    Required:{" "}
                                                    {formatProficiency(
                                                        required
                                                    )}

                                                </span>

                                            </div>


                                            <div className="skill-progress">

                                                <div
                                                    style={{
                                                        width:
                                                            `${coverage}%`
                                                    }}
                                                />

                                            </div>


                                            <strong>

                                                {gap !== null
                                                    ? `Gap: ${gap}%`
                                                    : "Needs improvement"
                                                }

                                            </strong>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    </section>

                )}


                {/* =================================================
                    MISSING SKILLS
                ================================================= */}

                {missingSkills.length > 0 && (

                    <section className="skill-section">

                        <div className="section-heading">

                            <span className="section-icon">
                                !
                            </span>

                            <div>

                                <h2>
                                    Missing Skills
                                </h2>

                                <p>
                                    These skills are currently
                                    not present in your profile.
                                </p>

                            </div>

                        </div>


                        <div className="missing-grid">

                            {missingSkills.map(
                                (item, index) => (

                                    <div
                                        className="missing-card"
                                        key={getSkillKey(
                                            item,
                                            index
                                        )}
                                    >

                                        <div>

                                            <h3>
                                                {item.skill}
                                            </h3>

                                            <span>
                                                Required proficiency:{" "}
                                                {formatProficiency(
                                                    item.required_proficiency
                                                )}
                                            </span>

                                        </div>


                                        <div className="importance">

                                            {item.importance !==
                                                undefined &&
                                            item.importance !==
                                                null &&
                                            item.importance !==
                                                ""

                                                ? `Importance: ${getImportance(
                                                    item.importance
                                                )}`

                                                : "Priority skill"
                                            }

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </section>

                )}


                {/* =================================================
                    PRIORITY
                ================================================= */}

                {prioritySkills.length > 0 && (

                    <section className="priority-section">

                        <div>

                            <span>
                                NEXT LEARNING PRIORITIES
                            </span>

                            <h2>
                                What You Should Learn Next
                            </h2>

                            <p>
                                These skills are prioritized
                                based on their importance
                                and current skill gap.
                            </p>

                        </div>


                        <div className="priority-list">

                            {prioritySkills
                                .slice(0, 6)
                                .map(
                                    (item, index) => {

                                        const gap =
                                            percentage(
                                                item.gap
                                            );

                                        return (

                                            <div
                                                className="priority-item"
                                                key={getSkillKey(
                                                    item,
                                                    index
                                                )}
                                            >

                                                <div className="priority-number">

                                                    {index + 1}

                                                </div>


                                                <div>

                                                    <h3>
                                                        {item.skill}
                                                    </h3>

                                                    <p>

                                                        {gap !== null && (

                                                            <>
                                                                Gap:{" "}
                                                                {gap}%
                                                            </>
                                                        )}


                                                        {gap !== null &&
                                                            item.importance !==
                                                                undefined && (
                                                                <>
                                                                    {" · "}
                                                                </>
                                                            )}


                                                        {item.importance !==
                                                            undefined &&
                                                            item.importance !==
                                                                null &&
                                                            item.importance !==
                                                                "" && (

                                                            <>
                                                                Importance:{" "}
                                                                {getImportance(
                                                                    item.importance
                                                                )}
                                                            </>
                                                        )}

                                                    </p>

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                        </div>

                    </section>

                )}


            </div>

        </div>

    );

}


export default SkillGap;