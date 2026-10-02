import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form } from 'react-bootstrap';
import moment from "moment";
import Alert from '@mui/material/Alert';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import UpdateIcon from '@mui/icons-material/Update';
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import '../Reports/ShopBranchReportList.css';

const ShorOrderTransactionList = () => {
    const isAdmin = Number(localStorage.getItem('role_as')) === 2;
    const today = moment().format("YYYY-MM-DD");
    const [shopOrderDate, setShopOrderDate] = useState({ date: today });
    const [shopOrderTransaction, setShopOrderTransaction] = useState({ data: [], code: '', message: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [openStatus, setOpenStatus] = useState(false);
    const [statusEditLocked, setStatusEditLocked] = useState(false);
    const [statusTransaction, setStatusTransaction] = useState({ id: 0, status: 2 });

    const modalStyle = {
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 'min(420px, calc(100% - 32px))', bgcolor: 'background.paper',
        borderRadius: '16px', boxShadow: 24, p: 4,
    };

    useEffect(() => {
        fetchShopOrderTransactionList(today);
    }, []);

    const fetchShopOrderTransactionList = (date) => {
        setLoading(true);
        setError('');
        ShopOrderTransactionService.fetchShopOrderTransactionListByDate(date)
            .then((response) => setShopOrderTransaction(response.data))
            .catch(() => setError('The inter branch orders could not be loaded. Please try again.'))
            .finally(() => setLoading(false));
    };

    const saveOrderTransaction = () => fetchShopOrderTransactionList(shopOrderDate.date || today);

    const closeStatus = () => {
        setOpenStatus(false);
        setStatusEditLocked(false);
    };

    const openStatusEditor = (row) => {
        const completedLocked = Number(row.status) === 1 && !isAdmin;
        setStatusEditLocked(completedLocked);
        if (completedLocked) return;
        setStatusTransaction({ id: row.id, status: Number(row.status) });
        setOpenStatus(true);
        ShopOrderTransactionService.get(row.id)
            .then((response) => setStatusTransaction(response.data))
            .catch(() => setError('The transaction status could not be loaded.'));
    };

    const changeStatus = (event) => {
        setStatusTransaction((current) => ({ ...current, status: event.target.checked ? 1 : 2 }));
    };

    const saveStatus = () => {
        if (statusEditLocked) return;
        ShopOrderTransactionService.updateShopBranchStatus(statusTransaction.id, statusTransaction)
            .then(() => {
                closeStatus();
                fetchShopOrderTransactionList(shopOrderDate.date || today);
            })
            .catch(() => setError('The transaction status could not be updated.'));
    };

    const numberFormat = (value) => new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'PHP',
    }).format(Number(value || 0)).replace(/(\.|,)00$/g, '');

    const rows = Array.isArray(shopOrderTransaction.data) ? shopOrderTransaction.data : [];
    const totalSales = rows.reduce((sum, row) => sum + Number(row.shop_order_transaction_total_price || 0), 0);
    const totalProfit = rows.reduce((sum, row) => sum + Number(row.profit || 0), 0);
    const statusLabel = (status) => Number(status) === 1 ? 'COMPLETED' : Number(status) === 2 ? 'PENDING' : 'CANCELLED';
    const searchTerm = search.trim().toLowerCase();
    const visibleRows = searchTerm
        ? rows.filter((row) => [row.id, row.shop_name, row.requestor_name, row.checker_name, row.date,
            statusLabel(row.status), row.shop_order_transaction_total_quantity,
            row.shop_order_transaction_total_price, row.profit,
        ].some((value) => String(value ?? '').toLowerCase().includes(searchTerm)))
        : rows;

    return (
        <main className="shop-report-page">
            <div className="shop-report-shell">
                <header className="shop-report-header">
                    <span className="shop-report-header-icon"><ReceiptLongRoundedIcon /></span>
                    <div>
                        <span>Inter Branch Orders</span>
                        <h1>Transactions</h1>
                        <p>Review daily branch orders, sales, profit, and transaction status.</p>
                    </div>
                </header>

                {error && <Alert severity="error" className="shop-report-alert">{error}</Alert>}

                <section className="shop-report-filter-card">
                    <div className="shop-report-section-heading">
                        <div><span>Transaction date</span><h2>Filter branch orders</h2></div>
                        <CalendarMonthRoundedIcon />
                    </div>
                    <div className="shop-report-filter-grid shop-report-single-date-filter">
                        <TextField label="Date" type="date" name="date" value={shopOrderDate.date}
                            onChange={(event) => setShopOrderDate({ date: event.target.value })}
                            InputLabelProps={{ shrink: true }} fullWidth />
                        <div className="shop-report-filter-actions">
                            <Button variant="contained" onClick={saveOrderTransaction} disabled={loading}>Find transactions</Button>
                        </div>
                    </div>
                    {loading && <LinearProgress className="shop-report-progress" />}
                </section>

                <section className="shop-report-metrics">
                    <article><span><Inventory2OutlinedIcon /></span><div><small>Transactions</small><strong>{rows.length}</strong></div></article>
                    <article><span><PaymentsOutlinedIcon /></span><div><small>Total sales</small><strong>{numberFormat(totalSales)}</strong></div></article>
                    <article><span className="profit"><TrendingUpRoundedIcon /></span><div><small>Total profit</small><strong>{numberFormat(totalProfit)}</strong></div></article>
                </section>

                <section className="shop-report-table-card">
                    <div className="shop-report-table-heading">
                        <div><span>Branch activity</span><h2>Order list</h2></div>
                        <div className="shop-report-table-tools">
                            <TextField size="small" label="Search transactions" value={search} onChange={(event) => setSearch(event.target.value)} />
                            <strong>{visibleRows.length} records</strong>
                        </div>
                    </div>
                    <div className="shop-report-table-scroll">
                        <table>
                            <thead><tr><th>ID</th><th>Shop</th><th>Quantity</th><th>Total amount</th><th>Profit</th><th>Requestor</th><th>Checker</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                            <tbody>
                                {!loading && visibleRows.length === 0 && (
                                    <tr><td colSpan="10"><div className="shop-report-empty"><Inventory2OutlinedIcon /><strong>No branch orders found</strong><span>Try selecting another transaction date.</span></div></td></tr>
                                )}
                                {visibleRows.map((row) => {
                                    const completedLocked = Number(row.status) === 1 && !isAdmin;
                                    return (
                                    <tr key={row.id}>
                                        <td><span className="shop-report-id">#{row.id}</span></td>
                                        <td><strong>{row.shop_name}</strong></td>
                                        <td>{row.shop_order_transaction_total_quantity}</td>
                                        <td className="shop-report-money">{numberFormat(row.shop_order_transaction_total_price)}</td>
                                        <td className="shop-report-profit">{numberFormat(row.profit)}</td>
                                        <td>{row.requestor_name || '—'}</td><td>{row.checker_name || '—'}</td><td>{row.date}</td>
                                        <td><div className="shop-report-status-cell"><span className={`shop-report-status status-${statusLabel(row.status).toLowerCase()}`}>{statusLabel(row.status)}</span><Tooltip title={completedLocked ? "Completed transactions can only be changed by an administrator" : "Update status"}><span><IconButton size="small" disabled={completedLocked} onClick={() => openStatusEditor(row)}><UpdateIcon fontSize="small" /></IconButton></span></Tooltip></div></td>
                                        <td><div className="shop-report-actions">
                                            <Tooltip title="View"><IconButton component={Link} to={`../shopOrderTransaction/completedShopOrderTransaction/${row.id}`}><VisibilityOutlinedIcon /></IconButton></Tooltip>
                                            <Tooltip title={Number(row.print_count) > 0 ? `Print (${row.print_count} recorded)` : "Print"}>
                                                <IconButton component={Link} to={`../shopOrderTransaction/printShopBranch/${row.id}`}>
                                                    <Badge
                                                        badgeContent={Number(row.print_count)}
                                                        invisible={!(Number(row.print_count) > 0)}
                                                        max={999}
                                                        sx={{ '& .MuiBadge-badge': { bgcolor: '#a95317', color: '#fff' } }}
                                                    >
                                                        <PrintOutlinedIcon />
                                                    </Badge>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Update transaction">
                                                <IconButton component={Link} to={`../shopOrderTransaction/addProductShopOrderTransaction/${row.id}`} className="shop-report-update-action">
                                                    <EditOutlinedIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </div></td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>

                <Modal open={openStatus} onClose={closeStatus} aria-labelledby="transaction-status-title">
                    <Box sx={modalStyle}>
                        <Typography id="transaction-status-title" variant="h6" component="h2">Update transaction status</Typography>
                        <Form.Group className="mb-3">
                            <Form.Label>Completed Transaction ? </Form.Label>
                            <Checkbox checked={Number(statusTransaction.status) !== 2} onChange={changeStatus} disabled={statusEditLocked} inputProps={{ 'aria-label': 'Completed transaction' }} />
                        </Form.Group>
                        {statusEditLocked && <Alert severity="info" sx={{ mb: 2 }}>This transaction is completed. Only an administrator can change its status.</Alert>}
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button variant="contained" onClick={saveStatus} disabled={statusEditLocked}>Save status</Button>
                        </Box>
                    </Box>
                </Modal>
            </div>
        </main>
    );
};

export default ShorOrderTransactionList;
