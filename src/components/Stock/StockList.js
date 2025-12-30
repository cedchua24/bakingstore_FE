import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import ProductServiceService from "../Product/ProductService.service";
import CustomerService from "../Customer/CustomerService";
import CategoryServiceService from "../Category/CategoryService.service";
import OutOfStockUpdateService from "../OtherService/OutOfStockUpdateService";

import Autocomplete from '@mui/material/Autocomplete';
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
import LinearProgress from '@mui/material/LinearProgress';


const StockList = (props) => {

    // const productList = props.productList;
    useEffect(() => {
        fetchProductList();
        fetchCategoryList();
        fetchUserList();
    }, []);

    const [productList, setProductList] = useState({
        data: [],
        id: 0
    });

    const [categoryId, setCategoryId] = useState(0);
    const [categeryList, setCategoryList] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [customerList, setCustomerList] = useState([]);

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

    const [orderSupplierModal, setOrderSupplierModal] = useState({
        id: 0,
        customer_id: '',
        status: 0
    });

    const [open, setOpen] = React.useState(false);
    const [openNotify, setOpenNotify] = React.useState(false);

    const handleOpen = (id, e) => {
        console.log('e', id);
        fetchByProductId(id);
        setOpen(true);
    }

    const handleClose = () => setOpen(false);

    const handleCloseNotify = () => setOpenNotify(false);

    const [product, setProduct] = useState({
        id: 0,
        product_name: '',
        stock_reason: '',
        stock: 0,
        stock_pc: 0,
        newStocks: 0,
        pack: ''
    });

    const [realStock, setRealStock] = useState(0);
    const [errorStock, setErrorStock] = useState(true);

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [errorStock2, setErrorStock2] = useState(true);
    const [errorStock3, setErrorStock3] = useState(true);

    const onChangeInput = (e) => {
        setCategoryId(e.target.value)
    }

    const onChangePackaging = (e) => {
        console.log(e.target.value)
        setProduct({
            ...product,
            pack: e.target.value,
        });

        if (e.target.value.length === '') {
            setErrorStock3(true);
            console.log('true')
        } else {
            console.log('false')
            setErrorStock3(false);
        }
    }

    const onChangeReason = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });

        if (e.target.value.length == 0) {
            setErrorStock2(true);
            console.log('true')
        } else {
            console.log('false')
            setErrorStock2(false);
        }
    }


    const onChangeStock = (e) => {
        setProduct({
            ...product,
            newStocks: e.target.value,
        });

        if (e.target.value == 0) {
            setErrorStock(true);
        } else {
            setErrorStock(false);
        }
    }


    const updateOrderSupplier = () => {
        setSubmitLoading(true);
        OutOfStockUpdateService.create(orderSupplierModal)
            .then(response => {
                setSubmitLoading(false);
                setOpenNotify(false);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const handleInputChange = (e, value) => {
        e.persist();
        setOrderSupplierModal({
            ...orderSupplierModal,
            customer_id: value.id,
        });
    }

    const fetchUserList = () => {
        CustomerService.fetchCustomerEnabled()
            .then(response => {
                setCustomerList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const handleOpenNotify = (id, e) => {
        console.log('e', id);
        fetchShopOrder(id);
        setOpenNotify(true);
    }

    const fetchShopOrder = async (id) => {
        await ProductServiceService.get(id)
            .then(response => {
                setOrderSupplierModal({
                    product_id: response.data.id,
                    product_name: response.data.product_name
                });
            })
            .catch(e => {
                console.log("error", e)
            });
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
        // setErrorStock(true);
        ProductServiceService.update(product.id, product)
            .then(response => {
                fetchProductList();
                setSubmitLoading(false);
                setOpen(false);
                setErrorStock(false);

                setProduct({
                    id: 0,
                    product_name: '',
                    stock_reason: '',
                    stock: 0,
                    stock_pc: 0,
                    newStocks: 0,
                    pack: ''

                });

            })
            .catch(e => {
                console.log(e);
                setSubmitLoading(false);
                setOpen(false);
                setErrorStock(false);
            });

    }


    const fetchProductList = () => {
        ProductServiceService.fetchProductByCategoryId(2)
            .then(response => {
                setProductList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchProductByCategoryId = () => {
        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        ProductServiceService.fetchProductByCategoryId(categoryId)
            .then(response => {
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
                setProductList(response.data);

            })
            .catch(e => {
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
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
                            defaultValue={2}
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
                    disabled={isAddDisabled}
                >
                    Search
                </Button>
                <br></br>
                <br></br>
                {submitLoadingAdd &&
                    <LinearProgress color="warning" />
                }
            </Form>
            <br></br>

            <legend align="center" style={{ fontWeight: 'bold' }} > Stock List   </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Category</th>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Stock/Pc</th>
                        <th>Quantity / Weight</th>
                        <th>Update Stock</th>
                        <th>Add Customer Follow Up</th>
                        <th>Transaction</th>
                        <th></th>
                    </tr>
                </thead>
                {productList.length == 0 ?
                    (<tr style={{ color: "red" }}>{"No Data Available"}</tr>)
                    :
                    (
                        <tbody>


                            {
                                productList.data.map((product, index) => (
                                    <tr key={product.id} >
                                        <td>{product.id}</td>
                                        <td>{product.category_name}</td>
                                        <td>{product.product_name}</td>
                                        <td>{product.brand_name}</td>
                                        <td>₱ {product.price}.00</td>
                                        <td>{product.stock < product.stock_warning ? <p style={{ fontWeight: 'bold', color: 'red', }}>{product.stock}</p>
                                            : <p >{product.stock}</p>}
                                        </td>
                                        <td>{product.stock < product.stock_warning ? <p style={{ fontWeight: 'bold', color: 'red', }}>{product.stock_pc}</p>
                                            : <p >{product.stock_pc}</p>}
                                        </td>
                                        <td>{product.quantity === 1 ? <p >{product.weight}kg</p>
                                            : <p >{product.quantity}x{Number.isInteger(product.weight / product.quantity) ? (product.weight / product.quantity) : (product.weight / product.quantity).toPrecision(2)}{product.variation}</p>}
                                        </td>
                                        <td>
                                            <IconButton>
                                                <UpdateIcon color="primary" onClick={(e) => handleOpen(product.id, e)} />
                                            </IconButton>
                                        </td>
                                        <td>
                                            <IconButton>
                                                <UpdateIcon color="primary" onClick={(e) => handleOpenNotify(product.id, e)} />
                                            </IconButton>
                                        </td>
                                        <td>
                                            <Link variant="primary" to={"/viewStockTransactionList/" + product.id}   >
                                                <Button variant="contained" >
                                                    View
                                                </Button>
                                            </Link>
                                        </td>
                                        <td>
                                            <Link variant="primary" to={"/viewTransaction/" + product.id}   >
                                                <Button variant="contained" disabled>
                                                    View
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                )
                                )
                            }
                        </tbody>)}
            </table>
            < Modal
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
                        <InputLabel id="demo-simple-select-label">Packaging</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={product.pack}
                            label="Packaging"
                            name="pack"
                            error={errorStock3}
                            onChange={onChangePackaging}
                        >
                            <MenuItem value={product.packaging}>{product.packaging}</MenuItem>
                            {product.quantity != 1 &&
                                <MenuItem value="Pc">Pc</MenuItem>}


                        </Select>
                    </FormControl>


                    <FormControl variant="standard">
                        {/* <InputLabel htmlFor="standard-adornment-amount">Add Stocks</InputLabel>
                        <Input
                            type='number'
                            id="filled-required"
                            label="Stock"
                            variant="filled"
                            name='newStocks'
                            value={product.newStocks}
                            onChange={onChangeStock}
                            error={errorStock}
                        /> */}

                        <TextField
                            InputLabelProps={{ shrink: true }}
                            id="outlined-password-input"
                            label="Quantity"
                            type='number'
                            name='newStocks'
                            value={product.newStocks}
                            onChange={onChangeStock}
                            error={errorStock}
                        />
                    </FormControl>

                    <FormControl variant="standard">
                        <TextField
                            id="filled-required"
                            label="Reason"
                            variant="filled"
                            name='stock_reason'
                            value={product.stock_reason}
                            onChange={onChangeReason}
                            error={errorStock2}
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
                            disabled={errorStock || errorStock2 || errorStock3}
                            size="large" >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal
                keepMounted
                open={openNotify}
                onClose={handleCloseNotify}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Add Customer for Reference
                    </Typography>
                    {submitLoading &&
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </div>
                    }
                    <br></br>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control type="text" value={orderSupplierModal.product_name} disabled />

                    </Form.Group>

                    <FormControl variant="standard" >
                        <Autocomplete
                            // {...defaultProps}
                            options={customerList}
                            className="mb-3"
                            id="disable-close-on-select"
                            onChange={handleInputChange}
                            getOptionLabel={(customerList) => customerList.first_name + " " + customerList.last_name}
                            renderInput={(params) => (
                                <TextField {...params} label="Choose Customer" variant="standard" />
                            )}
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

export default StockList
