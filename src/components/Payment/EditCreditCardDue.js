import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import CreditCardDueService from "../OtherService/CreditCardDueService";

import Box from '@mui/material/Box';

const EditCreditCardDue = () => {

    const { id } = useParams();

    useEffect(() => {
        fetchCreditCardDue(id);
    }, []);


    const [creditCardDue, setCreditCardDue] = useState({
        id: 0,
        payment_type_po_id: 0,
        min_amount: 0,
        amount: 0,
        interest_amount: 0,
        is_installment: 0,
        due_date: '',
        status: 0,
        action: 'update',
        date: ''
    });

    const [message, setMessage] = useState(false);


    const onChangecreditCardDue = (e) => {
        setCreditCardDue({ ...creditCardDue, action: 'update' });
        setCreditCardDue({ ...creditCardDue, [e.target.name]: e.target.value });
    }



    const savecreditCardDue = () => {
        CreditCardDueService.update(creditCardDue.id, creditCardDue)
            .then(response => {
                setCreditCardDue(response.data);
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }



    const fetchCreditCardDue = (id) => {
        CreditCardDueService.get(id)
            .then(response => {
                setCreditCardDue(response.data);
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

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Due Amount</Form.Label>
                        <Form.Control type="text" value={creditCardDue.amount} name="amount" onChange={onChangecreditCardDue} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Minimum Amount</Form.Label>
                        <Form.Control type="text" value={creditCardDue.min_amount} name="min_amount" onChange={onChangecreditCardDue} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control type="date" value={creditCardDue.due_date} name="due_date" onChange={onChangecreditCardDue} />
                    </Form.Group>

                    <Button variant="primary" onClick={savecreditCardDue}>
                        Submit
                    </Button>
                </Form>
            </Box>
        </div>
    )
}

export default EditCreditCardDue
