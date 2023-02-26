import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ShopOrderTransactionService from "./ShopOrderTransactionService";
const ShorOrderTransactionList = () => {


    useEffect(() => {
        fetchShopOrderTransactionList();
    }, []);

    const [shopOrderTransactionList, setShopOrderTransactionList] = useState([]);



    const fetchShopOrderTransactionList = () => {
        ShopOrderTransactionService.getAll()
            .then(response => {
                setShopOrderTransactionList(response.data);
            })
            .catch(e => {
                console.log("error", e)

            });
    }

    const deleteOrderTransaction = (id, e) => {

        const index = shopOrderTransactionList.findIndex(shopOrderTransaction => shopOrderTransaction.id === id);
        const newShopOrderTransaction = [...shopOrderTransactionList];
        newShopOrderTransaction.splice(index, 1);

        ShopOrderTransactionService.delete(id)
            .then(response => {
                setShopOrderTransactionList(newShopOrderTransaction);
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
                        <th>Shop Name</th>
                        <th>Total Quantity</th>
                        <th>Total Amount</th>
                        <th>Requestor</th>
                        <th>Checker</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        shopOrderTransactionList.map((shopOrderTransaction, index) => (
                            <tr key={shopOrderTransaction.id} >
                                <td>{shopOrderTransaction.id}</td>
                                <td>{shopOrderTransaction.shop_name}</td>
                                <td>{shopOrderTransaction.shop_order_transaction_total_quantity}</td>
                                <td>{shopOrderTransaction.shop_order_transaction_total_price}</td>
                                <td>{shopOrderTransaction.requestor_name}</td>
                                <td>{shopOrderTransaction.checker_name}</td>
                                <td>{shopOrderTransaction.created_at}</td>
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
                                <td>
                                    <Link variant="primary" to={"../shopOrderTransaction/addProductShopOrderTransaction/" + shopOrderTransaction.id}   >
                                        <Button variant="success" >
                                            Update
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={(e) => deleteOrderTransaction(shopOrderTransaction.id, e)} >
                                        Cancel
                                    </Button>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={(e) => deleteOrderTransaction(shopOrderTransaction.id, e)} >
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

export default ShorOrderTransactionList