import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import CustomerService from "./CustomerService";
import { Link } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import PageviewIcon from '@mui/icons-material/Pageview';

const CustomerTransactionList = () => {

    const { id } = useParams();

    useEffect(() => {
        fetchCustomerTransaction(id);
    }, []);

    const [customerTransactionList, setCustomerTransactionList] = useState({
        data: [],
        payment: [],
        customerDetails: {},
        code: '',
        message: '',
        total_price: 0,
        total_count: 0,
        total_profit: 0
    });

    const [date, setDate] = useState('');

    const fetchCustomerTransaction = (id) => {
        CustomerService.fetchCustomerTransaction(id)
            .then(response => {
                console.log('data', response.data)
                setCustomerTransactionList(response.data);
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
            <h1>{customerTransactionList.customerDetails.first_name + " " + customerTransactionList.customerDetails.last_name}</h1>
            <div style={{ width: 400, marginRight: 100 }}>

                {
                    customerTransactionList.payment.map((payment, index) => (
                        <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                            <Form.Label> {payment.payment_type} {payment.payment_type_description} </Form.Label>

                            {payment.total_paid_count != payment.total_count ?
                                <Tooltip title={"Need to Double Check all transaction in " + payment.payment_type}>
                                    <span>
                                        <CloseIcon style={{ color: 'red', }} />
                                    </span>
                                </Tooltip> : <CheckIcon style={{ color: 'green', }} />}
                            <Form.Control type="text" value={numberFormat(payment.total_amount)} />

                        </Form.Group>
                    )
                    )
                }

            </div>


            <table class="table table-bordered" >
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Shop Name</th>
                        <th>Customer Type</th>
                        <th>Customer</th>
                        <th>Total Quantity</th>
                        <th>Total Cash</th>
                        <th>Total Online</th>
                        <th>Bank</th>
                        <th>Total Amount</th>
                        <th>Profit</th>
                        <th>Date</th>
                        <th>Payment Status</th>
                        <th></th>
                    </tr>
                </thead>
                {customerTransactionList.data.length == 0 ?
                    (<tr style={{ color: "red", }}>{"No Data Available"}</tr>)
                    :
                    (
                        <tbody>

                            {
                                customerTransactionList.data.map((customerTransactionList, index) => (
                                    <tr key={customerTransactionList.id} style={{ border: "2px solid black" }}>
                                        <td >{customerTransactionList.id}</td>
                                        <td>{customerTransactionList.shop_name}</td>
                                        <td>{customerTransactionList.customer_type}</td>
                                        <td>{customerTransactionList.requestor_name}</td>
                                        <td>{customerTransactionList.shop_order_transaction_total_quantity != 0 ? customerTransactionList.shop_order_transaction_total_quantity : ""}</td>
                                        <td>{customerTransactionList.total_cash != 0 ? numberFormat(customerTransactionList.total_cash) : ""}</td>
                                        <td>{customerTransactionList.total_online != 0 ? numberFormat(customerTransactionList.total_online) : ""}</td>
                                        <td>{customerTransactionList.status == 1 ? (

                                            customerTransactionList.mode_of_payment.map((sot, index) => (
                                                <>
                                                    <tr>
                                                        <td><p style={{ fontSize: 12 }}>{numberFormat(sot.amount)}</p></td>
                                                        <td><p style={{ fontSize: 12 }}>{sot.payment_type}</p></td>
                                                    </tr>
                                                </>
                                            )
                                            )
                                        ) : (<></>)
                                        }</td>

                                        <td style={{ fontWeight: 'bold', }}>{customerTransactionList.shop_order_transaction_total_price != 0 ? numberFormat(customerTransactionList.shop_order_transaction_total_price) : ""}</td>
                                        <td style={{ fontWeight: 'bold', }}>{customerTransactionList.profit != 0 ? numberFormat(customerTransactionList.profit) : ""}</td>
                                        <td>{customerTransactionList.date}</td>
                                        <td>{customerTransactionList.status === 1 ? <p style={{ fontWeight: 'bold', color: 'green', }}>COMPLETED</p>
                                            : customerTransactionList.status === 2 ? <p style={{ fontWeight: 'bold', color: 'orange', }}>PENDING</p> :
                                                <p style={{ fontWeight: 'bold', color: 'red', }}>CANCELLED</p>}</td>
                                        <td>
                                            <Link variant="primary" to={"../shopOrderTransaction/completedShopOrderTransaction/" + customerTransactionList.id}   >
                                                <Button variant="primary" >
                                                    View
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                )
                                )
                            }
                        </tbody>)}
            </table>
            <div></div>
        </div>
    )
}

export default CustomerTransactionList
