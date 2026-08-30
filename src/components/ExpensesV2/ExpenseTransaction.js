import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { Button, Form } from 'react-bootstrap';
import ExpensesTypeV2Service from "./ExpensesTypeV2Service";
import ExpensesCategoryV2Service from "./ExpensesCategoryV2Service";
import ExpensesV2Service from "./ExpensesV2Service";
import ExpenseTransactionService from "./ExpenseTransactionService";
import PaymentTypePoService from "../OtherService/PaymentTypePoService";
import PaymentTermService from "../OtherService/PaymentTermService";
import ChartOfAccountService from "./ChartOfAccountService";
import UserService from '../User/UserService.service'
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from "react-router-dom";
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
import './ExpenseTransaction.css';


const ExpenseTransaction = () => {
    const navigate = useNavigate();

    const [paymentTermList, setPaymentTermList] = useState([]);
    const [paymentTypePoList, setPaymentTypePoList] = useState([]);

    useEffect(() => {
        fetchChartOfAccount();
        fetchPaymentTerm();
        fetchRequestor();
    }, []);

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [chartOfAccountList, setChartOfAccountList] = useState([]);
    const [expenseTypeList, setExpenseTypeList] = useState([]);
    const [expenseCategoryList, setExpenseCategoryList] = useState([]);
    const [expenseList, setExpenseList] = useState([]);
    const [requestorList, setRequestorList] = useState([]);

    const [expenseTransaction, setExpenseTransaction] = useState({
        id: 0,
        shop_id: 5,
        chart_of_account_id: 0,
        expense_type_id: 0,
        expense_category_id: 0,
        expense_id: 0,
        user_id: 0,
        approver_id: 0,
        approval_status: 'PENDING',
        payment_term_id: 0,
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
        UserService.fetchUserList()
            .then(response => {
                setRequestorList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchExpenseType = ($id) => {
        ExpensesTypeV2Service.fetchTypeByChart($id)
            .then(response => {
                setExpenseTypeList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchChartOfAccount = () => {
        ChartOfAccountService.getAll()
            .then(response => {
                setChartOfAccountList(response.data);
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

    const onChangeChart = (e) => {
        setExpenseTransaction({ ...expenseTransaction, [e.target.name]: e.target.value });
        fetchExpenseType(e.target.value);
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

    const fetchPaymentTerm = () => {
        PaymentTermService.getAll()
            .then(response => setPaymentTermList(Array.isArray(response.data) ? response.data : []))
            .catch(e => console.log("error", e));
    }

    const onChangePaymentReceived = (e) => {
        setExpenseTransaction((current) => ({ ...current, is_received: e.target.checked ? 1 : 0 }));
    }

    const handlePaymentTermChange = (e, value) => {
        const paymentTermId = Number(value?.id || 0);
        setExpenseTransaction((current) => ({
            ...current,
            payment_term_id: paymentTermId,
            payment_type_po_id: paymentTermId === 1 ? 1 : paymentTermId === 5 ? 2 : 0,
            is_received: paymentTermId === 0 ? 0 : current.is_received,
        }));
        setPaymentTypePoList([]);
        if (paymentTermId) {
            PaymentTypePoService.findByCategory(paymentTermId)
                .then(response => setPaymentTypePoList(Array.isArray(response.data) ? response.data : []))
                .catch(e => console.log("error", e));
        }
    }

    const handlePaymentTypeChange = (e, value) => {
        setExpenseTransaction((current) => ({ ...current, payment_type_po_id: Number(value?.id || 0) }));
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
        if (
            Number(expenseTransaction.user_id) > 0 &&
            Number(expenseTransaction.approver_id) > 0 &&
            Number(expenseTransaction.user_id) === Number(expenseTransaction.approver_id)
        ) {
            errors.approver_id = "Requestor and Approver must be different users!";
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
        if (
            Number(expenseTransaction.payment_term_id) !== 0 &&
            Number(expenseTransaction.payment_type_po_id) === 0
        ) {
            errors.payment_type_po_id = "Choose Bank is required when a Payment Term is selected!";
        }
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
                        setExpenseTransaction({
                            id: 0,
                            shop_id: 5,
                            chart_of_account_id: 0,
                            expense_type_id: 0,
                            expense_category_id: 0,
                            expense_id: 0,
                            user_id: 0,
                            approver_id: 0,
                            approval_status: 'PENDING',
                            payment_term_id: 0,
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
                        setExpenseTypeList([]);
                        setExpenseCategoryList([]);
                        setExpenseList([]);
                        setPaymentTypePoList([]);
                        setFormErrors({});
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                        setValidator({
                            severity: 'success',
                            message: response.data.message,
                            isShow: true,
                        });
                        navigate('/expensesV2/viewExpenseTransactionApproval');
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


    const formatStatementDate = (date) => {
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }

    return (
        <div className="et-page">
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>
            <Form className="et-form">
                <header className="et-form-header"><span>New transaction</span><h1>Add Expense Transaction</h1><p>Enter the expense details, assign approval, and optionally add payment information.</p></header>
                <div className="et-form-grid">
                <section className="et-form-column">
                    <div className="et-section-heading"><span>01</span><div><strong>Expense details</strong><small>Classification, amount, and requestor</small></div></div>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="chart-select-label">
                            Chart of Account <span style={{ color: 'red' }}>*</span>
                        </InputLabel>

                        <Select
                            labelId="chart-select-label"
                            id="chart-select"
                            label="Chart of Account"
                            name="chart_of_account_id"
                            value={expenseTransaction.chart_of_account_id}
                            onChange={onChangeChart}
                        >
                            <MenuItem value={0} disabled>
                                Select Type
                            </MenuItem>

                            {
                                chartOfAccountList.map((data) => (
                                    <MenuItem
                                        key={data.id}
                                        value={data.id}
                                        disabled={data.status == 1}
                                    >
                                        {data.chart_of_account_name + " - " + data.chart_of_account_code}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>

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
                                    <MenuItem value={data.id}>{data.expense_type + " - "}{data.chart_of_account_code}{data.expense_type_code}</MenuItem>
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
                                    <MenuItem value={data.id}>{data.expense_category_name + " - "}{data.expense_category_code}</MenuItem>
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
                                    <MenuItem value={data.id}>{data.expense_name + " - "}{data.expense_code}</MenuItem>
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
                            value={expenseTransaction.amount || ''}
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
                            value={expenseTransaction.user_id}
                            onChange={onChangeInput}
                        >
                            <MenuItem value={0} disabled>Select requestor</MenuItem>
                            {
                                requestorList.map((requestor) => (
                                    <MenuItem key={requestor.id} value={requestor.id} disabled={Number(requestor.id) === Number(expenseTransaction.approver_id)}>{requestor.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>

                </section>
                <section className="et-form-column et-approval-column">
                    <div className="et-section-heading"><span>02</span><div><strong>Approval & payment</strong><small>Status, date, and optional payment information</small></div></div>
                {formErrors.approver_id && <p style={{ color: "red" }}>{formErrors.approver_id}</p>}
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Approver <span style={{ color: 'red' }}>*</span></InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Approver"
                            name="approver_id"
                            value={expenseTransaction.approver_id}
                            onChange={onChangeInput}
                        >
                            <MenuItem value={0} disabled>Select approver</MenuItem>
                            {
                                requestorList.map((requestor) => (
                                    <MenuItem key={requestor.id} value={requestor.id} disabled={Number(requestor.id) === Number(expenseTransaction.user_id)}>{requestor.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>

                <TextField
                    fullWidth
                    label="Approval Status"
                    value="PENDING"
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiInputBase-input': { color: '#a86410', fontWeight: 800 } }}
                />
                <br></br>
                <br></br>

                {formErrors.expense_date && <p style={{ color: "red" }}>{formErrors.expense_date}</p>}
                <Form.Group className="mb-3" controlId="expenseDate" style={{ width: '100%' }}>
                    <Form.Label>{expenseTransaction.payment_term_id == 3 ? "Due Date" : "Date"}<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control type="date" name="expense_date" value={expenseTransaction.expense_date} onChange={onChangeInput} style={{ width: '100%', minHeight: 48, padding: '11px 13px' }} />
                </Form.Group>

                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 420, minHeight: 70 }}>
                        <TextField
                            id="outlined-basic"
                            label="Details"
                            variant="outlined"
                            name="details"
                            placeholder="Enter Details"
                            value={expenseTransaction.details}
                            onChange={onChangeInput}
                        />
                    </FormControl>
                </Box>

                <>
                    <FormControl variant="standard">
                        <Autocomplete
                            sx={{ width: 300 }}
                            options={paymentTermList}
                            value={paymentTermList.find((item) => Number(item.id) === Number(expenseTransaction.payment_term_id)) || null}
                            onChange={handlePaymentTermChange}
                            getOptionLabel={(option) => option.payment_term || ''}
                            renderInput={(params) => <TextField {...params} label="Choose Payment Term (Optional)" variant="standard" />}
                        />
                    </FormControl>
                    <br />

                    {[2, 3, 4].includes(Number(expenseTransaction.payment_term_id)) && <>
                    {formErrors.payment_type_po_id && <p style={{ color: 'red' }}>{formErrors.payment_type_po_id}</p>}
                    <Box
                        sx={{ '& .MuiTextField-root': { width: '65ch' } }}
                        noValidate
                        autoComplete="off"
                    >
                        <FormControl variant="standard">
                            <Autocomplete
                                options={paymentTypePoList}
                                onChange={handlePaymentTypeChange}
                                getOptionLabel={(option) => `${option.bank_name || ''} ${option.account_name || ''} ${option.account_description || ''} - ${option.account_number || ''}`.trim()}
                                renderInput={(params) => <TextField {...params} required label="Choose Bank" variant="standard" />}
                            />
                        </FormControl>
                    </Box>
                    </>}

                    <Form.Group className="mb-3" controlId="amountReceived">
                        <Form.Label>
                            Amount Received? <small className="text-muted">(Optional)</small>
                        </Form.Label>
                        <Checkbox
                            checked={Number(expenseTransaction.is_received) === 1}
                            onChange={onChangePaymentReceived}
                            inputProps={{ 'aria-label': 'Amount received' }}
                            disabled={Number(expenseTransaction.payment_term_id) === 0}
                        />
                    </Form.Group>
                </>

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
                </section>
                </div>
            </Form>
        </div>
    )
}

export default ExpenseTransaction
