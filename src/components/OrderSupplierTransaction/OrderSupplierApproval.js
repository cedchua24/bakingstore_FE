import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Alert from '@mui/material/Alert';
import OrderSupplierTransactionService from "./OrderSupplierTransactionService";
import OrderSupplierService from "./OrderSupplierServiceService";
import PaymentTypePoService from "../OtherService/PaymentTypePoService";
import ModeOfPaymentPoService from "../OtherService/ModeOfPaymentPoService";
import PaymentTermService from "../OtherService/PaymentTermService";
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import LinearProgress from '@mui/material/LinearProgress';

import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
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
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import "./OrderSupplierTransaction.css";



const OrderSupplierApproval = () => {


    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrderSupplierTransaction(id);
        fetchApprovalPO(id);
        fetchPaymentTypePo();
        fetchPaymentTerm();
        fetchPaymentTypePoByShopTransactionId(id);
    }, []);

    const steps = [
        'Order details',
        'Add products',
        'Review',
        'Send',
        'Receive',
    ];

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

    function ccyFormat(num) {
        return `${num.toFixed(2)}`;
    }


    const [invoiceSubtotal, setinvoiceSubtotal] = useState(0);
    const [invoiceTaxes, setinvoiceTaxes] = useState(0);
    const [invoiceTotal, setinvoiceTotal] = useState(0);

    const [dueDay, setDueDay] = useState([31]);

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);



    const [orderList, setOrderList] = useState({
        data: []
    });

    const [paymentTermList, setPaymentTermList] = useState([]);
    const [paymentTypePoList, setPaymentTypePoList] = useState([]);
    const [errorStock, setErrorStock] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [orderSupplierTransaction, setOrderSupplierTransaction] = useState({
        id: 0,
        supplier_name: '',
        supplier_id: 0,
        withTax: 0,
        status: '',
        total_transaction_price: 0,
        approval: localStorage.getItem('name'),
        approval_status: '',
        note: '',
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



    const openDelete = () => {
        setDeleteOpenModal(true);
    }

    const [open, setOpen] = React.useState(false);

    const handleClose = () => setOpen(false);
    const [deleteOpenModal, setDeleteOpenModal] = React.useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [amount, setAmount] = useState(0);

    const handleOpen = (id, e) => {
        console.log('e', id);
        fetchModeOfPayment(id);
        setOpen(true);
    }


    const handleDeleteCloseModal = () => {
        setDeleteOpenModal(false);
    };

    const handleInputChange = (e, value) => {
        e.persist();
        setModeOfPaymentPo({
            ...modeOfPaymentPo,
            order_supplier_transaction_id: orderSupplierTransaction.id,
            payment_type_po_id: value.id,
        });
    }

    const onChangeInputPriceModal = (e) => {
        e.persist();
        setModeOfPaymentModal({
            ...modeOfPaymentModal,
            amount: e.target.value
        });
    }

    const updateOrderSupplier = () => {
        setSubmitLoading(true);
        if (modeOfPaymentModal.amount > (modeOfPaymentDTO.balance + amount)) {
            setSubmitLoading(false);
            setOpen(false);
            window.scrollTo(0, 0);
            setValidator({
                severity: 'error',
                message: 'Must Less than to Balance',
                isShow: true,
            });

        } else {
            ModeOfPaymentPoService.update(modeOfPaymentModal.id, modeOfPaymentModal)
                .then(response => {
                    console.log(response.data);
                    if (response.data.code == 200) {
                        setSubmitLoading(false);
                        setOpen(false);
                        window.scrollTo(0, 0);
                        setValidator({
                            severity: 'success',
                            message: 'Successfuly Added!',
                            isShow: true,
                        });
                        fetchPaymentTypePoByShopTransactionId(id);
                    } else if (response.data.code == 400) {
                        setSubmitLoading(false);
                        setOpen(false);
                        window.scrollTo(0, 0);
                        setValidator({
                            severity: 'error',
                            message: response.data.message,
                            isShow: true,
                        });
                    } else {
                        setSubmitLoading(false);
                        setOpen(false);
                        setValidator({
                            severity: 'error',
                            message: "Unknown Error",
                            isShow: true,
                        });
                    }
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }

    const fetchModeOfPayment = async (id) => {
        await ModeOfPaymentPoService.get(id)
            .then(response => {
                setModeOfPaymentModal(response.data);
                setAmount(response.data.amount)
                console.log(response.data)
            })
            .catch(e => {
                console.log("error", e)
            });
    }
    const deleteOrderTransaction = (deleteId, e) => {
        setSubmitLoading(true);
        console.log("test", modeOfPaymentModal);
        ModeOfPaymentPoService.delete(deleteId, modeOfPaymentModal)
            .then(response => {
                setSubmitLoading(false);
                setOpen(false);
                setDeleteOpenModal(false);
                window.scrollTo(0, 0);
                setValidator({
                    severity: 'success',
                    message: 'Successfuly Deleted!',
                    isShow: true,
                });
                fetchPaymentTypePoByShopTransactionId(id);
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
        e.persist();
        console.log(e.target.value)
        setModeOfPaymentPo({
            ...modeOfPaymentPo,
            payment_type_po_id: value.id,
        });
    }

    const handlePaymentTermChange = (e, value) => {
        e.persist();
        console.log(value)
        if (value.id == 1) {
            setModeOfPaymentPo({
                ...modeOfPaymentPo,
                payment_term_id: value.id,
                payment_type_po_id: 1
            });
        }
        else if (value.id == 4) {
            setModeOfPaymentPo({
                ...modeOfPaymentPo,
                payment_term_id: value.id,
                amount: modeOfPaymentDTO.balance,
                payment_type_po_id: 2
            });
        }
        else {
            setModeOfPaymentPo({
                ...modeOfPaymentPo,
                payment_term_id: value.id
            });
        }

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

    const fetchPaymentTypePo = () => {
        PaymentTypePoService.getAll()
            .then(response => {
                setPaymentTypePoList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchPaymentTerm = () => {
        PaymentTermService.getAll()
            .then(response => {
                setPaymentTermList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const fetchOrderSupplierTransaction = async (id) => {
        await OrderSupplierTransactionService.findById(id)
            .then(response => {
                setOrderSupplierTransaction(response.data);

                if (response.data.withTax === 0) {

                    setinvoiceSubtotal(response.data.total_transaction_price);
                    setinvoiceTaxes(TAX_RATE * response.data.total_transaction_price);
                    setinvoiceTotal(TAX_RATE * response.data.total_transaction_price + response.data.total_transaction_price);
                } else {
                    setinvoiceSubtotal(response.data.total_transaction_price / (1 + TAX_RATE));
                    setinvoiceTaxes(TAX_RATE * response.data.total_transaction_price);
                    setinvoiceTotal(response.data.total_transaction_price);
                }
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const fetchApprovalPO = async (id) => {
        await OrderSupplierService.fetchApprovalPO(id)
            .then(response => {
                setOrderList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const onChange = (e) => {
        setOrderSupplierTransaction({ ...orderSupplierTransaction, [e.target.name]: e.target.value, approval: localStorage.getItem('name') });
    }


    const updateOrderTransaction = () => {
        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        OrderSupplierTransactionService.setToCompleteTransaction(id)
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

    const submitApproval = () => {
        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        OrderSupplierTransactionService.orderSupplierApproval(orderSupplierTransaction)
            .then(response => {
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
                if (response.data.approval_status == 'APPROVED') {
                    navigate('/sendToSupplier/' + id);
                }
            })
            .catch(e => {
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
                console.log(e);
            });
    }

    const nextSubmit = () => {
        navigate('/sendToSupplier/' + id);

    }




    const validate = (values) => {
        const errors = {};
        if (modeOfPaymentPo.payment_term_id == 0) {
            errors.payment_term_id = "Payment Term is Required!";
        }

        if (modeOfPaymentPo.payment_term_id == 2 || modeOfPaymentPo.payment_term_id == 3) {
            if (modeOfPaymentPo.payment_type_po_id == 0) {
                errors.payment_type_po_id = "Bank is Required!";
            }
        }

        if (modeOfPaymentPo.payment_term_id != 4) {
            if (modeOfPaymentPo.amount == 0) {
                errors.amount = "Amount is Required!";
            }
        }
        if (modeOfPaymentPo.date == 0) {
            errors.date = "Date is Required!";
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
            ModeOfPaymentPoService.sanctum().then(response => {
                ModeOfPaymentPoService.create(modeOfPaymentPo)
                    .then(response => {
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                        setErrorStock(false);
                        fetchPaymentTypePoByShopTransactionId(id);
                    })
                    .catch(e => {
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                        setErrorStock(false);
                        console.log(e);
                    });
            });
        }
    }
    const fetchPaymentTypePoByShopTransactionId = (id) => {

        ModeOfPaymentPoService.fetchPaymentTypePoByShopTransactionId(id)
            .then(response => {
                setModeOfPaymentDTO(response.data);
                console.log('balance', response.data)
                setModeOfPaymentPo({
                    ...modeOfPaymentPo,
                    amount: response.data.balance,
                });

            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');

    const formatStatementDate = (date) => {
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }

    const statusColor = {
        PENDING: 'warning.main',
        APPROVED: 'success.main',
        REJECTED: 'error.main',
    };

    return (
        <main className="purchase-order-page po-approval-page">
            <section className="purchase-order-shell po-approval-shell">
            <div className="purchase-order-heading">
                <div className="purchase-order-icon" aria-hidden="true">
                    <FactCheckOutlinedIcon />
                </div>
                <div>
                    <span className="purchase-order-eyebrow">Purchase order #{id}</span>
                    <h1>Review purchase order</h1>
                    <p>Check quantities, stock levels, sales history, and totals before recording your decision.</p>
                </div>
            </div>

            {message &&
                <Alert className="po-products-alert" variant="filled" severity="success">
                    Successfully added.
                </Alert>
            }
            {validator.isShow &&
                <Alert className="po-products-alert" variant="filled" severity={validator.severity}>
                    {validator.message}
                </Alert>
            }

            <Box
                className="po-approval-workspace"
                noValidate
                autoComplete="off"
            >
                <div className="purchase-order-progress">
                <Stepper activeStep={2} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                </div>

                <TableContainer component={Paper} className="po-order-summary">
                    <Table aria-label="Purchase order summary">
                        <TableBody>
                            <TableRow >
                                <TableCell>
                                    <div className="po-summary-label"><LocalShippingOutlinedIcon /> Supplier</div>
                                    <strong>{orderSupplierTransaction.supplier_name || 'Loading…'}</strong>
                                </TableCell>
                                <TableCell>
                                    <div className="po-summary-label"><CalendarMonthOutlinedIcon /> Created</div>
                                    <strong>{orderSupplierTransaction.created_at || '—'}</strong>
                                </TableCell>
                                <TableCell>
                                    <div className="po-summary-label"><Inventory2OutlinedIcon /> Products</div>
                                    <strong>{orderList.data.length}</strong>
                                </TableCell>
                                <TableCell align="right">
                                    <div className="po-summary-label po-summary-label-right">Order total</div>
                                    <strong className="po-summary-total">{numberFormat(invoiceTotal)}</strong>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <div className="po-list-heading po-approval-list-heading">
                <div>
                    <span>Review details</span>
                    <h2>Products, stock, and sales history</h2>
                </div>
                <strong>{orderList.data.length} {orderList.data.length === 1 ? 'product' : 'products'}</strong>
            </div>
            <TableContainer component={Paper} className="po-items-table po-approval-table">
                <Table sx={{ minWidth: 1500 }} aria-label="Purchase order review details">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" colSpan={6} ><h5 style={{ fontWeight: 'bold' }}>Order Details</h5></TableCell>
                            <TableCell align="center" ><h5 style={{ fontWeight: 'bold' }}></h5></TableCell>
                            <TableCell align="center" colSpan={2} style={{ fontWeight: 'bold' }}><h5 style={{ fontWeight: 'bold' }}>Stock</h5></TableCell>
                            <TableCell align="center" ><h5 style={{ fontWeight: 'bold' }}></h5></TableCell>
                            <TableCell align="center" colSpan={5} style={{ fontWeight: 'bold' }}><h5 style={{ fontWeight: 'bold' }}>Sold</h5></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}><h6 style={{ fontWeight: 'bold' }}>Product</h6></TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}><h6 style={{ fontWeight: 'bold' }}>Qty</h6></TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}><h6 style={{ fontWeight: 'bold' }}>Price</h6></TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}><h6 style={{ fontWeight: 'bold' }}>Unit</h6></TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}><h6 style={{ fontWeight: 'bold' }}>Expiration</h6></TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}><h6 style={{ fontWeight: 'bold' }} >Sum</h6></TableCell>
                            <TableCell align="center" style={{ backgroundColor: '#FFFAF0' }}><h6 style={{ fontWeight: 'bold' }}></h6></TableCell>
                            <TableCell align="center" style={{ color: '#28a745' }}><h6 style={{ fontWeight: 'bold' }}>Current Stock</h6></TableCell>
                            <TableCell align="center" style={{ color: '#fd7e14' }}><h6 style={{ fontWeight: 'bold' }}>Stock Warning</h6></TableCell>
                            <TableCell align="center" style={{ backgroundColor: '#FFFAF0' }}><h6 style={{ fontWeight: 'bold' }}></h6></TableCell>
                            <TableCell align="center" style={{ color: '#007bff' }}><h6 style={{ fontWeight: 'bold' }}> <Tooltip title={orderList.last15Days + " - " + orderSupplierTransaction.created_at} >    <span>     Last 15 days   </span></Tooltip></h6></TableCell>
                            <TableCell align="center" style={{ color: '#20c997' }}><h6 style={{ fontWeight: 'bold' }}><Tooltip title={orderList.last30Days + " - " + orderSupplierTransaction.created_at} >    <span>     Last 30 days   </span></Tooltip></h6></TableCell>
                            <TableCell align="center" style={{ color: '#6f42c1' }}><h6 style={{ fontWeight: 'bold' }}><Tooltip title={orderList.twoMonthsAgoStart + " - " + orderList.twoMonthsAgoEnd} >    <span>    Last 2 months   </span></Tooltip></h6></TableCell>
                            <TableCell align="center" style={{ color: '#6c757d' }}><h6 style={{ fontWeight: 'bold' }}><Tooltip title={orderList.startLastYear + " - " + orderList.endLastYear} >    <span>    Last year   </span></Tooltip></h6></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderList.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={14}>
                                    <div className="po-empty-state">
                                        <Inventory2OutlinedIcon />
                                        <strong>No products found</strong>
                                        <span>Add products before reviewing this purchase order.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                        {orderList.data.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}><strong>{row.product_name}</strong></TableCell>
                                <TableCell align="right">{row.quantity}</TableCell>
                                <TableCell align="right">{numberFormat(row.price)}</TableCell>
                                <TableCell align="right">{row.unit}</TableCell>


                                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>{row.expiration != null ? formatStatementDate(row.expiration) : "—"}</TableCell>
                                <TableCell align="right">{numberFormat(row.total_price)}</TableCell>
                                <TableCell align="right" style={{ backgroundColor: '#FFFAF0' }}></TableCell>
                                {row.enable == 1 ?
                                    <>
                                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>{row.pQuantity > 1 ? row.os_stock + " " + row.packaging + " / " + row.os_stock_pc + " pc" : row.os_stock}</TableCell>
                                    </> :
                                    <>
                                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>{row.pQuantity > 1 ? row.stock + " " + row.packaging + " / " + row.stock_pc + " pc" : row.stock}</TableCell>
                                    </>
                                }
                                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>{row.stock_warning}{row.stock_warning_type == 'RETAIL' ? ' pc' : ''}</TableCell>
                                <TableCell align="right" style={{ backgroundColor: '#FFFAF0' }}></TableCell>
                                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>{row.pQuantity > 1 ? (Math.floor(row.last_15_days_sales / row.pQuantity)) + " " + row.packaging + " / " + row.last_15_days_sales + " pc" : row.last_15_days_sales + " " + row.packaging}</TableCell>
                                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>{row.pQuantity > 1 ? (Math.floor(row.last_30_days_sales / row.pQuantity)) + " " + row.packaging + " / " + row.last_30_days_sales + " pc" : row.last_30_days_sales + " " + row.packaging}</TableCell>
                                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>{row.pQuantity > 1 ? (Math.floor(row.last_2_months_sales / row.pQuantity)) + " " + row.packaging + " / " + row.last_2_months_sales + " pc" : row.last_2_months_sales + " " + row.packaging}</TableCell>
                                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>{row.pQuantity > 1 ? (Math.floor(row.last_year_same_month_30_days / row.pQuantity)) + " " + row.packaging + " / " + row.last_year_same_month_30_days + " pc" : row.last_year_same_month_30_days + " " + row.packaging}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow className="po-grand-total-row">
                            <TableCell colSpan={3} style={{ fontWeight: 'bold', }}>Grand Total</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold', }} colSpan={3}>{numberFormat(invoiceTotal)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <section className="po-approval-card">
                <div className="po-card-heading">
                    <div>
                        <span>Approval decision</span>
                        <h2>{orderSupplierTransaction.status == 'COMPLETED' ? 'Review completed' : 'Record your decision'}</h2>
                        <p>{orderSupplierTransaction.status == 'COMPLETED'
                            ? 'This purchase order has already been approved.'
                            : 'Choose an approval status and leave a note for the purchasing team.'}</p>
                    </div>
                    {orderSupplierTransaction.status == 'COMPLETED' && (
                        <div className="po-approved-badge"><CheckCircleIcon /> Approved</div>
                    )}
                </div>

                {submitLoadingAdd && <LinearProgress color="warning" className="po-approval-progress" />}

                <div className="po-approval-form">
                    <TextField
                        fullWidth
                        label="Approver"
                        value={orderSupplierTransaction.approval || localStorage.getItem('name') || ''}
                        disabled
                    />

                    {orderSupplierTransaction.status == 'COMPLETED' ? (
                        <TextField
                            fullWidth
                            label="Status"
                            value="Approved"
                            InputProps={{
                                readOnly: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <CheckCircleIcon color="success" />
                                    </InputAdornment>
                                ),
                            }}
                            disabled
                        />
                    ) : (
                        <FormControl fullWidth>
                            <InputLabel id="approval-status-label">Approval status</InputLabel>
                            <Select
                                labelId="approval-status-label"
                                id="approval-status"
                                name="approval_status"
                                label="Approval status"
                                value={orderSupplierTransaction.approval_status}
                                sx={{
                                    color: statusColor[orderSupplierTransaction.approval_status],
                                    '& .MuiSelect-icon': {
                                        color: statusColor[orderSupplierTransaction.approval_status],
                                    },
                                }}
                                onChange={onChange}
                                displayEmpty
                            >
                                <MenuItem value="PENDING" sx={{ color: "warning.main" }}>Pending</MenuItem>
                                <MenuItem value="APPROVED" sx={{ color: "success.main" }}>Approved</MenuItem>
                                <MenuItem value="REJECTED" sx={{ color: "error.main" }}>Rejected</MenuItem>
                            </Select>
                        </FormControl>
                    )}

                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        label="Approval note"
                        placeholder="Add context for this decision…"
                        name="note"
                        value={orderSupplierTransaction.note}
                        onChange={onChange}
                        disabled={orderSupplierTransaction.status == 'COMPLETED'}
                        className="po-approval-note"
                    />
                </div>

                <div className="po-approval-actions">
                    <p>{orderSupplierTransaction.status == 'COMPLETED'
                        ? 'Continue to the supplier sending step.'
                        : 'Your decision will be saved to this purchase order.'}</p>
                    <Button
                        disabled={isAddDisabled}
                        variant="contained"
                        onClick={orderSupplierTransaction.status == 'COMPLETED' ? nextSubmit : submitApproval}
                        size="large"
                        endIcon={<ArrowForwardRoundedIcon />}
                        className="purchase-order-next"
                    >
                        {orderSupplierTransaction.status == 'COMPLETED' ? 'Continue' : 'Save decision and continue'}
                    </Button>
                </div>
            </section>



            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Update Product
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
                            disabled={modeOfPaymentDTO.balance != 0}
                            variant="contained"
                            type="submit"
                            onClick={updateOrderSupplier}
                            size="large" >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
            </section>
        </main>
    );
}

export default OrderSupplierApproval;



