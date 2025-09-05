import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import OrderSupplierTransactionService from "./OrderSupplierTransactionService";
import { Form } from 'react-bootstrap';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';


const SupplierTransactionListV2 = () => {


    useEffect(() => {
        fetchOrderTransactionList();
    }, []);

    const [deleteOpenModal, setDeleteOpenModal] = React.useState(false);
    const [deleteId, setDeleteId] = useState(0)
    const [submitLoading, setSubmitLoading] = useState(false);

    const handleDeleteCloseModal = () => {
        setDeleteOpenModal(false);
    };

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [orderTransactionList, setOrderTransactionList] = useState({
        data: [],
        payment: [],
        total_balance: {},
        code: '',
        message: '',
        total_sales: 0
    });




    const fetchOrderTransactionList = () => {
        OrderSupplierTransactionService.fetchOrderSupplierByDateV2(0)
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

        OrderSupplierTransactionService.delete(id)
            .then(response => {
                setOrderTransactionList(newOrderTransaction);
            })
            .catch(e => {
                console.log('error', e);
            });
    }

    const submitCancel = (id, e) => {
        setSubmitLoading(true);
        OrderSupplierTransactionService.setToCancelTransaction(id)
            .then(response => {
                console.log('response', response.data);
                if (response.data.code == 200) {
                    setSubmitLoading(false);
                    setDeleteOpenModal(false);
                    fetchOrderTransactionList();
                } else if (response.data.code == 500) {
                    setValidator({
                        severity: 'error',
                        message: response.data.message,
                        isShow: true,
                    });
                    setSubmitLoading(false);
                    setDeleteOpenModal(false);
                    window.scrollTo(0, 0);
                }

            })
            .catch(e => {
                setSubmitLoading(false);
                setDeleteOpenModal(false);
                console.log('error', e);
            });
    }

    const openDelete = (id) => {
        console.log('delete', id);
        setDeleteId(id)
        setDeleteOpenModal(true);
    }

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');





    return (
        <div>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>
            <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                <Form.Label>Total Balance: </Form.Label>
                <Form.Control type="text" value={numberFormat(orderTransactionList.total_balance.total_balance)} />
            </Form.Group>
            <div >
                <legend align="center" style={{ fontWeight: 'bold' }} > Purchase Order List </legend>
                <table class="table table-bordered">
                    <thead class="table-dark">
                        <tr class="table-secondary">
                            <th>ID</th>
                            <th>Invoice Number</th>
                            <th>Supplier Name</th>
                            <th>With Tax</th>
                            <th>Total Amount</th>
                            <th>Date</th>
                            <th>Delivery Status</th>
                            <th>Payment Status</th>
                            <th>Bank</th>
                            {/* <th>Placed Stock Status</th>
                            <th>Organize Stock</th> */}
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            orderTransactionList.data.map((orderTransaction, index) => (
                                <tr key={orderTransaction.id} >
                                    <td>{orderTransaction.id}</td>
                                    <td>{orderTransaction.invoice_number}</td>
                                    <td>{orderTransaction.supplier_name}</td>
                                    <td>{orderTransaction.withTax === 1 ? <CheckIcon style={{ color: 'black', }} /> : <CloseIcon style={{ color: 'black', }} />}</td>
                                    <td>{numberFormat(orderTransaction.total_transaction_price)}</td>
                                    <td>{orderTransaction.order_date}</td>
                                    <td>{orderTransaction.status === 'COMPLETED' ? <p style={{ fontWeight: 'bold', color: 'green', }}>COMPLETED</p>
                                        : orderTransaction.status === 'IN_PROGRESS' ? <p style={{ fontWeight: 'bold', color: 'orange', }}>PENDING</p> :
                                            <p style={{ fontWeight: 'bold', color: 'red', }}>CANCELLED</p>}
                                    </td>
                                    <td>{orderTransaction.payment_status == 1 ? <p style={{ fontWeight: 'bold', color: 'green', }}>COMPLETED</p>
                                        : <p style={{ fontWeight: 'bold', color: 'orange', }}>PENDING</p>}
                                    </td>
                                    <td>{

                                        orderTransaction.mode_of_payment.map((sot, index) => (
                                            <>
                                                <tr>
                                                    <td><p style={{ fontSize: 12 }}>{numberFormat(sot.amount)}</p></td>
                                                    <td><p style={{ fontSize: 12 }}>{sot.bank_name + " " + sot.account_description + " - " + sot.account_number}</p></td>
                                                </tr>
                                            </>
                                        )
                                        )

                                    }</td>
                                    {/* <td>{orderTransaction.stock_status === 1 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td> */}
                                    <td>
                                        <Link variant="primary" to={"/editSupplierTransaction/" + orderTransaction.id}   >
                                            <Button variant="warning" >
                                                Update Invoice
                                            </Button>
                                        </Link>
                                    </td>
                                    <td>
                                        <Link variant="primary" to={"/paymentOrder/" + orderTransaction.id}   >
                                            <Button variant="primary" >
                                                Update Payment
                                            </Button>
                                        </Link>
                                    </td>
                                    {/* <td>
                                        <Link variant="primary" to={"/branchStock/" + orderTransaction.id}   >
                                            <Button variant="warning" >
                                                {orderTransaction.stock_status === 1 ? 'View Stock' : 'Place Stock'}
                                            </Button>
                                        </Link>
                                    </td> */}
                                    <td>
                                        <Link variant="primary" to={"/viewOrder/" + orderTransaction.id}   >
                                            <Button variant="primary" >
                                                View
                                            </Button>
                                        </Link>
                                    </td>

                                    {orderTransaction.status != 'COMPLETED' ? <div>
                                        <td>
                                            <Link variant="primary" to={"/addProductOrderSupplierTransaction/" + orderTransaction.id}   >
                                                <Button variant="success" >
                                                    Update Order
                                                </Button>
                                            </Link>
                                        </td>
                                    </div> : <td>
                                        <Button variant="danger" onClick={(e) => openDelete(orderTransaction.id, e)} >
                                            Delete
                                        </Button>
                                    </td>}


                                </tr>
                            )
                            )
                        }
                    </tbody>
                </table>
            </div>
            <Dialog
                open={deleteOpenModal}
                onClose={handleDeleteCloseModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >

                <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to Cancel?"}
                </DialogTitle>
                {submitLoading &&
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </div>
                }
                <DialogActions>
                    <Button onClick={handleDeleteCloseModal}>Cancel</Button>
                    <Button onClick={(e) => submitCancel(deleteId, e)} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    )
}

export default SupplierTransactionListV2
