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
        fetchExpensesType(id);
        fetchExpensesTypeList();
    }, []);

    const [expenses, setExpenses] = useState({
        id: 0,
        expenses_type_id: 0,
        expenses_name: '',
        details: '',
        amount: '',
        date: ''
    });

    const [message, setMessage] = useState(false);
    const [expensesList, setExpensesList] = useState([]);

    const onChangeExpenses = (e) => {
        setExpenses({ ...expenses, [e.target.name]: e.target.value });
    }

    const handleInputChange = (e, value) => {
        e.persist();
        setExpenses({
            ...expenses,
            expenses_category_id: value.id,
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

    const fetchExpensesType = (id) => {
        ExpensesService.get(id)
            .then(response => {
                setExpenses(response.data);
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
                            // {...defaultProps}
                            options={expensesList}
                            className="mb-3"
                            id="disable-close-on-select"
                            onChange={handleInputChange}
                            getOptionLabel={(expensesList) => expensesList.expenses_name}
                            renderInput={(params) => (
                                <TextField {...params} label="Choose Expenses" variant="standard" />
                            )}
                        />
                    </FormControl>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Details</Form.Label>
                        <Form.Control type="text" value={expenses.details} name="details" placeholder="Enter Details" onChange={onChangeExpenses} />

                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="text" value={expenses.amount} name="amount" placeholder="Enter Amount" onChange={onChangeExpenses} />
                    </Form.Group>

                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" name="date" onChange={onChangeExpenses} />
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