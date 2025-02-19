
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
import InstallmentPaymentTransactionService from "../OtherService/InstallmentPaymentTransactionService";

const InstallmentPromo = () => {


    useEffect(() => {
        fetchCreditCardPaymentList(2);
    }, []);

    const [paymentTermList, setPaymentTermList] = useState({
        data: [],
        details: {}
    });

    const fetchCreditCardPaymentList = (id) => {
        InstallmentPaymentTransactionService.fetchPromoInstallmentList(id)
            .then(response => {
                setPaymentTermList(response.data);
                console.log('log', response.data)
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
            <br></br>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Bank</th>
                        <th>Account Name</th>
                        <th>Account Number</th>
                        <th>Supplier</th>
                        <th>Amount</th>
                        <th>Interest</th>
                        <th>Amount With Interest</th>
                        <th>Number of Months</th>
                        <th>Monthtly Payment</th>
                        <th>Date</th>
                        <th>Payment Status</th>
                        <th>Update Payment</th>
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
                                <td >{paymentTerm.supplier_name}</td>
                                <td>{paymentTerm.amount}</td>
                                <td>{paymentTerm.interest - paymentTerm.amount}</td>
                                <td>{paymentTerm.interest}</td>
                                <td>{paymentTerm.number_of_months}</td>
                                <td>{paymentTerm.interest_monthly}</td>
                                <td>{paymentTerm.start_date}</td>
                                <td>{paymentTerm.status == 1 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
                                <td>
                                    <Link variant="success" to={"/installmentOrder/" + paymentTerm.mode_of_payment_po_id}   >
                                        <Button variant="success" >
                                            Pay
                                        </Button>
                                    </Link>
                                </td>

                                <td>
                                    <Link variant="primary" to={"/viewOrderSupplierTransaction/" + paymentTerm.order_supplier_transaction_id}   >
                                        <Button variant="primary" >
                                            View
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

export default InstallmentPromo
