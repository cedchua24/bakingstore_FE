import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import ShopOrderService from "../OtherService/ShopOrderService";
import PaymentTypePoService from "../OtherService/PaymentTypePoService";
import PaymentTermService from "../OtherService/PaymentTermService";
import ModeOfPaymentService from "../OtherService/ModeOfPaymentService";

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

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography'


import CircularProgress from '@mui/material/CircularProgress';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import UpdateIcon from '@mui/icons-material/Update';
import LinearProgress from '@mui/material/LinearProgress';
import moment from "moment";
import StorefrontIcon from '@mui/icons-material/Storefront';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const FinalizeShopOrder = () => {
    const CUSTOMER_PAYMENT_ACCOUNT_FILTER = {
        is_supplier: 0,
        is_customer: 1,
        status: 0
    };


    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPaymentTerms();
        fetchShopOrderTransaction(id);
        fetchShopOrderDTO(id);
        fetchPaymentTypeByShopTransactionIdV2(id);

    }, []);

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitOpenModal, setSubmitOpenModal] = React.useState(false);
    const [errorStock, setErrorStock] = useState(false);

    const handleSubmitCloseModal = () => {
        setSubmitOpenModal(false);
    };

    const [paymentTermList, setPaymentTermList] = useState([]);
    const [paymentAccountList, setPaymentAccountList] = useState([]);
    const [selectedPaymentTerm, setSelectedPaymentTerm] = useState(null);
    const [selectedPaymentAccount, setSelectedPaymentAccount] = useState(null);

    const hasDisplayValue = (value) => {
        const normalizedValue = String(value ?? '').trim();
        return normalizedValue !== '' && normalizedValue !== '0';
    };

    const sortPaymentAccounts = (accounts) => [...accounts].sort((firstAccount, secondAccount) => {
        const firstLabel = [firstAccount.bank_name, firstAccount.account_name, firstAccount.account_number]
            .filter(hasDisplayValue)
            .join(' ');
        const secondLabel = [secondAccount.bank_name, secondAccount.account_name, secondAccount.account_number]
            .filter(hasDisplayValue)
            .join(' ');

        return firstLabel.localeCompare(secondLabel, undefined, { sensitivity: 'base', numeric: true });
    });

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

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        id: 0,
        shop_id: 0,
        shop_type_id: 0,
        shop_order_transaction_total_quantity: 0,
        shop_order_transaction_total_price: 0,
        requestor: 0,
        checker: 0,
        requestor_name: '',
        status: 0,
        checker_name: '',
        date: '',
        created_at: '',
        updated_at: ''
    });

    const steps = [
        'Created Transaction Details',
        'Add Product Orders',
        'Finalize Orders',
    ];

    const TAX_RATE = 0.12;

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

    const [modeOfPayment, setModeOfPayment] = useState({
        id: 0,
        payment_type_id: '',
        shop_order_transaction_id: 0,
        amount: 0,
        created_at: moment().format("YYYY-MM-DD"),
        updated_at: ''
    });
    const [amount, setAmount] = useState(0);

    const [modeOfPaymentModal, setModeOfPaymentModal] = useState({
        id: 0,
        payment_type_id: '',
        payment_type_po_id: '',
        payment_term_id: 0,
        shop_order_transaction_id: 0,
        amount: 0,
        created_at: '',
        updated_at: ''
    });
    const [modalPaymentAccountList, setModalPaymentAccountList] = useState([]);
    const [selectedModalPaymentTerm, setSelectedModalPaymentTerm] = useState(null);
    const [selectedModalPaymentAccount, setSelectedModalPaymentAccount] = useState(null);



    const [orderShopDTO, setOrderShopDTO] = useState({
        shopOrderTransaction: {},
        shopOrderList: []
    });

    const [modeOfPaymentDTO, setModeOfPaymentDTO] = useState({
        data: [],
        code: ''
    });

    const onChangeInput = (e) => {
        setModeOfPayment({ ...modeOfPayment, [e.target.name]: e.target.value });
    }


    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });


    const [message, setMessage] = useState(false);

    const [open, setOpen] = React.useState(false);

    const [deleteOpenModal, setDeleteOpenModal] = React.useState(false);
    const [deleteId, setDeleteId] = useState(0);


    const fetchShopOrderTransaction = async (id) => {
        console.log('test')
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

    const fetchPaymentTypeByShopTransactionIdV2 = async (id) => {
        await ModeOfPaymentService.fetchPaymentTypeByShopTransactionIdV2(id)
            .then(response => {
                const paymentSummary = response.data || {};
                setModeOfPaymentDTO({
                    ...paymentSummary,
                    data: Array.isArray(paymentSummary.data) ? paymentSummary.data : [],
                    balance: Number(paymentSummary.balance || 0),
                    total_payment: Number(paymentSummary.total_payment || 0),
                });
                console.log('balance', response.data)
                setModeOfPayment((currentPayment) => ({
                    ...currentPayment,
                    amount: Number(paymentSummary.balance || 0),
                }));

            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const updateShopOrderTransactionStatus = async (event) => {
        event.preventDefault();
        setSubmitLoading(true);
        setShopOrderTransaction({
            ...shopOrderTransaction,
            status: 1,
        });

        ShopOrderTransactionService.updateShopOrderTransactionStatusV2(shopOrderTransaction.id, shopOrderTransaction)
            .then(response => {
                setMessage(true);
                setSubmitLoading(false);
                if (shopOrderTransaction.shop_type_id == 3) {
                    navigate('/shopOrderTransaction/customerOrderTransactionList/');
                } else {
                    navigate('/shopOrderTransaction/shorOrderTransactionList/');
                }

            })
            .catch(e => {
                console.log(e);
            });
    }

    const savePaymentType = () => {
        const result = modeOfPaymentDTO.data.find((payment) =>
            Number(payment.payment_type_po_id ?? payment.payment_type_id) === Number(modeOfPayment.payment_type_id)
        );
        console.log('index:', result);
        if (!selectedPaymentTerm) {
            setValidator({
                severity: 'error',
                message: 'Please choose a payment term!',
                isShow: true,
            });
        } else if (!selectedPaymentAccount || modeOfPayment.payment_type_id == '') {
            setValidator({
                severity: 'error',
                message: 'Please choose an account!',
                isShow: true,
            });
        } else {
            // if (result == undefined) { 
            setSubmitLoadingAdd(true);
            ModeOfPaymentService.sanctum().then(response => {
                ModeOfPaymentService.create(modeOfPayment)
                    .then(response => {
                        fetchPaymentTypeByShopTransactionIdV2(id);
                        setSubmitLoadingAdd(false);
                        setValidator({
                            severity: 'success',
                            message: 'Sucessfully added!',
                            isShow: true,
                        });

                        if (response.data.balance == 0) {
                            if (shopOrderTransaction.shop_type_id == 3) {
                                navigate(`/shopOrderTransaction/receiptOrder/${shopOrderTransaction.id}/`);
                            } else {
                                navigate('/shopOrderTransaction/shorOrderTransactionList/');
                            }
                        }
                    })
                    .catch(e => {
                        setSubmitLoadingAdd(false);
                        console.log(e);
                    });
            });
            // }
            //  else {
            //     setValidator({
            //         severity: 'error',
            //         message: 'Please Select other Payment method!',
            //         isShow: true,
            //     });

            // }
        }
    }

    const openSubmit = () => {
        // setShopOrderTransaction({
        //     ...shopOrderTransaction,
        //     status: 1,
        // });
        // setSubmitOpenModal(true);
        if (shopOrderTransaction.shop_type_id == 3) {
            // navigate(`/shopOrderTransaction/receiptOrder/${shopOrderTransaction.id}/`);
            window.open(`/shopOrderTransaction/receiptOrder/${id}`, "_blank");
        } else {
            navigate('/shopOrderTransaction/shorOrderTransactionList/');
        }
    }

    const fetchPaymentTerms = () => {
        PaymentTermService.getAll()
            .then(response => {
                const excludedTerms = ['cheque', 'credit card'];
                const availableTerms = Array.isArray(response.data)
                    ? response.data.filter((term) => {
                        const termName = String(term.payment_term || '').trim().toLowerCase();
                        return !excludedTerms.includes(termName);
                    })
                    : [];

                setPaymentTermList(availableTerms);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const handlePaymentTermChange = (e, value) => {
        setSelectedPaymentTerm(value);
        setSelectedPaymentAccount(null);
        setPaymentAccountList([]);
        setModeOfPayment((currentPayment) => ({
            ...currentPayment,
            payment_type_id: ''
        }));

        if (value) {
            PaymentTypePoService.findByCategoryV2(value.id, CUSTOMER_PAYMENT_ACCOUNT_FILTER)
                .then(response => {
                    const accounts = Array.isArray(response.data) ? sortPaymentAccounts(response.data) : [];
                    setPaymentAccountList(accounts);
                })
                .catch(e => {
                    console.log("error", e);
                });
        }
    }

    const handlePaymentAccountChange = (e, value) => {
        setSelectedPaymentAccount(value);
        if (!value) {
            setModeOfPayment((currentPayment) => ({
                ...currentPayment,
                shop_order_transaction_id: shopOrderTransaction.id,
                payment_type_id: '',
            }));
            return;
        }
        setModeOfPayment((currentPayment) => ({
            ...currentPayment,
            shop_order_transaction_id: shopOrderTransaction.id,
            payment_type_id: value.id,
        }));
    }

    const handleModalPaymentTermChange = (e, value) => {
        setSelectedModalPaymentTerm(value);
        setSelectedModalPaymentAccount(null);
        setModalPaymentAccountList([]);
        setModeOfPaymentModal((currentPayment) => ({
            ...currentPayment,
            payment_term_id: value ? value.id : 0,
            payment_type_id: '',
            payment_type_po_id: '',
        }));

        if (value) {
            PaymentTypePoService.findByCategoryV2(value.id, CUSTOMER_PAYMENT_ACCOUNT_FILTER)
                .then(response => {
                    const accounts = Array.isArray(response.data) ? sortPaymentAccounts(response.data) : [];
                    setModalPaymentAccountList(accounts);
                })
                .catch(error => console.log('error', error));
        }
    }

    const handleModalPaymentAccountChange = (e, value) => {
        setSelectedModalPaymentAccount(value);
        setModeOfPaymentModal((currentPayment) => ({
            ...currentPayment,
            payment_type_id: value ? value.id : '',
            payment_type_po_id: value ? value.id : '',
        }));
    }



    const onChangeAmount = (e) => {
        console.log(e.target.value)
        setModeOfPayment({ ...modeOfPayment, amount: e.target.value });
        if (modeOfPaymentDTO.total_payment != 0) {
            if (Number(e.target.value) > modeOfPaymentDTO.balance) {
                setErrorStock(true);
            } else {
                setErrorStock(false);
            }
        }
    }



    const handleOpen = (id, e) => {
        console.log('e', id);
        fetchModeOfPayment(id);
        setOpen(true);
    }

    const fetchModeOfPayment = async (id) => {
        await ModeOfPaymentService.get(id)
            .then(response => {
                const summaryPayment = modeOfPaymentDTO.data.find((payment) => Number(payment.id) === Number(id)) || {};
                const payment = { ...response.data, ...summaryPayment };
                const paymentTermId = Number(payment.payment_term_id || 0);
                const paymentAccountId = Number(payment.payment_type_po_id ?? payment.payment_type_id ?? 0);

                setModeOfPaymentModal({
                    ...payment,
                    payment_term_id: paymentTermId,
                    payment_type_id: paymentAccountId || '',
                    payment_type_po_id: paymentAccountId || '',
                });
                setAmount(Number(payment.amount || 0));
                setSelectedModalPaymentTerm(
                    paymentTermList.find((term) => Number(term.id) === paymentTermId) || null
                );

                if (paymentTermId) {
                    PaymentTypePoService.findByCategoryV2(paymentTermId, CUSTOMER_PAYMENT_ACCOUNT_FILTER)
                        .then(accountResponse => {
                            const accounts = Array.isArray(accountResponse.data)
                                ? sortPaymentAccounts(accountResponse.data)
                                : [];
                            setModalPaymentAccountList(accounts);
                            setSelectedModalPaymentAccount(
                                accounts.find((account) => Number(account.id) === paymentAccountId) || null
                            );
                        })
                        .catch(error => console.log('error', error));
                } else {
                    setModalPaymentAccountList([]);
                    setSelectedModalPaymentAccount(null);
                }
                console.log('ey', response.data)
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const handleClose = () => setOpen(false);

    const openDelete = (id) => {
        setDeleteId(id);
        setDeleteOpenModal(true);
    }


    const handleDeleteCloseModal = () => {
        setDeleteOpenModal(false);
    };

    const deleteOrderTransaction = (deleteId, e) => {
        setSubmitLoading(true);
        console.log("test", modeOfPaymentModal);
        ModeOfPaymentService.delete(deleteId, modeOfPaymentModal)
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
                fetchPaymentTypeByShopTransactionIdV2(id);
                // window.location.reload();
            })
            .catch(e => {
                console.log('error', e);
            });
    }

    const updateOrderSupplier = () => {
        if (!selectedModalPaymentTerm || !selectedModalPaymentAccount) {
            setValidator({
                severity: 'error',
                message: 'Please choose a payment term and account.',
                isShow: true,
            });
            return;
        }

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
            ModeOfPaymentService.update(modeOfPaymentModal.id, modeOfPaymentModal)
                .then(response => {
                    console.log(response.data);
                    if (response.data.code == 200) {
                        setSubmitLoading(false);
                        setOpen(false);
                        window.scrollTo(0, 0);
                        setValidator({
                            severity: 'success',
                            message: 'Successfully updated!',
                            isShow: true,
                        });
                        fetchPaymentTypeByShopTransactionIdV2(id);
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

    const onChangeInputPriceModal = (e) => {
        e.persist();
        setModeOfPaymentModal({
            ...modeOfPaymentModal,
            amount: e.target.value
        });

        // if (e.target.value > modeOfPaymentDTO.balance) {
        //     setSubmitLoading(false);
        //     setOpen(false);
        //     window.scrollTo(0, 0);
        //     setValidator({
        //         severity: 'error',
        //         message: 'Must Less than to Balance',
        //         isShow: true,
        //     });

        // }
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: 'calc(100% - 32px)', sm: 640, md: 760 },
        maxWidth: 'calc(100vw - 32px)',
        maxHeight: '90vh',
        overflowY: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: { xs: 2.5, sm: 3 },
        '& .MuiTextField-root': { width: '100%' },
    };

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');

    const currentOrderType = shopOrderTransaction.checker !== 0 ? 'Shop Branch Order' : 'Online Order';
    const isOnlineOrder = shopOrderTransaction.checker === 0;
    const hasBalance = Number(modeOfPaymentDTO.balance || 0) !== 0;
    const canFinalize = !isOnlineOrder || !hasBalance;

    const itemDescription = (row) => row.business_type === 'WHOLESALE'
        ? `${row.packaging || ''} (${row.weight / row.quantity}${row.variation}${row.quantity === 1 ? '' : ' x ' + row.quantity})`
        : `(${Number.isInteger(row.weight / row.quantity) ? (row.weight / row.quantity) : (row.weight / row.quantity).toPrecision(2)}${row.variation})`;

    const discountText = (row) => row.discount === 'PERCENTAGE'
        ? `${row.discount_percentage}%, -${row.discount_amount}`
        : row.discount === 'AMOUNT'
            ? `-${row.discount_amount}`
            : '';

    const paymentAccountLabel = (paymentAccount) => paymentAccount
        ? [paymentAccount.bank_name, paymentAccount.account_name, paymentAccount.account_number]
            .filter(hasDisplayValue)
            .join(' · ')
        : '';

    const paymentHistoryLabel = (payment) => {
        const accountLabel = paymentAccountLabel(payment);
        if (accountLabel) {
            return accountLabel;
        }

        return [payment.payment_type, payment.payment_type_description].filter(Boolean).join(' - ');
    };

    const transactionVipCustomers = Array.isArray(shopOrderTransaction.vip_customers)
        ? shopOrderTransaction.vip_customers
        : [];

    const renderTransactionVipCustomers = () => {
        if (transactionVipCustomers.length === 0) {
            return null;
        }

        return (
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 0.75 }}>
                {transactionVipCustomers.map((vipCustomer) => (
                    <Chip
                        key={`${vipCustomer.vip_customer_transaction_id}-${vipCustomer.vip_customer_id}`}
                        size="small"
                        variant="outlined"
                        label={vipCustomer.vip_name || 'VIP'}
                        icon={
                            <Box
                                component="span"
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    bgcolor: vipCustomer.vip_color || '#9ca3af',
                                    border: '1px solid #cbd5e1',
                                    ml: '6px !important'
                                }}
                            />
                        }
                    />
                ))}
            </Stack>
        );
    };

    const Div = ({ children }) => (
        <Box sx={{ bgcolor: 'background.paper', fontSize: '2rem', p: 1, textAlign: 'center' }}>
            {children}
        </Box>
    );

    if (Date.now() < 0) {
        return (
            <div>

                {shopOrderTransaction.checker != 0 ? (
                    <Div>{"Shop Branch Order"}</Div>)
                    :
                    (<Div>{"Online Order"}</Div>)
                }

                {message &&
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert variant="filled" severity="success">
                            Successfully Addded!
                        </Alert>
                    </Stack>

                }

                <Stack sx={{ width: '100%' }} spacing={2}>
                    {validator.isShow &&
                        <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                    }
                </Stack>
                <br></br>
                <br></br>
                <Box
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Stepper activeStep={2} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>


                            </Step>
                        ))}
                    </Stepper>
                    <br></br>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                            <TableBody>
                                <TableRow >
                                    <TableCell style={{ fontWeight: 'bold' }}>Shop Name:</TableCell>
                                    <TableCell align="right">{shopOrderTransaction.shop_name}</TableCell>

                                    {shopOrderTransaction.checker != 0 ?
                                        <>
                                            <TableCell align="right" >Checker</TableCell>
                                            <TableCell align="right">{shopOrderTransaction.checker_name}</TableCell>
                                            <TableCell style={{ fontWeight: 'bold' }}>Requestor:</TableCell>
                                            <TableCell align="right">{shopOrderTransaction.requestor_name}</TableCell></>
                                        :
                                        <>    <TableCell style={{ fontWeight: 'bold' }}>Customer:</TableCell>
                                            <TableCell align="right">{shopOrderTransaction.requestor_name}</TableCell></>
                                    }

                                    <TableCell style={{ fontWeight: 'bold' }}>  Date:</TableCell>
                                    <TableCell align="right">{shopOrderTransaction.created_at}</TableCell>
                                    {shopOrderTransaction.checker == 0 &&
                                        <>
                                            <TableCell style={{ fontWeight: 'bold' }}>  Sales Representative:</TableCell>
                                            <TableCell align="right">{shopOrderTransaction.sr_name}</TableCell>
                                        </>
                                    }

                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {modeOfPaymentDTO.balance != 0 && shopOrderTransaction.checker == 0 &&


                        <Box
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '25ch' },
                            }}
                            noValidate
                            autoComplete="off"
                        // onSubmit={saveOrderSupplier}
                        >
                            <FormControl variant="standard" >
                                <Autocomplete
                                    // {...defaultProps}
                                    options={paymentAccountList}
                                    className="mb-3"
                                    id="disable-close-on-select"
                                    onChange={handlePaymentAccountChange}
                                    getOptionLabel={paymentAccountLabel}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Choose Payment Type" variant="standard" />
                                    )}
                                />
                            </FormControl>
                            {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="text" value={modeOfPayment.amount} name="amount" placeholder="Enter Amount" onChange={onChangeAmount} />

                    </Form.Group> */}
                            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                                <InputLabel htmlFor="standard-adornment-amount">Enter Amount</InputLabel>
                                <Input
                                    type='number'
                                    id="filled-required"
                                    label="amount"
                                    variant="filled"
                                    name='amount'
                                    errorText='{this.state.password_error_text}'
                                    max={modeOfPayment.amount}
                                    // value={product.stock}
                                    onChange={onChangeAmount}
                                    value={modeOfPayment.amount}
                                    // helperText="Incorrect entry."
                                    error={errorStock}
                                />
                            </FormControl>



                            <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                                <Form.Label>Date</Form.Label>
                                <Form.Control type="date" value={modeOfPayment.created_at} name="created_at" onChange={onChangeInput} />
                            </Form.Group>

                            <Button
                                variant="contained"
                                disabled={errorStock}
                                onClick={savePaymentType}
                                size="large" >
                                Add
                            </Button>
                            <br></br>
                            <br></br>
                            {submitLoadingAdd &&
                                <LinearProgress color="warning" />
                            }
                        </Box>
                    }
                </Box>

                <br></br>
                {shopOrderTransaction.checker == 0 &&
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold' }}>Account</TableCell>
                                    <TableCell align="right" style={{ fontWeight: 'bold' }}>Amount</TableCell>
                                    <TableCell align="right" style={{ fontWeight: 'bold' }}>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {modeOfPaymentDTO.data.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{paymentHistoryLabel(row)}</TableCell>
                                        <TableCell align="right">{row.amount}</TableCell>
                                        <TableCell align="right">{shopOrderTransaction.date != row.created_at ? <p style={{ color: 'orange', }}>{row.created_at}</p> : row.created_at}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Update">
                                                <IconButton>
                                                    <UpdateIcon color="primary" onClick={(e) => handleOpen(row.id, e)} />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Delete">
                                                <IconButton>
                                                    <DeleteIcon color="error" onClick={(e) => openDelete()} />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>

                                        <Dialog
                                            open={deleteOpenModal}
                                            onClose={handleDeleteCloseModal}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >

                                            <DialogTitle id="alert-dialog-title">
                                                {"Are you sure you want to Delete?"}
                                            </DialogTitle>
                                            {submitLoading &&
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <CircularProgress />
                                                </div>
                                            }
                                            <DialogActions>
                                                <Button onClick={handleDeleteCloseModal}>Cancel</Button>
                                                <Button onClick={(e) => deleteOrderTransaction(row.id, e)} autoFocus>
                                                    Agree
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </TableRow>

                                ))}
                                <TableRow>
                                    <TableCell colSpan={1} style={{ fontWeight: 'bold', }}>Grand Total</TableCell>
                                    <TableCell align="right" style={{ fontWeight: 'bold', }}>₱ {modeOfPaymentDTO.total_payment}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
                <br></br>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }}>Product</TableCell>
                                <TableCell align="right" style={{ fontWeight: 'bold' }}>Qty.</TableCell>
                                <TableCell align="right" style={{ fontWeight: 'bold' }}>Unit</TableCell>
                                <TableCell align="right" style={{ fontWeight: 'bold' }}>Price</TableCell>
                                <TableCell align="right" style={{ fontWeight: 'bold' }}>Discount</TableCell>
                                <TableCell align="right" style={{ fontWeight: 'bold' }}>Amount</TableCell>
                                <TableCell align="right" style={{ fontWeight: 'bold' }}>Total Cost</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderShopDTO.shopOrderList.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.product_name}{
                                        row.business_type === 'WHOLESALE' ? <></>
                                            : < >({Number.isInteger(row.weight / row.quantity) ? (row.weight / row.quantity) : (row.weight / row.quantity).toPrecision(2)}{row.variation}) </>
                                    }</TableCell>
                                    <TableCell align="right">{row.shop_order_quantity}</TableCell>
                                    <TableCell align="right">{row.unit}</TableCell>
                                    <TableCell align="right">{numberFormat(row.fixed_price)}</TableCell>
                                    <TableCell align="right">{row.discount == 'PERCENTAGE' ? row.discount_percentage + '%' + ', ' + '-' + row.discount_amount : row.discount == 'AMOUNT' ? '-' + row.discount_amount : ''}</TableCell>
                                    <TableCell align="right">{numberFormat(row.shop_order_price)}</TableCell>
                                    <TableCell align="right">{numberFormat(row.shop_order_total_price)}</TableCell>
                                </TableRow>
                            ))}

                            <TableRow>
                                <TableCell rowSpan={3} />
                                {/* <TableCell colSpan={5}>Subtotal</TableCell> */}
                                {/* <TableCell align="right">{invoiceSubtotal}</TableCell> */}
                            </TableRow>
                            {/* <TableRow>
                            <TableCell>Tax</TableCell>
                            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
                            <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
                        </TableRow> */}
                            <TableRow>
                                <TableCell colSpan={5} style={{ fontWeight: 'bold', }}>Grand Total</TableCell>
                                {/* <TableCell align="right" style={{ fontWeight: 'bold', }}>₱ {ccyFormat(invoiceTotal)}</TableCell> */}
                                <TableCell align="right">{numberFormat(invoiceSubtotal)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <br></br>
                {/* <form onSubmit={ openSubmit} > */}
                <form >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {shopOrderTransaction.checker != 0 ? (
                            <Div>
                                <Button
                                    variant="contained"
                                    onClick={openSubmit}
                                    size="large" >
                                    Submit
                                </Button>
                            </Div>)
                            :
                            (<Div>
                                <Button
                                    disabled={modeOfPaymentDTO.balance != 0}
                                    variant="contained"
                                    onClick={openSubmit}
                                    size="large" >
                                    Next and Print
                                </Button>
                            </Div>)
                        }

                    </Box>
                </form>


                <Dialog
                    open={submitOpenModal}
                    onClose={handleSubmitCloseModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >

                    <DialogTitle id="alert-dialog-title">
                        {"Are you sure you want to Submit?"}
                    </DialogTitle>
                    {submitLoading &&
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </div>
                    }
                    <DialogActions>
                        <Button onClick={handleSubmitCloseModal}>Cancel</Button>
                        <Button onClick={updateShopOrderTransactionStatus} autoFocus>
                            Agree
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
                            Update Product
                        </Typography>
                        {submitLoading &&
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </div>
                        }
                        <br></br>
                        <FormControl sx={{ m: 0, minWidth: 230, minHeight: 70 }}>
                            <InputLabel id="demo-simple-select-label">Account</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={modeOfPaymentModal.payment_type_id}
                                label="Customer"
                                name="customer_id"
                                onChange={handlePaymentAccountChange}
                            >
                                {
                                    paymentAccountList.map((payment) => (
                                        <MenuItem key={payment.id} value={payment.id}>{paymentAccountLabel(payment)}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>

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
                                variant="contained"
                                type="submit"
                                onClick={updateOrderSupplier}
                                size="large" >
                                Submit
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </div >
        )
    }

    return (
        <Box sx={{ bgcolor: '#f6f7f9', minHeight: '100vh', p: { xs: 2, md: 3 } }}>
            <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
                <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: '1px solid #e5e7eb', mb: 2 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                        <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, flexWrap: 'wrap', rowGap: 1 }}>
                                <StorefrontIcon color="primary" />
                                <Chip size="small" color={isOnlineOrder ? 'success' : 'primary'} label={currentOrderType} />
                                <Chip size="small" variant="outlined" label={`Ref #${shopOrderTransaction.id || id}`} />
                            </Stack>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, letterSpacing: 0 }}>
                                Finalize Order
                            </Typography>
                            <Typography color="text.secondary">
                                Review products and payments before completing this transaction.
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Typography variant="overline" color="text.secondary">Order Total</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {numberFormat(invoiceTotal || 0)}
                            </Typography>
                            <Typography variant="body2" color={hasBalance ? 'error.main' : 'success.main'} sx={{ fontWeight: 600 }}>
                                Balance: {numberFormat(modeOfPaymentDTO.balance || 0)}
                            </Typography>
                        </Box>
                    </Stack>

                    <Box sx={{ mt: 3 }}>
                        <Stepper activeStep={2} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                </Paper>

                {message &&
                    <Alert variant="filled" severity="success" sx={{ mb: 2 }}>
                        Successfully Added!
                    </Alert>
                }

                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity} sx={{ mb: 2 }}>{validator.message}</Alert>
                }

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.1fr) minmax(320px, .9fr)' }, gap: 2, mb: 2 }}>
                    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: '1px solid #e5e7eb' }}>
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Transaction Details</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Confirm the shop, customer, and order ownership.
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1.5 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Shop</Typography>
                                    <Typography sx={{ fontWeight: 600 }}>{shopOrderTransaction.shop_name || '-'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">{isOnlineOrder ? 'Customer' : 'Requestor'}</Typography>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 0.75 }}>
                                        <Typography sx={{ fontWeight: 600 }}>{shopOrderTransaction.requestor_name || '-'}</Typography>
                                        {renderTransactionVipCustomers()}
                                    </Stack>
                                </Box>
                                {!isOnlineOrder &&
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Checker</Typography>
                                        <Typography sx={{ fontWeight: 600 }}>{shopOrderTransaction.checker_name || '-'}</Typography>
                                    </Box>
                                }
                                {isOnlineOrder &&
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Sales Rep</Typography>
                                        <Typography sx={{ fontWeight: 600 }}>{shopOrderTransaction.sr_name || '-'}</Typography>
                                    </Box>
                                }
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Date</Typography>
                                    <Typography sx={{ fontWeight: 600 }}>{shopOrderTransaction.created_at || '-'}</Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Paper>

                    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: '1px solid #e5e7eb' }}>
                        <Stack spacing={1.5}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Checkout Summary</Typography>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography color="text.secondary">Items</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{orderShopDTO.shopOrderList.length}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography color="text.secondary">Subtotal</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{numberFormat(invoiceSubtotal || 0)}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography color="text.secondary">Tax estimate</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{numberFormat(invoiceTaxes || 0)}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography color="text.secondary">Paid</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{numberFormat(modeOfPaymentDTO.total_payment || 0)}</Typography>
                            </Stack>
                            <Divider />
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography sx={{ fontWeight: 700 }}>Balance</Typography>
                                <Typography variant="h5" color={hasBalance ? 'error.main' : 'success.main'} sx={{ fontWeight: 800 }}>
                                    {numberFormat(modeOfPaymentDTO.balance || 0)}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Paper>
                </Box>

                {isOnlineOrder &&
                    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: '1px solid #e5e7eb', mb: 2 }}>
                        <Stack spacing={2.5}>
                            <Box>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <PaymentIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Payments</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    Add payment entries until the order balance is cleared.
                                </Typography>
                            </Box>

                            {hasBalance &&
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(210px, 1fr))' }, gap: 2, alignItems: 'start' }}>
                                    <Autocomplete
                                        fullWidth
                                        options={paymentTermList}
                                        value={selectedPaymentTerm}
                                        id="payment-term-select"
                                        onChange={handlePaymentTermChange}
                                        getOptionLabel={(option) => option.payment_term || ''}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Payment method" variant="outlined" />
                                        )}
                                    />

                                    <Autocomplete
                                        fullWidth
                                        sx={{ gridColumn: '1 / -1' }}
                                        options={paymentAccountList}
                                        value={selectedPaymentAccount}
                                        disabled={!selectedPaymentTerm}
                                        id="payment-account-select"
                                        onChange={handlePaymentAccountChange}
                                        getOptionLabel={paymentAccountLabel}
                                        ListboxProps={{
                                            sx: {
                                                maxHeight: 320,
                                                '& .MuiAutocomplete-option': {
                                                    whiteSpace: 'normal',
                                                    wordBreak: 'break-word'
                                                }
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Account" variant="outlined" />
                                        )}
                                    />

                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel htmlFor="payment-amount">Amount</InputLabel>
                                        <Input
                                            type="number"
                                            id="payment-amount"
                                            name="amount"
                                            max={modeOfPayment.amount}
                                            onChange={onChangeAmount}
                                            value={modeOfPayment.amount}
                                            error={errorStock}
                                            startAdornment={<InputAdornment position="start">PHP</InputAdornment>}
                                        />
                                    </FormControl>

                                    <TextField
                                        type="date"
                                        label="Date"
                                        name="created_at"
                                        value={modeOfPayment.created_at}
                                        onChange={onChangeInput}
                                        InputLabelProps={{ shrink: true }}
                                    />

                                    <Button
                                        variant="contained"
                                        disabled={errorStock || !selectedPaymentTerm || !selectedPaymentAccount}
                                        onClick={savePaymentType}
                                        size="large"
                                        startIcon={<PaymentIcon />}
                                    >
                                        Add
                                    </Button>
                                </Box>
                            }

                            {errorStock &&
                                <Alert severity="error">Payment amount must not be greater than the remaining balance.</Alert>
                            }

                            {submitLoadingAdd && <LinearProgress color="warning" />}

                            <TableContainer sx={{ border: '1px solid #e5e7eb', borderRadius: 2 }}>
                                <Table sx={{ minWidth: 720 }} aria-label="payments">
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                            <TableCell sx={{ fontWeight: 700 }}>Account</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>Amount</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>Date</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {modeOfPaymentDTO.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                                                    <Typography sx={{ fontWeight: 600 }}>No payments added yet</Typography>
                                                    <Typography variant="body2" color="text.secondary">Add a payment above to clear this order.</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : modeOfPaymentDTO.data.map((row) => (
                                            <TableRow key={row.id} hover>
                                                <TableCell>{paymentHistoryLabel(row)}</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600 }}>{numberFormat(row.amount)}</TableCell>
                                                <TableCell align="right">
                                                    <Typography component="span" color={shopOrderTransaction.date !== row.created_at ? 'warning.main' : 'text.primary'}>
                                                        {row.created_at}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title="Update">
                                                        <IconButton color="primary" onClick={(e) => handleOpen(row.id, e)}>
                                                            <UpdateIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton color="error" onClick={() => openDelete(row.id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                            <TableCell sx={{ fontWeight: 800 }}>Total Paid</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 800 }}>{numberFormat(modeOfPaymentDTO.total_payment || 0)}</TableCell>
                                            <TableCell colSpan={2} />
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Stack>
                    </Paper>
                }

                <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #e5e7eb', overflow: 'hidden', mb: 2 }}>
                    <Box sx={{ p: { xs: 2, md: 3 }, pb: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <ReceiptLongIcon color="primary" />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Products to Finalize</Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                            Final review of all products in this order.
                        </Typography>
                    </Box>
                    <TableContainer sx={{ mt: 2 }}>
                        <Table sx={{ minWidth: 860 }} aria-label="order products">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                    <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Qty.</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Unit</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Discount</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Amount</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orderShopDTO.shopOrderList.map((row) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell>
                                            <Typography sx={{ fontWeight: 600 }}>{row.product_name}</Typography>
                                            <Typography variant="body2" color="text.secondary">{itemDescription(row)}</Typography>
                                        </TableCell>
                                        <TableCell align="right">{row.shop_order_quantity}</TableCell>
                                        <TableCell align="right">{row.unit}</TableCell>
                                        <TableCell align="right">{numberFormat(row.fixed_price)}</TableCell>
                                        <TableCell align="right">{discountText(row)}</TableCell>
                                        <TableCell align="right">{numberFormat(row.shop_order_price)}</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>{numberFormat(row.shop_order_total_price)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                    <TableCell colSpan={6} sx={{ fontWeight: 800 }}>Grand Total</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800 }}>{numberFormat(invoiceTotal || 0)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: '1px solid #e5e7eb', mb: 2 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {canFinalize ? 'Ready to finish' : 'Payment still required'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {canFinalize ? 'Complete this transaction and continue to the next step.' : `Collect ${numberFormat(modeOfPaymentDTO.balance || 0)} before printing the receipt.`}
                            </Typography>
                        </Box>
                        <Button
                            disabled={!canFinalize}
                            variant="contained"
                            onClick={openSubmit}
                            size="large"
                            startIcon={isOnlineOrder ? <PrintIcon /> : <CheckCircleIcon />}
                        >
                            {isOnlineOrder ? 'Next and Print' : 'Submit'}
                        </Button>
                    </Stack>
                </Paper>

                <Dialog
                    open={deleteOpenModal}
                    onClose={handleDeleteCloseModal}
                    aria-labelledby="delete-payment-title"
                >
                    <DialogTitle id="delete-payment-title">Delete payment?</DialogTitle>
                    <DialogContent>
                        <Typography color="text.secondary">This payment entry will be removed from the order.</Typography>
                        {submitLoading &&
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <CircularProgress />
                            </Box>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteCloseModal}>Cancel</Button>
                        <Button color="error" variant="contained" onClick={(e) => deleteOrderTransaction(deleteId, e)} autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={submitOpenModal}
                    onClose={handleSubmitCloseModal}
                    aria-labelledby="submit-dialog-title"
                >
                    <DialogTitle id="submit-dialog-title">Submit order?</DialogTitle>
                    <DialogContent>
                        <Typography color="text.secondary">This will mark the order as finalized.</Typography>
                        {submitLoading &&
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <CircularProgress />
                            </Box>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleSubmitCloseModal}>Cancel</Button>
                        <Button onClick={updateShopOrderTransactionStatus} variant="contained" autoFocus>
                            Submit
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
                        <Typography id="keep-mounted-modal-title" variant="h6" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
                            Update Payment
                        </Typography>
                        {submitLoading &&
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <CircularProgress />
                            </Box>
                        }
                        <Stack spacing={2}>
                            <Autocomplete
                                fullWidth
                                options={paymentTermList}
                                value={selectedModalPaymentTerm}
                                id="payment-modal-term-select"
                                onChange={handleModalPaymentTermChange}
                                getOptionLabel={(option) => option.payment_term || ''}
                                renderInput={(params) => (
                                    <TextField {...params} label="Payment method" />
                                )}
                            />

                            <Autocomplete
                                fullWidth
                                options={modalPaymentAccountList}
                                value={selectedModalPaymentAccount}
                                disabled={!selectedModalPaymentTerm}
                                id="payment-modal-account-select"
                                onChange={handleModalPaymentAccountChange}
                                getOptionLabel={paymentAccountLabel}
                                renderInput={(params) => (
                                    <TextField {...params} label="Account" />
                                )}
                            />

                            <FormControl fullWidth variant="standard">
                                <InputLabel htmlFor="payment-modal-amount">Amount</InputLabel>
                                <Input
                                    id="payment-modal-amount"
                                    name="amount"
                                    value={modeOfPaymentModal.amount}
                                    onChange={onChangeInputPriceModal}
                                    startAdornment={<InputAdornment position="start">PHP</InputAdornment>}
                                />
                            </FormControl>

                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button
                                    variant="contained"
                                    type="button"
                                    onClick={updateOrderSupplier}
                                    disabled={submitLoading || !selectedModalPaymentTerm || !selectedModalPaymentAccount}
                                >
                                    Save Changes
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Modal>
            </Box>
        </Box>
    )
}

export default FinalizeShopOrder



