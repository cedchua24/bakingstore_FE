import React, { useState, useEffect } from "react";
import { Button, Form } from 'react-bootstrap';
import ExpensesTypeV2Service from "./ExpensesTypeV2Service";
import LinearProgress from '@mui/material/LinearProgress';
import { Link } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

const AddExpenseTypeV2 = () => {

    useEffect(() => {
        fetchExpenseType();
    }, []);

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [customerList, setExpenseTypeList] = useState([]);
    const [expenseType, setExpenseType] = useState({
        id: 0,
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

            <legend align="center" style={{ fontWeight: 'bold' }} > Expenses Type List </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Expense Type</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        customerList.map((expenseType, index) => (
                            <tr key={expenseType.id} >
                                <td>{expenseType.id}</td>
                                <td>{expenseType.expense_type}</td>
                                <td>

                                    <Link variant="primary" to={"/customers/" + expenseType.id}   >
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

export default AddExpenseTypeV2
