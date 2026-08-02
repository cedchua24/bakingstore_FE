import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import VipProductService from "./VipProductService";

const VipProductTransactionTemplateList = () => {
    const [templates, setTemplates] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        VipProductService.getAll()
            .then((response) => setTemplates(response.data))
            .catch(() => setError("Unable to fetch VIP Product Templates."));
    }, []);

    return (
        <div>
            <legend align="center" style={{ fontWeight: "bold" }}>VIP Product</legend>
            {error && <Alert severity="error">{error}</Alert>}
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr className="table-secondary">
                            <th>#</th>
                            <th>ID</th>
                            <th>VIP Product Template</th>
                            <th>Details</th>
                            <th>Color</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {templates.map((template, index) => (
                            <tr key={template.id}>
                                <td>{index + 1}</td>
                                <td>{template.id}</td>
                                <td>{template.vip_product_name}</td>
                                <td>{template.details}</td>
                                <td>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{
                                            width: "22px",
                                            height: "22px",
                                            borderRadius: "4px",
                                            backgroundColor: template.vip_color || "#6c757d",
                                            border: "1px solid #ced4da",
                                        }} />
                                        {template.vip_color}
                                    </span>
                                </td>
                                <td>
                                    {Number(template.status) === 0
                                        ? <CheckIcon style={{ color: "green" }} />
                                        : <CloseIcon style={{ color: "red" }} />}
                                </td>
                                <td>
                                    <div className="d-flex flex-wrap gap-2">
                                        <Link to={`/vipProductTransactionView/${template.id}`}>
                                            <Button variant="primary">View Transaction</Button>
                                        </Link>
                                        <Link to={`/vipProductSoldHistory/${template.id}`}>
                                            <Button variant="info">Product Sold History</Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VipProductTransactionTemplateList;
