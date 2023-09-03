import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import ShopOrderService from "../OtherService/ShopOrderService";

import Button from '@mui/material/Button';


import './design.css';


const ReceiptOrder = () => {

    const { id } = useParams();

    useEffect(() => {
        fetchShopOrderTransaction(id);
        fetchShopOrderDTO(id);
    }, []);

    const [isPrinting, setIsPrinting] = useState(false);


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

    const [orderShopDTO, setOrderShopDTO] = useState({
        shopOrderTransaction: {},
        shopOrderList: []
    });


    const [message, setMessage] = useState(false);


    const fetchShopOrderTransaction = async (id) => {
        console.log('test')
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

        setIsPrinting(true);
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
            <div>
                <table class="print-receipt" >
                    <tr>
                        <th>{shopOrderTransaction.requestor_name}</th>
                        <th>{shopOrderTransaction.created_at}</th>
                    </tr>
                    <br></br>

                </table>
                <table class="print-receipt" >
                    <tr>
                        <th>QTY</th>
                        <th>ITEM</th>
                        <th>PRICE</th>
                        <th>SUM</th>
                    </tr>

                    {orderShopDTO.shopOrderList.map((row) => (
                        <tr>
                            <td>{row.shop_order_quantity}</td>
                            <td>{row.product_name} {
                                row.business_type === 'WHOLESALE' ? <p >{row.weight}x{row.weight / row.quantity}kg</p>
                                    : <p >{row.weight / row.quantity}kg</p>
                            }</td>
                            <td>{row.shop_order_price}</td>
                            <td>{row.shop_order_total_price}</td>
                        </tr>

                    ))}
                    <br></br>
                    <tr>
                        <td></td>
                        <td></td>
                        <td>Subtotal</td>
                        <td>{invoiceSubtotal}</td>
                    </tr>

                    <tr>
                        <td></td>
                        <td></td>
                        <td>Tax</td>
                        <td>{`${(TAX_RATE * 100).toFixed(0)} %`}</td>
                    </tr>

                    <tr>
                        <td></td>
                        <td></td>
                        <td>Grand Total</td>
                        <td>₱ {ccyFormat(invoiceTotal)}</td>
                    </tr>

                </table>

            </div>
            <br></br>
            <div class="hide-on-print">
                <Button

                    variant="contained"
                    onClick={print}
                    size="large" >
                    Print
                </Button>
                {/* <button class="hide-on-print" onClick={print}>Print</button> */}
                <br></br>
            </div>
        </div >
    )
}

export default ReceiptOrder



