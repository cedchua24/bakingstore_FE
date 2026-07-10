import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Alert from '@mui/material/Alert';
import OrderSupplierTransactionService from "./OrderSupplierTransactionService";
import OrderSupplierService from "./OrderSupplierServiceService";
import ProductSupplierService from "../ProductSupplier/ProductSupplierService";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography'
import UpdateIcon from '@mui/icons-material/Update';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';

import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import "./OrderSupplierTransaction.css";


const AddProductOrderSupplierTransaction = () => {
    const { id } = useParams();

    useEffect(() => {
        fetchOrderSupplierTransaction(id);
        fetchByOrderSupplierId(id);
        fetchProductList();
    }, []);



    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [value, setValue] = useState(null);


    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [submitLoadingUpdate, setSubmitLoadingUpdate] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});


    const [deleteOpenModal, setDeleteOpenModal] = React.useState(false);
    const [deleteId, setDeleteId] = useState(0)

    const handleDeleteCloseModal = () => {
        setDeleteOpenModal(false);
    };


    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [autoPo, setAutoPo] = useState({
        order_supplier_transaction_id: id,
        supplier_id: 0
    });

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(92vw, 480px)',
        bgcolor: 'background.paper',
        border: '1px solid #e5e8ec',
        borderRadius: '18px',
        boxShadow: 24,
        p: { xs: 3, sm: 4 },
        '& .MuiTextField-root': { width: '100%' },
    };

    const [open, setOpen] = React.useState(false);

    const handleOpen = (id, e) => {
        if (Number(orderSupplierTransaction.payment_status) === 1) return;
        console.log('e', id);
        fetchOrderBySupplierId(id);
        setOpen(true);
    }

    const handleClose = () => setOpen(false);


    const steps = [
        'Order details',
        'Add products',
        'Review',
        'Send',
        'Receive',
    ];

    const TAX_RATE = 0.12;

    function ccyFormat(num) {
        return `${num.toFixed(2)}`;
    }


    const [invoiceSubtotal, setinvoiceSubtotal] = useState(0);
    const [invoiceTaxes, setinvoiceTaxes] = useState(0);
    const [invoiceTotal, setinvoiceTotal] = useState(0);

    const [orderList, setOrderList] = useState([]);

    const [orderSupplierTransaction, setOrderSupplierTransaction] = useState({
        id: 0,
        supplier_name: '',
        supplier_id: 0,
        withTax: 0,
        total_transaction_price: 0,
        order_date: '',
        status: '',
        payment_status: 0,
        created_at: '',
        updated_at: ''
    });


    const [orderSupplier, setOrderSupplier] = useState({
        id: 0,
        order_supplier_transaction_id: id,
        product_id: 0,
        price: 0,
        real_price: 0,
        quantity: 0,
        quantity_order: 0,
        total_price: 0,
        expiration: '',
        enable: 0,
        variation: ''
    });

    const [orderSupplierModal, setOrderSupplierModal] = useState({
        id: 0,
        order_supplier_transaction_id: id,
        product_id: 0,
        product_name: '',
        price: 0,
        quantity: 0,
        expiration: '',
        total_price: 0
    });


    const onChangeInput = (e) => {
        setOrderSupplier({ ...orderSupplier, [e.target.name]: e.target.value });
    }

    const onChangeVariation = (e) => {
        // e.persist();
        console.log('name:', e.target.name)
        console.log('value: ', e.target.value)
        console.log('orderSupplier: ', orderSupplier)
        // setOrderSupplier({ ...orderSupplier, [e.target.name]: e.target.value });
        if (e.target.value === 'RETAIL') {
            setOrderSupplier({
                ...orderSupplier,
                variation: e.target.value,
                price: Math.floor(orderSupplier.real_price / orderSupplier.quantity)
            });

        } else if (e.target.value === 'WHOLESALE') {
            setOrderSupplier({
                ...orderSupplier,
                variation: e.target.value,
                price: orderSupplier.real_price
            });

        }

    }

    const onchangeModal = (e) => {
        e.persist();
        setOrderSupplierModal({ ...orderSupplierModal, [e.target.name]: e.target.value });
    }

    const onChangeInputQuantityModal = (e) => {
        e.persist();
        setOrderSupplierModal({
            ...orderSupplierModal,
            quantity: e.target.value,
            total_price: orderSupplierModal.price * e.target.value
        });
    }

    const onChangeInputPriceModal = (e) => {
        e.persist();
        setOrderSupplierModal({
            ...orderSupplierModal,
            price: e.target.value,
            total_price: e.target.value * orderSupplierModal.quantity
        });
    }

    const handleInputChange = (e, value) => {
        setValue(value);

        if (!value) {
            setOrderSupplier({
                ...orderSupplier,
                product_id: 0,
                price: 0,
                quantity: 0,
                variation: '',
                real_price: 0
            });
            return;
        }

        if (value.quantity == 1) {
            setOrderSupplier({
                ...orderSupplier,
                product_id: value.product_id,
                quantity: value.quantity,
                price: value.price,
                weight: value.weight,
                variation: '',
                real_price: value.price
            });

        } else {
            setOrderSupplier({
                ...orderSupplier,
                product_id: value.product_id,
                quantity: value.quantity,
                price: 0,
                weight: value.weight,
                variation: '',
                real_price: value.price
            });
        }
    }

    const fetchProductList = () => {
        // ProductServiceService.getAll()
        //     .then(response => {
        //         setProducts(response.data);
        //     })
        //     .catch(e => {
        //         console.log("error", e)
        //     });

        // ProductSupplierService.fetchProductSupplierById()
        //     .then(response => {
        //         setProducts(response.data);
        //     })
        //     .catch(e => {
        //         console.log("error", e)
        //     });
    }

    const validate = (values) => {
        const errors = {};
        if (orderSupplier.product_id == 0) {
            errors.product_id = "Product is Required!";
        }
        if (orderSupplier.price == 0) {
            errors.price = "Price is Required!";
        }
        if (orderSupplier.quantity_order == 0) {
            errors.quantity_order = "Quantity is Required!";
        }
        const index = orderList.filter(obj => {
            return obj.product_id === orderSupplier.product_id;
        });

        if (index.length != 0) {
            errors.product_id = "Product is already exists!";
        }

        return errors;
    }

    const saveOrderSupplier = (event) => {
        event.preventDefault();
        if (Number(orderSupplierTransaction.payment_status) === 1) return;
        console.log('orderSupplier', orderSupplier);

        console.log("count: ", Object.keys(validate(orderSupplier)).length);
        console.log("validate: ", validate(orderSupplier));
        setFormErrors(validate(orderSupplier));
        if (Object.keys(validate(orderSupplier)).length > 0) {
            console.log("Has Validation: ");

        } else {
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            OrderSupplierService.sanctum().then(response => {
                OrderSupplierService.create(orderSupplier)
                    .then(response => {
                        fetchByOrderSupplierId(id);
                        setOrderSupplier({
                            order_supplier_transaction_id: id,
                            product_id: 0,
                            price: 0,
                            quantity: 0,
                            quantity_order: 0,
                            total_price: 0,
                        });
                        setValue(null);
                        updateOrderTransaction();
                        setValidator({
                            severity: 'success',
                            message: 'Added Successfully',
                            isShow: true,
                        });
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                        window.scrollTo(0, 0);
                    })

                    .catch(e => {
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                        console.log(e);
                    });
            });
        }
    }

    const submitAutoPo = (event) => {
        event.preventDefault();
        if (Number(orderSupplierTransaction.payment_status) === 1) return;
        console.log('autoPo', autoPo);

        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        OrderSupplierService.sanctum().then(response => {
            OrderSupplierService.saveAutoPo(autoPo)
                .then(response => {
                    fetchByOrderSupplierId(id);
                    setOrderSupplier({
                        order_supplier_transaction_id: id,
                        product_id: 0,
                        price: 0,
                        quantity: 0,
                        quantity_order: 0,
                        total_price: 0,
                    });
                    updateOrderTransaction();
                    if (response.data.code === 200) {
                        setValidator({
                            severity: 'success',
                            message: "Successfully Added!" + response.data.added_product,
                            isShow: true,
                        });

                    } else if (response.data.code === 202) {
                        setValidator({
                            severity: 'warning',
                            message: response.data.added_product,
                            isShow: true,
                        });

                    }
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                    window.scrollTo(0, 0);
                })
                .catch(e => {
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                    console.log(e);
                });
        });

    }

    const fetchOrderSupplierTransaction = async (id) => {
        await OrderSupplierTransactionService.findById(id)
            .then(response => {
                setOrderSupplierTransaction(response.data);
                setAutoPo({
                    ...autoPo,
                    supplier_id: response.data.supplier_id
                });

                if (response.data.withTax === 0) {

                    setinvoiceSubtotal(response.data.total_transaction_price);
                    setinvoiceTaxes(TAX_RATE * response.data.total_transaction_price);
                    setinvoiceTotal(TAX_RATE * response.data.total_transaction_price + response.data.total_transaction_price);
                } else {
                    const totalPrice = response.data.total_transaction_price;
                    const subtotal = totalPrice / (1 + TAX_RATE);

                    setinvoiceSubtotal(subtotal);
                    setinvoiceTaxes(totalPrice - subtotal);
                    setinvoiceTotal(totalPrice);
                }

                // MarkUpPriceService.fetchMarkUpBySupplierId(response.data.supplier_id)
                ProductSupplierService.fetchProductSupplierById(response.data.supplier_id)
                    .then(response => {
                        setProducts(response.data);
                    })
                    .catch(e => {
                        console.log("error", e)
                    });


                // setChecked(response.data.withTax === 1 ? true : false);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchByOrderSupplierId = async (id) => {
        await OrderSupplierService.findById(id)
            .then(response => {
                setOrderList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchOrderBySupplierId = async (id) => {
        await OrderSupplierService.fetchOrderBySupplierId(id)
            .then(response => {
                setOrderSupplierModal(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }



    const updateOrderTransaction = () => {
        OrderSupplierTransactionService.update(id, orderSupplierTransaction)
            .then(response => {
                // setValidator({
                //     severity: 'success',
                //     message: 'Updated Successfully',
                //     isShow: true,
                // });
                fetchOrderSupplierTransaction(id);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const openDelete = (id) => {
        if (Number(orderSupplierTransaction.payment_status) === 1) return;
        console.log('delete', id);
        setDeleteId(id)
        setDeleteOpenModal(true);
    }


    const deleteOrderTransaction = (id, e) => {
        if (Number(orderSupplierTransaction.payment_status) === 1) return;

        const index = orderList.findIndex(orderSupplier => orderSupplier.id === id);
        const neworderSupplier = [...orderList];
        neworderSupplier.splice(index, 1);
        setSubmitLoading(true);

        OrderSupplierService.delete(id)
            .then(response => {
                setValidator({
                    severity: 'success',
                    message: 'Deleted Successfully',
                    isShow: true,
                });
                updateOrderTransaction();
                setOrderList(neworderSupplier);
                setSubmitLoading(false);
                setDeleteOpenModal(false);
            })
            .catch(e => {
                setSubmitLoading(false);
                setDeleteOpenModal(false);
                console.log('error', e);
            });
    }

    const updateOrderSupplier = () => {
        if (Number(orderSupplierTransaction.payment_status) === 1) return;
        setSubmitLoadingUpdate(true);
        OrderSupplierService.update(orderSupplierModal.id, orderSupplierModal)
            .then(response => {
                setSubmitLoadingUpdate(false);
                setOpen(false);
                fetchByOrderSupplierId(id);
                updateOrderTransaction();
                setValidator({
                    severity: 'success',
                    message: 'Updated Successfully',
                    isShow: true,
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    const finalizeOrder = () => {
        navigate('/orderSupplierApproval/' + id);
    }

    const formatStatementDate = (date) => {
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }


    const isFullyPaid = Number(orderSupplierTransaction.payment_status) === 1;

    return (
        <main className="purchase-order-page po-products-page">
            <section className="purchase-order-shell">
            <div className="purchase-order-heading">
                <div className="purchase-order-icon" aria-hidden="true">
                    <Inventory2OutlinedIcon />
                </div>
                <div>
                    <span className="purchase-order-eyebrow">Purchase order #{id}</span>
                    <h1>Add products</h1>
                    <p>Build the supplier order with products, quantities, prices, and expiry dates.</p>
                </div>
            </div>

            {validator.isShow &&
                <Alert className="po-products-alert" variant="filled" severity={validator.severity}>
                    {validator.message}
                </Alert>
            }

            <Box
                className="po-products-workspace"
                noValidate
                autoComplete="off"
            >
                <div className="purchase-order-progress">
                <Stepper activeStep={1} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                </div>
                <TableContainer component={Paper} className="po-order-summary">

                    <Table aria-label="Purchase order summary">
                        <TableBody>
                            <TableRow >
                                <TableCell>
                                    <div className="po-summary-label"><LocalShippingOutlinedIcon /> Supplier</div>
                                    <strong>{orderSupplierTransaction.supplier_name || 'Loading…'}</strong>
                                </TableCell>
                                <TableCell>
                                    <div className="po-summary-label"><CalendarMonthOutlinedIcon /> Order date</div>
                                    <strong>{orderSupplierTransaction.order_date || '—'}</strong>
                                </TableCell>
                                <TableCell>
                                    <div className="po-summary-label"><ReceiptLongOutlinedIcon /> Items</div>
                                    <strong>{orderList.length}</strong>
                                </TableCell>
                                <TableCell align="right">
                                    <div className="po-summary-label po-summary-label-right">Order total</div>
                                    <strong className="po-summary-total">₱{ccyFormat(invoiceTotal)}</strong>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <section className="po-entry-card">
                    <div className="po-card-heading">
                        <div>
                            <span>Step 2 of 5</span>
                            <h2>Add an item</h2>
                            <p>Choose a supplier product and enter the order quantity.</p>
                        </div>
                    </div>
                <form onSubmit={saveOrderSupplier} className="po-products-form">
                    <div className="po-form-field po-form-field-full">
                        <Autocomplete
                            options={[...products].sort((a, b) =>
                                b.category_name.toString().localeCompare(a.category_name.toString())
                            )}
                            value={value}
                            className="po-product-search"
                            id="supplier-product-select"
                            onChange={handleInputChange}
                            groupBy={(product) => product.category_name}
                            isOptionEqualToValue={(option, selected) => option.product_id === selected.product_id}
                            getOptionLabel={(product) => `${product.product_name} - ${product.weight}kg (₱${product.price}) | Stock: ${product.stock}`}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Choose product"
                                    placeholder="Search supplier products"
                                    error={Boolean(formErrors.product_id)}
                                    helperText={formErrors.product_id}
                                />
                            )}
                        />
                    </div>

                    {orderSupplier.quantity > 1 && (
                        <div className="po-form-field po-form-field-full">
                        <FormControl fullWidth>
                            <InputLabel id="product-variation-label">Pricing variation</InputLabel>
                            <Select
                                labelId="product-variation-label"
                                id="product-variation"
                                name='variation'
                                label="Pricing variation"
                                value={orderSupplier.variation}
                                onChange={onChangeVariation}
                            >
                                <MenuItem value='WHOLESALE'>Wholesale</MenuItem>
                                <MenuItem value='RETAIL'>Retail</MenuItem>
                            </Select>
                        </FormControl>
                        </div>
                    )}

                    <div className="po-form-field">
                        <TextField
                            fullWidth
                            id="product-price"
                            label="Unit price"
                            type="number"
                            name='price'
                            value={orderSupplier.price}
                            onChange={onChangeInput}
                            disabled={orderSupplier.price == 0}
                            error={Boolean(formErrors.price)}
                            helperText={formErrors.price}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₱</InputAdornment>
                            }}
                        />
                    </div>

                    <div className="po-form-field">
                        <TextField
                            fullWidth
                            id="product-quantity"
                            label="Quantity"
                            type='number'
                            name='quantity_order'
                            value={orderSupplier.quantity_order}
                            disabled={orderSupplier.price == 0}
                            onChange={onChangeInput}
                            error={Boolean(formErrors.quantity_order)}
                            helperText={formErrors.quantity_order}
                            inputProps={{ min: 1 }}
                        />
                    </div>

                    <div className="po-form-field po-form-field-full">
                        <TextField
                            fullWidth
                            id="product-expiration"
                            label="Expiration date"
                            type="date"
                            name="expiration"
                            value={orderSupplier.expiration || ''}
                            onChange={onChangeInput}
                            InputLabelProps={{ shrink: true }}
                            helperText="Optional"
                        />
                    </div>

                    {submitLoadingAdd &&
                        <LinearProgress color="warning" className="po-form-field-full" />
                    }

                    <div className="po-add-action">
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={isFullyPaid || isAddDisabled}
                            startIcon={submitLoadingAdd ? <CircularProgress size={18} color="inherit" /> : <AddRoundedIcon />}
                            className="po-add-button"
                        >
                            {submitLoadingAdd ? 'Adding item…' : 'Add to order'}
                        </Button>
                    </div>
                </form>

                <br></br>
                <form onSubmit={submitAutoPo} >
                    <Button
                        variant="outlined"
                        type="submit"
                        disabled={isFullyPaid || isAddDisabled}
                        startIcon={<AutoAwesomeRoundedIcon />}
                        className="po-auto-button"
                    >
                        Auto-fill suggested products
                    </Button>
                </form>
                <br></br>
                </section>
            </Box>

            <div className="po-list-heading">
                <div>
                    <span>Order items</span>
                    <h2>Products in this purchase order</h2>
                </div>
                <strong>{orderList.length} {orderList.length === 1 ? 'item' : 'items'}</strong>
            </div>
            <TableContainer component={Paper} className="po-items-table">
                <Table sx={{ minWidth: 760 }} aria-label="Purchase order products">
                    <TableHead>

                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Unit</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="right">Expiration</TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderList.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8}>
                                    <div className="po-empty-state">
                                        <Inventory2OutlinedIcon />
                                        <strong>No products added yet</strong>
                                        <span>Use the form above to add the first product.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                        {orderList.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell><strong>{row.product_name}</strong></TableCell>
                                <TableCell align="right">{row.unit}</TableCell>
                                <TableCell align="right">{row.quantity}</TableCell>
                                <TableCell align="right">₱{ccyFormat(Number(row.price))}</TableCell>
                                <TableCell align="right"><strong>₱{ccyFormat(Number(row.total_price))}</strong></TableCell>
                                <TableCell align="right">{row.expiration != null ? formatStatementDate(row.expiration) : "—"}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title={isFullyPaid ? "Fully paid orders cannot be updated" : "Edit product"}>
                                        <span>
                                            <IconButton disabled={isFullyPaid} onClick={(e) => handleOpen(row.id, e)} aria-label={`Edit ${row.product_name}`}>
                                                <UpdateIcon />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title={isFullyPaid ? "Fully paid orders cannot be deleted" : "Remove product"}>
                                        <span>
                                            <IconButton color="error" disabled={isFullyPaid} onClick={(e) => openDelete(row.id, e)} aria-label={`Remove ${row.product_name}`}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}

                        <TableRow className="po-grand-total-row">
                            <TableCell colSpan={4} style={{ fontWeight: 'bold' }}>Grand Total</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>₱ {ccyFormat(invoiceTotal)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="po-review-footer">
                <p>{orderList.length === 0 ? 'Add at least one product to continue.' : 'Ready to check quantities and totals?'}</p>
                <Button
                    variant="contained"
                    disabled={orderList.length === 0}
                    onClick={finalizeOrder}
                    size="large"
                    endIcon={<ArrowForwardRoundedIcon />}
                    className="purchase-order-next"
                >
                    Continue to review
                </Button>
            </div>
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Update Product
                    </Typography>
                    {submitLoadingUpdate &&
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </div>
                    }


                    <TextField
                        disabled
                        id="filled-required"
                        label="Product Name"
                        variant="filled"
                        name='product_name'
                        value={orderSupplierModal.product_name}
                    />

                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Price</InputLabel>
                        <Input
                            id="filled-required"
                            label="=Price"
                            variant="filled"
                            name='price'
                            value={orderSupplierModal.price}
                            onChange={onChangeInputPriceModal}
                            startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                        />
                    </FormControl>

                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Quantity</InputLabel>
                        <Input
                            type='number'
                            id="filled-required"
                            label="=Price"
                            variant="filled"
                            name='quantity'
                            value={orderSupplierModal.quantity}
                            onChange={onChangeInputQuantityModal}
                        />
                    </FormControl>

                    <TextField
                        disabled
                        id="filled-required"
                        label="Total Price"
                        variant="filled"
                        name='total_price'
                        startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                        value={'₱ ' + orderSupplierModal.total_price}
                    />
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Expiration</Form.Label>
                            <Form.Control type="date" name="expiration" value={orderSupplierModal.expiration} onChange={onchangeModal} />
                        </Form.Group>
                    </FormControl>
                    <br></br>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            variant="contained"
                            type="submit"
                            onClick={updateOrderSupplier}
                            disabled={isFullyPaid || submitLoadingUpdate}
                            size="large" >
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
                    <Button disabled={isFullyPaid || submitLoading} onClick={(e) => deleteOrderTransaction(deleteId, e)} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
            <div className="po-copy-list">
                <h5>Supplier Order</h5>
                {orderList.map((row) => (
                    <h6 key={row.id}>{row.quantity} {row.unit} - {row.product_name}</h6>
                ))}
            </div>
            </section>
        </main>
    );
}

export default AddProductOrderSupplierTransaction;



