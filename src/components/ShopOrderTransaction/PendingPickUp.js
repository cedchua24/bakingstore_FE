import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import DeliveryCustomerService from "../OtherService/DeliveryCustomerService";
import UserService from '../User/UserService.service'
import { styled } from '@mui/material/styles';
import { Form } from 'react-bootstrap';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import UpdateIcon from '@mui/icons-material/Update';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import LinearProgress from '@mui/material/LinearProgress';
import "./CustomerOrderTransactionList.css";

const PendingPickUp = () => {


    useEffect(() => {
        fetchShopOrderTransactionList();
        fetchRequestor();
    }, []);

    const [requestorList, setRequestorList] = useState([]);

    const [customerOrderDate, setCustomerOrderDate] = useState({
        is_pickup_status: 0,
        status: null,
        dateTo: null,
        dateFrom: null,
    });

    const [transactionStatus, setTransactionStatus] = useState({
        status: 2
    });

    const [role, setRole] = useState(localStorage.getItem('role_as'));

    const [formDeliveryErrors, setFormDeliveryErrors] = useState({});
    const [formErrorsPickUp, setFormErrorsPickup] = useState({});
    const [isDeliveryDisabled, setIsDeliveryDisabled] = useState(false);
    const [submitDeliveryLoadingDisabled, setSubmitDeliveryLoadingDisabled] = useState(false);
    const [date, setDate] = useState('');

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        data: [],
        payment: [],
        code: '',
        message: '',
        total_price: 0,
        total_profit: 0
    });

    const [deliveryModal, setDeliveryModal] = useState({
        id: 0,
        shop_order_transaction_id: 0,
        name: '',
        date: '',
        note: '',
        contact_number: '',
        address: '',
        status: 0,
        address: ''
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

    const [pickUpModal, setPickUpModal] = useState({
        id: 0,
        first_name: '',
        last_name: '',
        contact_number: '',
        preparer_id: 0,
        checker_id: 0,
        dispatcher_id: 0,
        email: '',
        address: '',
        store_name: '',
        date: '',
        customer_id: 0,
        is_pickup: 0,
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
        pick_up: 0,
        status: 0,
        date: '',
        created_at: '',
        updated_at: ''
    });


    const [shopOrderTransactionList, setShopOrderTransactionList] = useState([]);



    const fetchShopOrderTransactionList = () => {
        setSubmitLoading(true);
        setIsDeliveryDisabled(true);
        ShopOrderTransactionService.fetchPendingPickUp(customerOrderDate)
            .then(response => {
                // setShopOrderTransactionList(response.data);
                setShopOrderTransaction(response.data);
                setSubmitLoading(false);
                setIsDeliveryDisabled(false);
            })
            .catch(e => {
                console.log("error", e)

            });
    }

    const fetchRequestor = () => {
        UserService.getAll()
            .then(response => {
                setRequestorList(response.data);
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

        ShopOrderTransactionService.delete(shopOrderTransactionUpdate.id)
            .then(response => {
                fetchShopOrderTransactionList();
                setSubmitLoading(false);
                setSubmitOpenModal(false);
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
        setCustomerOrderDate({ ...customerOrderDate, [e.target.name]: e.target.value });
    }

    const saveOrderTransaction = () => {
        setSubmitLoading(true);
        setIsDeliveryDisabled(true);
        console.log('orderTransaction', customerOrderDate.date);
        ShopOrderTransactionService.fetchPendingPickUp(customerOrderDate)
            .then(response => {
                setShopOrderTransaction(response.data);
                setSubmitLoading(false);
                setIsDeliveryDisabled(false);
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
        !pickUpModal?.checker_id ||
        !pickUpModal?.dispatcher_id ||
        !pickUpModal?.preparer_id;

    const [openPickUp, setOpenPickUp] = React.useState(false);

    const handleOpenRider = (id, e) => {
        console.log('e', id);
        fetchTransaction(id);
        setOpenRider(true);
    }

    const handleOpenPickUp = (id, e) => {
        console.log('e', id);
        fetchTransactionPickUp(id);
        setOpenPickUp(true);
    }
    const onChangeDelivery = (e) => {
        setDeliveryModal({ ...deliveryModal, [e.target.name]: e.target.value });
    }

    const validateDelivery = (values) => {
        const errors = {};
        if (deliveryModal.name.length == 0) {
            errors.name = "Name is Required!";
        }
        if (deliveryModal.address.length == 0) {
            errors.name = "Address is Required!";
        }
        if (deliveryModal.contact_number.length == 0) {
            errors.name = "Contact Number is Required!";
        }
        if (deliveryModal.date.length == 0) {
            errors.name = "Date is Required!";
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

    const fetchTransaction = async (id) => {
        await ShopOrderTransactionService.get(id)
            .then(response => {
                setShopOrderTransactionUpdateModal(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchTransactionPickUp = async (id) => {
        await ShopOrderTransactionService.fetchCustomerDetails(id)
            .then(response => {
                console.log('response.data', response.data);
                setPickUpModal(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const validatePickUp = (values) => {
        const errors = {};
        if (pickUpModal.last_name == null || pickUpModal.last_name.length == 0) {
            errors.last_name = "Last Name is Required!";
        }
        // if (pickUpModal.address == null || pickUpModal.address.length == 0) {
        //     errors.address = "Address is Required!";
        // }
        // if (pickUpModal.contact_number == null || pickUpModal.contact_number.length == 0) {
        //     errors.contact_number = "Contact Number is Required!";
        // }
        // if (pickUpModal.store_name.length == 0) {
        //     errors.store_name = "Store Name is Required!";
        // }
        return errors;
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

    const updatePickUp = () => {
        console.log('status: ', pickUpModal);
        console.log("count: ", Object.keys(validatePickUp(pickUpModal)).length);
        console.log("validate: ", validatePickUp(pickUpModal));
        setFormErrorsPickup(validatePickUp(pickUpModal));
        if (Object.keys(validatePickUp(pickUpModal)).length > 0) {
            console.log("Has Validation: ");
        } else {
            ShopOrderTransactionService.pickUpAndCustomerUpdate(pickUpModal)
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


    const [openDelivery, setOpenDelivery] = React.useState(false);
    const hanldeCloseDelivery = () => setOpenDelivery(false);

    const handleOpenDelivery = (id, e) => {
        console.log('e', id);
        fetchDelivery(id);
        setOpenDelivery(true);
    }

    const fetchDelivery = async (shop_order_transaction_id) => {
        await DeliveryCustomerService.fetchDeliveryById(shop_order_transaction_id)
            .then(response => {
                if (JSON.stringify(response.data) === '{}') {
                    setDeliveryModal({
                        shop_order_transaction_id: shop_order_transaction_id,
                        id: 0,
                        name: '',
                        date: '',
                        note: '',
                        contact_number: '',
                        address: '',
                        status: 0,
                        address: ''
                    });

                    console.log('wla', response.data)
                } else {
                    console.log('meron', response.data)
                    setDeliveryModal(response.data);
                }

            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const onChangeDate = (e) => {
        setShopOrderTransactionUpdateModal({ ...shopOrderTransactionUpdateModal, [e.target.name]: e.target.value });
    }

    const onChangePaymentTypeStatus = (e) => {

        console.log("error", e.target.checked)
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setPickUpModal({ ...pickUpModal, is_pickup: 1 });
            } else {
                setPickUpModal({ ...pickUpModal, is_pickup: 0 });
            }
        } else {
            setPickUpModal({ ...pickUpModal, is_pickup: e.target.value });
        }
    }

    const onChangeCustomer = (e) => {
        setPickUpModal({ ...pickUpModal, [e.target.name]: e.target.value });
    }

    const onChange = (e) => {
        setPickUpModal({ ...pickUpModal, [e.target.name]: e.target.value });
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        '& .MuiTextField-root': { m: 1, width: '25ch' },
    };

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');



    return (
        <div className="customer-report-page">
            <section className="customer-report-hero">
                <div>
                    <p className="customer-report-eyebrow">Fulfillment report</p>
                    <h1>Pending Pick Up</h1>
                    <p className="customer-report-date">Customer orders waiting for pick up</p>
                </div>

                <Form className="customer-report-filter customer-report-filter-wide">
                    <Form.Group controlId="pendingPickupDateFrom">
                        <Form.Label>Date From:</Form.Label>
                        <Form.Control type="date" name="dateFrom" onChange={onChangeInput} />
                    </Form.Group>
                    <Form.Group controlId="pendingPickupDateTo">
                        <Form.Label>Date To:</Form.Label>
                        <Form.Control type="date" name="dateTo" onChange={onChangeInput} />
                    </Form.Group>
                    <Form.Select
                        className="customer-report-form-select"
                        name="status"
                        onChange={onChangeInput}
                    >
                        <option value="null">All</option>
                        <option value="2">Pending Payment</option>
                        <option value="1">Completed Payment</option>
                    </Form.Select>

                    <Button variant="primary" onClick={saveOrderTransaction} disabled={isDeliveryDisabled}>
                        Find
                    </Button>
                </Form >
            </section>

            <section className="customer-report-kpis customer-report-kpis-compact">
                <article className="customer-report-kpi">
                    <span>Total Count</span>
                    <strong>{shopOrderTransaction.data.length}</strong>
                </article>
                <article className="customer-report-kpi">
                    <span>Pick Up Status</span>
                    <strong>Waiting</strong>
                    <small>Orders that still need pick up confirmation</small>
                </article>
            </section>

            {submitDeliveryLoadingDisabled &&
                <div className="customer-report-progress">
                    <LinearProgress color="warning" />
                </div>
            }

            <section className="customer-report-table-card">
                <div className="customer-report-table-header">
                    <div>
                        <p className="customer-report-eyebrow">Details</p>
                        <h2>Pending Pick Up Transaction</h2>
                    </div>
                    <span>{shopOrderTransaction.data.length} records</span>
                </div>
            {submitLoading ?
                (<LinearProgress />)
                :
                (<>
                    <div className="customer-report-table-wrap">
                    <table className="customer-report-table customer-report-table-transaction">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Shop</th>
                                <th className="customer-report-optional-col">Customer Type</th>
                                <th>Customer</th>
                                <th>Qty</th>
                                <th className="customer-report-optional-col">Total Cash</th>
                                <th className="customer-report-optional-col">Total Online</th>
                                <th>Bank</th>
                                <th>Total</th>
                                {
                                    role == 2 && (
                                        <th className="customer-report-optional-col">Profit</th>
                                    )
                                }

                                <th>Date</th>
                                <th>Payment</th>
                                <th>Delivery</th>
                                <th>Rider</th>
                                <th>Pick Up</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                shopOrderTransaction.data.map((shopOrderTransaction, index) => (
                                    <tr key={shopOrderTransaction.id} >
                                        <td className="customer-report-id customer-report-id-cell">
                                            {shopOrderTransaction.vip_name &&
                                                <span
                                                    className="customer-report-vip-stripe"
                                                    style={{ backgroundColor: shopOrderTransaction.vip_color || '#6c757d' }}
                                                ></span>
                                            }
                                            <span className="customer-report-id-stack">
                                                <span className="customer-report-order-id">#{shopOrderTransaction.id}</span>
                                                {shopOrderTransaction.vip_name &&
                                                    <Tooltip title={"VIP Customer: " + shopOrderTransaction.vip_name}>
                                                        <span
                                                            className="customer-report-vip-badge"
                                                            style={{ backgroundColor: shopOrderTransaction.vip_color || '#6c757d' }}
                                                        >
                                                            {shopOrderTransaction.vip_name}
                                                        </span>
                                                    </Tooltip>
                                                }
                                            </span>
                                        </td>
                                        <td>{shopOrderTransaction.shop_name}</td>
                                        <td className="customer-report-optional-col">{shopOrderTransaction.customer_type}</td>
                                        <td>
                                            {shopOrderTransaction.requestor_name}
                                            {shopOrderTransaction.store_name
                                                ? " (" + shopOrderTransaction.store_name.toUpperCase() + ")"
                                                : ""}
                                        </td>
                                        <td>{shopOrderTransaction.shop_order_transaction_total_quantity}</td>
                                        <td className="customer-report-optional-col">{shopOrderTransaction.total_cash}</td>
                                        <td className="customer-report-optional-col">{shopOrderTransaction.total_online}</td>
                                        <td>
                                            <div className="customer-report-bank-list">
                                                {shopOrderTransaction.mode_of_payment.map((sot, index) => (
                                                    <span key={`${shopOrderTransaction.id}-${sot.payment_type}-${index}`}>
                                                        {numberFormat(sot.amount)} <small>{sot.payment_type}</small>
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 'bold', }}>{shopOrderTransaction.shop_order_transaction_total_price}</td>
                                        {
                                            role == 2 && (
                                                <td className="customer-report-optional-col" style={{ fontWeight: 'bold', }}>{shopOrderTransaction.profit != 0 ? numberFormat(shopOrderTransaction.profit) : ""}
                                                </td>
                                            )
                                        }

                                        <td>{shopOrderTransaction.date != shopOrderTransaction.created_at ? <p style={{ fontWeight: 'bold', color: 'orange', }}>{shopOrderTransaction.date}</p>
                                            : shopOrderTransaction.date}
                                            {shopOrderTransaction.status == 2 && shopOrderTransaction.is_pickup == 0 ?
                                                <IconButton>
                                                    <UpdateIcon color="primary" onClick={(e) => handleOpen(shopOrderTransaction.id, e)} />
                                                </IconButton> : ""
                                            }
                                        </td>
                                        <td>{shopOrderTransaction.status === 1 ? <p style={{ fontWeight: 'bold', color: 'green', }}>COMPLETED</p>
                                            : shopOrderTransaction.status === 2 ? <p style={{ fontWeight: 'bold', color: 'orange', }}>PENDING</p> :
                                                <p style={{ fontWeight: 'bold', color: 'red', }}>CANCELLED</p>}
                                        </td>
                                        <td>
                                            <p>{shopOrderTransaction.delivery_customer_id != 0 && shopOrderTransaction.delivery_status == 1 ? <p style={{ fontWeight: 'bold', color: 'green', }}>DELIVERED</p> :
                                                shopOrderTransaction.delivery_customer_id != 0 && shopOrderTransaction.delivery_status == 0 ? <>                                    <Tooltip title="Delete">
                                                    <p style={{ fontWeight: 'bold', color: 'orange', }}>PENDING DELIVERY</p>
                                                    <IconButton>
                                                        <DeleteIcon color="error" onClick={(e) => openDelete(shopOrderTransaction.id, e)} />
                                                    </IconButton>
                                                </Tooltip></> : ''}</p>
                                            <IconButton>
                                                <UpdateIcon color="primary" onClick={(e) => handleOpenDelivery(shopOrderTransaction.id, e)} />
                                            </IconButton>
                                        </td>
                                        <td>
                                            <p>{shopOrderTransaction.rider_name}</p>
                                            <IconButton>
                                                <UpdateIcon color="primary" onClick={(e) => handleOpenRider(shopOrderTransaction.id, e)} />
                                            </IconButton>
                                        </td>


                                        <td>
                                            <p>{shopOrderTransaction.is_pickup === 1 ? <p style={{ fontWeight: 'bold', color: 'green', }}>DONE</p> :
                                                <p style={{ fontWeight: 'bold', color: 'orange', }}>WAITING</p>}</p>
                                            <IconButton>
                                                <UpdateIcon color="primary" onClick={(e) => handleOpenPickUp(shopOrderTransaction.id, e)} />
                                            </IconButton>
                                        </td>
                                        <td>
                                            <div className="customer-report-actions">
                                                <Link to={"../shopOrderTransaction/addProductShopOrderTransaction/" + shopOrderTransaction.id}>
                                                    <Button className="customer-report-update-btn" size="sm" variant="success">
                                                        Update
                                                    </Button>
                                                </Link>
                                                <Link to={"../shopOrderTransaction/completedShopOrderTransaction/" + shopOrderTransaction.id + "+" + date}>
                                                    <Button size="sm" variant="outline-primary">
                                                        View
                                                    </Button>
                                                </Link>
                                                <Link to={"../shopOrderTransaction/receiptOrder/" + shopOrderTransaction.id}>
                                                    <Button size="sm" variant="outline-secondary">
                                                        Receipt
                                                    </Button>
                                                </Link>
                                                {shopOrderTransaction.status != 3 &&
                                                    <Tooltip title={shopOrderTransaction.shop_order_transaction_total_price != 0 ? "Need to Delete Product in Transaction" : ""}>
                                                        <span>
                                                            <Button
                                                                size="sm"
                                                                variant="outline-danger"
                                                                onClick={(e) => deleteShopOrderTransaction(shopOrderTransaction)}
                                                                disabled={shopOrderTransaction.shop_order_transaction_total_price != 0 ? true : false}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </span>
                                                    </Tooltip>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                )
                                )
                            }
                        </tbody>
                    </table>
                    </div>
                </>)}
            </section>
            <Dialog
                open={submitOpenModal}
                onClose={handleSubmitCloseModal}
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
                                    checked={pickUpModal.is_pickup !== 0}
                                    onChange={onChangePaymentTypeStatus}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                    disabled={disabledPickUp}
                                />
                            </span>
                        </Tooltip>
                    </Form.Group>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Preparer </InputLabel>
                        <Select name="preparer_id" onChange={onChange} value={pickUpModal.preparer_id}>
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
                        <Select name="checker_id" onChange={onChange} value={pickUpModal.checker_id}>
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
                        <Select name="dispatcher_id" onChange={onChange} value={pickUpModal.dispatcher_id}>
                            {requestorList.map((requestor) => (
                                <MenuItem key={requestor.id} value={requestor.id}>
                                    {requestor.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <br></br>
                    <br></br>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Customer Details
                    </Typography>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" value={pickUpModal.first_name} name="first_name" placeholder="Enter First Name" disabled />
                    </Form.Group>

                    {formErrorsPickUp.last_name && <p style={{ color: "red" }}>{formErrorsPickUp.last_name}</p>}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Last Name*</Form.Label>
                        <Form.Control type="text" value={pickUpModal.last_name} name="last_name" placeholder="Enter Last Name" onChange={onChangeCustomer} />
                    </Form.Group>
                    {formErrorsPickUp.contact_number && <p style={{ color: "red" }}>{formErrorsPickUp.contact_number}</p>}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Contact Number*</Form.Label>
                        <Form.Control type="text" value={pickUpModal.contact_number} name="contact_number" placeholder="Enter Contact Number" onChange={onChangeCustomer} />
                    </Form.Group>
                    {formErrorsPickUp.address && <p style={{ color: "red" }}>{formErrorsPickUp.address}</p>}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Address*</Form.Label>
                        <Form.Control type="text" value={pickUpModal.address} name="address" placeholder="Enter Address" onChange={onChangeCustomer} />
                    </Form.Group>
                    {formErrorsPickUp.store_name && <p style={{ color: "red" }}>{formErrorsPickUp.store_name}</p>}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Store Name*</Form.Label>
                        <Form.Control type="text" value={pickUpModal.store_name} name="store_name" placeholder="Enter Store Name" onChange={onChangeCustomer} />
                    </Form.Group>


                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Button variant="primary" onClick={updatePickUp}>
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
                    {formDeliveryErrors.date && <p style={{ color: "red" }}>{formDeliveryErrors.date}</p>}
                    <Form.Group className="w-45 mb-3" controlId="formBasicEmail">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" value={deliveryModal.date} name="date" onChange={onChangeDelivery} />
                    </Form.Group>

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
        </div >
    )
}

export default PendingPickUp
