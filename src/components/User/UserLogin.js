import React, { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import "./UserLogin.css";
import { saveAuthSession } from "./authSession";
import useActiveShopColor from "../Shop/useActiveShopColor";
import { fetchLocalEnvironmentColor } from "../Shop/databaseEnvironment";

const UserLogin = () => {
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

    useEffect(() => {
        if (sessionExpired) {
            window.history.replaceState({}, "", "/login");
        }
    }, [sessionExpired]);

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
            className="login-page"
            style={{ "--shop-color": activeShopColor || "#4f2d23" }}
        >
            <section className="login-overview" aria-labelledby="login-heading">
                <div className="login-brand-mark" aria-hidden="true">
                    <span>☕</span>
                    <span>📦</span>
                </div>
                <span className="login-eyebrow">Internal business system</span>
                <h1 id="login-heading">Operations, all in one place.</h1>
                <p>
                    Sign in to manage sales, stock, purchasing, customer orders,
                    expenses, and business reporting.
                </p>

                <div className="login-module-grid" aria-label="System modules">
                    <div><span aria-hidden="true">▦</span> POS & sales</div>
                    <div><span aria-hidden="true">□</span> Inventory</div>
                    <div><span aria-hidden="true">↗</span> Purchase orders</div>
                    <div><span aria-hidden="true">⌁</span> Reports & accounts</div>
                </div>
            </section>

            <section className="login-card" aria-label="Login form">
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
            </section>
        </main>
    );
};

export default UserLogin;
