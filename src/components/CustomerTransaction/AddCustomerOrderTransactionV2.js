import React, { useState } from "react";
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';



const AddCustomerOrderTransactionV2 = (props) => {

    const navigate = useNavigate();
    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        id: 0,
        shop_id: 0,
        shop_order_transaction_total_quantity: 0,
        shop_order_transaction_total_price: 0,
        requestor: 0,
        checker: 0,
        date: '',
        created_at: '',
        updated_at: ''
    });
    const shopList = props.shopList;
    const customerList = props.customerList;

    const steps = [
        'Create Transaction Details',
        'Add Product Orders',
        'Finalize Orders',
    ];

    const [message, setMessage] = useState(false);

    const onChangeInput = (e) => {
        setShopOrderTransaction({ ...shopOrderTransaction, [e.target.name]: e.target.value });
    }

    const handleInputChange = (e, value) => {
        e.persist();
        setShopOrderTransaction({
            ...shopOrderTransaction,
            requestor: value.id,
        });
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

                <Box
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '35ch' },
                    }}
                    noValidate
                    autoComplete="off"
                // onSubmit={saveOrderSupplier}
                >
                    {/* <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Customer</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={shopOrderTransaction.user_id}
                            label="Requestor"
                            name="requestor"
                            onChange={onChangeInput}
                        >
                            {
                                customerList.map((user, index) => (
                                    <MenuItem value={user.id}>{user.first_name} {user.last_name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl> */}

                    <FormControl variant="standard" >
                        <Autocomplete
                            // {...defaultProps}
                            options={customerList}
                            className="mb-3"
                            id="disable-close-on-select"
                            onChange={handleInputChange}
                            getOptionLabel={(customerList) => customerList.first_name + " " + customerList.last_name}
                            renderInput={(params) => (
                                <TextField {...params} label="Choose Customer" variant="standard" />
                            )}
                        />
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

export default AddCustomerOrderTransactionV2
