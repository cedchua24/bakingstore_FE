import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import { Form } from 'react-bootstrap';
import IconButton from '@mui/material/IconButton';
import UpdateIcon from '@mui/icons-material/Update';

const PaymentTypeSales = () => {

    const { id } = useParams();


    useEffect(() => {
        fetchShopOrderTransactionList();
    }, []);

    const [date, setDate] = useState({
        id: 0,
        newDate: ''
    });

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        data: [],
        payment: [],
        code: '',
        message: '',
        total_price: 0,
        total_profit: 0
    });



    const fetchShopOrderTransactionList = () => {
        var valueParam = id.split("+");
        console.log('pieces', valueParam);
        console.log('date', valueParam[1]);

        if (valueParam[1] === '') {
            console.log('empty');
            valueParam[1] = 0;
        } else {
            console.log('non empty');
        }

        ShopOrderTransactionService.fetchOnlineShopOrderTransactionListByIdDate(valueParam[0], valueParam[1])
            .then(response => {
                // setShopOrderTransactionList(response.data);
                setShopOrderTransaction(response.data);
            })
            .catch(e => {
                console.log("error", e)

            });
    }


    return (
        <div>
            <div style={{ width: 300 }}>

                {
                    shopOrderTransaction.payment.map((payment, index) => (
                        <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                            <Form.Label style={{ fontWeight: 'bold' }}> {payment.payment_type} {payment.payment_type_description}</Form.Label>
                            <Form.Control type="text" value={"₱ " + payment.total_amount} />
                        </Form.Group>
                    )
                    )
                }

            </div>

            <div>
            </div>

            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Shop Name</th>
                        <th>Customer Type</th>
                        <th>Customer</th>
                        <th>Total Quantity</th>
                        <th>Total Cash</th>
                        <th>Total Online</th>
                        <th>Total Amount</th>
                        <th>Profit</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        shopOrderTransaction.data.map((shopOrderTransaction, index) => (
                            <tr key={shopOrderTransaction.id} >
                                <td>{shopOrderTransaction.id}</td>
                                <td>{shopOrderTransaction.shop_name}</td>
                                <td>{shopOrderTransaction.customer_type}</td>
                                <td>{shopOrderTransaction.requestor_name}</td>
                                <td>{shopOrderTransaction.shop_order_transaction_total_quantity}</td>
                                <td>{shopOrderTransaction.total_cash}</td>
                                <td>{shopOrderTransaction.total_online}</td>
                                <td style={{ fontWeight: 'bold', }}>{shopOrderTransaction.shop_order_transaction_total_price}</td>
                                <td style={{ fontWeight: 'bold', }}>{shopOrderTransaction.profit}</td>
                                <td>{shopOrderTransaction.date}</td>
                                <td>{shopOrderTransaction.status === 1 ? <p style={{ fontWeight: 'bold', color: 'green', }}>COMPLETED</p>
                                    : shopOrderTransaction.status === 2 ? <p style={{ fontWeight: 'bold', color: 'orange', }}>PENDING</p> :
                                        <p style={{ fontWeight: 'bold', color: 'red', }}>CANCELLED</p>}</td>
                                <td>
                                    <Link variant="primary" to={"../shopOrderTransaction/completedShopOrderTransaction/" + shopOrderTransaction.id}   >
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

        </div >
    )
}

export default PaymentTypeSales
