import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import ExpensesService from "./ExpensesService";
import ExpensesTypeService from "../ExpensesType/ExpensesTypeService";

import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const EditExpenses = () => {

    const { id } = useParams();

    useEffect(() => {
        fetchExpenses(id);
        fetchExpensesTypeList();
        fetchExpenseTypeList();
    }, []);


    const [expenses, setExpenses] = useState({
        id: 0,
        expenses_name: '',
        expenses_category_name: '',
        details: '',
        amount: 0,
        date: ''
    });

    const [message, setMessage] = useState(false);
    const [expensesList, setExpensesList] = useState([]);

    const [expensesTypeList, setExpensesTypeList] = useState([]);

    const onChangeExpenses = (e) => {
        setExpenses({ ...expenses, [e.target.name]: e.target.value });
    }

    const handleInputChange = (e, value) => {
        e.persist();
        setExpenses({
            ...expenses,
            expenses_name: value.expenses_name,
            expenses_type_id: value.id,
        });
    }


    const saveExpenses = () => {
        ExpensesService.update(expenses.id, expenses)
            .then(response => {
                setExpenses(response.data);
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const fetchExpensesTypeList = (id) => {
        ExpensesTypeService.getAll()
            .then(response => {
                setExpensesList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchExpenses = (id) => {
        ExpensesService.fetchExpenseById(id)
            .then(response => {
                setExpenses(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchExpenseTypeList = (id) => {
        ExpensesTypeService.getAll()
            .then(response => {
                setExpensesTypeList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    return (
        <div>
            {message &&
                <Alert variant="success" dismissible>
                    <Alert.Heading>Successfully Updated!</Alert.Heading>
                    <p>
                        Change this and that and try again. Duis mollis, est non commodo
                        luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
                        Cras mattis consectetur purus sit amet fermentum.
                    </p>
                </Alert>
            }
            <Box
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            // onSubmit={saveOrderSupplier}
            >
                <Form>
                    <FormControl variant="standard" >
                        <Autocomplete
                            options={expensesTypeList.sort((a, b) =>
                                b.expenses_category_name.toString().localeCompare(a.expenses_category_name.toString())
                            )}
                            className="mb-3"
                            id="disable-close-on-select"
                            onChange={handleInputChange}
                            groupBy={(expensesTypeList) => expensesTypeList.expenses_category_name}
                            getOptionLabel={(expensesTypeList) => expensesTypeList.expenses_name}


                            renderInput={(params) => (
                                <TextField {...params} label={expenses.expenses_name} variant="standard" />
                            )}
                        />
                    </FormControl>

                    {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Expense</Form.Label>
                        <Form.Control type="text" value={expenses.expenses_name} name="Expense" disabled />

                    </Form.Group> */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Details</Form.Label>
                        <Form.Control type="text" value={expenses.details} name="details" placeholder="Enter Details" onChange={onChangeExpenses} />

                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="text" value={expenses.amount} name="amount" placeholder="Enter Amount" onChange={onChangeExpenses} />
                    </Form.Group>

                    <Button variant="primary" onClick={saveExpenses}>
                        Submit
                    </Button>
                </Form>
            </Box>
        </div>
    )
}

export default EditExpenses
