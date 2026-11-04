import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Dashboard.css";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";


function Dashboard() {

    const { user, logout } = useAuth();

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [profile, setProfile] = useState(null);

    const [skills, setSkills] = useState([]);

    const [fingerprint, setFingerprint] = useState(null);

    const [loading, setLoading] = useState(true);


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        logout();

        navigate("/login");

    };


    // =====================================================
    // LOAD DASHBOARD DATA
    // =====================================================

    useEffect(() => {

        loadDashboard();

    }, []);


    const loadDashboard = async () => {

        try {

            setLoading(true);


            const [
                profileResponse,
                skillsResponse,
                fingerprintResponse
            ] = await Promise.allSettled([

                api.get(
                    "profiles/profiles/"
                ),

                api.get(
                    "skills/student-skills/"
                ),

                api.get(
                    "fingerprint/me/"
                )

            ]);


            // =================================================
            // PROFILE
            // =================================================

            if (
                profileResponse.status === "fulfilled"
            ) {

                const profileData =
                    profileResponse.value.data;


                if (
                    Array.isArray(profileData)
                ) {

                    setProfile(
                        profileData[0] || null
                    );

                } else {

                    setProfile(
                        profileData
                    );

                }

            }


            // =================================================
            // SKILLS
            // =================================================

            if (
                skillsResponse.status === "fulfilled"
            ) {

                const skillData =
                    skillsResponse.value.data;


                if (
                    Array.isArray(skillData)
                ) {

                    setSkills(
                        skillData
                    );

                } else if (
                    Array.isArray(
                        skillData?.results
                    )
                ) {

                    setSkills(
                        skillData.results
                    );

                } else {

                    setSkills([]);

                }

            }


            // =================================================
            // FINGERPRINT
            // =================================================

            if (
                fingerprintResponse.status === "fulfilled"
            ) {

                setFingerprint(
                    fingerprintResponse.value.data
                );

            }

        } catch (error) {

            console.error(
                "DASHBOARD LOAD ERROR:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // PROFILE INFORMATION
    // =====================================================

    const studentProfile =
        profile || {};


    const careerGoal =
        studentProfile?.career_goal_title ||
        studentProfile?.career_goal?.title ||
        fingerprint?.career_goal ||
        "Career goal not selected";


    const learningLevel =
        studentProfile?.learning_level ||
        fingerprint?.learning_profile?.learning_level ||
        "Beginner";


    // =====================================================
    // SKILL DATA
    // =====================================================

    const normalizedSkills =
        skills.map((item) => {

            const skill =
                item.skill || {};

            return {

                name:
                    skill.name ||
                    item.skill_name ||
                    item.name ||
                    "Skill",

                proficiency:
                    Number(
                        item.proficiency ||
                        0
                    )

            };

        });


    const skillCount =
        normalizedSkills.length;


    const topSkills =
        [...normalizedSkills]
            .sort(
                (a, b) =>
                    b.proficiency -
                    a.proficiency
            )
            .slice(0, 5);


    // =====================================================
    // PROFILE COMPLETION
    // =====================================================

    const calculateProfileCompletion = () => {

        let completed = 0;

        let total = 6;


        if (
            studentProfile?.full_name
        ) {

            completed++;

        }


        if (
            studentProfile?.college
        ) {

            completed++;

        }


        if (
            studentProfile?.branch
        ) {

            completed++;

        }


        if (
            studentProfile?.year
        ) {

            completed++;

        }


        if (
            studentProfile?.career_goal ||
            studentProfile?.career_goal_title
        ) {

            completed++;

        }


        if (
            studentProfile?.bio
        ) {

            completed++;

        }


        return Math.round(
            (completed / total) * 100
        );

    };


    const profileCompletion =
        calculateProfileCompletion();


    // =====================================================
    // CAREER ALIGNMENT
    // =====================================================

    const careerAlignment =
        Math.round(
            Number(
                fingerprint?.career_score ||
                0
            )
        );


    // =====================================================
    // CAREER SUMMARY
    // =====================================================

    const careerSummary =
        fingerprint?.ai_summary ||
        fingerprint?.career_fit?.why_this_career ||
        "Complete your Career Taste Fingerprint to receive an AI-generated summary of your career direction.";


    // =====================================================
    // NEXT STEPS
    // =====================================================

    const nextSteps = [

        {
            icon: "📊",
            title: "Analyze Skill Gap",
            description:
                "Discover which skills you need to develop for your target career.",
            link: "/skill-gap",
            button:
                "Analyze Skills"
        },

        {
            icon: "✨",
            title: "Get AI Recommendations",
            description:
                "Find personalized courses, projects and career resources.",
            link: "/recommendations",
            button:
                "View Recommendations"
        },

        {
            icon: "🎓",
            title: "Prepare for Placements",
            description:
                "Build a personalized placement preparation plan.",
            link: "/placement",
            button:
                "Open Placement Coach"
        },

        {
            icon: "📄",
            title: "Improve Your Resume",
            description:
                "Analyze your resume and identify areas for improvement.",
            link: "/resume-analyzer",
            button:
                "Analyze Resume"
        }

    ];


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="dashboard-loading">

                <div className="dashboard-loading-icon">
                    ✨
                </div>

                <h2>
                    Preparing Your Career Dashboard
                </h2>

                <p>
                    Loading your personalized career information...
                </p>

            </div>

        );

    }


    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div className="dashboard">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="sidebar">

                <div className="dashboard-logo">
                    Career<span>AI</span>
                </div>


                <nav className="sidebar-nav">

                    <Link
                        className="nav-item active"
                        to="/dashboard"
                    >
                        <span>⌂</span>
                        <span className="nav-text">
                            Dashboard
                        </span>
                    </Link>


                    <Link
                        className="nav-item"
                        to="/profile"
                    >
                        <span>👤</span>
                        <span className="nav-text">
                            My Profile
                        </span>
                    </Link>


                    <Link
                        className="nav-item"
                        to="/skills"
                    >
                        <span>⚡</span>
                        <span className="nav-text">
                            Skills
                        </span>
                    </Link>


                    <Link
                        className="nav-item"
                        to="/skill-gap"
                    >
                        <span>📊</span>
                        <span className="nav-text">
                            Skill Gap
                        </span>
                    </Link>


                    <Link
                        className="nav-item"
                        to="/interests"
                    >
                        <span>♡</span>
                        <span className="nav-text">
                            Interests
                        </span>
                    </Link>


                    <Link
                        className="nav-item"
                        to="/career"
                    >
                        <span>🎯</span>
                        <span className="nav-text">
                            Career Goal
                        </span>
                    </Link>


                    <Link
                        className="nav-item"
                        to="/fingerprint"
                    >
                        <span>🧬</span>
                        <span className="nav-text">
                            Career Fingerprint
                        </span>
                    </Link>


                    <Link
                        className="nav-item"
                        to="/courses"
                    >
                        <span>📚</span>
                        <span className="nav-text">
                            Courses
                        </span>
                    </Link>


                    <Link
                        className="nav-item"
                        to="/projects"
                    >
                        <span>💻</span>
                        <span className="nav-text">
                            Projects
                        </span>
                    </Link>


                    <Link
                        className="nav-item"
                        to="/certifications"
                    >
                        <span>🏆</span>
                        <span className="nav-text">
                            Certifications
                        </span>
                    </Link>


                    <Link
                        className="nav-item"
                        to="/roadmap"
                    >
                        <span>🗺️</span>
                        <span className="nav-text">
                            Roadmap
                        </span>
                    </Link>


                    <Link
                        className="nav-item"
                        to="/learning"
                    >
                        <span>📈</span>
                        <span className="nav-text">
                            Learning Progress
                        </span>
                    </Link>


                    <Link
                        className="nav-item"
                        to="/recommendations"
                    >
                        <span>✨</span>
                        <span className="nav-text">
                            Recommendations
                        </span>
                    </Link>


                    <Link
                        className="nav-item"
                        to="/placement"
                    >
                        <span>🎓</span>
                        <span className="nav-text">
                            Placement Coach
                        </span>
                    </Link>


                    <Link
                        className="nav-item"
                        to="/resume-analyzer"
                    >
                        <span>📄</span>
                        <span className="nav-text">
                            Resume Analyzer
                        </span>
                    </Link>

                </nav>


                <div className="sidebar-bottom">

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        <span>↪</span>
                        <span>
                            Logout
                        </span>
                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="main-content">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="dashboard-header">

                    <div>

                        <span className="dashboard-welcome-label">
                            YOUR PERSONALIZED CAREER HUB
                        </span>

                        <h1>
                            Good Morning,{" "}
                            {user?.username || "Student"} 👋
                        </h1>

                        <p>
                            Let's build your career today.
                        </p>

                    </div>


                    <div className="profile-mini">

                        <div className="avatar">

                            {(user?.username || "S")
                                .charAt(0)
                                .toUpperCase()}

                        </div>

                        <div>

                            <strong>
                                {user?.username || "Student"}
                            </strong>

                            <small>
                                {careerGoal}
                            </small>

                        </div>

                    </div>

                </header>


                {/* =================================================
                    AI HERO
                ================================================= */}

                <section className="ai-banner">

                    <div className="ai-banner-content">

                        <span className="ai-label">
                            ✨ AI CAREER ASSISTANT
                        </span>

                        <h2>
                            Your career journey,
                            <br />
                            personalized by AI.
                        </h2>

                        <p>
                            CareerAI brings together your skills,
                            interests and career goals to help you
                            make progress toward your target career.
                        </p>


                        <div className="hero-actions">

                           

                          

                        </div>

                    </div>


                    <div className="ai-symbol">

                        <div className="ai-orbit">
                            ✦
                        </div>

                    </div>

                </section>


                {/* =================================================
                    SMART STATS
                ================================================= */}

                <section className="stats-grid">


                    {/* CAREER ALIGNMENT */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            🎯
                        </div>

                        <div>

                            <span>
                                Career Alignment
                            </span>

                            <strong>
                                {careerAlignment > 0
                                    ? `${careerAlignment}%`
                                    : "—"}
                            </strong>

                            <small>
                                AI profile match
                            </small>

                        </div>

                    </div>


                    {/* SKILLS */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            ⚡
                        </div>

                        <div>

                            <span>
                                Skills
                            </span>

                            <strong>
                                {skillCount}
                            </strong>

                            <small>
                                Skills in your profile
                            </small>

                        </div>

                    </div>


                    {/* PROFILE */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            👤
                        </div>

                        <div>

                            <span>
                                Profile Completion
                            </span>

                            <strong>
                                {profileCompletion}%
                            </strong>

                            <small>
                                Keep your profile updated
                            </small>

                        </div>

                    </div>


                    {/* LEVEL */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            🚀
                        </div>

                        <div>

                            <span>
                                Learning Level
                            </span>

                            <strong className="level-value">
                                {learningLevel}
                            </strong>

                            <small>
                                Current learning stage
                            </small>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    CAREER SNAPSHOT
                ================================================= */}

                <section className="career-snapshot">

                    <div className="snapshot-left">

                        <span className="card-label">
                            YOUR CAREER SNAPSHOT
                        </span>

                        <h2>
                            {careerGoal}
                        </h2>

                        <p>
                            {careerSummary}
                        </p>


                        <div className="snapshot-actions">

                            <Link
                                to="/career"
                            >
                                Update Career Goal →
                            </Link>

                            <Link
                                to="/profile"
                            >
                                Update Profile →
                            </Link>

                        </div>

                    </div>


                    <div className="snapshot-score">

                        <div className="score-circle">

                            <span>
                                {careerAlignment > 0
                                    ? `${careerAlignment}%`
                                    : "—"}
                            </span>

                        </div>

                        <small>
                            Career Alignment
                        </small>

                    </div>

                </section>


                {/* =================================================
                    MAIN GRID
                ================================================= */}

                <section className="dashboard-grid">


                    {/* =================================================
                        TOP SKILLS
                    ================================================= */}

                    <div className="dashboard-card">

                        <div className="card-heading">

                            <div>

                                <span className="card-label">
                                    SKILL PROFILE
                                </span>

                                <h3>
                                    Your Top Skills
                                </h3>

                            </div>

                            <span className="card-icon">
                                ⚡
                            </span>

                        </div>


                        {topSkills.length > 0 ? (

                            <div className="dashboard-skills">

                                {topSkills.map(
                                    (skill, index) => (

                                        <div
                                            className="dashboard-skill"
                                            key={`${skill.name}-${index}`}
                                        >

                                            <div className="dashboard-skill-top">

                                                <strong>
                                                    {skill.name}
                                                </strong>

                                                <span>
                                                    {skill.proficiency}%
                                                </span>

                                            </div>


                                            <div className="dashboard-skill-bar">

                                                <div
                                                    style={{
                                                        width:
                                                            `${skill.proficiency}%`
                                                    }}
                                                ></div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <div className="dashboard-empty">

                                <span>
                                    ⚡
                                </span>

                                <p>
                                    Add your skills to see
                                    your skill profile here.
                                </p>

                            </div>

                        )}


                        <Link to="/skills">
                            Manage Skills →
                        </Link>

                    </div>


                    {/* =================================================
                        PROFILE HEALTH
                    ================================================= */}

                    <div className="dashboard-card">

                        <div className="card-heading">

                            <div>

                                <span className="card-label">
                                    PROFILE HEALTH
                                </span>

                                <h3>
                                    Keep Your Profile Updated
                                </h3>

                            </div>

                            <span className="card-icon">
                                💎
                            </span>

                        </div>


                        <div className="profile-health">

                            <div className="health-circle">

                                <strong>
                                    {profileCompletion}%
                                </strong>

                            </div>


                            <div>

                                <h4>
                                    Profile Completion
                                </h4>

                                <p>
                                    A complete profile helps
                                    CareerAI personalize your
                                    recommendations.
                                </p>

                            </div>

                        </div>


                        <Link to="/profile">
                            Update My Profile →
                        </Link>

                    </div>


                    {/* =================================================
                        NEXT STEPS
                    ================================================= */}

                    <div className="dashboard-card full-width">

                        <div className="card-heading">

                            <div>

                                <span className="card-label">
                                    PERSONALIZED ACTIONS
                                </span>

                                <h3>
                                    What You Can Do Next
                                </h3>

                            </div>

                            <span className="card-icon">
                                ✨
                            </span>

                        </div>


                        <div className="next-step-grid">

                            {nextSteps.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <Link
                                        to={item.link}
                                        className="next-step-card"
                                        key={index}
                                    >

                                        <div className="next-step-icon">
                                            {item.icon}
                                        </div>

                                        <div>

                                            <h4>
                                                {item.title}
                                            </h4>

                                            <p>
                                                {item.description}
                                            </p>

                                            <span>
                                                {item.button}
                                                {" →"}
                                            </span>

                                        </div>

                                    </Link>

                                )
                            )}

                        </div>

                    </div>


                    {/* =================================================
                        QUICK ACCESS
                    ================================================= */}

                    <div className="dashboard-card full-width quick-access-card">

                        <div className="card-heading">

                            <div>

                                <span className="card-label">
                                    CAREERAI TOOLS
                                </span>

                                <h3>
                                    Continue Your Career Journey
                                </h3>

                            </div>

                            <span className="card-icon">
                                🧭
                            </span>

                        </div>


                        <div className="quick-access-grid">

                            <Link to="/courses">
                                <span>📚</span>
                                <strong>Courses</strong>
                                <small>
                                    Learn new skills
                                </small>
                            </Link>


                            <Link to="/projects">
                                <span>💻</span>
                                <strong>Projects</strong>
                                <small>
                                    Build your portfolio
                                </small>
                            </Link>


                            <Link to="/certifications">
                                <span>🏆</span>
                                <strong>Certifications</strong>
                                <small>
                                    Strengthen your profile
                                </small>
                            </Link>


                            <Link to="/roadmap">
                                <span>🗺️</span>
                                <strong>Roadmap</strong>
                                <small>
                                    Follow your career path
                                </small>
                            </Link>


                            <Link to="/placement">
                                <span>🎓</span>
                                <strong>Placement Coach</strong>
                                <small>
                                    Prepare for placements
                                </small>
                            </Link>


                            <Link to="/resume-analyzer">
                                <span>📄</span>
                                <strong>Resume Analyzer</strong>
                                <small>
                                    Improve your resume
                                </small>
                            </Link>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    FOOTER MESSAGE
                ================================================= */}

                <div className="dashboard-footer">

                    <span>
                        ✦
                    </span>

                    <p>
                        CareerAI continuously adapts to your
                        career profile as you update your skills,
                        interests and goals.
                    </p>

                </div>


            </main>

        </div>

    );

}


export default Dashboard;