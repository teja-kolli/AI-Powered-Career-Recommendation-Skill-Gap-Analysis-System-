import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Profile.css";

function Profile() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [careerGoals, setCareerGoals] = useState([]);

    const [formData, setFormData] = useState({
        full_name: "",
        college: "",
        branch: "",
        year: "",
        career_goal: "",
        bio: "",
        learning_level: "Beginner",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadProfile();
        loadCareerGoals();
    }, []);

    // ==============================
    // LOAD PROFILE
    // ==============================

    const loadProfile = async () => {
        try {
            const response = await api.get(
                "profiles/profiles/"
            );

            const profiles = Array.isArray(response.data)
                ? response.data
                : [response.data];

            if (profiles.length > 0 && profiles[0]?.id) {
                const data = profiles[0];

                setProfile(data);

                setFormData({
                    full_name: data.full_name || "",
                    college: data.college || "",
                    branch: data.branch || "",
                    year: data.year || "",
                    career_goal: data.career_goal || "",
                    bio: data.bio || "",
                    learning_level:
                        data.learning_level || "Beginner",
                });

                setEditing(false);
            } else {
                // No profile exists
                setProfile(null);
                setEditing(true);
            }

        } catch (error) {
            console.error(
                "Profile loading error:",
                error
            );

            // If 404/empty profile, allow creation
            if (
                error.response?.status === 404 ||
                error.response?.status === 401
            ) {
                setProfile(null);
                setEditing(true);
            } else {
                setError(
                    "Unable to load profile."
                );
            }

        } finally {
            setLoading(false);
        }
    };


    // ==============================
    // LOAD CAREER GOALS
    // ==============================

    const loadCareerGoals = async () => {
        try {
            const response = await api.get(
                "careers/career-goals/"
            );

            setCareerGoals(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {
            console.error(
                "Career goals loading error:",
                error
            );
        }
    };


    // ==============================
    // HANDLE INPUT
    // ==============================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
        setSuccess("");
    };


    // ==============================
    // SAVE / UPDATE PROFILE
    // ==============================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setSaving(true);

        try {

            let response;

            if (profile && profile.id) {

                // ==========================
                // UPDATE EXISTING PROFILE
                // ==========================

                response = await api.patch(
                    `profiles/profiles/${profile.id}/`,
                    formData
                );

                setProfile(response.data);

                setSuccess(
                    "Profile updated successfully!"
                );

            } else {

                // ==========================
                // CREATE NEW PROFILE
                // ==========================

                response = await api.post(
                    "profiles/profiles/",
                    formData
                );

                setProfile(response.data);

                setSuccess(
                    "Profile created successfully!"
                );
            }

            // Change to read-only mode
            setEditing(false);

        } catch (error) {

            console.error(
                "Profile save error:",
                error
            );

            console.error(
                "Server response:",
                error.response?.data
            );

            if (error.response?.data) {

                const data = error.response.data;

                const messages = Object.entries(data)
                    .map(([field, message]) => {

                        if (Array.isArray(message)) {
                            return `${field}: ${message.join(", ")}`;
                        }

                        return `${field}: ${message}`;
                    })
                    .join(" | ");

                setError(
                    messages || "Unable to save profile."
                );

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
    // EDIT PROFILE
    // ==============================

    const handleEdit = () => {
        setEditing(true);
        setError("");
        setSuccess("");
    };


    // ==============================
    // CANCEL EDIT
    // ==============================

    const handleCancelEdit = () => {

        if (profile) {

            setFormData({
                full_name: profile.full_name || "",
                college: profile.college || "",
                branch: profile.branch || "",
                year: profile.year || "",
                career_goal: profile.career_goal || "",
                bio: profile.bio || "",
                learning_level:
                    profile.learning_level || "Beginner",
            });

            setEditing(false);
        }
    };


    // ==============================
    // LOADING
    // ==============================

    if (loading) {
        return (
            <div className="profile-loading">
                Loading profile...
            </div>
        );
    }


    // ==============================
    // READ ONLY PROFILE
    // ==============================

    if (profile && !editing) {

        const careerName =
            profile.career_goal_title ||
            careerGoals.find(
                (career) =>
                    career.id === profile.career_goal
            )?.title ||
            "Not selected";

        return (
            <div className="profile-page">

                <div className="profile-container">

                    <div className="profile-header">

                        <button
                            className="back-button"
                            onClick={() =>
                                navigate("/dashboard")
                            }
                        >
                            ← Dashboard
                        </button>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            View your career profile and
                            personalized information.
                        </p>

                    </div>


                    <div className="profile-card">

                        {success && (
                            <div className="profile-success">
                                {success}
                            </div>
                        )}


                        <div className="profile-view">

                            <div className="profile-section">

                                <h2>
                                    Personal Information
                                </h2>

                                <div className="profile-info-grid">

                                    <div className="profile-info">
                                        <span>
                                            Full Name
                                        </span>

                                        <strong>
                                            {profile.full_name}
                                        </strong>
                                    </div>


                                    <div className="profile-info">
                                        <span>
                                            College
                                        </span>

                                        <strong>
                                            {profile.college}
                                        </strong>
                                    </div>


                                    <div className="profile-info">
                                        <span>
                                            Branch
                                        </span>

                                        <strong>
                                            {profile.branch}
                                        </strong>
                                    </div>


                                    <div className="profile-info">
                                        <span>
                                            Current Year
                                        </span>

                                        <strong>
                                            {profile.year}
                                            {profile.year === 1
                                                ? "st Year"
                                                : profile.year === 2
                                                ? "nd Year"
                                                : profile.year === 3
                                                ? "rd Year"
                                                : "th Year"}
                                        </strong>
                                    </div>

                                </div>

                            </div>


                            <div className="profile-section">

                                <h2>
                                    Career Information
                                </h2>

                                <div className="profile-info-grid">

                                    <div className="profile-info">
                                        <span>
                                            Career Goal
                                        </span>

                                        <strong>
                                            {careerName}
                                        </strong>
                                    </div>


                                    <div className="profile-info">
                                        <span>
                                            Learning Level
                                        </span>

                                        <strong>
                                            {profile.learning_level}
                                        </strong>
                                    </div>

                                </div>

                            </div>


                            <div className="profile-section">

                                <h2>
                                    About You
                                </h2>

                                <div className="profile-bio">

                                    {profile.bio
                                        ? profile.bio
                                        : "No bio added yet."}

                                </div>

                            </div>


                            <div className="profile-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() =>
                                        navigate("/dashboard")
                                    }
                                >
                                    Back to Dashboard
                                </button>


                                <button
                                    type="button"
                                    className="save-button"
                                    onClick={handleEdit}
                                >
                                    ✏️ Edit Profile
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    // ==============================
    // CREATE / EDIT FORM
    // ==============================

    return (
        <div className="profile-page">

            <div className="profile-container">

                <div className="profile-header">

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                    <h1>
                        {profile
                            ? "Edit Your Profile"
                            : "Complete Your Profile"}
                    </h1>

                    <p>
                        {profile
                            ? "Update your profile information."
                            : "Tell us about yourself so we can personalize your career journey."}
                    </p>

                </div>


                <div className="profile-card">

                    {error && (
                        <div className="profile-error">
                            {error}
                        </div>
                    )}


                    {success && (
                        <div className="profile-success">
                            {success}
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>

                        {/* =========================
                            PERSONAL INFORMATION
                        ========================== */}

                        <div className="section-title">
                            Personal Information
                        </div>


                        <div className="form-row">

                            <div className="profile-form-group">

                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                />

                            </div>


                            <div className="profile-form-group">

                                <label>
                                    College
                                </label>

                                <input
                                    type="text"
                                    name="college"
                                    value={formData.college}
                                    onChange={handleChange}
                                    placeholder="Enter your college"
                                    required
                                />

                            </div>

                        </div>


                        <div className="form-row">

                            <div className="profile-form-group">

                                <label>
                                    Branch
                                </label>

                                <input
                                    type="text"
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    placeholder="e.g. Computer Science"
                                    required
                                />

                            </div>


                            <div className="profile-form-group">

                                <label>
                                    Current Year
                                </label>

                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select year
                                    </option>

                                    <option value="1">
                                        1st Year
                                    </option>

                                    <option value="2">
                                        2nd Year
                                    </option>

                                    <option value="3">
                                        3rd Year
                                    </option>

                                    <option value="4">
                                        4th Year
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* =========================
                            CAREER INFORMATION
                        ========================== */}

                        <div className="section-title">
                            Career Information
                        </div>


                        <div className="profile-form-group">

                            <label>
                                Career Goal
                            </label>

                            <select
                                name="career_goal"
                                value={formData.career_goal}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select your career goal
                                </option>

                                {careerGoals.map(
                                    (career) => (

                                        <option
                                            key={career.id}
                                            value={career.id}
                                        >
                                            {career.title ||
                                                career.name}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="profile-form-group">

                            <label>
                                Learning Level
                            </label>

                            <select
                                name="learning_level"
                                value={
                                    formData.learning_level
                                }
                                onChange={handleChange}
                                required
                            >

                                <option value="Beginner">
                                    Beginner
                                </option>

                                <option value="Intermediate">
                                    Intermediate
                                </option>

                                <option value="Advanced">
                                    Advanced
                                </option>

                            </select>

                        </div>


                        {/* =========================
                            BIO
                        ========================== */}

                        <div className="profile-form-group">

                            <label>
                                About You
                            </label>

                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell us about your interests, goals and experience..."
                                rows="5"
                            />

                        </div>


                        {/* =========================
                            BUTTONS
                        ========================== */}

                        <div className="profile-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={
                                    profile
                                        ? handleCancelEdit
                                        : () =>
                                            navigate(
                                                "/dashboard"
                                            )
                                }
                            >
                                {profile
                                    ? "Cancel Edit"
                                    : "Cancel"}
                            </button>


                            <button
                                type="submit"
                                className="save-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : profile
                                    ? "Update Profile"
                                    : "Save Profile"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Profile;