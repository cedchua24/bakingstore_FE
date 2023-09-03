import React, { useState } from "react";
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

import { styled } from '@mui/material/styles';



const AddShopOrderTransaction = (props) => {

    const navigate = useNavigate();
    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        id: 0,
        shop_id: 0,
        shop_order_transaction_total_quantity: 0,
        shop_order_transaction_total_price: 0,
        date: '',
        requestor: 0,
        checker: 0,
        created_at: '',
        updated_at: ''
    });
    const shopList = props.shopList;
    const userList = props.userList;

    const steps = [
        'Create Transaction Details',
        'Add Product Orders',
        'Finalize Orders',
    ];

    const [message, setMessage] = useState(false);

    const onChangeInput = (e) => {
        setShopOrderTransaction({ ...shopOrderTransaction, [e.target.name]: e.target.value });
    }

    const saveOrderTransaction = () => {
        console.log('orderTransaction', shopOrderTransaction);
        ShopOrderTransactionService.sanctum().then(response => {
            ShopOrderTransactionService.create(shopOrderTransaction)
                .then(response => {
                    navigate('/shopOrderTransaction/addProductShopOrderTransaction/' + response.data.id);
                })
                .catch(e => {
                    console.log(e);
                });
        });
    }
    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: "2rem",
        padding: theme.spacing(1),
    }));

    return (
        <div>
            <Div>{"Shop Order"}</Div>
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
                        <InputLabel id="demo-simple-select-label">Shop Name</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={shopOrderTransaction.shop_id}
                            label="Shop Name"
                            name="shop_id"
                            onChange={onChangeInput}
                        >
                            {
                                shopList.map((shop, index) => (
                                    <MenuItem value={shop.id}>{shop.shop_name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Requestor</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={shopOrderTransaction.user_id}
                            label="Requestor"
                            name="requestor"
                            onChange={onChangeInput}
                        >
                            {
                                userList.map((user, index) => (
                                    <MenuItem value={user.id}>{user.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Checker</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={shopOrderTransaction.user_id}
                            label="Checker"
                            name="checker"
                            onChange={onChangeInput}
                        >
                            {
                                userList.map((user, index) => (
                                    <MenuItem value={user.id}>{user.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>

                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" name="date" onChange={onChangeInput} />
                </Form.Group>

                <Button variant="primary" onClick={saveOrderTransaction}>
                    Next
                </Button>
            </Form>
            <br></br>

        </div>
    )
}

export default AddShopOrderTransaction
