import React, { useMemo, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import UserService from "./UserService.service";
import "./UserLogin.css";
import { clearAuthSession } from "./authSession";

const passwordChecks = [
    { label: "At least 12 characters", test: (password) => password.length >= 12 },
    { label: "One uppercase letter", test: (password) => /[A-Z]/.test(password) },
    { label: "One lowercase letter", test: (password) => /[a-z]/.test(password) },
    { label: "One number", test: (password) => /\d/.test(password) },
    { label: "One special character", test: (password) => /[^A-Za-z0-9]/.test(password) },
];

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState({
        token: searchParams.get("token") || "",
        email: searchParams.get("email") || "",
        password: "",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const passwordStatus = useMemo(
        () => passwordChecks.map((check) => ({ ...check, passed: check.test(form.password) })),
        [form.password]
    );
    const passwordIsStrong = passwordStatus.every((check) => check.passed);

    const updateField = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
        setErrors((current) => ({ ...current, [name]: undefined, form: undefined }));
    };

    const submit = async (event) => {
        event.preventDefault();
        setErrors({});
        setMessage("");

        if (!form.token || !form.email) {
            setErrors({ form: "This password reset link is incomplete or invalid." });
            return;
        }

        if (!passwordIsStrong) {
            setErrors({ password: ["Your password must meet all five security rules."] });
            return;
        }

        if (form.password !== form.password_confirmation) {
            setErrors({ password_confirmation: ["The password confirmation does not match."] });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await UserService.resetPassword(form);
            setMessage(response.data.message);
            clearAuthSession();
            setForm((current) => ({
                ...current,
                password: "",
                password_confirmation: "",
            }));
        } catch (requestError) {
            setErrors(requestError.response?.data?.errors || {
                form: requestError.response?.data?.message || "Unable to reset the password.",
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
        <main className="login-page">
            <section className="login-overview" aria-labelledby="reset-heading">
                <span className="login-eyebrow">Secure account recovery</span>
                <h1 id="reset-heading">Choose a new password.</h1>
                <p>
                    Use at least 12 characters with uppercase and lowercase
                    letters, a number, and a symbol.
                </p>
            </section>

            <section className="login-card" aria-label="Reset password form">
                <div className="login-card-heading">
                    <div>
                        <h2>Reset password</h2>
                        <p>Set a new password for {form.email || "your account"}.</p>
                    </div>
                </div>

                {message && <Alert variant="success">{message}</Alert>}
                {getError("form") && <Alert variant="danger">{getError("form")}</Alert>}

                {!message ? (
                    <Form noValidate onSubmit={submit}>
                        <Form.Group className="mb-3" controlId="resetEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={updateField}
                                isInvalid={Boolean(getError("email"))}
                                autoComplete="email"
                                readOnly={Boolean(searchParams.get("email"))}
                            />
                            <Form.Control.Feedback type="invalid">
                                {getError("email")}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="resetPassword">
                            <Form.Label>New password</Form.Label>
                            <div className="login-password-input">
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={updateField}
                                    isInvalid={Boolean(getError("password"))}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((visible) => !visible)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {getError("password") && (
                                <div className="login-field-error">{getError("password")}</div>
                            )}
                        </Form.Group>

                        <div className="login-password-rules" aria-live="polite">
                            <p>Your new password needs:</p>
                            <ul>
                                {passwordStatus.map((check) => (
                                    <li className={check.passed ? "passed" : ""} key={check.label}>
                                        <span aria-hidden="true">{check.passed ? "✓" : "○"}</span>
                                        {check.label}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Form.Group className="mb-4" controlId="resetPasswordConfirmation">
                            <Form.Label>Confirm new password</Form.Label>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={form.password_confirmation}
                                onChange={updateField}
                                isInvalid={Boolean(getError("password_confirmation"))}
                                autoComplete="new-password"
                            />
                            <Form.Control.Feedback type="invalid">
                                {getError("password_confirmation")}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button className="login-submit" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Resetting…" : "Reset password"}
                        </Button>
                    </Form>
                ) : (
                    <p className="login-register">
                        <Link to="/login">Continue to sign in</Link>
                    </p>
                )}
            </section>
        </main>
    );
};

export default ResetPassword;
