import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import OrderCustomerListService from "./OrderCustomerListService.service";
const OrderCustomeList = () => {


    useEffect(() => {
        fetchOrderTransactionList();
    }, []);

    const [orderTransactionList, setOrderTransactionList] = useState([]);



    const fetchOrderTransactionList = () => {
        OrderCustomerListService.getAll()
            .then(response => {
                setOrderTransactionList(response.data);
            })
            .catch(e => {
                console.log("error", e)

            });
    }

    const deleteOrderTransaction = (id, e) => {

        const index = orderTransactionList.findIndex(orderTransaction => orderTransaction.id === id);
        const newOrderTransaction = [...orderTransactionList];
        newOrderTransaction.splice(index, 1);

        OrderCustomerListService.delete(id)
            .then(response => {
                setOrderTransactionList(newOrderTransaction);
            })
            .catch(e => {
                console.log('error', e);
            });
    }


    return (
        <div>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Customer Name</th>
                        <th>Total Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        orderTransactionList.map((orderTransaction, index) => (
                            <tr key={orderTransaction.id} >
                                <td>{orderTransaction.id}</td>
                                <td>{orderTransaction.supplier_name}</td>
                                <td>{orderTransaction.total_transaction_price}</td>
                                <td>{orderTransaction.created_at}</td>
                                <td>{orderTransaction.status}</td>
                                <td>
                                    <Link variant="primary" to={"/CompletedCustomerOrder/" + orderTransaction.id}   >
                                        <Button variant="primary" >
                                            View
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Link variant="primary" to={"/addProductOrderSupplierTransaction/" + orderTransaction.id}   >
                                        <Button variant="success" >
                                            Update
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={(e) => deleteOrderTransaction(orderTransaction.id, e)} >
                                        Delete
                                    </Button>
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

export default OrderCustomeList
