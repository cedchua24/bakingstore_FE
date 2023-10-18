import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import { styled } from '@mui/material/styles';
import { Form } from 'react-bootstrap';

import CircularProgress from '@mui/material/CircularProgress';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const CustomerOrderTransactionList = () => {


    useEffect(() => {
        fetchShopOrderTransactionList();
    }, []);

    const [customerOrderDate, setCustomerOrderDate] = useState({
        date: ""
    });

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        data: [],
        code: '',
        message: '',
        total_price: 0,
        total_profit: 0
    });

    const [shopOrderTransactionUpdate, setShopOrderTransactionUpdate] = useState({
        checker: 0,
        id: 0,
        profit: 0,
        requestor: 0,
        requestor_name: 0,
        shop_name: 0,
        shop_order_transaction_total_price: 0,
        shop_order_transaction_total_quantity: '',
        shop_type_id: 0,
        status: 3,
        created_at: '',
        updated_at: ''
    });


    const [shopOrderTransactionList, setShopOrderTransactionList] = useState([]);



    const fetchShopOrderTransactionList = () => {
        ShopOrderTransactionService.fetchOnlineShopOrderTransactionList()
            .then(response => {
                // setShopOrderTransactionList(response.data);
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

    const [submitOpenModal, setSubmitOpenModal] = React.useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);


    const handleSubmitCloseModal = () => {
        setSubmitOpenModal(false);
    };

    const deleteShopOrderTransaction = (shopOrderTransactions) => {

        console.log('shopOrderTransaction', shopOrderTransactions);

        setShopOrderTransactionUpdate({
            id: shopOrderTransactions.id,
            status: 3,
        });
        setSubmitOpenModal(true);

    }

    const updateShopOrderTransactionStatus = async (event) => {
        event.preventDefault();
        setSubmitLoading(true);

        ShopOrderTransactionService.updateShopOrderTransactionStatus(shopOrderTransactionUpdate.id, shopOrderTransactionUpdate)
            .then(response => {
                setSubmitLoading(false);
                setSubmitOpenModal(false);
                fetchShopOrderTransactionList();
            })
            .catch(e => {
                console.log(e);
            });
    }

    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: "2rem",
        padding: theme.spacing(1),
    }));

    const onChangeInput = (e) => {
        setCustomerOrderDate({ ...customerOrderDate, [e.target.name]: e.target.value });
    }

    const saveOrderTransaction = () => {
        console.log('orderTransaction', customerOrderDate.date);
        ShopOrderTransactionService.fetchOnlineShopOrderTransactionListByDate(customerOrderDate.date)
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
                    <Form.Label>Total Cash Payment: </Form.Label>
                    <Form.Control type="text" value={"₱ " + shopOrderTransaction.total_cash} />
                </Form.Group>
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                    <Form.Label>Total Online Payment: </Form.Label>
                    <Form.Control type="text" value={"₱ " + shopOrderTransaction.total_online} />
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
            <Div>{"Online Orders"}
            </Div>

            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Shop Name</th>
                        <th>Total Quantity</th>
                        <th>Total Cash</th>
                        <th>Total Online</th>
                        <th>Total Amount</th>
                        <th>Profit</th>
                        <th>Customer</th>
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
                                <td>{shopOrderTransaction.total_cash}</td>
                                <td>{shopOrderTransaction.total_online}</td>
                                <td style={{ fontWeight: 'bold', }}>{shopOrderTransaction.shop_order_transaction_total_price}</td>
                                <td style={{ fontWeight: 'bold', }}>{shopOrderTransaction.profit}</td>
                                <td>{shopOrderTransaction.requestor_name}</td>
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
                                    <Link variant="primary" to={"../shopOrderTransaction/receiptOrder/" + shopOrderTransaction.id}   >
                                        <Button variant="primary" >
                                            Print Receipt
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
                                    {
                                        shopOrderTransaction.status != 3 &&
                                        <Button variant="danger" onClick={(e) => deleteShopOrderTransaction(shopOrderTransaction)} >
                                            Cancel
                                        </Button>
                                    }
                                </td>
                                {/* <td>
                                    <Button variant="danger" onClick={(e) => deleteShopOrderTransaction(shopOrderTransaction)} >
                                        deleteShopOrderTransaction
                                    </Button>
                                </td> */}

                                {/* <td>
                                    <Button variant="danger" onClick={(e) => deleteOrderTransaction(shopOrderTransaction.id, e)} >
                                        Delete
                                    </Button>
                                </td> */}
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
            <Dialog
                open={submitOpenModal}
                onClose={handleSubmitCloseModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >

                <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to Submit?"}
                </DialogTitle>
                {submitLoading &&
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </div>
                }
                <DialogActions>
                    <Button onClick={handleSubmitCloseModal}>Cancel</Button>
                    <Button onClick={updateShopOrderTransactionStatus} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    )
}

export default CustomerOrderTransactionList
