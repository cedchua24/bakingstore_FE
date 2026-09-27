import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import DeliveryCustomerService from "../OtherService/DeliveryCustomerService";
import UserService from '../User/UserService.service'
import { formatPaymentLabel } from "./shopOrderPaymentHelpers";
import { styled } from '@mui/material/styles';
import { Form } from 'react-bootstrap';
import Checkbox from '@mui/material/Checkbox';

import CircularProgress from '@mui/material/CircularProgress';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import UpdateIcon from '@mui/icons-material/Update';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import moment from "moment";

import LinearProgress from '@mui/material/LinearProgress';
import "./CustomerOrderTransactionList.css";

const PendingDelivery = () => {


    useEffect(() => {
        fetchShopOrderTransactionList();
        fetchRequestor();
    }, []);

    const [requestorList, setRequestorList] = useState([]);

    const [isDeliveryDisabled, setIsDeliveryDisabled] = useState(false);
    const [submitDeliveryLoadingDisabled, setSubmitDeliveryLoadingDisabled] = useState(false);
    const [formDeliveryErrors, setFormDeliveryErrors] = useState({});
    const [customerOrderDate, setCustomerOrderDate] = useState({
        date: ""
    });

    const [findLinear, setFindLinear] = useState(false);
    const [isDisabledFind, setIsDisabledFind] = useState(false);

    const [transactionStatus, setTransactionStatus] = useState({
        status: 0,
        dateFrom: moment().format("YYYY-MM-DD"),
        dateTo: moment().format("YYYY-MM-DD")
    });

    const [date, setDate] = useState('');

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        data: [],
        payment: [],
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


    const [shopOrderTransactionUpdateModal, setShopOrderTransactionUpdateModal] = useState({
        id: 0,
        profit: 0,
        requestor: 0,
        requestor_name: 0,
        shop_name: 0,
        shop_order_transaction_total_price: 0,
        shop_order_transaction_total_quantity: '',
        shop_type_id: 0,
        rider_name: '',
        preparer_id: 0,
        checker_id: 0,
        dispatcher_id: 0,
        pick_up: 0,
        status: 0,
        date: '',
        created_at: '',
        updated_at: ''
    });


    const [shopOrderTransactionList, setShopOrderTransactionList] = useState([]);



    const fetchShopOrderTransactionList = () => {
        ShopOrderTransactionService.fetchDeliveryTransactionV2(transactionStatus)
            .then(response => {
                // setShopOrderTransactionList(response.data);
                setShopOrderTransaction(response.data);
            })
            .catch(e => {
                console.log("error", e)

            });
    }

    const fetchRequestor = () => {
        UserService.fetchUserList()
            .then(response => {
                setRequestorList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const deleteOrderTransaction = (deleteId, e) => {
        setSubmitLoading(true);
        console.log("deleteId", deleteId);
        DeliveryCustomerService.deleteTransaction(deleteId)
            .then(response => {
                setSubmitLoading(false);
                setOpen(false);
                setDeleteOpenModal(false);
                window.scrollTo(0, 0);
                // setValidator({
                //     severity: 'success',
                //     message: 'Successfuly Deleted!',
                //     isShow: true,
                // });
                fetchShopOrderTransactionList();
                // window.location.reload();
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

        ShopOrderTransactionService.updateShopOrderTransactionStatusV2(shopOrderTransactionUpdate.id, shopOrderTransactionUpdate)
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
        textAlign: "center",
    }));
    const onChangeInput = (e) => {
        setTransactionStatus({
            ...transactionStatus,
            status: 0,
            dateFrom: e.target.value,
            dateTo: e.target.value
        })
    }

    const saveOrderTransaction = () => {
        setFindLinear(true);
        setIsDisabledFind(true);
        ShopOrderTransactionService.fetchDeliveryTransactionV2(transactionStatus)
            .then(response => {
                // setShopOrderTransactionList(response.data);
                setShopOrderTransaction(response.data);
                setFindLinear(false);
                setIsDisabledFind(false);
            })
            .catch(e => {
                console.log("error", e)

            });

    }

    const [open, setOpen] = React.useState(false);

    const handleOpen = (id, e) => {
        console.log('e', id);
        fetchTransaction(id);
        setOpen(true);
    }

    const handleClose = () => setOpen(false);

    const handleCloseRider = () => setOpenRider(false);

    const handleClosePickUp = () => setOpenPickUp(false);

    const [openRider, setOpenRider] = React.useState(false);

    const disabledPickUp =
        !shopOrderTransactionUpdateModal?.checker_id ||
        !shopOrderTransactionUpdateModal?.dispatcher_id ||
        !shopOrderTransactionUpdateModal?.preparer_id;

    const [openPickUp, setOpenPickUp] = React.useState(false);

    const handleOpenRider = (id, e) => {
        console.log('e', id);
        fetchTransaction(id);
        setOpenRider(true);
    }

    const handleOpenPickUp = (id, e) => {
        console.log('e', id);
        fetchTransaction(id);
        setOpenPickUp(true);
    }

    const fetchTransaction = async (id) => {
        await ShopOrderTransactionService.get(id)
            .then(response => {
                setShopOrderTransactionUpdateModal(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const updateDate = () => {
        ShopOrderTransactionService.update(shopOrderTransactionUpdateModal.id, shopOrderTransactionUpdateModal)
            .then(response => {
                fetchShopOrderTransactionList();
                setOpen(false);
                setOpenRider(false);
                setOpenPickUp(false);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const onChangeDate = (e) => {
        setShopOrderTransactionUpdateModal({ ...shopOrderTransactionUpdateModal, [e.target.name]: e.target.value });
    }

    const onChangePaymentTypeStatus = (e) => {

        console.log("error", e.target.checked)
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setShopOrderTransactionUpdateModal({ ...shopOrderTransactionUpdateModal, is_pickup: 1 });
            } else {
                setShopOrderTransactionUpdateModal({ ...shopOrderTransactionUpdateModal, is_pickup: 0 });
            }
        } else {
            setShopOrderTransactionUpdateModal({ ...shopOrderTransactionUpdateModal, is_pickup: e.target.value });
        }
    }

    const [deleteOpenModal, setDeleteOpenModal] = React.useState(false);

    const handleDeleteCloseModal = () => {
        setDeleteOpenModal(false);
    };

    const [deleteId, setDeleteId] = useState(0)
    const openDelete = (id) => {
        console.log('delete', id);
        setDeleteId(id)
        setDeleteOpenModal(true);
    }

    const [deliveryModal, setDeliveryModal] = useState({
        id: 0,
        shop_order_transaction_id: 0,
        name: '',
        date: '',
        note: '',
        contact_number: '',
        address: '',
        driver_id: '',
        helper_id: '',
        status: 0,
    });

    const [openDelivery, setOpenDelivery] = React.useState(false);
    const handleOpenDelivery = (id, e) => {
        console.log('e', id);
        fetchDelivery(id);
        setOpenDelivery(true);
    }

    const fetchDelivery = async (shop_order_transaction_id) => {
        await Promise.all([
            DeliveryCustomerService.fetchDeliveryById(shop_order_transaction_id),
            ShopOrderTransactionService.fetchCustomerDetails(shop_order_transaction_id)
        ])
            .then(([deliveryResponse, customerResponse]) => {
                if (JSON.stringify(deliveryResponse.data) === '{}') {
                    const customer = customerResponse.data || {};
                    const customerName = customer.name || customer.requestor_name || [customer.first_name, customer.last_name].filter(Boolean).join(' ');
                    setDeliveryModal({
                        shop_order_transaction_id: shop_order_transaction_id,
                        id: 0,
                        name: customerName || '',
                        date: '',
                        note: '',
                        contact_number: customer.contact_number || '',
                        address: customer.address || '',
                        driver_id: '',
                        helper_id: '',
                        status: 0,
                    });
                } else {
                    setDeliveryModal(deliveryResponse.data);
                }
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const validateDelivery = (values) => {
        const errors = {};
        if (Number(values.status) === 1) {
            if (!String(values.name || '').trim()) errors.name = "Name is Required!";
            if (!String(values.address || '').trim()) errors.address = "Address is Required!";
            if (!String(values.contact_number || '').trim()) errors.contact_number = "Contact Number is Required!";
            if (!String(values.note || '').trim()) errors.note = "Note is Required!";
            if (!String(values.date || '').trim()) errors.date = "Date is Required!";
            if (!values.driver_id) errors.driver_id = "Driver is Required!";
            if (!values.helper_id) errors.helper_id = "Helper is Required!";
        }

        return errors;
    }

    const updateDelivery = () => {
        console.log('status: ', deliveryModal);
        console.log("count: ", Object.keys(validateDelivery(deliveryModal)).length);
        console.log("validate: ", validateDelivery(deliveryModal));
        setFormDeliveryErrors(validateDelivery(deliveryModal));
        if (Object.keys(validateDelivery(deliveryModal)).length > 0) {
            console.log("Has Validation: ");
        } else {
            console.log("Ready for saving: ");
            setSubmitDeliveryLoadingDisabled(true);
            setIsDeliveryDisabled(true);
            DeliveryCustomerService.create(deliveryModal)
                .then(response => {
                    fetchShopOrderTransactionList();
                    setOpenDelivery(false);
                    setSubmitDeliveryLoadingDisabled(false);
                    setIsDeliveryDisabled(false);
                })
                .catch(e => {
                    setOpenDelivery(false);
                    setSubmitDeliveryLoadingDisabled(false);
                    setIsDeliveryDisabled(false);
                    console.log(e);
                });
        }
    }
    const onChangeDelivery = (e) => {
        setDeliveryModal({ ...deliveryModal, [e.target.name]: e.target.value });
    }
    const hanldeCloseDelivery = () => setOpenDelivery(false);

    const onChangeDeliveryStatus = (e) => {

        console.log("error", e.target.checked)
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setDeliveryModal({ ...deliveryModal, status: 1 });
            } else {
                setDeliveryModal({ ...deliveryModal, status: 0 });
            }
        }
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: 'calc(100% - 32px)', sm: 420 },
        maxHeight: '90vh',
        overflowY: 'auto',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        '& .MuiTextField-root': { m: 1, width: '25ch' },
    };



    return (
        <div>
            {/* <div style={{ float: 'right', marginRight: 500 }}>

                {
                    shopOrderTransaction.payment.map((payment, index) => (
                        <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                            <Form.Label>{formatPaymentLabel(payment)}</Form.Label>
                            <Form.Control type="text" value={"₱ " + payment.total_amount} />
                            <Link variant="primary" to={"../shopOrderTransaction/paymentTypeSales/" + (payment.payment_type_po_id || payment.id) + "+" + date}   >
                                <Button variant="primary" >
                                    View
                                </Button>
                            </Link>
                        </Form.Group>
                    )
                    )
                }

            </div> */}

            <div>
                <Form>
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" name="date" onChange={onChangeInput} />
                    </Form.Group>

                    <Button variant="primary"
                        disabled={isDisabledFind}
                        onClick={saveOrderTransaction}
                    >
                        Find
                    </Button>
                    <br></br>
                    <br></br>
                    {findLinear &&
                        <LinearProgress color="warning" />
                    }
                </Form >
            </div>


            <section className="customer-report-table-card">
                <div className="customer-report-table-header"><div><span className="customer-report-eyebrow">Details</span><h2>For Delivery</h2></div><span>{shopOrderTransaction.data.length} records</span></div>
                <div className="customer-report-table-wrap">
                    <table className="customer-report-table customer-report-table-transaction">
                        <thead><tr><th>ID</th><th>Shop</th><th>Customer</th><th>Qty</th><th>Account</th><th>Total</th><th>Date</th><th>Payment</th><th className="customer-report-pickup-col">Pick Up</th><th className="customer-report-delivery-col">Delivery</th><th className="customer-report-actions-col">Actions</th></tr></thead>
                        <tbody>
                            {shopOrderTransaction.data.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td className="customer-report-id customer-report-id-cell"><span className="customer-report-id-stack"><span className="customer-report-order-id">#{transaction.id}</span>{transaction.delivery_customer_id != 0 && <span className="customer-report-delivery-order-badge">Delivery Order</span>}</span></td>
                                    <td><strong>{transaction.shop_name}</strong><span>{transaction.customer_type}</span></td>
                                    <td><strong>{transaction.requestor_name}</strong>{transaction.store_name && <span>{transaction.store_name.toUpperCase()}</span>}</td>
                                    <td>{transaction.shop_order_transaction_total_quantity}</td>
                                    <td><div className="customer-report-bank-list">{(transaction.mode_of_payment || []).map((payment, index) => <span key={payment.id || index}>{payment.amount}<small>{formatPaymentLabel(payment)}</small></span>)}</div></td>
                                    <td><strong>{transaction.shop_order_transaction_total_price}</strong></td>
                                    <td>{transaction.date}<IconButton size="small"><UpdateIcon color="primary" onClick={(e) => handleOpen(transaction.id, e)} /></IconButton></td>
                                    <td><span className={`status-pill ${transaction.status === 1 ? 'status-success' : transaction.status === 2 ? 'status-warning' : 'status-danger'}`}>{transaction.status === 1 ? 'Completed' : transaction.status === 2 ? 'Pending' : 'Cancelled'}</span></td>
                                    <td className="customer-report-pickup-col"><div className="customer-report-status-action customer-report-pickup-action"><span className={`status-pill ${transaction.is_pickup === 1 ? 'status-success' : 'status-warning'}`}>{transaction.is_pickup === 1 ? 'Done' : 'Waiting'}</span><IconButton size="small"><UpdateIcon color="primary" onClick={(e) => handleOpenPickUp(transaction.id, e)} /></IconButton></div></td>
                                    <td className="customer-report-delivery-col"><div className="customer-report-status-action customer-report-delivery-action">{transaction.delivery_status == 1 ? <span className="status-pill status-success">Delivered</span> : <Tooltip title="Delete"><span className="customer-report-delivery-pending"><span className="status-pill status-warning">Pending Delivery</span><IconButton size="small"><DeleteIcon color="error" onClick={(e) => openDelete(transaction.id, e)} /></IconButton></span></Tooltip>}<IconButton size="small"><UpdateIcon color="primary" onClick={(e) => handleOpenDelivery(transaction.id, e)} /></IconButton></div></td>
                                    <td className="customer-report-actions-col"><div className="customer-report-actions">
                                        <Link to={"../shopOrderTransaction/addProductShopOrderTransaction/" + transaction.id}><Button className="customer-report-update-btn" size="sm" variant="success">Update</Button></Link>
                                        <Link to={"../shopOrderTransaction/completedShopOrderTransaction/" + transaction.id + "+" + date}><Button size="sm" variant="outline-primary">View</Button></Link>
                                        <Link to={"../shopOrderTransaction/receiptOrder/" + transaction.id}><Button size="sm" variant="outline-secondary">Receipt</Button></Link>
                                        {Number(transaction.is_pickup) === 1 ? <Link to={"../shopOrderTransaction/deliveryReceipt/" + transaction.id}><Button size="sm" variant="outline-secondary">Delivery Receipt</Button></Link> : <Tooltip title="Complete pick-up to enable"><span><Button size="sm" variant="outline-secondary" disabled>Delivery Receipt</Button></span></Tooltip>}
                                        {transaction.status != 3 && <Button size="sm" variant="outline-danger" onClick={() => deleteShopOrderTransaction(transaction)}>Cancel</Button>}
                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
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

            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Update Date
                    </Typography>

                    <Form.Group className="w-45 mb-3" controlId="formBasicEmail">
                        <Form.Label></Form.Label>
                        <Form.Control type="date" value={shopOrderTransactionUpdateModal.date} name="date" onChange={onChangeDate} />
                    </Form.Group>


                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Button variant="primary" onClick={updateDate}>
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal
                keepMounted
                open={openRider}
                onClose={handleCloseRider}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Add Rider Name
                    </Typography>

                    <Form.Group className="w-45 mb-3" controlId="formBasicEmail">
                        <Form.Label></Form.Label>
                        <Form.Control type="text" value={shopOrderTransactionUpdateModal.rider_name} name="rider_name" onChange={onChangeDate} />
                    </Form.Group>


                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Button variant="primary" onClick={updateDate}>
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal
                keepMounted
                open={openPickUp}
                onClose={handleClosePickUp}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Pick Up Status
                    </Typography>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Is Pick-up ?</Form.Label>

                        <Tooltip
                            title={
                                disabledPickUp
                                    ? "Please fill up all 3 required fields (Checker, Dispatcher, Preparer)"
                                    : ""
                            }
                        >
                            <span>
                                <Checkbox
                                    checked={shopOrderTransactionUpdateModal.is_pickup !== 0}
                                    onChange={onChangePaymentTypeStatus}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                    disabled={disabledPickUp}
                                />
                            </span>
                        </Tooltip>
                    </Form.Group>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Preparer </InputLabel>
                        <Select name="preparer_id" onChange={onChangeDate} value={shopOrderTransactionUpdateModal.preparer_id}>
                            {requestorList.map((requestor) => (
                                <MenuItem key={requestor.id} value={requestor.id}>
                                    {requestor.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <br></br>
                    <br></br>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Checker </InputLabel>
                        <Select name="checker_id" onChange={onChangeDate} value={shopOrderTransactionUpdateModal.checker_id}>
                            {requestorList.map((requestor) => (
                                <MenuItem key={requestor.id} value={requestor.id}>
                                    {requestor.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <br></br>
                    <br></br>

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Dispatcher</InputLabel>
                        <Select name="dispatcher_id" onChange={onChangeDate} value={shopOrderTransactionUpdateModal.dispatcher_id}>
                            {requestorList.map((requestor) => (
                                <MenuItem key={requestor.id} value={requestor.id}>
                                    {requestor.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <br></br>
                    <br></br>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Button variant="primary" onClick={updateDate}>
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal
                keepMounted
                open={openDelivery}
                onClose={hanldeCloseDelivery}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h4" align="center" component="h2">
                        For Delivery
                    </Typography>
                    <br></br>
                    {formDeliveryErrors.name && <p style={{ color: "red" }}>{formDeliveryErrors.name}</p>}
                    <Form.Group className="w-45 mb-3" controlId="formBasicEmail">
                        <Form.Label>Receiver Name</Form.Label>
                        <Form.Control type="text" value={deliveryModal.name} name="name" onChange={onChangeDelivery} />
                    </Form.Group>
                    {formDeliveryErrors.address && <p style={{ color: "red" }}>{formDeliveryErrors.address}</p>}
                    <Form.Group className="w-45 mb-3" controlId="formBasicEmail">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" value={deliveryModal.address} name="address" onChange={onChangeDelivery} />
                    </Form.Group>
                    {formDeliveryErrors.contact_number && <p style={{ color: "red" }}>{formDeliveryErrors.contact_number}</p>}
                    <Form.Group className="w-45 mb-3" controlId="formBasicEmail">
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control type="text" value={deliveryModal.contact_number} name="contact_number" onChange={onChangeDelivery} />
                    </Form.Group>
                    <Form.Group className="w-45 mb-3" controlId="formBasicEmail">
                        <Form.Label>Note</Form.Label>
                        <Form.Control type="text" value={deliveryModal.note} name="note" onChange={onChangeDelivery} />
                    </Form.Group>
                    {formDeliveryErrors.note && <p style={{ color: "red" }}>{formDeliveryErrors.note}</p>}
                    {formDeliveryErrors.date && <p style={{ color: "red" }}>{formDeliveryErrors.date}</p>}
                    <Form.Group className="w-45 mb-3" controlId="formBasicEmail">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" value={deliveryModal.date} name="date" onChange={onChangeDelivery} />
                    </Form.Group>
                    {formDeliveryErrors.driver_id && <p style={{ color: "red" }}>{formDeliveryErrors.driver_id}</p>}
                    <FormControl required={Number(deliveryModal.status) === 1} sx={{ width: '100%', mb: 2 }}>
                        <InputLabel>Driver</InputLabel>
                        <Select name="driver_id" label="Driver" value={deliveryModal.driver_id || ''} onChange={onChangeDelivery}>
                            {requestorList.map((user) => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    {formDeliveryErrors.helper_id && <p style={{ color: "red" }}>{formDeliveryErrors.helper_id}</p>}
                    <FormControl required={Number(deliveryModal.status) === 1} sx={{ width: '100%', mb: 2 }}>
                        <InputLabel>Helper</InputLabel>
                        <Select name="helper_id" label="Helper" value={deliveryModal.helper_id || ''} onChange={onChangeDelivery}>
                            {requestorList.map((user) => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>is Delivered ? </Form.Label>
                        <Checkbox
                            checked={deliveryModal.status === 0 ? false : true}
                            onChange={onChangeDeliveryStatus}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </Form.Group>
                    <br></br>
                    <br></br>
                    {submitDeliveryLoadingDisabled &&
                        <LinearProgress color="warning" />
                    }
                    <br></br>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Button variant="primary"
                            onClick={updateDelivery}
                            disabled={isDeliveryDisabled}
                        >
                            Submit
                        </Button>


                    </Box>
                </Box>
            </Modal>

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
                    <Button onClick={handleDeleteCloseModal}>Cancel</Button>
                    <Button onClick={(e) => deleteOrderTransaction(deleteId, e)} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    )
}

export default PendingDelivery
