import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import VipProductService from "./VipProductService";

const emptyTemplate = {
    id: 0,
    vip_product_name: "",
    details: "",
    vip_color: "#000000",
    status: 0,
};

const VipProductTemplateForm = ({ onSaved }) => {
    const [template, setTemplate] = useState(emptyTemplate);
    const [nameError, setNameError] = useState("");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const saveTemplate = () => {
        if (!template.vip_product_name.trim()) {
            setNameError("VIP Product Template Name is required.");
            return;
        }

        setNameError("");
        setLoading(true);
        VipProductService.sanctum()
            .then(() => VipProductService.create(template))
            .then((response) => {
                setTemplate(emptyTemplate);
                setAlert({ severity: "success", message: "VIP Product Template added successfully." });
                if (onSaved) {
                    onSaved(response.data);
                }
            })
            .catch(() => setAlert({ severity: "error", message: "Unable to save VIP Product Template." }))
            .finally(() => setLoading(false));
    };

    return (
        <div>
            <Stack sx={{ width: "100%" }} spacing={2}>
                {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
            </Stack>
            <br />
            <Form>
                {nameError && <p style={{ color: "red" }}>{nameError}</p>}
                <Form.Group className="mb-3" controlId="vipProductTemplateName">
                    <Form.Label>VIP Product Template Name *</Form.Label>
                    <Form.Control
                        name="vip_product_name"
                        value={template.vip_product_name}
                        placeholder="Enter VIP Product Template Name"
                        onChange={(event) => setTemplate({ ...template, vip_product_name: event.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="vipProductTemplateDetails">
                    <Form.Label>Details</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="details"
                        value={template.details}
                        placeholder="Enter Details"
                        onChange={(event) => setTemplate({ ...template, details: event.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="vipProductTemplateColor">
                    <Form.Label>VIP Color</Form.Label>
                    <Form.Control
                        type="color"
                        name="vip_color"
                        value={template.vip_color}
                        onChange={(event) => setTemplate({ ...template, vip_color: event.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="vipProductTemplateStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                        name="status"
                        value={template.status}
                        onChange={(event) => setTemplate({ ...template, status: event.target.value })}
                    >
                        <option value="0">Active</option>
                        <option value="1">Inactive</option>
                    </Form.Select>
                </Form.Group>
                <Button disabled={loading} onClick={saveTemplate}>Submit</Button>
                <br /><br />
                {loading && <LinearProgress color="warning" />}
            </Form>
            <br />
        </div>
    );
};

export default VipProductTemplateForm;
