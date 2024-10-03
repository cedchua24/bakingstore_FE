import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import ExpensesService from "../Expenses/ExpensesService";
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
import PageviewIcon from '@mui/icons-material/Pageview';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import LinearProgress from '@mui/material/LinearProgress';

const CustomerOrderTransactionList = () => {


    useEffect(() => {
        fetchShopOrderTransactionList();
        fetchExpensesList();
    }, []);

    const [customerOrderDate, setCustomerOrderDate] = useState({
        date: ""
    });

    const [expenses, setExpenses] = useState({
        data: [],
        code: '',
        message: '',
    });

    const [expensesMandatory, setExpensesMandatory] = useState({
        data: [],
        code: '',
        message: '',
    });

    const [status, setStatus] = useState(0);

    const [date, setDate] = useState('');

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        data: [],
        payment: [],
        code: '',
        message: '',
        total_price: 0,
        total_count: 0,
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
        pick_up: 0,
        status: 0,
        date: '',
        created_at: '',
        updated_at: ''
    });


    const [shopOrderTransactionList, setShopOrderTransactionList] = useState([]);

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});



    const fetchShopOrderTransactionList = () => {
        let newDate = new Date().toLocaleDateString();
        let nDate = newDate.replaceAll("/", "-");
        console.log('nDate', nDate);
        // console.log('date', new Date().toLocaleDateString().replace("/", "-"));
        ShopOrderTransactionService.fetchOnlineShopOrderTransactionList()
            .then(response => {
                console.log("fetchOnlineShopOrderTransactionList :", response.data)
                // setShopOrderTransactionList(response.data);
                setShopOrderTransaction(response.data);
            })
            .catch(e => {
                console.log("error", e)

            });
    }

    const fetchExpensesList = () => {
        ExpensesService.fetchExpensesTransactionToday()
            .then(response => {
                setExpenses(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });

        ExpensesService.fetchExpensesMandatoryToday()
            .then(response => {
                setExpensesMandatory(response.data);
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
        console.log("status", e.target.value);
        setStatus(e.target.value);
    }

    const validate = (values) => {
        const errors = {};
        if (status == 0) {
            errors.date = "Status Type is Required!";
        }

        return errors;
    }

    const saveOrderTransaction = () => {
        console.log('status: ', status);
        console.log("count: ", Object.keys(validate(status)).length);
        console.log("validate: ", validate(status));
        setFormErrors(validate(status));
        if (Object.keys(validate(status)).length > 0) {
            console.log("Has Validation: ");

        } else {
            console.log("Ready for saving: ");
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            ShopOrderTransactionService.fetchOnlineShopOrderTransactionListByStatus(status)
                .then(response => {
                    console.log("data: ", response.data);
                    setShopOrderTransaction(response.data);
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

    const filterByPaid = (shopOrderTransaction2) => {
        return shopOrderTransaction2.filter(s => s.is_paid == 1);
    };


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
        <div style={{ marginLeft: -100 }}>

            {expenses.total_expenses != 0 &&
                <div style={{ float: 'right', marginRight: 100 }}>
                    <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label> Expenses</Form.Label>
                        <Link variant="primary" to={"../expenses"}   >
                            <PageviewIcon color="primary" />
                        </Link>
                        <Form.Control type="text" value={numberFormat(expenses.total_expenses)} />
                    </Form.Group>
                    <br></br>
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr class="table-secondary">
                                <th></th>
                                <th></th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr  >
                                <td>Total Profit: </td>
                                <td>{numberFormat(shopOrderTransaction.total_profit)}</td>
                            </tr>
                            <tr  >
                                <td>Total Mandatory Expenses: </td>
                                <td>{numberFormat(expensesMandatory.total_expenses)}</td>
                            </tr>
                            <tr  >
                                <td style={{ fontWeight: 'bold', }}>Net Profit: </td>
                                <td style={{ fontWeight: 'bold', }}>{numberFormat(shopOrderTransaction.total_profit - expensesMandatory.total_expenses)}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>

            }


            <div style={{ float: 'right', marginRight: 100 }}>

                {
                    shopOrderTransaction.payment.map((payment, index) => (
                        <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                            <Form.Label> {payment.payment_type} {payment.payment_type_description} </Form.Label>
                            <Link variant="primary" to={"../shopOrderTransaction/paymentTypeSales/" + payment.id + "+" + date}   >
                                <PageviewIcon color="primary" />
                            </Link>
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



            <div>
                <Form>
                    {formErrors.date && <p style={{ color: "red" }}>{formErrors.date}</p>}
                    {/* <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" name="date" onChange={onChangeInput} />
                    </Form.Group> */}
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                            <InputLabel id="demo-simple-select-label">Choose Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={status}
                                label="Status"
                                name="status"
                                onChange={onChangeInput}
                            >
                                <MenuItem disabled value="" style={{ fontWeight: 'bold' }}>
                                    <em>Payment Status</em>
                                </MenuItem>
                                <MenuItem value="1" style={{ fontWeight: 'bold', color: 'green', }}>COMPLETED</MenuItem>
                                <MenuItem value="2" style={{ color: 'orange', }}>PENDING</MenuItem>
                                <MenuItem value="3" style={{ color: 'red', }}>CANCELLED</MenuItem>
                                <MenuItem disabled value="" style={{ fontWeight: 'bold' }}>
                                    <em>Rider Status</em>
                                </MenuItem>
                                <MenuItem value="5" style={{ color: 'green', }}>DONE</MenuItem>
                                <MenuItem value="4" style={{ color: 'orange', }}>WAITING</MenuItem>

                            </Select>
                        </FormControl>
                    </Box>

                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label>Total Transaction: </Form.Label>
                        <Form.Control type="text" value={shopOrderTransaction.total_count} />
                    </Form.Group>
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label>Total Cash Payment: </Form.Label>
                        <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_cash)} />
                    </Form.Group>
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label>Total Online Payment: </Form.Label>
                        <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_online)} />
                    </Form.Group>
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label>Total Sales: </Form.Label>
                        <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_price)} />
                    </Form.Group>
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label>Total Profit: </Form.Label>
                        <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_profit)} />
                    </Form.Group>



                    <Button variant="primary"
                        onClick={saveOrderTransaction}
                        disabled={isAddDisabled}
                    >
                        Find
                    </Button>
                    <br></br>
                    <br></br>
                    {submitLoadingAdd &&
                        <LinearProgress color="warning" />
                    }
                    <br></br>
                </Form >
            </div>
            <Div>{"Online Orders"}
            </Div>




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
                        <th>Rider</th>
                        <th >Pick Up Status</th>
                        <th>Update Date</th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                {shopOrderTransaction.data.length == 0 ?
                    (<tr style={{ color: "red", }}>{"No Data Available"}</tr>)
                    :
                    (
                        <tbody>

                            {
                                shopOrderTransaction.data.map((shopOrderTransaction, index) => (
                                    <tr key={shopOrderTransaction.id} style={{ border: "2px solid black" }}>
                                        <td >{shopOrderTransaction.id}</td>
                                        <td>{shopOrderTransaction.shop_name}</td>
                                        <td>{shopOrderTransaction.customer_type}</td>
                                        <td>{shopOrderTransaction.requestor_name}</td>
                                        <td>{shopOrderTransaction.shop_order_transaction_total_quantity != 0 ? shopOrderTransaction.shop_order_transaction_total_quantity : ""}</td>
                                        <td>{shopOrderTransaction.total_cash != 0 ? numberFormat(shopOrderTransaction.total_cash) : ""}</td>
                                        <td>{shopOrderTransaction.total_online != 0 ? numberFormat(shopOrderTransaction.total_online) : ""}</td>
                                        <td>{shopOrderTransaction.status == 1 ? (

                                            shopOrderTransaction.mode_of_payment.map((sot, index) => (
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

                                        <td style={{ fontWeight: 'bold', }}>{shopOrderTransaction.shop_order_transaction_total_price != 0 ? numberFormat(shopOrderTransaction.shop_order_transaction_total_price) : ""}</td>
                                        <td style={{ fontWeight: 'bold', }}>{shopOrderTransaction.profit != 0 ? numberFormat(shopOrderTransaction.profit) : ""}</td>
                                        <td>{shopOrderTransaction.date}</td>
                                        <td>{shopOrderTransaction.status === 1 ? <p style={{ fontWeight: 'bold', color: 'green', }}>COMPLETED</p>
                                            : shopOrderTransaction.status === 2 ? <p style={{ fontWeight: 'bold', color: 'orange', }}>PENDING</p> :
                                                <p style={{ fontWeight: 'bold', color: 'red', }}>CANCELLED</p>}</td>
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
                                            <IconButton>
                                                <UpdateIcon color="primary" onClick={(e) => handleOpen(shopOrderTransaction.id, e)} />
                                            </IconButton>
                                        </td>
                                        <td>
                                            <Link variant="primary" to={"../shopOrderTransaction/completedShopOrderTransaction/" + shopOrderTransaction.id}   >
                                                <Button variant="primary" >
                                                    View
                                                </Button>
                                            </Link>
                                        </td>
                                        <td>
                                            {shopOrderTransaction.shop_order_transaction_total_quantity != 0 ? (
                                                <Link variant="primary" to={"../shopOrderTransaction/receiptOrder/" + shopOrderTransaction.id}   >
                                                    <Button variant="primary" >
                                                        Print Receipt
                                                    </Button>
                                                </Link>
                                            ) : ""
                                            }
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
                                                <Tooltip title={shopOrderTransaction.shop_order_transaction_total_price != 0 ? "Need to Delete Product in Transaction" : ""}>
                                                    <span>
                                                        <Button
                                                            variant="danger"
                                                            onClick={(e) => deleteShopOrderTransaction(shopOrderTransaction)}
                                                            disabled={shopOrderTransaction.shop_order_transaction_total_price != 0 ? true : false}
                                                            color="error"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </span>
                                                </Tooltip>
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
                        </tbody>)}
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
                        <Form.Label>is Pick-up ? </Form.Label>

                        <Checkbox
                            checked={shopOrderTransactionUpdateModal.is_pickup === 0 ? false : true}
                            onChange={onChangePaymentTypeStatus}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
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
        </div >
    )
}

export default CustomerOrderTransactionList
