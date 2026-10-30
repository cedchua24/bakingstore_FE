import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import OrderSupplierTransactionService from "./OrderSupplierTransactionService";
import OrderSupplierService from "./OrderSupplierServiceService";
import ShopService from "../Shop/ShopService";
import CentralPurchaseOrderPaymentService from "../Accounting/CentralPurchaseOrderPaymentService";
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

import LinearProgress from '@mui/material/LinearProgress';

import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import CircularProgress from '@mui/material/CircularProgress';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import UpdateIcon from '@mui/icons-material/Update';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import "./OrderSupplierTransaction.css";

const PaymentOrder = () => {


    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrderSupplierTransaction(id);
        fetchByOrderSupplierId(id);
        fetchPaymentTerm();
        fetchPaymentAccounts();
        fetchCurrentShop();
    }, []);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(92vw, 460px)',
        bgcolor: 'background.paper',
        border: '1px solid #e5e8ec',
        borderRadius: '18px',
        boxShadow: 24,
        p: { xs: 3, sm: 4 },
        '& .MuiTextField-root': { width: '100%' },
    };

    const TAX_RATE = 0.12;

    const [invoiceSubtotal, setinvoiceSubtotal] = useState(0);
    const [invoiceTaxes, setinvoiceTaxes] = useState(0);
    const [invoiceTotal, setinvoiceTotal] = useState(0);



    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const [orderList, setOrderList] = useState([]);

    const [paymentTermList, setPaymentTermList] = useState([]);
    const [paymentTypePoList, setPaymentTypePoList] = useState([]);
    const [shop, setShop] = useState({ id: 0, shop_name: '' });
    const [installmentCount, setInstallmentCount] = useState(1);
    const [errorStock, setErrorStock] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [orderSupplierTransaction, setOrderSupplierTransaction] = useState({
        id: 0,
        supplier_name: '',
        supplier_id: 0,
        withTax: 0,
        status: '',
        payment_status: 0,
        total_transaction_price: 0,
        order_date: '',
        created_at: '',
        updated_at: ''
    });

    const [modeOfPaymentModal, setModeOfPaymentModal] = useState({
        id: 0,
        payment_type_po_id: '',
        order_supplier_transaction_id: 0,
        amount: 0,
        created_at: '',
        updated_at: ''
    });

    const [modeOfPaymentPo, setModeOfPaymentPo] = useState({
        payment_type_po_id: 0,
        order_supplier_transaction_id: id,
        payment_term_id: 0,
        amount: 0,
        status: 0,
        type: 0,
        date: '',
        created_at: '',
        updated_at: ''
    });

    const [modeOfPaymentDTO, setModeOfPaymentDTO] = useState({
        data: [],
        code: '',
        balance: 0,
        total_payment: 0,
    });

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });



    const openDelete = (paymentId) => {
        setDeleteId(paymentId);
        setDeleteOpenModal(true);
    }

    const [open, setOpen] = React.useState(false);

    const handleClose = () => setOpen(false);
    const [deleteOpenModal, setDeleteOpenModal] = React.useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [amount, setAmount] = useState(0);

    const handleOpen = (id, e) => {
        if (Number(orderSupplierTransaction.payment_status) === 1) return;
        console.log('e', id);
        fetchModeOfPayment(id);
        setOpen(true);
    }


    const handleDeleteCloseModal = () => {
        setDeleteOpenModal(false);
    };


    const onChangeInputPriceModal = (e) => {
        e.persist();
        setModeOfPaymentModal({
            ...modeOfPaymentModal,
            amount: e.target.value
        });
    }

    const updateOrderSupplier = () => {
        setOpen(false);
        setValidator({ severity: 'error', message: 'Posted Accounting payments cannot be edited. Void the payment and enter a corrected payment.', isShow: true });
    }

    const fetchModeOfPayment = async (id) => {
        const payment = modeOfPaymentDTO.data.find((row) => Number(row.id) === Number(id));
        if (payment) {
            setModeOfPaymentModal(payment);
            setAmount(payment.amount);
        }
    }
    const deleteOrderTransaction = (deleteId, e) => {
        if (Number(orderSupplierTransaction.payment_status) === 1) return;
        setSubmitLoading(true);
        console.log("test", modeOfPaymentModal);
        CentralPurchaseOrderPaymentService.voidPayment(deleteId)
            .then(async response => {
                await OrderSupplierTransactionService.updateCentralAccountingPaymentStatus(id, 0);
                setOrderSupplierTransaction(current => ({ ...current, payment_status: 0 }));
                setSubmitLoading(false);
                setOpen(false);
                setDeleteOpenModal(false);
                window.scrollTo(0, 0);
                setValidator({
                    severity: 'success',
                    message: 'Successfuly Deleted!',
                    isShow: true,
                });
                fetchPaymentTypePoByShopTransactionId(id, orderSupplierTransaction.total_transaction_price);
                // window.location.reload();
            })
            .catch(e => {
                console.log('error', e);
            });
    }


    const [message, setMessage] = useState(false);

    const onChangeInput = (e) => {
        setModeOfPaymentPo({ ...modeOfPaymentPo, [e.target.name]: e.target.value });
        console.log('modeOfPaymentPo', modeOfPaymentPo);
    }

    const handlePaymentTypeChange = (e, value) => {
        if (!value) {
            setModeOfPaymentPo({ ...modeOfPaymentPo, payment_type_po_id: 0 });
            return;
        }

        setModeOfPaymentPo({
            ...modeOfPaymentPo,
            payment_type_po_id: value.id,
        });


    }

    const handlePaymentTermChange = (e, value) => {
        if (!value) {
            setModeOfPaymentPo({
                ...modeOfPaymentPo,
                payment_term_id: 0,
                payment_type_po_id: 0,
            });
            setInstallmentCount(1);
            return;
        }
        setModeOfPaymentPo({
            ...modeOfPaymentPo,
            payment_term_id: value.id,
            payment_type_po_id: 0,
        });
        if (value.type !== 'credit_card') setInstallmentCount(1);
    }

    const onChangeAmount = (e) => {
        console.log(e.target.value)
        setModeOfPaymentPo({ ...modeOfPaymentPo, amount: e.target.value });
        // if (modeOfPaymentDTO.total_payment != 0) {
        //     if (Number(e.target.value) > modeOfPaymentDTO.balance) {
        //         setErrorStock(true);
        //     } else {
        //         setErrorStock(false);
        //     }
        // }
    }

    const fetchPaymentTerm = () => {
        CentralPurchaseOrderPaymentService.paymentMethods()
            .then(methods => {
                setPaymentTermList(methods);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchPaymentAccounts = () => {
        CentralPurchaseOrderPaymentService.accounts()
            .then(accounts => setPaymentTypePoList(accounts))
            .catch(e => {
                setPaymentTypePoList([]);
                console.log("error", e);
            });
    }

    const fetchCurrentShop = () => {
        ShopService.fetchShopCurrent()
            .then(response => setShop(response.data || {}))
            .catch(e => console.log("error", e));
    }


    const fetchOrderSupplierTransaction = async (id) => {
        await OrderSupplierTransactionService.findById(id)
            .then(response => {
                setOrderSupplierTransaction(response.data);
                fetchPaymentTypePoByShopTransactionId(id, response.data.total_transaction_price);

                if (response.data.withTax === 0) {

                    setinvoiceSubtotal(response.data.total_transaction_price);
                    setinvoiceTaxes(TAX_RATE * response.data.total_transaction_price);
                    setinvoiceTotal(TAX_RATE * response.data.total_transaction_price + response.data.total_transaction_price);
                } else {
                    const totalPrice = response.data.total_transaction_price;
                    const subtotal = totalPrice / (1 + TAX_RATE);

                    setinvoiceSubtotal(subtotal);
                    setinvoiceTaxes(totalPrice - subtotal);
                    setinvoiceTotal(totalPrice);
                }
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchByOrderSupplierId = async (id) => {
        await OrderSupplierService.findById(id)
            .then(response => {
                setOrderList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const updateOrderTransaction = () => {
        if (Number(orderSupplierTransaction.payment_status) === 1) return;
        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        OrderSupplierTransactionService.setToCompletePaymentTransaction(id)
            .then(response => {
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
                navigate('/supplierTransactionList/');
            })
            .catch(e => {
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
                console.log(e);
            });
    }


    const validate = (values) => {
        const errors = {};
        if (modeOfPaymentPo.payment_term_id == 0) {
            errors.payment_term_id = "Payment Term is Required!";
        }

        if (modeOfPaymentPo.payment_type_po_id == 0) {
            errors.payment_type_po_id = "Account is Required!";
        }
        if (modeOfPaymentPo.amount == 0) {
            errors.amount = "Amount is Required!";
        }
        if (modeOfPaymentPo.date == 0) {
            errors.date = "Date is Required!";
        }
        if (!shop.id || !shop.shop_name) {
            errors.payment_term_id = "Current branch could not be identified.";
        }



        return errors;
    }


    const savePaymentType = () => {
        console.log('modeOfPaymentPo:', modeOfPaymentPo);
        console.log("count: ", Object.keys(validate(modeOfPaymentPo)).length);
        console.log("validate: ", validate(modeOfPaymentPo));
        setFormErrors(validate(modeOfPaymentPo));
        if (Object.keys(validate(modeOfPaymentPo)).length > 0) {
            console.log("Has Validation: ");
        } else {
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            setErrorStock(true);
            CentralPurchaseOrderPaymentService.createPayment({
                external_branch_id: Number(shop.id),
                branch_name: shop.shop_name,
                external_supplier_id: Number(orderSupplierTransaction.supplier_id),
                supplier_name: orderSupplierTransaction.supplier_name,
                external_order_id: Number(id),
                order_date: dateOnly(orderSupplierTransaction.order_date),
                order_total: Number(orderSupplierTransaction.total_transaction_price),
                financial_account_id: Number(modeOfPaymentPo.payment_type_po_id),
                payment_method_id: Number(modeOfPaymentPo.payment_term_id),
                payment_date: modeOfPaymentPo.date,
                amount: Number(modeOfPaymentPo.amount),
                installment_count: Number(installmentCount || 1),
                currency: 'PHP',
            })
                .then(summary => {
                    applyCentralPaymentSummary(summary, orderSupplierTransaction.total_transaction_price);
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                    setErrorStock(false);
                    setMessage(true);
                })
                .catch(e => {
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                    setErrorStock(false);
                    setValidator({
                        severity: 'error',
                        message: e.response?.data?.message || Object.values(e.response?.data?.errors || {})?.[0]?.[0] || 'Unable to save payment in Central Accounting.',
                        isShow: true,
                    });
                });
        }
    }
    const applyCentralPaymentSummary = (summary, fallbackTotal = 0) => {
        const payments = (summary.data || []).flatMap((payment) => (payment.lines || []).map((line) => ({
            id: payment.id,
            payment_line_id: line.id,
            bank_name: line.financial_account?.institution?.name,
            account_name: line.financial_account?.name,
            account_holder: line.financial_account?.account_holder,
            account_number: line.financial_account?.masked_account_number,
            description: line.financial_account?.description,
            kind: line.financial_account?.kind,
            amount: line.amount,
            payment_date: payment.payment_date,
            status: payment.status,
            installment_count: line.installment_count,
            obligations: line.obligation_charges || [],
            is_central: true,
        })));
        const balance = summary.balance === null || summary.balance === undefined
            ? Number(fallbackTotal || 0)
            : Number(summary.balance);
        setModeOfPaymentDTO({
            ...summary,
            data: payments,
            balance,
            total_payment: Number(summary.total_payment || 0),
        });
        setModeOfPaymentPo(current => ({ ...current, amount: balance }));
    };

    const fetchPaymentTypePoByShopTransactionId = (orderId, fallbackTotal = 0) => {
        CentralPurchaseOrderPaymentService.summary(orderId)
            .then(summary => applyCentralPaymentSummary(summary, fallbackTotal))
            .catch(e => {
                console.log("error", e)
            });
    }

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');

    const dateOnly = (value) => value ? String(value).split('T')[0].split(' ')[0] : '';

    const hasDisplayValue = (value) => {
        const normalizedValue = String(value ?? '').trim();
        return normalizedValue !== '' && normalizedValue !== '0';
    };

    const paymentAccountLabel = (payment) => {
        if (payment.kind === 'credit_card') {
            const institutionName = String(payment.institution?.name || payment.bank_name || '').trim();
            let description = String(payment.description || payment.name || payment.account_name || '').trim();

            while (institutionName && description.toLowerCase().startsWith(institutionName.toLowerCase())) {
                description = description.slice(institutionName.length).replace(/^\s*[-–—·:]?\s*/, '').trim();
            }

            const primaryLabel = [institutionName, description].filter(hasDisplayValue).join(' - ');
            return [
                primaryLabel,
                payment.account_holder,
                payment.masked_account_number || payment.account_number,
            ]
                .filter(hasDisplayValue)
                .filter((value, index, entries) => entries.findIndex((candidate) => String(candidate).trim().toLowerCase() === String(value).trim().toLowerCase()) === index)
                .join(' · ') || 'Payment';
        }

        return [
            payment.institution?.name || payment.bank_name,
            payment.name || payment.account_name,
            payment.masked_account_number || payment.account_number,
        ]
            .filter(hasDisplayValue)
            .filter((value, index, entries) => entries.findIndex((candidate) => String(candidate).trim().toLowerCase() === String(value).trim().toLowerCase()) === index)
            .join(' · ') || 'Payment';
    };

    const isFullyPaid = Number(orderSupplierTransaction.payment_status) === 1;
    const selectedPaymentMethod = paymentTermList.find((method) => Number(method.id) === Number(modeOfPaymentPo.payment_term_id));
    const accountKindsByMethod = {
        cash: ['cash'],
        bank_transfer: ['bank_account', 'checking_account'],
        cheque: ['checking_account'],
        credit_card: ['credit_card'],
        e_wallet: ['e_wallet'],
    };
    const availablePaymentAccounts = paymentTypePoList.filter((account) => (
        (accountKindsByMethod[selectedPaymentMethod?.type] || []).includes(account.kind)
    ));





    return (
        <main className="purchase-order-page po-payment-page">
            <section className="purchase-order-shell">
            <div className="purchase-order-heading">
                <div className="purchase-order-icon" aria-hidden="true">
                    <PaymentsOutlinedIcon />
                </div>
                <div>
                    <span className="purchase-order-eyebrow">Purchase order #{id}</span>
                    <h1>Manage payments</h1>
                    <p>Record supplier payments, review the remaining balance, and complete the payment status.</p>
                </div>
            </div>

            {message &&
                <Alert className="po-products-alert" variant="filled" severity="success">
                    Payment added successfully.
                </Alert>
            }
            {validator.isShow &&
                <Alert className="po-products-alert" variant="filled" severity={validator.severity}>
                    {validator.message}
                </Alert>
            }

                <TableContainer component={Paper} className="po-order-summary po-payment-summary">
                    <Table aria-label="Purchase order payment summary">
                        <TableBody>
                            <TableRow >
                                <TableCell>
                                    <div className="po-summary-label"><LocalShippingOutlinedIcon /> Supplier</div>
                                    <strong>{orderSupplierTransaction.supplier_name || 'Loading…'}</strong>
                                </TableCell>
                                <TableCell>
                                    <div className="po-summary-label"><CalendarMonthOutlinedIcon /> Order date</div>
                                    <strong>{orderSupplierTransaction.order_date || '—'}</strong>
                                </TableCell>
                                <TableCell>
                                    <div className="po-summary-label"><AccountBalanceWalletOutlinedIcon /> Paid</div>
                                    <strong>{numberFormat(modeOfPaymentDTO.total_payment || 0)}</strong>
                                </TableCell>
                                <TableCell align="right">
                                    <div className="po-summary-label po-summary-label-right">Balance due</div>
                                    <strong className="po-summary-total">{numberFormat(modeOfPaymentDTO.balance || 0)}</strong>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

            {Number(modeOfPaymentDTO.balance) !== 0 ? (
                <section className="po-payment-entry-card">
                    <div className="po-card-heading">
                        <div>
                            <span>New payment</span>
                            <h2>Add a supplier payment</h2>
                            <p>Choose the payment terms, account, amount, and transaction date.</p>
                        </div>
                    </div>
                <div className="po-payment-form">
                    <div className="po-form-field">
                        <Autocomplete
                            options={paymentTermList}
                            id="payment-term-select"
                            onChange={handlePaymentTermChange}
                            getOptionLabel={(option) => option.name || ''}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Payment term"
                                    error={Boolean(formErrors.payment_term_id)}
                                    helperText={formErrors.payment_term_id}
                                />
                            )}
                        />
                    </div>

                    {Number(modeOfPaymentPo.payment_term_id) !== 0 && (
                        <div className="po-form-field po-form-field-full">
                            <Autocomplete
                                options={availablePaymentAccounts}
                                id="payment-account-select"
                                onChange={handlePaymentTypeChange}
                                getOptionLabel={paymentAccountLabel}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Account"
                                        error={Boolean(formErrors.payment_type_po_id)}
                                        helperText={formErrors.payment_type_po_id}
                                    />
                                )}
                            />
                        </div>
                    )}

                    {Number(modeOfPaymentPo.payment_term_id) !== 0 && (
                        <>
                            <div className="po-form-field">
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Amount"
                                    name="amount"
                                    value={modeOfPaymentPo.amount}
                                    onChange={onChangeInput}
                                    error={Boolean(formErrors.amount)}
                                    helperText={formErrors.amount || `Maximum balance: ${numberFormat(modeOfPaymentDTO.balance || 0)}`}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">₱</InputAdornment>
                                    }}
                                    inputProps={{ min: 0, max: modeOfPaymentDTO.balance }}
                                />
                            </div>
                            <div className="po-form-field">
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Payment date"
                                    name="date"
                                    value={modeOfPaymentPo.date || ''}
                                    onChange={onChangeInput}
                                    error={Boolean(formErrors.date)}
                                    helperText={formErrors.date}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </div>
                            {selectedPaymentMethod?.type === 'credit_card' && (
                                <div className="po-form-field">
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Installments"
                                        value={installmentCount}
                                        onChange={(event) => setInstallmentCount(Math.max(1, Number(event.target.value || 1)))}
                                        inputProps={{ min: 1, max: 60, step: 1 }}
                                        helperText="Accounting will create the monthly statement due dates."
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {submitLoadingAdd && <LinearProgress color="warning" className="po-form-field-full" />}

                    <div className="po-payment-add-action">
                        <Button
                            variant="contained"
                            disabled={errorStock || isAddDisabled}
                            onClick={savePaymentType}
                            startIcon={submitLoadingAdd ? <CircularProgress size={18} color="inherit" /> : <AddRoundedIcon />}
                            className="po-add-button"
                        >
                            {submitLoadingAdd ? 'Adding payment…' : 'Add payment'}
                        </Button>
                    </div>
                </div>
                </section>
            ) : (
                <Alert className="po-payment-complete-alert" icon={<CheckCircleOutlineRoundedIcon />} severity="success">
                    This purchase order is fully paid.
                </Alert>
            )}

            <div className="po-list-heading po-payment-section-heading">
                <div>
                    <span>Payment history</span>
                    <h2>Recorded payments</h2>
                </div>
                <strong>{modeOfPaymentDTO.data.length} {modeOfPaymentDTO.data.length === 1 ? 'payment' : 'payments'}</strong>
            </div>
            <TableContainer component={Paper} className="po-items-table po-payment-history">
                <Table sx={{ minWidth: 640 }} aria-label="Recorded supplier payments">
                    <TableHead>
                        <TableRow>
                            <TableCell>Account</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="right">Date</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {modeOfPaymentDTO.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <div className="po-empty-state">
                                        <PaymentsOutlinedIcon />
                                        <strong>No payments recorded</strong>
                                        <span>Add the first payment using the form above.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                        {modeOfPaymentDTO.data.map((row) => {
                            const paymentDate = row.payment_date || row.date;
                            const isDifferentFromOrderDate = Boolean(
                                paymentDate && orderSupplierTransaction.order_date
                                && dateOnly(paymentDate) !== dateOnly(orderSupplierTransaction.order_date)
                            );

                            return (
                            <TableRow key={row.id} hover>
                                <TableCell>
                                    <strong>{paymentAccountLabel(row)}</strong>
                                    {row.status === 'voided' && (
                                        <Typography variant="caption" display="block" color="error.main">Voided</Typography>
                                    )}
                                </TableCell>
                                <TableCell align="right"><strong>{numberFormat(row.amount || 0)}</strong></TableCell>
                                <TableCell align="right" className={isDifferentFromOrderDate ? 'po-payment-date-mismatch' : undefined}>
                                    {dateOnly(paymentDate) || '—'}
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title={row.status === 'voided' ? "Payment is already voided" : "Void payment"}>
                                        <span>
                                            <IconButton color="error" disabled={row.status === 'voided'} onClick={() => openDelete(row.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </TableCell>

                            </TableRow>
                            );
                        })}
                        <TableRow className="po-grand-total-row">
                            <TableCell>Total paid</TableCell>
                            <TableCell align="right">{numberFormat(modeOfPaymentDTO.total_payment || 0)}</TableCell>
                            <TableCell colSpan={2}></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="po-list-heading po-payment-section-heading">
                <div>
                    <span>Order reference</span>
                    <h2>Purchase order products</h2>
                </div>
                <strong>{orderList.length} {orderList.length === 1 ? 'item' : 'items'}</strong>
            </div>
            <TableContainer component={Paper} className="po-items-table">
                <Table sx={{ minWidth: 700 }} aria-label="Purchase order products">
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Unit price</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderList.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <div className="po-empty-state">
                                        <Inventory2OutlinedIcon />
                                        <strong>No products found</strong>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                        {orderList.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell><strong>{row.product_name}</strong></TableCell>
                                <TableCell align="right">{row.quantity}</TableCell>
                                <TableCell align="right">{numberFormat(row.price || 0)}</TableCell>
                                <TableCell align="right"><strong>{numberFormat(row.total_price || 0)}</strong></TableCell>
                            </TableRow>
                        ))}

                        <TableRow className="po-payment-calculation-row">
                            <TableCell rowSpan={3} />
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{numberFormat(invoiceSubtotal)}</TableCell>
                        </TableRow>
                        <TableRow className="po-payment-calculation-row">
                            <TableCell>Tax</TableCell>
                            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
                            <TableCell align="right">{numberFormat(invoiceTaxes)}</TableCell>
                        </TableRow>
                        <TableRow className="po-grand-total-row">
                            <TableCell colSpan={2}>Order total</TableCell>
                            <TableCell align="right">{numberFormat(invoiceTotal)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <section className="po-payment-completion">
                <Button
                    disabled={isFullyPaid || Number(modeOfPaymentDTO.balance) !== 0 || isAddDisabled}
                    variant="contained"
                    onClick={updateOrderTransaction}
                    size="large"
                    startIcon={<CheckCircleOutlineRoundedIcon />}
                    className="purchase-order-next"
                >
                    {submitLoadingAdd ? 'Completing…' : 'Mark as fully paid'}
                </Button>
            </section>

            <Dialog
                open={deleteOpenModal}
                onClose={handleDeleteCloseModal}
                aria-labelledby="delete-payment-title"
            >
                <DialogTitle id="delete-payment-title">Void this Accounting payment?</DialogTitle>
                {submitLoading && (
                    <div className="po-dialog-loading">
                        <CircularProgress size={26} />
                    </div>
                )}
                <DialogActions>
                    <Button onClick={handleDeleteCloseModal}>Keep payment</Button>
                    <Button color="error" onClick={(event) => deleteOrderTransaction(deleteId, event)} autoFocus>
                        Void payment
                    </Button>
                </DialogActions>
            </Dialog>

            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Edit payment amount
                    </Typography>
                    {submitLoading &&
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </div>
                    }
                    <br></br>
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
                        <Input
                            id="filled-required"
                            label="Amount"
                            variant="filled"
                            name='amount'
                            value={modeOfPaymentModal.amount}
                            onChange={onChangeInputPriceModal}
                            startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                        />
                    </FormControl>



                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            disabled={submitLoading}
                            variant="contained"
                            onClick={updateOrderSupplier}
                            size="large" >
                            Save changes
                        </Button>
                    </Box>
                </Box>
            </Modal>
            </section>
        </main>
    );
}

export default PaymentOrder;



