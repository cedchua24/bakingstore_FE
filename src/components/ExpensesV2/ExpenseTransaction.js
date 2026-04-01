import React, { useState, useEffect } from "react";
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


const ExpenseTransaction = () => {

    useEffect(() => {
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

    const [expenseTransaction, setExpenseTransaction] = useState({
        id: 0,
        shop_id: 5,
        expense_type_id: 0,
        expense_category_id: 0,
        expense_id: 0,
        user_id: 0,
        approver_id: 0,
        approval_status: '',
        payment_type_po_id: 0,
        is_received: 0,
        amount: 0,
        balance_type_id: 3,
        transaction: '',
        name: 'Expense transaction',
        details: '',
        expense_date: '',
        status: 0,
        updated_at: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

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

    const onChangeExpenseCategory = (e) => {

        setExpenseTransaction({
            ...expenseTransaction,
            expense_category_id: e.target.value,
            expense_id: 0
        });
        console.log("error", expenseTransaction)
        fetchExpenseList(e.target.value)
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

    const onChangeExpense = (e) => {
        const selectedId = e.target.value;

        const selectedExpense = expenseList.find(
            (item) => item.id === selectedId
        );

        setExpenseTransaction({
            ...expenseTransaction,
            expense_id: selectedId,
            transaction: selectedExpense?.expense_name || ""
        });
    };

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




    const validate = (values) => {
        const errors = {};
        if (expenseTransaction.expense_type_id == 0) {
            errors.expense_type_id = "Expense Type is Required!";
        }
        if (expenseTransaction.expense_category_id == 0) {
            errors.expense_category_id = "Category  is Required!";
        }
        if (expenseTransaction.expense_id == 0) {
            errors.expense_id = "Expense Name is Required!";
        }
        if (expenseTransaction.amount == 0) {
            errors.amount = "Amount is Required!";
        }
        if (expenseTransaction.user_id == 0) {
            errors.user_id = "Requestor is Required!";
        }
        if (expenseTransaction.approver_id == 0) {
            errors.approver_id = "Approver is Required!";
        }
        if (expenseTransaction.approval_status.length == 0) {
            errors.approval_status = "Approval Status is Required!";
        }

        if (expenseTransaction.expense_date.length == 0) {
            errors.expense_date = "Date is Required!";
        }

        // if (expenseTransaction.payment_term_id == 0) {
        //     errors.payment_term_id = "Payment Term is Required!";
        // }
        // if (expenseTransaction.payment_type_po_id == 0) {
        //     errors.payment_type_po_id = "Payment Type is Required!";
        // }

        return errors;
    }


    const saveExpenseType = () => {

        console.log('expenseTransaction', expenseTransaction);

        console.log("count: ", Object.keys(validate(expenseTransaction)).length);
        console.log("validate: ", validate(expenseTransaction));
        setFormErrors(validate(expenseTransaction));
        if (Object.keys(validate(expenseTransaction)).length > 0) {
            console.log("Has Validation: ");

        } else {
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            console.log(expenseTransaction);
            ExpenseTransactionService.sanctum().then(response => {
                ExpenseTransactionService.create(expenseTransaction)
                    .then(response => {
                        fetchExpenseTransactionList();
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                        setValidator({
                            severity: 'success',
                            message: response.data.message,
                            isShow: true,
                        });
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

                {formErrors.expense_type_id && <p style={{ color: "red" }}>{formErrors.expense_type_id}</p>}
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Expense Type <span style={{ color: 'red' }}>*</span></InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Expense Type"
                            value={expenseTransaction.expense_type_id}
                            name="expense_type_id"
                            onChange={onChangeType}
                        >
                            <MenuItem value={0} disabled></MenuItem>
                            {
                                expenseTypeList.map((data, index) => (
                                    <MenuItem value={data.id}>{data.expense_type}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>


                {formErrors.expense_category_id && <p style={{ color: "red" }}>{formErrors.expense_category_id}</p>}
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Expense Category  <span style={{ color: 'red' }}>*</span></InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Expense Category"
                            value={expenseTransaction.expense_category_id}
                            name="expense_category_id"
                            onChange={onChangeExpenseCategory}
                        >
                            <MenuItem value={0} disabled></MenuItem>
                            {
                                expenseCategoryList.map((data, index) => (
                                    <MenuItem value={data.id}>{data.expense_category_name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>


                {formErrors.expense_id && <p style={{ color: "red" }}>{formErrors.expense_id}</p>}
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Expense  <span style={{ color: 'red' }}>*</span></InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Expense"
                            name="expense_id"
                            value={expenseTransaction.expense_id}
                            onChange={onChangeExpense}
                        >
                            <MenuItem value={0} disabled></MenuItem>
                            {
                                expenseList.map((data, index) => (
                                    <MenuItem value={data.id}>{data.expense_name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>


                {formErrors.amount && <p style={{ color: "red" }}>{formErrors.amount}</p>}
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <TextField
                            id="outlined-basic"
                            label={
                                <>
                                    Amount <span style={{ color: 'red' }}>*</span>
                                </>
                            }
                            variant="outlined"
                            name="amount"
                            placeholder="Enter Amount"
                            onChange={onChangeInput}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        ₱
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>
                </Box>

                {formErrors.user_id && <p style={{ color: "red" }}>{formErrors.user_id}</p>}
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Requestor <span style={{ color: 'red' }}>*</span></InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Requestor"
                            name="user_id"
                            onChange={onChangeInput}
                        >
                            {
                                requestorList.map((requestor, index) => (
                                    <MenuItem value={requestor.id}>{requestor.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>

                {formErrors.approver_id && <p style={{ color: "red" }}>{formErrors.approver_id}</p>}
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Approver <span style={{ color: 'red' }}>*</span></InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Approver"
                            name="approver_id"
                            onChange={onChangeInput}
                        >
                            {
                                requestorList.map((requestor, index) => (
                                    <MenuItem value={requestor.id}>{requestor.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>

                {formErrors.approval_status && <p style={{ color: "red" }}>{formErrors.approval_status}</p>}
                <InputLabel id="demo-simple-select-label">Select Status <span style={{ color: 'red' }}>*</span></InputLabel>
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
                // disabled={orderSupplierTransaction.status == 'COMPLETED'}
                >
                    <MenuItem value="PENDING" sx={{ color: "orange" }}>PENDING</MenuItem>
                    <MenuItem value="APPROVED" sx={{ color: "green" }}>APPROVED</MenuItem>
                    <MenuItem value="REJECTED" sx={{ color: "red" }}>REJECTED</MenuItem>
                </Select>
                <br></br>
                <br></br>

                {formErrors.expense_date && <p style={{ color: "red" }}>{formErrors.expense_date}</p>}
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>{expenseTransaction.payment_term_id == 3 ? "Due Date" : "Date"}<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control type="date" name="expense_date" onChange={onChangeInput} />
                </Form.Group>

                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 420, minHeight: 70 }}>
                        <TextField
                            id="outlined-basic"
                            label="Details"
                            variant="outlined"
                            name="details"
                            placeholder="Enter Details"
                            onChange={onChangeInput}
                        />
                    </FormControl>
                </Box>





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
                    </>) : ""}




                </>) : ""}

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Amount Received ? </Form.Label>

                    <Checkbox
                        checked={expenseTransaction.is_received === 0 ? false : true}
                        onChange={onChangePaymentTypedisabled}
                        inputProps={{ 'aria-label': 'controlled' }}
                        disabled={expenseTransaction.approval_status != 'APPROVED'}
                    />
                </Form.Group>



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
            </Form>
            <br></br>

            <legend align="center" style={{ fontWeight: 'bold' }} > Expense Transaction </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Expense</th>
                        <th>Requestor</th>
                        <th>Approver</th>
                        <th>Approval Status</th>
                        <th>Amount</th>
                        <th>Bank</th>
                        <th>Details</th>
                        <th>Amount Received</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        expenseTransactionList.map((data, index) => (
                            <tr key={data.id} >
                                <td>{data.id}</td>
                                <td>{data.expense_type}</td>
                                <td>{data.expense_category_name}</td>
                                <td>{data.expense_name}</td>
                                <td>{data.name}</td>
                                <td>{data.approver_name}</td>
                                <td style={{ color: statusColorTd[data.approval_status] }}>{data.approval_status}</td>
                                <td>{numberFormat(data.amount)}</td>
                                <td>{data.payment_type_po_id == 0 ? " " : data.payment_type_po_id == 1 ? data.bank_name : data.payment_term + " - " + data.bank_name + " " + data.account_name + " " + data.account_description + " " + data.account_number}</td>
                                <td>{data.details}</td>
                                <td>{data.is_received == 1 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
                                <td>{data.expense_date}</td>

                                <td>
                                    <Link to={"/expensesV2/editExpenseTransaction/" + data.id}>
                                        <Button
                                            variant={data.is_received ? "primary" : "success"}
                                        >
                                            {data.is_received ? "View" : "Update"}
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>

        </div>
    )
}

export default ExpenseTransaction
