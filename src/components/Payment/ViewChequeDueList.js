import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PaymentTermService from "../OtherService/PaymentTermService";
import CreditCardDueService from "../OtherService/CreditCardDueService";
import CreditCardPayService from "../OtherService/CreditCardPayService";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';


const ViewChequeDueList = () => {


    useEffect(() => {
        fetchOrderTransactionList();
        fetchCreditCardDetail();
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
        CreditCardDueService.fetchChequeDueList(3)
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

    const formatStatementDate = (date) => {
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }


    const compareDate = ($date2) => {
        var d = new Date();
        var month = d.getMonth();
        d.setMonth(month + 1);
        const date1 = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();

        const dateDiff = (date, cDate) => Math.ceil(Math.abs(date - cDate) / (1000 * 60 * 60 * 24));
        const days = dateDiff(new Date(date1), new Date($date2));
        if (new Date(date1) > new Date($date2)) {
            return 0;
        }
        console.log('dayz', days)
        return days;
    }


    return (
        <div>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>

            <br></br>
            <legend> Upcoming Cheque Due</legend>
            <p style={{ color: 'red', }}>Red = Less than 3 days</p>
            <p style={{ color: 'orange', }}>Orange = Less than 7 days</p>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Due Date</th>
                        <th>Invoice Number</th>
                        <th>Supplier</th>
                        <th>Bank</th>
                        <th>Details</th>
                        <th>Account Number</th>
                        <th>Due Amount</th>
                        <th>Interest / Penalty</th>
                        <th>Payment Status</th>
                        <th>Action</th>
                        <th></th>
                        <th></th>


                    </tr>
                </thead>
                <tbody>

                    {
                        orderTransactionList.map((orderTransaction, index) => (
                            <tr key={orderTransaction.id} >
                                <td>{orderTransaction.id}</td>
                                <td>{
                                    compareDate(orderTransaction.due_date) <= 3 ?
                                        <td style={{ color: 'red', }}>{formatStatementDate(orderTransaction.due_date)}</td>
                                        : compareDate(orderTransaction.due_date) <= 7 ?
                                            <td style={{ color: 'orange', }}>{formatStatementDate(orderTransaction.due_date)}</td>
                                            :
                                            <td >{formatStatementDate(orderTransaction.due_date)}</td>
                                }
                                </td>

                                <td>{orderTransaction.invoice_number}</td>
                                <td>{orderTransaction.supplier_name}</td>
                                <td>{orderTransaction.account_name}</td>
                                <td>{orderTransaction.bank_name + " " + orderTransaction.account_description}</td>
                                <td>{orderTransaction.account_number}</td>
                                <td>{numberFormat(orderTransaction.amount)}</td>
                                <td>{orderTransaction.interest_amount}</td>
                                <td>{orderTransaction.status === 1 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
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
                                        <Link variant="primary" to={"/viewOrder/" + orderTransaction.transaction_id}   >
                                            <Button variant="primary" >
                                                Transaction
                                            </Button>
                                        </Link>
                                    }
                                </td>
                                <td>
                                    {orderTransaction.status != 1 &&
                                        <Link variant="primary" to={"/updateCreditCardDue/" + orderTransaction.id}   >
                                            <Button variant="warning" >
                                                Update
                                            </Button>
                                        </Link>
                                    }
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

export default ViewChequeDueList
