import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";


function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        // Password confirmation

        if (
            formData.password !==
            formData.confirmPassword
        ) {

            setError("Passwords do not match.");

            return;
        }


        // Password length

        if (formData.password.length < 8) {

            setError(
                "Password must contain at least 8 characters."
            );

            return;
        }


        setLoading(true);


        try {

            await api.post(
                "auth/register/",
                {
                    username: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                }
            );


            // Registration successful

            navigate("/login");

        } catch (error) {

            console.error(error);


            if (error.response?.data) {

                const data = error.response.data;

                if (data.username) {
                    setError(data.username[0]);
                }

                else if (data.email) {
                    setError(data.email[0]);
                }

                else if (data.password) {
                    setError(data.password[0]);
                }

                else {
                    setError(
                        "Registration failed. Please check your details."
                    );
                }

            }

            else {

                setError(
                    "Unable to connect to the server."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-container">


                {/* LEFT SIDE */}

                <div className="auth-left">

                    <div className="brand">
                        Career<span>AI</span>
                    </div>


                    <div className="auth-left-content">

                        <h1>
                            Your career.
                            <br />
                            Your path.
                        </h1>


                        <p>
                            Create your Career Taste Fingerprint
                            and discover the skills, courses,
                            projects and career paths that match
                            your goals.
                        </p>


                        <div className="feature-list">

                            <div className="feature">
                                <span>✓</span>
                                Discover Your Career Direction
                            </div>

                            <div className="feature">
                                <span>✓</span>
                                Find Your Skill Gaps
                            </div>

                            <div className="feature">
                                <span>✓</span>
                                Get Personalized Learning Paths
                            </div>

                        </div>

                    </div>

                </div>


                {/* RIGHT SIDE */}

                <div className="auth-right">

                    <div className="auth-card register-card">

                        <h2>Create Account</h2>

                        <p className="auth-subtitle">
                            Start your personalized career journey
                        </p>


                        {/* ERROR */}

                        {error && (

                            <div className="error-message">
                                {error}
                            </div>

                        )}


                        <form onSubmit={handleSubmit}>


                            {/* USERNAME */}

                            <div className="form-group">

                                <label>
                                    Username
                                </label>

                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Choose a username"
                                    required
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="form-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                />

                            </div>


                            {/* PHONE */}

                            <div className="form-group">

                                <label>
                                    Phone
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                />

                            </div>


                            {/* PASSWORD */}

                            <div className="form-group">

                                <label>
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    required
                                />

                            </div>


                            {/* CONFIRM PASSWORD */}

                            <div className="form-group">

                                <label>
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    required
                                />

                            </div>


                            {/* BUTTON */}

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={loading}
                            >

                                {loading
                                    ? "Creating Account..."
                                    : "Create Account"
                                }

                            </button>

                        </form>


                        <p className="switch-auth">

                            Already have an account?

                            <Link to="/login">
                                Login
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Register;