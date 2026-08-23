import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";
import { Box, Chip, LinearProgress, Pagination, Stack, Typography } from "@mui/material";
import CustomerService from "./CustomerService";

const PAGE_SIZE = 100;
const emptyFilters = { search: "", inactive_days_min: "", inactive_days_max: "", last_order_before: "", last_order_from: "", last_order_to: "", amount_min: "", amount_max: "" };
const money = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });
const dateFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" });

function normalizeResponse(response) {
    const body = response?.data || {};
    const wrapped = body.data && !Array.isArray(body.data) ? body.data : body;
    const rows = Array.isArray(body.data) ? body.data : Array.isArray(wrapped.data) ? wrapped.data : Array.isArray(body.customers) ? body.customers : [];
    const total = Number(body.total ?? wrapped.total ?? body.pagination?.total ?? rows.length);
    return {
        rows,
        total,
        page: Number(body.current_page ?? wrapped.current_page ?? body.pagination?.current_page ?? body.page ?? 1),
        pages: Number(body.last_page ?? wrapped.last_page ?? body.pagination?.last_page ?? Math.max(1, Math.ceil(total / PAGE_SIZE))),
    };
}

const CustomerOrderActivity = () => {
    const [filters, setFilters] = useState(emptyFilters);
    const [applied, setApplied] = useState(emptyFilters);
    const [customers, setCustomers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCustomers = useCallback(async (page, activeFilters) => {
        setLoading(true);
        setError("");
        const request = { page };
        Object.entries(activeFilters).forEach(([key, value]) => {
            if (value !== "") request[key] = key === "search" || key.startsWith("last_order_") ? value : Number(value);
        });
        try {
            const result = normalizeResponse(await CustomerService.customerLastOrderAllListV2(request));
            setCustomers(result.rows);
            setPagination({ page: result.page, pages: result.pages, total: result.total });
        } catch (e) {
            setCustomers([]);
            setPagination({ page: 1, pages: 1, total: 0 });
            setError(e?.response?.data?.message || "Unable to load customer order activity. Please try again.");
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchCustomers(1, emptyFilters); }, [fetchCustomers]);

    const filterError = useMemo(() => {
        const min = filters.amount_min === "" ? null : Number(filters.amount_min);
        const max = filters.amount_max === "" ? null : Number(filters.amount_max);
        if (min !== null && min < 0) return "Minimum sales cannot be negative.";
        if (max !== null && max < 0) return "Maximum sales cannot be negative.";
        if (min !== null && max !== null && min > max) return "Minimum sales cannot exceed maximum sales.";
        if (filters.inactive_days_min !== "" && Number(filters.inactive_days_min) < 0) return "Inactive days cannot be negative.";
        if (filters.inactive_days_max !== "" && Number(filters.inactive_days_max) < 0) return "Maximum inactive days cannot be negative.";
        if (filters.inactive_days_min !== "" && filters.inactive_days_max !== "" && Number(filters.inactive_days_min) > Number(filters.inactive_days_max)) return "Minimum inactive days cannot exceed maximum inactive days.";
        if (filters.last_order_from && filters.last_order_to && filters.last_order_from > filters.last_order_to) return "Last order from date cannot be later than the to date.";
        return "";
    }, [filters]);

    const applyFilters = (event) => {
        event.preventDefault();
        if (filterError) return;
        setApplied(filters);
        fetchCustomers(1, filters);
    };
    const clearFilters = () => {
        setFilters(emptyFilters);
        setApplied(emptyFilters);
        fetchCustomers(1, emptyFilters);
    };
    const changeFilter = (event) => {
        const { name, value } = event.target;
        if (name === "last_order_before") setFilters({ ...filters, last_order_before: value, last_order_from: "", last_order_to: "" });
        else if (name === "last_order_from" || name === "last_order_to") setFilters({ ...filters, [name]: value, last_order_before: "" });
        else setFilters({ ...filters, [name]: value });
    };
    const changePage = (_, page) => {
        fetchCustomers(page, applied);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const formatDate = (value) => {
        if (!value) return "—";
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
    };
    const start = pagination.total ? (pagination.page - 1) * PAGE_SIZE + 1 : 0;
    const end = Math.min(pagination.page * PAGE_SIZE, pagination.total);

    return <Box sx={{ px: { xs: 1, md: 2 }, pb: 5 }}>
        <Box sx={{ background: "linear-gradient(135deg, #f4f8fc 0%, #fff 68%)", border: "1px solid #d7e4f2", borderRadius: 3, p: { xs: 2, md: 3 }, mb: 3 }}>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} mb={2.5}>
                <Box><Typography variant="h4" fontWeight={700}>All customer order activity</Typography><Typography color="text.secondary">A complete view of every customer, their total completed orders, sales, and latest purchase activity.</Typography></Box>
                <Chip label={`${pagination.total.toLocaleString()} customers`} color="primary" variant="outlined" sx={{ alignSelf: { xs: "flex-start", md: "center" }, fontWeight: 600 }} />
            </Stack>
            <Form onSubmit={applyFilters}>
                <div className="row g-3 align-items-end">
                    <Form.Group className="col-12"><Form.Label>Search customers</Form.Label><div className="d-flex gap-2"><Form.Control type="search" name="search" value={filters.search} onChange={changeFilter} placeholder="Search first name, last name, full name, or store name" /><Button type="submit" disabled={loading}>Search</Button></div></Form.Group>
                    <Form.Group className="col-12 col-sm-6 col-lg-3"><Form.Label>Inactive for at least</Form.Label><Form.Control type="number" min="0" name="inactive_days_min" value={filters.inactive_days_min} onChange={changeFilter} placeholder="e.g. 60 days" /></Form.Group>
                    <Form.Group className="col-12 col-sm-6 col-lg-3"><Form.Label>Inactive for at most</Form.Label><Form.Control type="number" min="0" name="inactive_days_max" value={filters.inactive_days_max} onChange={changeFilter} placeholder="e.g. 90 days" /></Form.Group>
                    <Form.Group className="col-12 col-sm-6 col-lg-3"><Form.Label>Min. lifetime sales</Form.Label><Form.Control type="number" min="0" step="0.01" name="amount_min" value={filters.amount_min} onChange={changeFilter} placeholder="₱0" /></Form.Group>
                    <Form.Group className="col-12 col-sm-6 col-lg-3"><Form.Label>Max. lifetime sales</Form.Label><Form.Control type="number" min="0" step="0.01" name="amount_max" value={filters.amount_max} onChange={changeFilter} placeholder="No maximum" /></Form.Group>
                    <Form.Group className="col-12 col-sm-6 col-lg-3"><Form.Label>Last order from</Form.Label><Form.Control type="date" name="last_order_from" value={filters.last_order_from} onChange={changeFilter} disabled={Boolean(filters.last_order_before)} /></Form.Group>
                    <Form.Group className="col-12 col-sm-6 col-lg-3"><Form.Label>Last order to</Form.Label><Form.Control type="date" name="last_order_to" value={filters.last_order_to} onChange={changeFilter} disabled={Boolean(filters.last_order_before)} /></Form.Group>
                    <Form.Group className="col-12 col-sm-6 col-lg-3"><Form.Label>Or last order before</Form.Label><Form.Control type="date" name="last_order_before" value={filters.last_order_before} onChange={changeFilter} disabled /></Form.Group>
                    <div className="col-12 col-lg-3 d-flex gap-2"><Button type="submit" className="flex-grow-1" disabled={loading || Boolean(filterError)}>Apply</Button><Button type="button" variant="outline-secondary" onClick={clearFilters} disabled={loading}>Clear</Button></div>
                </div>
                {filterError && <div className="text-danger small mt-2">{filterError}</div>}
            </Form>
        </Box>

        {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
        {loading && <LinearProgress color="primary" sx={{ mb: 1 }} />}
        <Box sx={{ border: "1px solid #e4e4e4", borderRadius: 2, overflow: "hidden", bgcolor: "white" }}><Box sx={{ overflowX: "auto" }}>
            <table className="table table-hover align-middle mb-0">
                <thead style={{ backgroundColor: "#212529", color: "#fff" }}><tr><th style={{ color: "#fff" }}>ID</th><th style={{ color: "#fff" }}>Customer</th><th style={{ color: "#fff" }}>Contact</th><th style={{ color: "#fff" }}>Last Order</th><th className="text-end" style={{ color: "#fff" }}>Orders</th><th className="text-end" style={{ color: "#fff" }}>Lifetime Sales</th><th className="text-center" style={{ color: "#fff" }}>History</th></tr></thead>
                <tbody>
                    {!loading && customers.length === 0 && <tr><td colSpan="7" className="text-center text-muted py-5">No customers match these filters.</td></tr>}
                    {customers.map((customer) => {
                        const hasOrders = customer.has_orders === true || Number(customer.has_orders) === 1 || Number(customer.total_orders ?? 0) > 0;
                        const days = customer.days_since_last_order === null || customer.days_since_last_order === undefined ? null : Number(customer.days_since_last_order);
                        return <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td><div style={{ color: "#123a63", fontSize: 15, fontWeight: 800, lineHeight: 1.35 }}>{[customer.first_name, customer.last_name].filter(Boolean).join(" ") || "Unnamed customer"}</div>{customer.store_name && <div style={{ marginTop: 4, color: "#526b8a", fontSize: 11, fontWeight: 500, lineHeight: 1.45, letterSpacing: ".02em", textTransform: "uppercase" }}>{customer.store_name}</div>}<small className="text-muted">{customer.address || "No address"}</small></td>
                            <td><div>{customer.contact_number || "—"}</div><small className="text-muted">{customer.email || "No email"}</small></td>
                            <td>{hasOrders ? <><div>{formatDate(customer.last_order_date)}</div><small className={days > 0 ? "text-danger" : "text-success"}>{days === 0 ? "Today" : `${days?.toLocaleString()} ${days === 1 ? "day" : "days"} ago`}</small></> : <Chip label="Never ordered" size="small" variant="outlined" />}</td>
                            <td className="text-end">{Number(customer.total_orders ?? 0).toLocaleString()}</td>
                            <td className="text-end fw-semibold">{money.format(Number(customer.total_sales ?? 0))}</td>
                            <td><Stack direction="row" spacing={1} justifyContent="center"><Button as={Link} size="sm" variant="outline-primary" to={`/customers/customerTransactionList/${customer.id}`}>Transactions</Button><Button as={Link} size="sm" variant="outline-secondary" to={`/customers/customerProductList/${customer.id}`}>Products</Button></Stack></td>
                        </tr>;
                    })}
                </tbody>
            </table>
        </Box></Box>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2} mt={2}><Typography color="text.secondary" variant="body2">Showing {start.toLocaleString()}–{end.toLocaleString()} of {pagination.total.toLocaleString()} · {PAGE_SIZE} per page</Typography><Pagination count={pagination.pages} page={pagination.page} onChange={changePage} disabled={loading} color="primary" showFirstButton showLastButton /></Stack>
    </Box>;
};

export default CustomerOrderActivity;
