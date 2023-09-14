import React, { useState } from "react";
import { Button, Form, Alert } from 'react-bootstrap';
import ExpensesService from "./ExpensesService";



import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';



const AddExpenses = (props) => {

    const expensesTypeList = props.expensesTypeList;

    const [expenses, setExpenses] = useState({
        id: 0,
        expenses_type_id: 0,
        expenses_name: '',
        details: '',
        amount: '',
        date: ''
    });

    const [message, setMessage] = useState(false);

    const onChangeExpensesType = (e) => {
        setExpenses({ ...expenses, [e.target.name]: e.target.value });
    }

    const handleInputChange = (e, value) => {
        e.persist();
        setExpenses({
            ...expenses,
            expenses_type_id: value.id,
        });
    }

    const saveExpensesType = () => {
        console.log(expenses);
        ExpensesService.sanctum().then(response => {
            ExpensesService.create(expenses)
                .then(response => {
                    props.onSaveExpensesTypeData(response.data);
                    setMessage(true);
                })
                .catch(e => {
                    console.log(e);
                });
        });
    }

    return (
        <div>
            {message &&
                <Alert variant="success" dismissible>
                    <Alert.Heading>Successfully Added!</Alert.Heading>
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
                            options={expensesTypeList}
                            className="mb-3"
                            id="disable-close-on-select"
                            onChange={handleInputChange}
                            getOptionLabel={(expensesTypeList) => expensesTypeList.expenses_name}
                            renderInput={(params) => (
                                <TextField {...params} label="Choose Expenses" variant="standard" />
                            )}
                        />
                    </FormControl>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Details</Form.Label>
                        <Form.Control type="text" value={expenses.details} name="details" placeholder="Enter Details" onChange={onChangeExpensesType} />

                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="text" value={expenses.amount} name="amount" placeholder="Enter Amount" onChange={onChangeExpensesType} />
                    </Form.Group>

                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" name="date" onChange={onChangeExpensesType} />
                    </Form.Group>

                    <Button variant="primary" onClick={saveExpensesType}>
                        Submit
                    </Button>
                </Form>
            </Box>
            <br></br>

        </div>
    )
}

export default AddExpenses
