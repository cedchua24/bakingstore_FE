import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import CustomerService from "../Customer/CustomerService";
import ExpensesService from "../Expenses/ExpensesService";
import ExpenseTransactionService from "../ExpensesV2/ExpenseTransactionService";
import ShopService from "../Shop/ShopService";
import DiscountService from "../OtherService/DiscountService";
import DeliveryCustomerService from "../OtherService/DeliveryCustomerService";
import SpoilageService from "../Spoilage/SpoilageService";
import { styled } from '@mui/material/styles';
import { Form } from 'react-bootstrap';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';

import DeleteIcon from '@mui/icons-material/Delete';
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
import moment from "moment";

import LinearProgress from '@mui/material/LinearProgress';

const CustomerOrderTransactionList = () => {

    const { id } = useParams();

    useEffect(() => {
        fetchOnlineShopOrderTransactionList();
        fetchExpensesList();
    }, []);

    const [customerOrderDate, setCustomerOrderDate] = useState({
        date: id,
        status: 0
    });

    const [searchExpense, setSearchExpense] = useState({
        dateFrom: id,
        dateTo: id,
        approval_status: 'APPROVED'
    });


    const [role, setRole] = useState(localStorage.getItem('role_as'));


    const [expenses, setExpenses] = useState({
        data: [],
        code: '',
        message: '',
    });

    const [spoilage, setSpoilage] = useState({
        data: [],
        code: '',
        message: '',
    });

    const [discount, setDiscount] = useState({
        data: [],
        total_amount: 0,
        code: '',
        message: '',
    });

    const [discountLoss, setDiscountLoss] = useState({
        data: [],
        code: '',
        total_amount: 0,
        message: '',
    });

    const [expensesMandatory, setExpensesMandatory] = useState({
        data: [],
        code: '',
        message: '',
    });

    const [expenseV2, setExpenseV2] = useState({});

    const [shop, setShop] = useState({
        id: 0,
        shop_type_id: 0,
        shop_name: ''
    });

    const [status, setStatus] = useState(0);

    const [date, setDate] = useState('');



    const [dateToday, setDateToday] = useState({
        today: moment().format("YYYY-MM-DD")
    });

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        data: [],
        payment: [],
        code: '',
        message: '',
        total_sales: 0,
        total_sales_completed: 0,
        total_paid_prev: 0,
        total_online_prev: 0,
        total_cash_prev: 0,
        total_paid_oudated: 0,
        total_online_outdated: 0,
        total_cash_outdated: 0,
        total_paid_: 0
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

    const [pickUpModal, setPickUpModal] = useState({
        id: 0,
        first_name: '',
        last_name: '',
        contact_number: '',
        email: '',
        address: '',
        store_name: '',
        date: '',
        customer_id: 0,
        is_pickup: 0,
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

    const [shopOrderTransactionList, setShopOrderTransactionList] = useState([]);

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [submitLoadingReport, setSubmitLoadingReport] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [formErrorsPickUp, setFormErrorsPickup] = useState({});
    const [formDeliveryErrors, setFormDeliveryErrors] = useState({});

    const [isDeliveryDisabled, setIsDeliveryDisabled] = useState(false);
    const [submitDeliveryLoadingDisabled, setSubmitDeliveryLoadingDisabled] = useState(false);




    const fetchOnlineShopOrderTransactionList = () => {

        let newDate = new Date().toLocaleDateString();
        let nDate = newDate.replaceAll("/", "-");
        console.log('nDate', nDate);
        console.log('role_as: ', localStorage.getItem('role_as'));
        console.log("customerOrderDate :", customerOrderDate)
        // console.log('date', new Date().toLocaleDateString().replace("/", "-"));
        ShopOrderTransactionService.fetchOnlineShopOrderTransactionList(customerOrderDate)
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
        ExpensesService.fetchExpensesTransactionToday(customerOrderDate.date)
            .then(response => {
                setExpenses(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });

        ExpensesService.fetchExpensesMandatoryToday(customerOrderDate.date)
            .then(response => {
                setExpensesMandatory(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });

        ExpenseTransactionService.getTotalExpense(searchExpense)
            .then(response => {
                setExpenseV2(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });



        ShopService.fetchShopCurrent()
            .then(response => {
                setShop(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });

        SpoilageService.fetchSpoilageToday(customerOrderDate.date)
            .then(response => {
                setSpoilage(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });

        DiscountService.fetchDiscountReport(dateToday)
            .then(response => {
                setDiscount(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });

        DiscountService.fetchDiscountLossReport(dateToday)
            .then(response => {
                setDiscountLoss(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });



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
                fetchOnlineShopOrderTransactionList();
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

        ShopOrderTransactionService.delete(shopOrderTransactionUpdate.id)
            .then(response => {
                setSubmitLoading(false);
                setSubmitOpenModal(false);
                fetchOnlineShopOrderTransactionList();
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
    // const onChangeInput = (e) => {
    //     console.log("status", e.target.value);
    //     setStatus(e.target.value);
    // }

    const onChangeInput = (e) => {
        setCustomerOrderDate({ ...customerOrderDate, [e.target.name]: e.target.value });
        setDateToday({ today: e.target.value })
    }

    const validate = (values) => {
        const errors = {};
        if (customerOrderDate.date.length == 0) {
            errors.date = "Status Type is Required!";
        }

        return errors;
    }

    const saveOrderTransaction = () => {
        console.log('status: ', customerOrderDate);
        console.log("count: ", Object.keys(validate(customerOrderDate)).length);
        console.log("validate: ", validate(customerOrderDate));
        setFormErrors(validate(customerOrderDate));
        if (Object.keys(validate(customerOrderDate)).length > 0) {
            console.log("Has Validation: ");

        } else {
            console.log("Ready for saving: ");
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            // ShopOrderTransactionService.fetchOnlineShopOrderTransactionListByStatus(customerOrderDate)
            ShopOrderTransactionService.fetchOnlineShopOrderTransactionList(customerOrderDate)
                .then(response => {
                    console.log("data: ", response.data);
                    setShopOrderTransaction(response.data);
                    fetchExpensesList();
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

    const sendReport = () => {
        console.log('Sending report: ', shopOrderTransaction);
        setSubmitLoadingReport(true);
        setIsAddDisabled(true);

        if (shop.shop_type_id == 4) {
            ShopService.sendReport(shopOrderTransaction)
                .then(response => {
                    console.log("data: ", response.data);
                    setSubmitLoadingReport(false);
                    setIsAddDisabled(false);
                })
                .catch(e => {
                    console.log("error", e)
                    setSubmitLoadingReport(false);
                    setIsAddDisabled(false);
                });
        } else if (shop.shop_type_id == 3) {
            ShopService.sendReport(shopOrderTransaction)
                .then(response => {
                    console.log("data: ", response.data);
                    setSubmitLoadingReport(false);
                    setIsAddDisabled(false);
                })
                .catch(e => {
                    console.log("error", e)
                    setSubmitLoadingReport(false);
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




    const [openRider, setOpenRider] = React.useState(false);

    const handleClosePickUp = () => setOpenPickUp(false);
    const [openPickUp, setOpenPickUp] = React.useState(false);

    const [openDelivery, setOpenDelivery] = React.useState(false);
    const hanldeCloseDelivery = () => setOpenDelivery(false);

    const handleOpenDelivery = (id, e) => {
        console.log('e', id);
        fetchDelivery(id);
        setOpenDelivery(true);
    }

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

    const fetchTransaction = async (id) => {
        await ShopOrderTransactionService.get(id)
            .then(response => {
                setShopOrderTransactionUpdateModal(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
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
                    fetchOnlineShopOrderTransactionList();
                    setOpen(false);
                    setOpenRider(false);
                    setOpenPickUp(false);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }

    const updateDate = () => {
        ShopOrderTransactionService.update(shopOrderTransactionUpdateModal.id, shopOrderTransactionUpdateModal)
            .then(response => {
                fetchOnlineShopOrderTransactionList();
                setOpen(false);
                setOpenRider(false);
                setOpenPickUp(false);
            })
            .catch(e => {
                console.log(e);
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
                    fetchOnlineShopOrderTransactionList();
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
        <div style={{ marginLeft: -250 }}>


            <div style={{ float: 'right' }}>
                <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                    <Form.Label> Expenses</Form.Label>
                    <Link variant="primary" to={"../reports/reportExpensesView/" + customerOrderDate.date}   >
                        <PageviewIcon color="primary" />
                    </Link>
                    <Form.Control type="text" value={numberFormat(expenses.total_expenses)} />
                </Form.Group>
                {expenseV2.total_expense != 0 && expenseV2.total_expense != null &&
                    <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label> Expenses V2</Form.Label>
                        <Link variant="primary" to={"../expensesV2/viewExpenseTransactionDate/" + customerOrderDate.date}   >
                            <PageviewIcon color="primary" />
                        </Link>
                        <Form.Control type="text" value={numberFormat(expenseV2.total_expense)} />
                    </Form.Group>
                }
                <br></br>
                <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                    <Form.Label> Spoilage</Form.Label>
                    <Link variant="primary" to={"../reports/viewSpoilageReport/" + customerOrderDate.date}   >
                        <PageviewIcon color="primary" />
                    </Link>
                    <Form.Control type="text" value={numberFormat(spoilage.total_cost)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                    <Form.Label> Discount</Form.Label>
                    <Link variant="primary" to={"../shopOrderTransaction/viewDiscount/" + customerOrderDate.date}   >
                        <PageviewIcon color="primary" />
                    </Link>
                    <Form.Control type="text" value={numberFormat(discount.total_amount)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                    <Form.Label> Discount Loss</Form.Label>
                    <Link variant="primary" to={"../shopOrderTransaction/viewDiscountLoss/" + customerOrderDate.date}   >
                        <PageviewIcon color="primary" />
                    </Link>
                    <Form.Control type="text" value={numberFormat(discountLoss.total_amount)} />
                </Form.Group>
                <br></br>
                <legend align="center" style={{ fontWeight: 'bold' }} >  Report   </legend>
                <table class="table table-bordered">
                    <thead class="table-dark">
                        <tr class="table-secondary">
                            <th></th>
                            <th></th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            role == 2 && (
                                <tr  >
                                    <td>Total Profit: </td>
                                    <td>{numberFormat(shopOrderTransaction.total_profit)}</td>
                                </tr>
                            )
                        }

                        <tr  >
                            <td>Total Discount Loss: </td>
                            <td>{numberFormat(discountLoss.total_amount)}</td>
                        </tr>
                        <tr  >
                            <td>Total Expenses: </td>
                            <td>{numberFormat(expensesMandatory.total_expense)}</td>
                        </tr>
                        {expenseV2.total_expense != 0 && expenseV2.total_expense != null &&
                            <tr  >
                                <td>Total Expenses: </td>
                                <td>{numberFormat(expenseV2.total_expense)}</td>
                            </tr>
                        }
                        <tr  >
                            <td>Total Spoilage: </td>
                            <td>{numberFormat(spoilage.total_cost)}</td>
                        </tr>
                        {
                            role == 2 && (
                                <tr  >
                                    <td style={{ fontWeight: 'bold', }}>Net Profit: </td>
                                    <td style={{ fontWeight: 'bold', }}>{numberFormat(discountLoss.total_amount + shopOrderTransaction.total_profit - expensesMandatory.total_expenses + spoilage.total_cost)}</td>
                                </tr>
                            )
                        }

                        <br></br>
                        <Button
                            variant="success"
                            onClick={sendReport}
                            disabled={isAddDisabled}
                        >
                            Send Report
                        </Button>
                        <br></br>
                        <br></br>
                        {submitLoadingReport &&
                            <Box sx={{ width: '100%' }}>
                                <LinearProgress />
                            </Box>
                        }
                    </tbody>
                </table>
            </div>


            <div style={{ float: 'right', marginRight: 30 }}>

                {
                    shopOrderTransaction.payment.map((payment, index) => (
                        <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                            <Form.Label> {payment.payment_type} {payment.payment_type_description} </Form.Label>
                            <Link variant="primary" to={"../shopOrderTransaction/paymentTypeSales/" + payment.id + "+" + customerOrderDate.date}   >
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


            <div style={{ float: 'right', marginRight: 100 }}>

                {
                    <>
                        {shopOrderTransaction.total_paid != 0 &&
                            <>
                                <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                                    <Form.Label style={{ fontWeight: 'bold', }} >Current Transaction </Form.Label>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                                    <Form.Label>Total Paid: </Form.Label>
                                    <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_paid)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                                    <Form.Label>Cash: </Form.Label>

                                    <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_cash)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                                    <Form.Label>Online: </Form.Label>
                                    <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_online)} />
                                </Form.Group>
                            </>
                        }
                        {shopOrderTransaction.total_paid_prev != 0 &&
                            <>
                                <br></br>
                                <br></br>
                                <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                                    <Form.Label style={{ fontWeight: 'bold', }}>Previous Transaction Paid Today </Form.Label>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                                    <Form.Label>Total Paid : </Form.Label>
                                    <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_paid_prev)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                                    <Form.Label>Cash: </Form.Label>
                                    <Link
                                        variant="primary"
                                        to={`../shopOrderTransaction/paymentTypePrev/1/${customerOrderDate.date}/1`}
                                    >
                                        <PageviewIcon color="primary" />
                                    </Link>
                                    <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_cash_prev)} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                                    <Form.Label>Online: </Form.Label>
                                    <Link
                                        variant="primary"
                                        to={`../shopOrderTransaction/paymentTypePrev/2/${customerOrderDate.date}/1`}
                                    >
                                        <PageviewIcon color="primary" />
                                    </Link>
                                    <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_online_prev)} />

                                </Form.Group>

                            </>
                        }

                        {shopOrderTransaction.total_paid_outdated != 0 &&
                            <>
                                <br></br>
                                <br></br>
                                <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                                    <Form.Label style={{ fontWeight: 'bold', }}>Post Transaction Paid</Form.Label>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                                    <Form.Label>Total Paid : </Form.Label>
                                    <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_paid_outdated)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                                    <Form.Label>Cash: </Form.Label>
                                    <Link
                                        variant="primary"
                                        to={`../shopOrderTransaction/paymentTypePrev/1/${customerOrderDate.date}/2`}
                                    >
                                        <PageviewIcon color="primary" />
                                    </Link>
                                    <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_cash_outdated)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                                    <Form.Label>Online: </Form.Label>
                                    <Link
                                        variant="primary"
                                        to={`../shopOrderTransaction/paymentTypePrev/2/${customerOrderDate.date}/2`}
                                    >
                                        <PageviewIcon color="primary" />
                                    </Link>
                                    <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_online_outdated)} />
                                </Form.Group>
                            </>
                        }
                    </>

                }

            </div>

            <div>
                <Form>

                    {/* <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" name="date" onChange={onChangeInput} />
                    </Form.Group> */}
                    {formErrors.date && <p style={{ color: "red" }}>{formErrors.date}</p>}
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" name="date" value={customerOrderDate.date} onChange={onChangeInput} />
                    </Form.Group>

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
                                disabled
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
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label style={{ fontWeight: 'bold', }}>Transaction Today</Form.Label>
                    </Form.Group>
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label>Transaction Count: </Form.Label>
                        <Form.Control type="text" value={shopOrderTransaction.total_count} />
                    </Form.Group>
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label>Total Transaction Completed: </Form.Label>
                        <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_sales_completed)} />
                    </Form.Group>
                    {
                        role == 2 && (
                            <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                                <Form.Label>Total Profit: </Form.Label>
                                <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_profit)} />
                            </Form.Group>
                        )
                    }

                    <br></br>
                    <br></br>
                    {shopOrderTransaction.total_paid != 0 &&
                        <>
                            <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                                <Form.Label style={{ fontWeight: 'bold', }}>Sales Today</Form.Label>
                            </Form.Group>
                            <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                                <Form.Label>Total Paid : </Form.Label>
                                <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_paid + shopOrderTransaction.total_paid_prev)} />
                            </Form.Group>
                            <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                                <Form.Label>Cash: </Form.Label>
                                <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_cash + shopOrderTransaction.total_cash_prev)} />
                            </Form.Group>
                            <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                                <Form.Label>Online: </Form.Label>
                                <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_online + shopOrderTransaction.total_online_prev)} />
                            </Form.Group>
                        </>
                    }



                </Form >
            </div>


            <legend align="center" style={{ fontWeight: 'bold' }} > Online Orders  </legend>


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
                        {
                            role == 2 && (
                                <th>Profit</th>
                            )
                        }
                        <th>Date</th>
                        <th>Payment Status</th>
                        <th>For Trucking</th>
                        <th>Rider</th>
                        <th >Pick Up Status</th>
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
                                        <td>{shopOrderTransaction.requestor_name} {shopOrderTransaction.store_name ? " (" + shopOrderTransaction.store_name.toUpperCase() + ")" : ""}</td>
                                        <td>{shopOrderTransaction.shop_order_transaction_total_quantity != 0 ? shopOrderTransaction.shop_order_transaction_total_quantity : ""}</td>
                                        <td>{shopOrderTransaction.total_cash != 0 ? numberFormat(shopOrderTransaction.total_cash) : ""}</td>
                                        <td>{shopOrderTransaction.total_online != 0 ? numberFormat(shopOrderTransaction.total_online) : ""}</td>
                                        <td>{
                                            shopOrderTransaction.mode_of_payment.map((sot, index) => (
                                                <>
                                                    <tr>
                                                        <td><p style={{ fontSize: 12 }}>{numberFormat(sot.amount)}</p></td>
                                                        <td><p style={{ fontSize: 12 }}>{sot.payment_type}</p></td>
                                                    </tr>
                                                </>
                                            )
                                            )
                                        }</td>

                                        <td style={{ fontWeight: 'bold', }}>{shopOrderTransaction.shop_order_transaction_total_price != 0 ? numberFormat(shopOrderTransaction.shop_order_transaction_total_price) : ""}</td>
                                        {
                                            role == 2 && (
                                                <td style={{ fontWeight: 'bold', }}>{shopOrderTransaction.profit != 0 ? numberFormat(shopOrderTransaction.profit) : ""}
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

                                                    <Button
                                                        variant="danger"
                                                        onClick={(e) => deleteShopOrderTransaction(shopOrderTransaction)}
                                                        disabled={shopOrderTransaction.shop_order_transaction_total_price != 0 ? true : false}
                                                        color="error"
                                                    >
                                                        Delete
                                                    </Button>
                                                </Tooltip>
                                            }
                                        </td>
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
                            checked={pickUpModal.is_pickup === 0 ? false : true}
                            onChange={onChangePaymentTypeStatus}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </Form.Group>
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

export default CustomerOrderTransactionList
