import React, { useState } from "react";
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import CustomerOrderTransactionService from "./CustomerOrderTransactionService";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';



const AddCustomerOrderTransaction = (props) => {

    const navigate = useNavigate();
    const [customerOrderTransaction, setCustomerOrderTransaction] = useState({
        id: 0,
        customer_id: 0,
        total_transaction_price: 0,
        created_at: '',
        updated_at: ''
    });
    const customerList = props.customerList;

    const steps = [
        'Create Transaction Details',
        'Add Product Orders',
        'Finalize Orders',
    ];

    const [message, setMessage] = useState(false);

    const onChangeInput = (e) => {
        console.log(e.target);
        setCustomerOrderTransaction({ ...customerOrderTransaction, [e.target.name]: e.target.value });
    }

    const saveOrderTransaction = () => {
        console.log('orderTransaction', customerOrderTransaction);
        CustomerOrderTransactionService.sanctum().then(response => {
            CustomerOrderTransactionService.create(customerOrderTransaction)
                .then(response => {
                    navigate('/customerOrderTransaction/addProductCustomerOrderTransaction/' + response.data.id);
                })
                .catch(e => {
                    console.log(e);
                });
        });
    }

    return (
        <div>
            <Stepper activeStep={0} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>


                    </Step>
                ))}
            </Stepper>
            <br></br>
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

            <Form>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Customer</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={customerOrderTransaction.customer_id}
                            label="Customer"
                            name="customer_id"
                            onChange={onChangeInput}
                        >
                            {
                                customerList.map((user, index) => (
                                    <MenuItem value={user.id}>{user.first_name} {user.last_name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>

                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" name="created_at" onChange={onChangeInput} />
                </Form.Group>

                <Button variant="primary" onClick={saveOrderTransaction}>
                    Next
                </Button>
            </Form>
            <br></br>

        </div>
    )
}

export default AddCustomerOrderTransaction
