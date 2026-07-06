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
import moment from "moment";


const ViewExpenseTransaction = () => {

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
        expense_type_id: 0,
        expense_category_id: 0,
        expense_id: 0,
        approval_status: '',
        is_received: null,
        dateTo: moment().format("YYYY-MM-DD"),
        dateFrom: moment().format("YYYY-MM-DD")
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
        ExpenseTransactionService.searchAllExpenseTransactionList(expenseTransaction)
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
            ExpenseTransactionService.searchAllExpenseTransactionList(expenseTransaction)
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
        ALL: 'black',
        PENDING: 'warning.main',
        APPROVED: 'success.main',
        REJECTED: 'error.main',
    };
    const statusColorTd = {
        ALL: 'black',
        PENDING: 'orange',
        APPROVED: 'green',
        REJECTED: 'red',
    };

    const totalSum = (numbers) => {
        // numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return numberFormat(numbers.reduce((acc, { amount }) => acc + amount, 0));
    }

    const groupedData = expenseTransactionList.reduce((acc, item) => {
        if (!acc[item.expense_type]) {
            acc[item.expense_type] = {
                items: [],
                total: 0
            };
        }

        acc[item.expense_type].items.push(item);
        acc[item.expense_type].total += Number(item.amount);

        return acc;
    }, {});

    return (
        <div>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>
            <Form>
                <div style={{ float: 'right', marginRight: 500 }}>
                    <Form.Group controlId="formBasicEmail" disabled>
                        <Form.Label>Total Expenses: </Form.Label>
                        <Form.Control type="text" value={totalSum(expenseTransactionList)} />
                    </Form.Group>
                </div>


                {formErrors.expense_type_id && <p style={{ color: "red" }}>{formErrors.expense_type_id}</p>}
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Expense Type</InputLabel>
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
                        <InputLabel id="demo-simple-select-label">Expense Category </InputLabel>
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
                        <InputLabel id="demo-simple-select-label">Expense  </InputLabel>
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
                                    <MenuItem value={data.id}>{data.is_hidden == 1 ? "*****" : data.expense_name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>

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
                    <MenuItem value="ALL" sx={{ color: "black" }}>ALL</MenuItem>
                    <MenuItem value="PENDING" sx={{ color: "orange" }}>PENDING</MenuItem>
                    <MenuItem value="APPROVED" sx={{ color: "green" }}>APPROVED</MenuItem>
                    <MenuItem value="REJECTED" sx={{ color: "red" }}>REJECTED</MenuItem>
                </Select>
                <br></br>
                <br></br>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Amount Received ? </Form.Label>

                    <Checkbox
                        onChange={onChangePaymentTypedisabled}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </Form.Group>


                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date From:</Form.Label>
                    <Form.Control type="date" name="dateFrom" value={expenseTransaction.dateFrom} onChange={onChangeInput} />
                </Form.Group>

                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date To:</Form.Label>
                    <Form.Control type="date" name="dateTo" value={expenseTransaction.dateTo} onChange={onChangeInput} />
                </Form.Group>



                <Button variant="primary"
                    disabled={isAddDisabled}
                    onClick={saveExpenseType}>
                    Search
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
                        <th>Code</th>
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
                        <th></th>
                    </tr>
                </thead>
                <br></br>
                <tbody>
                    {
                        Object.keys(groupedData).map((type, index) => (
                            <React.Fragment key={index}>

                                {/* GROUP HEADER */}
                                <tr style={{ backgroundColor: '#d3d3d3', fontWeight: 'bold' }}>
                                    <td colSpan="14" style={{ textAlign: 'center' }}>
                                        {type.toUpperCase()}
                                    </td>
                                </tr>

                                {/* ROWS */}
                                {
                                    groupedData[type].items.map((data) => (
                                        <tr key={data.id}>
                                            <td>{data.id}</td>
                                            <td>
                                                <span style={{ color: 'black' }}>
                                                    {data.chart_of_account_code}
                                                </span>
                                                <span style={{ color: 'red' }}>
                                                    {data.expense_type_code}
                                                </span>
                                                <span style={{ color: 'green' }}>
                                                    {data.expense_category_code}
                                                </span>
                                                <span style={{ color: 'gray' }}>
                                                    {data.expense_code}
                                                </span>
                                            </td>
                                            <td>{data.expense_type}</td>
                                            <td>{data.expense_category_name}</td>
                                            <td>{data.is_hidden == 1 ? "*****" : data.expense_name}</td>
                                            <td>{data.name}</td>
                                            <td>{data.approver_name}</td>
                                            <td style={{ color: statusColorTd[data.approval_status] }}>
                                                {data.approval_status}
                                            </td>
                                            <td>{numberFormat(data.amount)}</td>
                                            <td>
                                                {
                                                    data.payment_type_po_id == 0 ? " " :
                                                        data.payment_type_po_id == 1 ? data.bank_name :
                                                            data.payment_term + " - " + data.bank_name + " " +
                                                            data.account_name + " " + data.account_description + " " +
                                                            data.account_number
                                                }
                                            </td>
                                            <td>{data.details}</td>
                                            <td>
                                                {
                                                    data.is_received == 1
                                                        ? <CheckIcon style={{ color: 'green' }} />
                                                        : <CloseIcon style={{ color: 'red' }} />
                                                }
                                            </td>
                                            <td>{data.expense_date}</td>
                                            <td>
                                                <Link to={"/expensesV2/editExpenseTransaction/" + data.id}>
                                                    <Button variant={data.is_received ? "primary" : "success"}>
                                                        {data.is_received ? "View" : "Update"}
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                }

                                {/* GROUP TOTAL */}
                                <tr style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                                    <td colSpan="8" align="right">Total:</td>
                                    <td>{numberFormat(groupedData[type].total)}</td>
                                    <td colSpan="6"></td>
                                </tr>

                            </React.Fragment>
                        ))
                    }
                </tbody>
            </table>
            <br></br>
            <br></br>

        </div>
    )
}

export default ViewExpenseTransaction
