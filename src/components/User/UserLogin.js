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

const raisonPhotos = [
    {
        src: `${process.env.PUBLIC_URL}/raison/raison-champion-1.png`,
        alt: "Raison holding his championship trophy and award",
    },
    {
        src: `${process.env.PUBLIC_URL}/raison/raison-champion-2.png`,
        alt: "Raison celebrating his championship win on stage",
    },
];

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
    const [activeRaisonPhoto, setActiveRaisonPhoto] = useState(0);
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
            setActiveRaisonPhoto((current) => (current + 1) % raisonPhotos.length);
        }, 4500);

        return () => window.clearInterval(timer);
    }, [isCarouselPaused]);

    const showPreviousRaisonPhoto = () => {
        setActiveRaisonPhoto((current) =>
            (current - 1 + raisonPhotos.length) % raisonPhotos.length
        );
    };

    const showNextRaisonPhoto = () => {
        setActiveRaisonPhoto((current) => (current + 1) % raisonPhotos.length);
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
                "--celebration-background": `url(${process.env.PUBLIC_URL}/raison/raison-champion-1.png)`,
            }}
        >
            <section className="login-overview" aria-labelledby="login-heading">
                <div
                    className="login-celebration-carousel"
                    aria-label="Raison championship photos"
                    onMouseEnter={() => setIsCarouselPaused(true)}
                    onMouseLeave={() => setIsCarouselPaused(false)}
                    onFocus={() => setIsCarouselPaused(true)}
                    onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget)) {
                            setIsCarouselPaused(false);
                        }
                    }}
                >
                    <div className="login-celebration-slides">
                        {raisonPhotos.map((photo, index) => (
                            <img
                                key={photo.src}
                                className={index === activeRaisonPhoto ? "active" : ""}
                                src={photo.src}
                                alt={index === activeRaisonPhoto ? photo.alt : ""}
                                aria-hidden={index !== activeRaisonPhoto}
                                loading={index === 0 ? "eager" : "lazy"}
                            />
                        ))}
                    </div>

                    <button
                        className="login-carousel-arrow previous"
                        type="button"
                        onClick={showPreviousRaisonPhoto}
                        aria-label="Show previous Raison photo"
                    >
                        ‹
                    </button>
                    <button
                        className="login-carousel-arrow next"
                        type="button"
                        onClick={showNextRaisonPhoto}
                        aria-label="Show next Raison photo"
                    >
                        ›
                    </button>

                    <div className="login-carousel-dots" aria-label="Choose a Raison photo">
                        {raisonPhotos.map((photo, index) => (
                            <button
                                key={photo.src}
                                className={index === activeRaisonPhoto ? "active" : ""}
                                type="button"
                                onClick={() => setActiveRaisonPhoto(index)}
                                aria-label={`Show Raison photo ${index + 1}`}
                                aria-current={index === activeRaisonPhoto ? "true" : undefined}
                            />
                        ))}
                    </div>
                </div>

                <div className="login-welcome-copy">
                    <span className="login-eyebrow">Celebrating our champion</span>
                    <h1 id="login-heading">Congratulations, Raison!</h1>
                    <p>
                        Your MDR family is proud of your championship achievement.
                        Your discipline, hard work, and dedication inspire us all.
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
