import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { Box, Chip, CircularProgress, IconButton, LinearProgress, Pagination, Stack, Typography } from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import CustomerService from "./CustomerService";
import CustomerCommentModal from "./CustomerCommentModal";
import CustomerUpdateService from "../OtherService/CustomerUpdateService";
import { getAuthUserIdFromCookie } from "../User/authSession";

const PAGE_SIZE = 100;
const emptyFilters = { search: "", dateFrom: "", required_amount: "" };
const money = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });
const dateFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" });

function normalizeResponse(response, requestedPage) {
    const body = response?.data || {};
    const wrapped = body.data && !Array.isArray(body.data) ? body.data : body;
    const rows = Array.isArray(body.data) ? body.data : Array.isArray(wrapped.data) ? wrapped.data : [];
    const total = Number(body.total ?? wrapped.total ?? body.total_page ?? rows.length);
    return {
        rows,
        total,
        page: Number(body.current_page ?? wrapped.current_page ?? body.page ?? requestedPage),
        pages: Number(body.last_page ?? wrapped.last_page ?? Math.max(1, Math.ceil(total / PAGE_SIZE))),
    };
}

const CustomerBacklog = () => {
    const [filters, setFilters] = useState(emptyFilters);
    const [applied, setApplied] = useState(emptyFilters);
    const [customers, setCustomers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [viewComment, setViewComment] = useState(null);
    const [saving, setSaving] = useState(false);
    const [support, setSupport] = useState({ customer_id: 0, first_name: "", last_name: "", last_order_date: null, chat: 0, promo: 0, status: 0, backlog: 1 });

    const fetchCustomers = useCallback(async (page, activeFilters) => {
        setLoading(true);
        setError("");
        try {
            const response = await CustomerService.customerBacklogList(page, { ...activeFilters, page });
            const result = normalizeResponse(response, page);
            setCustomers(result.rows);
            setPagination({ page: result.page, pages: result.pages, total: result.total });
        } catch (e) {
            setCustomers([]);
            setPagination({ page: 1, pages: 1, total: 0 });
            setError(e?.response?.data?.message || "Unable to load backlog customers. Please try again.");
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchCustomers(1, emptyFilters); }, [fetchCustomers]);

    const sortedCustomers = useMemo(() => [...customers].sort((a, b) =>
        Number(b.days_since_last_order ?? b.last_order ?? 0) - Number(a.days_since_last_order ?? a.last_order ?? 0)
    ), [customers]);

    const filterError = useMemo(() => {
        if (filters.required_amount !== "" && Number(filters.required_amount) < 0) return "Minimum sales cannot be negative.";
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
    const openSupport = async (id) => {
        try {
            const { data } = await CustomerService.get(id);
            const row = customers.find((customer) => Number(customer.id) === Number(id));
            setSupport({ customer_id: data.id, first_name: data.first_name || "", last_name: data.last_name || "", last_order_date: row?.last_order_date ?? row?.date ?? row?.last_order_at ?? null, chat: Number(row?.chat ?? 0), promo: Number(row?.promo ?? 0), status: 0, backlog: 1 });
            setModalOpen(true);
        } catch (e) { setError(e?.response?.data?.message || "Unable to open this customer."); }
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
            setModalOpen(false);
            fetchCustomers(pagination.page, applied);
        } catch (e) { setError(e?.response?.data?.message || "Unable to update customer status."); }
        finally { setSaving(false); }
    };
    const formatDate = (value) => {
        if (!value) return "—";
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
    };
    const start = pagination.total ? (pagination.page - 1) * PAGE_SIZE + 1 : 0;
    const end = Math.min(pagination.page * PAGE_SIZE, pagination.total);

    return <Box sx={{ px: { xs: 1, md: 2 }, pb: 5 }}>
        <Box sx={{ background: "linear-gradient(135deg, #fff8ed 0%, #fff 65%)", border: "1px solid #eadfce", borderRadius: 3, p: { xs: 2, md: 3 }, mb: 3 }}>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} mb={2.5}>
                <Box><Typography variant="h4" fontWeight={700}>Customer backlog</Typography><Typography color="text.secondary">Customers set aside for a later follow-up, ranked by longest inactivity.</Typography></Box>
                <Chip label={`${pagination.total.toLocaleString()} customers`} color="warning" variant="outlined" sx={{ alignSelf: { xs: "flex-start", md: "center" }, fontWeight: 600 }} />
            </Stack>
            <Form onSubmit={applyFilters}>
                <div className="row g-3 align-items-end">
                    <Form.Group className="col-12"><Form.Label>Search customers</Form.Label><div className="d-flex gap-2"><Form.Control type="search" name="search" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search first name, last name, full name, or store name" /><Button type="submit" disabled={loading}>Search</Button></div></Form.Group>
                    <Form.Group className="col-12 col-sm-6 col-lg-4"><Form.Label>Last order before</Form.Label><Form.Control type="date" name="dateFrom" value={filters.dateFrom} onChange={(event) => setFilters({ ...filters, dateFrom: event.target.value })} /></Form.Group>
                    <Form.Group className="col-12 col-sm-6 col-lg-4"><Form.Label>Minimum sales</Form.Label><Form.Control type="number" min="0" step="0.01" name="required_amount" value={filters.required_amount} onChange={(event) => setFilters({ ...filters, required_amount: event.target.value })} placeholder="₱0" /></Form.Group>
                    <div className="col-12 col-lg-4 d-flex gap-2"><Button type="submit" className="flex-grow-1" disabled={loading || Boolean(filterError)}>Apply</Button><Button type="button" variant="outline-secondary" onClick={clearFilters} disabled={loading}>Clear</Button></div>
                </div>
                {filterError && <div className="text-danger small mt-2">{filterError}</div>}
            </Form>
        </Box>

        {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
        {loading && <LinearProgress color="warning" sx={{ mb: 1 }} />}
        <Box sx={{ border: "1px solid #e4e4e4", borderRadius: 2, overflow: "hidden", bgcolor: "white" }}><Box sx={{ overflowX: "auto" }}>
            <table className="table table-hover align-middle mb-0">
                <thead style={{ backgroundColor: "#212529", color: "#fff" }}><tr><th style={{ color: "#fff" }}>ID</th><th style={{ color: "#fff" }}>Customer</th><th style={{ color: "#fff" }}>Contact</th><th style={{ color: "#fff" }}>Last Order</th><th className="text-end" style={{ color: "#fff" }}>Sales</th><th className="text-center" style={{ color: "#fff" }}>Actions</th></tr></thead>
                <tbody>
                    {!loading && sortedCustomers.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-5">No backlog customers match these filters.</td></tr>}
                    {sortedCustomers.map((customer) => {
                        const days = Number(customer.days_since_last_order ?? customer.last_order ?? 0);
                        const lastOrderDate = customer.last_order_date ?? customer.date ?? customer.last_order_at;
                        return <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td><div className="fw-semibold">{[customer.first_name, customer.last_name].filter(Boolean).join(" ") || "Unnamed customer"}</div>{customer.store_name && <div style={{ marginTop: 4, color: "#526b8a", fontSize: 11, fontWeight: 500, lineHeight: 1.45, letterSpacing: ".02em", textTransform: "uppercase" }}>{customer.store_name}</div>}<small className="text-muted">{customer.address || "No address"}</small></td>
                            <td><div>{customer.contact_number || "—"}</div><small className="text-muted">{customer.email || "No email"}</small></td>
                            <td><div>{formatDate(lastOrderDate)}</div><small className="text-danger">{days === 0 ? "Today" : `${days.toLocaleString()} ${days === 1 ? "day" : "days"} ago`}</small></td>
                            <td className="text-end fw-semibold">{money.format(Number(customer.total_sales ?? 0))}</td>
                            <td><Stack direction="row" spacing={1} justifyContent="center"><IconButton size="small" color="primary" onClick={() => openSupport(customer.id)} aria-label="Update backlog status"><UpdateIcon /></IconButton><IconButton size="small" color="info" onClick={() => setViewComment({ customerName: [customer.first_name, customer.last_name].filter(Boolean).join(" "), comment: customer.comment ?? customer.follow_up_comment ?? customer.customer_update_comment ?? "" })} aria-label="View follow-up comment"><CommentOutlinedIcon /></IconButton><Button as={Link} size="sm" variant="outline-primary" to={`/customers/customerTransactionList/${customer.id}`}>Transactions</Button><Button as={Link} size="sm" variant="outline-secondary" to={`/customers/customerProductList/${customer.id}`}>Products</Button></Stack></td>
                        </tr>;
                    })}
                </tbody>
            </table>
        </Box></Box>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2} mt={2}><Typography color="text.secondary" variant="body2">Showing {start.toLocaleString()}–{end.toLocaleString()} of {pagination.total.toLocaleString()} · {PAGE_SIZE} per page</Typography><Pagination count={pagination.pages} page={pagination.page} onChange={changePage} disabled={loading} color="primary" showFirstButton showLastButton /></Stack>

        <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered>
            <Modal.Header closeButton><Modal.Title>Customer backlog status</Modal.Title></Modal.Header>
            <Modal.Body><div style={{ backgroundColor: "#f2f7fc", border: "1px solid #d9e6f2", borderLeft: "4px solid #1976d2", borderRadius: 8, padding: "12px 14px", marginBottom: 20 }}><div style={{ color: "#6b7d90", fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>Customer</div><div style={{ color: "#123a63", fontSize: 19, fontWeight: 800, lineHeight: 1.35 }}>{support.first_name} {support.last_name}</div></div><Form.Check className="mb-3" label="Keep in backlog" checked={support.backlog === 1} onChange={toggleSupport("backlog")} /><Form.Check className="mb-3" label="Customer contacted" checked={support.chat === 1} onChange={toggleSupport("chat")} /><Form.Check label="Offer a promotion" checked={support.promo === 1} onChange={toggleSupport("promo")} /></Modal.Body>
            <Modal.Footer><Button variant="outline-secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={saveSupport} disabled={saving}>{saving && <CircularProgress size={15} color="inherit" sx={{ mr: 1 }} />}Save status</Button></Modal.Footer>
        </Modal>
        <CustomerCommentModal show={Boolean(viewComment)} onHide={() => setViewComment(null)} customerName={viewComment?.customerName} comment={viewComment?.comment} />
    </Box>;
};

export default CustomerBacklog;
