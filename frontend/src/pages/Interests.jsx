import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "./Interests.css";


function Interests() {

    const navigate = useNavigate();


    // ==============================
    // STATE
    // ==============================

    const [interests, setInterests] = useState([]);
    const [myInterests, setMyInterests] = useState([]);

    const [studentId, setStudentId] = useState(null);

    const [selectedInterest, setSelectedInterest] = useState("");

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

            // ==============================
            // GET STUDENT PROFILE
            // ==============================

            const profileResponse = await api.get(
                "profiles/profiles/"
            );

            console.log(
                "PROFILE RESPONSE:",
                profileResponse.data
            );


            let profileData = profileResponse.data;


            // Handle normal array response

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

                if (profileData.results.length === 0) {

                    setError(
                        "Please complete your profile first."
                    );

                    return;
                }

                profileData = profileData.results[0];

            }


            // Make sure profile exists

            if (!profileData || !profileData.id) {

                console.error(
                    "Invalid profile response:",
                    profileData
                );

                setError(
                    "Student profile not found. Please complete your profile first."
                );

                return;
            }


            // Store student profile ID

            setStudentId(profileData.id);


            console.log(
                "STUDENT PROFILE ID:",
                profileData.id
            );


            // ==============================
            // LOAD AVAILABLE INTERESTS
            // ==============================

            await loadInterests();


            // ==============================
            // LOAD STUDENT INTERESTS
            // ==============================

            await loadMyInterests();


        } catch (error) {

            console.error(
                "Interests page loading error:",
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
                    "Unable to load your profile."
                );

            } else {

                setError(
                    "Unable to load interests."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // ==============================
    // LOAD AVAILABLE INTERESTS
    // ==============================

    const loadInterests = async () => {

        try {

            const response = await api.get(
                "interests/interests/"
            );

            console.log(
                "INTERESTS RESPONSE:",
                response.data
            );


            let availableInterests =
                response.data;


            if (Array.isArray(availableInterests)) {

                setInterests(
                    availableInterests
                );

            } else if (
                availableInterests?.results
            ) {

                setInterests(
                    availableInterests.results
                );

            } else {

                setInterests([]);

            }


        } catch (error) {

            console.error(
                "Interests loading error:",
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


            throw error;

        }

    };


    // ==============================
    // LOAD MY INTERESTS
    // ==============================

    const loadMyInterests = async () => {

        try {

            const response = await api.get(
                "interests/student-interests/"
            );

            console.log(
                "MY INTERESTS RESPONSE:",
                response.data
            );


            let studentInterests =
                response.data;


            if (Array.isArray(studentInterests)) {

                setMyInterests(
                    studentInterests
                );

            } else if (
                studentInterests?.results
            ) {

                setMyInterests(
                    studentInterests.results
                );

            } else {

                setMyInterests([]);

            }


        } catch (error) {

            console.error(
                "My interests loading error:",
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


            throw error;

        }

    };


    // ==============================
    // ADD INTEREST
    // ==============================

    const handleAddInterest = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // Check student profile

        if (!studentId) {

            setError(
                "Student profile not found. Please complete your profile first."
            );

            return;

        }


        // Check selected interest

        if (!selectedInterest) {

            setError(
                "Please select an interest."
            );

            return;

        }


        // ==============================
        // PREVENT DUPLICATES
        // ==============================

        const alreadyExists =
            myInterests.some((item) => {

                const interestId =
                    item.interest?.id ??
                    item.interest;

                return (
                    String(interestId) ===
                    String(selectedInterest)
                );

            });


        if (alreadyExists) {

            setError(
                "You have already added this interest."
            );

            return;

        }


        setSaving(true);


        try {

            // ==============================
            // SAVE INTEREST
            // ==============================

            await api.post(
                "interests/student-interests/",
                {
                    student: studentId,
                    interest: Number(selectedInterest),
                }
            );


            console.log(
                "INTEREST ADDED:",
                {
                    student: studentId,
                    interest: Number(selectedInterest),
                }
            );


            setSuccess(
                "Interest added successfully!"
            );


            setSelectedInterest("");


            // ==============================
            // RELOAD MY INTERESTS
            // ==============================

            await loadMyInterests();


        } catch (error) {

            console.error(
                "Add interest error:",
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


                // Handle field errors

                if (data.student) {

                    setError(
                        `Student: ${
                            Array.isArray(data.student)
                                ? data.student.join(", ")
                                : data.student
                        }`
                    );

                } else if (data.interest) {

                    setError(
                        `Interest: ${
                            Array.isArray(data.interest)
                                ? data.interest.join(", ")
                                : data.interest
                        }`
                    );

                } else if (data.non_field_errors) {

                    setError(
                        Array.isArray(
                            data.non_field_errors
                        )
                            ? data.non_field_errors[0]
                            : data.non_field_errors
                    );

                } else if (data.detail) {

                    setError(
                        data.detail
                    );

                } else {

                    try {

                        setError(
                            JSON.stringify(data)
                        );

                    } catch (e) {

                        setError(
                            "Unable to add interest."
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
    // DELETE INTEREST
    // ==============================

    const handleDelete = async (id) => {

        setError("");
        setSuccess("");


        const confirmed =
            window.confirm(
                "Are you sure you want to remove this interest?"
            );


        if (!confirmed) {

            return;

        }


        try {

            await api.delete(
                `interests/student-interests/${id}/`
            );


            setSuccess(
                "Interest removed successfully."
            );


            setMyInterests(
                myInterests.filter(
                    (item) =>
                        item.id !== id
                )
            );


        } catch (error) {

            console.error(
                "Delete interest error:",
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

            } else {

                setError(
                    "Unable to remove interest."
                );

            }

        }

    };


    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (

            <div className="interests-loading">

                Loading interests...

            </div>

        );

    }


    // ==============================
    // PAGE
    // ==============================

    return (

        <div className="interests-page">

            <div className="interests-container">


                {/* ==============================
                    HEADER
                ============================== */}

                <div className="interests-header">

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/skills")
                        }
                    >
                        ← Skills
                    </button>


                    <h1>
                        Your Interests
                    </h1>


                    <p>
                        Select the areas you enjoy.
                        Your interests help us understand
                        what kind of career fits you best.
                    </p>

                </div>


                {/* ==============================
                    MESSAGES
                ============================== */}

                {error && (

                    <div className="interests-error">

                        {error}

                    </div>

                )}


                {success && (

                    <div className="interests-success">

                        {success}

                    </div>

                )}


                {/* ==============================
                    CONTENT
                ============================== */}

                <div className="interests-layout">


                    {/* ==============================
                        ADD INTEREST
                    ============================== */}

                    <div className="add-interest-card">

                        <div className="interest-icon">
                            ♡
                        </div>


                        <h2>
                            What interests you?
                        </h2>


                        <p>
                            Choose an area you're
                            genuinely interested in.
                        </p>


                        <form
                            onSubmit={handleAddInterest}
                        >

                            <div className="interest-form-group">

                                <label>
                                    Interest
                                </label>


                                <select
                                    value={selectedInterest}
                                    onChange={(e) =>
                                        setSelectedInterest(
                                            e.target.value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Select an interest
                                    </option>


                                    {interests.map(
                                        (interest) => (

                                            <option
                                                key={interest.id}
                                                value={interest.id}
                                            >
                                                {interest.name}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            <button
                                type="submit"
                                className="add-interest-button"
                                disabled={saving}
                            >

                                {saving
                                    ? "Adding..."
                                    : "+ Add Interest"
                                }

                            </button>

                        </form>

                    </div>


                    {/* ==============================
                        MY INTERESTS
                    ============================== */}

                    <div className="my-interests-card">

                        <div className="card-title-row">

                            <div>

                                <span className="small-label">
                                    YOUR INTERESTS
                                </span>


                                <h2>
                                    Areas You Like
                                </h2>

                            </div>


                            <div className="interest-count">

                                {myInterests.length}

                            </div>

                        </div>


                        {myInterests.length === 0 ? (

                            <div className="empty-interests">

                                <div className="empty-icon">
                                    ♡
                                </div>


                                <h3>
                                    No interests added yet
                                </h3>


                                <p>
                                    Add interests to help
                                    us personalize your
                                    career recommendations.
                                </p>

                            </div>

                        ) : (

                            <div className="interest-list">

                                {myInterests.map(
                                    (item) => (

                                        <div
                                            className="interest-item"
                                            key={item.id}
                                        >


                                            <div className="interest-name">

                                                <span className="interest-dot">
                                                    ✦
                                                </span>


                                                <strong>

                                                    {
                                                        item.interest_name ||
                                                        item.interest?.name ||
                                                        "Interest"
                                                    }

                                                </strong>

                                            </div>


                                            <button
                                                type="button"
                                                className="delete-interest"
                                                onClick={() =>
                                                    handleDelete(
                                                        item.id
                                                    )
                                                }
                                                title="Remove interest"
                                            >
                                                ×
                                            </button>


                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>


                {/* ==============================
                    FOOTER
                ============================== */}

                <div className="interests-footer">

                    <button
                        onClick={() =>
                            navigate("/profile")
                        }
                        className="previous-button"
                    >
                        ← Back to Profile
                    </button>


                    <button
                        onClick={() =>
                            navigate("/fingerprint")
                        }
                        className="next-button"
                    >
                        Build My Career Fingerprint →
                    </button>

                </div>


            </div>

        </div>

    );

}


export default Interests;