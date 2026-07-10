import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditCalendarRoundedIcon from '@mui/icons-material/EditCalendarRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import OrderSupplierTransactionService from '../OrderSupplierTransaction/OrderSupplierTransactionService';
import './ReportPurchaseOrderList.css';

const emptyReport = {
    data: [],
    payment: [],
    total_balance: {},
    total_paid: {},
    code: '',
    message: '',
    total_sales: 0,
};

const formatDateInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getCurrentMonthFilters = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    return {
        dateFrom: formatDateInput(new Date(year, month, 1)),
        dateTo: formatDateInput(new Date(year, month + 1, 0)),
    };
};

const fetchAllPurchaseOrders = (filters) =>
    OrderSupplierTransactionService.fetchAllOrderSupplier(filters);

const deletePurchaseOrder = (id) =>
    OrderSupplierTransactionService.delete(id);

const canDeleteEmptyOrder = (order) =>
    Number(order.total_transaction_price) === 0
    && Number(order.payment_status) !== 1
    && order.status === 'PENDING';

const ReportPurchaseOrderList = ({
    fetchReport = fetchAllPurchaseOrders,
    title = 'Purchase order report',
    description = 'Review supplier orders, payment progress, and delivery activity in one place.',
    emptyMessage = 'No purchase orders found',
    allowDateEdit = true,
    allowDelete = true,
    showFilters = true,
    deleteOrderRequest = deletePurchaseOrder,
    canDeleteOrder = canDeleteEmptyOrder,
    deleteActionLabel = 'Delete',
    deleteDialogTitle = 'Delete purchase order?',
    deleteDialogText = 'This purchase order will be removed. This action cannot be undone.',
}) => {
    const [report, setReport] = useState(emptyReport);
    const [filters, setFilters] = useState(getCurrentMonthFilters);
    const [filterErrors, setFilterErrors] = useState({});
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [dateDialog, setDateDialog] = useState({ open: false, id: 0, created_at: '' });
    const [updatingDate, setUpdatingDate] = useState(false);
    const [error, setError] = useState('');

    const loadReport = useCallback((dateFilters) => {
        setLoading(true);
        setError('');
        return fetchReport(dateFilters)
            .then((response) => {
                setReport(response.data || emptyReport);
            })
            .catch(() => {
                setError('The purchase order report could not be loaded. Please try again.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [fetchReport]);

    useEffect(() => {
        loadReport(getCurrentMonthFilters());
    }, [loadReport]);

    const currency = (value) =>
        new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(Number(value || 0));

    const formatDate = (value) => {
        if (!value) return '—';
        const normalized = String(value).replace(' ', 'T');
        const date = new Date(normalized);
        if (Number.isNaN(date.getTime())) return value;
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        }).format(date);
    };

    const rows = Array.isArray(report.data) ? report.data : [];
    const visibleRows = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return rows;
        return rows.filter((row) =>
            [
                row.id,
                row.invoice_number,
                row.supplier_name,
                row.requestor,
                row.approval,
                row.approval_status,
                row.status,
            ].some((value) => String(value || '').toLowerCase().includes(term))
        );
    }, [rows, search]);

    const totalPaid = Number(report.total_paid?.total_paid || 0);
    const totalBalance = Number(report.total_balance?.total_balance || 0);
    const totalOrders = rows.length;
    const reportTotal = Number(report.total_sales || 0)
        || rows.reduce((sum, row) => sum + Number(row.total_transaction_price || 0), 0);

    const applyFilters = () => {
        const errors = {};
        if (!filters.dateFrom) errors.dateFrom = 'Start date is required.';
        if (!filters.dateTo) errors.dateTo = 'End date is required.';
        if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) {
            errors.dateTo = 'End date must be after the start date.';
        }
        setFilterErrors(errors);
        if (Object.keys(errors).length === 0) {
            loadReport(filters);
        }
    };

    const showAllOrders = () => {
        setFilters({ dateFrom: '', dateTo: '' });
        setFilterErrors({});
        loadReport();
    };

    const openDateEditor = (id) => {
        setUpdatingDate(true);
        OrderSupplierTransactionService.get(id)
            .then((response) => {
                const value = response.data?.created_at
                    ? String(response.data.created_at).split(' ')[0]
                    : '';
                setDateDialog({ open: true, id, created_at: value });
            })
            .catch(() => {
                setError('The draft date could not be loaded.');
            })
            .finally(() => {
                setUpdatingDate(false);
            });
    };

    const updateDate = () => {
        setUpdatingDate(true);
        OrderSupplierTransactionService.updateDateOrderSupplier({
            id: dateDialog.id,
            created_at: dateDialog.created_at,
        })
            .then(() => {
                setDateDialog({ open: false, id: 0, created_at: '' });
                loadReport(filters.dateFrom && filters.dateTo ? filters : undefined);
            })
            .catch(() => {
                setError('The draft date could not be updated.');
            })
            .finally(() => {
                setUpdatingDate(false);
            });
    };

    const deleteOrder = () => {
        setDeleting(true);
        deleteOrderRequest(deleteId)
            .then(() => {
                setDeleteId(null);
                loadReport(filters.dateFrom && filters.dateTo ? filters : undefined);
            })
            .catch(() => {
                setError('The purchase order could not be deleted.');
            })
            .finally(() => {
                setDeleting(false);
            });
    };

    const statusClass = (value) => {
        const normalized = String(value || 'pending').toLowerCase().replaceAll('_', '-');
        return `po-report-status po-report-status-${normalized}`;
    };

    return (
        <main className="po-report-page">
            <div className="po-report-shell">
                <header className="po-report-header">
                    <div className="po-report-header-icon">
                        <ReceiptLongRoundedIcon />
                    </div>
                    <div>
                        <span>Reports</span>
                        <h1>{title}</h1>
                        <p>{description}</p>
                    </div>
                </header>

                {error && <Alert className="po-report-alert" severity="error">{error}</Alert>}

                {showFilters && <section className="po-report-filters">
                    <div className="po-report-filter-heading">
                        <div>
                            <span>Report range</span>
                            <h2>Filter purchase orders</h2>
                        </div>
                        <CalendarMonthRoundedIcon />
                    </div>
                    <div className="po-report-filter-grid">
                        <TextField
                            label="Date from"
                            type="date"
                            value={filters.dateFrom}
                            onChange={(event) => setFilters({ ...filters, dateFrom: event.target.value })}
                            error={Boolean(filterErrors.dateFrom)}
                            helperText={filterErrors.dateFrom || ' '}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        <TextField
                            label="Date to"
                            type="date"
                            value={filters.dateTo}
                            onChange={(event) => setFilters({ ...filters, dateTo: event.target.value })}
                            error={Boolean(filterErrors.dateTo)}
                            helperText={filterErrors.dateTo || ' '}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        <div className="po-report-filter-actions">
                            <Button variant="contained" onClick={applyFilters} disabled={loading}>
                                Generate report
                            </Button>
                            <Button variant="outlined" onClick={showAllOrders} disabled={loading}>
                                All
                            </Button>
                        </div>
                    </div>
                    {loading && <LinearProgress className="po-report-progress" />}
                </section>}

                <section className="po-report-metrics">
                    <article>
                        <span className="po-report-metric-icon"><ReceiptLongRoundedIcon /></span>
                        <div><small>Orders</small><strong>{totalOrders}</strong></div>
                    </article>
                    <article>
                        <span className="po-report-metric-icon"><Inventory2OutlinedIcon /></span>
                        <div><small>Order value</small><strong>{currency(reportTotal)}</strong></div>
                    </article>
                    <article>
                        <span className="po-report-metric-icon paid"><PaymentsOutlinedIcon /></span>
                        <div><small>Total paid</small><strong>{currency(totalPaid)}</strong></div>
                    </article>
                    <article>
                        <span className="po-report-metric-icon balance"><AccountBalanceWalletOutlinedIcon /></span>
                        <div><small>Balance</small><strong>{currency(totalBalance)}</strong></div>
                    </article>
                </section>

                <section className="po-report-table-card">
                    <div className="po-report-table-toolbar">
                        <div>
                            <span>Purchase orders</span>
                            <h2>Report details</h2>
                        </div>
                        <TextField
                            className="po-report-search"
                            size="small"
                            placeholder="Search order, supplier, or person"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            InputProps={{ startAdornment: <SearchRoundedIcon /> }}
                        />
                    </div>

                    <div className="po-report-table-scroll">
                        <table className="po-report-table">
                            <thead>
                                <tr>
                                    <th>Order / Supplier</th>
                                    <th>Financials</th>
                                    <th>People</th>
                                    <th>Status</th>
                                    <th>Timeline</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading && visibleRows.length === 0 && (
                                    <tr>
                                        <td colSpan="6">
                                            <div className="po-report-empty">
                                                <ReceiptLongRoundedIcon />
                                                <strong>{emptyMessage}</strong>
                                                <span>Try another date range or search term.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {visibleRows.map((order) => {
                                    const paymentRows = Array.isArray(order.mode_of_payment)
                                        ? order.mode_of_payment
                                        : [];
                                    const canDelete = canDeleteOrder(order);
                                    const deliveryCompleted = String(order.status).toUpperCase() === 'COMPLETED';

                                    return (
                                        <tr key={order.id}>
                                            <td>
                                                <strong className="po-report-order-id">PO-{order.id}</strong>
                                                <span className="po-report-muted">
                                                    {order.invoice_number || 'No invoice'}
                                                </span>
                                                <strong className="po-report-supplier-name">
                                                    {order.supplier_name || '—'}
                                                </strong>
                                            </td>
                                            <td>
                                                <div className="po-report-financials">
                                                    <span>
                                                        <small>Order total</small>
                                                        <strong>{currency(order.total_transaction_price)}</strong>
                                                    </span>
                                                    {paymentRows.length === 0 ? (
                                                        <span>
                                                            <small>Payments</small>
                                                            <em>No payment</em>
                                                        </span>
                                                    ) : paymentRows.map((payment) => (
                                                        <span key={payment.id || `${payment.amount}-${payment.account_number}`}>
                                                            <small>{payment.bank_name || 'Payment'}</small>
                                                            <strong>{currency(payment.amount)}</strong>
                                                            <em>
                                                                {[payment.account_description, payment.account_number]
                                                                    .filter(Boolean).join(' · ')}
                                                            </em>
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="po-report-pair">
                                                    <span>
                                                        <small>Requestor</small>
                                                        <strong>{order.requestor || '—'}</strong>
                                                    </span>
                                                    <span>
                                                        <small>Approver</small>
                                                        <strong>{order.approval || '—'}</strong>
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="po-report-status-list">
                                                    <span>
                                                        <small>Approval</small>
                                                        <b className={statusClass(order.approval_status)}>
                                                            {order.approval_status || 'PENDING'}
                                                        </b>
                                                    </span>
                                                    <span>
                                                        <small>Delivery</small>
                                                        <b className={statusClass(order.status)}>
                                                            {order.status || 'PENDING'}
                                                        </b>
                                                    </span>
                                                    <span>
                                                        <small>Payment</small>
                                                        <b className={statusClass(
                                                            Number(order.payment_status) === 1 ? 'COMPLETED' : 'PENDING'
                                                        )}>
                                                            {Number(order.payment_status) === 1 ? 'COMPLETED' : 'PENDING'}
                                                        </b>
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="po-report-timeline">
                                                    <span>
                                                        <small>Draft</small>
                                                        {formatDate(order.created_at)}
                                                        {allowDateEdit && order.status === 'PENDING' && (
                                                            <Tooltip title="Update draft date">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => openDateEditor(order.id)}
                                                                    disabled={updatingDate}
                                                                >
                                                                    <EditCalendarRoundedIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </span>
                                                    <span><small>Sent</small>{formatDate(order.send_date)}</span>
                                                    {deliveryCompleted && (
                                                        <span className="received">
                                                            <small>Received</small>
                                                            {formatDate(order.updated_at)}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="po-report-actions">
                                                    <Button
                                                        component={Link}
                                                        to={`/viewOrder/${order.id}`}
                                                        startIcon={<VisibilityOutlinedIcon />}
                                                        className="view"
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        component={Link}
                                                        to={`/editSupplierTransaction/${order.id}`}
                                                        startIcon={<EditNoteRoundedIcon />}
                                                        className="invoice"
                                                    >
                                                        Invoice
                                                    </Button>
                                                    <Button
                                                        component={Link}
                                                        to={`/paymentOrder/${order.id}`}
                                                        startIcon={<PaymentsOutlinedIcon />}
                                                        className="payment"
                                                    >
                                                        Payment
                                                    </Button>
                                                    <Button
                                                        component={Link}
                                                        to={`/orderSupplierApproval/${order.id}`}
                                                        className="review"
                                                    >
                                                        Review
                                                    </Button>
                                                    {order.status !== 'COMPLETED' && (
                                                        <Button
                                                            component={Link}
                                                            to={`/addProductOrderSupplierTransaction/${order.id}`}
                                                            className="products"
                                                        >
                                                            Products
                                                        </Button>
                                                    )}
                                                    <Button
                                                        component={Link}
                                                        to={`/printOrderSupplier/${order.id}`}
                                                        startIcon={<PictureAsPdfOutlinedIcon />}
                                                        className="print"
                                                    >
                                                        Print
                                                    </Button>
                                                    {allowDelete && canDelete && (
                                                        <Button
                                                            onClick={() => setDeleteId(order.id)}
                                                            startIcon={<DeleteOutlineRoundedIcon />}
                                                            className="delete"
                                                        >
                                                            {deleteActionLabel}
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            <Dialog open={deleteId !== null} onClose={() => !deleting && setDeleteId(null)}>
                <DialogTitle>{deleteDialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {deleteDialogText} PO-{deleteId}.
                    </DialogContentText>
                </DialogContent>
                {deleting && <div className="po-report-dialog-loading"><CircularProgress size={25} /></div>}
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)} disabled={deleting}>Keep order</Button>
                    <Button color="error" variant="contained" onClick={deleteOrder} disabled={deleting}>
                        {deleteActionLabel}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={dateDialog.open}
                onClose={() => !updatingDate && setDateDialog({ open: false, id: 0, created_at: '' })}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Update draft date</DialogTitle>
                <DialogContent>
                    <DialogContentText className="po-report-date-help">
                        Change the recorded draft date for PO-{dateDialog.id}.
                    </DialogContentText>
                    <TextField
                        type="date"
                        label="Draft date"
                        value={dateDialog.created_at}
                        onChange={(event) => setDateDialog({ ...dateDialog, created_at: event.target.value })}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDateDialog({ open: false, id: 0, created_at: '' })}
                        disabled={updatingDate}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={updateDate}
                        disabled={updatingDate || !dateDialog.created_at}
                    >
                        Save date
                    </Button>
                </DialogActions>
            </Dialog>
        </main>
    );
};

export default ReportPurchaseOrderList;
