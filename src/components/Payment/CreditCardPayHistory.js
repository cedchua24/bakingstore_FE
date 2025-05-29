import React, { useState, useEffect } from "react";
import { Button, Form, Alert } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import CreditCardPayService from "../OtherService/CreditCardPayService";
import CreditCardDueService from "../OtherService/CreditCardDueService";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const CreditCardPayHistory = () => {

    const { id } = useParams();

    useEffect(() => {
        fetchCreditCardDue(id);
        fetchCreditCardDetail(id);
    }, []);

    const [creditCardDue, setCreditCardDue] = useState({
        id: 0,
        account_number: 0,
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


    const [orderTransactionList, setOrderTransactionList] = useState([]);

    const [message, setMessage] = useState(false);


    const fetchCreditCardDue = (id) => {
        CreditCardPayService.fetchCreditCardPayByPaymentType(id)
            .then(response => {
                setOrderTransactionList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchCreditCardDetail = (id) => {
        CreditCardDueService.fetchPaymentTypeDetail(id)
            .then(response => {
                setCreditCardDue(response.data);
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
                            <TableCell style={{ fontWeight: 'bold' }}>Bank</TableCell>
                            <TableCell align="right">{creditCardDue.bank_name}</TableCell>


                            <TableCell style={{ fontWeight: 'bold' }}>Account Name:</TableCell>
                            <TableCell align="right">{creditCardDue.account_name}</TableCell>

                            <TableCell style={{ fontWeight: 'bold' }}>Details:</TableCell>
                            <TableCell align="right">{creditCardDue.account_description}</TableCell>

                            <TableCell style={{ fontWeight: 'bold' }}>Account Number:</TableCell>
                            <TableCell align="right">{creditCardDue.account_number}</TableCell>


                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <br></br>
            <legend>Credit Card Pay </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th> Amount</th>
                        <th> Bank Paid</th>
                        <th> Account</th>
                        <th> Date</th>



                    </tr>
                </thead>
                <tbody>

                    {
                        orderTransactionList.map((orderTransaction, index) => (
                            <tr key={orderTransaction.id} >
                                <td>{orderTransaction.id}</td>
                                <td>{numberFormat(orderTransaction.amount)} </td>
                                <td>{orderTransaction.bank_name + " " + orderTransaction.account_description}</td>
                                <td>{orderTransaction.account_name + " " + orderTransaction.account_number}</td>
                                <td>{orderTransaction.updated_at}</td>
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default CreditCardPayHistory
