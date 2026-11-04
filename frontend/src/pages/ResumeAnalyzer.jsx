import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "./ResumeAnalyzer.css";


function ResumeAnalyzer() {

    const navigate = useNavigate();

    const [file, setFile] = useState(null);

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // =====================================================
    // FILE SELECT
    // =====================================================

    const handleFileChange = (event) => {

        const selectedFile =
            event.target.files[0];


        if (!selectedFile) {

            return;

        }


        const allowedTypes = [

            "application/pdf",

            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

            "text/plain"

        ];


        const extension =
            selectedFile.name
                .split(".")
                .pop()
                .toLowerCase();


        if (
            !allowedTypes.includes(
                selectedFile.type
            ) &&
            !["pdf", "docx", "txt"].includes(
                extension
            )
        ) {

            setError(
                "Please upload a PDF, DOCX or TXT resume."
            );

            return;

        }


        setFile(
            selectedFile
        );

        setError("");

        setData(null);

    };


    // =====================================================
    // ANALYZE
    // =====================================================

    const analyzeResume = async () => {

        if (!file) {

            setError(
                "Please select your resume first."
            );

            return;

        }


        try {

            setLoading(true);

            setError("");

            setData(null);


            const formData =
                new FormData();


            formData.append(
                "resume",
                file
            );


            console.log(
                "Starting resume analysis..."
            );


            const response = await api.post(

                "resumes/analyze/",

                formData

            );


            console.log(
                "RESUME ANALYSIS RESPONSE:",
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
                response.data.analysis
            );


        } catch (error) {

            console.error(
                "RESUME ANALYZER ERROR:",
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

                "Unable to analyze the resume."

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

            <div className="resume-page">

                <div className="resume-loading">

                    <div className="resume-loading-icon">
                        📄
                    </div>

                    <h2>
                        Analyzing Your Resume
                    </h2>

                    <p>
                        AI is analyzing your resume
                        against your career goal...
                    </p>

                    <div className="resume-loading-bar">
                        <div></div>
                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="resume-page">

            <div className="resume-container">


                {/* =================================================
                    BACK
                ================================================= */}

                <button
                    className="resume-back"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="resume-header">

                    <span>
                        📄 AI RESUME ANALYZER
                    </span>

                    <h1>
                        Resume Analyzer
                    </h1>

                    <p>
                        Upload your resume and get AI-powered
                        feedback based on your selected career goal.
                    </p>

                </div>


                {/* =================================================
                    UPLOAD
                ================================================= */}

                {!data && (

                    <div className="resume-upload-card">

                        <div className="upload-icon">
                            📄
                        </div>

                        <h2>
                            Upload Your Resume
                        </h2>

                        <p>
                            Upload a PDF, DOCX or TXT file.
                        </p>


                        <label
                            className="upload-button"
                        >

                            Choose Resume

                            <input
                                type="file"
                                accept=".pdf,.docx,.txt"
                                onChange={
                                    handleFileChange
                                }
                            />

                        </label>


                        {file && (

                            <div className="selected-file">

                                <span>
                                    📎
                                </span>

                                <div>

                                    <strong>
                                        {file.name}
                                    </strong>

                                    <small>
                                        {(
                                            file.size /
                                            1024
                                        ).toFixed(1)}
                                        {" KB"}
                                    </small>

                                </div>

                            </div>

                        )}


                        {error && (

                            <div className="resume-error">

                                ⚠️ {error}

                            </div>

                        )}


                        <button
                            className="analyze-button"
                            onClick={
                                analyzeResume
                            }
                            disabled={!file}
                        >
                            ✨ Analyze My Resume
                        </button>

                    </div>

                )}


                {/* =================================================
                    RESULTS
                ================================================= */}

                {data && (

                    <>

                        <div className="result-actions">

                            <button
                                onClick={() => {

                                    setData(null);

                                    setFile(null);

                                    setError("");

                                }}
                            >
                                ← Analyze Another Resume
                            </button>

                        </div>


                        {/* =================================================
                            ATS SCORE
                        ================================================= */}

                        <div className="ats-card">

                            <div>

                                <span>
                                    ATS COMPATIBILITY SCORE
                                </span>

                                <h2>
                                    {Math.round(
                                        data.ats_score || 0
                                    )}
                                    <small>
                                        /100
                                    </small>
                                </h2>

                                <p>
                                    Based on keywords,
                                    structure, skills and
                                    career alignment.
                                </p>

                            </div>


                            <div className="ats-circle">

                                <div
                                    style={{
                                        "--score":
                                            `${data.ats_score || 0}%`
                                    }}
                                >
                                    {Math.round(
                                        data.ats_score || 0
                                    )}
                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            SUMMARY
                        ================================================= */}

                        <section className="resume-section">

                            <div className="section-title">

                                <span>
                                    🤖
                                </span>

                                <div>

                                    <small>
                                        AI ANALYSIS
                                    </small>

                                    <h2>
                                        Resume Summary
                                    </h2>

                                </div>

                            </div>


                            <div className="summary-card">

                                <p>
                                    {
                                        data.overall_summary
                                    }
                                </p>

                            </div>

                        </section>


                        {/* =================================================
                            CAREER ALIGNMENT
                        ================================================= */}

                        <section className="resume-section">

                            <div className="section-title">

                                <span>
                                    🎯
                                </span>

                                <div>

                                    <small>
                                        CAREER ALIGNMENT
                                    </small>

                                    <h2>
                                        Target Career
                                    </h2>

                                </div>

                            </div>


                            <div className="career-card">

                                <h3>
                                    {
                                        data.career_goal
                                    }
                                </h3>

                                <p>
                                    {
                                        data.career_alignment
                                    }
                                </p>

                            </div>

                        </section>


                        {/* =================================================
                            DETECTED SKILLS
                        ================================================= */}

                        {data.detected_skills?.length > 0 && (

                            <section className="resume-section">

                                <div className="section-title">

                                    <span>
                                        🛠️
                                    </span>

                                    <div>

                                        <small>
                                            SKILLS FOUND
                                        </small>

                                        <h2>
                                            Detected Skills
                                        </h2>

                                    </div>

                                </div>


                                <div className="skills-grid">

                                    {data.detected_skills.map(
                                        (item, index) => (

                                            <div
                                                className="skill-card"
                                                key={index}
                                            >

                                                <strong>
                                                    {
                                                        item.skill
                                                    }
                                                </strong>

                                                <p>
                                                    {
                                                        item.evidence
                                                    }
                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>

                            </section>

                        )}


                        {/* =================================================
                            STRONG AREAS
                        ================================================= */}

                        {data.strong_areas?.length > 0 && (

                            <section className="resume-section">

                                <div className="section-title">

                                    <span>
                                        ✅
                                    </span>

                                    <div>

                                        <small>
                                            STRENGTHS
                                        </small>

                                        <h2>
                                            Strong Areas
                                        </h2>

                                    </div>

                                </div>


                                <div className="strength-grid">

                                    {data.strong_areas.map(
                                        (item, index) => (

                                            <div
                                                className="strength-card"
                                                key={index}
                                            >

                                                <h3>
                                                    {
                                                        item.area
                                                    }
                                                </h3>

                                                <p>
                                                    {
                                                        item.explanation
                                                    }
                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>

                            </section>

                        )}


                        {/* =================================================
                            MISSING SKILLS
                        ================================================= */}

                        {data.missing_skills?.length > 0 && (

                            <section className="resume-section">

                                <div className="section-title">

                                    <span>
                                        ⚠️
                                    </span>

                                    <div>

                                        <small>
                                            SKILL GAPS
                                        </small>

                                        <h2>
                                            Missing Skills
                                        </h2>

                                    </div>

                                </div>


                                <div className="missing-grid">

                                    {data.missing_skills.map(
                                        (item, index) => (

                                            <div
                                                className="missing-card"
                                                key={index}
                                            >

                                                <div>

                                                    <h3>
                                                        {
                                                            item.skill
                                                        }
                                                    </h3>

                                                    <span>
                                                        {
                                                            item.importance
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
                            KEYWORDS
                        ================================================= */}

                        {data.keyword_suggestions?.length > 0 && (

                            <section className="resume-section">

                                <div className="section-title">

                                    <span>
                                        🔑
                                    </span>

                                    <div>

                                        <small>
                                            ATS OPTIMIZATION
                                        </small>

                                        <h2>
                                            Suggested Keywords
                                        </h2>

                                    </div>

                                </div>


                                <div className="keyword-list">

                                    {data.keyword_suggestions.map(
                                        (keyword, index) => (

                                            <span
                                                key={index}
                                            >
                                                {keyword}
                                            </span>

                                        )
                                    )}

                                </div>

                            </section>

                        )}


                        {/* =================================================
                            RESUME SECTIONS
                        ================================================= */}

                        {data.resume_sections && (

                            <section className="resume-section">

                                <div className="section-title">

                                    <span>
                                        📋
                                    </span>

                                    <div>

                                        <small>
                                            SECTION ANALYSIS
                                        </small>

                                        <h2>
                                            Resume Sections
                                        </h2>

                                    </div>

                                </div>


                                <div className="section-analysis-grid">

                                    {Object.entries(
                                        data.resume_sections
                                    ).map(
                                        (
                                            [
                                                section,
                                                status
                                            ],
                                            index
                                        ) => (

                                            <div
                                                className="section-analysis-card"
                                                key={index}
                                            >

                                                <span>
                                                    {section
                                                        .replace(
                                                            /_/g,
                                                            " "
                                                        )}
                                                </span>

                                                <strong>
                                                    {status}
                                                </strong>

                                            </div>

                                        )
                                    )}

                                </div>

                            </section>

                        )}


                        {/* =================================================
                            FORMATTING
                        ================================================= */}

                        {data.formatting_issues?.length > 0 && (

                            <section className="resume-section">

                                <div className="section-title">

                                    <span>
                                        🎨
                                    </span>

                                    <div>

                                        <small>
                                            FORMATTING
                                        </small>

                                        <h2>
                                            Formatting Improvements
                                        </h2>

                                    </div>

                                </div>


                                <div className="issue-list">

                                    {data.formatting_issues.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <div
                                                key={index}
                                            >
                                                ⚠️ {item}
                                            </div>

                                        )
                                    )}

                                </div>

                            </section>

                        )}


                        {/* =================================================
                            CONTENT ISSUES
                        ================================================= */}

                        {data.content_issues?.length > 0 && (

                            <section className="resume-section">

                                <div className="section-title">

                                    <span>
                                        ✏️
                                    </span>

                                    <div>

                                        <small>
                                            CONTENT
                                        </small>

                                        <h2>
                                            Content Improvements
                                        </h2>

                                    </div>

                                </div>


                                <div className="issue-list">

                                    {data.content_issues.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <div
                                                key={index}
                                            >
                                                💡 {item}
                                            </div>

                                        )
                                    )}

                                </div>

                            </section>

                        )}


                        {/* =================================================
                            IMPROVEMENTS
                        ================================================= */}

                        {data.improvement_suggestions?.length > 0 && (

                            <section className="resume-section">

                                <div className="section-title">

                                    <span>
                                        🚀
                                    </span>

                                    <div>

                                        <small>
                                            ACTION PLAN
                                        </small>

                                        <h2>
                                            How To Improve Your Resume
                                        </h2>

                                    </div>

                                </div>


                                <div className="improvement-list">

                                    {data.improvement_suggestions.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <div
                                                className="improvement-card"
                                                key={index}
                                            >

                                                <div className="improvement-number">
                                                    {index + 1}
                                                </div>


                                                <div>

                                                    <div className="improvement-top">

                                                        <h3>
                                                            {
                                                                item.area
                                                            }
                                                        </h3>

                                                        <span>
                                                            {
                                                                item.priority
                                                            }
                                                        </span>

                                                    </div>

                                                    <p>
                                                        {
                                                            item.suggestion
                                                        }
                                                    </p>

                                                </div>

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


export default ResumeAnalyzer;