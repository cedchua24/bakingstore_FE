import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import OrderSupplierTransactionService from "./OrderSupplierTransaction.service";
import OrderSupplierService from "./OrderSupplierService.service";
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';


const CompletedOrder = () => {


    const { id } = useParams();

    useEffect(() => {
        fetchOrderSupplierTransaction(id);
        fetchByOrderSupplierId(id);
    }, []);

    const steps = [
        'Created Transaction Details',
        'Add Product Orders',
        'Finalize Orders',
    ];

    const TAX_RATE = 0.12;

    function ccyFormat(num) {
        return `${num.toFixed(2)}`;
    }


    const [invoiceSubtotal, setinvoiceSubtotal] = useState(0);
    const [invoiceTaxes, setinvoiceTaxes] = useState(0);
    const [invoiceTotal, setinvoiceTotal] = useState(0);

    const [orderList, setOrderList] = useState([]);

    const [orderSupplierTransaction, setOrderSupplierTransaction] = useState({
        id: 0,
        supplier_name: '',
        supplier_id: 0,
        withTax: 0,
        status: '',
        total_transaction_price: 0,
        order_date: '',
        created_at: '',
        updated_at: ''
    });

    const [message, setMessage] = useState(false);

    const fetchOrderSupplierTransaction = async (id) => {
        await OrderSupplierTransactionService.findById(id)
            .then(response => {
                setOrderSupplierTransaction(response.data);

                if (response.data.withTax === 0) {

                    setinvoiceSubtotal(response.data.total_transaction_price);
                    setinvoiceTaxes(TAX_RATE * response.data.total_transaction_price);
                    setinvoiceTotal(TAX_RATE * response.data.total_transaction_price + response.data.total_transaction_price);
                } else {
                    setinvoiceSubtotal(response.data.total_transaction_price - TAX_RATE * response.data.total_transaction_price);
                    setinvoiceTaxes(TAX_RATE * response.data.total_transaction_price);
                    setinvoiceTotal(response.data.total_transaction_price);
                }
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchByOrderSupplierId = async (id) => {
        await OrderSupplierService.findById(id)
            .then(response => {
                setOrderList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const updateOrderTransaction = () => {
        OrderSupplierTransactionService.setToCompleteTransaction(id)
            .then(response => {
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }



    return (
        <div>
            {message &&
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert variant="filled" severity="success">
                        Successfully Addded!
                    </Alert>
                </Stack>

            }
            <br></br>
            <Box
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >

                <br></br>
                <form >
                    <TextField
                        id="outlined-disabled"
                        label="Supplier Name"
                        variant="filled"
                        value={orderSupplierTransaction.supplier_name}

                    />

                    <TextField
                        id="outlined-disabled"
                        label="Date"
                        variant="filled"
                        value={orderSupplierTransaction.order_date}

                    />

                    <TextField
                        id="outlined-disabled"
                        label="With Tax"
                        variant="filled"
                        value={orderSupplierTransaction.withTax === 1 ? true : false}

                    />
                    <br></br>
                </form>
            </Box>
            <br></br>
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
                        {orderList.map((row) => (
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
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right" style={{ color: 'red', }}>₱ {ccyFormat(invoiceTotal)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

        </div >
    )
}

export default CompletedOrder



