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


const AddProductShopOrderTransaction = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchShopOrderTransaction(id);
        fetchShopOrder(id);
        fetchProductList();
        fetchShopOrderDTO(id);
    }, []);


    const [products, setProducts] = useState([]);
    const [value, setValue] = useState(products[0])

    const [orderShop, setOrderShop] = useState({
        id: 0,
        shop_transaction_id: id,
        branch_stock_transaction_id: 0,
        product_id: 0,
        shop_order_quantity: 0,
        shop_order_price: 0,
        shop_order_total_price: 0,
        created_at: ''
    });

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        id: 0,
        shop_id: 0,
        shop_order_transaction_total_quantity: 0,
        shop_order_transaction_total_price: 0,
        requestor: 0,
        checker: 0,
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
        product_name: '',
        shop_order_price: 0,
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


    const onChangeInput = (e) => {
        e.persist();
        console.log(e.target.name)
        setOrderShop({ ...orderShop, [e.target.name]: e.target.value });
    }

    const onChangeQuantity = (e) => {
        setOrderShop({
            ...orderShop,
            shop_transaction_id: id,
            shop_order_quantity: e.target.value,
            shop_order_total_price: Number(orderShop.shop_order_price) * Number(e.target.value)
        });
    }


    const onChangeInputQuantityModal = (e) => {
        e.persist();
        setOrderSupplierModal({
            ...orderSupplierModal,
            shop_order_quantity: e.target.value,
            shop_order_total_price: orderSupplierModal.shop_order_price * e.target.value
        });
    }

    const onChangeInputPriceModal = (e) => {
        e.persist();
        setOrderSupplierModal({
            ...orderSupplierModal,
            shop_order_price: e.target.value,
            shop_order_total_price: e.target.value * orderSupplierModal.shop_order_quantity
        });
    }

    const handleInputChange = (e, value) => {
        e.persist();
        console.log(value)
        setOrderShop({
            ...orderShop,
            shop_transaction_id: id,
            branch_stock_transaction_id: value.branch_stock_transaction_id,
            shop_order_price: value.new_price,
            product_id: value.product_id,
            shop_order_total_price: Number(value.new_price) * Number(orderShop.shop_order_quantity)
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


    const saveOrderSupplier = (event) => {
        event.preventDefault();
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
                    // fetchProductList();
                    window.location.reload();
                })
                .catch(e => {
                    console.log(e);
                });
        });
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


    const deleteOrderTransaction = (id, e) => {
        ShopOrderService.delete(id, orderSupplierModal)
            .then(response => {
                window.location.reload();
            })
            .catch(e => {
                console.log('error', e);
            });
    }

    const updateOrderSupplier = () => {
        ShopOrderService.update(orderSupplierModal.id, orderSupplierModal)
            .then(response => {
                window.location.reload();
                // fetchShopOrder(id);
                // updateOrderTransaction();
            })
            .catch(e => {
                console.log(e);
            });
    }

    const finalizeOrder = () => {
        navigate('/shopOrderTransaction/finalizeShopOrder/' + id);
    }



    return (
        <div>
            {message &&
                // <Alert variant="success" dismissible>
                //     <Alert.Heading>Successfully Updated!</Alert.Heading>
                //     <p>
                //         Change this and that and try again. Duis mollis, est non commodo
                //         luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
                //         Cras mattis consectetur purus sit amet fermentum.
                //     </p>
                // </Alert>
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert variant="filled" severity="success">
                        Successfully Addded!
                    </Alert>
                </Stack>

            }
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
                    id="filled-disabled"
                    variant="filled"
                    label="Shop"
                    value={shopOrderTransaction.shop_name}
                    disabled
                />
                <TextField
                    id="outlined-disabled"
                    variant="filled"
                    label="Checker"
                    value={shopOrderTransaction.checker_name}
                    disabled
                />
                <TextField
                    id="outlined-disabled"
                    variant="filled"
                    label="Requestor"
                    value={shopOrderTransaction.requestor_name}
                    disabled
                />
                <TextField
                    id="outlined-disabled"
                    variant="filled"
                    label="Date"
                    value={shopOrderTransaction.created_at}
                    disabled
                />

                <br></br>
                <br></br>

                <form onSubmit={saveOrderSupplier} >

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
                            name='shop_order_price'
                            value={orderShop.shop_order_price}
                            onChange={onChangeInput}
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
                                            <DeleteIcon color="error" onClick={(e) => deleteOrderTransaction(row.id, e)} />
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
        </div >
    )
}

export default AddProductShopOrderTransaction



