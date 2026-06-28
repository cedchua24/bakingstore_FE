import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import UserService from "./UserService.service";
import "./UserLogin.css";
import useActiveShopColor from "../Shop/useActiveShopColor";

const GENERIC_MESSAGE =
    "If an account matches that email, a secure reset link will arrive shortly. The link expires in 60 minutes.";

const ForgotPassword = () => {
    const activeShopColor = useActiveShopColor();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        const normalizedEmail = email.trim();
        if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            setError("Please enter a valid email address.");
            return;
        }

        setIsSubmitting(true);

        try {
            await UserService.forgotPassword(normalizedEmail);
            setMessage(GENERIC_MESSAGE);
        } catch (requestError) {
            if (requestError.response?.status && requestError.response.status < 500) {
                setMessage(GENERIC_MESSAGE);
            } else {
                setError("The reset service is temporarily unavailable. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main
            className="login-page"
            style={{ "--shop-color": activeShopColor || "#4f2d23" }}
        >
            <section className="login-overview" aria-labelledby="forgot-heading">
                <span className="login-eyebrow">Account recovery</span>
                <h1 id="forgot-heading">Let’s get you back in.</h1>
                <p>
                    Enter your staff email address. If an account exists, we’ll
                    email a secure password-reset link.
                </p>
            </section>

            <section className="login-card" aria-label="Forgot password form">
                <div className="login-card-heading">
                    <div>
                        <h2>Forgot password</h2>
                        <p>The reset link expires after 60 minutes.</p>
                    </div>
                </div>

                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                {!message && (
                    <Form noValidate onSubmit={submit}>
                        <Form.Group className="mb-4" controlId="forgotEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="you@mdrbakingsupplies.com"
                                autoComplete="email"
                                autoFocus
                            />
                        </Form.Group>

                        <Button className="login-submit" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Sending…" : "Email reset link"}
                        </Button>
                    </Form>
                )}

                <p className="login-register">
                    <Link to="/login">Back to sign in</Link>
                </p>

                <p className="login-recovery-privacy">
                    For privacy, the confirmation is the same whether or not an account exists.
                </p>
            </section>
        </main>
    );
};

export default ForgotPassword;
