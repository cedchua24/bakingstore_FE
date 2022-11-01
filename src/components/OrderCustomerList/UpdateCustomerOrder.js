import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import OrderCustomerListService from "./OrderCustomerListService.service";
import OrderCustomerService from "../OrderCustomerTransaction/OrderCustomerService.service";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import UpdateIcon from '@mui/icons-material/Update';

import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const UpdateCustomerOrder = () => {


    const { id } = useParams();

    useEffect(() => {
        fetchOrderCustomerTransaction(id);
        fetchOrderCustomerTransactionList(id);
    }, []);


    const TAX_RATE = 0.12;

    function ccyFormat(num) {
        return `${num.toFixed(2)}`;
    }

    const [invoiceSubtotal, setinvoiceSubtotal] = useState(0);
    const [invoiceTaxes, setinvoiceTaxes] = useState(0);
    const [invoiceTotal, setinvoiceTotal] = useState(0);


    const [orderCustomerTransaction, setOrderCustomerTransaction] = useState({
        id: 0,
        customer_id: '',
        total_transaction_price: 0,
        status: '',
        created_at: '',
        updated_at: ''
    });

    const [orderCustomerTransactionList, setOrderCustomerTransactionList] = useState([]);

    const [message, setMessage] = useState(false);


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

    const [orderCustomerModal, setOrderCustomerModal] = useState({
        id: 0,
        order_customer_transaction_id: 0,
        product_id: 0,
        product_name: '',
        price: 0,
        quantity: 0,
        total_price: 0,
        discount: 0
    });

    function subtotal(items) {
        return items.map(({ total_price }) => total_price).reduce((sum, i) => sum + i, 0);
    }


    const updateOrderCustomerList = () => {

        const index = orderCustomerTransactionList.findIndex(obj => {
            return obj.id === orderCustomerModal.id;
        });

        const newOrderCustomerTransactionList = [...orderCustomerTransactionList];
        newOrderCustomerTransactionList[index] = orderCustomerModal;
        setOrderCustomerTransactionList(newOrderCustomerTransactionList);

        OrderCustomerService.update(orderCustomerModal.id, orderCustomerModal)
            .then(response => {
                // setOrderCustomerTransactionList(response.data);  
                console.log('orderCustomerModal.id', orderCustomerModal.id);
                console.log('orderCustomerModal.id', orderCustomerModal.id);
                OrderCustomerListService.update(orderCustomerModal.order_customer_transaction_id, orderCustomerModal)
                    .then(response => {
                        fetchOrderCustomerTransaction(id);
                        fetchOrderCustomerTransactionList(id);
                    })
                    .catch(e => {
                        console.log("error", e)
                    });

            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const [open, setOpen] = React.useState(false);

    const handleOpen = (order, e) => {
        setOpen(true);
        console.log(order);
        setOrderCustomerModal(order);
    }

    const handleClose = () => setOpen(false);

    const deleteOrderCustomer = (idProduct) => {

        const index = orderCustomerTransactionList.findIndex(obj => obj.id === idProduct);
        const newOrderCustomer = [...orderCustomerTransactionList];
        newOrderCustomer.splice(index, 1);

        OrderCustomerService.delete(idProduct)
            .then(response => {
                setOrderCustomerTransactionList(newOrderCustomer);
                fetchOrderCustomerTransaction(id);
            })
            .catch(e => {
                console.log('error', e);
            });
    }


    const onChangeInputQuantityModal = (e) => {
        e.persist();
        setOrderCustomerModal({
            ...orderCustomerModal,
            quantity: e.target.value,
            total_price: orderCustomerModal.price * e.target.value
        });
    }

    const onChangeInputPriceModal = (e) => {
        e.persist();
        setOrderCustomerModal({
            ...orderCustomerModal,
            price: e.target.value,
            total_price: e.target.value * orderCustomerModal.quantity
        });
    }


    const fetchOrderCustomerTransaction = async (id) => {
        await OrderCustomerListService.get(id)
            .then(response => {
                // setOrderCustomerTransactionList(response.data);
                setinvoiceSubtotal(response.data.total_transaction_price - TAX_RATE * response.data.total_transaction_price);
                setinvoiceTaxes(TAX_RATE * response.data.total_transaction_price);
                setinvoiceTotal(response.data.total_transaction_price);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchOrderCustomerTransactionList = async (id) => {
        await OrderCustomerService.findById(id)
            .then(response => {
                setOrderCustomerTransactionList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }



    return (
        <div>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderCustomerTransactionList.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.product_name}</TableCell>
                                <TableCell align="right">{row.quantity}</TableCell>
                                <TableCell align="right">{row.price}</TableCell>
                                <TableCell align="right">{row.total_price}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Update">
                                        <IconButton>
                                            <UpdateIcon color="primary" onClick={(e) => handleOpen(row, e)} />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Delete">
                                        <IconButton>
                                            <DeleteIcon color="error" onClick={(e) => deleteOrderCustomer(row.id, e)} />
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
                            <TableCell colSpan={2}>Grand Total: </TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold', }}>₱ {ccyFormat(invoiceTotal)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

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
                        value={orderCustomerModal.product_name}
                    />

                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Price</InputLabel>
                        <Input
                            id="filled-required"
                            label="=Price"
                            variant="filled"
                            name='price'
                            value={orderCustomerModal.price}
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
                            value={orderCustomerModal.quantity}
                            onChange={onChangeInputQuantityModal}
                        />
                    </FormControl>

                    <TextField
                        disabled
                        id="filled-required"
                        label="Total Price"
                        variant="filled"
                        name='total_price'
                        // startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                        value={'₱ ' + orderCustomerModal.total_price}
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
                            onClick={updateOrderCustomerList}
                            size="large" >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal >
        </div >
    )
}

export default UpdateCustomerOrder



