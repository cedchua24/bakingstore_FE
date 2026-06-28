import React, { useMemo, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import UserService from "./UserService.service";
import "./UserChangePassword.css";

const passwordChecks = [
    { label: "At least 12 characters", test: (password) => password.length >= 12 },
    { label: "One uppercase letter", test: (password) => /[A-Z]/.test(password) },
    { label: "One lowercase letter", test: (password) => /[a-z]/.test(password) },
    { label: "One number", test: (password) => /\d/.test(password) },
    { label: "One special character", test: (password) => /[^A-Za-z0-9]/.test(password) },
];

const initialForm = {
    current_password: "",
    password: "",
    password_confirmation: "",
};

const UserChangePassword = () => {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [notice, setNotice] = useState("");
    const [visibleField, setVisibleField] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const passwordStatus = useMemo(
        () => passwordChecks.map((check) => ({ ...check, passed: check.test(form.password) })),
        [form.password]
    );
    const passwordIsStrong = passwordStatus.every((check) => check.passed);
    const passwordsMatch =
        form.password_confirmation.length > 0 &&
        form.password === form.password_confirmation;
    const passwordIsDifferent =
        form.current_password.length > 0 &&
        form.password.length > 0 &&
        form.current_password !== form.password;
    const formIsReady =
        passwordIsStrong &&
        passwordsMatch &&
        passwordIsDifferent;

    const updateField = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
        setErrors((current) => {
            const nextErrors = { ...current, [name]: undefined, form: undefined };

            if (name === "current_password") {
                nextErrors.password = undefined;
            }
            if (name === "password") {
                nextErrors.password_confirmation = undefined;
            }

            return nextErrors;
        });
        setNotice("");
    };

    const getError = (field) => {
        const error = errors[field];
        return Array.isArray(error) ? error[0] : error;
    };

    const validateForm = () => {
        const validationErrors = {};

        if (!form.current_password) {
            validationErrors.current_password = "Please enter your current password.";
        }
        if (!passwordIsStrong) {
            validationErrors.password = "Your new password must meet all five security rules.";
        }
        if (!form.password_confirmation) {
            validationErrors.password_confirmation = "Please confirm your new password.";
        } else if (!passwordsMatch) {
            validationErrors.password_confirmation = "Passwords do not match.";
        }
        if (form.current_password && form.current_password === form.password) {
            validationErrors.password = "Your new password must be different from your current password.";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const submitChange = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        if (!localStorage.getItem("auth_token")) {
            setErrors({ form: "Please sign in before changing your password." });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await UserService.changePassword(form);
            const status = Number(response.data.status || response.status);

            if (status >= 200 && status < 300) {
                setNotice(response.data.message || "Password changed successfully.");
                setForm(initialForm);
                return;
            }

            setErrors(response.data.validator_errors || {
                form: response.data.message || "Unable to change your password.",
            });
        } catch (error) {
            setErrors(error.response?.data?.validator_errors || {
                form: error.response?.data?.message || "Unable to change your password. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const passwordInput = (name, label, placeholder, autoComplete) => (
        <Form.Group className="mb-3" controlId={`changePassword-${name}`}>
            <Form.Label>{label}</Form.Label>
            <div className="change-password-input">
                <Form.Control
                    type={visibleField === name ? "text" : "password"}
                    name={name}
                    value={form[name]}
                    placeholder={placeholder}
                    onChange={updateField}
                    isInvalid={Boolean(getError(name))}
                    autoComplete={autoComplete}
                />
                <button
                    type="button"
                    onClick={() => setVisibleField((current) => current === name ? "" : name)}
                    aria-label={`${visibleField === name ? "Hide" : "Show"} ${label.toLowerCase()}`}
                >
                    {visibleField === name ? "Hide" : "Show"}
                </button>
            </div>
            {getError(name) && <div className="change-password-error">{getError(name)}</div>}
        </Form.Group>
    );

    return (
        <main className="change-password-page">
            <section className="change-password-overview" aria-labelledby="change-password-heading">
                <span className="change-password-icon" aria-hidden="true">🔑</span>
                <span className="change-password-eyebrow">Account security</span>
                <h1 id="change-password-heading">Keep your account secure.</h1>
                <p>
                    Choose a unique password that you do not use for email,
                    banking, or any other business system.
                </p>
                <div className="change-password-tip">
                    <span aria-hidden="true">✓</span>
                    <p>
                        <strong>Security reminder</strong>
                        Never share your password with another staff member.
                    </p>
                </div>
            </section>

            <section className="change-password-card" aria-label="Change password form">
                <div className="change-password-heading">
                    <div>
                        <h2>Change password</h2>
                        <p>Enter your current password, then create a new one.</p>
                    </div>
                    <Link to="/login">Back to login</Link>
                </div>

                {notice && <Alert variant="success">{notice} <Link to="/login">Sign in</Link></Alert>}
                {errors.form && <Alert variant="danger">{errors.form}</Alert>}

                <Form noValidate onSubmit={submitChange}>
                    {passwordInput(
                        "current_password",
                        "Current password",
                        "Enter your current password",
                        "current-password"
                    )}

                    <div className="change-password-rules" aria-live="polite">
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

                    {passwordInput(
                        "password",
                        "New password",
                        "Create a strong password",
                        "new-password"
                    )}

                    {passwordInput(
                        "password_confirmation",
                        "Confirm new password",
                        "Enter your new password again",
                        "new-password"
                    )}

                    {form.password_confirmation && !getError("password_confirmation") && (
                        <div className={passwordsMatch ? "change-password-match" : "change-password-error"}>
                            {passwordsMatch ? "✓ Passwords match" : "Passwords do not match"}
                        </div>
                    )}

                    <Button
                        className="change-password-submit"
                        type="submit"
                        disabled={isSubmitting || !formIsReady}
                    >
                        {isSubmitting ? "Updating password…" : "Update password"}
                    </Button>
                </Form>
            </section>
        </main>
    );
};

export default UserChangePassword;
