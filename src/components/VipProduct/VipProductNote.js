import React, { useCallback, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import VipProductNoteService from "./VipProductNoteService";
import VipProductTransactionService from "./VipProductTransactionService";

const styles = {
    page: {
        padding: "18px 22px",
        backgroundColor: "#f7f9fb",
        minHeight: "100vh",
    },
    header: {
        textAlign: "center",
        marginBottom: "18px",
    },
    accent: {
        width: "44px",
        height: "5px",
        borderRadius: "999px",
        margin: "0 auto 8px",
    },
    detailsCard: {
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "9px",
        padding: "16px",
        marginBottom: "16px",
    },
    productName: {
        fontSize: "18px",
        fontWeight: 700,
        marginBottom: "3px",
    },
    muted: {
        color: "#6c757d",
        marginBottom: 0,
    },
    formCard: {
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "9px",
        padding: "16px",
        marginBottom: "18px",
    },
    empty: {
        textAlign: "center",
        padding: "22px",
        color: "#6c757d",
    },
};

const formatDateTime = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(date));
};

const VipProductNote = () => {
    const { id } = useParams();
    const [transaction, setTransaction] = useState({});
    const [notes, setNotes] = useState([]);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const fetchNotes = useCallback(() => {
        return VipProductNoteService.getAll()
            .then((response) => {
                setNotes(response.data.filter(
                    (note) => Number(note.vip_product_transaction_id) === Number(id)
                ));
            })
            .catch(() => setAlert({
                severity: "error",
                message: "Unable to fetch VIP Product Notes.",
            }));
    }, [id]);

    useEffect(() => {
        fetchNotes();
        VipProductTransactionService.get(id)
            .then((response) => setTransaction(response.data || {}))
            .catch(() => setAlert({
                severity: "error",
                message: "Unable to fetch VIP Product details.",
            }));
    }, [fetchNotes, id]);

    const saveNote = () => {
        if (!comment.trim()) {
            setAlert({ severity: "error", message: "Comment is required." });
            return;
        }

        setLoading(true);
        VipProductNoteService.sanctum()
            .then(() => VipProductNoteService.create({
                vip_product_transaction_id: id,
                user_id: localStorage.getItem("auth_user_id"),
                comment: comment.trim(),
                status: 0,
            }))
            .then(() => {
                setComment("");
                setAlert({ severity: "success", message: "VIP Product Note added successfully." });
                return fetchNotes();
            })
            .catch(() => setAlert({
                severity: "error",
                message: "Unable to save VIP Product Note.",
            }))
            .finally(() => setLoading(false));
    };

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div style={{
                    ...styles.accent,
                    backgroundColor: transaction.vip_color || "#6c757d",
                }} />
                <h3>{transaction.vip_product_name || "VIP Product Note"}</h3>
                <p style={styles.muted}>{transaction.details}</p>
            </div>

            {alert &&
                <Alert severity={alert.severity} style={{ marginBottom: "16px" }}>
                    {alert.message}
                </Alert>
            }

            <div style={styles.detailsCard}>
                <div style={styles.productName}>{transaction.product_name || "-"}</div>
                <p style={styles.muted}>VIP Product Transaction #{id}</p>
            </div>

            <div style={styles.formCard}>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Comment *</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={comment}
                            placeholder="Enter comment"
                            onChange={(event) => setComment(event.target.value)}
                        />
                    </Form.Group>
                    <Button disabled={loading} onClick={saveNote}>Submit</Button>
                    {loading && <LinearProgress color="warning" style={{ marginTop: "14px" }} />}
                </Form>
            </div>

            <legend align="center" style={{ fontWeight: "bold" }}>VIP Product Note List</legend>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr className="table-secondary">
                            <th>#</th>
                            <th>User</th>
                            <th>Comment</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notes.length ? notes.map((note, index) => (
                            <tr key={note.id}>
                                <td>{index + 1}</td>
                                <td>{note.name || "-"}</td>
                                <td style={{ whiteSpace: "pre-wrap" }}>{note.comment}</td>
                                <td>{formatDateTime(note.created_at)}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" style={styles.empty}>No VIP Product notes found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VipProductNote;
