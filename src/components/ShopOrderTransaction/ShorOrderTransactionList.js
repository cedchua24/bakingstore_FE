import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PageviewIcon from '@mui/icons-material/Pageview';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import UpdateIcon from '@mui/icons-material/Update';
import ShopOrderTransactionService from "./ShopOrderTransactionService";

const ShorOrderTransactionList = () => {
    const today = moment().format("YYYY-MM-DD");

    useEffect(() => {
        fetchShopOrderTransactionList(today);
    }, []);

    const [shopOrderDate, setShopOrderDate] = useState({
        date: today
    });

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        data: [],
        code: '',
        message: '',
    });

    const fetchShopOrderTransactionList = (date) => {
        ShopOrderTransactionService.fetchShopOrderTransactionListByDate(date)
            .then(response => {
                setShopOrderTransaction(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const onChangeInput = (e) => {
        setShopOrderDate({ ...shopOrderDate, [e.target.name]: e.target.value });
    }

    const saveOrderTransaction = () => {
        fetchShopOrderTransactionList(shopOrderDate.date || today);
    }

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(Number(value || 0)).replace(/(\.|,)00$/g, '');

    const totalSum = (numbers) => {
        return numbers.reduce((acc, { shop_order_transaction_total_price }) => acc + Number(shop_order_transaction_total_price || 0), 0);
    }

    const totalProfit = (numbers) => {
        return numbers.reduce((acc, { profit }) => acc + Number(profit || 0), 0);
    }

    const statusChip = (status) => {
        if (status === 1) {
            return <Chip label="Completed" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 700 }} />;
        }

        if (status === 2) {
            return <Chip label="Pending" size="small" sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 700 }} />;
        }

        return <Chip label="Cancelled" size="small" sx={{ bgcolor: '#fee2e2', color: '#991b1b', fontWeight: 700 }} />;
    }

    const rows = shopOrderTransaction.data || [];

    return (
        <Box sx={{ bgcolor: '#f6f7f9', minHeight: '100vh', py: { xs: 2, md: 4 } }}>
            <Box sx={{ width: 'min(1320px, calc(100% - 32px))', mx: 'auto' }}>
                <Paper elevation={0} sx={{ borderRadius: 1, border: '1px solid #e5e7eb', overflow: 'hidden', mb: 2.5 }}>
                    <Box sx={{ bgcolor: '#2f201b', color: '#fff', px: { xs: 2, md: 3 }, py: 2.5 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box sx={{ bgcolor: 'rgba(255,255,255,.14)', borderRadius: 1, p: 1, display: 'flex' }}>
                                    <StorefrontIcon />
                                </Box>
                                <Box>
                                    <Typography variant="overline" sx={{ color: '#f3c58b', letterSpacing: 0 }}>Shop Branch Orders</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
                                        Transactions
                                    </Typography>
                                </Box>
                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', sm: 'center' }}>
                                <TextField
                                    type="date"
                                    name="date"
                                    value={shopOrderDate.date}
                                    onChange={onChangeInput}
                                    size="small"
                                    sx={{
                                        bgcolor: '#fff',
                                        borderRadius: 1,
                                        minWidth: { xs: '100%', sm: 180 },
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    startIcon={<SearchIcon />}
                                    onClick={saveOrderTransaction}
                                    sx={{ bgcolor: '#f59e0b', color: '#111827', fontWeight: 800, '&:hover': { bgcolor: '#d97706' } }}
                                >
                                    Find
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>

                    <Box sx={{ p: { xs: 2, md: 3 } }}>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                                gap: 2,
                            }}
                        >
                            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e5e7eb', borderRadius: 1 }}>
                                <Typography variant="caption" color="text.secondary">Transactions</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 900 }}>{rows.length}</Typography>
                            </Paper>
                            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e5e7eb', borderRadius: 1 }}>
                                <Typography variant="caption" color="text.secondary">Total Sales</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 900 }}>{numberFormat(totalSum(rows))}</Typography>
                            </Paper>
                            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e5e7eb', borderRadius: 1 }}>
                                <Typography variant="caption" color="text.secondary">Total Profit</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 900 }}>{numberFormat(totalProfit(rows))}</Typography>
                            </Paper>
                        </Box>
                    </Box>
                </Paper>

                <Paper elevation={0} sx={{ borderRadius: 1, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <Box sx={{ px: { xs: 2, md: 3 }, py: 2, borderBottom: '1px solid #e5e7eb' }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>Order List</Typography>
                                <Typography variant="body2" color="text.secondary">Showing shop branch orders for {shopOrderDate.date || today}</Typography>
                            </Box>
                            <TextField
                                value={numberFormat(totalSum(rows))}
                                size="small"
                                label="Total Sales"
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: <InputAdornment position="start">PHP</InputAdornment>,
                                }}
                                sx={{ width: { xs: '100%', sm: 220 } }}
                            />
                        </Stack>
                    </Box>

                    <TableContainer>
                        <Table sx={{ minWidth: 1120 }} aria-label="shop branch order table">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#fafafa' }}>
                                    <TableCell sx={{ fontWeight: 800 }}>Invoice</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Shop Name</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800 }}>Qty.</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800 }}>Total Amount</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800 }}>Profit</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Requestor</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Checker</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell sx={{ fontWeight: 700 }}>#{row.id}</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>{row.shop_name}</TableCell>
                                        <TableCell align="right">{row.shop_order_transaction_total_quantity}</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>{numberFormat(row.shop_order_transaction_total_price)}</TableCell>
                                        <TableCell align="right">{numberFormat(row.profit)}</TableCell>
                                        <TableCell>{row.requestor_name || '-'}</TableCell>
                                        <TableCell>{row.checker_name || '-'}</TableCell>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{statusChip(row.status)}</TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Button
                                                    component={Link}
                                                    to={"../shopOrderTransaction/completedShopOrderTransaction/" + row.id}
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<PageviewIcon />}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    component={Link}
                                                    to={"../shopOrderTransaction/printShopBranch/" + row.id}
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<PrintIcon />}
                                                >
                                                    Print
                                                </Button>
                                                <Button
                                                    component={Link}
                                                    to={"../shopOrderTransaction/addProductShopOrderTransaction/" + row.id}
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<UpdateIcon />}
                                                >
                                                    Update
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {rows.length === 0 &&
                                    <TableRow>
                                        <TableCell colSpan={10} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                            No shop branch orders found for this date.
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Box>
    )
}

export default ShorOrderTransactionList
