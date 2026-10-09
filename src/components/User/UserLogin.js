import React, { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import "./UserLogin.css";
import { saveAuthSession } from "./authSession";
import useActiveShopColor from "../Shop/useActiveShopColor";
import {
    ACTIVE_SHOP_COLOR_KEY,
    fetchLocalEnvironmentColor,
    getEnvironmentColor,
} from "../Shop/databaseEnvironment";

const graduatePhotos = Array.from({ length: 6 }, (_, index) => ({
    src: `${process.env.PUBLIC_URL}/graduates/p${index + 1}.jpg`,
    alt: `MDR graduate portrait ${index + 1} of 6`,
}));

const UserLogin = ({ showLoginForm = true }) => {
    const activeShopColor = useActiveShopColor();
    const [sessionExpired, setSessionExpired] = useState(
        () => new URLSearchParams(window.location.search).get("reason") === "session-expired"
    );
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeGraduate, setActiveGraduate] = useState(0);
    const [isCarouselPaused, setIsCarouselPaused] = useState(false);

    useEffect(() => {
        if (sessionExpired) {
            window.history.replaceState({}, "", window.location.pathname);
        }
    }, [sessionExpired]);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (isCarouselPaused || prefersReducedMotion) return undefined;

        const timer = window.setInterval(() => {
            setActiveGraduate((current) => (current + 1) % graduatePhotos.length);
        }, 4500);

        return () => window.clearInterval(timer);
    }, [isCarouselPaused]);

    const showPreviousGraduate = () => {
        setActiveGraduate((current) =>
            (current - 1 + graduatePhotos.length) % graduatePhotos.length
        );
    };

    const showNextGraduate = () => {
        setActiveGraduate((current) => (current + 1) % graduatePhotos.length);
    };

    const updateField = (event) => {
        const { name, value } = event.target;
        setCredentials((current) => ({ ...current, [name]: value }));
        setErrors((current) => ({ ...current, [name]: undefined, form: undefined }));
        setSessionExpired(false);
    };

    const validateForm = () => {
        const validationErrors = {};

        if (!credentials.email.trim()) {
            validationErrors.email = "Please enter your email address.";
        }

        if (!credentials.password) {
            validationErrors.password = "Please enter your password.";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const login = async (event) => {
        event.preventDefault();
        setSessionExpired(false);
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await axios.get("/sanctum/csrf-cookie");
            const response = await axios.post("/api/login", credentials);
            const status = Number(response.data.status);

            if (status >= 200 && status < 300) {
                const responseColor = getEnvironmentColor(response.data?.data || response.data);
                if (responseColor) {
                    localStorage.setItem(ACTIVE_SHOP_COLOR_KEY, responseColor);
                }

                if (!saveAuthSession(response.data)) {
                    setErrors({
                        form: "The server did not provide a valid session expiration. Please sign in again.",
                    });
                    return;
                }

                try {
                    await fetchLocalEnvironmentColor();
                } catch (environmentError) {
                    console.error("Unable to load the database environment.", environmentError);
                }

                const destination =
                    `/shopOrderTransaction/customerOrderTransactionList/${moment().format("YYYY-MM-DD")}`;

                window.location.replace(destination);
                return;
            }

            if (status === 401) {
                setErrors({ form: response.data.message || "The email or password is incorrect." });
                return;
            }

            setErrors(response.data.validator_errors || {
                form: response.data.message || "Unable to sign in. Please try again.",
            });
        } catch (error) {
            setErrors({
                form: error.response?.data?.message || "Unable to connect. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getError = (field) => {
        const error = errors[field];
        return Array.isArray(error) ? error[0] : error;
    };

    return (
        <main
            className={`login-page${showLoginForm ? "" : " celebration-only"}`}
            style={{
                "--shop-color": activeShopColor || "#4f2d23",
                "--graduates-background": `url(${process.env.PUBLIC_URL}/pup-graduates-2026.jpg)`,
            }}
        >
            <section className="login-overview" aria-labelledby="login-heading">
                <div
                    className="login-graduate-carousel"
                    aria-label="MDR graduate portraits"
                    onMouseEnter={() => setIsCarouselPaused(true)}
                    onMouseLeave={() => setIsCarouselPaused(false)}
                    onFocus={() => setIsCarouselPaused(true)}
                    onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget)) {
                            setIsCarouselPaused(false);
                        }
                    }}
                >
                    <div className="login-graduate-slides">
                        {graduatePhotos.map((photo, index) => (
                            <img
                                key={photo.src}
                                className={index === activeGraduate ? "active" : ""}
                                src={photo.src}
                                alt={index === activeGraduate ? photo.alt : ""}
                                aria-hidden={index !== activeGraduate}
                                loading={index === 0 ? "eager" : "lazy"}
                            />
                        ))}
                    </div>

                    <button
                        className="login-carousel-arrow previous"
                        type="button"
                        onClick={showPreviousGraduate}
                        aria-label="Show previous graduate"
                    >
                        ‹
                    </button>
                    <button
                        className="login-carousel-arrow next"
                        type="button"
                        onClick={showNextGraduate}
                        aria-label="Show next graduate"
                    >
                        ›
                    </button>

                    <div className="login-carousel-dots" aria-label="Choose a graduate portrait">
                        {graduatePhotos.map((photo, index) => (
                            <button
                                key={photo.src}
                                className={index === activeGraduate ? "active" : ""}
                                type="button"
                                onClick={() => setActiveGraduate(index)}
                                aria-label={`Show graduate portrait ${index + 1}`}
                                aria-current={index === activeGraduate ? "true" : undefined}
                            />
                        ))}
                    </div>
                </div>

                <div className="login-welcome-copy">
                    <span className="login-eyebrow">Celebrating our team</span>
                    <h1 id="login-heading">Congratulations, PUP graduates!</h1>
                    <p>
                        Your MDR family is proud of this incredible milestone. Your
                        hard work, perseverance, and dedication inspire us all.
                    </p>
                </div>
            </section>

            {showLoginForm && <section className="login-card" aria-label="Login form">
                <div className="login-card-heading">
                    <span className="login-lock" aria-hidden="true">🔐</span>
                    <div>
                        <h2>Welcome back</h2>
                        <p>Enter your staff account details.</p>
                    </div>
                </div>

                {errors.form && <Alert variant="danger">{errors.form}</Alert>}
                {sessionExpired && !errors.form && (
                    <Alert variant="warning">Your previous session expired. Please sign in again.</Alert>
                )}

                <Form noValidate onSubmit={login}>
                    <Form.Group className="mb-3" controlId="loginEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={credentials.email}
                            placeholder="you@mdrbakingsupplies.com"
                            onChange={updateField}
                            isInvalid={Boolean(getError("email"))}
                            autoComplete="email"
                            autoFocus
                        />
                        <Form.Control.Feedback type="invalid">
                            {getError("email")}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="loginPassword">
                        <div className="login-label-row">
                            <Form.Label>Password</Form.Label>
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>
                        <div className="login-password-input">
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={credentials.password}
                                placeholder="Enter your password"
                                onChange={updateField}
                                isInvalid={Boolean(getError("password"))}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((visible) => !visible)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {getError("password") && (
                            <div className="login-field-error">{getError("password")}</div>
                        )}
                    </Form.Group>

                    <Button className="login-submit" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Signing in…" : "Sign in to system"}
                    </Button>
                </Form>

                <p className="login-register">
                    Forgot your credentials? <Link to="/forgot-password">Reset your password</Link>
                </p>

                <div className="login-security-note">
                    <span aria-hidden="true">✓</span>
                    <p>
                        <strong>Authorized personnel only</strong>
                        Your session and account access are protected.
                    </p>
                </div>
            </section>}
        </main>
    );
};

export default UserLogin;
