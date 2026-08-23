import React from "react";
import { Button, Modal } from "react-bootstrap";

const CustomerCommentModal = ({ show, onHide, customerName, comment }) => (
    <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
            <Modal.Title>Follow-up comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div style={{ backgroundColor: "#f2f7fc", border: "1px solid #d9e6f2", borderLeft: "4px solid #1976d2", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
                <div style={{ color: "#6b7d90", fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>Customer</div>
                <div style={{ color: "#123a63", fontSize: 19, fontWeight: 800 }}>{customerName || "Unnamed customer"}</div>
            </div>
            <div style={{ color: "#6b7d90", fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }}>Comment</div>
            <div style={{ minHeight: 80, padding: 14, borderRadius: 8, backgroundColor: "#fafafa", border: "1px solid #e4e4e4", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                {comment?.trim() || <span className="text-muted">No follow-up comment was added.</span>}
            </div>
        </Modal.Body>
        <Modal.Footer><Button variant="outline-secondary" onClick={onHide}>Close</Button></Modal.Footer>
    </Modal>
);

export default CustomerCommentModal;
