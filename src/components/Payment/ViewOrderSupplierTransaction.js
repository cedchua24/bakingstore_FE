import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardDueService from "../OtherService/CreditCardDueService";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';


const ViewOrderSupplierTransaction = () => {



    const { id } = useParams();
    useEffect(() => {
        fetchOrderTransactionList(id);
        fetchCreditCardDetail(id);
    }, []);

    const [orderTransactionList, setOrderTransactionList] = useState([]);

    const [creditCardDue, setCreditCardDue] = useState({
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



    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });




    const fetchOrderTransactionList = (id) => {
        CreditCardDueService.fetallCreditDueById(id)
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

    const formatStatementDate = (date) => {
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }




    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');





    return (
        <div>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                    <TableBody>
                        <TableRow >
                            <TableCell style={{ fontWeight: 'bold' }}>Type</TableCell>
                            <TableCell align="right">{creditCardDue.payment_term}</TableCell>
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
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                    <TableBody>
                        <TableRow >
                            <TableCell style={{ fontWeight: 'bold' }}>Credit Limit</TableCell>
                            <TableCell align="right">{numberFormat(creditCardDue.credit_limit)}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Available Balance</TableCell>
                            <TableCell align="right">{numberFormat(creditCardDue.credit_limit - creditCardDue.total_balance_due)}</TableCell>


                            <TableCell style={{ fontWeight: 'bold' }}>Total Due Amount:</TableCell>
                            <TableCell align="right">{numberFormat(creditCardDue.total_balance_due)}</TableCell>


                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <br></br>
            {/* <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                    <TableBody>
                        <TableRow >
                            <TableCell style={{ fontWeight: 'bold' }}>Due Date</TableCell>
                            <TableCell align="right">{creditCardDue.payment_due_date}</TableCell>


                            <TableCell style={{ fontWeight: 'bold' }}>Due Amount:</TableCell>
                            <TableCell align="right">{creditCardDue.amount}</TableCell>

                            <TableCell style={{ fontWeight: 'bold' }}>Minimum Amount:</TableCell>
                            <TableCell align="right">{creditCardDue.min_amount}</TableCell>

                            <TableCell style={{ fontWeight: 'bold' }}>Penalty:</TableCell>
                            <TableCell align="right">{creditCardDue.interest_amount}</TableCell>


                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <br></br> */}
            <legend align="center" style={{ fontWeight: 'bold' }} > Credit Card Due List </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Min Amount</th>
                        <th>Due Amount</th>
                        <th>Amount Paid</th>
                        <th>Interest / Penalty</th>
                        <th>Due Date</th>
                        <th>Installment</th>
                        <th>Payment Status</th>
                        <th>Action</th>
                        <th></th>
                        <th></th>
                        <th></th>

                    </tr>
                </thead>
                <tbody>

                    {
                        orderTransactionList.map((orderTransaction, index) => (
                            <tr key={orderTransaction.id} >
                                <td>{orderTransaction.id}</td>
                                <td>{numberFormat(orderTransaction.min_amount)} </td>
                                <td>{orderTransaction.amount_paid > 0 && orderTransaction.amount_paid < orderTransaction.amount ? <><p style={{ textDecoration: 'line-through', color: 'red', }}>{numberFormat(orderTransaction.amount)}</p><p >{numberFormat(orderTransaction.amount - orderTransaction.amount_paid)}</p></> : numberFormat(orderTransaction.amount)}</td>
                                <td>{numberFormat(orderTransaction.amount_paid)}</td>
                                <td>{orderTransaction.interest_amount}</td>
                                <td>{formatStatementDate(orderTransaction.due_date)}</td>
                                <td>{orderTransaction.is_installment === 1 ? <CheckIcon style={{ color: 'black', }} /> : <CloseIcon style={{ color: 'black', }} />}</td>
                                <td>{orderTransaction.status === 1 ? <CheckIcon style={{ color: 'green', }} /> : orderTransaction.status === 2 ? "" : <CloseIcon style={{ color: 'red', }} />}</td>
                                <td>
                                    {orderTransaction.status != 1 &&
                                        <Link variant="primary" to={"/payCreditCard/" + orderTransaction.id}   >
                                            <Button variant="primary" >
                                                Pay
                                            </Button>
                                        </Link>
                                    }
                                </td>
                                <td>
                                    {orderTransaction.status != 1 &&
                                        <Link variant="primary" to={"/promoInstallment/" + orderTransaction.id}   >
                                            <Button variant="primary" >
                                                Installment
                                            </Button>
                                        </Link>
                                    }
                                </td>
                                <td>
                                    {/* {orderTransaction.status != 1 && */}
                                    <Link variant="primary" to={"/updateCreditCardDue/" + orderTransaction.id}   >
                                        <Button variant="warning" >
                                            Update
                                        </Button>
                                    </Link>
                                    {/* } */}
                                </td>
                                <td>
                                    {orderTransaction.amount_paid != 0 &&
                                        <Link variant="primary" to={"/payCreditCardHistory/" + orderTransaction.id}   >
                                            <Button variant="secondary" >
                                                Payment History
                                            </Button>
                                        </Link>
                                    }
                                </td>



                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>

        </div >
    )
}

export default ViewOrderSupplierTransaction
