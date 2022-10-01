import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import OrderSupplierServiceService from '../OrderSupplierTransaction/OrderSupplierService.service';
import ProductServiceService from "../Product/ProductService.service";

import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography'
import UpdateIcon from '@mui/icons-material/Update';

const ViewTransaction = () => {

    const { id } = useParams();

    useEffect(() => {
        fetchProduct(id);
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
        fetchByProductId(id);
        setOpen(true);
    }

    const handleClose = () => setOpen(false);

    const [product, setProduct] = useState({
        id: 0,
        product_name: '',
        stock: 0,
    });

    const [productList, setProductList] = useState([]);
    const [totalStock, setTotalStock] = useState(0);

    const onChangeStock = (e) => {
        setProduct({
            ...product,
            stock: product.stock + e.target.value,
        });
    }

    const fetchByProductId = async (id) => {
        await ProductServiceService.get(id)
            .then(response => {
                setProduct(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const updateProduct = () => {
        ProductServiceService.update(product.id, product)
            .then(response => {
                fetchProduct(id);
                // updateOrderTransaction();
            })
            .catch(e => {
                console.log(e);
            });
    }

    const fetchProduct = (id) => {
        OrderSupplierServiceService.fetchOrderByProductId(id)
            .then(response => {
                setProductList(response.data);
                setTotalStock(response.data.reduce((total, currentValue) => total = total + currentValue.quantity, 0));

            })
            .catch(e => {
                console.log("error", e)
            });
    }

    return (
        <div>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        productList.map((product, index) => (
                            <tr key={product.id} >
                                <td>{product.id}</td>
                                <td>₱ {product.price}.00</td>
                                <td>{product.quantity}</td>
                                <td>₱ {product.total_price}.00</td>
                                <td>{product.created_at}</td>
                                <td>
                                    <Link variant="primary" to={"/completedOrder/" + product.order_supplier_transaction_id}   >
                                        <Button variant="primary" >
                                            View Transaction
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <IconButton>
                                        <UpdateIcon color="primary" onClick={(e) => handleOpen(product.id, e)} />
                                    </IconButton>
                                </td>
                                {/* <td>
                                    <Button variant="danger" onClick={(e) => deleteProduct(product.id, e)} >
                                        Delete
                                    </Button>
                                </td> */}
                            </tr>
                        )
                        )
                    }
                    <tr>
                        <td></td>
                        <td style={{ fontWeight: 'bold' }}>Total Stock : </td>
                        <td style={{ fontWeight: 'bold' }}>{totalStock}</td>
                    </tr>
                </tbody>
            </table>
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Update Stock
                    </Typography>

                    <TextField
                        disabled
                        id="filled-required"
                        label="Product Name"
                        variant="filled"
                        name='product_name'
                        value={product.product_name}
                    />

                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Add Stock</InputLabel>
                        <Input
                            type='number'
                            id="filled-required"
                            label="Stock"
                            variant="filled"
                            name='stock'
                            // value={product.stock}
                            onChange={onChangeStock}
                        />
                    </FormControl>

                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Stock</InputLabel>
                        <Input
                            type='number'
                            id="filled-required"
                            label="Stock"
                            variant="filled"
                            name='stock'
                        // value={orderSupplierModal.stock}
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
                            onClick={updateProduct}
                            size="large" >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div >
    )
}

export default ViewTransaction
