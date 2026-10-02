import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderSupplierTransactionService from "./OrderSupplierTransactionService";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';

const AddOrderSupplierTransaction = (props) => {
    const navigate = useNavigate();
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];

    const [orderTransaction, setorderTransaction] = useState({
        id: 0,
        supplier_id: '',
        supplier_name: '',
        withTax: 1,
        requestor: localStorage.getItem('name'),
        total_transaction_price: 0,
        order_date: localDate,
        status: 'PENDING',
        created_at: '',
        updated_at: ''
    });
    const supplierList = props.supplierList;

    const steps = [
        'Order details',
        'Add products',
        'Review',
        'Send',
        'Receive',
    ];

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const onChangeInput = (e) => {
        if (e.target.type === 'checkbox') {
            setorderTransaction({ ...orderTransaction, withTax: e.target.checked ? 1 : 0 });
        } else {
            setorderTransaction({ ...orderTransaction, [e.target.name]: e.target.value });
        }
        setSubmitError("");
    };

    const saveOrderTransaction = () => {
        if (!orderTransaction.supplier_id || !orderTransaction.order_date || isSubmitting) {
            setSubmitError("Choose a supplier and order date to continue.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        OrderSupplierTransactionService.sanctum()
            .then(() => OrderSupplierTransactionService.create(orderTransaction))
                .then(response => {
                    navigate('/addProductOrderSupplierTransaction/' + response.data.id);
                })
                .catch(e => {
                    console.log(e);
                    setSubmitError("The purchase order could not be created. Please try again.");
                    setIsSubmitting(false);
                });
    };

    const canContinue =
        Boolean(orderTransaction.supplier_id) &&
        Boolean(orderTransaction.order_date) &&
        !props.isLoadingSuppliers &&
        !isSubmitting;

    return (
        <section className="purchase-order-shell">
            <div className="purchase-order-heading">
                <div className="purchase-order-icon" aria-hidden="true">
                    <ReceiptLongOutlinedIcon />
                </div>
                <div>
                    <span className="purchase-order-eyebrow">Purchasing</span>
                    <h1>Create purchase order</h1>
                    <p>Start a new supplier order. You can add products and review totals in the next step.</p>
                </div>
            </div>

            <div className="purchase-order-progress">
                <Stepper activeStep={0} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </div>

            <div className="purchase-order-card">
                <div className="purchase-order-card-header">
                    <div>
                        <span>Step 1 of 5</span>
                        <h2>Order information</h2>
                        <p>Select who this order is for and when it should be recorded.</p>
                    </div>
                    <div className="purchase-order-requestor">
                        <small>Requested by</small>
                        <strong>{orderTransaction.requestor || 'Current user'}</strong>
                    </div>
                </div>

                {(props.supplierError || submitError) && (
                    <Alert
                        severity="error"
                        action={props.supplierError ? (
                            <Button color="inherit" size="small" onClick={props.onRetrySuppliers}>
                                Retry
                            </Button>
                        ) : null}
                        className="purchase-order-alert"
                    >
                        {props.supplierError || submitError}
                    </Alert>
                )}

                <div className="purchase-order-form">
                    <div className="purchase-order-field">
                        <div className="purchase-order-field-label">
                            <LocalShippingOutlinedIcon />
                            <div>
                                <label htmlFor="supplier-select">Supplier</label>
                                <span>Choose the supplier fulfilling this order</span>
                            </div>
                        </div>
                        <Autocomplete
                            fullWidth
                            id="supplier-select"
                            options={supplierList}
                            value={supplierList.find(supplier => Number(supplier.id) === Number(orderTransaction.supplier_id)) || null}
                            onChange={(_, supplier) => {
                                setorderTransaction({
                                    ...orderTransaction,
                                    supplier_id: supplier?.id || '',
                                    supplier_name: supplier?.supplier_name || '',
                                });
                                setSubmitError('');
                            }}
                            getOptionLabel={supplier => supplier.supplier_name || ''}
                            isOptionEqualToValue={(option, value) => Number(option.id) === Number(value.id)}
                            loading={props.isLoadingSuppliers}
                            disabled={props.isLoadingSuppliers || Boolean(props.supplierError)}
                            noOptionsText="No suppliers found"
                            ListboxProps={{ style: { maxHeight: 320 } }}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label={props.isLoadingSuppliers ? 'Loading suppliers…' : 'Select a supplier'}
                                    placeholder="Search suppliers"
                                />
                            )}
                        />
                    </div>

                    <div className="purchase-order-field">
                        <div className="purchase-order-field-label">
                            <CalendarMonthOutlinedIcon />
                            <div>
                                <label htmlFor="purchase-order-date">Order date</label>
                                <span>The date shown on the purchase order</span>
                            </div>
                        </div>
                        <input
                            id="purchase-order-date"
                            className="purchase-order-date"
                            type="date"
                            name="order_date"
                            value={orderTransaction.order_date}
                            onChange={onChangeInput}
                        />
                    </div>
                </div>

                <div className="purchase-order-card-footer">
                    <p>Next, you’ll add products and quantities to this order.</p>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={saveOrderTransaction}
                        disabled={!canContinue}
                        endIcon={isSubmitting ? null : <ArrowForwardRoundedIcon />}
                        className="purchase-order-next"
                    >
                        {isSubmitting ? (
                            <>
                                <CircularProgress size={18} color="inherit" />
                                Creating…
                            </>
                        ) : 'Continue to products'}
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default AddOrderSupplierTransaction;
