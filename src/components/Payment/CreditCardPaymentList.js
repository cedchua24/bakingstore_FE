
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PaymentTermService from "../OtherService/PaymentTermService";


const CreditCardPaymentList = () => {


    useEffect(() => {
        fetchCreditCardPaymentList(2);
    }, []);

    const [paymentTermList, setPaymentTermList] = useState({
        data: [],
        details: {}
    });

    const fetchCreditCardPaymentList = (id) => {
        PaymentTermService.fetchCreditCardPaymentListV2(id)
            .then(response => {
                setPaymentTermList(response.data);
                console.log('log', response.data)
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

        var dd = new Date('2025-03-10');
        console.log('new_date', new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(dd));

        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }

    const covertDateString = (day) => {
        var d = new Date(day);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');

    const totalSum = (numbers) => {
        // numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return numberFormat(numbers.reduce((acc, { total_balance_due }) => acc + total_balance_due, 0));
    }

    const totlLimit = (numbers) => {
        // numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return numberFormat(numbers.reduce((acc, { balance_due }) => acc + balance_due, 0));
    }
    const totlCreditLimit = (numbers) => {
        // numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return numberFormat(numbers.reduce((acc, { credit_limit }) => acc + credit_limit, 0));
    }




    return (
        <div>

            <div style={{ minWidth: 800 }}>
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                    <Form.Label>Total Credit Limit: </Form.Label>
                    <Form.Control type="text" value={totlCreditLimit(paymentTermList.data)} />
                </Form.Group>
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                    <Form.Label>Total Available Limit: </Form.Label>
                    <Form.Control type="text" value={totlLimit(paymentTermList.data)} />
                </Form.Group>
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                    <Form.Label>Total Balance Due: </Form.Label>
                    <Form.Control type="text" value={totalSum(paymentTermList.data)} />
                </Form.Group>

            </div>
            <br></br>

            <legend align="center" style={{ fontWeight: 'bold' }} > Credit Card List </legend>
            <table class="table table-bordered">

                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Bank</th>
                        <th>Account Name</th>
                        <th>Account Number</th>
                        <th>Statement</th>
                        <th>Due Date</th>
                        <th>Credit Limit</th>
                        <th>Available Balance</th>
                        <th>Upcoming Due</th>
                        <th>Due Amount</th>
                        <th>Payment Status</th>
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
                                <td >{paymentTerm.statement_date}</td>
                                <td >{paymentTerm.due_date}</td>
                                <td >{numberFormat(paymentTerm.credit_limit)}</td>
                                <td>{numberFormat(paymentTerm.balance_due)}</td>
                                <td>{paymentTerm.due == 0 ? '' : covertDateString(paymentTerm.due)}</td>
                                <td>{numberFormat(paymentTerm.amount_due)}</td>
                                <td>{paymentTerm.total_balance_due == 0 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>

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
        </div >
    )
}

export default CreditCardPaymentList
