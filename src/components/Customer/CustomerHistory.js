import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { Box, Chip, CircularProgress, IconButton, LinearProgress, Pagination, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";
import CustomerService from "./CustomerService";
import CustomerUpdateService from "../OtherService/CustomerUpdateService";
import { getAuthUserIdFromCookie } from "../User/authSession";

const PAGE_SIZE = 100;
const emptyFilters = { inactive_days_min: "", last_order_before: "", amount_min: "", amount_max: "" };
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
    const [support, setSupport] = useState({ customer_id: 0, first_name: "", last_name: "", chat: 0, promo: 0, status: 0, backlog: 0 });

    const fetchCustomers = useCallback(async (page, activeFilters) => {
        setLoading(true);
        setError("");
        const request = { page };
        Object.entries(activeFilters).forEach(([key, value]) => {
            if (value !== "") request[key] = key === "last_order_before" ? value : Number(value);
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
    const changeFilter = (event) => setFilters({ ...filters, [event.target.name]: event.target.value });

    const openSupport = async (id) => {
        try {
            const { data } = await CustomerService.get(id);
            setSupport((current) => ({ ...current, customer_id: data.id, first_name: data.first_name || "", last_name: data.last_name || "", chat: 0, promo: 0, backlog: 0 }));
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
                        <Form.Group className="col-12 col-sm-6 col-lg-3"><Form.Label>Inactive for at least</Form.Label><Form.Control type="number" min="0" name="inactive_days_min" value={filters.inactive_days_min} onChange={changeFilter} placeholder="e.g. 30 days" /></Form.Group>
                        <Form.Group className="col-12 col-sm-6 col-lg-3"><Form.Label>Last order before</Form.Label><Form.Control type="date" name="last_order_before" value={filters.last_order_before} onChange={changeFilter} /></Form.Group>
                        <Form.Group className="col-12 col-sm-6 col-lg-2"><Form.Label>Min. lifetime sales</Form.Label><Form.Control type="number" min="0" step="0.01" name="amount_min" value={filters.amount_min} onChange={changeFilter} placeholder="₱0" /></Form.Group>
                        <Form.Group className="col-12 col-sm-6 col-lg-2"><Form.Label>Max. lifetime sales</Form.Label><Form.Control type="number" min="0" step="0.01" name="amount_max" value={filters.amount_max} onChange={changeFilter} placeholder="No maximum" /></Form.Group>
                        <div className="col-12 col-lg-2 d-flex gap-2"><Button type="submit" className="flex-grow-1" disabled={loading || Boolean(filterError)}>Apply</Button><Button type="button" variant="outline-secondary" onClick={clearFilters} disabled={loading}>Clear</Button></div>
                    </div>
                    {filterError && <div className="text-danger small mt-2">{filterError}</div>}
                </Form>
            </Box>

            {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
            {loading && <LinearProgress color="warning" sx={{ mb: 1 }} />}
            <Box sx={{ border: "1px solid #e4e4e4", borderRadius: 2, overflow: "hidden", backgroundColor: "white" }}>
                <Box sx={{ overflowX: "auto" }}>
                    <table className="table table-hover align-middle mb-0">
                        <thead style={{ backgroundColor: "#212529", color: "#ffffff" }}><tr><th style={{ color: "#ffffff" }}>Customer</th><th style={{ color: "#ffffff" }}>Contact</th><th style={{ color: "#ffffff" }}>Last order</th><th style={{ color: "#ffffff" }}>Inactive</th><th className="text-end" style={{ color: "#ffffff" }}>Orders</th><th className="text-end" style={{ color: "#ffffff" }}>Lifetime sales</th><th className="text-center" style={{ color: "#ffffff" }}>Actions</th></tr></thead>
                        <tbody>
                            {!loading && sortedCustomers.length === 0 && <tr><td colSpan="7" className="text-center text-muted py-5">No customers match these filters.</td></tr>}
                            {sortedCustomers.map((customer) => {
                                const days = Number(customer.days_since_last_order ?? customer.last_order ?? 0);
                                const orderDate = customer.last_order_date ?? customer.date ?? customer.last_order_at;
                                return <tr key={customer.id}>
                                    <td><div className="fw-semibold">{[customer.first_name, customer.last_name].filter(Boolean).join(" ") || "Unnamed customer"}</div><small className="text-muted">ID #{customer.id}{customer.address ? ` · ${customer.address}` : ""}</small></td>
                                    <td><div>{customer.contact_number || "—"}</div><small className="text-muted">{customer.email || "No email"}</small></td>
                                    <td>{formatDate(orderDate)}</td>
                                    <td><Chip label={`${days.toLocaleString()} ${days === 1 ? "day" : "days"}`} color={days >= 90 ? "error" : days >= 30 ? "warning" : "default"} size="small" /></td>
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
                <Modal.Body><p className="fw-semibold">{support.first_name} {support.last_name}</p><Form.Check className="mb-3" label="Move to backlog" checked={support.backlog === 1} onChange={toggleSupport("backlog")} /><Form.Check className="mb-3" label="Customer contacted" checked={support.chat === 1} onChange={toggleSupport("chat")} /><Form.Check label="Offer a promotion" checked={support.promo === 1} onChange={toggleSupport("promo")} /></Modal.Body>
                <Modal.Footer><Button variant="outline-secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={saveSupport} disabled={saving}>{saving && <CircularProgress size={15} color="inherit" sx={{ mr: 1 }} />}Save status</Button></Modal.Footer>
            </Modal>
        </Box>
    );
};

export default CustomerHistory;
