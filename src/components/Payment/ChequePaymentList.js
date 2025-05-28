
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PaymentTermService from "../OtherService/PaymentTermService";


const ChequePaymentList = () => {


    useEffect(() => {
        fetchCreditCardPaymentList(2);
    }, []);

    const [paymentTermList, setPaymentTermList] = useState({
        data: [],
        details: {}
    });

    const fetchCreditCardPaymentList = (id) => {
        PaymentTermService.fetchCreditCardPaymentListV3(id)
            .then(response => {
                setPaymentTermList(response.data);
                console.log('log', response.data)
                var d = new Date();
                d.setMonth(1);
                d.setDate(8);
                console.log('day', d);

                console.log('days', d.getDate())
                console.log('month', d.getMonth())
                console.log('days', d.getFullYear())
                const today = Date.now();

                console.log(new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d));
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const formatStatementDate = (day) => {
        var d = new Date();
        var month = d.getMonth();

        d.setDate(day);



        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }

    const formatDueDate = (day) => {
        var d = new Date();
        var month = d.getMonth();
        d.setMonth(month + 1);
        d.setDate(day);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');



    return (
        <div>
            <br></br>
            <legend>Cheque Payment List</legend>
            <table class="table table-bordered">

                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Bank</th>
                        <th>Account Name</th>
                        <th>Account Number</th>
                        <th>Due Date</th>
                        {/* <th>Payment Status</th> */}
                        <th>Transaction History</th>
                        <th>Payment History</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        paymentTermList.data.map((paymentTerm, index) => (
                            <tr key={paymentTerm.id}  >
                                <td >{paymentTerm.id}</td>
                                <td >{paymentTerm.bank_name}{" " + paymentTerm.account_description}</td>
                                <td >{paymentTerm.account_name}</td>
                                <td >{paymentTerm.account_number}</td>
                                <td>{formatDueDate(paymentTerm.due_date)}</td>
                                {/* <td>{paymentTerm.total_balance_due == 0 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td> */}

                                <td>
                                    <Link variant="primary" to={"/viewBankTransactionList/" + paymentTerm.id}   >
                                        <Button variant="primary" >
                                            View
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Link variant="primary" to={"/creditCardPayHistory/" + paymentTerm.id}   >
                                        <Button variant="primary" >
                                            View
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Link variant="success" to={"/viewOrderSupplierTransaction/" + paymentTerm.id}   >
                                        <Button variant="success" >
                                            Pay
                                        </Button>
                                    </Link>
                                </td>

                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ChequePaymentList
