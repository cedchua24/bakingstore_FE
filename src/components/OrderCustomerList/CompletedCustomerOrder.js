import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import OrderCustomerListService from "./OrderCustomerListService.service";
import OrderCustomerService from "../OrderCustomerTransaction/OrderCustomerService.service";
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const CompletedCustomerOrder = () => {


    const { id } = useParams();

    useEffect(() => {
        fetchOrderCustomerTransaction(id);
        fetchOrderCustomerTransactionList(id);
    }, []);


    const TAX_RATE = 0.12;

    function ccyFormat(num) {
        return `${num.toFixed(2)}`;
    }

    const [invoiceSubtotal, setinvoiceSubtotal] = useState(0);
    const [invoiceTaxes, setinvoiceTaxes] = useState(0);
    const [invoiceTotal, setinvoiceTotal] = useState(0);


    const [orderCustomerTransaction, setOrderCustomerTransaction] = useState({
        id: 0,
        customer_id: '',
        total_transaction_price: 0,
        status: '',
        created_at: '',
        updated_at: ''
    });

    const [orderCustomerTransactionList, setOrderCustomerTransactionList] = useState([]);

    const [message, setMessage] = useState(false);

    const fetchOrderCustomerTransactionList = async (id) => {
        await OrderCustomerListService.get(id)
            .then(response => {
                // setOrderCustomerTransactionList(response.data);
                setinvoiceSubtotal(response.data.total_transaction_price - TAX_RATE * response.data.total_transaction_price);
                setinvoiceTaxes(TAX_RATE * response.data.total_transaction_price);
                setinvoiceTotal(response.data.total_transaction_price);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchOrderCustomerTransaction = async (id) => {
        await OrderCustomerService.findById(id)
            .then(response => {
                setOrderCustomerTransactionList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }



    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" colSpan={3}>
                                Details
                            </TableCell>
                            <TableCell align="center" >Price</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Qty.</TableCell>
                            <TableCell align="right">Unit</TableCell>
                            <TableCell align="right">Sum</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderCustomerTransactionList.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.product_name}</TableCell>
                                <TableCell align="right">{row.quantity}</TableCell>
                                <TableCell align="right">{row.price}</TableCell>
                                <TableCell align="right">{row.total_price}</TableCell>
                            </TableRow>
                        ))}

                        <TableRow>
                            <TableCell rowSpan={3} />
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{invoiceSubtotal}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Tax</TableCell>
                            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
                            <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Grand Total: </TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold', }}>₱ {ccyFormat(invoiceTotal)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    )
}

export default CompletedCustomerOrder



