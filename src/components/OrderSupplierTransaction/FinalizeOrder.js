import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import OrderSupplierTransactionService from "./OrderSupplierTransactionService";
import OrderSupplierService from "./OrderSupplierServiceService";
import PaymentTypePoService from "../OtherService/PaymentTypePoService";
import ModeOfPaymentPoService from "../OtherService/ModeOfPaymentPoService";
import UserService from '../User/UserService.service'
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
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import "./OrderSupplierTransaction.css";



const FinalizeOrder = () => {


    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrderSupplierTransaction(id);
        fetchByOrderSupplierId(id);
        fetchPaymentTypePo();
        fetchPaymentTerm();
        fetchPaymentTypePoByShopTransactionId(id);
        fetchRequestor();
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

    const [requestorList, setRequestorList] = useState([]);
    const [invoiceSubtotal, setinvoiceSubtotal] = useState(0);
    const [invoiceTaxes, setinvoiceTaxes] = useState(0);
    const [invoiceTotal, setinvoiceTotal] = useState(0);

    const [dueDay, setDueDay] = useState([31]);

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const [orderList, setOrderList] = useState([]);

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
        approval: useState(localStorage.getItem('name')),
        approval_status: '',
        receiver: '',
        checker: '',
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

    const fetchRequestor = () => {
        UserService.fetchUserList()
            .then(response => {
                setRequestorList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
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

    const fetchByOrderSupplierId = async (id) => {
        await OrderSupplierService.findById(id)
            .then(response => {
                setOrderList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const onChange = (e) => {
        setOrderSupplierTransaction({ ...orderSupplierTransaction, [e.target.name]: e.target.value });
    }


    const updateOrderTransaction = () => {
        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);

        OrderSupplierTransactionService.updateReceivedOrder(id, orderSupplierTransaction)
            .then(response => {
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);

                if (response.data.code === 200) {
                    setValidator({
                        severity: 'success',
                        message: response.data.message,
                        isShow: true,
                    });

                    setTimeout(() => {
                        navigate('/supplierTransactionList/');
                    }, 2000);
                } else {
                    setValidator({
                        severity: 'error',
                        message: response.data.message || 'Something went wrong',
                        isShow: true,
                    });
                }
            })
            .catch(e => {
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);

                setValidator({
                    severity: 'error',
                    message: e.response?.data?.message || e.message || 'Server Error',
                    isShow: true,
                });

                console.log(e.response?.data || e);
            });
    };

    const submitApproval = () => {
        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        OrderSupplierTransactionService.orderSupplierApproval(orderSupplierTransaction)
            .then(response => {
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
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


    return (
        <main className="purchase-order-page po-finalize-page">
            <section className="purchase-order-shell">
                <div className="purchase-order-heading">
                    <div className="purchase-order-icon" aria-hidden="true">
                        <DoneAllRoundedIcon />
                    </div>
                    <div>
                        <span className="purchase-order-eyebrow">Purchase order #{id}</span>
                        <h1>Receive order</h1>
                        <p>Verify the delivered products and record who checked and received the supplier order.</p>
                    </div>
                </div>

                {validator.isShow &&
                    <Alert className="po-products-alert" variant="filled" severity={validator.severity}>
                        {validator.message}
                    </Alert>
                }

                <Box
                    className="po-finalize-workspace"
                    noValidate
                    autoComplete="off"
                >
                    <div className="purchase-order-progress">
                        <Stepper activeStep={4} alternativeLabel>
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
                                        <strong>{orderList.length}</strong>
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

                <div className="po-list-heading po-finalize-list-heading">
                    <div>
                        <span>Delivery contents</span>
                        <h2>Products to verify</h2>
                    </div>
                    <strong>{orderList.length} {orderList.length === 1 ? 'item' : 'items'}</strong>
                </div>
                <TableContainer component={Paper} className="po-items-table">
                    <Table sx={{ minWidth: 760 }} aria-label="Products received from supplier">
                        <TableHead>

                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Unit</TableCell>
                                <TableCell align="center" >Expiration</TableCell>
                                <TableCell align="right">Sum</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderList.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <div className="po-empty-state">
                                            <Inventory2OutlinedIcon />
                                            <strong>No products found</strong>
                                            <span>This purchase order has no products to receive.</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {orderList.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell><strong>{row.product_name}</strong></TableCell>
                                    <TableCell align="right">{row.quantity}</TableCell>
                                    <TableCell align="right">{numberFormat(row.price)}</TableCell>
                                    <TableCell align="right">{row.unit}</TableCell>


                                    <TableCell align="right">{row.expiration != null ? formatStatementDate(row.expiration) : "—"}</TableCell>
                                    <TableCell align="right"><strong>{numberFormat(row.total_price)}</strong></TableCell>
                                </TableRow>
                            ))}
                            <TableRow className="po-grand-total-row">
                                <TableCell colSpan={3} style={{ fontWeight: 'bold', }}>Grand Total</TableCell>
                                <TableCell align="right" style={{ fontWeight: 'bold', }} colSpan={3}>{numberFormat(invoiceTotal)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <section className="po-finalize-card">
                    <div className="po-card-heading">
                        <div>
                            <span>Receiving confirmation</span>
                            <h2>{orderSupplierTransaction.status == 'COMPLETED' ? 'Order received' : 'Confirm delivery handoff'}</h2>
                            <p>{orderSupplierTransaction.status == 'COMPLETED'
                                ? 'This supplier order has been checked and received.'
                                : 'Assign the people who verified and accepted the delivered products.'}</p>
                        </div>
                        {orderSupplierTransaction.status == 'COMPLETED' && (
                            <div className="po-approved-badge"><CheckCircleIcon /> Completed</div>
                        )}
                    </div>

                    {submitLoadingAdd && <LinearProgress color="warning" />}

                    <div className="po-finalize-form">
                        {orderSupplierTransaction.status == 'COMPLETED' ? (
                            <>
                                <TextField
                                    fullWidth
                                    label="Checked by"
                                    value={orderSupplierTransaction.checker || '—'}
                                    disabled
                                />
                                <TextField
                                    fullWidth
                                    label="Received by"
                                    value={orderSupplierTransaction.receiver || '—'}
                                    disabled
                                />
                            </>
                        ) : (
                            <>
                                <FormControl fullWidth required>
                                    <InputLabel id="checker-label">Checked by</InputLabel>
                                    <Select
                                        labelId="checker-label"
                                        label="Checked by"
                                        name="checker"
                                        value={orderSupplierTransaction.checker}
                                        onChange={onChange}
                                    >
                                        {requestorList.map((requestor) => (
                                            <MenuItem key={requestor.id} value={requestor.name}>
                                                {requestor.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth required>
                                    <InputLabel id="receiver-label">Received by</InputLabel>
                                    <Select
                                        labelId="receiver-label"
                                        label="Received by"
                                        name="receiver"
                                        value={orderSupplierTransaction.receiver}
                                        onChange={onChange}
                                    >
                                        {requestorList.map((requestor) => (
                                            <MenuItem key={requestor.id} value={requestor.name}>
                                                {requestor.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                        )}
                    </div>

                    <div className="po-finalize-actions">
                        <div>
                            <strong>{orderSupplierTransaction.status == 'COMPLETED' ? 'Receiving complete' : 'Final step'}</strong>
                            <p>{orderSupplierTransaction.status == 'COMPLETED'
                                ? 'No further receiving action is required.'
                                : 'Completing this step will close the purchase-order workflow.'}</p>
                        </div>
                        {orderSupplierTransaction.status != 'COMPLETED' && (
                            <Button
                                disabled={
                                    isAddDisabled ||
                                    !orderSupplierTransaction.checker ||
                                    !orderSupplierTransaction.receiver
                                }
                                variant="contained"
                                onClick={updateOrderTransaction}
                                startIcon={<DoneAllRoundedIcon />}
                                className="purchase-order-next"
                            >
                                {submitLoadingAdd ? 'Completing…' : 'Confirm order received'}
                            </Button>
                        )}
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

                        <br></br>
                        <br></br>

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

export default FinalizeOrder;



