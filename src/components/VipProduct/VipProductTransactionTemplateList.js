import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SearchIcon from "@mui/icons-material/Search";
import VipProductService from "./VipProductService";
import "./VipProductTransactionTemplateList.css";

const VipProductTransactionTemplateList = () => {
    const [templates, setTemplates] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        VipProductService.getAll()
            .then(response => setTemplates(response.data || []))
            .catch(() => setError("We couldn't load the VIP product groups. Please refresh and try again."))
            .finally(() => setIsLoading(false));
    }, []);

    const filteredTemplates = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        return templates.filter(template => {
            const isActive = Number(template.status) === 0;
            const matchesStatus = statusFilter === "all"
                || (statusFilter === "active" && isActive)
                || (statusFilter === "inactive" && !isActive);
            const matchesSearch = !query
                || template.vip_product_name?.toLowerCase().includes(query)
                || template.details?.toLowerCase().includes(query)
                || String(template.id).includes(query);
            return matchesStatus && matchesSearch;
        });
    }, [templates, searchTerm, statusFilter]);

    const activeCount = templates.filter(template => Number(template.status) === 0).length;
    const inactiveCount = templates.length - activeCount;

    return (
        <main className="vip-product-directory">
            <section className="vip-product-directory__header">
                <div>
                    <span className="vip-product-directory__eyebrow">Product management</span>
                    <h1>VIP products</h1>
                    <p>Review product groups, transactions, and sales history in one place.</p>
                </div>
                <div className="vip-product-directory__summary" aria-label="VIP product summary">
                    <div><strong>{templates.length}</strong><span>Total groups</span></div>
                    <div><strong>{activeCount}</strong><span>Active</span></div>
                    <div><strong>{inactiveCount}</strong><span>Inactive</span></div>
                </div>
            </section>

            <section className="vip-product-directory__panel">
                <div className="vip-product-directory__toolbar">
                    <label className="vip-product-search">
                        <SearchIcon aria-hidden="true" />
                        <input type="search" placeholder="Search by name, details, or ID" value={searchTerm}
                            onChange={event => setSearchTerm(event.target.value)} aria-label="Search VIP products" />
                    </label>
                    <label className="vip-product-filter">
                        <span>Status</span>
                        <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}>
                            <option value="all">All statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </label>
                </div>

                {isLoading && <div className="vip-product-directory__state">Loading VIP products…</div>}
                {error && <div className="vip-product-directory__state vip-product-directory__state--error">{error}</div>}

                {!isLoading && !error && (
                    <div className="vip-product-table-wrap">
                        <table className="vip-product-table">
                            <thead><tr><th>Product group</th><th>Details</th><th>Label color</th><th>Status</th><th><span className="visually-hidden">Actions</span></th></tr></thead>
                            <tbody>
                                {filteredTemplates.map(template => {
                                    const isActive = Number(template.status) === 0;
                                    return (
                                        <tr key={template.id}>
                                            <td><div className="vip-product-name">
                                                <span className="vip-product-name__icon"><Inventory2OutlinedIcon /></span>
                                                <span><strong>{template.vip_product_name}</strong><small>Group ID {template.id}</small></span>
                                            </div></td>
                                            <td className="vip-product-table__details">{template.details || "No details added"}</td>
                                            <td><span className="vip-product-color"><i style={{ backgroundColor: template.vip_color || "#d1d5db" }} />{template.vip_color || "Not set"}</span></td>
                                            <td><span className={`vip-product-status vip-product-status--${isActive ? "active" : "inactive"}`}>
                                                {isActive ? <CheckCircleOutlineIcon /> : <CloseIcon />}{isActive ? "Active" : "Inactive"}
                                            </span></td>
                                            <td className="vip-product-table__actions">
                                                <Link className="vip-product-action vip-product-action--primary" to={`/vipProductTransactionView/${template.id}`}><ReceiptLongOutlinedIcon /> Transactions</Link>
                                                <Link className="vip-product-action" to={`/vipProductSoldHistory/${template.id}`}><QueryStatsIcon /> Sales history</Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredTemplates.length === 0 && <div className="vip-product-directory__state"><strong>No product groups found</strong><span>Try changing your search or status filter.</span></div>}
                    </div>
                )}
            </section>
        </main>
    );
};

export default VipProductTransactionTemplateList;
