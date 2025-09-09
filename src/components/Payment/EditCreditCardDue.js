import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
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


    const [creditCardDueDetails, setCreditCardDueDetails] = useState({
        id: 0,
        account_number: 0,
        payment_term: '',
        account_name: 0,
        account_description: '',
        due_date: '',
        bank_name: '',
        amount: 0,
        interest_amount: 0,
        payment_due_date: '',
        status: 0,
        date: ''
    });

    const fetchCreditCardDetail = ($id) => {
        CreditCardDueService.fetchPaymentTypeDetail($id)
            .then(response => {
                setCreditCardDueDetails(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const [message, setMessage] = useState(false);


    const onChangecreditCardDue = (e) => {
        setCreditCardDue({ ...creditCardDue, action: 'update' });
        setCreditCardDue({ ...creditCardDue, [e.target.name]: e.target.value });
    }



    const savecreditCardDue = () => {
        CreditCardDueService.update(creditCardDue.id, creditCardDue)
            .then(response => {
                setCreditCardDue(response.data);
                fetchCreditCardDetail(response.data.payment_type_po_id)
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
                fetchCreditCardDetail(response.data.payment_type_po_id)
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');



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
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                    <TableBody>
                        <TableRow >
                            <TableCell style={{ fontWeight: 'bold' }}>Type</TableCell>
                            <TableCell align="right">{creditCardDueDetails.payment_term}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Bank</TableCell>
                            <TableCell align="right">{creditCardDueDetails.bank_name}</TableCell>


                            <TableCell style={{ fontWeight: 'bold' }}>Account Name:</TableCell>
                            <TableCell align="right">{creditCardDueDetails.account_name}</TableCell>

                            <TableCell style={{ fontWeight: 'bold' }}>Details:</TableCell>
                            <TableCell align="right">{creditCardDueDetails.account_description}</TableCell>

                            <TableCell style={{ fontWeight: 'bold' }}>Account Number:</TableCell>
                            <TableCell align="right">{creditCardDueDetails.account_number}</TableCell>


                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <br></br>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                    <TableBody>
                        <TableRow >
                            <TableCell style={{ fontWeight: 'bold' }}>Credit Limit</TableCell>
                            <TableCell align="right">{numberFormat(creditCardDueDetails.credit_limit)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Available Balance</TableCell>
                            <TableCell align="right">{numberFormat(creditCardDueDetails.credit_limit - creditCardDueDetails.total_balance_due)}</TableCell>


                            <TableCell style={{ fontWeight: 'bold' }}>Total Due Amount:</TableCell>
                            <TableCell align="right">{numberFormat(creditCardDueDetails.total_balance_due)}</TableCell>


                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <br></br>
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
