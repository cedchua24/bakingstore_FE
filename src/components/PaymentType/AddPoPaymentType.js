import React, { useState } from "react";
import { Button, Form } from 'react-bootstrap';
import PaymentTypePoService from "../OtherService/PaymentTypePoService";
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';


import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

import LinearProgress from '@mui/material/LinearProgress';

const AddPoPaymentType = (props) => {

    const paymentTermList = props.paymenTermList;
    const bankList = props.bankList;


    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});


    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [paymentType, setPaymentType] = useState({
        id: 0,
        payment_term_id: 0,
        bank_id: 0,
        account_number: 0,
        account_name: '',
        account_description: '',
        due_date: 0,
        credit_limit: 0,
        total_balance_due: 0,
        statement_date: 0,
        status: 0,
        created_at: '',
        updated_at: ''
    });

    const [message, setMessage] = useState(false);

    const onChangePaymentType = (e) => {
        setPaymentType({ ...paymentType, [e.target.name]: e.target.value });
    }

    const handlePaymentTermChange = (e, value) => {
        e.persist();
        console.log(value)

        setPaymentType({
            ...paymentType,
            payment_term_id: value.id
        });
    }

    const handleBankChange = (e, value) => {
        e.persist();
        console.log(value)

        setPaymentType({
            ...paymentType,
            bank_id: value.id
        });
    }

    const validate = (values) => {
        const errors = {};
        if (paymentType.bank_id == 0) {
            errors.bank_id = "Bank is Required!";
        }
        if (paymentType.account_name.length == 0) {
            errors.account_name = "Account Name is Required!";
        }

        if (paymentType.account_number == 0) {
            errors.account_number = "Account Number is Required!";
        }
        if (paymentType.payment_term_id == 0) {
            errors.payment_term_id = "Type is Required!";
        }

        if (paymentType.payment_term_id == 4) {
            if (paymentType.due_date == 0) {
                errors.due_date = "Due Date is Required!";
            }
            if (paymentType.credit_limit == 0) {
                errors.credit_limit = "Credit Limit is Required!";
            }
            if (paymentType.statement_date == 0) {
                errors.statement_date = "Statement Date is Required!";
            }

        }
        return errors;
    }

    const savePaymentType = () => {
        console.log(paymentType);
        console.log("validate: ", validate(paymentType));
        setFormErrors(validate(paymentType));
        if (Object.keys(validate(paymentType)).length > 0) {
            console.log("Has Validation: ");
        } else {
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            PaymentTypePoService.sanctum().then(response => {
                PaymentTypePoService.create(paymentType)
                    .then(response => {
                        props.onSavePaymentTypeData(response.data);
                        setMessage(true);
                        setPaymentType({
                            payment_type: ''
                        });
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                        setValidator({
                            severity: 'success',
                            message: 'Successfuly Added!',
                            isShow: true,
                        });
                    })
                    .catch(e => {
                        console.log(e);
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                    });
            });
        }
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
                <Box
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                // onSubmit={saveOrderSupplier}
                >
                    {formErrors.payment_term_id && <p style={{ color: "red" }}>{formErrors.payment_term_id}</p>}
                    <FormControl variant="standard" >
                        <Autocomplete
                            // {...defaultProps}
                            options={paymentTermList}
                            className="mb-3"
                            id="disable-close-on-select"
                            onChange={handlePaymentTermChange}
                            getOptionLabel={(paymentTermList) => paymentTermList.payment_term}
                            renderInput={(params) => (
                                <TextField {...params} label="Choose Type *" variant="standard" />
                            )}
                        />
                    </FormControl>
                    <br></br>
                </Box>

                <Box
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                // onSubmit={saveOrderSupplier}
                >
                    {formErrors.bank_id && <p style={{ color: "red" }}>{formErrors.bank_id}</p>}
                    <FormControl variant="standard" >
                        <Autocomplete
                            // {...defaultProps}
                            options={bankList}
                            className="mb-3"
                            id="disable-close-on-select"
                            onChange={handleBankChange}
                            getOptionLabel={(bankList) => bankList.bank_name}
                            renderInput={(params) => (
                                <TextField {...params} label="Choose Bank *" variant="standard" />
                            )}
                        />
                    </FormControl>
                    <br></br>
                </Box>

                {formErrors.account_name && <p style={{ color: "red" }}>{formErrors.account_name}</p>}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Acoount Name *</Form.Label>
                    <Form.Control type="text" value={paymentType.account_name} name="account_name" placeholder="Enter Account Name" onChange={onChangePaymentType} />
                </Form.Group>


                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Acoount Description</Form.Label>
                    <Form.Control type="text" value={paymentType.account_description} name="account_description" placeholder="Enter Account Description" onChange={onChangePaymentType} />
                    <Form.Text className="text-muted"  >
                        Ex. Platinum
                    </Form.Text>
                </Form.Group>

                {formErrors.account_number && <p style={{ color: "red" }}>{formErrors.account_number}</p>}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Account Number *</Form.Label>
                    <Form.Control type="text" value={paymentType.account_number} name="account_number" placeholder="Enter Account Last 4 Digit Number" onChange={onChangePaymentType} />
                    {paymentType.payment_term_id == 4 &&
                        <Form.Text className="text-muted"  >
                            Last 4 Digit Number
                        </Form.Text>
                    }
                </Form.Group>

                {paymentType.payment_term_id == 4 &&

                    <Box sx={{ minWidth: 60 }}>
                        {formErrors.due_date && <p style={{ color: "red" }}>{formErrors.due_date}</p>}
                        <FormControl sx={{ m: 0, minWidth: 130, minHeight: 70 }}>
                            <InputLabel id="demo-simple-select-label">Due Date *</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Due Date"
                                name="due_date"
                                onChange={onChangePaymentType}
                            >
                                {Array(32).fill(1).map((el, i) =>
                                    <MenuItem value={i}>{i}</MenuItem>
                                )}

                            </Select>
                        </FormControl>


                        {formErrors.credit_limit && <p style={{ color: "red" }}>{formErrors.credit_limit}</p>}
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Credit Limit *</Form.Label>
                            <Form.Control type="number" value={paymentType.credit_limit} name="credit_limit" placeholder="Enter Credit Limit" onChange={onChangePaymentType} />
                        </Form.Group>

                        {formErrors.statement_date && <p style={{ color: "red" }}>{formErrors.statement_date}</p>}
                        <FormControl sx={{ m: 0, minWidth: 130, minHeight: 70 }}>
                            <InputLabel id="demo-simple-select-label">Statement Date *</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Statement Date"
                                name="statement_date"
                                onChange={onChangePaymentType}
                            >
                                {Array(32).fill(1).map((el, i) =>
                                    <MenuItem value={i}>{i}</MenuItem>
                                )}

                            </Select>
                        </FormControl>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Total Balance Due</Form.Label>
                            <Form.Control type="number" value={paymentType.total_balance_due} name="total_balance_due" placeholder="Enter Total Balance Due" onChange={onChangePaymentType} />
                        </Form.Group>
                    </Box>
                }
                <Button variant="primary"
                    disabled={isAddDisabled}
                    onClick={savePaymentType}>
                    Submit
                </Button>
                <br></br>      <br></br>
                {submitLoadingAdd &&
                    <LinearProgress color="warning" />
                }
            </Form>
            <br></br>

        </div >
    )
}

export default AddPoPaymentType
