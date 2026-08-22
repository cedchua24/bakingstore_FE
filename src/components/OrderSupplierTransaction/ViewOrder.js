import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import ModeOfPaymentPoService from '../OtherService/ModeOfPaymentPoService';
import OrderSupplierService from './OrderSupplierServiceService';
import OrderSupplierTransactionService from './OrderSupplierTransactionService';
import './OrderSupplierTransaction.css';

const TAX_RATE = 0.12;

const initialOrder = {
    id: 0,
    supplier_name: '',
    supplier_id: 0,
    withTax: 0,
    status: '',
    total_transaction_price: 0,
    order_date: '',
};

const ViewOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(initialOrder);
    const [products, setProducts] = useState([]);
    const [payments, setPayments] = useState({
        data: [],
        balance: 0,
        total_payment: 0,
    });
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        Promise.all([
            OrderSupplierTransactionService.findById(id),
            OrderSupplierService.findById(id),
            ModeOfPaymentPoService.fetchPaymentTypePoByShopTransactionId(id),
        ])
            .then(([orderResponse, productResponse, paymentResponse]) => {
                if (!active) return;
                setOrder(orderResponse.data || initialOrder);
                setProducts(Array.isArray(productResponse.data) ? productResponse.data : []);
                setPayments(paymentResponse.data || { data: [], balance: 0, total_payment: 0 });
            })
            .catch(() => {
                if (active) {
                    setError('We could not load this purchase order. Please try again.');
                }
            });

        return () => {
            active = false;
        };
    }, [id]);

    const totals = useMemo(() => {
        const transactionTotal = Number(order.total_transaction_price || 0);

        if (Number(order.withTax) === 0) {
            const tax = transactionTotal * TAX_RATE;
            return {
                subtotal: transactionTotal,
                tax,
                total: transactionTotal + tax,
            };
        }

        const subtotal = transactionTotal / (1 + TAX_RATE);
        return {
            subtotal,
            tax: transactionTotal - subtotal,
            total: transactionTotal,
        };
    }, [order.total_transaction_price, order.withTax]);

    const paymentRows = Array.isArray(payments.data) ? payments.data : [];
    const status = order.status || 'Pending';
    const balance = Number(payments.balance || 0);

    const currency = (value) =>
        new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(Number(value || 0));

    const formatDate = (value) => {
        if (!value) return 'Not available';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
        }).format(date);
    };

    return (
        <main className="purchase-order-page po-view-page">
            <div className="purchase-order-shell po-view-shell">
                <Button
                    className="po-view-back"
                    startIcon={<ArrowBackRoundedIcon />}
                    onClick={() => navigate('/supplierTransactionList/')}
                >
                    Purchase order list
                </Button>

                <header className="purchase-order-heading po-view-heading">
                    <div className="purchase-order-icon">
                        <VisibilityRoundedIcon />
                    </div>
                    <div className="po-view-title">
                        <span className="purchase-order-eyebrow">Purchase order #{order.id || id}</span>
                        <h1>Order details</h1>
                        <p>Review the supplier, payments, products, and complete order total.</p>
                    </div>
                    <span className={`po-view-status po-view-status-${status.toLowerCase()}`}>
                        {status}
                    </span>
                </header>

                {error && <Alert className="po-view-alert" severity="error">{error}</Alert>}

                <section className="po-view-overview">
                    <article>
                        <span className="po-view-overview-icon"><StorefrontRoundedIcon /></span>
                        <div>
                            <small>Supplier</small>
                            <strong>{order.supplier_name || 'Not available'}</strong>
                        </div>
                    </article>
                    <article>
                        <span className="po-view-overview-icon"><CalendarMonthRoundedIcon /></span>
                        <div>
                            <small>Order date</small>
                            <strong>{formatDate(order.order_date)}</strong>
                        </div>
                    </article>
                    <article>
                        <span className="po-view-overview-icon"><Inventory2OutlinedIcon /></span>
                        <div>
                            <small>Products</small>
                            <strong>{products.length} {products.length === 1 ? 'item' : 'items'}</strong>
                        </div>
                    </article>
                    <article>
                        <span className="po-view-overview-icon"><ReceiptLongRoundedIcon /></span>
                        <div>
                            <small>Order total</small>
                            <strong>{currency(totals.total)}</strong>
                        </div>
                    </article>
                </section>

                <section className="po-view-section">
                    <div className="po-view-section-heading">
                        <div>
                            <span>Payment activity</span>
                            <h2>Recorded payments</h2>
                        </div>
                        <div className="po-view-payment-summary">
                            <small>Paid</small>
                            <strong>{currency(payments.total_payment)}</strong>
                            <small>Balance</small>
                            <strong className={balance > 0 ? 'has-balance' : ''}>{currency(balance)}</strong>
                        </div>
                    </div>

                    <TableContainer className="po-view-table" component={Paper}>
                        <Table aria-label="Recorded payments">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Account</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paymentRows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={2}>
                                            <div className="po-view-empty">
                                                <PaymentsOutlinedIcon />
                                                <span>No payments recorded yet</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : paymentRows.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>
                                            <strong className="po-view-primary-cell">
                                                {payment.bank_name || payment.payment_type || 'Payment'}
                                            </strong>
                                            <span className="po-view-secondary-cell">
                                                {[payment.account_name, payment.account_description, payment.account_number]
                                                    .filter(Boolean).join(' · ')}
                                            </span>
                                        </TableCell>
                                        <TableCell align="right" className="po-view-money">
                                            {currency(payment.amount)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </section>

                <section className="po-view-section">
                    <div className="po-view-section-heading">
                        <div>
                            <span>Order contents</span>
                            <h2>Product details</h2>
                        </div>
                        <strong className="po-view-item-count">{products.length} items</strong>
                    </div>

                    <TableContainer className="po-view-table po-view-products" component={Paper}>
                        <Table sx={{ minWidth: 760 }} aria-label="Order product details">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Unit price</TableCell>
                                    <TableCell align="right">Unit</TableCell>
                                    <TableCell>Expiration</TableCell>
                                    <TableCell align="right">Line total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <div className="po-view-empty">
                                                <Inventory2OutlinedIcon />
                                                <span>No products found for this order</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <strong className="po-view-primary-cell">{product.product_name}</strong>
                                        </TableCell>
                                        <TableCell align="right">{product.quantity}</TableCell>
                                        <TableCell align="right">{currency(product.price)}</TableCell>
                                        <TableCell align="right">{product.unit || '—'}</TableCell>
                                        <TableCell>{product.expiration ? formatDate(product.expiration) : '—'}</TableCell>
                                        <TableCell align="right" className="po-view-money">
                                            {currency(product.total_price)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="po-payment-calculation-row">
                                    <TableCell rowSpan={3} colSpan={3} />
                                    <TableCell colSpan={2}>Subtotal</TableCell>
                                    <TableCell align="right">{currency(totals.subtotal)}</TableCell>
                                </TableRow>
                                <TableRow className="po-payment-calculation-row">
                                    <TableCell>Tax</TableCell>
                                    <TableCell>{`${(TAX_RATE * 100).toFixed(0)}%`}</TableCell>
                                    <TableCell align="right">{currency(totals.tax)}</TableCell>
                                </TableRow>
                                <TableRow className="po-grand-total-row">
                                    <TableCell colSpan={2}>Order total</TableCell>
                                    <TableCell align="right">{currency(totals.total)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </section>
            </div>
        </main>
    );
};

export default ViewOrder;
