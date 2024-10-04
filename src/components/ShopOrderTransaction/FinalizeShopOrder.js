import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import ShopOrderService from "../OtherService/ShopOrderService";
import PaymentTypeService from "../OtherService/PaymentTypeService";
import ModeOfPaymentService from "../OtherService/ModeOfPaymentService";

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

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography'


import CircularProgress from '@mui/material/CircularProgress';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import UpdateIcon from '@mui/icons-material/Update';
import LinearProgress from '@mui/material/LinearProgress';

import { styled } from '@mui/material/styles';

const FinalizeShopOrder = () => {


    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPaymentType();
        fetchShopOrderTransaction(id);
        fetchShopOrderDTO(id);
        fetchPaymentTypeByShopTransactionId(id);

    }, []);

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitOpenModal, setSubmitOpenModal] = React.useState(false);
    const [errorStock, setErrorStock] = useState(false);

    const handleSubmitCloseModal = () => {
        setSubmitOpenModal(false);
    };

    const [paymentTypeList, setPaymentTypeList] = useState([]);

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
        shop_type_id: 0,
        shop_order_transaction_total_quantity: 0,
        shop_order_transaction_total_price: 0,
        requestor: 0,
        checker: 0,
        requestor_name: '',
        status: 0,
        checker_name: '',
        created_at: '',
        updated_at: ''
    });

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
        status: '',
        total_transaction_price: 0,
        order_date: '',
        created_at: '',
        updated_at: ''
    });

    const [modeOfPayment, setModeOfPayment] = useState({
        id: 0,
        payment_type_id: '',
        shop_order_transaction_id: 0,
        amount: 0,
        created_at: '',
        updated_at: ''
    });
    const [amount, setAmount] = useState(0);

    const [modeOfPaymentModal, setModeOfPaymentModal] = useState({
        id: 0,
        payment_type_id: '',
        shop_order_transaction_id: 0,
        amount: 0,
        created_at: '',
        updated_at: ''
    });



    const [orderShopDTO, setOrderShopDTO] = useState({
        shopOrderTransaction: {},
        shopOrderList: []
    });

    const [modeOfPaymentDTO, setModeOfPaymentDTO] = useState({
        data: [],
        code: ''
    });


    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });


    const [message, setMessage] = useState(false);

    const [open, setOpen] = React.useState(false);

    const [deleteOpenModal, setDeleteOpenModal] = React.useState(false);


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

    const fetchPaymentTypeByShopTransactionId = async (id) => {
        await ModeOfPaymentService.fetchPaymentTypeByShopTransactionId(id)
            .then(response => {
                setModeOfPaymentDTO(response.data);
                console.log('balance', response.data)
                setModeOfPayment({
                    ...modeOfPayment,
                    amount: response.data.balance,
                });

            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const updateShopOrderTransactionStatus = async (event) => {
        event.preventDefault();
        setSubmitLoading(true);
        setShopOrderTransaction({
            ...shopOrderTransaction,
            status: 1,
        });

        ShopOrderTransactionService.updateShopOrderTransactionStatus(shopOrderTransaction.id, shopOrderTransaction)
            .then(response => {
                setMessage(true);
                setSubmitLoading(false);
                if (shopOrderTransaction.shop_type_id == 3) {
                    navigate('/shopOrderTransaction/customerOrderTransactionList/');
                } else {
                    navigate('/shopOrderTransaction/shorOrderTransactionList/');
                }

            })
            .catch(e => {
                console.log(e);
            });
    }

    const savePaymentType = () => {
        const result = modeOfPaymentDTO.data.find(mop => mop.payment_type_id === modeOfPayment.payment_type_id);
        console.log('index:', result);
        if (modeOfPayment.payment_type_id == '') {
            setValidator({
                severity: 'error',
                message: 'Please Select choose Payment method!',
                isShow: true,
            });
        } else {
            // if (result == undefined) { 
            setSubmitLoadingAdd(true);
            ModeOfPaymentService.sanctum().then(response => {
                ModeOfPaymentService.create(modeOfPayment)
                    .then(response => {
                        fetchPaymentTypeByShopTransactionId(id);
                        setSubmitLoadingAdd(false);
                        setValidator({
                            severity: 'success',
                            message: 'Sucessfully added!',
                            isShow: true,
                        });
                    })
                    .catch(e => {
                        setSubmitLoadingAdd(false);
                        console.log(e);
                    });
            });
            // }
            //  else {
            //     setValidator({
            //         severity: 'error',
            //         message: 'Please Select other Payment method!',
            //         isShow: true,
            //     });

            // }
        }
    }

    const openSubmit = () => {
        setShopOrderTransaction({
            ...shopOrderTransaction,
            status: 1,
        });
        setSubmitOpenModal(true);
    }

    const fetchPaymentType = () => {
        PaymentTypeService.fetchEnablePaymentType()
            .then(response => {
                setPaymentTypeList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const handleInputChange = (e, value) => {
        e.persist();
        setModeOfPayment({
            ...modeOfPayment,
            shop_order_transaction_id: shopOrderTransaction.id,
            payment_type_id: value.id,
        });
    }



    const onChangeAmount = (e) => {
        console.log(e.target.value)
        setModeOfPayment({ ...modeOfPayment, amount: e.target.value });
        if (modeOfPaymentDTO.total_payment != 0) {
            if (Number(e.target.value) > modeOfPaymentDTO.balance) {
                setErrorStock(true);
            } else {
                setErrorStock(false);
            }
        }
    }



    const handleOpen = (id, e) => {
        console.log('e', id);
        fetchModeOfPayment(id);
        setOpen(true);
    }

    const fetchModeOfPayment = async (id) => {
        await ModeOfPaymentService.get(id)
            .then(response => {
                setModeOfPaymentModal(response.data);
                setAmount(response.data.amount)
                console.log(response.data)
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const handleClose = () => setOpen(false);

    const openDelete = () => {
        setDeleteOpenModal(true);
    }


    const handleDeleteCloseModal = () => {
        setDeleteOpenModal(false);
    };

    const deleteOrderTransaction = (deleteId, e) => {
        setSubmitLoading(true);
        console.log("test", modeOfPaymentModal);
        ModeOfPaymentService.delete(deleteId, modeOfPaymentModal)
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
                fetchPaymentTypeByShopTransactionId(id);
                // window.location.reload();
            })
            .catch(e => {
                console.log('error', e);
            });
    }

    const updateOrderSupplier = () => {
        setSubmitLoading(true);
        if (modeOfPaymentModal.amount > (modeOfPaymentDTO.balance + amount)) {
            setSubmitLoading(false);
            setOpen(false);
            window.scrollTo(0, 0);
            setValidator({
                severity: 'error',
                message: 'Must Less than to Balance',
                isShow: true,
            });

        } else {
            ModeOfPaymentService.update(modeOfPaymentModal.id, modeOfPaymentModal)
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
                        fetchPaymentTypeByShopTransactionId(id);
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
    }

    const onChangeInputPriceModal = (e) => {
        e.persist();
        setModeOfPaymentModal({
            ...modeOfPaymentModal,
            amount: e.target.value
        });

        // if (e.target.value > modeOfPaymentDTO.balance) {
        //     setSubmitLoading(false);
        //     setOpen(false);
        //     window.scrollTo(0, 0);
        //     setValidator({
        //         severity: 'error',
        //         message: 'Must Less than to Balance',
        //         isShow: true,
        //     });

        // }
    }


    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: "2rem",
        padding: theme.spacing(1),
    }));

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


    return (
        <div>

            {shopOrderTransaction.checker != 0 ? (
                <Div>{"Shop Branch Order"}</Div>)
                :
                (<Div>{"Online Order"}</Div>)
            }

            {message &&
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert variant="filled" severity="success">
                        Successfully Addded!
                    </Alert>
                </Stack>

            }

            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>
            <br></br>
            <Box
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <Stepper activeStep={2} alternativeLabel>
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
                                    <>    <TableCell style={{ fontWeight: 'bold' }}>Customer:</TableCell>
                                        <TableCell align="right">{shopOrderTransaction.requestor_name}</TableCell></>
                                }

                                <TableCell style={{ fontWeight: 'bold' }}>  Date:</TableCell>
                                <TableCell align="right">{shopOrderTransaction.created_at}</TableCell>

                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                {modeOfPaymentDTO.balance != 0 && shopOrderTransaction.checker == 0 &&


                    <Box
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    // onSubmit={saveOrderSupplier}
                    >
                        <FormControl variant="standard" >
                            <Autocomplete
                                // {...defaultProps}
                                options={paymentTypeList}
                                className="mb-3"
                                id="disable-close-on-select"
                                onChange={handleInputChange}
                                getOptionLabel={(paymentTypeList) => paymentTypeList.payment_type + " - " + paymentTypeList.payment_type_description}
                                renderInput={(params) => (
                                    <TextField {...params} label="Choose Payment Type" variant="standard" />
                                )}
                            />
                        </FormControl>
                        {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="text" value={modeOfPayment.amount} name="amount" placeholder="Enter Amount" onChange={onChangeAmount} />

                    </Form.Group> */}
                        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                            <InputLabel htmlFor="standard-adornment-amount">Enter Amount</InputLabel>
                            <Input
                                type='number'
                                id="filled-required"
                                label="amount"
                                variant="filled"
                                name='amount'
                                errorText='{this.state.password_error_text}'
                                max={modeOfPayment.amount}
                                // value={product.stock}
                                onChange={onChangeAmount}
                                value={modeOfPayment.amount}
                                // helperText="Incorrect entry."
                                error={errorStock}
                            />
                        </FormControl>

                        <Button
                            variant="contained"
                            disabled={errorStock}
                            onClick={savePaymentType}
                            size="large" >
                            Add
                        </Button>
                        <br></br>
                        <br></br>
                        {submitLoadingAdd &&
                            <LinearProgress color="warning" />
                        }
                    </Box>
                }
            </Box>

            <br></br>
            {shopOrderTransaction.checker == 0 &&
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }}>Mode of Payment</TableCell>
                                <TableCell align="right" style={{ fontWeight: 'bold' }}>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {modeOfPaymentDTO.data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.payment_type}{" - " + row.payment_type_description}</TableCell>
                                    <TableCell align="right">{row.amount}</TableCell>
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
                                <TableCell colSpan={1} style={{ fontWeight: 'bold', }}>Grand Total</TableCell>
                                <TableCell align="right" style={{ fontWeight: 'bold', }}>₱ {modeOfPaymentDTO.total_payment}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            }
            <br></br>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Product</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Qty.</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Unit</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Sum</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderShopDTO.shopOrderList.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.product_name}</TableCell>
                                <TableCell align="right">{row.shop_order_quantity}</TableCell>
                                <TableCell align="right">{row.shop_order_price}</TableCell>
                                <TableCell align="right">{row.shop_order_total_price}</TableCell>
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
            {/* <form onSubmit={ openSubmit} > */}
            <form >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {shopOrderTransaction.checker != 0 ? (
                        <Div>
                            <Button
                                variant="contained"
                                onClick={openSubmit}
                                size="large" >
                                Submit
                            </Button>
                        </Div>)
                        :
                        (<Div>
                            <Button
                                disabled={modeOfPaymentDTO.balance != 0}
                                variant="contained"
                                onClick={openSubmit}
                                size="large" >
                                Submit
                            </Button>
                        </Div>)
                    }

                </Box>
            </form>


            <Dialog
                open={submitOpenModal}
                onClose={handleSubmitCloseModal}
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
                        Update Product
                    </Typography>
                    {submitLoading &&
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </div>
                    }
                    <br></br>
                    <FormControl sx={{ m: 0, minWidth: 230, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Mode of Payment</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={modeOfPaymentModal.payment_type_id}
                            label="Customer"
                            name="customer_id"
                            onChange={handleInputChange}
                        >
                            {
                                paymentTypeList.map((payment, index) => (
                                    <MenuItem value={payment.id}>{payment.payment_type} {payment.payment_type_description}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
                        <Input
                            id="filled-required"
                            label="Amount"
                            variant="filled"
                            name='amount'
                            value={modeOfPaymentModal.amount}
                            onChange={onChangeInputPriceModal}
                            startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                        />
                    </FormControl>



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

export default FinalizeShopOrder



