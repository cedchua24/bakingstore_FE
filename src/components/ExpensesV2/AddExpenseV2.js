import React, { useState, useEffect } from "react";
import { Button, Form } from 'react-bootstrap';
import ExpensesTypeV2Service from "./ExpensesTypeV2Service";
import ExpensesCategoryV2Service from "./ExpensesCategoryV2Service";
import ExpensesV2Service from "./ExpensesV2Service";
import ChartOfAccountService from "./ChartOfAccountService";
import LinearProgress from '@mui/material/LinearProgress';
import { Link } from "react-router-dom";
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';


const AddExpenseV2 = () => {

    useEffect(() => {
        fetchExpenseList();
        fetchChartOfAccount();
    }, []);

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });
    const [chartOfAccountList, setChartOfAccountList] = useState([]);

    const [expenseList, setExpenseList] = useState([]);
    const [expenseTypeList, setExpenseTypeList] = useState([]);
    const [expenseCategoryList, setExpenseCategoryList] = useState([]);


    const [expenseTransaction, setExpenseTransaction] = useState({
        id: 0,
        chart_of_account_id: '',
        expense_category_id: 0,
        expense_code: 0,
        expense_type_id: 0,
        expense_name: '',
        details: 0,
        is_hidden: 0,
        status: 0,
        updated_at: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const onChangeExpense = (e) => {
        setExpenseTransaction({ ...expenseTransaction, [e.target.name]: e.target.value });
    }

    const onChangeExpenseCategory = (e) => {
        setExpenseTransaction({ ...expenseTransaction, [e.target.name]: e.target.value });
    }

    const onChangeType = (e) => {
        setExpenseTransaction({ ...expenseTransaction, [e.target.name]: e.target.value });
        console.log('type', e.target.value);
        fetchCategoryExpenseList(e.target.value);
    }

    const onChangeChart = (e) => {
        setExpenseTransaction({ ...expenseTransaction, [e.target.name]: e.target.value });
        fetchExpenseType(e.target.value);
    }

    const onChangePaymentTypedisabled = (e) => {

        console.log("error", e.target.checked)
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setExpenseTransaction({ ...expenseTransaction, is_hidden: 1 });
            } else {
                setExpenseTransaction({ ...expenseTransaction, is_hidden: 0 });
            }
        } else {
            setExpenseTransaction({ ...expenseTransaction, is_hidden: e.target.value });
        }
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

    const fetchCategoryExpenseList = (typeId) => {
        ExpensesCategoryV2Service.fetchExpenseCategoryById(typeId)
            .then(response => {
                setExpenseCategoryList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchExpenseList = () => {
        ExpensesV2Service.getAll()
            .then(response => {
                setExpenseList(response.data);
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


    const validate = (values) => {
        const errors = {};
        if (expenseTransaction.expense_type == 0) {
            errors.expense_type = "Expense Type is Required!";
        }
        return errors;
    }


    const saveExpense = () => {

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
            ExpensesV2Service.sanctum().then(response => {
                ExpensesV2Service.create(expenseTransaction)
                    .then(response => {
                        fetchExpenseList();
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

    const formatStatementDate = (date) => {
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }


    return (
        <div>
            <Form>
                <Stack sx={{ width: '100%' }} spacing={2}>
                    {validator.isShow &&
                        <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                    }
                </Stack>
                <br></br>
                {formErrors.chart_of_account_id && <p style={{ color: "red" }}>{formErrors.chart_of_account_id}</p>}
                <Form.Select
                    aria-label="Default select example"
                    className="mb-3"
                    name="chart_of_account_id"
                    onChange={onChangeChart}
                >
                    <option value="0">Select Type</option>
                    {
                        chartOfAccountList.map((data, index) => (
                            <option
                                key={data.id}
                                value={data.id}
                                disabled={data.status == 1}
                            >
                                {data.chart_of_account_name + "     - " + data.chart_of_account_code}
                            </option>
                        ))
                    }
                </Form.Select>
                {formErrors.expense_type_id && <p style={{ color: "red" }}>{formErrors.expense_type_id}</p>}
                <Form.Select aria-label="Default select example" className="mb-3" name="expense_type_id" onChange={onChangeType} >
                    <option>Select Expense Type</option>
                    {
                        expenseTypeList.map((data, index) => (
                            <option value={data.id}>{data.expense_type + " - "}{data.chart_of_account_code}{data.expense_type_code}</option>
                        ))
                    }
                </Form.Select>

                {formErrors.expense_category_id && <p style={{ color: "red" }}>{formErrors.expense_category_id}</p>}
                <Form.Select aria-label="Default select example" className="mb-3" name="expense_category_id" onChange={onChangeExpenseCategory} >
                    <option>Select Expense Category</option>
                    {
                        expenseCategoryList.map((data, index) => (
                            <option value={data.id}>{data.expense_category_name + " - "}{data.expense_category_code}</option>
                        ))
                    }
                </Form.Select>

                {formErrors.expense_type && <p style={{ color: "red" }}>{formErrors.expense_name}</p>}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Expense *</Form.Label>
                    <Form.Control type="text" value={expenseTransaction.expense_name} name="expense_name" placeholder="Enter Expense" onChange={onChangeExpense} />

                </Form.Group>

                {formErrors.expense_code && (
                    <p style={{ color: "red" }}>{formErrors.expense_code}</p>
                )}
                <Form.Select
                    className="mb-3"
                    name="expense_code"
                    onChange={onChangeExpenseCategory}
                >
                    <option value="">Select Expense Code</option>
                    {
                        Array.from({ length: 99 }, (_, i) => {
                            const value = String(i + 1).padStart(2, '0'); // 01, 02 ... 99
                            return (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            );
                        })
                    }
                </Form.Select>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Hidden ? </Form.Label>

                    <Checkbox
                        checked={expenseTransaction.is_hidden === 0 ? false : true}
                        onChange={onChangePaymentTypedisabled}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </Form.Group>

                <Button variant="primary"
                    disabled={isAddDisabled}
                    onClick={saveExpense}>
                    Submit
                </Button>
                <br></br>
                <br></br>
                {submitLoadingAdd &&
                    <LinearProgress color="warning" />
                }
            </Form>
            <br></br>

            <legend align="center" style={{ fontWeight: 'bold' }} > Expenses List </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Code</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Expense</th>
                        <th>Hidden</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        expenseList.map((data, index) => (
                            <tr key={data.id} >
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
                                <td>{data.expense_name}</td>
                                <td>{data.is_hidden === 1 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
                                <td>

                                    {/* <Link variant="primary" to={"/customers/" + data.id}   >
                                        <Button variant="primary" >
                                            Update
                                        </Button>
                                    </Link> */}
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

export default AddExpenseV2
