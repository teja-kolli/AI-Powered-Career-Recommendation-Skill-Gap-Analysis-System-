
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
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
        setLoading(true);

        try {
            const response = await api.post(
                "auth/login/",
                {
                    username: formData.username,
                    password: formData.password,
                }
            );

            console.log("LOGIN RESPONSE:", response.data);

            const accessToken = response.data.access;
            const refreshToken = response.data.refresh;

            // Check if access token was received
            if (!accessToken) {
                setError("Login failed. Access token was not received.");
                return;
            }

            // Save JWT tokens
            localStorage.setItem(
                "access_token",
                accessToken
            );

            if (refreshToken) {
                localStorage.setItem(
                    "refresh_token",
                    refreshToken
                );
            }

            // Get user information
            const loggedInUser = response.data.user || {
                username: formData.username,
            };

            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify(loggedInUser)
            );

            // Update AuthContext
            login(loggedInUser);

            console.log("LOGIN SUCCESS");
            console.log("USER:", loggedInUser);

            // Go to Dashboard
            navigate("/dashboard");

        } catch (error) {
            console.error("LOGIN ERROR:", error);

            if (error.response) {
                console.log(
                    "SERVER ERROR:",
                    error.response.data
                );

                const data = error.response.data;

                if (data.detail) {
                    setError(data.detail);
                } else if (data.non_field_errors) {
                    setError(data.non_field_errors[0]);
                } else if (data.username) {
                    setError(data.username[0]);
                } else if (data.password) {
                    setError(data.password[0]);
                } else {
                    setError(
                        "Invalid username or password."
                    );
                }
            } else if (error.request) {
                setError(
                    "Unable to connect to the server."
                );
            } else {
                setError(
                    "Something went wrong. Please try again."
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
                            Build the career
                            <br />
                            you actually want.
                        </h1>

                        <p>
                            Get personalized career guidance,
                            skill recommendations, learning
                            roadmaps and placement preparation
                            powered by AI.
                        </p>

                        <div className="feature-list">

                            <div className="feature">
                                <span>✓</span>
                                Personalized Career Roadmap
                            </div>

                            <div className="feature">
                                <span>✓</span>
                                AI Skill Gap Analysis
                            </div>

                            <div className="feature">
                                <span>✓</span>
                                Smart Course & Project Recommendations
                            </div>

                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE */}

                <div className="auth-right">

                    <div className="auth-card">

                        <h2>
                            Welcome Back
                        </h2>

                        <p className="auth-subtitle">
                            Login to continue your career journey
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
                                    placeholder="Enter your username"
                                    required
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
                                    placeholder="Enter your password"
                                    required
                                />

                            </div>

                            {/* FORGOT PASSWORD */}

                            <div className="forgot">

                                <a href="#">
                                    Forgot password?
                                </a>

                            </div>

                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Logging in..."
                                    : "Login"
                                }
                            </button>

                        </form>

                        <div className="divider">
                            <span>OR</span>
                        </div>

                        <p className="switch-auth">

                            Don't have an account?

                            <Link to="/register">
                                Create Account
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;

