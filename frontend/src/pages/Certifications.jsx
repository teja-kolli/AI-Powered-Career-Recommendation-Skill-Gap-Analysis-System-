import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Certifications.css";

function Certifications() {
    const navigate = useNavigate();

    const [certificates, setCertificates] = useState([]);

    const [certificateName, setCertificateName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // LOAD CERTIFICATES
    // =====================================================

    useEffect(() => {
        loadCertificates();
    }, []);

    const loadCertificates = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "certifications/student-certificates/"
            );

            console.log(
                "===================================="
            );
            console.log(
                "STUDENT CERTIFICATES RESPONSE:"
            );
            console.log(response.data);
            console.log(
                "===================================="
            );

            const data = response.data;

            if (Array.isArray(data)) {
                setCertificates(data);
            } else if (Array.isArray(data.results)) {
                setCertificates(data.results);
            } else {
                console.error(
                    "Unexpected response format:",
                    data
                );

                setCertificates([]);
            }

        } catch (error) {

            console.error(
                "===================================="
            );

            console.error(
                "LOAD CERTIFICATES ERROR"
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            console.error(
                "MESSAGE:",
                error.message
            );

            console.error(
                "===================================="
            );

            setError(
                getServerErrorMessage(error)
            );

        } finally {
            setLoading(false);
        }
    };


    // =====================================================
    // FILE SELECT
    // =====================================================

    const handleFileChange = (event) => {

        const file = event.target.files[0];

        setError("");
        setSuccess("");

        if (!file) {
            setSelectedFile(null);
            return;
        }

        console.log(
            "SELECTED FILE:",
            file
        );

        console.log(
            "FILE NAME:",
            file.name
        );

        console.log(
            "FILE TYPE:",
            file.type
        );

        console.log(
            "FILE SIZE:",
            file.size
        );


        // Allowed file types

        const allowedTypes = [
            "application/pdf",
            "image/png",
            "image/jpeg",
            "image/jpg"
        ];

        if (!allowedTypes.includes(file.type)) {

            setError(
                `Invalid file type: ${file.type}. ` +
                `Please upload PDF, PNG, JPG or JPEG.`
            );

            setSelectedFile(null);

            event.target.value = "";

            return;
        }


        // 10 MB maximum

        if (file.size > 10 * 1024 * 1024) {

            setError(
                "File size must be less than 10 MB."
            );

            setSelectedFile(null);

            event.target.value = "";

            return;
        }


        setSelectedFile(file);
    };


    // =====================================================
    // UPLOAD
    // =====================================================

    const handleUpload = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        console.log(
            "===================================="
        );

        console.log(
            "STARTING CERTIFICATE UPLOAD"
        );


        // Check file

        if (!selectedFile) {

            setError(
                "Please select a certificate file."
            );

            console.error(
                "NO FILE SELECTED"
            );

            return;
        }


        try {

            setUploading(true);


            // =================================================
            // CREATE FORMDATA
            // =================================================

            const formData = new FormData();

            formData.append(
                "name",
                certificateName.trim()
            );

            formData.append(
                "file",
                selectedFile
            );


            console.log(
                "CERTIFICATE NAME:",
                certificateName.trim()
            );

            console.log(
                "FILE:",
                selectedFile
            );


            // Debug FormData

            console.log(
                "FORM DATA CONTENT:"
            );

            for (const [key, value] of formData.entries()) {

                console.log(
                    key,
                    value
                );

            }


            console.log(
                "SENDING REQUEST TO:"
            );

            console.log(
                "certifications/student-certificates/"
            );


            // =================================================
            // POST REQUEST
            // =================================================

            const response = await api.post(
                "certifications/student-certificates/",
                formData
            );


            // =================================================
            // SUCCESS
            // =================================================

            console.log(
                "===================================="
            );

            console.log(
                "UPLOAD SUCCESS"
            );

            console.log(
                "STATUS:",
                response.status
            );

            console.log(
                "RESPONSE:",
                response.data
            );

            console.log(
                "===================================="
            );


            setCertificates((previous) => [
                response.data,
                ...previous
            ]);


            setCertificateName("");

            setSelectedFile(null);


            // Reset file input

            const fileInput =
                document.getElementById(
                    "certificate-file"
                );

            if (fileInput) {
                fileInput.value = "";
            }


            setSuccess(
                "Certificate uploaded successfully!"
            );


        } catch (error) {

            // =================================================
            // DETAILED ERROR
            // =================================================

            console.error(
                "===================================="
            );

            console.error(
                "CERTIFICATE UPLOAD FAILED"
            );

            console.error(
                "===================================="
            );

            console.error(
                "ERROR OBJECT:",
                error
            );

            console.error(
                "ERROR MESSAGE:",
                error.message
            );

            console.error(
                "HTTP STATUS:",
                error.response?.status
            );

            console.error(
                "SERVER DATA:",
                error.response?.data
            );

            console.error(
                "SERVER HEADERS:",
                error.response?.headers
            );

            console.error(
                "REQUEST URL:",
                error.config?.url
            );

            console.error(
                "REQUEST METHOD:",
                error.config?.method
            );

            console.error(
                "REQUEST HEADERS:",
                error.config?.headers
            );

            console.error(
                "===================================="
            );


            // Show exact Django error

            setError(
                getServerErrorMessage(error)
            );

        } finally {

            setUploading(false);

        }
    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this certificate?"
        );

        if (!confirmed) {
            return;
        }


        try {

            setError("");
            setSuccess("");


            console.log(
                "Deleting certificate:",
                id
            );


            const response = await api.delete(
                `certifications/student-certificates/${id}/`
            );


            console.log(
                "DELETE RESPONSE:",
                response.status
            );


            setCertificates((previous) =>
                previous.filter(
                    (certificate) =>
                        certificate.id !== id
                )
            );


            setSuccess(
                "Certificate deleted successfully."
            );


        } catch (error) {

            console.error(
                "DELETE ERROR:",
                error
            );

            console.error(
                "DELETE SERVER DATA:",
                error.response?.data
            );


            setError(
                getServerErrorMessage(error)
            );
        }
    };


    // =====================================================
    // SERVER ERROR MESSAGE
    // =====================================================

    const getServerErrorMessage = (error) => {

        const data = error.response?.data;


        if (!data) {

            return (
                "No response received from the server. " +
                "Check whether Django is running."
            );
        }


        // DRF detail

        if (data.detail) {
            return `Server error: ${data.detail}`;
        }


        // Serializer validation errors

        if (typeof data === "object") {

            const messages = [];

            Object.entries(data).forEach(
                ([field, value]) => {

                    if (Array.isArray(value)) {

                        messages.push(
                            `${field}: ${value.join(", ")}`
                        );

                    } else if (
                        typeof value === "object"
                    ) {

                        messages.push(
                            `${field}: ${JSON.stringify(value)}`
                        );

                    } else {

                        messages.push(
                            `${field}: ${value}`
                        );
                    }
                }
            );


            if (messages.length > 0) {

                return messages.join(" | ");

            }
        }


        if (typeof data === "string") {

            return data;

        }


        return (
            "Upload failed. Check the browser console " +
            "and Django terminal for the exact error."
        );
    };


    // =====================================================
    // IMAGE CHECK
    // =====================================================

    const isImageFile = (fileUrl) => {

        if (!fileUrl) {
            return false;
        }

        return /\.(jpg|jpeg|png|webp)$/i.test(
            fileUrl
        );
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="cert-loading">
                Loading your certificates...
            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="cert-page">

            <div className="cert-container">


                {/* BACK */}

                <button
                    className="cert-back"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>


                {/* HEADER */}

                <div className="cert-header">

                    <span>
                        YOUR CREDENTIALS
                    </span>

                    <h1>
                        My Certifications
                    </h1>

                    <p>
                        Upload your certificates so they
                        can be analyzed and used to
                        personalize your career profile.
                    </p>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="cert-error">

                        <strong>
                            Error:
                        </strong>{" "}

                        {error}

                    </div>

                )}


                {/* SUCCESS */}

                {success && (

                    <div className="cert-success">

                        {success}

                    </div>

                )}


                {/* UPLOAD CARD */}

                <div className="cert-upload-card">

                    <div className="cert-upload-icon">
                        📜
                    </div>


                    <h2>
                        Upload Your Certificate
                    </h2>


                    <p>
                        Upload a certificate you have earned.
                        PDF, JPG, PNG and JPEG files are
                        supported. Maximum size: 10 MB.
                    </p>


                    <form
                        onSubmit={handleUpload}
                    >


                        {/* NAME */}

                        <div className="cert-form-group">

                            <label>
                                Certificate Name
                            </label>

                            <input
                                type="text"
                                value={certificateName}
                                onChange={(event) =>
                                    setCertificateName(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. AWS Cloud Practitioner"
                            />

                        </div>


                        {/* FILE */}

                        <div className="cert-form-group">

                            <label>
                                Certificate File
                            </label>

                            <input
                                id="certificate-file"
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={handleFileChange}
                            />

                        </div>


                        {/* SELECTED FILE */}

                        {selectedFile && (

                            <div className="selected-certificate">

                                📎{" "}

                                {selectedFile.name}

                                <br />

                                <small>
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)}
                                    {" MB"}
                                </small>

                            </div>

                        )}


                        {/* UPLOAD */}

                        <button
                            type="submit"
                            className="cert-upload-button"
                            disabled={uploading}
                        >

                            {uploading
                                ? "Uploading..."
                                : "＋ Upload Certificate"}

                        </button>

                    </form>

                </div>


                {/* UPLOADED SECTION */}

                <div className="uploaded-certificates">

                    <div className="uploaded-header">

                        <div>

                            <span>
                                YOUR CREDENTIALS
                            </span>

                            <h2>
                                Uploaded Certificates
                            </h2>

                        </div>


                        <div className="certificate-count">

                            {certificates.length}

                        </div>

                    </div>


                    {/* EMPTY */}

                    {certificates.length === 0 ? (

                        <div className="cert-empty">

                            <div className="cert-empty-icon">
                                🏆
                            </div>

                            <h2>
                                No certificates uploaded yet
                            </h2>

                            <p>
                                Upload your certificates to
                                include them in your career
                                analysis.
                            </p>

                        </div>

                    ) : (


                        /* CERTIFICATE GRID */

                        <div className="cert-grid">

                            {certificates.map(
                                (certificate) => (

                                    <div
                                        className="cert-card"
                                        key={
                                            certificate.id
                                        }
                                    >


                                        {/* PREVIEW */}

                                        <div className="cert-image-wrapper">

                                            {isImageFile(
                                                certificate.file
                                            ) ? (

                                                <img
                                                    src={
                                                        certificate.file
                                                    }
                                                    alt={
                                                        certificate.name ||
                                                        "Certificate"
                                                    }
                                                    className="cert-image"
                                                />

                                            ) : (

                                                <div className="cert-icon">
                                                    📄
                                                </div>

                                            )}

                                        </div>


                                        {/* NAME */}

                                        <h2>

                                            {certificate.name ||
                                                "Uploaded Certificate"}

                                        </h2>


                                        {/* FILE */}

                                        <p className="cert-description">

                                            {certificate.file
                                                ? certificate.file
                                                    .split("/")
                                                    .pop()
                                                : "Certificate file"}

                                        </p>


                                        {/* STATUS */}

                                        <div className="cert-analysis-status">

                                            {certificate.analyzed
                                                ? "✓ Analyzed"
                                                : "⏳ Waiting for analysis"}

                                        </div>


                                        {/* ACTIONS */}

                                        <div className="cert-actions">


                                            {certificate.file && (

                                                <a
                                                    href={
                                                        certificate.file
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="cert-link"
                                                >
                                                    View Certificate
                                                </a>

                                            )}


                                            <button
                                                type="button"
                                                className="cert-delete"
                                                onClick={() =>
                                                    handleDelete(
                                                        certificate.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>


                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* FOOTER */}

                <div className="cert-footer">

                    <button
                        className="cert-continue"
                        onClick={() =>
                            navigate("/fingerprint")
                        }
                    >
                        Build My Career Fingerprint →
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Certifications;