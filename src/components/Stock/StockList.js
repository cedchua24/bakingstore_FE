import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import ProductServiceService from "../Product/ProductService.service";
import CategoryServiceService from "../Category/CategoryService.service";

import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography'
import UpdateIcon from '@mui/icons-material/Update';
import Button from '@mui/material/Button';

import { Form } from 'react-bootstrap';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import CircularProgress from '@mui/material/CircularProgress';




const StockList = (props) => {

    // const productList = props.productList;
    useEffect(() => {
        fetchProductList();
        fetchCategoryList();
    }, []);

    const [productList, setProductList] = useState([]);
    const [categoryId, setCategoryId] = useState(0);
    const [categeryList, setCategoryList] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);

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

    const [realStock, setRealStock] = useState(0);
    const [errorStock, setErrorStock] = useState(false);

    const onChangeInput = (e) => {
        console.log(e.target.value)
        setCategoryId(e.target.value)
        // setShopOrderTransaction({ ...shopOrderTransaction, [e.target.name]: e.target.value });
    }

    const onChangeStock = (e) => {
        // const realStock = product.stock;
        const totalStock = Number(realStock) + Number(e.target.value);
        setProduct({
            ...product,
            stock: totalStock,
        });

        if (Number(e.target.value) < 1) {
            setErrorStock(true);
        } else {
            setErrorStock(false);
        }
    }

    const fetchByProductId = async (id) => {
        await ProductServiceService.get(id)
            .then(response => {
                setProduct(response.data);
                setRealStock(response.data.stock);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchCategoryList = () => {
        CategoryServiceService.getAll()
            .then(response => {
                setCategoryList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const updateProduct = () => {
        setSubmitLoading(true);
        ProductServiceService.update(product.id, product)
            .then(response => {
                fetchProductList();
                setSubmitLoading(false);
                setOpen(false);
                // updateOrderTransaction();
            })
            .catch(e => {
                console.log(e);
                setSubmitLoading(false);
                setOpen(false);
            });

    }


    const fetchProductList = () => {
        ProductServiceService.getAll()
            .then(response => {
                setProductList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchProductByCategoryId = () => {
        ProductServiceService.fetchProductByCategoryId(categoryId)
            .then(response => {
                setProductList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    return (
        <div>
            <Form>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={shopOrderTransaction.shop_id}
                            label="Shop Name"
                            name="category_id"
                            onChange={onChangeInput}
                        >
                            {
                                categeryList.map((category, index) => (
                                    <MenuItem value={category.id}>{category.category_name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>

                <Button
                    variant="contained"
                    onClick={fetchProductByCategoryId}
                >
                    Search
                </Button>
            </Form>
            <br></br>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Quantity / Weight</th>
                        <th>Update Stock</th>
                        <th>Transaction</th>
                    </tr>
                </thead>
                <tbody>


                    {
                        productList.map((product, index) => (
                            <tr key={product.id} >
                                <td>{product.id}</td>
                                <td>{product.product_name}</td>
                                <td>{product.brand_name}</td>
                                <td>{product.category_name}</td>
                                <td>₱ {product.price}.00</td>
                                <td>{product.stock}</td>
                                <td>{product.weight}x{product.quantity}kg</td>
                                <td>
                                    <IconButton>
                                        <UpdateIcon color="primary" onClick={(e) => handleOpen(product.id, e)} />
                                    </IconButton>
                                </td>
                                <td>
                                    <Link variant="primary" to={"/viewTransaction/" + product.id}   >
                                        <Button variant="contained" >
                                            View
                                        </Button>
                                    </Link>
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
                            errorText='{this.state.password_error_text}'
                            min='1'
                            // value={product.stock}
                            onChange={onChangeStock}
                            // helperText="Incorrect entry."
                            error={errorStock}
                        />
                    </FormControl>

                    <FormControl fullWidth sx={{ m: 0 }} variant="standard">
                        <TextField
                            disabled
                            id="filled-required"
                            label="Stock"
                            variant="filled"
                            name='product_name'
                            value={product.stock}
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
                            disabled={errorStock}
                            size="large" >
                            Submits
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default StockList
