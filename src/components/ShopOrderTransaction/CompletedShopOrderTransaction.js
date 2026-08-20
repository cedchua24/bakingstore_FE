import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import ShopOrderService from "../OtherService/ShopOrderService";
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import ModeOfPaymentService from "../OtherService/ModeOfPaymentService";
import StorefrontIcon from '@mui/icons-material/Storefront';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatPaymentLabel } from "./shopOrderPaymentHelpers";

const CompletedShopOrderTransaction = () => {


    const { id } = useParams();

    useEffect(() => {
        fetchShopOrderTransaction(id);
        fetchShopOrderDTO(id);
        fetchPaymentTypeByShopTransactionIdV2(id);
    }, []);

    const [orderShop, setOrderShop] = useState({
        id: 0,
        shop_transaction_id: id,
        branch_stock_transaction_id: 0,
        product_id: 0,
        shop_order_quantity: 0,
        shop_order_price: 0,
        shop_order_total_price: 0,
        created_at: ''
    });

    const [modeOfPaymentDTO, setModeOfPaymentDTO] = useState({
        data: [],
        code: ''
    });

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        id: 0,
        shop_id: 0,
        shop_order_transaction_total_quantity: 0,
        shop_order_transaction_total_price: 0,
        requestor: 0,
        checker: 0,
        requestor_name: '',
        status: 0,
        checker_name: '',
        created_at: '',
        updated_at: ''
    });

    const steps = [
        'Created Transaction Details',
        'Add Product Orders',
        'Finalize Orders',
    ];

    const TAX_RATE = 0.12;

    function ccyFormat(num) {
        return `${Number(num || 0).toFixed(2)}`;
    }


    const [invoiceSubtotal, setinvoiceSubtotal] = useState(0);
    const [invoiceTaxes, setinvoiceTaxes] = useState(0);
    const [invoiceTotal, setinvoiceTotal] = useState(0);

    const [orderList, setOrderList] = useState([]);

    const [orderSupplierTransaction, setOrderSupplierTransaction] = useState({
        id: 0,
        supplier_name: '',
        supplier_id: 0,
        withTax: 0,
        status: '',
        total_transaction_price: 0,
        order_date: '',
        created_at: '',
        updated_at: ''
    });

    const [orderShopDTO, setOrderShopDTO] = useState({
        shopOrderTransaction: {},
        shopOrderList: []
    });


    const [message, setMessage] = useState(false);

    const fetchPaymentTypeByShopTransactionIdV2 = async (id) => {
        await ModeOfPaymentService.fetchPaymentTypeByShopTransactionIdV2(id)
            .then(response => {
                const paymentSummary = response.data || {};
                setModeOfPaymentDTO({
                    ...paymentSummary,
                    data: Array.isArray(paymentSummary.data) ? paymentSummary.data : [],
                    total_payment: Number(paymentSummary.total_payment || 0),
                });
                console.log('balance', response.data)

            })
            .catch(e => {
                console.log("error", e)
            });
    }




    const fetchShopOrderTransaction = async (id) => {

        var valueParam = id.split("+");
        console.log('pieces', valueParam);
        console.log('date', valueParam[1]);

        if (valueParam[1] === '') {
            console.log('empty');
        } else {
            console.log('non empty');
        }
        await ShopOrderTransactionService.fetchShopOrderTransaction(id)
            .then(response => {
                console.log('fetchShopOrderTransaction', response.data)
                setShopOrderTransaction(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchShopOrderDTO = async (id) => {
        await ShopOrderService.fetchShopOrderDTO(id)
            .then(response => {
                setOrderShopDTO(response.data);
                const totalPrice = response.data.shopOrderTransaction.shop_order_transaction_total_price;
                const subtotal = totalPrice / (1 + TAX_RATE);

                setinvoiceSubtotal(subtotal);
                setinvoiceTaxes(totalPrice - subtotal);
                setinvoiceTotal(totalPrice);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const updateShopOrderTransactionStatus = async (event) => {
        event.preventDefault();
        setShopOrderTransaction({
            ...shopOrderTransaction,
            status: 1,
        });

        ShopOrderTransactionService.updateShopOrderTransactionStatusV2(shopOrderTransaction.id, shopOrderTransaction)
            .then(response => {
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }



    return (
        <Box sx={{ bgcolor: '#f6f7f9', minHeight: '100vh', py: { xs: 2, md: 4 } }}>
            <Box sx={{ width: 'min(1280px, calc(100% - 32px))', mx: 'auto' }}>
                {message &&
                    <Stack sx={{ mb: 2 }} spacing={2}>
                        <Alert variant="filled" severity="success">
                            Successfully updated.
                        </Alert>
                    </Stack>

                }

                <Paper elevation={0} sx={{ borderRadius: 1, border: '1px solid #e5e7eb', overflow: 'hidden', mb: 2.5 }}>
                    <Box sx={{ bgcolor: '#2f201b', color: '#fff', px: { xs: 2, md: 3 }, py: 2.5 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box sx={{ bgcolor: 'rgba(255,255,255,.14)', borderRadius: 1, p: 1, display: 'flex' }}>
                                    <ReceiptLongIcon />
                                </Box>
                                <Box>
                                    <Typography variant="overline" sx={{ color: '#f3c58b', letterSpacing: 0 }}>Completed Transaction</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
                                        {shopOrderTransaction.shop_name || 'Shop Order'}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                                <Chip
                                    icon={<CheckCircleIcon />}
                                    label="Completed"
                                    size="small"
                                    sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 700 }}
                                />
                                <Chip
                                    label={shopOrderTransaction.created_at || '-'}
                                    size="small"
                                    sx={{ bgcolor: 'rgba(255,255,255,.14)', color: '#fff' }}
                                />
                            </Stack>
                        </Stack>
                    </Box>

                    <Box sx={{ px: { xs: 2, md: 3 }, py: 2.5 }}>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                                gap: 2,
                            }}
                        >
                            <Box>
                                <Typography variant="caption" color="text.secondary">Shop</Typography>
                                <Typography sx={{ fontWeight: 700 }}>{shopOrderTransaction.shop_name || '-'}</Typography>
                            </Box>
                            {shopOrderTransaction.checker != 0 ?
                                <>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Checker</Typography>
                                        <Typography sx={{ fontWeight: 700 }}>{shopOrderTransaction.checker_name || '-'}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Requestor</Typography>
                                        <Typography sx={{ fontWeight: 700 }}>{shopOrderTransaction.requestor_name || '-'}</Typography>
                                    </Box>
                                </>
                                :
                                <>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Customer</Typography>
                                        <Typography sx={{ fontWeight: 700 }}>{shopOrderTransaction.requestor_name || '-'}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Sales Representative</Typography>
                                        <Typography sx={{ fontWeight: 700 }}>{shopOrderTransaction.sr_name || '-'}</Typography>
                                    </Box>
                                </>
                            }
                            <Box>
                                <Typography variant="caption" color="text.secondary">Total Quantity</Typography>
                                <Typography sx={{ fontWeight: 700 }}>{shopOrderTransaction.shop_order_transaction_total_quantity || 0}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 360px' }, gap: 2.5, alignItems: 'start' }}>
                    <Stack spacing={2.5}>
                        {shopOrderTransaction.checker == 0 &&
                            <Paper elevation={0} sx={{ borderRadius: 1, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                                <Box sx={{ px: { xs: 2, md: 3 }, py: 2, borderBottom: '1px solid #e5e7eb' }}>
                                    <Stack direction="row" spacing={1.25} alignItems="center">
                                        <PaymentIcon color="primary" />
                                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Payments</Typography>
                                    </Stack>
                                </Box>
                                <TableContainer>
                                    <Table sx={{ minWidth: 640 }} aria-label="payment table">
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: '#fafafa' }}>
                                                <TableCell sx={{ fontWeight: 800 }}>Account</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 800 }}>Date</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 800 }}>Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {modeOfPaymentDTO.data.map((row) => (
                                                <TableRow key={row.id} hover>
                                                    <TableCell>{formatPaymentLabel(row)}</TableCell>
                                                    <TableCell align="right">
                                                        <Typography
                                                            component="span"
                                                            sx={{ color: shopOrderTransaction.date != row.created_at ? '#b45309' : 'text.primary' }}
                                                        >
                                                            {row.created_at}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">{ccyFormat(row.amount)}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow sx={{ bgcolor: '#fafafa' }}>
                                                <TableCell colSpan={2} sx={{ fontWeight: 800 }}>Total Paid</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 800 }}>PHP {ccyFormat(modeOfPaymentDTO.total_payment)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        }

                        <Paper elevation={0} sx={{ borderRadius: 1, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                            <Box sx={{ px: { xs: 2, md: 3 }, py: 2, borderBottom: '1px solid #e5e7eb' }}>
                                <Stack direction="row" spacing={1.25} alignItems="center">
                                    <StorefrontIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Ordered Products</Typography>
                                </Stack>
                            </Box>
                            <TableContainer>
                                <Table sx={{ minWidth: 760 }} aria-label="products table">
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#fafafa' }}>
                                            <TableCell sx={{ fontWeight: 800 }}>Product</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 800 }}>Qty.</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 800 }}>Unit</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 800 }}>Discount</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 800 }}>Sum</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orderShopDTO.shopOrderList.map((row) => (
                                            <TableRow key={row.id} hover>
                                                <TableCell sx={{ fontWeight: 600 }}>{row.product_name}</TableCell>
                                                <TableCell align="right">{row.shop_order_quantity}</TableCell>
                                                <TableCell align="right">{ccyFormat(row.shop_order_price)}</TableCell>
                                                <TableCell align="right">{row.discount == 'PERCENTAGE' ? row.discount_percentage + '%' + ', ' + '-' + row.discount_amount : row.discount == 'AMOUNT' ? '-' + row.discount_amount : '-'}</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700 }}>{ccyFormat(row.shop_order_total_price)}</TableCell>
                                            </TableRow>
                                        ))}
                                        {orderShopDTO.shopOrderList.length === 0 &&
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                                                    No products found.
                                                </TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Stack>

                    <Paper elevation={0} sx={{ borderRadius: 1, border: '1px solid #e5e7eb', overflow: 'hidden', position: { lg: 'sticky' }, top: { lg: 24 } }}>
                        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #e5e7eb' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>Order Summary</Typography>
                        </Box>
                        <Stack spacing={1.75} sx={{ p: 2.5 }}>
                            <Stack direction="row" justifyContent="space-between" spacing={2}>
                                <Typography color="text.secondary">Subtotal</Typography>
                                <Typography sx={{ fontWeight: 700 }}>PHP {ccyFormat(invoiceSubtotal)}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" spacing={2}>
                                <Typography color="text.secondary">Tax ({`${(TAX_RATE * 100).toFixed(0)}%`})</Typography>
                                <Typography sx={{ fontWeight: 700 }}>PHP {ccyFormat(invoiceTaxes)}</Typography>
                            </Stack>
                            <Divider />
                            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                <Typography sx={{ fontWeight: 800 }}>Grand Total</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 900 }}>PHP {ccyFormat(invoiceTotal)}</Typography>
                            </Stack>
                        </Stack>
                    </Paper>
                </Box>
            </Box>
        </Box >
    )

}

export default CompletedShopOrderTransaction



