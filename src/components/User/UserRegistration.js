import React, { useMemo, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import swal from "sweetalert";
import UserService from "./UserService.service";
import "./UserRegistration.css";
import useActiveShopColor from "../Shop/useActiveShopColor";

const initialUser = {
    name: "",
    role_as: 1,
    email: "",
    password: "",
    password_confirmation: "",
};

const passwordChecks = [
    { label: "At least 12 characters", test: (password) => password.length >= 12 },
    { label: "One uppercase letter", test: (password) => /[A-Z]/.test(password) },
    { label: "One lowercase letter", test: (password) => /[a-z]/.test(password) },
    { label: "One number", test: (password) => /\d/.test(password) },
    { label: "One special character", test: (password) => /[^A-Za-z0-9]/.test(password) },
];

const UserRegistration = () => {
    const activeShopColor = useActiveShopColor();
    const [user, setUser] = useState(initialUser);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const passwordStatus = useMemo(
        () => passwordChecks.map((check) => ({ ...check, passed: check.test(user.password) })),
        [user.password]
    );

    const passwordIsStrong = passwordStatus.every((check) => check.passed);
    const passwordsMatch =
        user.password_confirmation.length > 0 &&
        user.password === user.password_confirmation;

    const updateField = (event) => {
        const { name, value } = event.target;
        setUser((currentUser) => ({ ...currentUser, [name]: value }));
        setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
    };

    const validateForm = () => {
        const validationErrors = {};

        if (!user.name.trim()) validationErrors.name = "Please enter your name.";
        if (!user.email.trim()) validationErrors.email = "Please enter your email address.";
        if (!passwordIsStrong) {
            validationErrors.password = "Your password must meet all five security rules.";
        }
        if (!user.password_confirmation) {
            validationErrors.password_confirmation = "Please confirm your password.";
        } else if (!passwordsMatch) {
            validationErrors.password_confirmation = "Passwords do not match.";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const saveUser = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setErrors({});

        try {
            await UserService.sanctum();
            const response = await UserService.create(user);
            const registrationStatus = Number(response.data.status);

            if (registrationStatus >= 200 && registrationStatus < 300) {
                setUser(initialUser);
                setShowPassword(false);
                setShowConfirmation(false);
                swal(
                    "Successfully created",
                    response.data.message || "The user account was successfully created.",
                    "success"
                );
                return;
            }

            setErrors(response.data.validator_errors || {
                form: response.data.message || "We couldn't create your account. Please try again.",
            });
        } catch (error) {
            setErrors({
                form: error.response?.data?.message || "Something went wrong. Please try again.",
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
            className="registration-page"
            style={{ "--shop-color": activeShopColor || "#4f2d23" }}
        >
            <section className="registration-intro" aria-labelledby="registration-heading">
                <span className="registration-eyebrow">Internal operations</span>
                <h1 id="registration-heading">Create a staff account</h1>
                <p>
                    Add secure system access for a member of your team.
                </p>

                <div className="registration-feature">
                    <span aria-hidden="true">✓</span>
                    <div>
                        <strong>Sales and operations</strong>
                        <small>Manage POS transactions, inventory, purchase orders, and customers.</small>
                    </div>
                </div>
                <div className="registration-feature">
                    <span aria-hidden="true">✓</span>
                    <div>
                        <strong>Clear business insights</strong>
                        <small>Review sales, expenses, reports, and the chart of accounts.</small>
                    </div>
                </div>
            </section>

            <section className="registration-card" aria-label="Registration form">
                <div className="registration-card-heading">
                    <span className="registration-icon" aria-hidden="true">📦</span>
                    <div>
                        <h2>Create staff access</h2>
                        <p>Enter the new staff member's account details.</p>
                    </div>
                </div>

                {errors.form && <Alert variant="danger">{errors.form}</Alert>}

                <Form noValidate onSubmit={saveUser}>
                    <Form.Group className="mb-3" controlId="registrationName">
                        <Form.Label>Full name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={user.name}
                            placeholder="e.g. Jamie Baker"
                            onChange={updateField}
                            isInvalid={Boolean(getError("name"))}
                            autoComplete="name"
                        />
                        <Form.Control.Feedback type="invalid">
                            {getError("name")}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="registrationEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={user.email}
                            placeholder="you@example.com"
                            onChange={updateField}
                            isInvalid={Boolean(getError("email"))}
                            autoComplete="email"
                        />
                        <Form.Control.Feedback type="invalid">
                            {getError("email")}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="registrationPassword">
                        <Form.Label>Password</Form.Label>
                        <div className="password-input">
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={user.password}
                                placeholder="Create a strong password"
                                onChange={updateField}
                                isInvalid={Boolean(getError("password"))}
                                autoComplete="new-password"
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
                            <div className="field-error">{getError("password")}</div>
                        )}

                        <div className="password-rules" aria-live="polite">
                            <p>Use a strong password with:</p>
                            <ul>
                                {passwordStatus.map((check) => (
                                    <li className={check.passed ? "passed" : ""} key={check.label}>
                                        <span aria-hidden="true">{check.passed ? "✓" : "○"}</span>
                                        {check.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="registrationPasswordConfirmation">
                        <Form.Label>Confirm password</Form.Label>
                        <div className="password-input">
                            <Form.Control
                                type={showConfirmation ? "text" : "password"}
                                name="password_confirmation"
                                value={user.password_confirmation}
                                placeholder="Enter your password again"
                                onChange={updateField}
                                isInvalid={Boolean(getError("password_confirmation"))}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmation((visible) => !visible)}
                                aria-label={showConfirmation ? "Hide confirmation password" : "Show confirmation password"}
                            >
                                {showConfirmation ? "Hide" : "Show"}
                            </button>
                        </div>
                        {user.password_confirmation && !getError("password_confirmation") && (
                            <Form.Text className={passwordsMatch ? "match-success" : "match-error"}>
                                {passwordsMatch ? "✓ Passwords match" : "Passwords do not match"}
                            </Form.Text>
                        )}
                        {getError("password_confirmation") && (
                            <div className="field-error">{getError("password_confirmation")}</div>
                        )}
                    </Form.Group>

                    <Button className="registration-submit" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating account…" : "Create account"}
                    </Button>
                </Form>

            </section>
        </main>
    );
};

export default UserRegistration;
