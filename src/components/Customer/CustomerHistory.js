import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { Box, Chip, CircularProgress, IconButton, LinearProgress, Pagination, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";
import CustomerService from "./CustomerService";
import CustomerUpdateService from "../OtherService/CustomerUpdateService";
import { getAuthUserIdFromCookie } from "../User/authSession";

const PAGE_SIZE = 100;
const emptyFilters = { search: "", inactive_days_min: "", inactive_days_max: "", last_order_before: "", last_order_from: "", last_order_to: "", amount_min: "", amount_max: "" };
const money = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });
const prettyDate = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" });

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

const CustomerHistory = () => {
    const [filters, setFilters] = useState(emptyFilters);
    const [applied, setApplied] = useState(emptyFilters);
    const [customers, setCustomers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [support, setSupport] = useState({ customer_id: 0, first_name: "", last_name: "", last_order_date: null, chat: 0, promo: 0, comment: "", status: 0, backlog: 0 });

    const fetchCustomers = useCallback(async (page, activeFilters) => {
        setLoading(true);
        setError("");
        const request = { page };
        Object.entries(activeFilters).forEach(([key, value]) => {
            if (value !== "") request[key] = key.startsWith("last_order_") || key === "search" ? value : Number(value);
        });
        try {
            const result = normalizeResponse(await CustomerService.customerLastOrderListV2(request));
            setCustomers(result.rows);
            setPagination({ page: result.page, pages: result.pages, total: result.total });
        } catch (e) {
            setCustomers([]);
            setPagination({ page: 1, pages: 1, total: 0 });
            setError(e?.response?.data?.message || "Unable to load inactive customers. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCustomers(1, emptyFilters); }, [fetchCustomers]);

    const sortedCustomers = useMemo(() => [...customers].sort((a, b) =>
        Number(b.days_since_last_order ?? b.last_order ?? 0) - Number(a.days_since_last_order ?? a.last_order ?? 0)
    ), [customers]);

    const filterError = useMemo(() => {
        const min = filters.amount_min === "" ? null : Number(filters.amount_min);
        const max = filters.amount_max === "" ? null : Number(filters.amount_max);
        if (min !== null && min < 0) return "Minimum amount cannot be negative.";
        if (max !== null && max < 0) return "Maximum amount cannot be negative.";
        if (min !== null && max !== null && min > max) return "Minimum amount cannot exceed maximum amount.";
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
    const changePage = (_, page) => {
        fetchCustomers(page, applied);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const changeFilter = (event) => {
        const { name, value } = event.target;
        if (name === "last_order_before") setFilters({ ...filters, last_order_before: value, last_order_from: "", last_order_to: "" });
        else if (name === "last_order_from" || name === "last_order_to") setFilters({ ...filters, [name]: value, last_order_before: "" });
        else setFilters({ ...filters, [name]: value });
    };

    const openSupport = async (id) => {
        try {
            const { data } = await CustomerService.get(id);
            const row = customers.find((customer) => Number(customer.id) === Number(id));
            setSupport((current) => ({ ...current, customer_id: data.id, first_name: data.first_name || "", last_name: data.last_name || "", last_order_date: row?.last_order_date ?? row?.date ?? row?.last_order_at ?? null, chat: 0, promo: 0, comment: "", backlog: 0 }));
            setModalOpen(true);
        } catch (e) {
            setError(e?.response?.data?.message || "Unable to open this customer.");
        }
    };
    const toggleSupport = (field) => (event) => {
        const checked = event.target.checked ? 1 : 0;
        setSupport((current) => ({
            ...current,
            backlog: field === "backlog" ? checked : checked ? 0 : current.backlog,
            chat: field === "chat" ? checked : checked && field === "backlog" ? 0 : current.chat,
            promo: field === "promo" ? checked : checked && field === "backlog" ? 0 : current.promo,
        }));
    };
    const saveSupport = async () => {
        const userId = getAuthUserIdFromCookie();
        if (!userId) {
            setError("Your user cookie is missing. Please sign in again before updating this customer.");
            return;
        }
        setSaving(true);
        try {
            await CustomerUpdateService.create({ ...support, user_id: userId });
            const updatedCustomerId = Number(support.customer_id);
            const remainingOnPage = customers.filter((customer) => Number(customer.id) !== updatedCustomerId);
            const nextTotal = Math.max(0, pagination.total - 1);
            const nextPage = remainingOnPage.length === 0 && pagination.page > 1
                ? pagination.page - 1
                : pagination.page;

            // Remove the completed follow-up immediately; the v2 refresh then
            // supplies the next eligible row and authoritative page totals.
            setCustomers(remainingOnPage);
            setPagination((current) => ({
                ...current,
                page: nextPage,
                total: nextTotal,
                pages: Math.max(1, Math.ceil(nextTotal / PAGE_SIZE)),
            }));
            setModalOpen(false);
            fetchCustomers(nextPage, applied);
        } catch (e) {
            setError(e?.response?.data?.message || "Unable to update customer status.");
        } finally { setSaving(false); }
    };
    const formatDate = (value) => {
        if (!value) return "—";
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? "—" : prettyDate.format(date);
    };
    const start = pagination.total ? (pagination.page - 1) * PAGE_SIZE + 1 : 0;
    const end = Math.min(pagination.page * PAGE_SIZE, pagination.total);

    return (
        <Box sx={{ px: { xs: 1, md: 2 }, pb: 5 }}>
            <Stepper activeStep={0} alternativeLabel sx={{ mb: 3 }}>
                {["Needs follow-up", "Follow-up complete", "Successfully reordered"].map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
            </Stepper>

            <Box sx={{ background: "linear-gradient(135deg, #fff8ed 0%, #fff 65%)", border: "1px solid #eadfce", borderRadius: 3, p: { xs: 2, md: 3 }, mb: 3 }}>
                <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} mb={2.5}>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>Inactive customers</Typography>
                        <Typography color="text.secondary">Customers with completed orders, ranked by longest time since their last purchase.</Typography>
                    </Box>
                    <Chip label={`${pagination.total.toLocaleString()} customers`} color="warning" variant="outlined" sx={{ alignSelf: { xs: "flex-start", md: "center" }, fontWeight: 600 }} />
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
            {loading && <LinearProgress color="warning" sx={{ mb: 1 }} />}
            <Box sx={{ border: "1px solid #e4e4e4", borderRadius: 2, overflow: "hidden", backgroundColor: "white" }}>
                <Box sx={{ overflowX: "auto" }}>
                    <table className="table table-hover align-middle mb-0">
                        <thead style={{ backgroundColor: "#212529", color: "#ffffff" }}><tr><th style={{ color: "#ffffff" }}>ID</th><th style={{ color: "#ffffff" }}>Customer</th><th style={{ color: "#ffffff" }}>Contact</th><th style={{ color: "#ffffff" }}>Last Order</th><th className="text-end" style={{ color: "#ffffff" }}>Orders</th><th className="text-end" style={{ color: "#ffffff" }}>Lifetime Sales</th><th className="text-center" style={{ color: "#ffffff" }}>Actions</th></tr></thead>
                        <tbody>
                            {!loading && sortedCustomers.length === 0 && <tr><td colSpan="7" className="text-center text-muted py-5">No customers match these filters.</td></tr>}
                            {sortedCustomers.map((customer) => {
                                const days = Number(customer.days_since_last_order ?? customer.last_order ?? 0);
                                const orderDate = customer.last_order_date ?? customer.date ?? customer.last_order_at;
                                return <tr key={customer.id}>
                                    <td>{customer.id}</td>
                                    <td><div className="fw-semibold">{[customer.first_name, customer.last_name].filter(Boolean).join(" ") || "Unnamed customer"}</div>{customer.store_name && <div style={{ marginTop: 4, color: "#526b8a", fontSize: 11, fontWeight: 500, lineHeight: 1.45, letterSpacing: ".02em", textTransform: "uppercase" }}>{customer.store_name}</div>}<small className="text-muted">{customer.address || "No address"}</small></td>
                                    <td><div>{customer.contact_number || "—"}</div><small className="text-muted">{customer.email || "No email"}</small></td>
                                    <td><div>{formatDate(orderDate)}</div><small className="text-danger">{days === 0 ? "Today" : `${days.toLocaleString()} ${days === 1 ? "day" : "days"} ago`}</small></td>
                                    <td className="text-end">{Number(customer.total_orders ?? 0).toLocaleString()}</td>
                                    <td className="text-end fw-semibold">{money.format(Number(customer.total_sales ?? 0))}</td>
                                    <td><Stack direction="row" spacing={1} justifyContent="center"><IconButton size="small" color="primary" onClick={() => openSupport(customer.id)} aria-label="Update follow-up status"><UpdateIcon /></IconButton><Button as={Link} size="sm" variant="outline-primary" to={`/customers/customerTransactionList/${customer.id}`}>Transactions</Button><Button as={Link} size="sm" variant="outline-secondary" to={`/customers/customerProductList/${customer.id}`}>Products</Button></Stack></td>
                                </tr>;
                            })}
                        </tbody>
                    </table>
                </Box>
            </Box>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2} mt={2}>
                <Typography color="text.secondary" variant="body2">Showing {start.toLocaleString()}–{end.toLocaleString()} of {pagination.total.toLocaleString()} · {PAGE_SIZE} per page</Typography>
                <Pagination count={pagination.pages} page={pagination.page} onChange={changePage} disabled={loading} color="primary" showFirstButton showLastButton />
            </Stack>

            <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered>
                <Modal.Header closeButton><Modal.Title>Customer follow-up</Modal.Title></Modal.Header>
                <Modal.Body><div style={{ backgroundColor: "#f2f7fc", border: "1px solid #d9e6f2", borderLeft: "4px solid #1976d2", borderRadius: 8, padding: "12px 14px", marginBottom: 20 }}><div style={{ color: "#6b7d90", fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>Customer</div><div style={{ color: "#123a63", fontSize: 19, fontWeight: 800, lineHeight: 1.35 }}>{support.first_name} {support.last_name}</div></div><Form.Check className="mb-3" label="Move to backlog" checked={support.backlog === 1} onChange={toggleSupport("backlog")} /><Form.Check className="mb-3" label="Customer contacted" checked={support.chat === 1} onChange={toggleSupport("chat")} /><Form.Check className="mb-3" label="Offer a promotion" checked={support.promo === 1} onChange={toggleSupport("promo")} /><Form.Group><Form.Label>Comment</Form.Label><Form.Control as="textarea" rows={3} name="comment" value={support.comment} onChange={(event) => setSupport({ ...support, comment: event.target.value })} placeholder="Add follow-up notes, plans, or reminders" /></Form.Group></Modal.Body>
                <Modal.Footer><Button variant="outline-secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={saveSupport} disabled={saving}>{saving && <CircularProgress size={15} color="inherit" sx={{ mr: 1 }} />}Save status</Button></Modal.Footer>
            </Modal>
        </Box>
    );
};

export default CustomerHistory;
