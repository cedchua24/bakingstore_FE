import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import ShopOrderTransactionService from "./ShopOrderTransactionService";
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
import LinearProgress from '@mui/material/LinearProgress';


import { styled } from '@mui/material/styles';

const AddProductCustomerOrderTransaction = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchShopOrderTransaction(id);
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

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const [submitLoading, setSubmitLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [value, setValue] = useState(products[0])
    const [deleteId, setDeleteId] = useState(0)

    const [stock, setStock] = useState(0);


    const [orderShop, setOrderShop] = useState({
        id: 0,
        shop_transaction_id: id,
        branch_stock_transaction_id: 0,
        mark_up_product_id: 0,
        shop_order_profit: 0,
        order_profit: 0,
        product_id: 0,
        shop_order_quantity: 0,
        shop_order_price: 0,
        business_type: '',
        stock: 0,
        shop_order_total_price: 0,
        created_at: ''
    });

    const [origPrice, setOrigPrice] = useState(0);
    const [profit, setProfit] = useState(0);

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        id: 0,
        shop_id: 0,
        shop_order_transaction_total_quantity: 0,
        shop_order_transaction_total_price: 0,
        profit: 0,
        requestor: 0,
        checker: 0,
        date: '',
        requestor_name: '',
        checker_name: '',
        created_at: '',
        updated_at: ''
    });

    const [orderShopDTO, setOrderShopDTO] = useState({
        shopOrderTransaction: {},
        shopOrderList: []
    });

    const [orderSupplierModal, setOrderSupplierModal] = useState({
        id: 0,
        order_supplier_transaction_id: id,
        product_id: 0,
        mark_up_product_id: 0,
        business_type: '',
        product_name: '',
        shop_order_price: 0,
        shop_order_profit: 0,
        shop_order_quantity: 0,
        shop_order_total_price: 0
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
        console.log('orderShop', orderShop);

        if (orderShop.product_id == 0) {
            setValidator({
                severity: 'warning',
                message: 'Please choose Product',
                isShow: true,
            });

        } else
            if (orderShop.shop_order_quantity === 0) {
                setValidator({
                    severity: 'warning',
                    message: 'Please insert Quantity',
                    isShow: true,
                });
            } else if (orderShop.shop_order_quantity > orderShop.stock) {
                setValidator({
                    severity: 'error',
                    message: 'Quantity is more than to Stocks',
                    isShow: true,
                });
            } else if (orderShop.shop_order_profit < 1) {
                setValidator({
                    severity: 'error',
                    message: 'Price is less than to Capital',
                    isShow: true,
                });
            }
            else {
                setValidator({
                    severity: '',
                    message: '',
                    isShow: false,
                });

                const index = orderShopDTO.shopOrderList.filter(obj => {
                    return obj.mark_up_product_id === orderShop.mark_up_product_id;
                });
                console.log('orderShop', orderShop);
                console.log('orderShopDTO', orderShopDTO);
                console.log('index', index);
                if (index.length === 0) {
                    setSubmitLoadingAdd(true);
                    setIsAddDisabled(true);


                    ShopOrderService.sanctum().then(response => {
                        ShopOrderService.create(orderShop)
                            .then(response => {
                                fetchShopOrder(id);
                                setOrderShop({
                                    shop_transaction_id: id,
                                    product_id: 0,
                                    shop_order_price: 0,
                                    shop_order_quantity: 0,
                                    shop_order_total_price: 0,
                                });
                                fetchShopOrderDTO(id);
                                setSubmitLoadingAdd(false);
                                setIsAddDisabled(false);
                                setValidator({
                                    severity: 'success',
                                    message: 'Successfuly Added!',
                                    isShow: true,
                                });
                                // fetchProductList();
                                // window.location.reload();
                            })
                            .catch(e => {
                                setSubmitLoadingAdd(false);
                                setIsAddDisabled(false);
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
        setOrderShop({
            ...orderShop,
            [e.target.name]: e.target.value,
        });
    }

    const onChangePrice = (e) => {
        e.persist();
        console.log(e.target.name)
        console.log(computeProfit(e.target.value))
        setOrderShop({
            ...orderShop,
            shop_transaction_id: id,
            shop_order_price: e.target.value,
            shop_order_profit: computeProfit(e.target.value) * Number(orderShop.shop_order_quantity),
            shop_order_total_price: e.target.value * Number(orderShop.shop_order_quantity)
        });
    }

    const computeProfit = ($newPrice) => {
        console.log('origPrice', origPrice);
        console.log('newPrice', $newPrice);
        console.log('profit', profit);
        const $diffPrice = origPrice - $newPrice;
        console.log('total:', profit - $diffPrice);
        return profit - $diffPrice

    }

    const onChangeQuantity = (e) => {
        setOrderShop({
            ...orderShop,
            shop_transaction_id: id,
            shop_order_quantity: e.target.value,
            shop_order_profit: computeProfit(Number(orderShop.shop_order_price)) * Number(e.target.value),
            shop_order_total_price: Number(orderShop.shop_order_price) * Number(e.target.value)
        });
    }


    const onChangeInputQuantityModal = (e) => {
        e.persist();
        setOrderSupplierModal({
            ...orderSupplierModal,
            shop_order_quantity: e.target.value,
            shop_order_profit: computeProfit(Number(orderSupplierModal.shop_order_price)) * Number(e.target.value),
            shop_order_total_price: orderSupplierModal.shop_order_price * e.target.value
        });
    }

    // const onChangeInputPriceModal = (e) => {
    //     e.persist();
    //     setOrderSupplierModal({
    //         ...orderSupplierModal,
    //         shop_order_price: e.target.value,
    //         shop_order_total_price: e.target.value * orderSupplierModal.shop_order_quantity
    //     });
    // }

    const onChangeInputPriceModal = (e) => {
        e.persist();
        console.log(computeProfit(e.target.value))
        setOrderSupplierModal({
            ...orderSupplierModal,
            shop_order_price: e.target.value,
            shop_order_profit: computeProfit(e.target.value) * Number(orderSupplierModal.shop_order_quantity),
            shop_order_total_price: e.target.value * Number(orderSupplierModal.shop_order_quantity)
        });
    }

    const handleInputChange = (e, value) => {
        e.persist();
        console.log('eym', value)
        if (orderShop.business_type === 'WHOLESALE') {
            setStock(value.stock);
        } else {
            setStock(value.stock_pc);
        }
        setOrderShop({
            ...orderShop,
            shop_transaction_id: id,
            branch_stock_transaction_id: value.branch_stock_transaction_id,
            shop_order_price: value.new_price,
            mark_up_product_id: value.id,
            order_profit: value.profit,
            product_id: value.product_id,
            stock: value.stock,
            business_type: value.business_type,
            shop_order_total_price: Number(value.new_price) * Number(orderShop.shop_order_quantity)
        });
        setOrigPrice(value.new_price)
        setProfit(value.profit)
    }

    const fetchProductList = () => {
        MarkUpPriceService.getAll()
            .then(response => {
                console.log("prodcut", response.data)
                setProducts(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchShopOrderTransaction = async (id) => {
        console.log('test')
        await ShopOrderTransactionService.fetchShopOrderTransaction(id)
            .then(response => {
                console.log('fetchShopOrderTransaction', response.data)
                setShopOrderTransaction(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchShopOrder = async (id) => {
        await ShopOrderService.fetchShopOrder(id)
            .then(response => {
                setOrderSupplierModal(response.data);
                console.log(response.data)
                setOrigPrice(response.data.shop_order_price);
                setProfit(response.data.shop_order_profit / response.data.shop_order_quantity)
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchShopOrderDTO = async (id) => {
        await ShopOrderService.fetchShopOrderDTO(id)
            .then(response => {
                setOrderShopDTO(response.data);
                setinvoiceSubtotal(response.data.shopOrderTransaction.shop_order_transaction_total_price - TAX_RATE * response.data.shopOrderTransaction.shop_order_transaction_total_price);
                setinvoiceTaxes(TAX_RATE * response.data.shopOrderTransaction.shop_order_transaction_total_price);
                setinvoiceTotal(response.data.shopOrderTransaction.shop_order_transaction_total_price);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const saveCustomerOrder = (event) => {
        event.preventDefault();
        inputValidation();
    }




    const updateOrderTransaction = () => {

        ShopOrderTransactionService.update(id, shopOrderTransaction)
            .then(response => {
                setMessage(true);
                fetchShopOrderTransaction(id);
            })
            .catch(e => {
                console.log(e);
            });
    }


    const deleteOrderTransaction = (deleteId, e) => {
        setSubmitLoading(true);
        console.log("test", orderSupplierModal);
        console.log("deleteId", deleteId);
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




    const openDelete = (id) => {
        console.log('delete', id);
        setDeleteId(id)
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
        navigate('/shopOrderTransaction/finalizeShopOrder/' + id);
    }


    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: "2rem",
        padding: theme.spacing(1),
    }));

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });


    return (
        <div>
            {shopOrderTransaction.checker != 0 ? (
                <Div>{"Shop Branch Order"}</Div>)
                :
                (<Div>{"Online Order"}</Div>)
            }

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
                <TableContainer component={Paper}>

                    <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                        <TableBody>
                            <TableRow >
                                <TableCell style={{ fontWeight: 'bold' }}>Shop Name:</TableCell>
                                <TableCell align="right">{shopOrderTransaction.shop_name}</TableCell>

                                {shopOrderTransaction.checker != 0 ?
                                    <>
                                        <TableCell align="right" >Checker</TableCell>
                                        <TableCell align="right">{shopOrderTransaction.checker_name}</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Requestor:</TableCell>
                                        <TableCell align="right">{shopOrderTransaction.requestor_name}</TableCell></>
                                    :
                                    <>  <TableCell style={{ fontWeight: 'bold' }}>Customer:</TableCell>
                                        <TableCell align="right">{shopOrderTransaction.requestor_name}</TableCell></>
                                }

                                <TableCell style={{ fontWeight: 'bold' }}>  Date:</TableCell>
                                <TableCell align="right">{shopOrderTransaction.created_at}</TableCell>

                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <br></br>

                <form onSubmit={saveCustomerOrder} >

                    <FormControl variant="standard"  >
                        <Autocomplete
                            sx={{
                                width: 500
                            }}
                            // options={products}
                            options={products.sort((a, b) =>
                                b.category_name.toString().localeCompare(a.category_name.toString())
                            )}
                            getOptionDisabled={(products) =>
                                products.stock < 1
                            }

                            value={value}
                            className="mb-3"
                            id="disable-close-on-select"
                            onChange={handleInputChange}
                            groupBy={(products) => products.category_name}
                            getOptionLabel={(products) => products.product_name + (products.business_type === 'WHOLESALE' ? " " + products.packaging : '') + ' - ' + (products.business_type === 'WHOLESALE' ? (" ") + products.weight : (products.weight / products.quantity)) + products.variation + ' (₱' + (products.new_price) + ')' + ' | Stocks - ' + products.stock}

                            renderInput={(params) => (
                                <TextField
                                    {...params} label='Choose Product' variant="standard" />
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
                            name='shop_order_price'
                            value={orderShop.shop_order_price}
                            // onChange={onChangeInput}
                            onChange={onChangePrice}
                            startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                            disabled={orderShop.product_id === 0 ? true : false}
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
                            name='shop_order_quantity'
                            value={orderShop.shop_order_quantity}
                            onChange={onChangeQuantity}
                            disabled={orderShop.product_id === 0 ? true : false}
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
                            name='shop_order_total_price'
                            value={orderShop.shop_order_total_price}
                            onChange={onChangeInput}
                            startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                            disabled
                        />
                    </FormControl>
                    <br></br>
                    {submitLoadingAdd &&
                        <LinearProgress color="warning" />
                    }
                    {/* <LinearProgress color="secondary" /> */}
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
                            <TableCell style={{ fontWeight: 'bold' }}>Product</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Qty.</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Unit</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Sum</TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderShopDTO.shopOrderList.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.product_name}</TableCell>
                                <TableCell align="right">{row.shop_order_quantity}</TableCell>
                                <TableCell align="right">{row.shop_order_price}</TableCell>
                                <TableCell align="right">{row.shop_order_total_price}</TableCell>
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
                    disabled={orderShopDTO.shopOrderList.length === 0 ? true : false}
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
                            name='shop_order_price'
                            value={orderSupplierModal.shop_order_price}
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
                            value={orderSupplierModal.shop_order_quantity}
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
                        value={'₱ ' + orderSupplierModal.shop_order_total_price}
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
            <div>
                <br></br>
                <h6> {shopOrderTransaction.requestor_name} </h6>
                <br></br>
                {orderShopDTO.shopOrderList.map((row) => (
                    <>
                        <h6>{row.shop_order_quantity} x {row.shop_order_price} -
                            &nbsp;{row.product_name} {
                                row.business_type === 'WHOLESALE' ? <>{row.packaging} ({row.weight / row.quantity}{row.variation}) x {row.quantity}</>
                                    : < >({row.weight / row.quantity}{row.variation})</>
                            }

                            <> = </>{row.shop_order_total_price}</h6>

                    </>

                ))
                }
                <br></br>
                <h6>Total: ₱ {orderShopDTO.shopOrderTransaction.shop_order_transaction_total_price} </h6>

            </div>

        </div >
    )
}

export default AddProductCustomerOrderTransaction



