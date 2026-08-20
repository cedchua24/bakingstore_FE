import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import ModeOfPaymentService from "../OtherService/ModeOfPaymentService"
import { Form } from 'react-bootstrap';
import IconButton from '@mui/material/IconButton';
import UpdateIcon from '@mui/icons-material/Update';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal';
import Checkbox from '@mui/material/Checkbox';
import { formatPaymentLabel } from "./shopOrderPaymentHelpers";
import "./PaymentTypeSales.css";

const PaymentTypeSales = () => {

    const { id } = useParams();


    useEffect(() => {
        fetchShopOrderTransactionList();
    }, []);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: 'calc(100% - 32px)', sm: 420 },
        maxWidth: 'calc(100vw - 32px)',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        '& .MuiTextField-root': { m: 1, width: '25ch' },
    };

    const [date, setDate] = useState({
        id: 0,
        newDate: ''
    });

    const [count, setCount] = useState(0);

    const [paymentDetails, setPaymentDetails] = useState({
        discrepancy: 0,
        paid: 0,
        nonPaid: 0,
        count: 0
    });

    const [openPickUp, setOpenPickUp] = React.useState(false);
    const handleClosePickUp = () => setOpenPickUp(false);

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        data: [],
        payment: [],
        code: '',
        message: '',
        total_price: 0,
        total_profit: 0,
        date: ''
    });

    const [shopOrderTransactionUpdateModal, setShopOrderTransactionUpdateModal] = useState({
        id: 0,
        payment_type_id: 0,
        shop_order_transaction_id: 0,
        amount: 0,
        is_paid: 0
    });


    const onChangePaymentTypeStatus = (e) => {

        console.log("error", e.target.checked)
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setShopOrderTransactionUpdateModal({ ...shopOrderTransactionUpdateModal, is_paid: 1 });
            } else {
                setShopOrderTransactionUpdateModal({ ...shopOrderTransactionUpdateModal, is_paid: 0 });
            }
        } else {
            setShopOrderTransactionUpdateModal({ ...shopOrderTransactionUpdateModal, is_paid: e.target.value });
        }
    }

    const fetchTransaction = async (id) => {
        await ModeOfPaymentService.get(id)
            .then(response => {
                console.log("fetchTransaction", response.data);
                setShopOrderTransactionUpdateModal(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }



    const fetchShopOrderTransactionList = () => {

        var valueParam = id.split("+");
        console.log('pieces', valueParam);
        console.log('date', valueParam[1]);

        if (valueParam[1] === '') {
            console.log('empty');
            valueParam[1] = 0;
        } else {
            console.log('non empty');
        }

        ShopOrderTransactionService.fetchOnlineShopOrderTransactionListByIdDateV2(valueParam[0], valueParam[1])
            .then(response => {
                console.log('fetchOnlineShopOrderTransactionListByIdDateV2', response.data)
                // setShopOrderTransactionList(response.data);
                const transactionSummary = response.data || {};
                const transactions = Array.isArray(transactionSummary.data) ? transactionSummary.data : [];
                setShopOrderTransaction({
                    ...transactionSummary,
                    data: transactions,
                    payment: transactionSummary.payment || {},
                });
                // console.log('filterByPaid', filterByPaid(response.data.data));
                console.log('filterByPaid', subtotal(filterByPaid(transactions)));
                console.log('filterByNonPaid', subtotal(filterByNonPaid(transactions)));
                setCount(filterByPaid(transactions).length);
                setPaymentDetails({
                    ...paymentDetails,
                    paid: subtotal(filterByPaid(transactions)),
                    nonPaid: subtotal(filterByNonPaid(transactions)),
                    count: filterByPaid(transactions).length
                });
            })
            .catch(e => {
                console.log("error", e)

            });
    }

    const filterByPaid = (shopOrderTransaction2) => {
        return shopOrderTransaction2.filter(s => s.is_paid == 1);
    };

    const filterByNonPaid = (shopOrderTransaction2) => {
        return shopOrderTransaction2.filter(s => s.is_paid == 0);
    };

    function subtotal(items) {
        console.log(items);
        return items.reduce((total, currentValue) => total + Number(currentValue.amount || 0), 0);

        // return items.map(({ items }) => items.amount).reduce((sum, i) => sum + i, 0);
    }

    const handleOpenPickUp = (id, e) => {
        console.log('e', id);
        fetchTransaction(id);
        setOpenPickUp(true);
    }

    const updateDate = () => {
        ModeOfPaymentService.updatePaidStatus(shopOrderTransactionUpdateModal.id, shopOrderTransactionUpdateModal)
            .then(response => {
                fetchShopOrderTransactionList();
                setOpenPickUp(false);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const reportDate = shopOrderTransaction.date || id.split("+")[1];
    const totalAmount = Number(shopOrderTransaction.payment.total_amount || 0);
    const paidAmount = Number(paymentDetails.paid || 0);
    const paidCount = filterByPaid(shopOrderTransaction.data).length;
    const transactionCount = shopOrderTransaction.data.length;
    const isReconciled = paidCount === transactionCount && paidAmount === totalAmount;
    const numberFormat = (value) => new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2,
    }).format(Number(value || 0));


    return (
        <div className="payment-account-sales-page">
            <header className="payment-account-sales-hero">
                <div>
                    <span className="payment-account-sales-eyebrow">Payment reconciliation</span>
                    <h1>Account Sales</h1>
                    <p>{formatPaymentLabel(shopOrderTransaction.payment) || 'Account'} · {reportDate || 'Today'}</p>
                </div>
                <div className={`payment-account-sales-status ${isReconciled ? 'is-complete' : 'is-pending'}`}>
                    {isReconciled ? <CheckIcon /> : <CloseIcon />}
                    {isReconciled ? 'Reconciled' : 'Needs review'}
                </div>
            </header>

            <section className="payment-account-sales-metrics">
                <article>
                    <span>Account total</span>
                    <strong>{numberFormat(totalAmount)}</strong>
                    <small>{formatPaymentLabel(shopOrderTransaction.payment) || '—'}</small>
                </article>
                <article>
                    <span>Confirmed records</span>
                    <strong>{paidCount} / {transactionCount}</strong>
                    <small>{transactionCount === 1 ? '1 transaction' : `${transactionCount} transactions`}</small>
                </article>
                <article>
                    <span>Confirmed amount</span>
                    <strong>{numberFormat(paidAmount)}</strong>
                    <small>of {numberFormat(totalAmount)}</small>
                </article>
                <article className={totalAmount - paidAmount === 0 ? 'is-balanced' : 'has-discrepancy'}>
                    <span>Discrepancy</span>
                    <strong>{numberFormat(totalAmount - paidAmount)}</strong>
                    <small>{totalAmount - paidAmount === 0 ? 'Account is balanced' : 'Amount still unconfirmed'}</small>
                </article>
            </section>

            <section className="payment-account-sales-table-card">
                <div className="payment-account-sales-table-heading">
                    <div>
                        <span>Transactions</span>
                        <h2>Account payment records</h2>
                    </div>
                    <strong>{transactionCount} {transactionCount === 1 ? 'record' : 'records'}</strong>
                </div>

                <div className="payment-account-sales-table-wrap">
                <table className="table payment-account-sales-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Transaction ID</th>
                        <th>Shop</th>
                        <th>Type</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Qty</th>
                        <th>Order Total</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Confirmation</th>
                        <th>Action</th>
                    </tr>
                </thead>
                        <tbody>
                            {transactionCount === 0 ? (
                                <tr>
                                    <td colSpan="12" className="payment-account-sales-empty">No payment records available.</td>
                                </tr>
                            ) : (
                                shopOrderTransaction.data.map((shopOrderTransaction) => (
                                    <tr key={shopOrderTransaction.id} >
                                        <td>{shopOrderTransaction.id}</td>
                                        <td>{shopOrderTransaction.transaction_id}</td>
                                        <td>{shopOrderTransaction.shop_name}</td>
                                        <td>{shopOrderTransaction.customer_type}</td>
                                        <td>{shopOrderTransaction.requestor_name}</td>
                                        <td className="payment-account-sales-amount">{numberFormat(shopOrderTransaction.amount)}</td>
                                        <td>{shopOrderTransaction.shop_order_transaction_total_quantity}</td>
                                        <td>{numberFormat(shopOrderTransaction.shop_order_transaction_total_price)}</td>
                                        <td>{shopOrderTransaction.date != reportDate ? <p style={{ color: 'orange', }}>{shopOrderTransaction.date}</p> : shopOrderTransaction.date}</td>

                                        <td><span className={`payment-account-sales-order-status status-${shopOrderTransaction.status}`}>
                                            {Number(shopOrderTransaction.status) === 1 ? 'Completed' : Number(shopOrderTransaction.status) === 2 ? 'Pending' : 'Cancelled'}
                                        </span></td>
                                        <td>
                                            <span className={`payment-account-sales-confirmation ${Number(shopOrderTransaction.is_paid) === 1 ? 'is-confirmed' : 'is-unconfirmed'}`}>
                                                {Number(shopOrderTransaction.is_paid) === 1 ? <CheckIcon /> : <CloseIcon />}
                                                {Number(shopOrderTransaction.is_paid) === 1 ? 'Confirmed' : 'Unconfirmed'}
                                            </span>
                                            <IconButton size="small" title="Update confirmation">
                                                <UpdateIcon color="primary" onClick={(e) => handleOpenPickUp(shopOrderTransaction.id, e)} />
                                            </IconButton>
                                        </td>
                                        <td>
                                            <Link variant="primary" to={"../shopOrderTransaction/completedShopOrderTransaction/" + shopOrderTransaction.shop_order_transaction_id}   >
                                                <Button variant="outline-primary" size="sm">
                                                    View
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                </table>
                </div>
            </section>

            <Modal
                keepMounted
                open={openPickUp}
                onClose={handleClosePickUp}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Status
                    </Typography>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Payment confirm ? </Form.Label>

                        <Checkbox
                            checked={shopOrderTransactionUpdateModal.is_paid === 0 ? false : true}
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

export default PaymentTypeSales
