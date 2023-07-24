import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CustomerOrderTransactionService from "./CustomerOrderTransactionService";
import ShopOrderService from "../OtherService/ShopOrderService";
import MarkUpPriceService from "../MarkUpPrice/MarkUpPriceService.service";

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

import CircularProgress from '@mui/material/CircularProgress';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const AddProductCustomerOrderTransaction = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomerOrderTransaction(id);
        fetchShopOrder(id);
        fetchProductList();
        fetchShopOrderDTO(id);
    }, []);

    const [deleteOpenModal, setDeleteOpenModal] = React.useState(false);

    const handleDeleteCloseModal = () => {
        setDeleteOpenModal(false);
    };


    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [submitLoading, setSubmitLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [value, setValue] = useState(products[0])

    const [orderCustomer, setOrderCustomer] = useState({
        id: 0,
        order_customer_transaction_id: id,
        mark_up_id: 0,
        product_id: 0,
        quantity: 0,
        total_price: 0,
        discount: 0,
        created_at: ''
    });

    const [customerOrderTransaction, setCustomerOrderTransaction] = useState({
        id: 0,
        customer_id: 0,
        total_transaction_price: 0,
        status: 0,
        created_at: '',
        updated_at: ''
    });

    const [orderCustomerDTO, setOrderCustomerDTO] = useState({
        customerOrderTransaction: {},
        shopOrderList: []
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
        fetchShopOrder(id);
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

    const [message, setMessage] = useState(false);


    function inputValidation() {
        console.log('orderCustomer', orderCustomer);
        const product = products.find(product => product.product_id === orderCustomer.product_id);
        if (orderCustomer.product_id == 0) {
            setValidator({
                severity: 'warning',
                message: 'Please choose Product',
                isShow: true,
            });
        } else
            if (orderCustomer.quantity === 0) {
                setValidator({
                    severity: 'warning',
                    message: 'Please insert Quantity',
                    isShow: true,
                });
            } else if (orderCustomer.quantity > product.stock) {
                setValidator({
                    severity: 'error',
                    message: 'Quantity is more than to Stock',
                    isShow: true,
                });
            }
            else {
                setValidator({
                    severity: '',
                    message: '',
                    isShow: false,
                });

                const index = orderCustomerDTO.shopOrderList.filter(obj => {
                    return obj.product_id === orderCustomer.product_id;
                });
                console.log('orderCustomer', orderCustomer);
                console.log('orderCustomerDTO', orderCustomerDTO);
                if (index.length === 0) {
                    setValidator({
                        severity: 'success',
                        message: 'Successfuly Added!',
                        isShow: true,
                    });
                    // setorderCustomerList([...orderCustomerList, orderCustomer]);
                    // let arr = orderCustomerList.concat(orderCustomer);
                    // setorderCustomerDTO({ orderCustomerList: arr, grandTotal: subtotal(arr) });
                    // setValue(products[1]);

                    ShopOrderService.sanctum().then(response => {
                        ShopOrderService.create(orderCustomer)
                            .then(response => {
                                fetchShopOrder(id);
                                setOrderCustomer({
                                    order_customer_transaction_id: id,
                                    product_id: 0,
                                    price: 0,
                                    quantity: 0,
                                    total_price: 0,
                                });
                                fetchShopOrderDTO(id);
                                // fetchProductList();
                                // window.location.reload();
                            })
                            .catch(e => {
                                console.log(e);
                            });
                    });

                } else {
                    setValidator({
                        severity: 'error',
                        message: 'Product already exists!',
                        isShow: true,
                    });
                }
            }
        window.scrollTo(0, 0);
    }


    const onChangeInput = (e) => {
        e.persist();
        console.log(e.target.name)
        setOrderCustomer({ ...orderCustomer, [e.target.name]: e.target.value });
    }

    const onChangeQuantity = (e) => {
        setOrderCustomer({
            ...orderCustomer,
            order_customer_transaction_id: id,
            quantity: e.target.value,
            total_price: Number(orderCustomer.price) * Number(e.target.value)
        });
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
        e.persist();
        console.log(value)
        setOrderCustomer({
            ...orderCustomer,
            order_customer_transaction_id: id,
            branch_stock_transaction_id: value.branch_stock_transaction_id,
            price: value.new_price,
            product_id: value.product_id,
            total_price: Number(value.new_price) * Number(orderCustomer.quantity)
        });
    }

    const fetchProductList = () => {
        MarkUpPriceService.getAll()
            .then(response => {
                setProducts(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchCustomerOrderTransaction = async (id) => {
        console.log('test')
        await CustomerOrderTransactionService.fetchCustomerOrderTransaction(id)
            .then(response => {
                console.log('fetchCustomerOrderTransaction', response.data)
                setCustomerOrderTransaction(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchShopOrder = async (id) => {
        await ShopOrderService.fetchShopOrder(id)
            .then(response => {
                setOrderSupplierModal(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchShopOrderDTO = async (id) => {
        await ShopOrderService.fetchShopOrderDTO(id)
            .then(response => {
                setOrderCustomerDTO(response.data);
                setinvoiceSubtotal(response.data.customerOrderTransaction.shop_order_transaction_total_price - TAX_RATE * response.data.customerOrderTransaction.shop_order_transaction_total_price);
                setinvoiceTaxes(TAX_RATE * response.data.customerOrderTransaction.shop_order_transaction_total_price);
                setinvoiceTotal(response.data.customerOrderTransaction.shop_order_transaction_total_price);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const saveCustomerSupplier = (event) => {
        event.preventDefault();
        inputValidation();
    }




    const updateOrderTransaction = () => {

        CustomerOrderTransactionService.update(id, customerOrderTransaction)
            .then(response => {
                setMessage(true);
                fetchCustomerOrderTransaction(id);
            })
            .catch(e => {
                console.log(e);
            });
    }


    const deleteOrderTransaction = (deleteId, e) => {
        setSubmitLoading(true);
        ShopOrderService.delete(deleteId, orderSupplierModal)
            .then(response => {
                setSubmitLoading(false);
                setOpen(false);
                setDeleteOpenModal(false);
                window.scrollTo(0, 0);
                setValidator({
                    severity: 'success',
                    message: 'Successfuly Deleted!',
                    isShow: true,
                });
                fetchShopOrderDTO(id);
                // window.location.reload();
            })
            .catch(e => {
                console.log('error', e);
            });
    }




    const openDelete = () => {
        setDeleteOpenModal(true);
    }

    const updateOrderSupplier = () => {
        setSubmitLoading(true);
        ShopOrderService.update(orderSupplierModal.id, orderSupplierModal)
            .then(response => {
                console.log(response.data);
                if (response.data.code == 200) {
                    setSubmitLoading(false);
                    setOpen(false);
                    window.scrollTo(0, 0);
                    setValidator({
                        severity: 'success',
                        message: 'Successfuly Added!',
                        isShow: true,
                    });
                    fetchShopOrderDTO(id);
                } else if (response.data.code == 400) {
                    setSubmitLoading(false);
                    setOpen(false);
                    window.scrollTo(0, 0);
                    setValidator({
                        severity: 'error',
                        message: response.data.message,
                        isShow: true,
                    });
                } else {
                    setSubmitLoading(false);
                    setOpen(false);
                    setValidator({
                        severity: 'error',
                        message: "Unknown Error",
                        isShow: true,
                    });
                }
            })
            .catch(e => {
                console.log(e);
            });
    }

    const finalizeOrder = () => {
        navigate('/customerOrderTransaction/finalizeShopOrder/' + id);
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
                    '& .MuiTextField-root': { m: 1 },
                }}
                noValidate
                autoComplete="off">
                <Stepper activeStep={1} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>


                        </Step>
                    ))}
                </Stepper>
                <br></br>
                <TextField
                    id="outlined-disabled"
                    variant="filled"
                    label="Customer"
                    value={customerOrderTransaction.first_name}
                    disabled
                />
                <TextField
                    id="outlined-disabled"
                    variant="filled"
                    label="Date"
                    value={customerOrderTransaction.created_at}
                    disabled
                />

                <br></br>
                <br></br>

                <form onSubmit={saveCustomerSupplier} >

                    <FormControl variant="standard"  >
                        <Autocomplete
                            sx={{
                                width: 500
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
                            getOptionLabel={(products) => products.product_name + ' - ' + (products.weight) + 'kg' + ' (₱' + (products.new_price) + ')' + ' | Stocks - ' + (products.stock)}
                            renderInput={(params) => (
                                <TextField {...params} label='Choose Product' variant="standard" />
                            )}
                        />
                    </FormControl>

                    <br></br>

                    <FormControl variant="standard" >
                        <InputLabel htmlFor="standard-adornment-amount">Price</InputLabel>
                        <Input
                            type='number'
                            className="mb-3"
                            id="filled-required"
                            label="Price"
                            variant="filled"
                            name='price'
                            value={orderCustomer.price}
                            onChange={onChangeInput}
                            startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                            disabled={orderCustomer.product_id === 0 ? true : false}
                        />
                    </FormControl>
                    <br></br>
                    <FormControl variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Quantity</InputLabel>
                        <Input
                            type='number'
                            className="mb-3"
                            id="filled-required"
                            label="Quantity"
                            variant="filled"
                            name='quantity'
                            value={orderCustomer.quantity}
                            onChange={onChangeQuantity}
                            disabled={orderCustomer.product_id === 0 ? true : false}
                        />
                    </FormControl>
                    <br></br>
                    <FormControl variant="standard" >
                        <InputLabel htmlFor="standard-adornment-amount">Total Price</InputLabel>
                        <Input
                            className="mb-3"
                            id="filled-required"
                            label="Total Price"
                            variant="filled"
                            name='total_price'
                            value={orderCustomer.total_price}
                            onChange={onChangeInput}
                            startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                            disabled
                        />
                    </FormControl>
                    <br></br>

                    <div>
                        <Button
                            variant="contained"
                            type="submit"
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
                        {orderCustomerDTO.shopOrderList.map((row) => (
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
                                            <DeleteIcon color="error" onClick={(e) => openDelete()} />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>

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
                                        <Button onClick={(e) => deleteOrderTransaction(row.id, e)} autoFocus>
                                            Agree
                                        </Button>
                                    </DialogActions>
                                </Dialog>
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
                            <TableCell colSpan={2} style={{ fontWeight: 'bold', }}>Grand Total</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold', }}>₱ {ccyFormat(invoiceTotal)}</TableCell>
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
                    disabled={orderCustomerDTO.shopOrderList.length === 0 ? true : false}
                    size="large" >
                    Next
                </Button>
            </Box>

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
                    {submitLoading &&
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

        </div >
    )
}

export default AddProductCustomerOrderTransaction



