import React, { useState } from "react";
import { Button, Form, Alert } from 'react-bootstrap';
import ExpensesTypeService from "./ExpensesTypeService";



import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';



const AddExpensesType = (props) => {

    const expensesCategory = props.expensesCategory;

    const [expenseType, setExpensesType] = useState({
        id: 0,
        expenses_category_id: 0,
        expenses_category_name: '',
        expenses_name: '',
        details: '',
        address: '',
        updated_at: ''
    });

    const [message, setMessage] = useState(false);

    const onChangeExpensesType = (e) => {
        setExpensesType({ ...expenseType, [e.target.name]: e.target.value });
    }

    const handleInputChange = (e, value) => {
        e.persist();
        setExpensesType({
            ...expenseType,
            expenses_category_id: value.id,
        });
    }

    const saveExpensesType = () => {
        console.log(expenseType);
        ExpensesTypeService.sanctum().then(response => {
            ExpensesTypeService.create(expenseType)
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
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Expenses Name *</Form.Label>
                        <Form.Control type="text" value={expenseType.expenses_name} name="expenses_name" placeholder="Enter Expenses Name" onChange={onChangeExpensesType} />

                    </Form.Group>
                    <FormControl variant="standard" >
                        <Autocomplete
                            // {...defaultProps}
                            options={expensesCategory}
                            className="mb-3"
                            id="disable-close-on-select"
                            onChange={handleInputChange}
                            getOptionLabel={(expensesCategory) => expensesCategory.expenses_category_name}
                            renderInput={(params) => (
                                <TextField {...params} label="Choose Category" variant="standard" />
                            )}
                        />
                    </FormControl>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Details</Form.Label>
                        <Form.Control type="text" value={expenseType.details} name="details" placeholder="Enter Details" onChange={onChangeExpensesType} />

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

export default AddExpensesType
