import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import ExpensesCategoryV2Service from "./ExpensesCategoryV2Service";
import ExpensesTypeV2Service from "./ExpensesTypeV2Service";
import LinearProgress from '@mui/material/LinearProgress';
import { Link } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';

const ViewExpenseCategory = () => {

    useEffect(() => {
        fetchExpenseCategory(0);
        fetchExpenseType();
    }, []);

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [expenseCategoryList, setExpenseCategoryList] = useState([]);
    const [expenseTypeList, setExpenseTypeList] = useState([]);


    const [expenseType, setExpenseType] = useState({
        id: 0
    });

    const [formErrors, setFormErrors] = useState({});
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const onChangeExpenseType = (e) => {
        setExpenseType({ ...expenseType, [e.target.name]: e.target.value });
    }

    const fetchExpenseCategory = ($id) => {
        ExpensesCategoryV2Service.fetchExpenseCategoryById($id)
            .then(response => {
                setExpenseCategoryList(response.data);
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




    const validate = (values) => {
        const errors = {};
        if (expenseType.expense_type == 0) {
            errors.expense_type = "Expense Type is Required!";
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
            ExpensesCategoryV2Service.sanctum().then(response => {
                ExpensesCategoryV2Service.fetchExpenseCategoryById(expenseType.id)
                    .then(response => {
                        setExpenseCategoryList(response.data);
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
                {formErrors.expense_type_id && <p style={{ color: "red" }}>{formErrors.expense_type_id}</p>}
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Expense Type </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Expense Type"
                            name="id"
                            onChange={onChangeExpenseType}
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

            <legend align="center" style={{ fontWeight: 'bold' }} > Expenses Category</legend>
            {/* <p align="center" >{expenseCategoryList.name}</p> */}
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Code</th>
                        <th>Type</th>
                        <th>Category Name</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        expenseCategoryList.map((expenseType, index) => (
                            <tr key={expenseType.id} >
                                <td>{expenseType.id}</td>
                                <td>
                                    <span style={{ color: 'black' }}>
                                        {expenseType.chart_of_account_code}
                                    </span>
                                    <span style={{ color: 'red' }}>
                                        {expenseType.expense_type_code}
                                    </span>
                                    <span style={{ color: 'green' }}>
                                        {expenseType.expense_category_code}
                                    </span>
                                </td>
                                <td>{expenseType.expense_type}</td>
                                <td>{expenseType.expense_category_name}</td>
                                <td>

                                    <Link variant="primary" to={"/expensesV2/viewExpenseTypeCategoryList/" + expenseType.expense_type_id + "/" + expenseType.id}   >
                                        <Button variant="primary" >
                                            View
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

export default ViewExpenseCategory
