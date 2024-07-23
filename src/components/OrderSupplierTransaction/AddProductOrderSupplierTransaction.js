import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import OrderSupplierTransactionService from "./OrderSupplierTransaction.service";
import OrderSupplierService from "./OrderSupplierService.service";
import ProductServiceService from "../Product/ProductService.service";
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
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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


const AddProductOrderSupplierTransaction = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [value, setValue] = useState(products[0])


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


    useEffect(() => {
        fetchOrderSupplierTransaction(id);
        fetchByOrderSupplierId(id);
        fetchProductList();
    }, []);

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

    const [open, setOpen] = React.useState(false);

    const handleOpen = (id, e) => {
        console.log('e', id);
        fetchOrderBySupplierId(id);
        setOpen(true);
    }

    const handleClose = () => setOpen(false);


    const steps = [
        'Created Transaction Details',
        'Add Product Orders',
        'Finalize Orders',
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
        variation: ''
    });

    const [orderSupplierModal, setOrderSupplierModal] = useState({
        id: 0,
        order_supplier_transaction_id: id,
        product_id: 0,
        product_name: '',
        price: 0,
        quantity: 0,
        total_price: 0
    });


    const [isChecked, setChecked] = useState(false);

    const [message, setMessage] = useState(false);



    const onChangeInput = (e) => {
        // e.persist();
        console.log(e.target.name)
        console.log(e.target.name)
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
                price: Math.floor(orderSupplier.real_price / orderSupplier.weight)
            });

        } else if (e.target.value === 'WHOLESALE') {
            setOrderSupplier({
                ...orderSupplier,
                variation: e.target.value,
                price: orderSupplier.real_price
            });

        }

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
        console.log(value);
        e.persist();
        // setOrderSupplier({
        //     ...orderSupplier,
        //     product_id: value.product_id,
        //     quantity: value.quantity
        // });

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
                        updateOrderTransaction();
                        setValidator({
                            severity: 'success',
                            message: 'Added Successfully',
                            isShow: true,
                        });
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                    })
                    .catch(e => {
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                        console.log(e);
                    });
            });
        }
    }

    const fetchOrderSupplierTransaction = async (id) => {
        await OrderSupplierTransactionService.findById(id)
            .then(response => {
                setOrderSupplierTransaction(response.data);


                if (response.data.withTax === 0) {

                    setinvoiceSubtotal(response.data.total_transaction_price);
                    setinvoiceTaxes(TAX_RATE * response.data.total_transaction_price);
                    setinvoiceTotal(TAX_RATE * response.data.total_transaction_price + response.data.total_transaction_price);
                } else {
                    setChecked(true);
                    setinvoiceSubtotal(response.data.total_transaction_price - TAX_RATE * response.data.total_transaction_price);
                    setinvoiceTaxes(TAX_RATE * response.data.total_transaction_price);
                    setinvoiceTotal(response.data.total_transaction_price);
                }

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
        console.log('delete', id);
        setDeleteId(id)
        setDeleteOpenModal(true);
    }


    const deleteOrderTransaction = (id, e) => {

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
        navigate('/finalizeOrder/' + id);
    }



    return (
        <div>


            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>

            <br></br>
            <Box
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            // onSubmit={saveOrderSupplier}
            >
                <Stepper activeStep={1} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>


                        </Step>
                    ))}
                </Stepper>
                <br></br>
                <form onSubmit={saveOrderSupplier} >
                    <TextField
                        id="outlined-disabled"
                        label="Supplier Name"
                        variant="filled"
                        value={orderSupplierTransaction.supplier_name}
                        disabled
                    />

                    <TextField
                        id="outlined-disabled"
                        label="Date"
                        variant="filled"
                        value={orderSupplierTransaction.order_date}
                        disabled
                    />

                    <FormControlLabel disabled control={<Checkbox
                        checked={isChecked}
                        // onChange={handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />} label="With Tax" />
                    <br></br>
                    {formErrors.product_id && <p style={{ color: "red" }}>{formErrors.product_id}</p>}
                    <FormControl variant="standard" >
                        {/* <Autocomplete
                            // {...defaultProps}
                            // options={products}
                            options={products.sort((a, b) =>
                                b.category_name.toString().localeCompare(a.category_name.toString())
                            )}
                            className="mb-3"
                            id="disable-close-on-select"
                            onChange={handleInputChange}
                            getOptionLabel={(products) => products.product_name + ' - ' + (products.weight) + 'kg'}
                            renderInput={(params) => (
                                <TextField {...params} label="Choose Product" variant="standard" />
                            )}
                        /> */}

                        <Autocomplete
                            sx={{
                                width: 800
                            }}
                            // options={products}
                            options={products.sort((a, b) =>
                                b.category_name.toString().localeCompare(a.category_name.toString())
                            )}
                            value={value}
                            className="mb-3"
                            id="disable-close-on-select"
                            onChange={handleInputChange}
                            groupBy={(products) => products.category_name}
                            getOptionLabel={(products) => products.product_name + ' - ' + (products.weight) + 'kg' + ' (₱' + (products.price) + ')'}
                            renderInput={(params) => (
                                <TextField {...params} label='Choose Product' variant="standard" />
                            )}
                        />
                    </FormControl>

                    <br></br>

                    {orderSupplier.quantity > 1 ? (
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Variation</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                className="mb-3"
                                id="demo-simple-select"
                                name='variation'
                                label="Variation"
                                value={orderSupplier.variation}
                                onChange={onChangeVariation}
                            >
                                <MenuItem value='WHOLESALE'>Wholesale</MenuItem>
                                <MenuItem value='RETAIL'>Retail</MenuItem>
                            </Select>
                        </FormControl>
                    ) : (
                        <div>
                            <br></br>
                        </div>
                    )}
                    {formErrors.price && <p style={{ color: "red" }}>{formErrors.price}</p>}
                    <FormControl variant="standard" >
                        <InputLabel htmlFor="standard-adornment-amount">Price</InputLabel>
                        <Input
                            className="mb-3"
                            id="filled-required"
                            label="Price"
                            variant="filled"
                            name='price'
                            value={orderSupplier.price}
                            onChange={onChangeInput}
                            disabled={orderSupplier.price == 0 ? true : false}
                            startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                        />
                    </FormControl>

                    <br></br>
                    {formErrors.quantity_order && <p style={{ color: "red" }}>{formErrors.quantity_order}</p>}
                    <FormControl variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Quantity</InputLabel>
                        <Input
                            type='number'
                            className="mb-3"
                            id="filled-required"
                            label="=Price"
                            variant="filled"
                            name='quantity_order'
                            value={orderSupplier.quantity_order}
                            disabled={orderSupplier.price == 0 ? true : false}
                            onChange={onChangeInput}
                        />
                    </FormControl>
                    <br></br>
                    {submitLoadingAdd &&
                        <LinearProgress color="warning" />
                    }
                    <br></br>
                    <div>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={isAddDisabled}
                        >
                            Add
                        </Button>
                    </div>
                    <br></br>
                </form>
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" colSpan={3}>
                                Details
                            </TableCell>
                            <TableCell align="center" >Price</TableCell>
                            <TableCell align="center" colSpan={2}>Action</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Qty.</TableCell>
                            <TableCell align="right">Unit</TableCell>
                            <TableCell align="right">Sum</TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderList.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.product_name}</TableCell>
                                <TableCell align="right">{row.quantity}</TableCell>
                                <TableCell align="right">{row.price}</TableCell>
                                <TableCell align="right">{row.total_price}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Update">
                                        <IconButton>
                                            <UpdateIcon color="primary" onClick={(e) => handleOpen(row.id, e)} />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Delete">
                                        <IconButton>
                                            <DeleteIcon color="error" onClick={(e) => openDelete(row.id, e)} />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}

                        <TableRow>
                            <TableCell rowSpan={3} />
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{invoiceSubtotal}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Tax</TableCell>
                            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
                            <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} style={{ color: 'red', }}>Total</TableCell>
                            <TableCell align="right" style={{ color: 'red', }}>₱ {ccyFormat(invoiceTotal)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
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
                    onClick={finalizeOrder}
                    size="large" >
                    Next
                </Button>
                <br></br>
            </Box>
            <br></br>
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
                    <Button onClick={(e) => deleteOrderTransaction(deleteId, e)} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    )
}

export default AddProductOrderSupplierTransaction



