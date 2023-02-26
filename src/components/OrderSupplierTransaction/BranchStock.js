import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import WarehouseService from "../Warehouse/WarehouseService";
import OrderSupplierService from "./OrderSupplierService.service";
import BranchStockService from "./BranchStockService.";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'
import UpdateIcon from '@mui/icons-material/Update';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';

import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';

import CircularProgress from '@mui/material/CircularProgress';

const BranchStock = () => {

    const { id } = useParams();
    const [warehouseList, setWarehouseList] = useState([]);

    useEffect(() => {
        fetchByOrderSupplierId(id);
        fetchWarehouseList();
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


    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [submitLoading, setSubmitLoading] = useState(false);
    const [orderList, setOrderList] = useState([]);

    const [branchStock, setBranchStock] = useState({
        warehouse_id: 0,
        product_id: 0,
        branch_stock: 0,
        order_supplier_id: 0,
        status: 1,
    });

    const [orderSupplierModal, setOrderSupplierModal] = useState({
        id: 0,
        order_supplier_transaction_id: id,
        product_id: 0,
        product_name: '',
        price: 0,
        quantity: 0,
        stock_remaining: 0,
        placed_stock: 0,
        new_stock_remaining: 0
    });

    const onChangeWarehouse = (e, value) => {
        console.log(value.id);
        e.persist();

        setBranchStock({
            ...branchStock,
            warehouse_id: value.id,
            status: 1,
        });
    }

    const onChangeStock = (e,) => {
        setOrderSupplierModal({
            ...orderSupplierModal,
            placed_stock: e.target.value,
            new_stock_remaining: Number(orderSupplierModal.quantity) - Number(e.target.value)
        });

        setBranchStock({
            ...branchStock,
            branch_stock: e.target.value,
            status: 1,
        });
    }

    const fetchWarehouseList = () => {
        WarehouseService.getAll()
            .then(response => {
                setWarehouseList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const saveBranchStock = (event) => {
        event.preventDefault();
        console.log('save', branchStock);

        if (branchStock.warehouse_id === 0) {
            setValidator({
                severity: 'warning',
                message: 'Please select Warehouse',
                isShow: true,
            });
        } else if (branchStock.branch_stock > orderSupplierModal.stock_remaining) {
            setValidator({
                severity: 'error',
                message: 'Please input not more in stock remaining',
                isShow: true,
            });
        } else {
            setSubmitLoading(true);
            BranchStockService.sanctum().then(response => {
                BranchStockService.create(branchStock)
                    .then(response => {
                        if (response.data.code === 200) {
                            setOpen(false);
                            fetchByOrderSupplierId(id);
                            setValidator({
                                severity: 'success',
                                message: 'Successfuly Updated!',
                                isShow: true,
                            });
                            setSubmitLoading(false);
                        } else {

                        }

                    })
                    .catch(e => {
                        console.log(e);
                    });
            });

        }

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
                setBranchStock({
                    ...branchStock,
                    order_supplier_id: response.data.id,
                    product_id: response.data.product_id,
                    branch_stock: response.data.stock_remaining,
                });

                setOrderSupplierModal({
                    id: response.data.id,
                    order_supplier_transaction_id: response.data.order_supplier_transaction_id,
                    price: response.data.price,
                    product_id: response.data.product_id,
                    product_name: response.data.product_name,
                    quantity: response.data.quantity,
                    stock_remaining: response.data.stock_remaining,
                    total_price: response.data.total_price,
                    placed_stock: response.data.stock_remaining
                });
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    return (
        <div>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>

            <br></br>


            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" colSpan={3}>
                                Details
                            </TableCell>
                            <TableCell align="center" ></TableCell>
                            <TableCell align="center" colSpan={2}>Action</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Total Quantity</TableCell>
                            <TableCell align="right">Placed Stock</TableCell>
                            <TableCell align="right">Stock Remaining</TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderList.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.product_name}</TableCell>
                                <TableCell align="right">{row.quantity}</TableCell>
                                <TableCell align="right">{row.quantity - row.stock_remaining}</TableCell>
                                <TableCell align="right">{row.stock_remaining}</TableCell>
                                <TableCell align="right">
                                    {row.stock_remaining > 0 &&
                                        <Tooltip title="Update">
                                            <IconButton>
                                                <UpdateIcon color="primary" onClick={(e) => handleOpen(row.id, e)} />
                                            </IconButton>
                                        </Tooltip>
                                    }

                                </TableCell>
                            </TableRow>
                        ))}


                    </TableBody>
                </Table>
            </TableContainer>
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

                    <TextField
                        disabled
                        id="filled-required"
                        label="Total Quantity"
                        variant="filled"
                        name='quantity'
                        value={orderSupplierModal.stock_remaining}
                    />


                    <FormControl variant="standard" >
                        <Autocomplete
                            // {...defaultProps}
                            options={warehouseList}
                            className="mb-3"
                            id="disable-close-on-select"
                            onChange={onChangeWarehouse}
                            getOptionLabel={(warehouseList) => warehouseList.warehouse_name}
                            renderInput={(params) => (
                                <TextField {...params} label="Choose Warehouse" variant="standard" />
                            )}
                        />
                    </FormControl>

                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Placed Stock</InputLabel>
                        <Input
                            type='number'
                            id="filled-required"
                            label="=Price"
                            variant="filled"
                            name='placed_stock'
                            value={orderSupplierModal.placed_stock}
                            onChange={onChangeStock}
                        />
                    </FormControl>


                    <TextField
                        disabled
                        id="filled-required"
                        label="Remaining"
                        variant="filled"
                        name='total_price'
                        startAdornment={<InputAdornment position="start"></InputAdornment>}
                        value={orderSupplierModal.new_stock_remaining}
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
                            onClick={saveBranchStock}
                            size="large" >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div >
    )
}

export default BranchStock



