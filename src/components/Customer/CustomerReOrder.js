import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";
import { Box, Chip, IconButton, LinearProgress, Pagination, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import CustomerService from "./CustomerService";
import CustomerCommentModal from "./CustomerCommentModal";

const PAGE_SIZE = 100;
const emptyFilters = { search: "", reordered_from: "", reordered_to: "", amount_min: "", amount_max: "" };
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

const CustomerReOrder = () => {
    const [filters, setFilters] = useState(emptyFilters);
    const [applied, setApplied] = useState(emptyFilters);
    const [customers, setCustomers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewComment, setViewComment] = useState(null);

    const fetchCustomers = useCallback(async (page, activeFilters) => {
        setLoading(true);
        setError("");
        const request = { page };
        Object.entries(activeFilters).forEach(([key, value]) => {
            if (value !== "") request[key] = key.startsWith("reordered_") || key === "search" ? value : Number(value);
        });
        try {
            const result = normalizeResponse(await CustomerService.customerReorderV2(request));
            setCustomers(result.rows);
            setPagination({ page: result.page, pages: result.pages, total: result.total });
        } catch (e) {
            setCustomers([]);
            setPagination({ page: 1, pages: 1, total: 0 });
            setError(e?.response?.data?.message || "Unable to load successfully reordered customers. Please try again.");
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchCustomers(1, emptyFilters); }, [fetchCustomers]);

    const filterError = useMemo(() => {
        const min = filters.amount_min === "" ? null : Number(filters.amount_min);
        const max = filters.amount_max === "" ? null : Number(filters.amount_max);
        if (filters.reordered_from && filters.reordered_to && filters.reordered_from > filters.reordered_to) return "From date cannot be later than to date.";
        if (min !== null && min < 0) return "Minimum amount cannot be negative.";
        if (max !== null && max < 0) return "Maximum amount cannot be negative.";
        if (min !== null && max !== null && min > max) return "Minimum amount cannot exceed maximum amount.";
        return "";
    }, [filters]);

    const sortedCustomers = useMemo(() => [...customers].sort((a, b) => {
        const aDate = new Date(a.reordered_at ?? a.reorder_date ?? a.date ?? 0).getTime();
        const bDate = new Date(b.reordered_at ?? b.reorder_date ?? b.date ?? 0).getTime();
        return bDate - aDate;
    }), [customers]);

    const pageStats = useMemo(() => {
        const reorderRevenue = customers.reduce((sum, row) => sum + Number(row.reorder_amount ?? row.shop_order_transaction_total_price ?? row.amount ?? 0), 0);
        const measured = customers.filter((row) => (row.days_between_orders ?? row.days_to_reorder) !== null && (row.days_between_orders ?? row.days_to_reorder) !== undefined);
        const averageDays = measured.length ? measured.reduce((sum, row) => sum + Number(row.days_between_orders ?? row.days_to_reorder), 0) / measured.length : 0;
        return { reorderRevenue, averageDays };
    }, [customers]);

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
    const changeFilter = (event) => setFilters({ ...filters, [event.target.name]: event.target.value });
    const changePage = (_, page) => {
        fetchCustomers(page, applied);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const formatDate = (value) => {
        if (!value) return "—";
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
    };
    const elapsedLabel = (value) => {
        const days = Number(value ?? 0);
        if (days === 0) return "Today";
        return `${days.toLocaleString()} ${days === 1 ? "day" : "days"} ago`;
    };
    const daysAgoFromDate = (value) => {
        if (!value) return null;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return null;
        return Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
    };
    const start = pagination.total ? (pagination.page - 1) * PAGE_SIZE + 1 : 0;
    const end = Math.min(pagination.page * PAGE_SIZE, pagination.total);

    return <Box sx={{ px: { xs: 1, md: 2 }, pb: 5 }}>
        <Stepper activeStep={2} alternativeLabel sx={{ mb: 3 }}>
            {["Needs follow-up", "Follow-up complete", "Successfully reordered"].map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>

        <Box sx={{ background: "linear-gradient(135deg, #f2f8ff 0%, #fff 65%)", border: "1px solid #d7e4f2", borderRadius: 3, p: { xs: 2, md: 3 }, mb: 3 }}>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} mb={2.5}>
                <Box><Typography variant="h4" fontWeight={700}>Successfully reordered</Typography><Typography color="text.secondary">Customers who completed a new order after their latest follow-up.</Typography></Box>
                <Chip label={`${pagination.total.toLocaleString()} customers`} color="primary" variant="outlined" sx={{ alignSelf: { xs: "flex-start", md: "center" }, fontWeight: 600 }} />
            </Stack>
            <Form onSubmit={applyFilters}>
                <div className="row g-3 align-items-end">
                    <Form.Group className="col-12"><Form.Label>Search customers</Form.Label><div className="d-flex gap-2"><Form.Control type="search" name="search" value={filters.search} onChange={changeFilter} placeholder="Search first name, last name, full name, or store name" /><Button type="submit" disabled={loading}>Search</Button></div></Form.Group>
                    <Form.Group className="col-12 col-sm-6 col-lg-3"><Form.Label>Reordered from</Form.Label><Form.Control type="date" name="reordered_from" value={filters.reordered_from} onChange={changeFilter} /></Form.Group>
                    <Form.Group className="col-12 col-sm-6 col-lg-3"><Form.Label>Reordered to</Form.Label><Form.Control type="date" name="reordered_to" value={filters.reordered_to} onChange={changeFilter} /></Form.Group>
                    <Form.Group className="col-12 col-sm-6 col-lg-2"><Form.Label>Min. lifetime sales</Form.Label><Form.Control type="number" min="0" step="0.01" name="amount_min" value={filters.amount_min} onChange={changeFilter} placeholder="₱0" /></Form.Group>
                    <Form.Group className="col-12 col-sm-6 col-lg-2"><Form.Label>Max. lifetime sales</Form.Label><Form.Control type="number" min="0" step="0.01" name="amount_max" value={filters.amount_max} onChange={changeFilter} placeholder="No maximum" /></Form.Group>
                    <div className="col-12 col-lg-2 d-flex gap-2"><Button type="submit" className="flex-grow-1" disabled={loading || Boolean(filterError)}>Apply</Button><Button type="button" variant="outline-secondary" onClick={clearFilters} disabled={loading}>Clear</Button></div>
                </div>
                {filterError && <div className="text-danger small mt-2">{filterError}</div>}
            </Form>
        </Box>

        <div className="row g-3 mb-3">
            <div className="col-12 col-md-4"><Box sx={{ border: "1px solid #e4e4e4", borderRadius: 2, p: 2, bgcolor: "white" }}><Typography variant="body2" color="text.secondary">Customers on this page</Typography><Typography variant="h5" fontWeight={700}>{customers.length.toLocaleString()}</Typography></Box></div>
            <div className="col-12 col-md-4"><Box sx={{ border: "1px solid #e4e4e4", borderRadius: 2, p: 2, bgcolor: "white" }}><Typography variant="body2" color="text.secondary">Reorder revenue on this page</Typography><Typography variant="h5" fontWeight={700}>{money.format(pageStats.reorderRevenue)}</Typography></Box></div>
            <div className="col-12 col-md-4"><Box sx={{ border: "1px solid #e4e4e4", borderRadius: 2, p: 2, bgcolor: "white" }}><Typography variant="body2" color="text.secondary">Average order gap</Typography><Typography variant="h5" fontWeight={700}>{pageStats.averageDays.toFixed(1)} days</Typography></Box></div>
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
        {loading && <LinearProgress color="primary" sx={{ mb: 1 }} />}
        <Box sx={{ border: "1px solid #e4e4e4", borderRadius: 2, overflow: "hidden", bgcolor: "white" }}><Box sx={{ overflowX: "auto" }}>
            <table className="table table-hover align-middle mb-0">
                <thead style={{ color: "#fff" }}>
                    <tr>
                        <th colSpan="4" style={{ color: "#fff", backgroundColor: "#263238", textAlign: "center", borderBottom: "1px solid #526069", letterSpacing: ".04em" }}>CUSTOMER &amp; FOLLOW-UP</th>
                        <th colSpan="2" style={{ color: "#fff", backgroundColor: "#1b5e20", textAlign: "center", borderBottom: "1px solid #4c8c4f", letterSpacing: ".04em" }}>SUCCESSFUL REORDER</th>
                        <th colSpan="2" style={{ color: "#fff", backgroundColor: "#6d4c41", textAlign: "center", borderBottom: "1px solid #99776b", letterSpacing: ".04em" }}>PREVIOUS HISTORY</th>
                        <th rowSpan="2" className="text-center" style={{ color: "#fff", backgroundColor: "#212529", verticalAlign: "middle" }}>Actions</th>
                    </tr>
                    <tr>
                        <th style={{ color: "#fff", backgroundColor: "#212529" }}>ID</th><th style={{ color: "#fff", backgroundColor: "#212529" }}>Customer</th><th style={{ color: "#fff", backgroundColor: "#212529" }}>Follow-up</th><th style={{ color: "#fff", backgroundColor: "#212529" }}>Sales representative</th>
                        <th style={{ color: "#fff", backgroundColor: "#287a2e", borderLeft: "3px solid #81c784" }}>Reorder</th><th className="text-end" style={{ color: "#fff", backgroundColor: "#287a2e" }}>Reorder amount</th>
                        <th style={{ color: "#fff", backgroundColor: "#795548", borderLeft: "3px solid #bcaaa4" }}>Last Order</th><th className="text-end" style={{ color: "#fff", backgroundColor: "#795548" }}>Sales before reorder</th>
                    </tr>
                </thead>
                <tbody>
                    {!loading && sortedCustomers.length === 0 && <tr><td colSpan="9" className="text-center text-muted py-5">No reordered customers match these filters.</td></tr>}
                    {sortedCustomers.map((customer) => {
                        const reorderDate = customer.reordered_at ?? customer.reorder_date ?? customer.date ?? customer.order_created_at;
                        const previousOrderDate = customer.previous_order_date ?? customer.last_order_date;
                        const reorderAmount = customer.reorder_amount ?? customer.shop_order_transaction_total_price ?? customer.amount ?? 0;
                        const lifetimeSalesBeforeReorder = Number(customer.total_sales ?? 0) - Number(reorderAmount);
                        const previousOrderDaysAgo = daysAgoFromDate(previousOrderDate);
                        const transactionId = customer.reorder_transaction_id ?? customer.transaction_id ?? customer.shop_order_transaction_id;
                        return <tr key={`${customer.id}-${transactionId ?? reorderDate}`}>
                            <td>{customer.id}</td>
                            <td><div style={{ color: "#123a63", fontSize: 15, fontWeight: 800, lineHeight: 1.35 }}>{[customer.first_name, customer.last_name].filter(Boolean).join(" ") || "Unnamed customer"}</div>{customer.store_name && <div style={{ marginTop: 4, color: "#526b8a", fontSize: 11, fontWeight: 500, lineHeight: 1.45, letterSpacing: ".02em", textTransform: "uppercase" }}>{customer.store_name}</div>}<small className="text-muted">{customer.contact_number || customer.email || "No contact details"}</small></td>
                            <td><div className="fw-semibold">{customer.follow_up_user_name || "Unknown user"}</div></td>
                            <td><div className="fw-semibold">{customer.sales_rep_name || "Unassigned"}</div></td>
                            <td style={{ backgroundColor: "#f0f9f1", borderLeft: "3px solid #81c784" }}><div className="fw-semibold">{formatDate(reorderDate)}</div><small style={{ color: "#1b5e20", fontWeight: 600 }}>{elapsedLabel(customer.days_since_reorder ?? customer.last_order)}</small>{transactionId && <div><Link to={`/shopOrderTransaction/completedShopOrderTransaction/${transactionId}`} className="small text-decoration-none">#{transactionId}</Link></div>}</td>
                            <td className="text-end fw-semibold" style={{ backgroundColor: "#f0f9f1" }}>{money.format(Number(reorderAmount))}</td>
                            <td style={{ backgroundColor: "#fff8f3", borderLeft: "3px solid #d7ccc8" }}><div className="fw-semibold">{formatDate(previousOrderDate)}</div>{previousOrderDaysAgo !== null && <small className="text-danger">{previousOrderDaysAgo === 0 ? "Today" : `${previousOrderDaysAgo.toLocaleString()} ${previousOrderDaysAgo === 1 ? "day" : "days"} ago`}</small>}</td>
                            <td className="text-end" style={{ backgroundColor: "#fff8f3" }}><div className="fw-semibold">{money.format(lifetimeSalesBeforeReorder)}</div><small className="text-muted">{Number(customer.total_orders ?? 0).toLocaleString()} orders</small></td>
                            <td><Stack direction="row" spacing={1} justifyContent="center"><IconButton size="small" color="info" onClick={() => setViewComment({ customerName: [customer.first_name, customer.last_name].filter(Boolean).join(" "), comment: customer.comment ?? customer.follow_up_comment ?? customer.customer_update_comment ?? "" })} aria-label="View follow-up comment"><CommentOutlinedIcon /></IconButton><Button as={Link} size="sm" variant="outline-primary" to={`/customers/customerTransactionList/${customer.id}`}>Transactions</Button><Button as={Link} size="sm" variant="outline-secondary" to={`/customers/customerProductList/${customer.id}`}>Products</Button></Stack></td>
                        </tr>;
                    })}
                </tbody>
            </table>
        </Box></Box>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2} mt={2}><Typography color="text.secondary" variant="body2">Showing {start.toLocaleString()}–{end.toLocaleString()} of {pagination.total.toLocaleString()} · {PAGE_SIZE} per page</Typography><Pagination count={pagination.pages} page={pagination.page} onChange={changePage} disabled={loading} color="primary" showFirstButton showLastButton /></Stack>
        <CustomerCommentModal show={Boolean(viewComment)} onHide={() => setViewComment(null)} customerName={viewComment?.customerName} comment={viewComment?.comment} />
    </Box>;
};

export default CustomerReOrder;
