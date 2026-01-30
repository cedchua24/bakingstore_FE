import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

import OrderSupplierTransactionService from "../OrderSupplierTransaction/OrderSupplierTransactionService";

import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { Form } from 'react-bootstrap';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const ReportPurchaseOrderList = () => {

    useEffect(() => {
        fetchOrderTransactionList();
    }, []);

    const [deleteOpenModal, setDeleteOpenModal] = React.useState(false);
    const [deleteId, setDeleteId] = useState(0)


    const handleDeleteCloseModal = () => {
        setDeleteOpenModal(false);
    };

    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});


    const [orderTransactionList, setOrderTransactionList] = useState({
        data: [],
        payment: [],
        total_balance: {},
        total_paid: {},
        code: '',
        message: '',
        total_sales: 0
    });

    const [customerOrderDate, setCustomerOrderDate] = useState({
        dateFrom: "",
        dateTo: ""
    });


    const fetchOrderTransactionList = () => {
        OrderSupplierTransactionService.fetchAllOrderSupplier()
            .then(response => {
                setOrderTransactionList(response.data);
            })
            .catch(e => {
                console.log("error", e)

            });
    }


    const validate = (values) => {
        const errors = {};
        if (customerOrderDate.dateFrom.length == 0) {
            errors.dateFrom = "Date From Required!";
        }
        if (customerOrderDate.dateTo.length == 0) {
            errors.dateTo = "Date To Required!";
        }

        return errors;
    }


    const onChangeInput = (e) => {
        console.log(e.target.value);
        setCustomerOrderDate({ ...customerOrderDate, [e.target.name]: e.target.value });
    }

    const saveOrderTransaction = () => {
        console.log("count: ", Object.keys(validate(customerOrderDate)).length);
        console.log("validate: ", validate(customerOrderDate));
        setFormErrors(validate(customerOrderDate));
        if (Object.keys(validate(customerOrderDate)).length > 0) {
            console.log("Has Validation: ");
        } else {
            console.log("Ready for saving: ");
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            OrderSupplierTransactionService.fetchAllOrderSupplier(customerOrderDate)
                .then(response => {
                    setOrderTransactionList(response.data);
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                })
                .catch(e => {
                    console.log("error", e)
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                });
        }
    }

    const submitCancel = (id, e) => {
        setSubmitLoading(true);
        OrderSupplierTransactionService.delete(id)
            .then(response => {
                console.log('response', response.data);

                window.scrollTo(0, 0);
                setSubmitLoading(false);
                setDeleteOpenModal(false);
                fetchOrderTransactionList();

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

    const statusColor = {
        PENDING: '#ed6c02',   // orange
        APPROVED: '#2e7d32',  // green
        REJECTED: '#d32f2f',  // red
    };


    return (
        <div >
            <Box sx={{ minWidth: 20 }}>
                <Form >
                    {formErrors.dateFrom && <p style={{ color: "red" }}>{formErrors.dateFrom}</p>}
                    <Form.Group className="w-15 mb-3" controlId="formBasicEmail" sx={{ minWidth: 20 }}>
                        <Form.Label>Date From:</Form.Label>
                        <Form.Control type="date" name="dateFrom" onChange={onChangeInput} />
                    </Form.Group>
                    {formErrors.dateTo && <p style={{ color: "red" }}>{formErrors.dateTo}</p>}
                    <Form.Group className="w-15 mb-3" controlId="formBasicEmail">
                        <Form.Label>Date To:</Form.Label>
                        <Form.Control type="date" name="dateTo" onChange={onChangeInput} />
                    </Form.Group>

                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label>Total Paid: </Form.Label>
                        <Form.Control type="text" value={numberFormat(orderTransactionList.total_paid.total_paid)} />
                    </Form.Group>

                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label>Total Balance: </Form.Label>
                        <Form.Control type="text" value={numberFormat(orderTransactionList.total_balance.total_balance)} />
                    </Form.Group>
                    <Button variant="primary" onClick={saveOrderTransaction} disabled={isAddDisabled}>
                        Find
                    </Button>
                    <br></br>
                    <br></br>
                    {submitLoadingAdd &&
                        <LinearProgress color="warning" />
                    }
                    <br></br>
                </Form >
            </Box>

            <div >
                <legend align="center" style={{ fontWeight: 'bold' }} > Purchase Order Report List </legend>
                <table class="table table-bordered">
                    <thead class="table-dark">
                        <tr class="table-secondary">
                            <th>ID</th>
                            <th>Invoice Number</th>
                            <th>Supplier Name</th>
                            <th>Total Amount</th>
                            <th>Requestor</th>
                            <th>Approver</th>
                            <th>Approval Status</th>
                            <th>Date Draft</th>
                            <th>Date Received</th>
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
                                    <td>{numberFormat(orderTransaction.total_transaction_price)}</td>
                                    <td>{orderTransaction.requestor}</td>
                                    <td>{orderTransaction.approval}</td>
                                    <td style={{ color: statusColor[orderTransaction.approval_status], fontWeight: 'bold' }}>
                                        {orderTransaction.approval_status}
                                    </td>
                                    <td>{orderTransaction.created_at}</td>
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
                                    <td>
                                        <Link variant="primary" to={"/editSupplierTransaction/" + orderTransaction.id}   >
                                            <Button variant="warning" >
                                                Update Invoice
                                            </Button>
                                        </Link>
                                    </td>
                                    <td>
                                        <Link variant="primary" to={"/paymentOrder/" + orderTransaction.id}   >
                                            <Button variant="success" >
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
                                    <td>
                                        <Link variant="primary" to={"/orderSupplierApproval/" + orderTransaction.id}   >
                                            <Button variant="primary" >
                                                Review Order
                                            </Button>
                                        </Link>
                                    </td>
                                    <td>
                                        <Link variant="primary" to={"/printOrderSupplier/" + orderTransaction.id}   >
                                            <Button variant="secondary" >
                                                Print
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
                                        {orderTransaction.total_transaction_price == 0 && orderTransaction.payment_status != 1 && orderTransaction.status === 'IN_PROGRESS' &&
                                            <td>
                                                <Button variant="danger" onClick={(e) => openDelete(orderTransaction.id, e)} >
                                                    Delete
                                                </Button>
                                            </td>
                                        }
                                    </div> :
                                        <></>
                                    }


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
                    {"Are you sure you want to Delete?"}
                </DialogTitle>
                {submitLoading &&
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </div>
                }
                <DialogActions>
                    <Button onClick={handleDeleteCloseModal}>Delete</Button>
                    <Button onClick={(e) => submitCancel(deleteId, e)} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    )
}

export default ReportPurchaseOrderList
