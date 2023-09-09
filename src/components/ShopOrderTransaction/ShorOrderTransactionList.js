import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import { styled } from '@mui/material/styles';
import { Form } from 'react-bootstrap';

const ShorOrderTransactionList = () => {


    useEffect(() => {
        fetchShopOrderTransactionList();
    }, []);

    const [shopOrderDate, setShopOrderDate] = useState({
        date: ""
    });
    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        data: [],
        code: '',
        message: '',
        total_price: 0
    });

    const [shopOrderTransactionList, setShopOrderTransactionList] = useState([]);



    const fetchShopOrderTransactionList = () => {
        ShopOrderTransactionService.getAll()
            .then(response => {
                setShopOrderTransaction(response.data);
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

    const deleteShopOrderTransaction = (shopOrderTransaction) => {

        console.log('shopOrderTransaction', shopOrderTransaction);
        // const index = shopOrderTransactionList.findIndex(shopOrderTransaction => shopOrderTransaction.id === id);
        // const newShopOrderTransaction = [...shopOrderTransactionList];
        // newShopOrderTransaction.splice(index, 1);

        ShopOrderTransactionService.deleteShopOrderTransaction(shopOrderTransaction)
            .then(response => {

            })
            .catch(e => {
                console.log('error', e);
            });
    }

    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: "2rem",
        padding: theme.spacing(1),
    }));

    const onChangeInput = (e) => {
        setShopOrderDate({ ...shopOrderDate, [e.target.name]: e.target.value });
    }

    const saveOrderTransaction = () => {
        console.log('shopOrderDate', shopOrderDate.date);
        ShopOrderTransactionService.fetchShopOrderTransactionListByDate(shopOrderDate.date)
            .then(response => {
                setShopOrderTransaction(response.data);
            })
            .catch(e => {
                console.log("error", e)

            });

    }

    return (
        <div>
            <Form>
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" name="date" onChange={onChangeInput} />
                </Form.Group>
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                    <Form.Label>Total Sales: </Form.Label>
                    <Form.Control type="text" value={"₱ " + shopOrderTransaction.total_price} />
                </Form.Group>
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                    <Form.Label>Total Profit: </Form.Label>
                    <Form.Control type="text" value={"₱ " + shopOrderTransaction.total_profit} />
                </Form.Group>

                <Button variant="primary" onClick={saveOrderTransaction}>
                    Find
                </Button>
            </Form >
            <Div>{"Shop Branch Order"}</Div>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Shop Name</th>
                        <th>Total Quantity</th>
                        <th>Total Amount</th>
                        <th>Profit</th>
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
                        shopOrderTransaction.data.map((shopOrderTransaction, index) => (
                            <tr key={shopOrderTransaction.id} >
                                <td>{shopOrderTransaction.id}</td>
                                <td>{shopOrderTransaction.shop_name}</td>
                                <td>{shopOrderTransaction.shop_order_transaction_total_quantity}</td>
                                <td>{shopOrderTransaction.shop_order_transaction_total_price}</td>
                                <td>{shopOrderTransaction.profit}</td>
                                <td>{shopOrderTransaction.requestor_name}</td>
                                <td>{shopOrderTransaction.checker_name}</td>
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
                                <td>
                                    <Link variant="primary" to={"../shopOrderTransaction/addProductShopOrderTransaction/" + shopOrderTransaction.id}   >
                                        <Button variant="success" >
                                            Update
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={(e) => deleteShopOrderTransaction(shopOrderTransaction)} >
                                        Cancel
                                    </Button>
                                </td>
                                {/* <td>
                                    <Button variant="danger" onClick={(e) => deleteShopOrderTransaction(shopOrderTransaction)} >
                                        deleteShopOrderTransaction
                                    </Button>
                                </td> */}

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
