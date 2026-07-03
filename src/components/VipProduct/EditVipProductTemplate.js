import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import VipProductService from "./VipProductService";

const EditVipProductTemplate = () => {
    const { id } = useParams();
    const [template, setTemplate] = useState({
        id: 0,
        vip_product_name: "",
        details: "",
        vip_color: "#000000",
        status: 0,
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [nameError, setNameError] = useState("");

    useEffect(() => {
        VipProductService.get(id)
            .then((response) => setTemplate({
                ...response.data,
                vip_color: response.data.vip_color || "#000000",
            }))
            .catch(() => setAlert({ severity: "error", message: "Unable to fetch VIP Product Template." }));
    }, [id]);

    const onChange = (event) => setTemplate({ ...template, [event.target.name]: event.target.value });

    const updateTemplate = () => {
        if (!template.vip_product_name.trim()) {
            setNameError("VIP Product Template Name is required.");
            return;
        }
        setNameError("");
        setLoading(true);
        VipProductService.sanctum()
            .then(() => VipProductService.update(template.id, template))
            .then((response) => {
                setTemplate({ ...response.data, vip_color: response.data.vip_color || "#000000" });
                setAlert({ severity: "success", message: "VIP Product Template updated successfully." });
            })
            .catch(() => setAlert({ severity: "error", message: "Unable to update VIP Product Template." }))
            .finally(() => setLoading(false));
    };

    return (
        <div>
            <legend align="center" style={{ fontWeight: "bold" }}>Update VIP Product Template</legend>
            {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
            <br />
            <Form>
                {nameError && <p style={{ color: "red" }}>{nameError}</p>}
                <Form.Group className="mb-3">
                    <Form.Label>VIP Product Template Name *</Form.Label>
                    <Form.Control name="vip_product_name" value={template.vip_product_name} onChange={onChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Details</Form.Label>
                    <Form.Control as="textarea" rows={3} name="details" value={template.details || ""} onChange={onChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>VIP Color</Form.Label>
                    <Form.Control type="color" name="vip_color" value={template.vip_color} onChange={onChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" value={template.status} onChange={onChange}>
                        <option value="0">Active</option>
                        <option value="1">Inactive</option>
                    </Form.Select>
                </Form.Group>
                <Button disabled={loading} onClick={updateTemplate}>Update</Button>
                <br /><br />
                {loading && <LinearProgress color="warning" />}
            </Form>
        </div>
    );
};

export default EditVipProductTemplate;
