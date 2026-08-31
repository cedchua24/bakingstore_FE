import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import VipCustomerService from "./VipCustomerService";
import "./VipCustomerTransactionTemplateList.css";

const VipCustomerTransactionTemplateList = () => {
    const [vipCustomerList, setVipCustomerList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        VipCustomerService.getAll()
            .then(response => setVipCustomerList(response.data || []))
            .catch(() => setError("We couldn't load the VIP customer list. Please refresh and try again."))
            .finally(() => setIsLoading(false));
    }, []);

    const filteredCustomers = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        return vipCustomerList.filter(customer => {
            const isActive = Number(customer.status) === 0;
            const matchesStatus = statusFilter === "all"
                || (statusFilter === "active" && isActive)
                || (statusFilter === "inactive" && !isActive);
            const matchesSearch = !query
                || customer.vip_name?.toLowerCase().includes(query)
                || customer.details?.toLowerCase().includes(query)
                || String(customer.id).includes(query);
            return matchesStatus && matchesSearch;
        });
    }, [vipCustomerList, searchTerm, statusFilter]);

    const activeCount = vipCustomerList.filter(customer => Number(customer.status) === 0).length;
    const inactiveCount = vipCustomerList.length - activeCount;

    return (
        <main className="vip-directory">
            <section className="vip-directory__header">
                <div>
                    <span className="vip-directory__eyebrow">Customer management</span>
                    <h1>VIP customers</h1>
                    <p>Review customer groups, balances, and transaction activity in one place.</p>
                </div>
                <div className="vip-directory__summary" aria-label="Customer summary">
                    <div><strong>{vipCustomerList.length}</strong><span>Total groups</span></div>
                    <div><strong>{activeCount}</strong><span>Active</span></div>
                    <div><strong>{inactiveCount}</strong><span>Inactive</span></div>
                </div>
            </section>

            <section className="vip-directory__panel">
                <div className="vip-directory__toolbar">
                    <label className="vip-search">
                        <SearchIcon aria-hidden="true" />
                        <input type="search" placeholder="Search by name, details, or ID" value={searchTerm}
                            onChange={event => setSearchTerm(event.target.value)} aria-label="Search VIP customers" />
                    </label>
                    <label className="vip-filter">
                        <span>Status</span>
                        <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}>
                            <option value="all">All statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </label>
                </div>

                {isLoading && <div className="vip-directory__state">Loading VIP customers…</div>}
                {error && <div className="vip-directory__state vip-directory__state--error">{error}</div>}

                {!isLoading && !error && (
                    <div className="vip-table-wrap">
                        <table className="vip-table">
                            <thead><tr><th>Customer group</th><th>Details</th><th>Label color</th><th>Status</th><th><span className="visually-hidden">Actions</span></th></tr></thead>
                            <tbody>
                                {filteredCustomers.map(vipCustomer => {
                                    const isActive = Number(vipCustomer.status) === 0;
                                    return (
                                        <tr key={vipCustomer.id}>
                                            <td><div className="vip-customer-name">
                                                <span className="vip-customer-name__icon"><StarOutlineIcon /></span>
                                                <span><strong>{vipCustomer.vip_name}</strong><small>Group ID {vipCustomer.id}</small></span>
                                            </div></td>
                                            <td className="vip-table__details">{vipCustomer.details || "No details added"}</td>
                                            <td><span className="vip-color"><i style={{ backgroundColor: vipCustomer.vip_color || "#d1d5db" }} />{vipCustomer.vip_color || "Not set"}</span></td>
                                            <td><span className={`vip-status vip-status--${isActive ? "active" : "inactive"}`}>
                                                {isActive ? <CheckCircleOutlineIcon /> : <CloseIcon />}{isActive ? "Active" : "Inactive"}
                                            </span></td>
                                            <td className="vip-table__actions">
                                                <Link className="vip-action vip-action--primary" to={`/vipTransaction/${vipCustomer.id}`}><PaymentsOutlinedIcon /> Transactions</Link>
                                                <Link className="vip-action" to={`/vipTransactionDebt/${vipCustomer.id}`}>Balances</Link>
                                                <Link className="vip-action vip-action--icon" title="Transaction history" aria-label={`View ${vipCustomer.vip_name} transaction history`} to={`/vipTransactionHistory/${vipCustomer.id}`}><HistoryIcon /></Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredCustomers.length === 0 && <div className="vip-directory__state"><strong>No customer groups found</strong><span>Try changing your search or status filter.</span></div>}
                    </div>
                )}
            </section>
        </main>
    );
};

export default VipCustomerTransactionTemplateList;
