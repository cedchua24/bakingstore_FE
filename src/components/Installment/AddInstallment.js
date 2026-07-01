import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';


import OrderSupplierTransactionService from "../OrderSupplierTransaction/OrderSupplierTransactionService";
import OrderSupplierService from "../OrderSupplierTransaction/OrderSupplierServiceService";
import PaymentTypePoService from "../OtherService/PaymentTypePoService";
import BankService from "../OtherService/BankService";
import ModeOfPaymentPoService from "../OtherService/ModeOfPaymentPoService";
import CreditCardPaymentService from "../OtherService/CreditCardPaymentService";
import InstallmentPaymentService from "../OtherService/InstallmentPaymentService";
import InstallmentPaymentTransactionService from "../OtherService/InstallmentPaymentTransactionService";
import Loan from "../OtherService/LoanService";
import LoanTransactionService from "../OtherService/LoanTransactionService";

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
import PaymentIcon from '@mui/icons-material/Payment';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import UpdateIcon from '@mui/icons-material/Update';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography'

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';



const AddInstallment = () => {


    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // fetchPaymentTerm();
        // fetchCreditCardByMOP(id);
        // fetchCreditCardPaymentDTO(id);
        fetchPaymentTypePo();
        fetchBank();
    }, []);



    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        '& .MuiTextField-root': { m: 1, width: '25ch' },
    };

    const TAX_RATE = 0.12;

    function ccyFormat(num) {
        return `${num.toFixed(2)}`;
    }


    const [invoiceSubtotal, setinvoiceSubtotal] = useState(0);
    const [invoiceTaxes, setinvoiceTaxes] = useState(0);
    const [invoiceTotal, setinvoiceTotal] = useState(0);



    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const [orderList, setOrderList] = useState([]);

    const [paymentTermList, setPaymentTermList] = useState([]);
    const [paymentTypePoList, setPaymentTypePoList] = useState([]);
    const [bankList, setBankList] = useState([]);
    const [errorStock, setErrorStock] = useState(false);
    const [formErrors, setFormErrors] = useState({});

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

    const [installment, setInstallment] = useState({
        number_of_months: 0,
        total_interest: 0,
        interest: 0,
        interest_monthly: 0,
        amount: 0,
        amount_monthly: 0,
        status: 0,
        new_amount: 0,
        borrower: '',
        details: '',
        bank_id: 0,
        payment_type_po_id: 0,
        start_date: '',
        created_at: '',
        updated_at: ''
    });


    const [creditCardPayment, setCreditCardPayment] = useState({
        payment_type_po_id: 0,
        mode_of_payment_po_id: id,
        payment_term_id: 0,
        amount: 0,
        status: 0,
        date: '',
        interest_amount: 0,
        is_installment: 0,
        created_at: '',
        updated_at: ''
    });

    const [modeOfPaymentDTO, setModeOfPaymentDTO] = useState({
        data: [],
        code: '',
        balance: 0,
        total_payment: 0,
    });
    const [creditCardPaymentDTO, setCreditCardPaymentDTO] = useState({
        data: [],
        total_payment: 0,
    });

    const [installmentDetails, setInstallmentDetails] = useState({
        data: [],
        total_payment: 0,
    });

    const [installmentPaymentList, setInstallmentPaymentList] = useState({
        data: [],
        paid_count: 0,
        total_payment: 0,
    });

    const [creditCardDTO, setCreditCardDTO] = useState({
        data: [],
        modeOfPaymentPo: {},
        code: '',
        balance: 0,
        total_payment: 0,
    });

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [installmentModal, setInstallmentModal] = useState({
        id: 0,
        installment_payment_transaction_id: 0,
        amount: 0,
        penalty: 0,
        due_date: 0,
        status: 0,
        created_at: '',
        updated_at: 0
    });



    const openDelete = () => {
        setDeleteOpenModal(true);
    }

    const openPayment = (installmentId, e) => {
        console.log('e', installmentId);
        fetchInstallmentPaymentById(installmentId);
        setPaymentOpentModal(true);
    }

    const fetchInstallmentPaymentById = async (installmentId) => {
        await InstallmentPaymentService.get(installmentId)
            .then(response => {
                console.log('get', response.data);
                setInstallmentModal(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const [open, setOpen] = React.useState(false);




    const handleClose = () => setOpen(false);
    const [deleteOpenModal, setDeleteOpenModal] = React.useState(false);
    const [paymentOpentModal, setPaymentOpentModal] = React.useState(false);
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

    const handlePaymentCloseModal = () => {
        setPaymentOpentModal(false);
    };


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
        console.log("test", deleteId);
        InstallmentPaymentTransactionService.delete(deleteId, creditCardPayment)
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
                fetchCreditCardPaymentDTO(id);
                fetchInstallmentDetails(id);
                // window.location.reload();
            })
            .catch(e => {
                console.log('error', e);
            });
    }


    const [message, setMessage] = useState(false);

    const onChangeInput = (e) => {
        setInstallment({ ...installment, [e.target.name]: e.target.value });
        console.log('installment', installment);
    }

    const handleBank = (e, value) => {
        e.persist();
        console.log('handleBank', value)
        setInstallment({
            ...installment,
            bank_id: value.id,
        });
    }


    const handlePaymentTypePo = (e, value) => {
        e.persist();
        console.log('handlePaymentTypePo', value)
        setInstallment({
            ...installment,
            payment_type_po_id: value.id,
        });


    }


    const onchangeInterest = (e) => {
        console.log('number_of_months', e.target.value)
        setInstallment({
            ...installment,
            total_interest: e.target.value - installment.amount,
            interest: e.target.value,
            interest_monthly: e.target.value / installment.number_of_months,
        });
    }

    const onchangeInterestMonthly = (e) => {
        // e.persist();
        console.log('onchangeInterst', e.target.value)
        // setInstallment({ ...installment, [e.target.name]: e.target.value });
        setInstallment({
            ...installment,
            interest: e.target.value * installment.number_of_months,
            interest_monthly: e.target.value,
        });
    }




    const fetchPaymentTerm = () => {
        PaymentTermService.fetchPaymentTermCreditCard()
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


    const updateOrderTransaction = () => {
        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        ModeOfPaymentPoService.setToCompleteCreditCard(id)
            .then(response => {
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
                navigate('/creditCardPaymentList/');
            })
            .catch(e => {
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
                console.log(e);
            });
    }


    const validate = (values) => {
        const errors = {};
        if (installment.borrower.length == 0) {
            errors.borrower = "Borrower Required!";
        }

        if (installment.number_of_months == 0) {
            errors.number_of_months = "Number of Months Required!";
        }

        if (installment.borrower == 'company') {
            if (installment.details.length == 0) {
                errors.details = "Details Required!";
            }
        } else if (installment.borrower == 'bank') {
            if (installment.bank_id == 0) {
                errors.bank_id = "Bank Required!";
            }
        }
        else if (installment.borrower == 'credit_card') {
            if (installment.payment_type_po_id == 0) {
                errors.payment_type_po_id = "Credit Card Details Required!";
            }
        }

        if (installment.start_date.length == 0) {
            errors.start_date = "Date is Required!";
        }

        if (installment.amount == 0) {
            errors.amount = "Amount is Required!";
        }

        if (installment.interest == 0) {
            errors.interest = "Amount With Interest is Required!";
        }



        return errors;
    }


    const savePaymentType = () => {
        console.log('creditCardPayment:', installment);
        console.log("count: ", Object.keys(validate(installment)).length);
        console.log("validate: ", validate(installment));
        setFormErrors(validate(installment));
        if (Object.keys(validate(installment)).length > 0) {
            console.log("Has Validation: ");
        } else {
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            setErrorStock(true);
            LoanTransactionService.sanctum().then(response => {
                LoanTransactionService.create(installment)
                    .then(response => {
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                        setErrorStock(false);
                        fetchCreditCardPaymentDTO(id);
                        setValidator({
                            severity: 'success',
                            message: 'Successfully Added',
                            isShow: true,
                        });
                        navigate('/installmentDetails/' + response.data.id);
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

        ModeOfPaymentPoService.fetchCreditCardPaymentDTO(id)
            .then(response => {
                setModeOfPaymentDTO(response.data);
                console.log('balance', response.data)
                setCreditCardPayment({
                    ...creditCardPayment,
                    amount: response.data.total_payment,
                });



            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchPaymentTypePo = ($id) => {
        PaymentTypePoService.findByCategory(4)
            .then(response => {
                setPaymentTypePoList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchBank = ($id) => {
        BankService.getAll()
            .then(response => {
                setBankList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchCreditCardByMOP = (id) => {

        CreditCardPaymentService.fetchCreditCardByMOP(id)
            .then(response => {
                setCreditCardPaymentDTO(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchInstallmentDetails = (id) => {

        LoanTransactionService.findById(id)
            .then(response => {
                console.log('fetchInstallmentTransactionByMOP', response.data)
                setInstallmentDetails(response.data);
                if (response.data.datalength != 0) {
                    fetchInstallmentPayment(response.data.data[0].id);
                }
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchInstallmentPayment = (id) => {
        InstallmentPaymentService.fetchInstallmentPayment(id)
            .then(response => {
                console.log('fetchInstallmentPayment', response.data)
                setInstallmentPaymentList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchCreditCardPaymentDTO = (id) => {

        ModeOfPaymentPoService.fetchCreditCardPaymentDTO(id)
            .then(response => {
                setCreditCardDTO(response.data);
                console.log('balance', response.data)
                setModeOfPaymentPo({
                    ...modeOfPaymentPo,
                    amount: response.data.balance,
                });

                fetchOrderSupplierTransaction(response.data.modeOfPaymentPo.order_supplier_transaction_id);
                fetchByOrderSupplierId(response.data.modeOfPaymentPo.order_supplier_transaction_id);
                fetchPaymentTypePoByShopTransactionId(id);
                fetchCreditCardByMOP(id);
                fetchInstallmentDetails(id);


            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const updateInstallment = () => {
        setSubmitLoading(true);
        InstallmentPaymentService.update(installmentModal.id, installmentModal)
            .then(response => {
                fetchInstallmentDetails(id);
                setPaymentOpentModal(false);
                setSubmitLoading(false);

                if (response.data.transaction_status == 1) {
                    setValidator({
                        severity: 'success',
                        message: 'Transaction Completed',
                        isShow: true,
                    });
                } else if (response.data.payment_status == 1) {
                    {
                        setValidator({
                            severity: 'success',
                            message: 'Successfully Paid',
                            isShow: true,
                        });
                    }
                }
                else if (response.data.payment_status == 0) {
                    setValidator({
                        severity: 'error',
                        message: 'Transaction Deleted',
                        isShow: true,
                    });
                }

            })
            .catch(e => {
                console.log(e);
            });
    }

    const onChangeInstallmentModal = (e) => {
        setInstallmentModal({
            ...installmentModal, [e.target.name]: e.target.value
        });


    }



    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');





    return (
        <div>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>


            <br></br>
            {installmentPaymentList.data.length != 0 &&
                <div style={{ width: 320 }}>
                    <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label style={{ fontWeight: 'bold' }}> Overall Payment </Form.Label>
                        {installmentPaymentList.paid_count == installmentPaymentList.data.length ? <CheckIcon style={{ color: 'green', }} /> :
                            <CloseIcon style={{ color: 'red', }} />}
                        <Form.Control type="text" value={installmentPaymentList.paid_count + "/" + installmentPaymentList.data.length} />
                    </Form.Group>
                </div>
            }
            <br></br>

            {installmentDetails.data.length == 0 &&
                <Box
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                // onSubmit={saveOrderSupplier}
                >
                    {formErrors.borrower && <p style={{ color: "red" }}>{formErrors.borrower}</p>}
                    <FormControl sx={{ minWidth: 230, }}>
                        <InputLabel id="demo-simple-select-label">Choose Borrower</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            className="mb-3"
                            id="demo-simple-select"
                            name='borrower'
                            label="Mark Up Option"
                            onChange={onChangeInput}
                        >
                            <MenuItem value='company'>Company</MenuItem>
                            <MenuItem value='bank'>Bank</MenuItem>
                            <MenuItem value='credit_card'>Credit Card</MenuItem>
                        </Select>
                    </FormControl>


                    <br></br>
                    {installment.borrower == 'bank' ? (<>

                        <Box
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '65ch' },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            {formErrors.bank_id && <p style={{ color: "red" }}>{formErrors.bank_id}</p>}
                            <FormControl variant="standard" >
                                <Autocomplete
                                    // {...defaultProps}
                                    options={bankList}
                                    className="mb-3"
                                    id="disable-close-on-select"
                                    onChange={handleBank}
                                    getOptionLabel={(bankList) => bankList.bank_name}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Choose Bank" variant="standard" />
                                    )}
                                />
                            </FormControl>
                        </Box>
                        <br></br>
                    </>) : ""}

                    {installment.borrower == 'credit_card' ? (<>

                        <Box
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '65ch' },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            {formErrors.payment_type_po_id && <p style={{ color: "red" }}>{formErrors.payment_type_po_id}</p>}
                            <FormControl variant="standard" >
                                <Autocomplete
                                    // {...defaultProps}
                                    options={paymentTypePoList}
                                    className="mb-3"
                                    id="disable-close-on-select"
                                    onChange={handlePaymentTypePo}
                                    getOptionLabel={(paymentTypePoList) => paymentTypePoList.bank_name + " " + paymentTypePoList.account_name + "  " + paymentTypePoList.account_description + " - " + paymentTypePoList.account_number}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Choose Credit Card" variant="standard" />
                                    )}
                                />
                            </FormControl>
                        </Box>
                        <br></br>
                    </>) : ""}

                    {installment.borrower == 'company' ? (<>
                        {formErrors.details && <p style={{ color: "red" }}>{formErrors.details}</p>}
                        <FormControl sx={{ minWidth: 250, }} variant="standard">
                            <InputLabel htmlFor="standard-adornment-amount">Details</InputLabel>
                            <Input
                                type='text'
                                id="filled-required"
                                label="details"
                                variant="filled"
                                name='details'
                                onChange={onChangeInput}
                            />
                        </FormControl>

                        <br></br>
                        <br></br>
                    </>) : ""}

                    {formErrors.number_of_months && <p style={{ color: "red" }}>{formErrors.number_of_months}</p>}
                    <FormControl sx={{ m: 0, minWidth: 230, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Number of Months *</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Number of Months"
                            name="number_of_months"
                            onChange={onChangeInput}
                        >
                            {Array(37).fill(1).map((el, i) =>
                                <MenuItem value={i}>{i}</MenuItem>
                            )}

                        </Select>
                    </FormControl>

                    <br></br>
                    {formErrors.start_date && <p style={{ color: "red" }}>{formErrors.start_date}</p>}
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                        <Form.Label>Start of Due Date</Form.Label>
                        <Form.Control type="date" name="start_date" onChange={onChangeInput} />
                    </Form.Group>

                    {formErrors.amount && <p style={{ color: "red" }}>{formErrors.amount}</p>}
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
                        <Input
                            type='number'
                            id="filled-required"
                            label="amount"
                            name='amount'
                            variant="filled"
                            onChange={onChangeInput}
                        />
                    </FormControl>

                    {formErrors.interest && <p style={{ color: "red" }}>{formErrors.interest}</p>}
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel >Enter Amount with interest</InputLabel>
                        <Input
                            type='number'
                            id="filled-required"
                            label="amount"
                            variant="filled"
                            name='interest'
                            onChange={onchangeInterest}
                        // helperText="Incorrect entry."
                        />
                    </FormControl>
                    <br></br>

                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel >Interest</InputLabel>
                        <Input
                            type='number'
                            id="filled-required"
                            label="amount"
                            variant="filled"
                            value={installment.total_interest}
                            disabled
                        />
                    </FormControl>

                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Monthly Payment</InputLabel>
                        <Input
                            type='number'
                            id="filled-required"
                            label="amount"
                            variant="filled"
                            name='interest_monthly'
                            disabled
                            value={installment.interest_monthly}
                        // disabled
                        // helperText="Incorrect entry."
                        />
                    </FormControl>






                    <br></br>
                    <Button
                        variant="contained"
                        disabled={errorStock}
                        onClick={savePaymentType}
                        size="large" >
                        Submit
                    </Button>
                    <br></br>
                    <br></br>
                    {submitLoadingAdd &&
                        <LinearProgress color="warning" />
                    }
                </Box>
            }
            <br></br>
            {installmentPaymentList.data.length != 0 &&
                <>
                    <TableContainer component={Paper}>
                        <h3 style={{ textAlign: "center" }}>Monthly Payment</h3>
                        <Table sx={{ minWidth: 700 }} aria-label="spanning table">

                            <TableHead>

                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold' }}>Due Date</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Amount Due</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Amount Paid</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Penalty</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Payment Status</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {installmentPaymentList.data.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="right">{row.due_date}</TableCell>
                                        <TableCell>{row.amount_due}</TableCell>
                                        <TableCell>{row.amount}</TableCell>
                                        <TableCell align="right">{row.penalty}</TableCell>

                                        <TableCell align="right">{row.status == 1 ? <><CheckIcon style={{ color: 'green', }} /></> : <><CloseIcon style={{ color: 'red', }} /></>}</TableCell>
                                        <TableCell align="right">
                                            {row.status == 1 ? <>
                                                <Tooltip title="Payment">
                                                    <IconButton>
                                                        <DeleteIcon color="error" onClick={(e) => openPayment(row.id, e)} />

                                                    </IconButton>
                                                </Tooltip>
                                            </> : <>
                                                <Tooltip title="Payment">
                                                    <IconButton>
                                                        <PaymentIcon color="primary" onClick={(e) => openPayment(row.id, e)} />
                                                    </IconButton>
                                                </Tooltip>
                                            </>}

                                        </TableCell>



                                        <Modal
                                            keepMounted
                                            open={paymentOpentModal}
                                            onClose={handlePaymentCloseModal}
                                            aria-labelledby="keep-mounted-modal-title"
                                            aria-describedby="keep-mounted-modal-description"
                                        >
                                            <Box sx={style}>
                                                <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                                                    {installmentModal.status == 0 ? "Installment Payment" : <p style={{ color: "red" }}>Remove Payment</p>}
                                                </Typography>

                                                <br></br>
                                                <Form.Group className="w-45 mb-3" controlId="formBasicEmail">
                                                    <Form.Label>Date</Form.Label>
                                                    <Form.Control type="text" value={installmentModal.due_date} name="amount" disabled />
                                                </Form.Group>
                                                {installmentModal.status == 0 ?
                                                    <>
                                                        <Form.Group className="w-45 mb-3" controlId="formBasicEmail">
                                                            <Form.Label>Amount Due</Form.Label>
                                                            <Form.Control type="number" value={installmentModal.amount_due} name="amount_due" disabled />
                                                        </Form.Group>
                                                        < Form.Group className="w-45 mb-3" controlId="formBasicEmail">
                                                            <Form.Label>Enter Amount</Form.Label>
                                                            <Form.Control type="number" value={installmentModal.amount} name="amount" onChange={onChangeInstallmentModal} />
                                                        </Form.Group>
                                                    </>
                                                    : <>
                                                        <Form.Group className="w-45 mb-3" controlId="formBasicEmail">
                                                            <Form.Label>Amount Due</Form.Label>
                                                            <Form.Control type="number" value={installmentModal.amount_due} name="amount_due" disabled />
                                                        </Form.Group>
                                                        <Form.Group className="w-45 mb-3" controlId="formBasicEmail">
                                                            <Form.Label>Amount Paid</Form.Label>
                                                            <Form.Control type="number" value={installmentModal.amount} name="amount" disabled />
                                                        </Form.Group>

                                                    </>

                                                }
                                                {submitLoading &&
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <CircularProgress />
                                                    </div>
                                                }
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
                                                        variant="contained"
                                                        disabled={installmentModal.amount < installmentModal.amount_due}
                                                        onClick={updateInstallment}
                                                        size="large" >
                                                        Submit
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Modal>

                                    </TableRow>

                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            }
            <br></br>
            {
                installmentDetails.data.length != 0 &&
                <>
                    <TableContainer component={Paper}>
                        <h3 style={{ textAlign: "center" }}>Installment Details</h3>
                        <Table sx={{ minWidth: 700 }} aria-label="spanning table">

                            <TableHead>

                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold' }}>Number of Months</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Amount</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Interest</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Amount with Interest</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Amount Monthly with Interest </TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Start of Due Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {installmentDetails.data.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.number_of_months}</TableCell>
                                        <TableCell align="right">{row.amount}</TableCell>
                                        <TableCell align="right">{row.interest - row.amount}</TableCell>
                                        <TableCell align="right">{row.interest}</TableCell>
                                        <TableCell align="right">{row.interest_monthly}</TableCell>
                                        <TableCell align="right">{row.start_date}</TableCell>
                                        <TableCell align="right">

                                            <Tooltip title="Delete">
                                                <IconButton disabled={installmentPaymentList.paid_count > 0}>
                                                    <DeleteIcon
                                                        color={installmentPaymentList.paid_count > 0 ? "" : "error"}
                                                        onClick={(e) => openDelete()}

                                                    />
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
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            }
            <br></br>

            <br></br>
            {
                creditCardPaymentDTO.data.length != 0 &&
                <TableContainer component={Paper}>
                    <h3 style={{ textAlign: "center" }}>Credit Card Payment</h3>
                    <Table sx={{ minWidth: 700 }} aria-label="spanning table">

                        <TableHead>

                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }}>Mode of Payment</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Term</TableCell>
                                <TableCell align="right" style={{ fontWeight: 'bold' }}>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {creditCardPaymentDTO.data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.bank_name}{" - " + row.account_name} {"" + row.account_description}{" - " + row.account_number}</TableCell>
                                    <TableCell align="right">{row.is_installment == 1 ? "Installment" : row.payment_term}</TableCell>
                                    <TableCell align="right">{row.amount}</TableCell>


                                </TableRow>

                            ))}
                            <TableRow>
                                <TableCell colSpan={2} style={{ fontWeight: 'bold', }}>Grand Total</TableCell>
                                <TableCell align="right" style={{ fontWeight: 'bold', }}>₱ {modeOfPaymentDTO.total_payment}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            }




            <br></br>
            {
                submitLoadingAdd &&
                <LinearProgress color="warning" />
            }
            <br></br>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <br></br>


                <br></br>



            </Box>

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
            <br></br>
            <br></br>
        </div >
    )
}

export default AddInstallment



