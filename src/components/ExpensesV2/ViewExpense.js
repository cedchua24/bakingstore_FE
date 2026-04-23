import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import ExpensesV2Service from "./ExpensesV2Service";
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
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const ViewExpense = () => {

    useEffect(() => {
        fetchExpense(0);
        fetchExpenseType();
    }, []);

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [expenseList, setExpenseList] = useState([]);
    const [expenseCategoryList, setExpenseCategoryList] = useState([]);
    const [expenseSearchList, setExpenseTypeList] = useState([]);


    const [expenseSearch, setExpenseSearch] = useState({
        expense_type_id: 0,
        expense_category_id: 0
    });

    const [formErrors, setFormErrors] = useState({});
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const onChangeExpenseSearch = (e) => {
        setExpenseSearch({ ...expenseSearch, [e.target.name]: e.target.value });
        fetchCategoryExpenseList(e.target.value);
    }

    const onChangeCategory = (e) => {
        setExpenseSearch({ ...expenseSearch, [e.target.name]: e.target.value });
    }



    const fetchExpense = ($id) => {
        ExpensesV2Service.fetchExpenseV2ById($id)
            .then(response => {
                setExpenseList(response.data);
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
        if (expenseSearch.expense_type == 0) {
            errors.expense_type = "Expense Type is Required!";
        }
        return errors;
    }


    const saveExpenseType = () => {

        console.log('expenseSearch', expenseSearch);

        console.log("count: ", Object.keys(validate(expenseSearch)).length);
        console.log("validate: ", validate(expenseSearch));
        setFormErrors(validate(expenseSearch));
        if (Object.keys(validate(expenseSearch)).length > 0) {
            console.log("Has Validation: ");

        } else {
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            console.log(expenseSearch);
            ExpensesV2Service.sanctum().then(response => {
                ExpensesV2Service.fetchExpenseByTypeaAndCategory(expenseSearch)
                    .then(response => {
                        setExpenseList(response.data);
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
                            message: "expenseSearch Already Exists",
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
                            name="expense_type_id"
                            onChange={onChangeExpenseSearch}
                        >
                            <MenuItem value={0} disabled></MenuItem>
                            {
                                expenseSearchList.map((data, index) => (
                                    <MenuItem value={data.id}>{data.expense_type}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>
                <br></br>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Expense Category  </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Expense Category"
                            name="expense_category_id"
                            onChange={onChangeCategory}
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

            <legend align="center" style={{ fontWeight: 'bold' }} > Expenses List</legend>
            {/* <p align="center" >{expenseList.name}</p> */}
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Code</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Expense Name</th>
                        <th>Hidden</th>
                        {/* <th></th> */}
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
                                {/* <td>

                                    <Link variant="primary" to={"/expensesV2/viewExpenseTypeCategoryList/" + expenseSearch.expense_type_id + "/" + expenseSearch.id}   >
                                        <Button variant="primary" >
                                            View
                                        </Button>
                                    </Link>
                                </td> */}
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>

        </div>
    )
}

export default ViewExpense
