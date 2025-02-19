
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
import PaymentTermService from "../OtherService/PaymentTermService";

const ViewBankTransactionList = () => {

    const { id } = useParams();
    useEffect(() => {
        fetchByPaymentTypePo(id);
    }, []);

    const [paymentTermList, setPaymentTermList] = useState({
        data: [],
        details: {}
    });

    const fetchByPaymentTypePo = (id) => {
        PaymentTermService.fetchByPaymentTypePo(id)
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
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                    <TableBody>
                        <TableRow >
                            <TableCell style={{ fontWeight: 'bold' }}>Type:</TableCell>
                            <TableCell align="right">{paymentTermList.details.payment_term}</TableCell>

                            <TableCell style={{ fontWeight: 'bold' }}>Bank Name:</TableCell>
                            <TableCell align="right">{paymentTermList.details.bank_name}</TableCell>


                            <TableCell style={{ fontWeight: 'bold' }}>Account Name:</TableCell>
                            <TableCell align="right">{paymentTermList.details.account_name}</TableCell>

                            <TableCell style={{ fontWeight: 'bold' }}>Details:</TableCell>
                            <TableCell align="right">{paymentTermList.details.account_description}</TableCell>

                            <TableCell style={{ fontWeight: 'bold' }}>Account Number:</TableCell>
                            <TableCell align="right">{paymentTermList.details.account_number}</TableCell>


                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <br></br>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Supplier</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        paymentTermList.data.map((paymentTerm, index) => (
                            <tr key={paymentTerm.id}  >
                                <td >{paymentTerm.id}</td>
                                <td >{paymentTerm.supplier_name}</td>
                                <td>{paymentTerm.amount}</td>
                                <td>{paymentTerm.date}</td>


                                <td>
                                    <Link variant="primary" to={"/viewOrder/" + paymentTerm.order_supplier_transaction_id}   >
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

export default ViewBankTransactionList
