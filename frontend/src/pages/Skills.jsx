import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "./Skills.css";


function Skills() {

    const token = localStorage.getItem("access_token");

    console.log("ACCESS TOKEN:", token);

    const navigate = useNavigate();


    // ==============================
    // STATE
    // ==============================

    const [skills, setSkills] = useState([]);
    const [mySkills, setMySkills] = useState([]);

    const [studentId, setStudentId] = useState(null);

    const [selectedSkill, setSelectedSkill] = useState("");
    const [proficiency, setProficiency] = useState(50);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ==============================
    // LOAD DATA
    // ==============================

    useEffect(() => {

        loadData();

    }, []);


    const loadData = async () => {

        setLoading(true);
        setError("");

        try {

            /*
             * Get logged-in student's profile
             */

            const profileResponse = await api.get(
                "profiles/profiles/"
            );

            console.log(
                "PROFILE RESPONSE:",
                profileResponse.data
            );

            const profiles = Array.isArray(profileResponse.data)
                ? profileResponse.data
                : [profileResponse.data];


            if (!profiles || profiles.length === 0 || !profiles[0]?.id) {

                setError(
                    "Please complete your profile first."
                );

                setLoading(false);

                return;
            }


            const profile = profiles[0];

            setStudentId(profile.id);


            /*
             * Get all available skills
             */

            const skillsResponse = await api.get(
                "skills/skills/"
            );

            console.log(
                "SKILLS RESPONSE:",
                skillsResponse.data
            );


            const availableSkills = Array.isArray(
                skillsResponse.data
            )
                ? skillsResponse.data
                : skillsResponse.data.results || [];


            setSkills(availableSkills);


            /*
             * Get student's skills
             */

            const mySkillsResponse = await api.get(
                "skills/student-skills/"
            );

            console.log(
                "MY SKILLS RESPONSE:",
                mySkillsResponse.data
            );


            const studentSkills = Array.isArray(
                mySkillsResponse.data
            )
                ? mySkillsResponse.data
                : mySkillsResponse.data.results || [];


            setMySkills(studentSkills);


        } catch (error) {

            console.error(
                "LOAD SKILLS ERROR:",
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


            if (error.response?.status === 401) {

                setError(
                    "Your session has expired. Please login again."
                );

            } else if (
                error.config?.url?.includes(
                    "profiles/profiles/"
                )
            ) {

                setError(
                    "Unable to load your profile. Please complete your profile first."
                );

            } else if (
                error.config?.url?.includes(
                    "skills/skills/"
                )
            ) {

                setError(
                    "Unable to load available skills."
                );

            } else if (
                error.config?.url?.includes(
                    "skills/student-skills/"
                )
            ) {

                setError(
                    "Unable to load your skills."
                );

            } else {

                setError(
                    "Unable to load skills."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // ==============================
    // ADD SKILL
    // ==============================

    const handleAddSkill = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (!studentId) {

            setError(
                "Student profile not found."
            );

            return;

        }


        if (!selectedSkill) {

            setError(
                "Please select a skill."
            );

            return;

        }


        /*
         * Prevent duplicate skill
         */

        const alreadyExists = mySkills.some((item) => {

            const skillId =
                item.skill?.id ??
                item.skill;

            return String(skillId) === String(selectedSkill);

        });


        if (alreadyExists) {

            setError(
                "You have already added this skill."
            );

            return;

        }


        setSaving(true);


        try {

            await api.post(
                "skills/student-skills/",
                {
                    student: studentId,
                    skill: Number(selectedSkill),
                    proficiency: Number(proficiency),
                }
            );


            setSuccess(
                "Skill added successfully!"
            );


            setSelectedSkill("");
            setProficiency(50);


            /*
             * Reload student's skills
             */

            const response = await api.get(
                "skills/student-skills/"
            );


            const studentSkills = Array.isArray(
                response.data
            )
                ? response.data
                : response.data.results || [];


            setMySkills(studentSkills);


        } catch (error) {

            console.error(
                "Add skill error:",
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


            if (error.response?.data) {

                const data =
                    error.response.data;


                /*
                 * Handle duplicate skill
                 */

                if (data.non_field_errors) {

                    setError(
                        data.non_field_errors[0]
                    );

                }


                /*
                 * Handle student error
                 */

                else if (data.student) {

                    setError(
                        data.student[0]
                    );

                }


                /*
                 * Handle skill error
                 */

                else if (data.skill) {

                    setError(
                        data.skill[0]
                    );

                }


                /*
                 * Handle proficiency error
                 */

                else if (data.proficiency) {

                    setError(
                        data.proficiency[0]
                    );

                }


                else {

                    try {

                        setError(
                            JSON.stringify(data)
                        );

                    } catch (e) {

                        setError(
                            "Unable to add skill."
                        );

                    }

                }

            } else {

                setError(
                    "Unable to connect to the server."
                );

            }

        } finally {

            setSaving(false);

        }

    };


    // ==============================
    // DELETE SKILL
    // ==============================

    const handleDelete = async (id) => {

        setError("");
        setSuccess("");


        const confirmed =
            window.confirm(
                "Are you sure you want to remove this skill?"
            );


        if (!confirmed) {

            return;

        }


        try {

            await api.delete(
                `skills/student-skills/${id}/`
            );


            setSuccess(
                "Skill removed successfully."
            );


            setMySkills(
                mySkills.filter(
                    (item) =>
                        item.id !== id
                )
            );


        } catch (error) {

            console.error(
                "Delete skill error:",
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
                "Unable to remove skill."
            );

        }

    };


    // ==============================
    // UPDATE PROFICIENCY
    // ==============================

    const handleProficiencyUpdate = async (
        item,
        value
    ) => {

        try {

            await api.patch(
                `skills/student-skills/${item.id}/`,
                {
                    proficiency: Number(value),
                }
            );


            setMySkills(
                mySkills.map(
                    (skill) =>
                        skill.id === item.id
                            ? {
                                ...skill,
                                proficiency:
                                    Number(value),
                            }
                            : skill
                )
            );


        } catch (error) {

            console.error(
                "Proficiency update error:",
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
                "Unable to update proficiency."
            );

        }

    };


    // ==============================
    // PROFICIENCY LABEL
    // ==============================

    const getLevel = (value) => {

        if (value < 40) {

            return "Beginner";

        }


        if (value < 70) {

            return "Intermediate";

        }


        return "Advanced";

    };


    // ==============================
    // GET CATEGORY
    // ==============================

    const getSkillCategory = (skillId) => {

        const skill = skills.find(
            (item) =>
                item.id === skillId
        );


        return skill?.category || "Other";

    };


    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (

            <div className="skills-loading">

                <div className="loading-spinner"></div>

                <p>
                    Loading your skills...
                </p>

            </div>

        );

    }


    // ==============================
    // PAGE
    // ==============================

    return (

        <div className="skills-page">

            <div className="skills-container">


                {/* ================= HEADER ================= */}

                <div className="skills-header">

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>


                    <div className="header-content">

                        <div>

                            <span className="page-label">
                                CAREER PROFILE
                            </span>

                            <h1>
                                My Skills
                            </h1>

                            <p>
                                Add the skills you know and
                                rate your proficiency level.
                                This information helps AI
                                understand your strengths.
                            </p>

                        </div>


                        <div className="skills-total">

                            <strong>
                                {mySkills.length}
                            </strong>

                            <span>
                                Skills
                            </span>

                        </div>

                    </div>

                </div>


                {/* ================= MESSAGES ================= */}

                {error && (

                    <div className="message error">

                        <span>⚠</span>

                        {error}

                        <button
                            onClick={() =>
                                setError("")
                            }
                        >
                            ×
                        </button>

                    </div>

                )}


                {success && (

                    <div className="message success">

                        <span>✓</span>

                        {success}

                        <button
                            onClick={() =>
                                setSuccess("")
                            }
                        >
                            ×
                        </button>

                    </div>

                )}


                {/* ================= CONTENT ================= */}

                <div className="skills-layout">


                    {/* ================= ADD SKILL ================= */}

                    <div className="add-skill-card">

                        <div className="card-icon">
                            ⚡
                        </div>

                        <h2>
                            Add a Skill
                        </h2>

                        <p>
                            Tell us about a technology or
                            skill you already know.
                        </p>


                        <form
                            onSubmit={handleAddSkill}
                        >


                            {/* Skill */}

                            <div className="form-group">

                                <label>
                                    Select Skill
                                </label>

                                <select
                                    value={selectedSkill}
                                    onChange={(e) =>
                                        setSelectedSkill(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Choose a skill
                                    </option>


                                    {skills.map(
                                        (skill) => (

                                            <option
                                                key={skill.id}
                                                value={skill.id}
                                            >
                                                {skill.name}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* Selected category */}

                            {selectedSkill && (

                                <div className="selected-category">

                                    Category:

                                    <strong>

                                        {
                                            getSkillCategory(
                                                Number(
                                                    selectedSkill
                                                )
                                            )
                                        }

                                    </strong>

                                </div>

                            )}


                            {/* Proficiency */}

                            <div className="form-group">

                                <div className="proficiency-title">

                                    <label>
                                        Proficiency
                                    </label>

                                    <strong>
                                        {proficiency}%
                                    </strong>

                                </div>


                                <input
                                    className="range-input"
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={proficiency}
                                    onChange={(e) =>
                                        setProficiency(
                                            e.target.value
                                        )
                                    }
                                />


                                <div className="range-labels">

                                    <span>
                                        Beginner
                                    </span>

                                    <span>
                                        Intermediate
                                    </span>

                                    <span>
                                        Advanced
                                    </span>

                                </div>


                                <div className="current-level">

                                    {getLevel(
                                        Number(proficiency)
                                    )}

                                </div>

                            </div>


                            <button
                                type="submit"
                                className="add-button"
                                disabled={saving}
                            >

                                {saving
                                    ? "Adding Skill..."
                                    : "+ Add Skill"
                                }

                            </button>

                        </form>

                    </div>


                    {/* ================= MY SKILLS ================= */}

                    <div className="my-skills-card">

                        <div className="card-header">

                            <div>

                                <span className="small-label">
                                    YOUR SKILLS
                                </span>

                                <h2>
                                    Skills Profile
                                </h2>

                            </div>

                        </div>


                        {mySkills.length === 0 ? (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    ⚡
                                </div>

                                <h3>
                                    No skills yet
                                </h3>

                                <p>
                                    Add your first skill to
                                    start building your Career
                                    Taste Fingerprint.
                                </p>

                            </div>

                        ) : (

                            <div className="skill-list">

                                {mySkills.map(
                                    (item) => (

                                        <div
                                            className="skill-item"
                                            key={item.id}
                                        >


                                            <div className="skill-top">

                                                <div>

                                                    <h3>
                                                        {
                                                            item.skill_name ||
                                                            item.skill?.name ||
                                                            "Skill"
                                                        }
                                                    </h3>

                                                    <span className="skill-level">

                                                        {
                                                            getLevel(
                                                                Number(
                                                                    item.proficiency
                                                                )
                                                            )
                                                        }

                                                    </span>

                                                </div>


                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            item.id
                                                        )
                                                    }
                                                    title="Remove skill"
                                                >
                                                    ×
                                                </button>

                                            </div>


                                            <div className="skill-percentage">

                                                <span>
                                                    Proficiency
                                                </span>

                                                <strong>
                                                    {item.proficiency}%
                                                </strong>

                                            </div>


                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={
                                                    item.proficiency
                                                }
                                                onChange={(e) =>
                                                    handleProficiencyUpdate(
                                                        item,
                                                        e.target.value
                                                    )
                                                }
                                                className="skill-range"
                                            />


                                            <div className="skill-progress">

                                                <div
                                                    className="skill-progress-fill"
                                                    style={{
                                                        width:
                                                            `${item.proficiency}%`,
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>


                {/* ================= FOOTER ================= */}

                <div className="skills-footer">

                    <button
                        className="previous-button"
                        onClick={() =>
                            navigate("/profile")
                        }
                    >
                        ← Profile
                    </button>


                    <button
                        className="next-button"
                        onClick={() =>
                            navigate("/interests")
                        }
                    >
                        Continue to Interests →
                    </button>

                </div>


            </div>

        </div>

    );

}


export default Skills;