import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import Checkbox from '@mui/material/Checkbox';
import PaymentTypePoService from "../OtherService/PaymentTypePoService";
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

const PoEditPaymentType = () => {


    const { id } = useParams();

    useEffect(() => {
        fetchPaymentType(id);
    }, []);

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

    const onChangePaymentTypeStatus = (e) => {

        console.log("error", e.target.checked)
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setPaymentType({ ...paymentType, status: 1 });
            } else {
                setPaymentType({ ...paymentType, status: 0 });
            }
        } else {
            setPaymentType({ ...paymentType, [e.target.name]: e.target.value });
        }
    }




    const savePaymentType = () => {
        PaymentTypePoService.update(paymentType.id, paymentType)
            .then(response => {
                setPaymentType(response.data);
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const fetchPaymentType = (id) => {
        PaymentTypePoService.get(id)
            .then(response => {
                setPaymentType(response.data);
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
            <Form>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Acoount Name</Form.Label>
                    <Form.Control type="text" value={paymentType.account_name} name="account_name" placeholder="Enter Account Name" onChange={onChangePaymentType} />
                </Form.Group>


                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Acoount Description</Form.Label>
                    <Form.Control type="text" value={paymentType.account_description} name="account_description" placeholder="Enter Account Description" onChange={onChangePaymentType} />
                    <Form.Text className="text-muted"  >
                        Ex. Platinum
                    </Form.Text>
                </Form.Group>


                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Account Number</Form.Label>
                    <Form.Control type="text" value={paymentType.account_number} name="account_number" placeholder="Enter Account Last 4 Digit Number" onChange={onChangePaymentType} />
                    <Form.Text className="text-muted"  >
                        Last 4 Digit Number
                    </Form.Text>
                </Form.Group>


                {paymentType.payment_term_id == 4 &&

                    <Box sx={{ minWidth: 60 }}>
                        <FormControl sx={{ m: 0, minWidth: 130, minHeight: 70 }}>
                            <InputLabel id="demo-simple-select-label">Due Date *</InputLabel>
                            <Select
                                value={paymentType.due_date}
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



                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Credit Limit *</Form.Label>
                            <Form.Control type="number" value={paymentType.credit_limit} name="credit_limit" placeholder="Enter Credit Limit" onChange={onChangePaymentType} />
                        </Form.Group>


                        <FormControl sx={{ m: 0, minWidth: 130, minHeight: 70 }}>
                            <InputLabel id="demo-simple-select-label">Statement Date *</InputLabel>
                            <Select
                                value={paymentType.statement_date}
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
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Enabled ? </Form.Label>

                    <Checkbox
                        checked={paymentType.status === 0 ? false : true}
                        onChange={onChangePaymentTypeStatus}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </Form.Group>



                <Button variant="primary" onClick={savePaymentType}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default PoEditPaymentType
