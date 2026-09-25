import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import PrintingTransactionService from './PrintingTransactionService';
import UserService from '../User/UserService.service';

const formatDate = (date) => date ? String(date).slice(0, 10) : '—';
const elapsedDays = (start, end) => {
    if (!start) return null;
    const startTime = Date.parse(`${String(start).slice(0, 10)}T00:00:00Z`);
    const endTime = Date.parse(`${String(end).slice(0, 10)}T00:00:00Z`);
    if (Number.isNaN(startTime) || Number.isNaN(endTime)) return null;
    return Math.max(0, Math.round((endTime - startTime) / 86400000));
};
const todayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};
const dateInputValue = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const currentMonthStart = () => {
    const today = new Date();
    return dateInputValue(new Date(today.getFullYear(), today.getMonth(), 1));
};
const currentMonthEnd = () => {
    const today = new Date();
    return dateInputValue(new Date(today.getFullYear(), today.getMonth() + 1, 0));
};
const formatAmount = (amount) => new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
}).format(Number(amount) || 0);
const detailColors = {
    PENDING: { color: '#9a5b08', background: '#fff8e7', border: '#f2d38a' },
    OLD: { color: '#167347', background: '#effcf4', border: '#a7e4b8' },
    NEW: { color: '#167347', background: '#effcf4', border: '#a7e4b8' },
    APPROVED: { color: '#167347', background: '#effcf4', border: '#a7e4b8' },
    REJECTED: { color: '#b42318', background: '#fff1f2', border: '#efb0b0' },
    NORMAL: { color: '#167347', background: '#effcf4', border: '#a7e4b8' },
    RUSH: { color: '#b42318', background: '#fff1f2', border: '#efb0b0' },
    COMPLETED: { color: '#167347', background: '#effcf4', border: '#a7e4b8' },
};
const detailBadge = (value, label = value) => {
    const colors = detailColors[value] || { color: '#475569', background: '#f8fafc', border: '#cbd5e1' };
    return <Box component="span" sx={{ display: 'inline-flex', px: 0.85, py: 0.3, borderRadius: 1, border: `1px solid ${colors.border}`, bgcolor: colors.background, color: colors.color, fontSize: 11.5, lineHeight: 1.2, fontWeight: 800, whiteSpace: 'nowrap' }}>{label || '—'}</Box>;
};
const plateIcon = (hasPlate) => <Tooltip title={hasPlate ? 'Already Have Plate' : 'No Plate Yet'} arrow>
    <Box component="span" aria-label={hasPlate ? 'Already Have Plate' : 'No Plate Yet'} sx={{ display: 'inline-flex', p: 0.45, borderRadius: '50%', bgcolor: hasPlate ? '#effcf4' : '#fff1f2', color: hasPlate ? '#168a47' : '#b42318', border: `1px solid ${hasPlate ? '#a7e4b8' : '#efb0b0'}` }}>
        {hasPlate ? <CheckCircleRoundedIcon sx={{ fontSize: 20 }} /> : <CancelRoundedIcon sx={{ fontSize: 20 }} />}
    </Box>
</Tooltip>;
const pickupIcon = (isDone) => <Tooltip title={isDone ? 'Pickup completed' : 'Pickup pending'} arrow>
    <Box component="span" aria-label={isDone ? 'Pickup completed' : 'Pickup pending'} sx={{ display: 'inline-flex', p: 0.45, borderRadius: '50%', bgcolor: isDone ? '#effcf4' : '#fff8e7', color: isDone ? '#168a47' : '#b36b08', border: `1px solid ${isDone ? '#a7e4b8' : '#f2d38a'}` }}>
        {isDone ? <CheckCircleRoundedIcon sx={{ fontSize: 20 }} /> : <ScheduleRoundedIcon sx={{ fontSize: 20 }} />}
    </Box>
</Tooltip>;
const paymentIcon = (status) => {
    const isCompleted = Number(status) === 1;
    const isPending = Number(status) === 2;
    if (!isCompleted && !isPending) return '—';
    return <Tooltip title={isCompleted ? 'Payment completed' : 'Payment pending'} arrow>
        <Box component="span" aria-label={isCompleted ? 'Payment completed' : 'Payment pending'} sx={{ display: 'inline-flex', p: 0.45, borderRadius: '50%', bgcolor: isCompleted ? '#effcf4' : '#fff8e7', color: isCompleted ? '#168a47' : '#b36b08', border: `1px solid ${isCompleted ? '#a7e4b8' : '#f2d38a'}` }}>
            {isCompleted ? <CheckCircleRoundedIcon sx={{ fontSize: 20 }} /> : <ScheduleRoundedIcon sx={{ fontSize: 20 }} />}
        </Box>
    </Tooltip>;
};
const orderProgress = (transaction) => <Box sx={{ display: 'grid', gap: 0.5, minWidth: 72 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.75 }}>
        <Typography variant="caption" sx={{ color: '#526579', fontSize: 10.5, fontWeight: 700 }}>Payment</Typography>
        {paymentIcon(transaction.payment_status)}
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.75 }}>
        <Typography variant="caption" sx={{ color: '#526579', fontSize: 10.5, fontWeight: 700 }}>Pickup</Typography>
        {pickupIcon(Number(transaction.is_pickup) === 1)}
    </Box>
</Box>;
const detailIcon = (value) => {
    const icons = {
        NEW: AddCircleOutlineRoundedIcon,
        OLD: HistoryRoundedIcon,
        PENDING: HourglassEmptyRoundedIcon,
        APPROVED: CheckCircleRoundedIcon,
        REJECTED: CancelRoundedIcon,
        NORMAL: ScheduleRoundedIcon,
        RUSH: BoltRoundedIcon,
    };
    const Icon = icons[value] || ErrorOutlineRoundedIcon;
    const colors = detailColors[value] || { color: '#475569', background: '#f8fafc', border: '#cbd5e1' };
    if (value === 'RUSH') return <Tooltip title="RUSH" arrow>
        <Box component="span" aria-label="RUSH" sx={{ display: 'inline-flex', p: 0.45, borderRadius: '50%', background: 'linear-gradient(90deg, #22a35a 0 50%, #dc3545 50% 100%)', color: '#fff', border: '1px solid #d5a1a6', boxShadow: '0 0 0 2px #fff inset' }}>
            <BoltRoundedIcon sx={{ fontSize: 20, filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.35))' }} />
        </Box>
    </Tooltip>;
    return <Tooltip title={value || 'Not set'} arrow>
        <Box component="span" aria-label={value || 'Not set'} sx={{ display: 'inline-flex', p: 0.45, borderRadius: '50%', bgcolor: colors.background, color: colors.color, border: `1px solid ${colors.border}` }}>
            <Icon sx={{ fontSize: 20 }} />
        </Box>
    </Tooltip>;
};
const productionDetails = (transaction) => <Box sx={{ display: 'grid', gap: 0.35, minWidth: 112 }}>
    {[
        ['Logo', detailIcon(transaction.logo)],
        ['Plate', plateIcon(Number(transaction.plate) === 1)],
        ['Mock-up', detailIcon(transaction.mock_up_status)],
        ['Priority', detailIcon(transaction.order_priority)],
    ].map(([label, icon]) => <Box key={label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Typography variant="caption" sx={{ color: '#526579', fontWeight: 700, fontSize: 11 }}>{label}</Typography>
        {icon}
    </Box>)}
</Box>;

const PrintingTransactionList = ({ fixedStatus = null }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateFrom, setDateFrom] = useState(currentMonthStart);
    const [dateTo, setDateTo] = useState(currentMonthEnd);
    const [orderDateSort, setOrderDateSort] = useState('id_desc');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
    const [pickupFilter, setPickupFilter] = useState('ALL');
    const [coordinatorFilter, setCoordinatorFilter] = useState('ALL');
    const [coordinators, setCoordinators] = useState([]);
    const deleteTransaction = async (transaction) => {
        const canDelete = Number(transaction.shop_order_total_price || 0) === 0;
        if (!canDelete || deletingId !== null) return;
        if (!window.confirm(`Delete printing transaction #${transaction.id}?`)) return;
        setDeletingId(transaction.id);
        setError('');
        try {
            await PrintingTransactionService.delete(transaction.id);
            setTransactions((current) => current.filter((item) => item.id !== transaction.id));
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to delete the printing transaction.');
        } finally {
            setDeletingId(null);
        }
    };
    const renderStageDays = (start, end) => {
        const days = start && end ? elapsedDays(start, end) : null;
        return days === null ? '—' : `${days} ${days === 1 ? 'day' : 'days'}`;
    };
    const renderSupplierDays = (transaction) => {
        const days = elapsedDays(transaction.sent_date, transaction.received_date || todayDate());
        if (days === null) return '—';
        const target = transaction.order_priority === 'RUSH' ? 3 : 7;
        return <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.2 }}>
            <Chip size="small" label={`${days} ${days === 1 ? 'day' : 'days'}`} color={days > target ? 'error' : days === target ? 'warning' : 'success'} sx={{ height: 22, fontWeight: 800, '& .MuiChip-label': { px: 1, fontSize: 12 } }} />
            <Typography variant="caption" sx={{ color: days > target ? '#b42318' : '#64748b', whiteSpace: 'nowrap', fontSize: 11 }}>
                {days > target ? `${days - target} ${days - target === 1 ? 'day' : 'days'} overdue` : `${transaction.received_date ? 'of' : 'ongoing ·'} ${target}-day target`}
            </Typography>
        </Box>;
    };
    const renderTimeline = (transaction) => {
        const timelineState = transaction.received_date
            ? { label: 'RECEIVED', background: '#e8f8ee', color: '#167347', border: '#a7e4b8' }
            : transaction.sent_date
                ? { label: 'IN TRANSIT', background: '#fff4dc', color: '#9a5b08', border: '#f2cf80' }
                : { label: 'NOT SENT', background: '#f1f5f9', color: '#64748b', border: '#cbd5e1' };
        return <Box sx={{ minWidth: 155, borderRadius: 1.5, border: '1px solid #cfe0ec', bgcolor: '#fff', overflow: 'hidden', boxShadow: '0 2px 6px rgba(31,72,105,.05)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, px: 0.8, py: 0.45 }}>
            <Typography variant="caption" sx={{ color: '#526579', fontSize: 11 }}>Order → Supplier</Typography>
            <Typography variant="caption" sx={{ color: '#263f56', fontSize: 11, fontWeight: 800 }}>{renderStageDays(transaction.order_date, transaction.sent_date)}</Typography>
        </Box>
        <Box sx={{ px: 0.8, py: 0.65, bgcolor: '#f5fbff', borderTop: '1px solid #deebf4', borderBottom: '1px solid #deebf4', borderLeft: '3px solid #168bb6' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 0.5, mb: 0.45 }}>
                <Typography variant="caption" sx={{ color: '#16486b', fontWeight: 900, fontSize: 11.5 }}>Supplier → Warehouse</Typography>
                <Box component="span" sx={{ px: 0.55, py: 0.05, borderRadius: 0.75, bgcolor: timelineState.background, color: timelineState.color, border: `1px solid ${timelineState.border}`, fontSize: 8.5, lineHeight: 1.35, fontWeight: 900, letterSpacing: 0.35, whiteSpace: 'nowrap' }}>{timelineState.label}</Box>
            </Box>
            {renderSupplierDays(transaction)}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, px: 0.8, py: 0.4, bgcolor: '#f8fafc' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: 10.5 }}>Overall</Typography>
            <Typography variant="caption" sx={{ color: '#526579', fontWeight: 700, fontSize: 10.5 }}>{renderStageDays(transaction.order_date, transaction.received_date || todayDate())}</Typography>
        </Box>
    </Box>;
    };

    useEffect(() => {
        setLoading(true);
        setError('');
        PrintingTransactionService.getAll({
            ...(fixedStatus !== null ? { status: fixedStatus } : statusFilter !== 'ALL' ? { status: statusFilter } : {}),
            ...(dateFrom ? { date_from: dateFrom } : {}),
            ...(dateTo ? { date_to: dateTo } : {}),
            ...(['asc', 'desc'].includes(orderDateSort) ? { order_date_sort: orderDateSort } : {}),
            ...(paymentStatusFilter !== 'ALL' ? { payment_status: paymentStatusFilter } : {}),
            ...(pickupFilter !== 'ALL' ? { is_pickup: pickupFilter } : {}),
            ...(coordinatorFilter !== 'ALL' ? { order_coordinator_id: coordinatorFilter } : {}),
        })
            .then((response) => {
                const result = response.data?.data ?? response.data;
                setTransactions(Array.isArray(result) ? result : []);
            })
            .catch((requestError) => {
                setError(requestError.response?.data?.message || 'Unable to load printing transactions.');
            })
            .finally(() => setLoading(false));
    }, [fixedStatus, statusFilter, dateFrom, dateTo, orderDateSort, paymentStatusFilter, pickupFilter, coordinatorFilter]);

    useEffect(() => {
        UserService.fetchUserList()
            .then((response) => {
                const data = response.data?.data ?? response.data;
                setCoordinators((Array.isArray(data) ? data : []).sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''))));
            })
            .catch(() => setCoordinators([]));
    }, []);

    const normalizedSearch = search.trim().toLowerCase();
    const visibleTransactions = transactions.filter((transaction) => {
        const searchable = [transaction.id, transaction.shop_order_transaction_id, transaction.customer_name, transaction.store_name, transaction.customer?.store_name, transaction.order_coordinator_name].filter(Boolean).join(' ').toLowerCase();
        return !normalizedSearch || searchable.includes(normalizedSearch);
    }).sort((a, b) => orderDateSort === 'id_desc' ? Number(b.id) - Number(a.id) : 0);
    const completedCount = transactions.filter((transaction) => transaction.order_status === 'COMPLETED').length;
    const pendingCount = transactions.length - completedCount;
    const overdueCount = transactions.filter((transaction) => {
        const days = elapsedDays(transaction.order_date, transaction.received_date || todayDate());
        return days !== null && days > (transaction.order_priority === 'RUSH' ? 3 : 7);
    }).length;
    const completedRowNeedsAttention = (transaction) => fixedStatus === 'COMPLETED' && (
        Number(transaction.payment_status) !== 1
        || Number(transaction.is_pickup) !== 1
        || transaction.order_status !== 'COMPLETED'
    );
    const headerTheme = fixedStatus === 'PENDING'
        ? { background: 'linear-gradient(110deg, #17345f 0%, #244f78 52%, #b87514 52%, #d99a32 100%)', eyebrow: '#fff1bd' }
        : fixedStatus === 'COMPLETED'
            ? { background: 'linear-gradient(110deg, #17345f 0%, #244f78 52%, #18784a 52%, #2b9662 100%)', eyebrow: '#c8f5da' }
            : { background: 'linear-gradient(120deg, #172c52 0%, #254b72 58%, #236a86 100%)', eyebrow: '#9ee8f2' };

    return (
        <Box sx={{ bgcolor: '#f3f6fb', minHeight: '100vh', py: { xs: 2, md: 4 } }}>
            <Box sx={{ width: 'min(1320px, calc(100% - 32px))', mx: 'auto' }}>
                <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #dfe6f1', overflow: 'hidden', boxShadow: '0 14px 40px rgba(31,48,84,.08)' }}>
                    <Box sx={{ display: 'flex', height: 5 }}>
                        <Box sx={{ flex: 1, bgcolor: '#16b8d4' }} />
                        <Box sx={{ flex: 1, bgcolor: '#dd4d9c' }} />
                        <Box sx={{ flex: 1, bgcolor: '#f2c94c' }} />
                        <Box sx={{ flex: 1, bgcolor: '#233049' }} />
                    </Box>
                    <Box sx={{ color: '#fff', px: { xs: 2.5, md: 3.5 }, py: { xs: 2.5, md: 3 }, background: headerTheme.background, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 50, height: 50, bgcolor: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.16)', borderRadius: 2, display: 'grid', placeItems: 'center' }}><PaletteRoundedIcon /></Box>
                        <Box>
                            <Typography variant="overline" sx={{ color: headerTheme.eyebrow, fontWeight: 800, letterSpacing: 1.5 }}>PRINTING</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.15 }}>{fixedStatus === 'PENDING' ? 'Pending Printing Transactions' : fixedStatus === 'COMPLETED' ? 'Completed Printing Transactions' : 'Printing Transactions'}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ p: 2, bgcolor: '#fff', borderBottom: '1px solid #dfe6ef' }}>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {[
                                ['Total', transactions.length, '#eaf4fc', '#1d4b71'],
                                ['Pending', pendingCount, '#fff8e7', '#9a5b08'],
                                ['Completed', completedCount, '#effcf4', '#167347'],
                                ['Overdue', overdueCount, '#fff1f2', '#b42318'],
                            ].map(([label, count, background, color]) => <Box key={label} sx={{ minWidth: 76, px: 1.25, py: 0.75, borderRadius: 1.5, bgcolor: background }}>
                                <Typography variant="caption" sx={{ display: 'block', color: '#64748b', fontWeight: 700 }}>{label}</Typography>
                                <Typography sx={{ color, fontWeight: 900, fontSize: 18, lineHeight: 1.1 }}>{count}</Typography>
                            </Box>)}
                        </Box>
                        <Box sx={{ mt: 2, p: 2, borderRadius: 2, border: '1px solid #dce5ef', bgcolor: '#f8fafc' }}>
                            <Typography variant="caption" sx={{ display: 'block', mb: 1.5, color: '#526579', fontWeight: 850, letterSpacing: 0.7, textTransform: 'uppercase' }}>Filter transactions</Typography>
                            <Box sx={{ display: 'grid', gap: 2 }}>
                                <Box sx={{ pb: 2, borderBottom: '1px solid #e2e8f0' }}>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 0.75, color: '#718096', fontWeight: 750 }}>Find & assignment</Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: fixedStatus === null ? 'minmax(260px, 2fr) minmax(150px, 1fr) minmax(190px, 1.25fr)' : 'minmax(300px, 2fr) minmax(200px, 1fr)' }, gap: 1.5 }}>
                                        <TextField size="small" placeholder="Search ID, customer, store…" value={search} onChange={(event) => setSearch(event.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }} />
                                        {fixedStatus === null && <TextField select size="small" label="Status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><MenuItem value="ALL">All statuses</MenuItem><MenuItem value="PENDING">Pending</MenuItem><MenuItem value="COMPLETED">Completed</MenuItem></TextField>}
                                        <TextField select size="small" label="Coordinator" value={coordinatorFilter} onChange={(event) => setCoordinatorFilter(event.target.value)}><MenuItem value="ALL">All coordinators</MenuItem>{coordinators.map((user) => <MenuItem key={user.id} value={String(user.id)}>{user.name || `User #${user.id}`}</MenuItem>)}</TextField>
                                    </Box>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 0.75, color: '#718096', fontWeight: 750 }}>Schedule & fulfillment</Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))', xl: 'repeat(5, minmax(0, 1fr))' }, gap: 1.5 }}>
                                        <TextField size="small" type="date" label="From" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} InputLabelProps={{ shrink: true }} />
                                        <TextField size="small" type="date" label="To" value={dateTo} onChange={(event) => setDateTo(event.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: dateFrom || undefined }} />
                                        <TextField select size="small" label="Sort" value={orderDateSort} onChange={(event) => setOrderDateSort(event.target.value)}><MenuItem value="id_desc">Newest transaction</MenuItem><MenuItem value="desc">Newest order date</MenuItem><MenuItem value="asc">Oldest order date</MenuItem></TextField>
                                        <TextField select size="small" label="Payment" value={paymentStatusFilter} onChange={(event) => setPaymentStatusFilter(event.target.value)}><MenuItem value="ALL">All payments</MenuItem><MenuItem value="1">Completed</MenuItem><MenuItem value="2">Pending</MenuItem></TextField>
                                        <TextField select size="small" label="Pickup" value={pickupFilter} onChange={(event) => setPickupFilter(event.target.value)}><MenuItem value="ALL">All pickups</MenuItem><MenuItem value="0">Pending</MenuItem><MenuItem value="1">Completed</MenuItem></TextField>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
                    ) : (
                        <TableContainer>
                            <Table size="small" sx={{ width: '100%', tableLayout: 'auto', '& .MuiTableCell-root': { px: 1, py: 0.75, fontSize: 12.5, lineHeight: 1.25, borderBottom: '1px solid #e5ebf1', borderRight: '1px solid #edf1f5' }, '& .MuiTableHead-root .MuiTableCell-root': { py: 1.1, bgcolor: '#f4f7fb', color: '#42566c', fontSize: 11.5, fontWeight: 850, letterSpacing: 0.45, textTransform: 'uppercase', whiteSpace: 'nowrap', borderBottom: '1px solid #d7e1eb' }, '& .MuiTableBody-root .MuiTableRow-root:nth-of-type(even)': { bgcolor: '#fbfcfe' }, '& .MuiTableBody-root .MuiTableRow-root:hover': { bgcolor: '#f1f7fc' }, '& .MuiTableRow-root:last-child .MuiTableCell-root': { borderBottom: 0 } }} aria-label="printing transactions">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                        <TableCell>IDs</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell>Coordinator</TableCell>
                                        <TableCell align="right">Print Total</TableCell>
                                        <TableCell>Progress</TableCell>
                                        <TableCell>Production</TableCell>
                                        <TableCell>Order</TableCell>
                                        <TableCell>Sent to Supplier</TableCell>
                                        <TableCell>Warehouse Received</TableCell>
                                        <TableCell sx={{ minWidth: 150, fontWeight: 800, color: '#1d4b71', bgcolor: '#eaf4fc' }}><Tooltip title="Order to sent, sent to received, and overall days"><span>Days Timeline</span></Tooltip></TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visibleTransactions.length === 0 ? (
                                        <TableRow><TableCell colSpan={12} align="center" sx={{ py: 6 }}>{transactions.length ? 'No transactions match the current filters.' : 'No printing transactions found.'}</TableCell></TableRow>
                                    ) : visibleTransactions.map((transaction) => (
                                        <TableRow key={transaction.id} hover sx={completedRowNeedsAttention(transaction) ? { transition: 'background-color .15s ease', bgcolor: '#fff3f3 !important', '&:hover': { bgcolor: '#ffe8e8 !important' }, '& .MuiTableCell-root:first-of-type': { borderLeft: '4px solid #dc3545' } } : { transition: 'background-color .15s ease' }}>
                                            <TableCell>
                                                <Link component={RouterLink} to={`/printingTransaction/${transaction.id}/edit`} underline="hover" sx={{ display: 'block', color: '#1769aa', fontWeight: 900, fontSize: 14 }}>#{transaction.id}</Link>
                                                <Typography variant="caption" sx={{ color: '#64748b', whiteSpace: 'nowrap' }}>#{transaction.shop_order_transaction_id}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: '#203247', fontWeight: 700, fontSize: 13 }}>{transaction.customer_name || '—'}</Typography>
                                                {(transaction.store_name || transaction.customer?.store_name) && <Typography variant="caption" sx={{ display: 'block', mt: 0.2, color: '#64748b', fontSize: 10.5, letterSpacing: 0.45, textTransform: 'uppercase' }}>{transaction.store_name || transaction.customer?.store_name}</Typography>}
                                            </TableCell>
                                            <TableCell sx={{ color: '#526579' }}>{transaction.order_coordinator_name || '—'}</TableCell>
                                            <TableCell align="right" sx={{ color: '#173f61', fontWeight: 900 }}>{formatAmount(transaction.shop_order_total_price)}</TableCell>
                                            <TableCell>{orderProgress(transaction)}</TableCell>
                                            <TableCell>{productionDetails(transaction)}</TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(transaction.order_date)}</TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(transaction.sent_date)}</TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(transaction.received_date)}</TableCell>
                                            <TableCell sx={{ bgcolor: '#edf6fc !important' }}>{renderTimeline(transaction)}</TableCell>
                                            <TableCell>
                                                {detailBadge(transaction.order_status, transaction.order_status || '—')}
                                                {completedRowNeedsAttention(transaction) && <Chip icon={<WarningAmberRoundedIcon />} label="ACTION NEEDED" size="small" sx={{ display: 'flex', mt: 0.75, width: 'fit-content', height: 22, bgcolor: '#dc3545', color: '#fff', fontWeight: 850, '& .MuiChip-label': { px: 0.75, fontSize: 9.5 }, '& .MuiChip-icon': { ml: 0.5, color: '#fff', fontSize: 14 } }} />}
                                            </TableCell>
                                            <TableCell align="center" sx={{ width: 48, px: 0.5 }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                                                    <Tooltip title="View or edit printing transaction" placement="left">
                                                        <IconButton component={RouterLink} to={`/printingTransaction/${transaction.id}/edit`} size="small" aria-label={`View or edit printing transaction ${transaction.id}`} sx={{ width: 28, height: 28, color: '#1769aa', bgcolor: '#e8f3fb', border: '1px solid #c5def0', '&:hover': { bgcolor: '#d7ebf8' } }}>
                                                            <VisibilityRoundedIcon sx={{ fontSize: 17 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title={Number(transaction.shop_order_total_price || 0) === 0 ? 'Delete printing transaction' : 'Delete is available only when Print Total is ₱0.00'} placement="left">
                                                        <span>
                                                            <IconButton onClick={() => deleteTransaction(transaction)} size="small" aria-label={`Delete printing transaction ${transaction.id}`} disabled={Number(transaction.shop_order_total_price || 0) !== 0 || deletingId !== null} sx={{ width: 28, height: 28, color: '#c62828', bgcolor: '#fff0f0', border: '1px solid #f2c2c2', '&:hover': { bgcolor: '#ffe1e1' }, '&.Mui-disabled': { bgcolor: '#f7f7f7', borderColor: '#e5e7eb' } }}>
                                                                {deletingId === transaction.id ? <CircularProgress size={15} /> : <DeleteOutlineRoundedIcon sx={{ fontSize: 17 }} />}
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default PrintingTransactionList;
