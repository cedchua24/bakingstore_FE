import React, { useState } from "react";
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import OrderSupplierTransactionService from "./OrderSupplierTransaction.service";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const AddOrderSupplierTransaction = (props) => {

    const navigate = useNavigate();
    const [orderTransaction, setorderTransaction] = useState({
        id: 0,
        supplier_id: 0,
        supplier_name: 0,
        withTax: 0,
        total_transaction_price: 0,
        order_date: '',
        status: 'IN_PROGRESS',
        created_at: '',
        updated_at: ''
    });
    const supplierList = props.supplierList;

    const steps = [
        'Create Transaction Details',
        'Add Product Orders',
        'Finalize Orders',
    ];

    const [message, setMessage] = useState(false);
    const [isChecked, setChecked] = useState(0);

    const onChangeInput = (e) => {
        // e.persist();
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setorderTransaction({ ...orderTransaction, withTax: 1 });
            } else {
                setorderTransaction({ ...orderTransaction, withTax: 0 });
            }
        } else {
            setorderTransaction({ ...orderTransaction, [e.target.name]: e.target.value });
        }


    }

    const saveOrderTransaction = () => {
        console.log('orderTransaction', orderTransaction);
        OrderSupplierTransactionService.sanctum().then(response => {
            OrderSupplierTransactionService.create(orderTransaction)
                .then(response => {
                    // props.onSaveOrderTransactionData(response.data);
                    setMessage(true);
                    navigate('/addProductOrderSupplierTransaction/' + response.data.id);
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
                        <InputLabel id="demo-simple-select-label">Supplier Name</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={orderTransaction.supplier_id}
                            label="Supplier Name"
                            name="supplier_id"
                            onChange={onChangeInput}
                        >
                            {
                                supplierList.map((supplier, index) => (
                                    <MenuItem value={supplier.id}>{supplier.supplier_name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>

                <FormControl sx={{ m: 0, minWidth: 120, minHeight: 70 }}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox name="withTax" value={isChecked} onChange={onChangeInput} />} label="Tax" />
                    </FormGroup>
                </FormControl>

                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" name="order_date" onChange={onChangeInput} />
                </Form.Group>

                <Button variant="primary" onClick={saveOrderTransaction}>
                    Next
                </Button>
            </Form>
            <br></br>

        </div>
    )
}

export default AddOrderSupplierTransaction
