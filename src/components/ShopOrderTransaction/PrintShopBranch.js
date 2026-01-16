import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import ShopOrderService from "../OtherService/ShopOrderService";
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import ModeOfPaymentService from "../OtherService/ModeOfPaymentService";

const PrintShopBranch = () => {


    const { id } = useParams();

    useEffect(() => {
        fetchShopOrderTransaction(id);
        fetchShopOrderDTO(id);
        fetchPaymentTypeByShopTransactionId(id);
    }, []);

    const [orderShop, setOrderShop] = useState({
        id: 0,
        shop_transaction_id: id,
        branch_stock_transaction_id: 0,
        product_id: 0,
        shop_order_quantity: 0,
        shop_order_price: 0,
        shop_order_total_price: 0,
        created_at: ''
    });

    const [modeOfPaymentDTO, setModeOfPaymentDTO] = useState({
        data: [],
        code: ''
    });

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        id: 0,
        shop_id: 0,
        shop_order_transaction_total_quantity: 0,
        shop_order_transaction_total_price: 0,
        requestor: 0,
        checker: 0,
        requestor_name: '',
        status: 0,
        checker_name: '',
        created_at: '',
        updated_at: ''
    });

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


    const [orderShopDTO, setOrderShopDTO] = useState({
        shopOrderTransaction: {},
        shopOrderList: []
    });


    const [message, setMessage] = useState(false);

    const fetchPaymentTypeByShopTransactionId = async (id) => {
        await ModeOfPaymentService.fetchPaymentTypeByShopTransactionId(id)
            .then(response => {
                setModeOfPaymentDTO(response.data);
                console.log('balance', response.data)

            })
            .catch(e => {
                console.log("error", e)
            });
    }




    const fetchShopOrderTransaction = async (id) => {

        var valueParam = id.split("+");
        console.log('pieces', valueParam);
        console.log('date', valueParam[1]);

        if (valueParam[1] === '') {
            console.log('empty');
        } else {
            console.log('non empty');
        }
        await ShopOrderTransactionService.fetchShopOrderTransaction(id)
            .then(response => {
                console.log('fetchShopOrderTransaction', response.data)
                setShopOrderTransaction(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchShopOrderDTO = async (id) => {
        await ShopOrderService.fetchShopOrderDTO(id)
            .then(response => {
                setOrderShopDTO(response.data);
                setinvoiceSubtotal(response.data.shopOrderTransaction.shop_order_transaction_total_price - TAX_RATE * response.data.shopOrderTransaction.shop_order_transaction_total_price);
                setinvoiceTaxes(TAX_RATE * response.data.shopOrderTransaction.shop_order_transaction_total_price);
                setinvoiceTotal(response.data.shopOrderTransaction.shop_order_transaction_total_price);
            })
            .catch(e => {
                console.log("error", e)
            });
    }




    const print = () => {
        window.print();
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
            <di></di>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                    <TableBody>
                        <TableRow >
                            <TableCell style={{ fontWeight: 'bold' }}>Reference #: </TableCell>
                            <TableCell align="right">{shopOrderTransaction.id}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Requestor Branch: </TableCell>
                            <TableCell align="right">{shopOrderTransaction.shop_name}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>  Date:</TableCell>
                            <TableCell align="right">{shopOrderTransaction.created_at}</TableCell>




                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <br></br>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                    <TableHead>
                        <TableRow >
                            <TableCell style={{ fontWeight: 'bold', }}>Product</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold', }}>Unit</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold', }}>Qty.</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold', }}>Price</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold', }}>Sum</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderShopDTO.shopOrderList.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.product_name}{
                                    row.business_type === 'WHOLESALE' ? <></>
                                        : < > ({Number.isInteger(row.weight / row.quantity) ? (row.weight / row.quantity) : (row.weight / row.quantity).toPrecision(2)}{row.variation}) {row.discount == 'PERCENTAGE' ? ",Disc " + row.discount_percentage + '%' + ' ' + '-' + row.discount_amount : row.discount == 'AMOUNT' ? ',Disc -' + row.discount_amount : ''}</>
                                }</TableCell>
                                <TableCell align="right">{row.unit}</TableCell>
                                <TableCell align="right">{row.shop_order_quantity}</TableCell>
                                <TableCell align="right">{row.shop_order_price}</TableCell>

                                <TableCell align="right">{row.shop_order_total_price}</TableCell>
                            </TableRow>
                        ))}


                        <TableRow>
                            <TableCell colSpan={4} style={{ fontWeight: 'bold', }}>Grand Total</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold', }}>₱ {ccyFormat(invoiceTotal)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div style={{ marginTop: "60px", display: "flex", justifyContent: "space-between", textAlign: "center" }}>
                <div style={{ width: "30%" }}>
                    <div style={{ borderBottom: "1px solid #000", height: "30px" }}></div>
                    <div>DRIVER</div>
                </div>

                <div style={{ width: "30%" }}>
                    <div style={{ borderBottom: "1px solid #000", height: "30px" }}></div>
                    <div>SENDER</div>
                </div>

                <div style={{ width: "30%" }}>
                    <div style={{ borderBottom: "1px solid #000", height: "30px" }}></div>
                    <div>RECEIVER</div>
                </div>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <div class="hide-on-print" style={{ textAlign: "center" }}>
                <Button
                    variant="contained"
                    onClick={print}
                    size="large" >
                    Print
                </Button>
                {/* <button class="hide-on-print" onClick={print}>Print</button> */}
                <br></br>

            </div>
            <br></br>
        </div >
    )
}

export default PrintShopBranch



