import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Button, Form } from 'react-bootstrap';
import ExpensesTypeV2Service from "./ExpensesTypeV2Service";
import ExpensesCategoryV2Service from "./ExpensesCategoryV2Service";
import ExpensesV2Service from "./ExpensesV2Service";
import ExpenseTransactionService from "./ExpenseTransactionService";
import PaymentTypePoService from "../OtherService/PaymentTypePoService";
import PaymentTermService from "../OtherService/PaymentTermService";
import UserService from '../User/UserService.service'
import LinearProgress from '@mui/material/LinearProgress';
import { Link } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Checkbox from '@mui/material/Checkbox';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';


const EditExpenseTransaction = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchExpenseTransaction(id);
        fetchExpenseType();
        fetchExpenseTransactionList();
        fetchPaymentTerm();
        fetchRequestor();
    }, []);

    const [paymentTermList, setPaymentTermList] = useState([]);
    const [paymentTypePoList, setPaymentTypePoList] = useState([]);
    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [expenseTypeList, setExpenseTypeList] = useState([]);
    const [expenseCategoryList, setExpenseCategoryList] = useState([]);
    const [expenseList, setExpenseList] = useState([]);
    const [expenseTransactionList, setExpenseTransactionList] = useState([]);
    const [requestorList, setRequestorList] = useState([]);
    const [role] = useState(localStorage.getItem('role_as'));

    const [expenseTransaction, setExpenseTransaction] = useState({
        id: 0,
        shop_id: 0,
        expense_type_id: 0,
        expense_category_id: 0,
        expense_id: 0,
        user_id: 0,
        requestor_name: '',
        approver_id: 0,
        approval_status: '',
        payment_type_po_id: 0,
        amount: 0,
        balance_type_id: 3,
        is_received: 0,
        name: 'Expense Transaction',
        details: '',
        expense_date: '',
        status: 0,
        updated_at: ''
    });

    const [expenseTransactionFixed, setExpenseTransactionFixed] = useState({
        id: 0,
        shop_id: 0,
        expense_type_id: 0,
        expense_category_id: 0,
        expense_id: 0,
        user_id: 0,
        requestor_name: '',
        approver_id: 0,
        approval_status: '',
        payment_type_po_id: 0,
        amount: 0,
        balance_type_id: 3,
        is_received: 0,
        name: '',
        details: '',
        expense_date: '',
        status: 0,
        updated_at: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const fetchExpenseTransaction = (id) => {
        ExpenseTransactionService.fetchExpenseTransactionById(id)
            .then(response => {
                // setExpenseTransaction(response.data);
                setExpenseTransaction(prev => ({
                    ...prev,
                    ...response.data
                }));
                setExpenseTransactionFixed(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchRequestor = () => {
        UserService.getAll()
            .then(response => {
                setRequestorList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchExpenseType = () => {
        ExpensesTypeV2Service.getAll()
            .then(response => {
                setExpenseTypeList(response.data);
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

    const fetchExpenseTransactionList = () => {
        ExpenseTransactionService.fetchExpenseTransactionList(1)
            .then(response => {
                setExpenseTransactionList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const onChangeType = (e) => {
        setExpenseTransaction({
            ...expenseTransaction,
            expense_type_id: e.target.value,
            expense_id: 0,
            expense_category_id: 0
        });
        fetchCategoryExpenseList(e.target.value);
    }



    const onChangePaymentTypedisabled = (e) => {

        console.log("error", e.target.checked)
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setExpenseTransaction({ ...expenseTransaction, is_received: 1 });
            } else {
                setExpenseTransaction({ ...expenseTransaction, is_received: 0 });
            }
        } else {
            setExpenseTransaction({ ...expenseTransaction, is_received: e.target.value });
        }
    }

    const onChangeInput = (e) => {
        setExpenseTransaction({ ...expenseTransaction, [e.target.name]: e.target.value });
    }


    const fetchCategoryExpenseList = (typeId) => {
        ExpensesCategoryV2Service.fetchExpenseCategoryById(typeId)
            .then(response => {
                setExpenseCategoryList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchExpenseList = (typeId) => {
        ExpensesV2Service.fetchExpenseV2ById(typeId)
            .then(response => {
                setExpenseList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }






    const saveExpenseType = () => {

        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        console.log(expenseTransaction);
        ExpenseTransactionService.sanctum().then(response => {
            ExpenseTransactionService.update(expenseTransaction.id, expenseTransaction)
                .then(response => {
                    fetchExpenseTransactionList();
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                    setValidator({
                        severity: 'success',
                        message: response.data.message,
                        isShow: true,
                    });
                    navigate('/expensesV2/expenseTransaction');
                })
                .catch(e => {
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                    console.log(e);
                    setValidator({
                        severity: 'error',
                        message: "expenseTransaction Already Exists",
                        isShow: true,
                    });
                });
        });

    }

    const handlePaymentTermChange = (e, value) => {
        e.persist();
        console.log(value)
        if (value.id == 1) {
            setExpenseTransaction({
                ...expenseTransaction,
                payment_term_id: value.id,
                payment_type_po_id: 1
            });
        } else if (value.id == 5) {
            setExpenseTransaction({
                ...expenseTransaction,
                payment_term_id: value.id,
                payment_type_po_id: 2
            });
        }
        else if (value.id == 4 || value.id == 3) {
            setExpenseTransaction({
                ...expenseTransaction,
                payment_term_id: value.id,
                status: 1
            });
        }
        else {
            setExpenseTransaction({
                ...expenseTransaction,
                payment_term_id: value.id
            });
        }
        fetchPaymentTypePo(value.id);
    }

    const handlePaymentTypeChange = (e, value) => {
        e.persist();
        setExpenseTransaction({
            ...expenseTransaction,
            payment_type_po_id: value.id,
        });


    }




    const fetchPaymentTypePo = ($id) => {
        PaymentTypePoService.findByCategory($id)
            .then(response => {
                setPaymentTypePoList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const formatStatementDate = (date) => {
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');

    const statusColor = {
        PENDING: 'warning.main',
        APPROVED: 'success.main',
        REJECTED: 'error.main',
    };
    const statusColorTd = {
        PENDING: 'orange',
        APPROVED: 'green',
        REJECTED: 'red',
    };

    return (
        <div>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>
            <Form>
                <legend align="center" style={{ fontWeight: 'bold' }} > {expenseTransactionFixed.is_received ? "View" : "Update"} Expense Transaction </legend>
                <br></br>
                <br></br>
                <div style={{ float: 'right', marginRight: 300 }}>

                    {formErrors.approver_id && <p style={{ color: "red" }}>{formErrors.approver_id}</p>}
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                            <InputLabel id="demo-simple-select-label">Approver</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Approver"
                                name="approver_id"
                                value={expenseTransaction.approver_id}
                                onChange={onChangeInput}
                                disabled={expenseTransaction.is_received}
                            >
                                {
                                    requestorList.map((requestor, index) => (
                                        <MenuItem value={requestor.id}>{requestor.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Box>


                    <InputLabel id="demo-simple-select-label">Select Status</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"

                        id="demo-simple-select"
                        name="approval_status"
                        label="Stock Warning Type"
                        value={expenseTransaction.approval_status}
                        sx={{
                            color: statusColor[expenseTransaction.approval_status],
                            '& .MuiSelect-icon': {
                                color: statusColor[expenseTransaction.approval_status],
                            },
                        }}
                        onChange={onChangeInput}
                        displayEmpty
                        disabled={expenseTransaction.is_received}
                    // disabled={orderSupplierTransaction.status == 'COMPLETED'}
                    >
                        <MenuItem value="PENDING" sx={{ color: "orange" }}>PENDING</MenuItem>
                        <MenuItem value="APPROVED" sx={{ color: "green" }}>APPROVED</MenuItem>
                        <MenuItem value="REJECTED" sx={{ color: "red" }}>REJECTED</MenuItem>
                    </Select>
                    <br></br>
                    <br></br>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl sx={{ m: 0, minWidth: 420, minHeight: 70 }}>
                            <TextField
                                id="outlined-basic"
                                label="Details"
                                variant="outlined"
                                name="details"
                                value={expenseTransaction.details}
                                placeholder="Enter Details"
                                InputLabelProps={{ shrink: true }}
                                onChange={onChangeInput}
                                disabled={expenseTransaction.is_received}
                            />
                        </FormControl>
                    </Box>




                    {formErrors.amount && <p style={{ color: "red" }}>{formErrors.amount}</p>}
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                            <TextField
                                id="outlined-basic"
                                label="Amount"
                                variant="outlined"
                                name="amount"
                                placeholder="Enter Amount"
                                value={expenseTransaction.amount}
                                onChange={onChangeInput}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            ₱
                                        </InputAdornment>
                                    ),
                                }}
                                disabled={expenseTransactionFixed.payment_type_po_id != 0}
                            />
                        </FormControl>
                    </Box>

                    {expenseTransactionFixed.payment_type_po_id != 0 ?
                        <>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl sx={{ m: 0, minWidth: 420, minHeight: 70 }}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Payment Details"
                                        variant="outlined"
                                        name="Payment Type"
                                        value={expenseTransaction.payment_type_po_id == 1 ? expenseTransaction.bank_name : expenseTransaction.payment_term + " - " + expenseTransaction.bank_name + " " + expenseTransaction.account_name + " " + expenseTransaction.account_description + " " + expenseTransaction.account_number}
                                        placeholder="Enter Details"
                                        InputLabelProps={{ shrink: true }}
                                        disabled
                                    />
                                </FormControl>
                            </Box>
                        </>
                        :
                        <>

                            {formErrors.payment_term_id && <p style={{ color: "red" }}>{formErrors.payment_term_id}</p>}
                            <FormControl variant="standard"  >
                                <Autocomplete
                                    sx={{
                                        width: 300
                                    }}
                                    // {...defaultProps}
                                    options={paymentTermList}
                                    name="payment_term_id"
                                    className="mb-3"
                                    id="disable-close-on-select"
                                    onChange={handlePaymentTermChange}
                                    getOptionLabel={(paymentTermList) => paymentTermList.payment_term}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Choose Payment Term" variant="standard" />
                                    )}
                                />
                            </FormControl>
                            <br></br>
                        </>
                    }


                    {expenseTransaction.payment_term_id != 0 ? (<>

                        {expenseTransaction.payment_term_id == 2 || expenseTransaction.payment_term_id == 3 || expenseTransaction.payment_term_id == 4 ? (<>
                            {formErrors.payment_type_po_id && <p style={{ color: "red" }}>{formErrors.payment_type_po_id}</p>}
                            <Box
                                sx={{
                                    '& .MuiTextField-root': { width: '65ch' },
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <FormControl variant="standard" >
                                    <Autocomplete
                                        // {...defaultProps}
                                        options={paymentTypePoList}
                                        className="mb-3"
                                        id="disable-close-on-select"
                                        onChange={handlePaymentTypeChange}
                                        getOptionLabel={(paymentTypePoList) => paymentTypePoList.bank_name + " " + paymentTypePoList.account_name + "  " + paymentTypePoList.account_description + " - " + paymentTypePoList.account_number}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Choose Bank" variant="standard" />
                                        )}
                                    />
                                </FormControl>
                            </Box>
                        </>) :
                            ""}






                    </>) : ""}


                    {expenseTransaction.payment_term_id == 3 &&
                        <>
                            {formErrors.date && <p style={{ color: "red" }}>{formErrors.date}</p>}
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>{expenseTransaction.payment_term_id == 3 ? "Due Date" : "Date"}</Form.Label>
                                <Form.Control type="date" name="expense_date" onChange={onChangeInput} />
                            </Form.Group>
                        </>
                    }



                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Amount Received ? </Form.Label>
                        <Checkbox
                            checked={expenseTransaction.is_received === 0 ? false : true}
                            onChange={onChangePaymentTypedisabled}
                            inputProps={{ 'aria-label': 'controlled' }}
                            disabled={expenseTransaction.approval_status != 'APPROVED'}
                        />
                    </Form.Group>
                    {!expenseTransactionFixed.is_received &&
                        <>
                            <Button variant="primary"
                                disabled={isAddDisabled}
                                onClick={saveExpenseType}>
                                Submit
                            </Button>
                            <br></br>
                            <br></br>
                            {submitLoadingAdd &&
                                <LinearProgress color="warning" />
                            }
                        </>
                    }
                </div>

                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <TextField
                            id="outlined-basic"
                            label="Expense Type"
                            value={expenseTransaction.expense_type}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            disabled
                        />
                    </FormControl>
                </Box>



                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <TextField
                            id="outlined-basic"
                            label="Expense Category"
                            value={expenseTransaction.expense_category_name}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            disabled
                        />
                    </FormControl>
                </Box>
                {
                    role == 2 ? <>
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                                <TextField
                                    id="outlined-basic"
                                    label="Expense"
                                    value={expenseTransaction.expense_name}
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    disabled
                                />
                            </FormControl>
                        </Box>
                    </> :
                        <>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Expense"
                                        value="*********"
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        disabled
                                    />
                                </FormControl>
                            </Box>
                        </>
                }






                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <TextField
                            id="outlined-basic"
                            label="Requestor"
                            value={expenseTransaction.requestor_name}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            disabled
                        />
                    </FormControl>
                </Box>

                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <TextField
                            id="outlined-basic"
                            label="Date"
                            value={expenseTransaction.expense_date}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            disabled
                        />
                    </FormControl>
                </Box>





            </Form>
            <br></br>



        </div >
    )
}

export default EditExpenseTransaction
