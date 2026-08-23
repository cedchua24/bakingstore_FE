import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { Box, Chip, CircularProgress, IconButton, LinearProgress, Pagination, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import UpdateIcon from "@mui/icons-material/Update";
import CustomerService from "./CustomerService";
import CustomerUpdateService from "../OtherService/CustomerUpdateService";
import { getAuthUserIdFromCookie } from "../User/authSession";

const PAGE_SIZE = 100;
const emptyFilters = { followed_up_from: "", followed_up_to: "", amount_min: "", amount_max: "" };
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

const CustomerConvo = () => {
    const [filters, setFilters] = useState(emptyFilters);
    const [applied, setApplied] = useState(emptyFilters);
    const [customers, setCustomers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [support, setSupport] = useState({ customer_id: 0, first_name: "", last_name: "", chat: 0, promo: 0, status: 0 });

    const fetchCustomers = useCallback(async (page, activeFilters) => {
        setLoading(true);
        setError("");
        const request = { page };
        Object.entries(activeFilters).forEach(([key, value]) => {
            if (value !== "") request[key] = key.startsWith("followed_up_") ? value : Number(value);
        });
        try {
            const result = normalizeResponse(await CustomerService.customerConvoListV2(request));
            setCustomers(result.rows);
            setPagination({ page: result.page, pages: result.pages, total: result.total });
        } catch (e) {
            setCustomers([]);
            setPagination({ page: 1, pages: 1, total: 0 });
            setError(e?.response?.data?.message || "Unable to load followed-up customers. Please try again.");
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchCustomers(1, emptyFilters); }, [fetchCustomers]);

    const sortedCustomers = useMemo(() => [...customers].sort((a, b) => {
        const aDate = new Date(a.followed_up_at ?? a.follow_up_date ?? a.customer_update_date ?? a.updated_at ?? 0).getTime();
        const bDate = new Date(b.followed_up_at ?? b.follow_up_date ?? b.customer_update_date ?? b.updated_at ?? 0).getTime();
        return bDate - aDate;
    }), [customers]);

    const filterError = useMemo(() => {
        const min = filters.amount_min === "" ? null : Number(filters.amount_min);
        const max = filters.amount_max === "" ? null : Number(filters.amount_max);
        if (filters.followed_up_from && filters.followed_up_to && filters.followed_up_from > filters.followed_up_to) return "From date cannot be later than to date.";
        if (min !== null && min < 0) return "Minimum amount cannot be negative.";
        if (max !== null && max < 0) return "Maximum amount cannot be negative.";
        if (min !== null && max !== null && min > max) return "Minimum amount cannot exceed maximum amount.";
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
    const changeFilter = (event) => setFilters({ ...filters, [event.target.name]: event.target.value });
    const changePage = (_, page) => {
        fetchCustomers(page, applied);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const openSupport = async (id) => {
        try {
            const { data } = await CustomerService.get(id);
            const row = customers.find((customer) => Number(customer.id) === Number(id));
            setSupport((current) => ({ ...current, customer_id: data.id, first_name: data.first_name || "", last_name: data.last_name || "", chat: Number(row?.chat ?? 0), promo: Number(row?.promo ?? 0), status: 0 }));
            setModalOpen(true);
        } catch (e) { setError(e?.response?.data?.message || "Unable to open this customer."); }
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
            setModalOpen(false);
            fetchCustomers(pagination.page, applied);
        } catch (e) { setError(e?.response?.data?.message || "Unable to update customer follow-up."); }
        finally { setSaving(false); }
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
    const BooleanIcon = ({ value, label }) => Number(value) === 1
        ? <CheckIcon color="success" fontSize="small" aria-label={`${label}: yes`} />
        : <CloseIcon color="error" fontSize="small" aria-label={`${label}: no`} />;
    const start = pagination.total ? (pagination.page - 1) * PAGE_SIZE + 1 : 0;
    const end = Math.min(pagination.page * PAGE_SIZE, pagination.total);

    return <Box sx={{ px: { xs: 1, md: 2 }, pb: 5 }}>
        <Stepper activeStep={1} alternativeLabel sx={{ mb: 3 }}>
            {["Needs follow-up", "Follow-up complete", "Successfully reordered"].map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>

        <Box sx={{ background: "linear-gradient(135deg, #f2fbf5 0%, #fff 65%)", border: "1px solid #d6e9dc", borderRadius: 3, p: { xs: 2, md: 3 }, mb: 3 }}>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} mb={2.5}>
                <Box><Typography variant="h4" fontWeight={700}>Follow-up complete</Typography><Typography color="text.secondary">Customers whose latest follow-up is complete and who have not reordered since.</Typography></Box>
                <Chip label={`${pagination.total.toLocaleString()} customers`} color="success" variant="outlined" sx={{ alignSelf: { xs: "flex-start", md: "center" }, fontWeight: 600 }} />
            </Stack>
            <Form onSubmit={applyFilters}>
                <div className="row g-3 align-items-end">
                    <Form.Group className="col-12 col-sm-6 col-lg-3"><Form.Label>Followed up from</Form.Label><Form.Control type="date" name="followed_up_from" value={filters.followed_up_from} onChange={changeFilter} /></Form.Group>
                    <Form.Group className="col-12 col-sm-6 col-lg-3"><Form.Label>Followed up to</Form.Label><Form.Control type="date" name="followed_up_to" value={filters.followed_up_to} onChange={changeFilter} /></Form.Group>
                    <Form.Group className="col-12 col-sm-6 col-lg-2"><Form.Label>Min. lifetime sales</Form.Label><Form.Control type="number" min="0" step="0.01" name="amount_min" value={filters.amount_min} onChange={changeFilter} placeholder="₱0" /></Form.Group>
                    <Form.Group className="col-12 col-sm-6 col-lg-2"><Form.Label>Max. lifetime sales</Form.Label><Form.Control type="number" min="0" step="0.01" name="amount_max" value={filters.amount_max} onChange={changeFilter} placeholder="No maximum" /></Form.Group>
                    <div className="col-12 col-lg-2 d-flex gap-2"><Button type="submit" className="flex-grow-1" disabled={loading || Boolean(filterError)}>Apply</Button><Button type="button" variant="outline-secondary" onClick={clearFilters} disabled={loading}>Clear</Button></div>
                </div>
                {filterError && <div className="text-danger small mt-2">{filterError}</div>}
            </Form>
        </Box>

        {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
        {loading && <LinearProgress color="success" sx={{ mb: 1 }} />}
        <Box sx={{ border: "1px solid #e4e4e4", borderRadius: 2, overflow: "hidden", backgroundColor: "white" }}><Box sx={{ overflowX: "auto" }}>
            <table className="table table-hover align-middle mb-0">
                <thead style={{ backgroundColor: "#212529", color: "#fff" }}><tr><th style={{ color: "#fff" }}>Customer</th><th style={{ color: "#fff" }}>Contact</th><th style={{ color: "#fff" }}>Followed up</th><th style={{ color: "#fff" }}>Last order</th><th style={{ color: "#fff" }}>Sales</th><th className="text-center" style={{ color: "#fff" }}>Chat</th><th className="text-center" style={{ color: "#fff" }}>Promo</th><th className="text-center" style={{ color: "#fff" }}>Actions</th></tr></thead>
                <tbody>
                    {!loading && sortedCustomers.length === 0 && <tr><td colSpan="8" className="text-center text-muted py-5">No followed-up customers match these filters.</td></tr>}
                    {sortedCustomers.map((customer) => {
                        const followUpDate = customer.followed_up_at ?? customer.follow_up_date ?? customer.customer_update_date ?? customer.updated_at;
                        const lastOrderDate = customer.last_order_date ?? customer.date ?? customer.last_order_at;
                        return <tr key={customer.id}>
                            <td><div className="fw-semibold">{[customer.first_name, customer.last_name].filter(Boolean).join(" ") || "Unnamed customer"}</div><small className="text-muted">ID #{customer.id}{customer.address ? ` · ${customer.address}` : ""}</small></td>
                            <td><div>{customer.contact_number || "—"}</div><small className="text-muted">{customer.email || "No email"}</small></td>
                            <td><div>{formatDate(followUpDate)}</div><small className="text-success">{elapsedLabel(customer.days_since_follow_up ?? customer.last_chat)}</small></td>
                            <td><div>{formatDate(lastOrderDate)}</div><small className="text-muted">{elapsedLabel(customer.days_since_last_order ?? customer.last_order)}</small></td>
                            <td><div className="fw-semibold">{money.format(Number(customer.total_sales ?? 0))}</div><small className="text-muted">{Number(customer.total_orders ?? 0).toLocaleString()} orders</small></td>
                            <td className="text-center"><BooleanIcon value={customer.chat} label="Chat" /></td><td className="text-center"><BooleanIcon value={customer.promo} label="Promo" /></td>
                            <td><Stack direction="row" spacing={1} justifyContent="center"><IconButton size="small" color="primary" onClick={() => openSupport(customer.id)} aria-label="Update follow-up"><UpdateIcon /></IconButton><Button as={Link} size="sm" variant="outline-primary" to={`/customers/customerTransactionList/${customer.id}`}>Transactions</Button><Button as={Link} size="sm" variant="outline-secondary" to={`/customers/customerProductList/${customer.id}`}>Products</Button></Stack></td>
                        </tr>;
                    })}
                </tbody>
            </table>
        </Box></Box>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2} mt={2}><Typography color="text.secondary" variant="body2">Showing {start.toLocaleString()}–{end.toLocaleString()} of {pagination.total.toLocaleString()} · {PAGE_SIZE} per page</Typography><Pagination count={pagination.pages} page={pagination.page} onChange={changePage} disabled={loading} color="primary" showFirstButton showLastButton /></Stack>

        <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered>
            <Modal.Header closeButton><Modal.Title>Update follow-up</Modal.Title></Modal.Header>
            <Modal.Body><p className="fw-semibold">{support.first_name} {support.last_name}</p><Form.Check className="mb-3" label="Customer contacted" checked={support.chat === 1} onChange={(event) => setSupport({ ...support, chat: event.target.checked ? 1 : 0 })} /><Form.Check label="Promotion offered" checked={support.promo === 1} onChange={(event) => setSupport({ ...support, promo: event.target.checked ? 1 : 0 })} /></Modal.Body>
            <Modal.Footer><Button variant="outline-secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={saveSupport} disabled={saving}>{saving && <CircularProgress size={15} color="inherit" sx={{ mr: 1 }} />}Save follow-up</Button></Modal.Footer>
        </Modal>
    </Box>;
};

export default CustomerConvo;
