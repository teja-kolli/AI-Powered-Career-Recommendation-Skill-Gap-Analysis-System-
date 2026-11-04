import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Learning.css";

function Learning() {
    const navigate = useNavigate();

    const [learning, setLearning] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLearning();
    }, []);

    const loadLearning = async () => {
        try {
            const response = await api.get("learning/");

            console.log("====================================");
            console.log("LEARNING API RESPONSE:", response.data);
            console.log(
                "IS ARRAY:",
                Array.isArray(response.data)
            );
            console.log("====================================");

            // Handle both:
            // 1. Direct array response
            // 2. Django REST Framework paginated response
            const data = Array.isArray(response.data)
                ? response.data
                : Array.isArray(response.data?.results)
                    ? response.data.results
                    : [];

            setLearning(data);

        } catch (error) {
            console.error("LEARNING API ERROR:", error);

            // Prevent .map() error if API fails
            setLearning([]);

        } finally {
            setLoading(false);
        }
    };

    const getProgress = (item) =>
        item.progress ??
        item.progress_percentage ??
        item.completion_percentage ??
        0;

    if (loading) {
        return (
            <div className="learning-loading">
                Loading learning progress...
            </div>
        );
    }

    return (
        <div className="learning-page">

            <div className="learning-container">

                <button
                    className="learning-back"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>

                <div className="learning-header">

                    <span>
                        YOUR LEARNING JOURNEY
                    </span>

                    <h1>
                        Learning Progress
                    </h1>

                    <p>
                        Track your progress and keep moving
                        toward your career goal.
                    </p>

                </div>

                <div className="learning-grid">

                    {Array.isArray(learning) &&
                        learning.map((item) => {

                            const progress = Number(
                                getProgress(item)
                            );

                            return (
                                <div
                                    className="learning-card"
                                    key={item.id}
                                >

                                    <div className="learning-top">

                                        <div className="learning-icon">
                                            📚
                                        </div>

                                        <strong>
                                            {progress}%
                                        </strong>

                                    </div>

                                    <h2>
                                        {item.course_name ||
                                            item.course?.title ||
                                            item.title ||
                                            item.name ||
                                            "Learning Resource"}
                                    </h2>

                                    <p>
                                        {item.description ||
                                            "Continue learning and improve your career readiness."}
                                    </p>

                                    <div className="learning-progress">

                                        <div
                                            style={{
                                                width: `${Math.min(
                                                    100,
                                                    Math.max(0, progress)
                                                )}%`
                                            }}
                                        />

                                    </div>

                                    <div className="learning-footer">

                                        <span>
                                            {progress >= 100
                                                ? "Completed"
                                                : "In Progress"}
                                        </span>

                                        {item.link && (
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Continue →
                                            </a>
                                        )}

                                    </div>

                                </div>
                            );
                        })}

                    {learning.length === 0 && (
                        <div className="learning-empty">
                            <h2>
                                No learning resources yet
                            </h2>

                            <p>
                                Your personalized learning resources
                                will appear here.
                            </p>
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Learning;