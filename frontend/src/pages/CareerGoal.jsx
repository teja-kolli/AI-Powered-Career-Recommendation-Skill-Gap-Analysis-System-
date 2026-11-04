import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "./CareerGoal.css";


function CareerGoal() {

    const navigate = useNavigate();


    // ==============================
    // STATE
    // ==============================

    const [careers, setCareers] = useState([]);

    const [selectedCareer, setSelectedCareer] = useState("");

    const [currentGoal, setCurrentGoal] = useState(null);

    const [profileId, setProfileId] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ==============================
    // LOAD PAGE DATA
    // ==============================

    useEffect(() => {

        loadData();

    }, []);


    const loadData = async () => {

        setLoading(true);
        setError("");

        try {

            // ==============================
            // LOAD CAREER GOALS
            // ==============================

            const careerResponse = await api.get(
                "careers/career-goals/"
            );

            console.log(
                "CAREER GOALS:",
                careerResponse.data
            );


            const careerData =
                Array.isArray(careerResponse.data)
                    ? careerResponse.data
                    : careerResponse.data.results || [];


            setCareers(careerData);


            // ==============================
            // LOAD STUDENT PROFILE
            // ==============================

            const profileResponse = await api.get(
                "profiles/profiles/"
            );

            console.log(
                "PROFILE RESPONSE:",
                profileResponse.data
            );


            let profileData =
                profileResponse.data;


            // Handle array response

            if (Array.isArray(profileData)) {

                if (profileData.length === 0) {

                    setError(
                        "Please complete your profile first."
                    );

                    return;
                }

                profileData = profileData[0];

            }


            // Handle paginated response

            else if (profileData?.results) {

                if (
                    profileData.results.length === 0
                ) {

                    setError(
                        "Please complete your profile first."
                    );

                    return;
                }

                profileData =
                    profileData.results[0];

            }


            // ==============================
            // CHECK PROFILE
            // ==============================

            if (
                !profileData ||
                !profileData.id
            ) {

                setError(
                    "Student profile not found. Please complete your profile first."
                );

                return;

            }


            // Save profile ID

            setProfileId(
                profileData.id
            );


            console.log(
                "STUDENT PROFILE ID:",
                profileData.id
            );


            // ==============================
            // LOAD CURRENT CAREER GOAL
            // ==============================

            if (profileData.career_goal) {

                const currentCareer =
                    careerData.find(
                        (career) =>
                            Number(career.id) ===
                            Number(profileData.career_goal)
                    );


                if (currentCareer) {

                    setCurrentGoal(
                        currentCareer
                    );

                    setSelectedCareer(
                        String(
                            profileData.career_goal
                        )
                    );

                }

            }


        } catch (error) {

            console.error(
                "Career Goal loading error:",
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

            } else {

                setError(
                    "Unable to load career goals."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // ==============================
    // SAVE CAREER GOAL
    // ==============================

    const handleSave = async () => {

        // Check career selection

        if (!selectedCareer) {

            setError(
                "Please select a career goal."
            );

            return;

        }


        // Check profile

        if (!profileId) {

            setError(
                "Student profile not found. Please complete your profile first."
            );

            return;

        }


        setSaving(true);

        setError("");

        setSuccess("");


        try {

            // ==============================
            // UPDATE STUDENT PROFILE
            // ==============================

            const response = await api.patch(

                `profiles/profiles/${profileId}/`,

                {
                    career_goal:
                        Number(selectedCareer)
                }

            );


            console.log(
                "CAREER GOAL SAVE RESPONSE:",
                response.data
            );


            // ==============================
            // FIND SELECTED CAREER
            // ==============================

            const selected =
                careers.find(
                    (career) =>
                        Number(career.id) ===
                        Number(selectedCareer)
                );


            setCurrentGoal(
                selected || null
            );


            setSuccess(
                "Career goal saved successfully!"
            );


        } catch (error) {

            console.error(
                "Career goal save error:",
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
                error.response?.data
            ) {

                const data =
                    error.response.data;


                if (data.career_goal) {

                    setError(
                        Array.isArray(
                            data.career_goal
                        )
                            ? data.career_goal.join(", ")
                            : data.career_goal
                    );

                } else if (data.detail) {

                    setError(
                        data.detail
                    );

                } else {

                    setError(
                        JSON.stringify(data)
                    );

                }

            } else {

                setError(
                    "Unable to save career goal."
                );

            }

        } finally {

            setSaving(false);

        }

    };


    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (

            <div className="career-loading">

                Loading career goals...

            </div>

        );

    }


    // ==============================
    // PAGE
    // ==============================

    return (

        <div className="career-page">

            <div className="career-container">


                {/* ==============================
                    BACK BUTTON
                ============================== */}

                <button
                    className="career-back"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>


                {/* ==============================
                    HEADING
                ============================== */}

                <div className="career-heading">

                    <span>
                        CAREER DIRECTION
                    </span>


                    <h1>
                        Choose Your Career Goal
                    </h1>


                    <p>
                        Tell us where you want your career
                        to go. We'll use this goal to
                        personalize your learning journey.
                    </p>

                </div>


                {/* ==============================
                    ERROR
                ============================== */}

                {error && (

                    <div className="career-message error">

                        {error}

                    </div>

                )}


                {/* ==============================
                    SUCCESS
                ============================== */}

                {success && (

                    <div className="career-message success">

                        {success}

                    </div>

                )}


                {/* ==============================
                    CAREER CARD
                ============================== */}

                <div className="career-card">


                    <div className="career-card-icon">
                        🎯
                    </div>


                    <h2>
                        What do you want to become?
                    </h2>


                    <p>
                        Select the career path that
                        interests you the most.
                    </p>


                    {/* ==============================
                        CAREER OPTIONS
                    ============================== */}

                    <div className="career-options">

                        {careers.map(
                            (career) => (

                                <button
                                    key={career.id}
                                    type="button"
                                    className={
                                        selectedCareer ===
                                        String(career.id)
                                            ? "career-option selected"
                                            : "career-option"
                                    }
                                    onClick={() => {

                                        setSelectedCareer(
                                            String(career.id)
                                        );

                                        setError("");

                                        setSuccess("");

                                    }}
                                >


                                    <div className="career-option-icon">
                                        🚀
                                    </div>


                                    <div className="career-option-content">

                                        <strong>
                                            {
                                                career.title ||
                                                career.name
                                            }
                                        </strong>


                                        {career.description && (

                                            <p>
                                                {
                                                    career.description
                                                }
                                            </p>

                                        )}

                                    </div>


                                    <div className="career-radio">

                                        {selectedCareer ===
                                            String(career.id)
                                            ? "✓"
                                            : ""
                                        }

                                    </div>


                                </button>

                            )
                        )}

                    </div>


                    {/* ==============================
                        CURRENT GOAL
                    ============================== */}

                    {currentGoal && (

                        <div className="current-career">

                            <span>
                                CURRENT GOAL
                            </span>


                            <strong>
                                {
                                    currentGoal.title ||
                                    currentGoal.name
                                }
                            </strong>

                        </div>

                    )}


                    {/* ==============================
                        SAVE BUTTON
                    ============================== */}

                    <button
                        type="button"
                        className="save-career-button"
                        onClick={handleSave}
                        disabled={saving}
                    >

                        {saving
                            ? "Saving..."
                            : "Save Career Goal →"
                        }

                    </button>


                </div>


            </div>

        </div>

    );

}


export default CareerGoal;