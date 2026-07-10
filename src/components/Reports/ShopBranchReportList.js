import React, { useState, useEffect } from "react";
import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";
import { Form } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import UpdateIcon from '@mui/icons-material/Update';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal';
import Checkbox from '@mui/material/Checkbox';
import './ShopBranchReportList.css';

const formatDateInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getCurrentMonthRange = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    return {
        dateFrom: formatDateInput(new Date(year, month, 1)),
        dateTo: formatDateInput(new Date(year, month + 1, 0)),
    };
};

const ShopBranchReportList = () => {



    useEffect(() => {
        fetchShopOrderTransactionList(getCurrentMonthRange());
    }, []);

    const [customerOrderDate, setCustomerOrderDate] = useState(getCurrentMonthRange);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        data: [],
        code: '',
        message: '',
    });

    const [shopOrderTransactionUpdateModal, setShopOrderTransactionUpdateModal] = useState({
        id: 0,
        status: 0
    });

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(420px, calc(100% - 32px))',
        bgcolor: 'background.paper',
        borderRadius: '16px',
        boxShadow: 24,
        p: 4,
        '& .MuiTextField-root': { m: 1, width: '25ch' },
    };


    const handleClosePickUp = () => setOpenPickUp(false);
    const [openPickUp, setOpenPickUp] = React.useState(false);

    const handleOpenPickUp = (id, e) => {
        console.log('e', id);
        setOpenPickUp(true);
        fetchTransaction(id)
    }

    const fetchTransaction = async (id) => {
        await ShopOrderTransactionService.get(id)
            .then(response => {
                setShopOrderTransactionUpdateModal(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const onChangePaymentTypeStatus = (e) => {

        console.log("error", e.target.checked)
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setShopOrderTransactionUpdateModal({ ...shopOrderTransactionUpdateModal, status: 1 });
            } else {
                setShopOrderTransactionUpdateModal({ ...shopOrderTransactionUpdateModal, status: 2 });
            }
        } else {
            setShopOrderTransactionUpdateModal({ ...shopOrderTransactionUpdateModal, status: e.target.value });
        }
    }


    const updateDate = () => {
        ShopOrderTransactionService.updateShopBranchStatus(shopOrderTransactionUpdateModal.id, shopOrderTransactionUpdateModal)
            .then(response => {
                fetchShopOrderTransactionList(
                    customerOrderDate.dateFrom && customerOrderDate.dateTo
                        ? customerOrderDate
                        : undefined
                );
                setOpenPickUp(false);
            })
            .catch(e => {
                console.log(e);
            });
    }


    const fetchShopOrderTransactionList = (dateRange) => {
        setLoading(true);
        setError('');
        ShopOrderTransactionService.fetchShopOrderTransactionListReportByDate(dateRange)
            .then(response => {
                // setShopOrderTransactionList(response.data);
                setShopOrderTransaction(response.data);
            })
            .catch(e => {
                console.log("error", e)
                setError('The shop branch report could not be loaded. Please try again.');
            })
            .finally(() => setLoading(false));
    }
    const onChangeInput = (e) => {
        console.log(e.target.value);
        setCustomerOrderDate({ ...customerOrderDate, [e.target.name]: e.target.value });
    }

    const saveOrderTransaction = () => {
        console.log('orderTransaction', customerOrderDate);
        setLoading(true);
        setError('');
        ShopOrderTransactionService.fetchShopOrderTransactionListReportByDate(customerOrderDate)
            .then(response => {
                setShopOrderTransaction(response.data);
            })
            .catch(e => {
                console.log("error", e)
                setError('The selected report range could not be loaded.');
            })
            .finally(() => setLoading(false));
    }

    const showAllTransactions = () => {
        setCustomerOrderDate({ dateFrom: '', dateTo: '' });
        fetchShopOrderTransactionList();
    };


    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');

    const totalSum = (numbers) => {
        // numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return numberFormat(numbers.reduce((acc, { shop_order_transaction_total_price }) => acc + Number(shop_order_transaction_total_price || 0), 0));
    }

    const totalProfit = (numbers) => {
        // numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return numberFormat(numbers.reduce((acc, { profit }) => acc + Number(profit || 0), 0));
    }


    const statusLabel = (status) => status === 1 ? 'COMPLETED' : status === 2 ? 'PENDING' : 'CANCELLED';
    const rows = Array.isArray(shopOrderTransaction.data) ? shopOrderTransaction.data : [];
    const searchTerm = search.trim().toLowerCase();
    const visibleRows = searchTerm
        ? rows.filter((row) => [
            row.id,
            row.shop_name,
            row.requestor_name,
            row.checker_name,
            row.date,
            statusLabel(row.status),
            row.shop_order_transaction_total_quantity,
            row.shop_order_transaction_total_price,
            row.profit,
        ].some((value) => String(value ?? '').toLowerCase().includes(searchTerm)))
        : rows;

    return (
        <main className="shop-report-page">
            <div className="shop-report-shell">
                <header className="shop-report-header">
                    <span className="shop-report-header-icon"><ReceiptLongRoundedIcon /></span>
                    <div>
                        <span>Reports</span>
                        <h1>Shop branch report</h1>
                        <p>Track branch orders, sales performance, profit, and transaction status.</p>
                    </div>
                </header>

                {error && <Alert severity="error" className="shop-report-alert">{error}</Alert>}

                <section className="shop-report-filter-card">
                    <div className="shop-report-section-heading">
                        <div>
                            <span>Report range</span>
                            <h2>Filter branch transactions</h2>
                        </div>
                        <CalendarMonthRoundedIcon />
                    </div>
                    <div className="shop-report-filter-grid">
                        <TextField label="Date from" type="date" name="dateFrom" value={customerOrderDate.dateFrom} onChange={onChangeInput} InputLabelProps={{ shrink: true }} fullWidth />
                        <TextField label="Date to" type="date" name="dateTo" value={customerOrderDate.dateTo} onChange={onChangeInput} InputLabelProps={{ shrink: true }} fullWidth />
                        <div className="shop-report-filter-actions">
                            <Button variant="contained" onClick={saveOrderTransaction} disabled={loading}>Generate report</Button>
                            <Button variant="outlined" onClick={showAllTransactions} disabled={loading}>All</Button>
                        </div>
                    </div>
                    {loading && <LinearProgress className="shop-report-progress" />}
                </section>

                <section className="shop-report-metrics">
                    <article>
                        <span><Inventory2OutlinedIcon /></span>
                        <div><small>Transactions</small><strong>{rows.length}</strong></div>
                    </article>
                    <article>
                        <span><PaymentsOutlinedIcon /></span>
                        <div><small>Total sales</small><strong>{totalSum(rows)}</strong></div>
                    </article>
                    <article>
                        <span className="profit"><TrendingUpRoundedIcon /></span>
                        <div><small>Total profit</small><strong>{totalProfit(rows)}</strong></div>
                    </article>
                </section>

                <section className="shop-report-table-card">
                    <div className="shop-report-table-heading">
                        <div><span>Branch activity</span><h2>Transactions</h2></div>
                        <div className="shop-report-table-tools">
                            <TextField
                                size="small"
                                label="Search transactions"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                            <strong>{visibleRows.length} records</strong>
                        </div>
                    </div>
                    <div className="shop-report-table-scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th><th>Shop</th><th>Quantity</th><th>Total amount</th><th>Profit</th>
                                    <th>Requestor</th><th>Checker</th><th>Date</th><th>Status</th><th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading && visibleRows.length === 0 && (
                                    <tr><td colSpan="10"><div className="shop-report-empty"><Inventory2OutlinedIcon /><strong>No branch transactions found</strong><span>Try selecting a different report range.</span></div></td></tr>
                                )}
                                {visibleRows.map((row) => (
                                    <tr key={row.id}>
                                        <td><span className="shop-report-id">#{row.id}</span></td>
                                        <td><strong>{row.shop_name}</strong></td>
                                        <td>{row.shop_order_transaction_total_quantity}</td>
                                        <td className="shop-report-money">{numberFormat(row.shop_order_transaction_total_price)}</td>
                                        <td className="shop-report-profit">{numberFormat(row.profit)}</td>
                                        <td>{row.requestor_name || '—'}</td>
                                        <td>{row.checker_name || '—'}</td>
                                        <td>{row.date}</td>
                                        <td>
                                            <div className="shop-report-status-cell">
                                                <span className={`shop-report-status status-${statusLabel(row.status).toLowerCase()}`}>{statusLabel(row.status)}</span>
                                                <Tooltip title="Update status"><IconButton size="small" onClick={(e) => handleOpenPickUp(row.id, e)}><UpdateIcon fontSize="small" /></IconButton></Tooltip>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="shop-report-actions">
                                                <Tooltip title="View"><IconButton component={Link} to={`../shopOrderTransaction/completedShopOrderTransaction/${row.id}`}><VisibilityOutlinedIcon /></IconButton></Tooltip>
                                                <Tooltip title="Print"><IconButton component={Link} to={`../shopOrderTransaction/printShopBranch/${row.id}`}><PrintOutlinedIcon /></IconButton></Tooltip>
                                                <Button component={Link} to={`../shopOrderTransaction/addProductShopOrderTransaction/${row.id}`} variant="outlined" size="small">Update</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

            <Modal
                keepMounted
                open={openPickUp}
                onClose={handleClosePickUp}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Update transaction status
                    </Typography>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Completed Transaction ? </Form.Label>

                        <Checkbox
                            checked={shopOrderTransactionUpdateModal.status !== 2}
                            onChange={onChangePaymentTypeStatus}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </Form.Group>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Button variant="contained" onClick={updateDate}>
                            Save status
                        </Button>
                    </Box>
                </Box>
            </Modal>
            </div>
        </main>
    )
}

export default ShopBranchReportList
