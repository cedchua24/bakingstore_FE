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
import UserService from '../User/UserService.service'
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
import { getPrimaryTransactionVipCustomer, getTransactionVipCustomers, getTransactionVipCustomerNames } from "./shopOrderTransactionVipHelpers";

import LinearProgress from '@mui/material/LinearProgress';
import useActiveShopColor from "../Shop/useActiveShopColor";
import "./CustomerOrderTransactionList.css";

const CustomerOrderTransactionList = () => {

    const { id } = useParams();
    const activeShopColor = useActiveShopColor();

    useEffect(() => {
        fetchOnlineShopOrderTransactionList();
        fetchExpensesList();
        fetchRequestor();
    }, []);

    const [requestorList, setRequestorList] = useState([]);

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

    const fetchRequestor = () => {
        UserService.getAll()
            .then(response => {
                setRequestorList(response.data);
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

    const disabledPickUp =
        !pickUpModal?.checker_id ||
        !pickUpModal?.dispatcher_id ||
        !pickUpModal?.preparer_id;

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

    const onChange = (e) => {
        setPickUpModal({ ...pickUpModal, [e.target.name]: e.target.value });
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

    const money = (value) => numberFormat(value || 0);

    const totalPaidToday = (shopOrderTransaction.total_paid || 0) + (shopOrderTransaction.total_paid_prev || 0);
    const totalCashToday = (shopOrderTransaction.total_cash || 0) + (shopOrderTransaction.total_cash_prev || 0);
    const totalOnlineToday = (shopOrderTransaction.total_online || 0) + (shopOrderTransaction.total_online_prev || 0);
    const totalReportExpenses = expensesMandatory.total_expense || expensesMandatory.total_expenses || 0;
    const netProfit = (discountLoss.total_amount || 0) + (shopOrderTransaction.total_profit || 0) - totalReportExpenses + (spoilage.total_cost || 0);

    const paymentStatusClass = (status) => {
        if (status === 1) return "status-pill status-success";
        if (status === 2) return "status-pill status-warning";
        return "status-pill status-danger";
    };

    const paymentStatusLabel = (status) => {
        if (status === 1) return "Completed";
        if (status === 2) return "Pending";
        return "Cancelled";
    };

    const pickupStatusClass = (isPickup) => isPickup === 1 ? "status-pill status-success" : "status-pill status-warning";

    const getCustomerKey = (transaction) => transaction.customer_id ||
        transaction.requestor_id ||
        `${transaction.requestor_name || ""}-${transaction.store_name || ""}`.toLowerCase();

    const isNewCustomer = (transaction) => (
        transaction.customer_created_date &&
        moment(transaction.customer_created_date).isValid() &&
        moment(transaction.customer_created_date).format("YYYY-MM-DD") === customerOrderDate.date
    );

    const newCustomers = Array.from(
        shopOrderTransaction.data
            .filter(isNewCustomer)
            .reduce((customers, transaction) => {
                const customerKey = getCustomerKey(transaction);
                const existingCustomer = customers.get(customerKey);

                if (existingCustomer) {
                    existingCustomer.totalSales += Number(transaction.shop_order_transaction_total_price) || 0;
                } else {
                    customers.set(customerKey, {
                        ...transaction,
                        totalSales: Number(transaction.shop_order_transaction_total_price) || 0
                    });
                }

                return customers;
            }, new Map())
            .values()
    );

    const newCustomerTotalSales = newCustomers.reduce(
        (total, customer) => total + customer.totalSales,
        0
    );

    const topSalesCustomers = Array.from(
        shopOrderTransaction.data
            .filter((transaction) => (
                Number(transaction.status) === 1 &&
                moment(transaction.date).isValid() &&
                moment(transaction.date).format("YYYY-MM-DD") === customerOrderDate.date
            ))
            .reduce((customers, transaction) => {
                const customerKey = getCustomerKey(transaction);
                const existingCustomer = customers.get(customerKey);

                if (existingCustomer) {
                    existingCustomer.totalSales += Number(transaction.shop_order_transaction_total_price) || 0;
                } else {
                    customers.set(customerKey, {
                        ...transaction,
                        totalSales: Number(transaction.shop_order_transaction_total_price) || 0
                    });
                }

                return customers;
            }, new Map())
            .values()
    )
        .sort((customerA, customerB) => customerB.totalSales - customerA.totalSales)
        .slice(0, 5);


    return (
        <div className="customer-report-page" style={{ "--shop-color": activeShopColor }}>
            <section className="customer-report-hero">
                <div>
                    <p className="customer-report-eyebrow">Daily customer order report</p>
                    <h1>Online Orders</h1>
                    <p className="customer-report-date">{moment(customerOrderDate.date).format("MMMM D, YYYY")}</p>
                </div>

                <Form className="customer-report-filter">
                    {formErrors.date && <p className="customer-report-error">{formErrors.date}</p>}
                    <Form.Group controlId="customerOrderReportDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" name="date" value={customerOrderDate.date} onChange={onChangeInput} />
                    </Form.Group>
                    <FormControl className="customer-report-status-select" size="small">
                        <InputLabel id="customer-order-status-label">Status</InputLabel>
                        <Select
                            labelId="customer-order-status-label"
                            id="customer-order-status"
                            value={status}
                            label="Status"
                            name="status"
                            onChange={onChangeInput}
                            disabled
                        >
                            <MenuItem value={0}>All Status</MenuItem>
                            <MenuItem disabled value=""><em>Payment Status</em></MenuItem>
                            <MenuItem value="1">COMPLETED</MenuItem>
                            <MenuItem value="2">PENDING</MenuItem>
                            <MenuItem value="3">CANCELLED</MenuItem>
                            <MenuItem disabled value=""><em>Rider Status</em></MenuItem>
                            <MenuItem value="5">DONE</MenuItem>
                            <MenuItem value="4">WAITING</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="light" onClick={saveOrderTransaction} disabled={isAddDisabled}>
                        Find
                    </Button>
                </Form>
            </section>

            {submitLoadingAdd &&
                <div className="customer-report-progress">
                    <LinearProgress color="warning" />
                </div>
            }

            <section className="customer-report-kpis">
                <article className="customer-report-kpi">
                    <span>Transactions</span>
                    <strong>{shopOrderTransaction.total_count || 0}</strong>
                </article>
                <article className="customer-report-kpi">
                    <span>Completed Sales</span>
                    <strong>{money(shopOrderTransaction.total_sales_completed)}</strong>
                </article>
                <article className="customer-report-kpi">
                    <span>Paid Today</span>
                    <strong>{money(totalPaidToday)}</strong>
                    <small>{money(totalCashToday)} cash / {money(totalOnlineToday)} online</small>
                </article>
                <article className="customer-report-kpi customer-report-photo-card">
                    <img src="/mapi_blossom.jpg" alt="Mapi Blossom" />
                </article>
                {role == 2 && (
                    <article className="customer-report-kpi customer-report-kpi-profit">
                        <span>Total Profit</span>
                        <strong>{money(shopOrderTransaction.total_profit)}</strong>
                    </article>
                )}
            </section>

            <section className="customer-report-summary-grid">
                <article className="customer-report-panel">
                    <div className="customer-report-panel-header">
                        <div>
                            <p className="customer-report-eyebrow">Collection</p>
                            <h2>Payment Breakdown</h2>
                        </div>
                    </div>

                    <div className="customer-report-payment-list">
                        {shopOrderTransaction.payment.length == 0 ? (
                            <p className="customer-report-muted">No payment data available.</p>
                        ) : shopOrderTransaction.payment.map((payment) => (
                            <div className="customer-report-payment-row" key={payment.id}>
                                <div>
                                    <strong>{payment.payment_type}</strong>
                                    <span>{payment.payment_type_description}</span>
                                </div>
                                <div className="customer-report-payment-actions">
                                    <Link to={"../shopOrderTransaction/paymentTypeSales/" + payment.id + "+" + customerOrderDate.date}>
                                        <PageviewIcon color="primary" />
                                    </Link>
                                    {payment.total_paid_count != payment.total_count ?
                                        <Tooltip title={"Need to Double Check all transaction in " + payment.payment_type}>
                                            <span><CloseIcon className="customer-report-icon-danger" /></span>
                                        </Tooltip> : <CheckIcon className="customer-report-icon-success" />}
                                    <strong>{money(payment.total_amount)}</strong>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="customer-report-mini-grid">
                        <div>
                            <span>Current Paid</span>
                            <strong>{money(shopOrderTransaction.total_paid)}</strong>
                        </div>
                        <div>
                            <span>Previous Paid</span>
                            <strong>{money(shopOrderTransaction.total_paid_prev)}</strong>
                            <Link to={`../shopOrderTransaction/paymentTypePrev/1/${customerOrderDate.date}/1`}>Cash</Link>
                            <Link to={`../shopOrderTransaction/paymentTypePrev/2/${customerOrderDate.date}/1`}>Online</Link>
                        </div>
                        <div>
                            <span>Post Paid</span>
                            <strong>{money(shopOrderTransaction.total_paid_outdated)}</strong>
                            <Link to={`../shopOrderTransaction/paymentTypePrev/1/${customerOrderDate.date}/2`}>Cash</Link>
                            <Link to={`../shopOrderTransaction/paymentTypePrev/2/${customerOrderDate.date}/2`}>Online</Link>
                        </div>
                    </div>
                </article>

                <article className="customer-report-panel">
                    <div className="customer-report-panel-header">
                        <div>
                            <p className="customer-report-eyebrow">Report</p>
                            <h2>Costs and Adjustments</h2>
                        </div>
                        <Button variant="success" onClick={sendReport} disabled={isAddDisabled}>
                            Send Report
                        </Button>
                    </div>

                    {submitLoadingReport &&
                        <div className="customer-report-progress">
                            <LinearProgress />
                        </div>
                    }

                    <div className="customer-report-stat-list">
                        {role == 2 && <div><span>Total Profit</span><strong>{money(shopOrderTransaction.total_profit)}</strong></div>}
                        <div>
                            <span>Expenses</span>
                            <strong>{money(expenses.total_expenses)}</strong>
                            <Link to={"../reports/reportExpensesView/" + customerOrderDate.date}><PageviewIcon color="primary" /></Link>
                        </div>
                        {expenseV2.total_expense != 0 && expenseV2.total_expense != null &&
                            <div>
                                <span>Expenses V2</span>
                                <strong>{money(expenseV2.total_expense)}</strong>
                                <Link to={"../expensesV2/viewExpenseTransactionDate/" + customerOrderDate.date}><PageviewIcon color="primary" /></Link>
                            </div>
                        }
                        <div>
                            <span>Discount Loss</span>
                            <strong>{money(discountLoss.total_amount)}</strong>
                            <Link to={"../shopOrderTransaction/viewDiscountLoss/" + customerOrderDate.date}><PageviewIcon color="primary" /></Link>
                        </div>
                        <div>
                            <span>Discount</span>
                            <strong>{money(discount.total_amount)}</strong>
                            <Link to={"../shopOrderTransaction/viewDiscount/" + customerOrderDate.date}><PageviewIcon color="primary" /></Link>
                        </div>
                        <div>
                            <span>Spoilage</span>
                            <strong>{money(spoilage.total_cost)}</strong>
                            <Link to={"../reports/viewSpoilageReport/" + customerOrderDate.date}><PageviewIcon color="primary" /></Link>
                        </div>
                        {role == 2 && <div className="customer-report-net"><span>Net Profit</span><strong>{money(netProfit)}</strong></div>}
                    </div>
                </article>
            </section>

            <div className="customer-report-customer-grid">
                <section className="customer-report-table-card customer-report-new-customers">
                <div className="customer-report-table-header">
                    <div>
                        <p className="customer-report-eyebrow">Customer growth</p>
                        <h2>New Customers</h2>
                    </div>
                    <span>{newCustomers.length} records · {money(newCustomerTotalSales)} total</span>
                </div>

                <div className="customer-report-table-wrap customer-report-new-customers-wrap">
                    <table className="customer-report-table customer-report-table-simple customer-report-table-compact">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Customer Type</th>
                                <th>Customer Created</th>
                                <th>Total Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newCustomers.length === 0 ? (
                                <tr>
                                    <td className="customer-report-empty" colSpan="4">
                                        No new customers for this date
                                    </td>
                                </tr>
                            ) : newCustomers.map((customer) => (
                                <tr key={customer.customer_id || customer.requestor_id || `${customer.requestor_name}-${customer.store_name}`}>
                                    <td>
                                        <strong>{customer.requestor_name || "-"}</strong>
                                        {customer.store_name && <span>{customer.store_name}</span>}
                                    </td>
                                    <td>{customer.customer_type || "-"}</td>
                                    <td>{moment(customer.customer_created_date).format("MMMM D, YYYY")}</td>
                                    <td className="customer-report-amount">{money(customer.totalSales)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                </section>

                <section className="customer-report-table-card customer-report-top-customers">
                    <div className="customer-report-table-header">
                        <div>
                            <p className="customer-report-eyebrow">Daily leaders</p>
                            <h2>Top Sales Customers</h2>
                        </div>
                        <span>Top 5</span>
                    </div>

                    <div className="customer-report-table-wrap">
                        <table className="customer-report-table customer-report-table-simple customer-report-table-compact">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Customer</th>
                                    <th>Total Sales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topSalesCustomers.length === 0 ? (
                                    <tr>
                                        <td className="customer-report-empty" colSpan="3">
                                            No completed sales for this date
                                        </td>
                                    </tr>
                                ) : topSalesCustomers.map((customer, index) => (
                                    <tr key={getCustomerKey(customer)}>
                                        <td className="customer-report-rank">#{index + 1}</td>
                                        <td>
                                            <strong>{customer.requestor_name || "-"}</strong>
                                            {customer.store_name && <span>{customer.store_name}</span>}
                                        </td>
                                        <td className="customer-report-amount">{money(customer.totalSales)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            <section className="customer-report-table-card">
                <div className="customer-report-table-header">
                    <div>
                        <p className="customer-report-eyebrow">Details</p>
                        <h2>Online Orders</h2>
                    </div>
                    <span>{shopOrderTransaction.data.length} records</span>
                </div>

                <div className="customer-report-table-wrap">
                    <table className="customer-report-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Shop</th>
                                <th>Customer</th>
                                <th>Qty</th>
                                <th>Cash</th>
                                <th>Online</th>
                                <th>Bank</th>
                                <th>Total</th>
                                {role == 2 && <th>Profit</th>}
                                <th>Date</th>
                                <th>Payment</th>
                                <th>Delivery</th>
                                <th>Pick Up</th>
                                <th>Rider</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shopOrderTransaction.data.length == 0 ? (
                                <tr>
                                    <td className="customer-report-empty" colSpan={role == 2 ? 15 : 14}>No Data Available</td>
                                </tr>
                            ) : shopOrderTransaction.data.map((transaction) => {
                                const primaryVipCustomer = getPrimaryTransactionVipCustomer(transaction);
                                const vipCustomers = getTransactionVipCustomers(transaction);
                                const transactionIsNewCustomer = isNewCustomer(transaction);

                                return (
                                <tr
                                    key={transaction.id}
                                    className={transactionIsNewCustomer ? "customer-report-new-customer-row" : ""}
                                >
                                    <td className="customer-report-id customer-report-id-cell">
                                        {primaryVipCustomer &&
                                            <span
                                                className="customer-report-vip-stripe"
                                                style={{ backgroundColor: primaryVipCustomer.vip_color || '#6c757d' }}
                                            ></span>
                                        }
                                        <span className="customer-report-id-stack">
                                            <span className="customer-report-order-id">#{transaction.id}</span>
                                            {vipCustomers.length > 0 &&
                                                <span className="customer-report-vip-badge-list">
                                                    {vipCustomers.map((vipCustomer, index) => (
                                                        <Tooltip
                                                            key={vipCustomer.vip_customer_transaction_id || vipCustomer.vip_customer_id || `${transaction.id}-${index}`}
                                                            title={"VIP Customer: " + getTransactionVipCustomerNames(transaction)}
                                                        >
                                                            <span
                                                                className="customer-report-vip-badge"
                                                                style={{ backgroundColor: vipCustomer.vip_color || '#6c757d' }}
                                                            >
                                                                {vipCustomer.vip_name}
                                                            </span>
                                                        </Tooltip>
                                                    ))}
                                                </span>
                                            }
                                        </span>
                                    </td>
                                    <td>
                                        <strong>{transaction.shop_name}</strong>
                                        <span>{transaction.customer_type}</span>
                                    </td>
                                    <td>
                                        <strong>{transaction.requestor_name}</strong>
                                        {transaction.store_name && <span>{transaction.store_name.toUpperCase()}</span>}
                                        {transactionIsNewCustomer &&
                                            <Tooltip title={`Customer created ${moment(transaction.customer_created_date).format("MMMM D, YYYY")}`}>
                                                <span className="customer-report-new-customer-badge">New Customer</span>
                                            </Tooltip>
                                        }
                                    </td>
                                    <td>{transaction.shop_order_transaction_total_quantity != 0 ? transaction.shop_order_transaction_total_quantity : "-"}</td>
                                    <td>{transaction.total_cash != 0 ? money(transaction.total_cash) : "-"}</td>
                                    <td>{transaction.total_online != 0 ? money(transaction.total_online) : "-"}</td>
                                    <td>
                                        <div className="customer-report-bank-list">
                                            {transaction.mode_of_payment.map((sot, index) => (
                                                <span key={`${transaction.id}-${sot.payment_type}-${index}`}>
                                                    {money(sot.amount)} <small>{sot.payment_type}</small>
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="customer-report-amount">{transaction.shop_order_transaction_total_price != 0 ? money(transaction.shop_order_transaction_total_price) : "-"}</td>
                                    {role == 2 && <td className="customer-report-amount">{transaction.profit != 0 ? money(transaction.profit) : "-"}</td>}
                                    <td>
                                        <div className="customer-report-date-cell">
                                            <span className={transaction.date != transaction.created_at ? "customer-report-date-changed" : ""}>{transaction.date}</span>
                                            {transaction.status == 2 && transaction.is_pickup == 0 &&
                                                <IconButton size="small">
                                                    <UpdateIcon color="primary" onClick={(e) => handleOpen(transaction.id, e)} />
                                                </IconButton>
                                            }
                                        </div>
                                    </td>
                                    <td><span className={paymentStatusClass(transaction.status)}>{paymentStatusLabel(transaction.status)}</span></td>
                                    <td>
                                        <div className="customer-report-status-action">
                                            {transaction.delivery_customer_id != 0 && transaction.delivery_status == 1 &&
                                                <span className="status-pill status-success">Delivered</span>
                                            }
                                            {transaction.delivery_customer_id != 0 && transaction.delivery_status == 0 &&
                                                <Tooltip title="Delete">
                                                    <span className="customer-report-delivery-pending">
                                                        <span className="status-pill status-warning">Pending Delivery</span>
                                                        <IconButton size="small">
                                                            <DeleteIcon color="error" onClick={(e) => openDelete(transaction.id, e)} />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            }
                                            {transaction.delivery_customer_id == 0 && <span className="customer-report-muted">None</span>}
                                            <IconButton size="small">
                                                <UpdateIcon color="primary" onClick={(e) => handleOpenDelivery(transaction.id, e)} />
                                            </IconButton>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="customer-report-status-action customer-report-pickup-action">
                                            <span className={pickupStatusClass(transaction.is_pickup)}>{transaction.is_pickup === 1 ? "Done" : "Waiting"}</span>
                                            <IconButton size="small">
                                                <UpdateIcon color="primary" onClick={(e) => handleOpenPickUp(transaction.id, e)} />
                                            </IconButton>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="customer-report-status-action customer-report-rider-action">
                                            <span>{transaction.rider_name || "-"}</span>
                                            <IconButton size="small">
                                                <UpdateIcon color="primary" onClick={(e) => handleOpenRider(transaction.id, e)} />
                                            </IconButton>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="customer-report-actions">
                                            <Link to={"../shopOrderTransaction/addProductShopOrderTransaction/" + transaction.id}>
                                                <Button className="customer-report-update-btn" size="sm" variant="success">Update</Button>
                                            </Link>
                                            <Link to={"../shopOrderTransaction/completedShopOrderTransaction/" + transaction.id}>
                                                <Button size="sm" variant="outline-primary">View</Button>
                                            </Link>
                                            {transaction.shop_order_transaction_total_quantity != 0 && (
                                                <Link to={"../shopOrderTransaction/receiptOrder/" + transaction.id}>
                                                    <Button size="sm" variant="outline-secondary">Receipt</Button>
                                                </Link>
                                            )}
                                            {transaction.status != 3 &&
                                                <Tooltip title={transaction.shop_order_transaction_total_price != 0 ? "Need to Delete Product in Transaction" : ""}>
                                                    <span>
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"
                                                            onClick={(e) => deleteShopOrderTransaction(transaction)}
                                                            disabled={transaction.shop_order_transaction_total_price != 0 ? true : false}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </span>
                                                </Tooltip>
                                            }
                                        </div>
                                    </td>
                                </tr>
                                );
                            })}
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
                        <Select name="dispatcher_id" onChange={onChange} value={pickUpModal.dispatcher_id} >
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
