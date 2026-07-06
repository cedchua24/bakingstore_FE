import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";
import DeliveryCustomerService from "../OtherService/DeliveryCustomerService";
import UserService from '../User/UserService.service'
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

import LinearProgress from '@mui/material/LinearProgress';

const ReportPendingDelivery = () => {


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

    const [transactionStatus, setTransactionStatus] = useState({
        status: 0,
        dateFrom: '',
        dateTo: ''
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
        ShopOrderTransactionService.fetchPendingDeliveryTransaction(transactionStatus)
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
        textAlign: "center",
    }));
    const onChangeInput = (e) => {
        setCustomerOrderDate({ ...customerOrderDate, [e.target.name]: e.target.value });
        setDate(e.target.value);
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

    const [open, setOpen] = React.useState(false);

    const handleOpen = (id, e) => {
        console.log('e', id);
        fetchTransaction(id);
        setOpen(true);
    }

    const handleClose = () => setOpen(false);

    const handleCloseRider = () => setOpen(false);

    const handleClosePickUp = () => setOpen(false);

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
        status: 0,
        address: ''
    });

    const [openDelivery, setOpenDelivery] = React.useState(false);
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
        width: 300,
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
                            <Form.Label> {payment.payment_type} {payment.payment_type_description}</Form.Label>
                            <Form.Control type="text" value={"₱ " + payment.total_amount} />
                            <Link variant="primary" to={"../shopOrderTransaction/paymentTypeSales/" + payment.id + "+" + date}   >
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
                {/* <Form>
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" name="date" onChange={onChangeInput} />
                    </Form.Group>

                    <Button variant="primary" onClick={saveOrderTransaction}>
                        Find
                    </Button>
                </Form > */}
            </div>


            <legend align="center" style={{ fontWeight: 'bold' }} > Pending Delivery List   </legend>
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
                        <th>Payment Status</th>
                        <th>For Trucking</th>
                        <th>Rider</th>
                        <th>Pick Up Status</th>
                        <th></th>
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
                                <td>{shopOrderTransaction.customer_type}</td>
                                <td>{shopOrderTransaction.requestor_name}</td>
                                <td>{shopOrderTransaction.shop_order_transaction_total_quantity}</td>
                                <td>{shopOrderTransaction.total_cash}</td>
                                <td>{shopOrderTransaction.total_online}</td>
                                <td style={{ fontWeight: 'bold', }}>{shopOrderTransaction.shop_order_transaction_total_price}</td>
                                <td style={{ fontWeight: 'bold', }}>{shopOrderTransaction.profit}</td>
                                <td>{shopOrderTransaction.date}
                                    <IconButton>
                                        <UpdateIcon color="primary" onClick={(e) => handleOpen(shopOrderTransaction.id, e)} />
                                    </IconButton>
                                </td>
                                <td>{shopOrderTransaction.status === 1 ? <p style={{ fontWeight: 'bold', color: 'green', }}>COMPLETED</p>
                                    : shopOrderTransaction.status === 2 ? <p style={{ fontWeight: 'bold', color: 'orange', }}>PENDING</p> :
                                        <p style={{ fontWeight: 'bold', color: 'red', }}>CANCELLED</p>}</td>
                                <td>
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

                                </td>
                                <td>
                                    <p>{shopOrderTransaction.is_pickup === 1 ? <p style={{ fontWeight: 'bold', color: 'green', }}>DONE</p> :
                                        <p style={{ fontWeight: 'bold', color: 'orange', }}>WAITING</p>}</p>
                                    <IconButton>
                                        <UpdateIcon color="primary" onClick={(e) => handleOpenPickUp(shopOrderTransaction.id, e)} />
                                    </IconButton>
                                </td>

                                <td>
                                    <Link variant="primary" to={"../shopOrderTransaction/completedShopOrderTransaction/" + shopOrderTransaction.id + "+" + date}   >
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
                        <Select name="checker_id" onChange={onChangeDate} value={shopOrderTransactionUpdateModal.checker_id} >
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

export default ReportPendingDelivery
