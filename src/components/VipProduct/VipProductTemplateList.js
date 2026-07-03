import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const VipProductTemplateList = ({ templates }) => {
    const formatDate = (date) => date
        ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "2-digit" }).format(new Date(date))
        : "";

    return (
        <div>
            <legend align="center" style={{ fontWeight: "bold" }}>VIP Product Template List</legend>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr className="table-secondary">
                            <th>#</th>
                            <th>ID</th>
                            <th>VIP Product Template Name</th>
                            <th>Details</th>
                            <th>Color</th>
                            <th>Status</th>
                            <th>Date</th>
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
                                            backgroundColor: template.vip_color || "#000000",
                                            border: "1px solid #ced4da",
                                        }} />
                                        {template.vip_color}
                                    </span>
                                </td>
                                <td>{Number(template.status) === 0
                                    ? <CheckIcon style={{ color: "green" }} />
                                    : <CloseIcon style={{ color: "red" }} />}
                                </td>
                                <td>{formatDate(template.created_at)}</td>
                                <td>
                                    <Link to={`/vipProduct/${template.id}`}>
                                        <Button variant="warning">Update</Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VipProductTemplateList;
