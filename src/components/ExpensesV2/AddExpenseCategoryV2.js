import React, { useState, useEffect } from "react";
import { Button, Form } from 'react-bootstrap';
import ExpensesTypeV2Service from "./ExpensesTypeV2Service";
import ExpensesCategoryV2Service from "./ExpensesCategoryV2Service";
import LinearProgress from '@mui/material/LinearProgress';
import { Link } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

const AddExpenseCategoryV2 = () => {

    useEffect(() => {
        fetchExpenseType();
        fetchCategoryExpenseList();
    }, []);

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [expenseTypeList, setExpenseTypeList] = useState([]);
    const [expenseCategoryList, setExpenseCategoryList] = useState([]);
    const [expenseCategory, setExpenseCategory] = useState({
        id: 0,
        expense_type_id: 0,
        expense_category_name: 0,
        status: 0,
        updated_at: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const onChangeExpenseCategory = (e) => {
        setExpenseCategory({ ...expenseCategory, [e.target.name]: e.target.value });
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

    const fetchCategoryExpenseList = () => {
        ExpensesCategoryV2Service.getAll()
            .then(response => {
                setExpenseCategoryList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const validate = (values) => {
        const errors = {};
        if (expenseCategory.expense_type_id == 0) {
            errors.expense_type_id = "Expense Type is Required!";
        }
        if (expenseCategory.expense_category_name == 0) {
            errors.expense_category_name = "Category Name is Required!";
        }
        return errors;
    }


    const saveExpenseType = () => {

        console.log('expenseCategory', expenseCategory);

        console.log("count: ", Object.keys(validate(expenseCategory)).length);
        console.log("validate: ", validate(expenseCategory));
        setFormErrors(validate(expenseCategory));
        if (Object.keys(validate(expenseCategory)).length > 0) {
            console.log("Has Validation: ");

        } else {
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            console.log(expenseCategory);
            ExpensesCategoryV2Service.sanctum().then(response => {
                ExpensesCategoryV2Service.create(expenseCategory)
                    .then(response => {
                        fetchCategoryExpenseList();
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
                            message: "expenseCategory Already Exists",
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
                <Form.Select aria-label="Default select example" className="mb-3" name="expense_type_id" onChange={onChangeExpenseCategory} >
                    <option>Select Expense Type</option>
                    {
                        expenseTypeList.map((data, index) => (
                            <option value={data.id}>{data.expense_type}</option>
                        ))
                    }
                </Form.Select>

                {formErrors.expense_category_name && <p style={{ color: "red" }}>{formErrors.expense_category_name}</p>}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Expense Category *</Form.Label>
                    <Form.Control type="text" name="expense_category_name" placeholder="Enter Expense Category" onChange={onChangeExpenseCategory} />

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

            <legend align="center" style={{ fontWeight: 'bold' }} > Expenses Category List </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Expense Type</th>
                        <th>Expense Category</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        expenseCategoryList.map((data, index) => (
                            <tr key={data.id} >
                                <td>{data.id}</td>
                                <td>{data.expense_type}</td>
                                <td>{data.expense_category_name}</td>
                                <td>

                                    <Link variant="primary" to={"/customers/" + data.id}   >
                                        <Button variant="primary" >
                                            Update
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

export default AddExpenseCategoryV2
