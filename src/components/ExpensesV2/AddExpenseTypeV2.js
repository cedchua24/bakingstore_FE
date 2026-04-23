import React, { useState, useEffect } from "react";
import { Button, Form } from 'react-bootstrap';
import ExpensesTypeV2Service from "./ExpensesTypeV2Service";
import ChartOfAccountService from "./ChartOfAccountService";
import LinearProgress from '@mui/material/LinearProgress';
import { Link } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

const AddExpenseTypeV2 = () => {

    useEffect(() => {
        fetchExpenseType();
        fetchChartOfAccount();
    }, []);

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [chartOfAccountList, setChartOfAccountList] = useState([]);

    const [customerList, setExpenseTypeList] = useState([]);
    const [expenseType, setExpenseType] = useState({
        id: 0,
        chart_of_account_id: '',
        expense_type_code: 0,
        expense_type: '',
        status: 0,
        updated_at: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const onChangeExpenseType = (e) => {
        setExpenseType({ ...expenseType, [e.target.name]: e.target.value });
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

    const fetchChartOfAccount = () => {
        ChartOfAccountService.getAll()
            .then(response => {
                setChartOfAccountList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const validate = (values) => {
        const errors = {};
        if (expenseType.expense_type == 0) {
            errors.expense_type = "Expense Type is Required!";
        }
        if (expenseType.chart_of_account_id == 0) {
            errors.chart_of_account_id = "Account Type is Required!";
        }


        return errors;
    }


    const saveExpenseType = () => {

        console.log('expenseType', expenseType);

        console.log("count: ", Object.keys(validate(expenseType)).length);
        console.log("validate: ", validate(expenseType));
        setFormErrors(validate(expenseType));
        if (Object.keys(validate(expenseType)).length > 0) {
            console.log("Has Validation: ");

        } else {
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            console.log(expenseType);
            ExpensesTypeV2Service.sanctum().then(response => {
                ExpensesTypeV2Service.create(expenseType)
                    .then(response => {
                        fetchExpenseType();
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
                            message: "expenseType Already Exists",
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
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>
            <Form>
                {formErrors.chart_of_account_id && <p style={{ color: "red" }}>{formErrors.chart_of_account_id}</p>}
                <Form.Select
                    aria-label="Default select example"
                    className="mb-3"
                    name="chart_of_account_id"
                    onChange={onChangeExpenseType}
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
                {/* Expense Type Code */}
                {formErrors.expense_type_code && (
                    <p style={{ color: "red" }}>{formErrors.expense_type_code}</p>
                )}

                <Form.Select
                    className="mb-3"
                    name="expense_type_code"
                    onChange={onChangeExpenseType}
                >
                    <option value="">Select Expense Type Code</option>
                    {
                        Array.from({ length: 10 }, (_, i) => (
                            <option key={i} value={i}>
                                {i}
                            </option>
                        ))
                    }
                </Form.Select>
                {formErrors.expense_type && <p style={{ color: "red" }}>{formErrors.expense_type}</p>}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Expense Type *</Form.Label>
                    <Form.Control type="text" value={expenseType.expense_type} name="expense_type" placeholder="Enter Expense Type" onChange={onChangeExpenseType} />

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

            <legend align="center" style={{ fontWeight: 'bold' }} > Expense Type List </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Code</th>
                        <th>Expense Type</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        customerList.map((expenseType, index) => (
                            <tr key={expenseType.id} >
                                <td>{expenseType.id}</td>
                                <td>
                                    <span style={{ color: 'black' }}>
                                        {expenseType.chart_of_account_code}
                                    </span>
                                    <span style={{ color: 'red' }}>
                                        {expenseType.expense_type_code}
                                    </span>
                                </td>
                                <td>{expenseType.expense_type}</td>
                                <td>

                                    {/* <Link variant="primary" to={"/customers/" + expenseType.id}   >
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

export default AddExpenseTypeV2
