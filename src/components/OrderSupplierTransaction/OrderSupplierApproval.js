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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
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
        fetchApprovalPOBranch(id);
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
    const [branchOrderList, setBranchOrderList] = useState({ data: [] });

    const [paymentTermList, setPaymentTermList] = useState([]);
    const [paymentTypePoList, setPaymentTypePoList] = useState([]);
    const [errorStock, setErrorStock] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [productTableTab, setProductTableTab] = useState(0);
    const [customDateRanges, setCustomDateRanges] = useState([
        { label: '', date_from: '', date_to: '' }
    ]);
    const [customRangeResults, setCustomRangeResults] = useState({ data: [], ranges: [] });
    const [customBranchRangeResults, setCustomBranchRangeResults] = useState({ data: [], ranges: [] });
    const [customRangeLoading, setCustomRangeLoading] = useState(false);
    const [customRangeError, setCustomRangeError] = useState('');

    const [orderSupplierTransaction, setOrderSupplierTransaction] = useState({
        id: 0,
        supplier_name: '',
        supplier_id: 0,
        withTax: 0,
        status: '',
        total_transaction_price: 0,
        requestor: '',
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


    const fetchApprovalPO = async (id) => {
        await OrderSupplierService.fetchApprovalPO(id)
            .then(response => {
                setOrderList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchApprovalPOBranch = async (id) => {
        await OrderSupplierService.fetchApprovalPOBranch(id)
            .then(response => {
                setBranchOrderList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const updateCustomDateRange = (index, field, value) => {
        setCustomDateRanges((ranges) => ranges.map((range, rangeIndex) =>
            rangeIndex === index ? { ...range, [field]: value } : range
        ));
        setCustomRangeError('');
    }

    const addCustomDateRange = () => {
        if (customDateRanges.length < 12) {
            setCustomDateRanges([...customDateRanges, { label: '', date_from: '', date_to: '' }]);
        }
    }

    const removeCustomDateRange = (index) => {
        if (customDateRanges.length > 1) {
            setCustomDateRanges(customDateRanges.filter((range, rangeIndex) => rangeIndex !== index));
        }
    }

    const fetchCustomDateRanges = () => {
        const invalidRange = customDateRanges.find((range) =>
            !range.date_from || !range.date_to || range.date_to < range.date_from
        );

        if (invalidRange) {
            setCustomRangeError('Enter a valid From and To date for every range. The To date cannot be earlier than From.');
            return;
        }

        setCustomRangeLoading(true);
        setCustomRangeError('');
        Promise.all([
            OrderSupplierService.fetchApprovalPOByDateRanges(id, { date_ranges: customDateRanges }),
            OrderSupplierService.fetchApprovalPOBranchByDateRanges(id, { date_ranges: customDateRanges })
        ])
            .then(([customerResponse, branchResponse]) => {
                setCustomRangeResults(customerResponse.data);
                setCustomBranchRangeResults(branchResponse.data);
                setCustomRangeLoading(false);
            })
            .catch((error) => {
                const validationErrors = error.response?.data?.errors;
                const firstValidationError = validationErrors
                    ? Object.values(validationErrors).flat()[0]
                    : null;
                setCustomRangeError(firstValidationError || error.response?.data?.message || 'Unable to load sales for these date ranges.');
                setCustomRangeLoading(false);
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

    const loginAccountName = (localStorage.getItem('name') || '').trim();
    const isRequestorApprover = Boolean(
        loginAccountName &&
        orderSupplierTransaction.requestor &&
        loginAccountName.toLowerCase() === orderSupplierTransaction.requestor.trim().toLowerCase()
    );

    const submitApproval = () => {
        if (isRequestorApprover && orderSupplierTransaction.approval_status == 'APPROVED') {
            window.scrollTo(0, 0);
            setValidator({
                severity: 'error',
                message: 'The account that requested this purchase order cannot also approve it.',
                isShow: true,
            });
            return;
        }

        if (!orderSupplierTransaction.note || !orderSupplierTransaction.note.trim()) {
            setValidator({
                severity: 'error',
                message: 'An approval note is required before saving the decision.',
                isShow: true,
            });
            return;
        }

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

    const findMatchingProduct = (list, row) =>
        list?.data?.find((item) => item.product_id === row.product_id) || {};

    const formatDemandQuantity = (row, value) => {
        const quantity = Number(value) || 0;
        return row.pQuantity > 1
            ? Math.floor(quantity / row.pQuantity) + " " + row.packaging + " / " + quantity + " pc"
            : quantity + " " + row.packaging;
    }

    const demandComparison = (row, branchRow, field) => {
        const customerDemand = Number(row[field]) || 0;
        const branchDemand = Number(branchRow[field]) || 0;
        return (
            <div className="po-demand-comparison">
                <span><small>Customer</small>{formatDemandQuantity(row, customerDemand)}</span>
                <span><small>Branch</small>{formatDemandQuantity(row, branchDemand)}</span>
                <strong><small>Combined</small>{formatDemandQuantity(row, customerDemand + branchDemand)}</strong>
            </div>
        );
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
            <Paper className="po-approval-tabs" elevation={0}>
                <Tabs
                    value={productTableTab}
                    onChange={(event, value) => setProductTableTab(value)}
                    aria-label="Purchase order product views"
                >
                    <Tab label="All Details" id="product-tab-0" aria-controls="product-tabpanel-0" />
                    <Tab label="Stock & Sold" id="product-tab-1" aria-controls="product-tabpanel-1" />
                    <Tab label="Custom Date Ranges" id="product-tab-2" aria-controls="product-tabpanel-2" />
                </Tabs>
            </Paper>
            {productTableTab === 1 && (
            <TableContainer
                component={Paper}
                className="po-items-table po-approval-table po-approval-compact-table"
                role="tabpanel"
                id="product-tabpanel-1"
                aria-labelledby="product-tab-1"
            >
                <Table aria-label="Product stock and sold summary">
                    <TableHead>
                        <TableRow>
                            <TableCell rowSpan={2}>Product Name</TableCell>
                            <TableCell rowSpan={2} align="right">Qty</TableCell>
                            <TableCell colSpan={2} align="center">Stock</TableCell>
                            <TableCell colSpan={4} align="center">Sold</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="right">Current</TableCell>
                            <TableCell align="right">Warning</TableCell>
                            <TableCell align="right">
                                <Tooltip title={orderList.last15Days + " - " + orderSupplierTransaction.created_at}>
                                    <span className="po-sales-period">15 days<small>{orderList.last15Days} – {orderSupplierTransaction.created_at}</small></span>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip title={orderList.last30Days + " - " + orderSupplierTransaction.created_at}>
                                    <span className="po-sales-period">30 days<small>{orderList.last30Days} – {orderSupplierTransaction.created_at}</small></span>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip title={orderList.twoMonthsAgoStart + " - " + orderList.twoMonthsAgoEnd}>
                                    <span className="po-sales-period">2 months<small>{orderList.twoMonthsAgoStart} – {orderList.twoMonthsAgoEnd}</small></span>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip title={orderList.startLastYear + " - " + orderList.endLastYear}>
                                    <span className="po-sales-period">Last year<small>{orderList.startLastYear} – {orderList.endLastYear}</small></span>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderList.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8}>
                                    <div className="po-empty-state">
                                        <Inventory2OutlinedIcon />
                                        <strong>No products found</strong>
                                        <span>Add products before reviewing this purchase order.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                        {orderList.data.map((row) => {
                            const branchRow = findMatchingProduct(branchOrderList, row);
                            return (
                            <TableRow key={row.id} hover>
                                <TableCell><strong>{row.product_name}</strong></TableCell>
                                <TableCell align="right">{row.quantity}</TableCell>
                                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                                    {row.enable == 1
                                        ? (row.pQuantity > 1 ? row.os_stock + " " + row.packaging + " / " + row.os_stock_pc + " pc" : row.os_stock)
                                        : (row.pQuantity > 1 ? row.stock + " " + row.packaging + " / " + row.stock_pc + " pc" : row.stock)}
                                </TableCell>
                                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>{row.stock_warning}{row.stock_warning_type == 'RETAIL' ? ' pc' : ''}</TableCell>
                                <TableCell>{demandComparison(row, branchRow, 'last_15_days_sales')}</TableCell>
                                <TableCell>{demandComparison(row, branchRow, 'last_30_days_sales')}</TableCell>
                                <TableCell>{demandComparison(row, branchRow, 'last_2_months_sales')}</TableCell>
                                <TableCell>{demandComparison(row, branchRow, 'last_year_same_month_30_days')}</TableCell>
                            </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            )}
            {productTableTab === 0 && (
            <TableContainer
                component={Paper}
                className="po-items-table po-approval-table"
                role="tabpanel"
                id="product-tabpanel-0"
                aria-labelledby="product-tab-0"
            >
                <Table sx={{ minWidth: 760 }} aria-label="Purchase order details">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" colSpan={6} ><h5 style={{ fontWeight: 'bold' }}>Order Details</h5></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}><h6 style={{ fontWeight: 'bold' }}>Product</h6></TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}><h6 style={{ fontWeight: 'bold' }}>Qty</h6></TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}><h6 style={{ fontWeight: 'bold' }}>Price</h6></TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}><h6 style={{ fontWeight: 'bold' }}>Unit</h6></TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}><h6 style={{ fontWeight: 'bold' }}>Expiration</h6></TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}><h6 style={{ fontWeight: 'bold' }} >Sum</h6></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderList.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6}>
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
                            </TableRow>
                        ))}
                        <TableRow className="po-grand-total-row">
                            <TableCell colSpan={3} style={{ fontWeight: 'bold', }}>Grand Total</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold', }} colSpan={3}>{numberFormat(invoiceTotal)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            )}

            {productTableTab === 2 && (
            <section
                className="po-custom-ranges"
                role="tabpanel"
                id="product-tabpanel-2"
                aria-labelledby="product-tab-2"
            >
                <Paper className="po-custom-range-controls" elevation={0}>
                    <div className="po-custom-range-heading">
                        <div>
                            <h3>Compare custom sales dates</h3>
                            <p>Add up to 12 date ranges. Each range becomes a Sold column in the table.</p>
                        </div>
                        <Button
                            variant="outlined"
                            onClick={addCustomDateRange}
                            disabled={customDateRanges.length >= 12}
                        >
                            Add date range
                        </Button>
                    </div>

                    <div className="po-custom-range-list">
                        {customDateRanges.map((range, index) => (
                            <div className="po-custom-range-row" key={index}>
                                <TextField
                                    size="small"
                                    label="Label (optional)"
                                    placeholder={`Range ${index + 1}`}
                                    value={range.label}
                                    inputProps={{ maxLength: 50 }}
                                    onChange={(event) => updateCustomDateRange(index, 'label', event.target.value)}
                                />
                                <TextField
                                    size="small"
                                    label="From"
                                    type="date"
                                    value={range.date_from}
                                    onChange={(event) => updateCustomDateRange(index, 'date_from', event.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    size="small"
                                    label="To"
                                    type="date"
                                    value={range.date_to}
                                    inputProps={{ min: range.date_from || undefined }}
                                    onChange={(event) => updateCustomDateRange(index, 'date_to', event.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <Button
                                    color="error"
                                    onClick={() => removeCustomDateRange(index)}
                                    disabled={customDateRanges.length === 1}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>

                    {customRangeError && <Alert severity="error">{customRangeError}</Alert>}

                    <div className="po-custom-range-actions">
                        <span>{customDateRanges.length} / 12 ranges</span>
                        <Button
                            variant="contained"
                            onClick={fetchCustomDateRanges}
                            disabled={customRangeLoading}
                        >
                            {customRangeLoading ? 'Loading sales…' : 'View sales'}
                        </Button>
                    </div>
                    {customRangeLoading && <LinearProgress color="warning" />}
                </Paper>

                {customRangeResults.ranges.length > 0 && (
                <TableContainer component={Paper} className="po-items-table po-custom-range-table">
                    <Table aria-label="Sales by custom date ranges">
                        <TableHead>
                            <TableRow>
                                <TableCell rowSpan={2}>Product Name</TableCell>
                                <TableCell rowSpan={2} align="center">Qty</TableCell>
                                <TableCell colSpan={2} align="center">Stock</TableCell>
                                <TableCell colSpan={customRangeResults.ranges.length} align="center">Sold</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center">Current</TableCell>
                                <TableCell align="center">Warning</TableCell>
                                {customRangeResults.ranges.map((range) => (
                                    <TableCell align="center" key={range.key}>
                                        <strong>{range.label || range.key.replace('_', ' ')}</strong>
                                        <span>{range.date_from} to {range.date_to}</span>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customRangeResults.data.map((row) => {
                                const branchRow = findMatchingProduct(customBranchRangeResults, row);
                                return (
                                <TableRow key={row.id} hover>
                                    <TableCell><strong>{row.product_name}</strong></TableCell>
                                    <TableCell align="center">{row.quantity}</TableCell>
                                    <TableCell align="center">
                                        {row.pQuantity > 1
                                            ? row.stock + " " + row.packaging + " / " + row.stock_pc + " pc"
                                            : row.stock}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.stock_warning}{row.stock_warning_type == 'RETAIL' ? ' pc' : ''}
                                    </TableCell>
                                    {customRangeResults.ranges.map((range) => {
                                        const customerRange = row.sales_ranges?.find((item) => item.key === range.key);
                                        const branchRange = branchRow.sales_ranges?.find((item) => item.key === range.key);
                                        const customerDemand = Number(customerRange?.sold) || 0;
                                        const branchDemand = Number(branchRange?.sold) || 0;
                                        return (
                                            <TableCell align="center" key={range.key}>
                                                <div className="po-demand-comparison">
                                                    <span><small>Customer</small>{formatDemandQuantity(row, customerDemand)}</span>
                                                    <span><small>Branch</small>{formatDemandQuantity(row, branchDemand)}</span>
                                                    <strong><small>Combined</small>{formatDemandQuantity(row, customerDemand + branchDemand)}</strong>
                                                </div>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                )}
            </section>
            )}

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

                {isRequestorApprover && orderSupplierTransaction.status != 'COMPLETED' && (
                    <Alert severity="warning" className="po-self-approval-note">
                        <strong>Self-approval is not allowed.</strong> This purchase order was requested by {orderSupplierTransaction.requestor}. You may leave it Pending or Reject it with a note, but a different authorized account must approve it.
                    </Alert>
                )}

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
                                <MenuItem
                                    value="APPROVED"
                                    sx={{ color: "success.main" }}
                                    disabled={isRequestorApprover}
                                >
                                    Approved{isRequestorApprover ? ' — different approver required' : ''}
                                </MenuItem>
                                <MenuItem value="REJECTED" sx={{ color: "error.main" }}>Rejected</MenuItem>
                            </Select>
                        </FormControl>
                    )}

                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        label="Approval note"
                        required
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
                        disabled={isAddDisabled || (isRequestorApprover && orderSupplierTransaction.approval_status == 'APPROVED')}
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



