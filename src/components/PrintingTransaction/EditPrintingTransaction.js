import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PrintingTransactionService from './PrintingTransactionService';
import UserService from '../User/UserService.service';
import './EditPrintingTransaction.css';

const dateOnly = (value) => value ? String(value).slice(0, 10) : '';
const todayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};
const daysBetween = (start, end) => {
    if (!start || !end) return null;
    const startDay = Date.parse(`${dateOnly(start)}T00:00:00Z`);
    const endDay = Date.parse(`${dateOnly(end)}T00:00:00Z`);
    return Number.isNaN(startDay) || Number.isNaN(endDay) ? null : Math.round((endDay - startDay) / 86400000);
};
const dayLabel = (days) => days === null ? '—' : `${days} ${Math.abs(days) === 1 ? 'day' : 'days'}`;
const formatDateTime = (value) => {
    if (!value) return '—';
    const parsed = new Date(String(value).replace(' ', 'T'));
    return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleString();
};
const sectionDividerSx = { height: 26, mx: { xs: -2, md: -3 }, mt: 3, mb: 3, bgcolor: '#e8eef7', borderTop: '1px solid #d7e1ef', borderBottom: '1px solid #d7e1ef' };
const formatAmount = (value) => new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
}).format(Number(value) || 0);
const choices = {
    logo: ['PENDING', 'OLD', 'NEW'],
    mock_up_status: ['PENDING', 'APPROVED', 'REJECTED'],
    order_priority: ['NORMAL', 'RUSH'],
    order_status: ['PENDING', 'COMPLETED'],
};
const fieldLabels = {
    logo: 'Logo',
    mock_up_status: 'Mock-up Status',
    order_priority: 'Order Priority',
    order_status: 'Order Status',
};
const statusColors = {
    PENDING: { color: '#a16207', background: '#fffbeb', border: '#f6d98b' },
    OLD: { color: '#15803d', background: '#f0fdf4', border: '#a7e4b8' },
    NEW: { color: '#15803d', background: '#f0fdf4', border: '#a7e4b8' },
    APPROVED: { color: '#15803d', background: '#f0fdf4', border: '#a7e4b8' },
    REJECTED: { color: '#b91c1c', background: '#fef2f2', border: '#f4b4b4' },
    COMPLETED: { color: '#15803d', background: '#f0fdf4', border: '#a7e4b8' },
    NORMAL: { color: '#15803d', background: '#f0fdf4', border: '#a7e4b8' },
    RUSH: { color: '#b91c1c', background: 'linear-gradient(90deg, #f0fdf4 50%, #fef2f2 50%)', border: '#f4b4b4' },
    yes: { color: '#15803d', background: '#f0fdf4', border: '#a7e4b8' },
    no: { color: '#b42318', background: '#fff1f2', border: '#efb0b0' },
};

const EditPrintingTransaction = () => {
    const { id } = useParams();
    const [transaction, setTransaction] = useState(null);
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [readyPopupOpen, setReadyPopupOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentSaving, setCommentSaving] = useState(false);
    const [commentError, setCommentError] = useState('');
    const [coordinators, setCoordinators] = useState([]);
    const successAlertRef = useRef(null);
    const isAdmin = Number(localStorage.getItem('role_as')) === 2;
    const completedLocked = transaction?.order_status === 'COMPLETED' && !isAdmin;
    const nearCompletion = form
        && Number(transaction?.shop_order_transaction?.is_pickup) === 1
        && ['OLD', 'NEW'].includes(form.logo)
        && form.mock_up_status === 'APPROVED'
        && form.plate
        && Boolean(transaction?.sales_channel)
        && Boolean(transaction?.order_date)
        && Boolean(form.sent_date)
        && Boolean(form.received_date);
    const canUpdateOrderStatus = Boolean(nearCompletion) && !completedLocked;

    useEffect(() => {
        PrintingTransactionService.get(id)
            .then((response) => {
                const data = response.data?.data ?? response.data;
                setTransaction(data);
                setForm({
                    logo: data.logo ?? '',
                    plate: Boolean(Number(data.plate)),
                    mock_up_status: data.mock_up_status ?? 'PENDING',
                    sales_channel: data.sales_channel ?? '',
                    order_priority: data.order_priority ?? 'NORMAL',
                    order_coordinator_id: String(data.order_coordinator_id ?? data.order_coordinator?.id ?? ''),
                    order_status: data.order_status ?? 'PENDING',
                    order_date: dateOnly(data.order_date),
                    sent_date: dateOnly(data.sent_date),
                    received_date: dateOnly(data.received_date),
                });
            })
            .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load the printing transaction.'))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        UserService.fetchUserList()
            .then((response) => {
                const data = response.data?.data ?? response.data;
                setCoordinators((Array.isArray(data) ? data : []).sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''))));
            })
            .catch(() => setCoordinators([]));
    }, []);

    const loadComments = async () => {
        setCommentsLoading(true);
        setCommentError('');
        try {
            const response = await PrintingTransactionService.getComments(id);
            const data = response.data?.data ?? response.data;
            const list = Array.isArray(data) ? data : (data?.data ?? []);
            setComments(list.filter((item) => Number(item.printing_transaction_id) === Number(id)));
        } catch (requestError) {
            setCommentError(requestError.response?.data?.message || 'Unable to load comments.');
        } finally {
            setCommentsLoading(false);
        }
    };

    useEffect(() => {
        loadComments();
    }, [id]);

    const submitComment = async (event) => {
        event.preventDefault();
        const comment = commentText.trim();
        if (!comment || commentSaving || completedLocked) return;
        setCommentSaving(true);
        setCommentError('');
        try {
            await PrintingTransactionService.createComment({
                printing_transaction_id: Number(id),
                user_id: Number(localStorage.getItem('auth_user_id')),
                comment,
            });
            setCommentText('');
            await loadComments();
        } catch (requestError) {
            setCommentError(requestError.response?.data?.message || 'Unable to add the comment.');
        } finally {
            setCommentSaving(false);
        }
    };

    const change = (event) => {
        if (completedLocked) return;
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: name === 'plate' ? value === 'yes' : value }));
        setSuccess('');
    };

    const save = async (event) => {
        event.preventDefault();
        if (completedLocked) return;
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const updatePayload = {
                ...form,
                logo: form.logo || null,
                sales_channel: transaction.sales_channel,
                order_coordinator_id: form.order_coordinator_id ? Number(form.order_coordinator_id) : null,
                order_status: canUpdateOrderStatus
                    ? form.order_status
                    : transaction.order_status,
                order_date: dateOnly(transaction.order_date),
                sent_date: form.sent_date || null,
                received_date: form.received_date || null,
            };
            const response = await PrintingTransactionService.update(id, updatePayload);
            const saved = response.data?.data ?? response.data;
            setTransaction((current) => ({ ...current, ...saved, order_status: saved?.order_status ?? updatePayload.order_status }));
            setSuccess('Printing transaction updated.');
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to update the printing transaction.');
        } finally {
            setSaving(false);
        }
    };

    const customer = transaction?.shop_order_transaction?.customer;
    const customerName = [customer?.first_name, customer?.last_name].filter(Boolean).join(' ');
    const currentCoordinator = transaction?.order_coordinator;
    const coordinatorOptions = currentCoordinator?.id && !coordinators.some((user) => String(user.id) === String(currentCoordinator.id))
        ? [currentCoordinator, ...coordinators]
        : coordinators;
    const selectedCoordinatorName = coordinatorOptions.find((user) => String(user.id) === String(form?.order_coordinator_id))?.name
        || transaction?.order_coordinator?.name
        || '—';
    const pickupCompleted = Number(transaction?.shop_order_transaction?.is_pickup) === 1;
    const isPrintingCup = (order) => /printing\s+cups?/i.test(String(order.product?.product_name ?? ''));
    const isPrintingOrder = (order) => isPrintingCup(order) || String(order.product?.category?.tags ?? '').toLowerCase().includes('printing');
    const shopOrders = [...(transaction?.shop_order_transaction?.shop_orders ?? [])].sort(
        (a, b) => Number(isPrintingCup(b)) - Number(isPrintingCup(a))
            || String(a.product?.category?.tags ?? '').localeCompare(String(b.product?.category?.tags ?? ''), undefined, { sensitivity: 'base' })
    );
    const printingOrders = shopOrders.filter(isPrintingOrder);
    const nonPrintingOrders = shopOrders.filter((order) => !isPrintingOrder(order));
    const overallTotal = shopOrders.reduce((total, order) => total + Number(order.shop_order_total_price || 0), 0);
    const paymentHistory = Array.isArray(transaction?.payment_history) ? transaction.payment_history : [];
    const totalPayment = Number(transaction?.total_payment || 0);
    const balance = Number(transaction?.balance || 0);
    const fullTransactionTotal = totalPayment + balance;
    const scheduleDurations = [
        ['ORDER → SUPPLIER', daysBetween(form?.order_date, form?.sent_date)],
        ['SUPPLIER → WAREHOUSE', daysBetween(form?.sent_date, form?.received_date)],
        ['OVERALL DAYS', daysBetween(form?.order_date, form?.received_date)],
    ];
    const overallDays = scheduleDurations[2][1];
    const supplierDays = daysBetween(form?.sent_date, form?.received_date || todayDate());
    const targetDays = form?.order_priority === 'RUSH' ? 3 : 7;
    const overdueDays = supplierDays === null ? 0 : Math.max(0, supplierDays - targetDays);
    const supplierDayColor = supplierDays === null ? '#713d04'
        : supplierDays > targetDays ? '#b42318'
            : supplierDays === targetDays ? '#9a5b08' : '#167347';
    const productTable = (orders, label, totalColor, totalBackground) => (
        <TableContainer>
            <Table size="small" sx={{ minWidth: 520 }} aria-label={`${label.toLowerCase()} products`}>
                <TableHead>
                    <TableRow sx={{ bgcolor: '#fcfcfd' }}>
                        <TableCell sx={{ fontWeight: 700, pl: { xs: 2, md: 2.5 } }}>Product</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Unit Price</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Quantity</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, pr: { xs: 2, md: 2.5 } }}>Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.length ? orders.map((order) => (
                        <TableRow key={order.id} hover sx={order.product?.category?.tags ? { bgcolor: '#eef8ff' } : undefined}>
                            <TableCell sx={{ fontWeight: 650, pl: { xs: 2, md: 2.5 }, py: 1.5 }}>{order.product?.product_name || `Product #${order.product_id}`}</TableCell>
                            <TableCell align="right">{formatAmount(order.shop_order_price)}</TableCell>
                            <TableCell align="right">{order.shop_order_quantity}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, pr: { xs: 2, md: 2.5 } }}>{formatAmount(order.shop_order_total_price)}</TableCell>
                        </TableRow>
                    )) : <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>No {label.toLowerCase()} products in this order.</TableCell></TableRow>}
                    <TableRow sx={{ bgcolor: totalBackground }}>
                        <TableCell colSpan={3} align="right" sx={{ fontWeight: 800, color: totalColor, py: 1.75 }}>{label} Total</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, color: totalColor, pr: { xs: 2, md: 2.5 }, fontSize: 16 }}>{formatAmount(orders.reduce((total, order) => total + Number(order.shop_order_total_price || 0), 0))}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
    useEffect(() => {
        setReadyPopupOpen(Boolean(nearCompletion));
    }, [nearCompletion]);
    useEffect(() => {
        if (success) successAlertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [success]);
    const dateFieldSx = (value) => ({
        width: '100%',
        maxWidth: 240,
        '& .MuiOutlinedInput-root': {
            bgcolor: value ? statusColors.APPROVED.background : statusColors.PENDING.background,
            color: value ? statusColors.APPROVED.color : statusColors.PENDING.color,
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: '0 3px 10px rgba(31,48,84,.05)',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: value ? statusColors.APPROVED.border : statusColors.PENDING.border,
        },
        '& .MuiInputLabel-root': { fontWeight: 600 },
    });
    const renderSelect = (field, disabled = false) => (
        <TextField select fullWidth size={field === 'order_status' ? 'small' : 'medium'} label={fieldLabels[field]} name={field} value={form[field]} onChange={change} disabled={disabled || completedLocked}
            sx={statusColors[form[field]] ? {
                width: '100%', maxWidth: field === 'order_status' ? 320 : 360,
                '& .MuiOutlinedInput-root': { background: statusColors[form[field]].background, color: statusColors[form[field]].color, fontWeight: 600, borderRadius: 2, boxShadow: '0 3px 10px rgba(31,48,84,.05)', '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(37,99,235,.16)' } },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: statusColors[form[field]].border },
                '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: statusColors[form[field]].color },
                '& .MuiInputLabel-root': { fontWeight: 600 },
            } : undefined}>
            {choices[field].map((option) => <MenuItem key={option} value={option} sx={statusColors[option] ? {
                color: statusColors[option].color,
                background: statusColors[option].background,
                fontWeight: 700,
                my: 0.25,
                mx: 0.75,
                borderRadius: 1,
            } : undefined}>{option}</MenuItem>)}
        </TextField>
    );

    return (
        <Box sx={{ bgcolor: '#f3f6fb', minHeight: '100vh', py: { xs: 2, md: 4 } }}>
            <Snackbar open={readyPopupOpen} autoHideDuration={6000} onClose={() => setReadyPopupOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ width: 'min(900px, calc(100% - 32px))' }}>
                <Box className="printing-ready-banner" role="status" sx={{ width: '100%' }}>
                    <Box className="printing-ready-confetti" aria-hidden="true">
                        {Array.from({ length: 18 }, (_, index) => <span key={index} style={{ '--piece': index, '--dx': `${(index - 9) * 36}px`, '--dy': `${-75 + (index % 4) * 42}px` }} />)}
                    </Box>
                    <Box className="printing-ready-icon" aria-hidden="true">🎉</Box>
                    <Box>
                        <Typography className="printing-ready-title">Nearly ready to complete!</Typography>
                        <Typography className="printing-ready-description">Artwork, plate, sales channel, and all order dates are ready.</Typography>
                    </Box>
                </Box>
            </Snackbar>
            <Box sx={{ width: 'min(960px, calc(100% - 32px))', mx: 'auto' }}>
                <Button component={RouterLink} to="/printingTransaction" startIcon={<ArrowBackRoundedIcon />} variant="outlined" sx={{ mb: 2, px: 2, py: 1, borderRadius: 2, borderColor: '#cbd9ea', bgcolor: '#fff', color: '#24446e', fontWeight: 800, textTransform: 'none', boxShadow: '0 3px 10px rgba(31,48,84,.06)', '&:hover': { borderColor: '#3979a7', bgcolor: '#eaf5fc', boxShadow: '0 6px 16px rgba(31,48,84,.12)' } }}>Back to Printing Transactions</Button>
                <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #dfe6f1', overflow: 'hidden', boxShadow: '0 14px 40px rgba(31,48,84,.08)' }}>
                    <Box sx={{ display: 'flex', height: 5 }}>
                        <Box sx={{ flex: 1, bgcolor: '#16b8d4' }} /><Box sx={{ flex: 1, bgcolor: '#dd4d9c' }} /><Box sx={{ flex: 1, bgcolor: '#f2c94c' }} /><Box sx={{ flex: 1, bgcolor: '#233049' }} />
                    </Box>
                    <Box sx={{ color: '#fff', px: { xs: 2.5, md: 3.5 }, py: { xs: 3, md: 3.5 }, background: 'linear-gradient(120deg, #172c52 0%, #254b72 58%, #236a86 100%)' }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box sx={{ width: 56, height: 56, borderRadius: 2.5, bgcolor: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.16)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><PaletteRoundedIcon sx={{ fontSize: 28 }} /></Box>
                            <Box>
                                <Typography variant="overline" sx={{ letterSpacing: 1.8, color: '#9ee8f2', fontWeight: 800 }}>PRINTING TRANSACTION</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.15, fontSize: { xs: 26, md: 32 } }}>Transaction #{id}</Typography>
                            </Box>
                        </Stack>
                        {transaction && <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 1 }}>
                            <Box component={RouterLink} to={`/shopOrderTransaction/finalizeShopOrder/${transaction.shop_order_transaction_id}`} aria-label={`View payment transaction for shop order #${transaction.shop_order_transaction_id}`} sx={{ px: 2, py: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.14)', textDecoration: 'none', '&:hover, &:focus-visible': { bgcolor: 'rgba(255,255,255,.2)', borderColor: '#9ee8f2', outline: 'none' } }}>
                                <Typography variant="caption" sx={{ display: 'block', color: '#bde9f3', fontWeight: 800, letterSpacing: 1 }}>SHOP ORDER ↗</Typography>
                                <Typography sx={{ mt: 0.25, color: '#fff', fontWeight: 700 }}>#{transaction.shop_order_transaction_id}</Typography>
                            </Box>
                            {[
                                ['COORDINATOR', selectedCoordinatorName],
                                ['SALES CHANNEL', transaction.sales_channel || '—'],
                            ].map(([label, value]) => <Box key={label} sx={{ px: 2, py: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.14)' }}>
                                <Typography variant="caption" sx={{ display: 'block', color: '#bde9f3', fontWeight: 800, letterSpacing: 1 }}>{label}</Typography>
                                <Typography sx={{ mt: 0.25, color: '#fff', fontWeight: 700, overflowWrap: 'anywhere' }}>{value}</Typography>
                            </Box>)}
                        </Box>}
                    </Box>
                    <Box sx={{ p: { xs: 2, md: 3 } }}>
                        {loading ? <Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress /></Box> : (
                            <>
                                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                                {success && <Alert ref={successAlertRef} severity="success" variant="outlined" sx={{ mb: 3, py: 1.25, px: 1.5, borderRadius: 2, border: '1px solid #63c48a', borderLeft: '5px solid #22a35a', bgcolor: '#effcf4', color: '#145a34', boxShadow: '0 8px 24px rgba(22,163,74,.12)', '& .MuiAlert-icon': { color: '#168a47', fontSize: 28, alignItems: 'center' } }}>
                                    <AlertTitle sx={{ fontWeight: 850, fontSize: 18, mb: 0.25 }}>Changes saved successfully</AlertTitle>
                                    {success}
                                </Alert>}
                                {completedLocked && <Alert severity="info" sx={{ mb: 2 }}>This printing transaction is completed. Only an administrator can edit or save changes.</Alert>}
                                {transaction && <Box sx={{ mb: 2, border: '1px solid #cfe4ee', borderRadius: 2, overflow: 'hidden', bgcolor: '#f7fcff' }}>
                                    <Box sx={{ px: { xs: 2, md: 2.5 }, py: 1.5, borderBottom: '1px solid #dceaf1', borderLeft: '4px solid #16b8d4', bgcolor: '#eaf7fb' }}>
                                        <Typography variant="h6" sx={{ fontSize: 23, fontWeight: 900, color: '#0f5777' }}>Customer Details</Typography>
                                    </Box>
                                    <Box sx={{ p: { xs: 2, md: 2.5 }, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                                        <Box><Typography variant="caption" sx={{ color: '#527087' }}>Customer</Typography><Typography sx={{ fontWeight: 700, color: '#183b59' }}>{customerName || '—'}</Typography></Box>
                                        <Box><Typography variant="caption" sx={{ color: '#527087' }}>Store Name</Typography><Typography sx={{ fontWeight: 600 }}>{customer?.store_name || '—'}</Typography></Box>
                                        <Box><Typography variant="caption" sx={{ color: '#527087' }}>Contact Number</Typography><Typography sx={{ fontWeight: 600 }}>{customer?.contact_number || '—'}</Typography></Box>
                                        <Box><Typography variant="caption" sx={{ color: '#527087' }}>Address</Typography><Typography sx={{ fontWeight: 600 }}>{customer?.address || '—'}</Typography></Box>
                                    </Box>
                                </Box>}
                                {transaction && <Box aria-hidden="true" sx={{ ...sectionDividerSx, mt: 0 }} />}
                                {form && <form onSubmit={save}>
                                    <Stack spacing={2.5}>
                                        <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
                                            <Box sx={{ px: { xs: 2, md: 2.5 }, py: 1.5, bgcolor: '#fff3f9', borderBottom: '1px solid #f2dce8', borderLeft: '4px solid #dd4d9c' }}>
                                                <Typography variant="h6" sx={{ fontSize: 23, fontWeight: 900, color: '#9d2865', lineHeight: 1.25 }}>Printing Specifications</Typography>
                                                <Typography variant="body2" sx={{ color: '#697586', mt: 0.25 }}>Artwork status and existing plate</Typography>
                                            </Box>
                                            <Box sx={{ p: { xs: 2, md: 2.5 }, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                                                {renderSelect('logo')}
                                                {renderSelect('mock_up_status')}
                                                <TextField select fullWidth label="Plate Available" name="plate" value={form.plate ? 'yes' : 'no'} onChange={change} disabled={completedLocked}
                                                    sx={{
                                                        width: '100%', maxWidth: 360,
                                                        '& .MuiOutlinedInput-root': { bgcolor: statusColors[form.plate ? 'yes' : 'no'].background, color: statusColors[form.plate ? 'yes' : 'no'].color, fontWeight: 600, borderRadius: 2, boxShadow: '0 3px 10px rgba(31,48,84,.05)', '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(37,99,235,.16)' } },
                                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: statusColors[form.plate ? 'yes' : 'no'].border },
                                                        '& .MuiInputLabel-root': { fontWeight: 600 },
                                                    }}>
                                                    <MenuItem value="yes" sx={{ color: statusColors.yes.color, bgcolor: statusColors.yes.background, fontWeight: 700, my: 0.25, mx: 0.75, borderRadius: 1 }}>Already Have Plate</MenuItem>
                                                    <MenuItem value="no" sx={{ color: statusColors.no.color, bgcolor: statusColors.no.background, fontWeight: 700, my: 0.25, mx: 0.75, borderRadius: 1 }}>No Plate Yet</MenuItem>
                                                </TextField>
                                            </Box>
                                        </Box>
                                        <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
                                            <Box sx={{ px: { xs: 2, md: 2.5 }, py: 1.5, bgcolor: '#e0e9fb', borderBottom: '1px solid #c7d6f0', borderLeft: '4px solid #4a68ae' }}>
                                                <Typography variant="h6" sx={{ fontSize: 23, fontWeight: 900, color: '#354f91', lineHeight: 1.25 }}>Order Settings</Typography>
                                                <Typography variant="body2" sx={{ color: '#697586', mt: 0.25 }}>Coordinator and production priority</Typography>
                                            </Box>
                                            <Box sx={{ p: { xs: 2, md: 2.5 }, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                                                <Box>
                                                    {renderSelect('order_priority')}
                                                    <Typography variant="body2" sx={{ mt: 1, color: form.order_priority === 'RUSH' ? '#9a3412' : '#166534', fontWeight: 700 }}>
                                                        Expected turnaround: {form.order_priority === 'RUSH' ? '3 days for Rush' : '7 days for Normal'}.
                                                    </Typography>
                                                </Box>
                                                <TextField select fullWidth label="Coordinator" name="order_coordinator_id" value={form.order_coordinator_id} onChange={change} disabled={completedLocked}
                                                    sx={{ width: '100%', maxWidth: 360, '& .MuiOutlinedInput-root': { bgcolor: '#f8fafc', borderRadius: 2, boxShadow: '0 3px 10px rgba(31,48,84,.05)' }, '& .MuiInputLabel-root': { fontWeight: 600 } }}>
                                                    {coordinatorOptions.length === 0 && <MenuItem value={form.order_coordinator_id} disabled>{selectedCoordinatorName}</MenuItem>}
                                                    {coordinatorOptions.map((user) => <MenuItem key={user.id} value={String(user.id)}>{user.name || `User #${user.id}`}</MenuItem>)}
                                                </TextField>
                                            </Box>
                                        </Box>
                                        <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
                                            <Box sx={{ px: { xs: 2, md: 2.5 }, py: 1.5, bgcolor: '#f5f1ff', borderBottom: '1px solid #e4daf8', borderLeft: '4px solid #8b5cf6' }}>
                                                <Typography variant="h6" sx={{ fontSize: 23, fontWeight: 900, color: '#7041b4', lineHeight: 1.25 }}>Schedule</Typography>
                                                <Typography variant="body2" sx={{ color: '#697586', mt: 0.25 }}>Track dispatch to the supplier and arrival at the warehouse</Typography>
                                            </Box>
                                            <Box sx={{ p: { xs: 2, md: 2.5 }, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                                                <TextField type="date" label="Order Date" name="order_date" value={form.order_date} InputLabelProps={{ shrink: true }} disabled sx={{ ...dateFieldSx(form.order_date), '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: statusColors.APPROVED.color } }} />
                                                <TextField type="date" label="Sent to Supplier" name="sent_date" value={form.sent_date} onChange={change} InputLabelProps={{ shrink: true }} disabled={completedLocked} sx={dateFieldSx(form.sent_date)} />
                                                <TextField type="date" label="Received at Warehouse" name="received_date" value={form.received_date} onChange={change} InputLabelProps={{ shrink: true }} disabled={completedLocked} sx={dateFieldSx(form.received_date)} />
                                            </Box>
                                            <Box sx={{ px: { xs: 2, md: 2.5 }, pb: { xs: 2, md: 2.5 } }}>
                                                <Box sx={{ width: '100%', maxWidth: 420, mx: 'auto', display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1 }}>
                                                    <Box sx={{ px: 0.75, py: 0.5, borderRadius: 1.5, border: '1px solid #cbd5e1', bgcolor: '#f8fafc', textAlign: 'center' }}>
                                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, letterSpacing: 0.5 }}>{scheduleDurations[0][0]}</Typography>
                                                        <Typography sx={{ color: '#475569', fontWeight: 800, fontSize: 15, lineHeight: 1.25 }}>{dayLabel(scheduleDurations[0][1])}</Typography>
                                                    </Box>
                                                    <Box sx={{ px: 0.75, py: 0.5, borderRadius: 1.5, border: `2px solid ${supplierDays !== null && supplierDays > targetDays ? '#ef9a9a' : '#7fc4e8'}`, bgcolor: supplierDays !== null && supplierDays > targetDays ? '#fff1f2' : '#edf8ff', textAlign: 'center', boxShadow: '0 4px 12px rgba(22,139,182,.12)' }}>
                                                        <Typography variant="caption" sx={{ color: '#155e85', fontWeight: 900, letterSpacing: 0.5 }}>{scheduleDurations[1][0]}</Typography>
                                                        <Box component="span" sx={{ display: 'block', width: 'fit-content', mx: 'auto', my: 0.3, px: 0.8, py: 0.15, borderRadius: 1, bgcolor: form.received_date ? '#dcfce7' : '#fff1cf', color: form.received_date ? '#166534' : '#92400e', border: `1px solid ${form.received_date ? '#86d9a2' : '#efc766'}`, fontSize: 10, lineHeight: 1.4, fontWeight: 900, letterSpacing: 0.55 }}>
                                                            {form.received_date ? 'RECEIVED' : 'IN TRANSIT'}
                                                        </Box>
                                                        <Typography sx={{ color: supplierDayColor, fontWeight: 900, fontSize: 16, lineHeight: 1.25 }}>{dayLabel(supplierDays)}</Typography>
                                                        <Typography variant="caption" sx={{ color: overdueDays > 0 ? '#b42318' : '#64748b', fontWeight: 700 }}>
                                                            {overdueDays > 0 ? `${dayLabel(overdueDays)} overdue` : `${form.received_date ? '' : 'Ongoing · '}${targetDays}-day target`}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ width: '100%', maxWidth: 185, mx: 'auto', mt: 1, px: 0.75, py: 0.5, borderRadius: 1.5, border: '1px solid #d7dee8', bgcolor: '#f8fafc', textAlign: 'center' }}>
                                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, letterSpacing: 0.5 }}>{scheduleDurations[2][0]}</Typography>
                                                    <Typography sx={{ color: '#475569', fontWeight: 800, fontSize: 15, lineHeight: 1.25 }}>{dayLabel(overallDays)}</Typography>
                                                </Box>
                                                {overdueDays > 0 && <Typography variant="body2" role="status" sx={{ mt: 0.75, color: '#b42318', fontWeight: 750, textAlign: 'center' }}>
                                                    Supplier turnaround is overdue by {dayLabel(overdueDays)}. {form.order_priority === 'RUSH' ? 'Rush' : 'Normal'} target: {dayLabel(targetDays)}.
                                                </Typography>}
                                            </Box>
                                        </Box>
                                        <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
                                            <Box sx={{ px: { xs: 2, md: 2.5 }, py: 1.5, bgcolor: '#f0fdf4', borderBottom: '1px solid #d7f2df', borderLeft: '4px solid #22a35a' }}>
                                                <Typography variant="h6" sx={{ fontSize: 23, fontWeight: 900, color: '#167347', lineHeight: 1.25 }}>Completion</Typography>
                                                <Typography variant="body2" sx={{ color: '#697586', mt: 0.25 }}>Update the final order status when the prerequisites are met</Typography>
                                            </Box>
                                            <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1, mb: 2 }}>
                                                    <Box sx={{ px: 1.5, py: 1, borderRadius: 1.5, border: `1px solid ${pickupCompleted ? '#a7e4b8' : '#f6d98b'}`, bgcolor: pickupCompleted ? '#f0fdf4' : '#fffbeb' }}>
                                                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.25 }}>1 · PICKUP</Typography>
                                                        <Typography sx={{ fontWeight: 700, color: pickupCompleted ? '#166534' : '#92400e' }}>{pickupCompleted ? 'Completed' : 'Pending'}</Typography>
                                                    </Box>
                                                    <Box sx={{ px: 1.5, py: 1, borderRadius: 1.5, border: `1px solid ${form.received_date ? '#a7e4b8' : '#f6d98b'}`, bgcolor: form.received_date ? '#f0fdf4' : '#fffbeb' }}>
                                                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.25 }}>2 · WAREHOUSE RECEIPT</Typography>
                                                        <Typography sx={{ fontWeight: 700, color: form.received_date ? '#166534' : '#92400e' }}>{form.received_date ? dateOnly(form.received_date) : 'Not entered'}</Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ borderTop: '1px solid #e5e7eb', pt: 2.5 }}>
                                                    <Typography sx={{ fontWeight: 700, color: '#263547', mb: 1.5 }}>Final Order Status</Typography>
                                                    <Box sx={{ maxWidth: 320 }}>
                                                        {renderSelect('order_status', !canUpdateOrderStatus)}
                                                    </Box>
                                                    <Typography variant="body2" sx={{ mt: 1, color: canUpdateOrderStatus ? '#166534' : '#64748b' }}>
                                                    {completedLocked
                                                        ? 'Only an administrator can change a completed printing transaction.'
                                                        : canUpdateOrderStatus
                                                            ? 'All printing requirements are ready. You can update the order status.'
                                                            : !pickupCompleted
                                                                ? 'Pickup must be completed before the final order status can be changed.'
                                                                : 'Complete the artwork, plate, sales channel, and all order dates to unlock this field.'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Stack>
                                    <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}><Button type="submit" variant="contained" disabled={saving || completedLocked}>{saving ? 'Saving…' : 'Save Changes'}</Button></Stack>
                                </form>}
                                {transaction && <Box aria-hidden="true" sx={sectionDividerSx} />}
                                {transaction && <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5} sx={{ px: { xs: 2, md: 2.5 }, py: 1.75, bgcolor: '#eff8ff', borderBottom: '1px solid #d8eaf8', borderLeft: '4px solid #168bb6' }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontSize: 23, fontWeight: 900, color: '#16486b', lineHeight: 1.25 }}>Printing Products</Typography>
                                            <Typography variant="body2" color="text.secondary">Items included in this printing order</Typography>
                                        </Box>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Chip size="small" label={`${printingOrders.length} ${printingOrders.length === 1 ? 'item' : 'items'}`} sx={{ fontWeight: 700, bgcolor: '#ede9e7', color: '#49352d' }} />
                                            <Button component={RouterLink} to={`/shopOrderTransaction/finalizeShopOrder/${transaction.shop_order_transaction_id}`} size="small" variant="outlined" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                                                View Payment Transaction
                                            </Button>
                                        </Stack>
                                    </Stack>
                                    {productTable(printingOrders, 'Printing', '#175681', '#eef8ff')}
                                </Box>}
                                {transaction && <Box sx={{ mt: 3, border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: { xs: 2, md: 2.5 }, py: 1.75, bgcolor: '#f4f6f9', borderBottom: '1px solid #e1e6ed', borderLeft: '4px solid #64748b' }}>
                                        <Typography variant="h6" sx={{ fontSize: 23, fontWeight: 900, color: '#334155', lineHeight: 1.25 }}>Non-Printing Products</Typography>
                                        <Chip size="small" label={`${nonPrintingOrders.length} ${nonPrintingOrders.length === 1 ? 'item' : 'items'}`} sx={{ fontWeight: 700, bgcolor: '#ede9e7', color: '#49352d' }} />
                                    </Stack>
                                    {productTable(nonPrintingOrders, 'Non-Printing', '#334155', '#f8fafc')}
                                </Box>}
                                {transaction && <Box sx={{ mt: 2, px: 2, py: 1.25, border: '1px solid #a7e4b8', borderRadius: 1.5, bgcolor: '#f0fdf4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                                    <Typography sx={{ fontWeight: 800, color: '#166534' }}>Overall Total</Typography>
                                    <Typography sx={{ fontWeight: 800, color: '#166534', fontSize: 20 }}>{formatAmount(overallTotal)}</Typography>
                                </Box>}
                                {transaction && <Box aria-hidden="true" sx={sectionDividerSx} />}
                                {transaction && <Box sx={{ border: '1px solid #cbdfe8', borderRadius: 2, overflow: 'hidden' }}>
                                    <Box sx={{ px: { xs: 2, md: 2.5 }, py: 1.75, bgcolor: '#eaf7f8', borderBottom: '1px solid #c9e5e8', borderLeft: '4px solid #168a92', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontSize: 23, fontWeight: 900, color: '#145e65' }}>Payment History</Typography>
                                            <Typography variant="body2" sx={{ color: '#527078' }}>Payments and remaining balance for the full shop transaction</Typography>
                                        </Box>
                                        {fullTransactionTotal > 0 && balance <= 0 && <Chip icon={<CheckCircleRoundedIcon />} label="FULLY PAID" sx={{ px: 0.75, height: 36, bgcolor: '#168a47', color: '#fff', fontWeight: 900, letterSpacing: 0.5, boxShadow: '0 5px 14px rgba(22,138,71,.2)', '& .MuiChip-icon': { color: '#fff' } }} />}
                                    </Box>
                                    <Box sx={{ p: { xs: 2, md: 2.5 }, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.5, bgcolor: '#fbfefe' }}>
                                        {[
                                            ['Transaction Total', fullTransactionTotal, '#173f61', '#eef6fc', '#bdd7e8'],
                                            ['Total Paid', totalPayment, '#166534', '#effcf4', '#a7e4b8'],
                                            ['Balance', balance, balance > 0 ? '#b42318' : '#166534', balance > 0 ? '#fff1f2' : '#effcf4', balance > 0 ? '#efb0b0' : '#a7e4b8'],
                                        ].map(([label, amount, color, background, border]) => <Box key={label} sx={{ px: 1.75, py: 1.25, borderRadius: 1.5, border: `1px solid ${border}`, bgcolor: background }}>
                                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 750, letterSpacing: 0.4 }}>{label}</Typography>
                                            <Typography sx={{ color, mt: 0.25, fontWeight: 900, fontSize: 20 }}>{formatAmount(amount)}</Typography>
                                        </Box>)}
                                    </Box>
                                    <TableContainer>
                                        <Table size="small" aria-label="payment history">
                                            <TableHead><TableRow sx={{ bgcolor: '#edf7f8', '& .MuiTableCell-root': { color: '#315f64', fontWeight: 800, borderBottom: '1px solid #c9e5e8' } }}>
                                                <TableCell sx={{ pl: { xs: 2, md: 2.5 } }}>Date</TableCell>
                                                <TableCell>Account</TableCell>
                                                <TableCell>Bank</TableCell>
                                                <TableCell align="right" sx={{ pr: { xs: 2, md: 2.5 } }}>Amount</TableCell>
                                            </TableRow></TableHead>
                                            <TableBody>
                                                {paymentHistory.length ? paymentHistory.map((payment) => <TableRow key={payment.id} hover>
                                                    <TableCell sx={{ pl: { xs: 2, md: 2.5 }, whiteSpace: 'nowrap' }}>{formatDateTime(payment.created_at)}</TableCell>
                                                    <TableCell><Typography sx={{ fontWeight: 700, fontSize: 14 }}>{[payment.payment_term, payment.account_name].filter(Boolean).join(' · ') || '—'}</Typography>{payment.account_number && String(payment.account_number).trim() !== '0' && <Typography variant="caption" color="text.secondary">{payment.account_number}</Typography>}</TableCell>
                                                    <TableCell>{payment.bank_name || '—'}</TableCell>
                                                    <TableCell align="right" sx={{ pr: { xs: 2, md: 2.5 }, color: '#166534', fontWeight: 850 }}>{formatAmount(payment.amount)}</TableCell>
                                                </TableRow>) : <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>No payment history yet.</TableCell></TableRow>}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>}
                                {transaction && <Box aria-hidden="true" sx={sectionDividerSx} />}
                                {transaction && <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
                                    <Box sx={{ px: { xs: 2, md: 2.5 }, py: 1.75, bgcolor: '#f9e9c8', borderBottom: '1px solid #e8c985', borderLeft: '4px solid #c78318' }}>
                                        <Typography variant="h6" sx={{ fontSize: 23, fontWeight: 900, color: '#754506' }}>Comments</Typography>
                                        <Typography variant="body2" color="text.secondary">Notes for this printing transaction</Typography>
                                    </Box>
                                    <Box component="form" onSubmit={submitComment} sx={{ p: { xs: 2, md: 2.5 }, borderBottom: '1px solid #e5e7eb' }}>
                                        <TextField fullWidth multiline minRows={3} label="Add a comment" value={commentText} onChange={(event) => setCommentText(event.target.value)} inputProps={{ maxLength: 2000 }} disabled={completedLocked} />
                                        {completedLocked && <Typography variant="body2" sx={{ mt: 1, color: '#64748b' }}>Only an administrator can comment on a completed printing transaction.</Typography>}
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
                                            <Button type="submit" variant="contained" disabled={commentSaving || completedLocked}>{commentSaving ? 'Posting…' : 'Post Comment'}</Button>
                                        </Box>
                                    </Box>
                                    {commentError && <Alert severity="error" sx={{ m: 2 }}>{commentError}</Alert>}
                                    <TableContainer>
                                        <Table size="small" aria-label="printing transaction comments">
                                            <TableHead><TableRow sx={{ bgcolor: '#f3dcae', '& .MuiTableCell-root': { color: '#70430a', borderBottom: '1px solid #dfbd79' } }}>
                                                <TableCell sx={{ fontWeight: 800, pl: { xs: 2, md: 2.5 }, width: '25%' }}>Author</TableCell>
                                                <TableCell sx={{ fontWeight: 800 }}>Comment</TableCell>
                                                <TableCell sx={{ fontWeight: 800, width: '20%' }}>Date</TableCell>
                                            </TableRow></TableHead>
                                            <TableBody>
                                                {commentsLoading ? <TableRow><TableCell colSpan={3} align="center" sx={{ py: 3 }}><CircularProgress size={24} /></TableCell></TableRow>
                                                    : comments.length ? comments.map((item) => <TableRow key={item.id} hover>
                                                        <TableCell sx={{ pl: { xs: 2, md: 2.5 }, fontWeight: 650 }}>{item.user?.name || `User #${item.user_id}`}</TableCell>
                                                        <TableCell sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{item.comment}</TableCell>
                                                        <TableCell>{item.created_at ? new Date(item.created_at).toLocaleString() : '—'}</TableCell>
                                                    </TableRow>)
                                                        : <TableRow><TableCell colSpan={3} align="center" sx={{ py: 3, color: 'text.secondary' }}>No comments yet.</TableCell></TableRow>}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>}
                            </>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default EditPrintingTransaction;
