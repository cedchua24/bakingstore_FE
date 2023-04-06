import React, { useState } from "react";

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
import Typography from '@mui/material/Typography';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

import CircularProgress from '@mui/material/CircularProgress';

import OrderCustomerService from "./OrderCustomerService.service";

const OrderCustomerTransactionTable = (props) => {

    const orderCustomerList = props.orderCustomerList;
    const orderCustomerDTO = props.orderCustomerDTO;

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


    const [deleteOpenModal, setDeleteOpenModal] = React.useState(false);

    const handleDeleteCloseModal = () => {
        setDeleteOpenModal(false);
    };



    const TAX_RATE = 0.12;

    function ccyFormat(num) {
        return `${num.toFixed(2)}`;
    }

    function subtotal(items) {
        return items.map(({ total_price }) => total_price).reduce((sum, i) => sum + i, 0);
    }

    const invoiceSubtotal = subtotal(orderCustomerList);
    const invoiceTaxes = TAX_RATE * invoiceSubtotal;
    const invoiceTotal = invoiceTaxes + invoiceSubtotal;

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
    const [submitLoading, setSubmitLoading] = useState(false);

    const handleOpen = (order, e) => {
        setOpen(true);
        console.log(order);
        setOrderCustomerModal(order);
    }

    const handleClose = () => setOpen(false);

    const [open2, setOpen2] = React.useState(false);


    const handleClose2 = () => {
        setOpen2(false);
    };

    const [open3, setOpen3] = React.useState(false);


    const deleteOrderCustomer = (id, e) => {
        console.log(id, 'id')
        props.deleteOrderCustomer(id);
    }

    const updateOrderCustomerList = () => {
        setOpen3(true);
    }

    const confirmUpdateTransaction = () => {
        props.updateOrderCustomerList(orderCustomerModal);
        setOpen3(false);
        setOpen(false);
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


    const saveCustomerTransaction = (e) => {
        e.preventDefault();
        setOpen2(true);
    }

    const confirmTransaction = () => {
        console.log('order', orderCustomerList)
        setSubmitLoading(true);
        OrderCustomerService.sanctum().then(response => {
            OrderCustomerService.saveCustomerTransaction((orderCustomerDTO))
                .then(response => {
                    setSubmitLoading(false);
                    setOpen2(false);
                    console.log('success', response);
                })
                .catch(e => {
                    console.log(e);
                });
        });

    }

    const openDelete = () => {
        setDeleteOpenModal(true);
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
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderCustomerList.map((row) => (
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
                                        <Button onClick={(e) => deleteOrderCustomer(row.id, e)} autoFocus>
                                            Agree
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </TableRow>
                        ))}


                    </TableBody>
                    <TableRow>
                        <TableCell rowSpan={3} />
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Tax</TableCell>
                        <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
                        <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>Grand Total</TableCell>
                        <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
                    </TableRow>
                </Table>
            </TableContainer>
            <br></br>
            <form onSubmit={saveCustomerTransaction} >
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
                        disabled={orderCustomerList.length === 0 ? true : false}
                        size="large" >
                        Next
                    </Button>
                </Box>
            </form>

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
            <div>
                <Dialog
                    open={open2}
                    onClose={handleClose2}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >

                    <DialogTitle id="alert-dialog-title">
                        {"Are you sure you want to Submit?"}
                    </DialogTitle>
                    {submitLoading &&
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </div>
                    }
                    <DialogActions>
                        <Button onClick={handleClose2}>Disagree</Button>
                        <Button onClick={confirmTransaction} autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div>
                <Dialog
                    open={open3}
                    onClose={handleClose2}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >

                    <DialogTitle id="alert-dialog-title">
                        {"Updated Successfully!"}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={confirmUpdateTransaction} >
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div >
    )
}

export default OrderCustomerTransactionTable
