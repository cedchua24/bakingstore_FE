import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import ProductServiceService from "../Product/ProductService.service";
import ProductSupplierService from "../ProductSupplier/ProductSupplierService";

import CategoryServiceService from "../Category/CategoryService.service";
import { useNavigate } from "react-router-dom";
import RTSService from "./RTSService";

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

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


const AddRTS = (props) => {

    // const productList = props.productList;
    useEffect(() => {
        fetchProductList();
        fetchCategoryList();
    }, []);

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });
    const navigate = useNavigate();
    const [productList, setProductList] = useState({
        total_value: '',
        data: []
    });
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
        supplier_id: '',
        reason: '',
        stock: 0,
        stock_pc: 0,
        newStocks: 0,
        status: 0,
        pack: ''
    });

    const [supplier, setSupplier] = useState([]);

    const [realStock, setRealStock] = useState(0);
    const [errorStock, setErrorStock] = useState(true);
    const [errorStock2, setErrorStock2] = useState(true);

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const onChangeInput = (e) => {
        console.log(e.target.value)
        setProduct({
            ...product,
            pack: e.target.value,
        });
        setCategoryId(e.target.value)
        // setShopOrderTransaction({ ...shopOrderTransaction, [e.target.name]: e.target.value });
    }


    const onChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });

        if (e.target.value.length == 0) {
            setErrorStock2(true);
            console.log('true')
        } else {
            console.log('false')
            setErrorStock2(false);
        }
    }



    const onChangePackaging = (e) => {
        console.log(e.target.value)
        setProduct({
            ...product,
            pack: e.target.value,
        });
    }

    const onChangeSupplier = (e) => {
        console.log(e.target.value)
        setProduct({
            ...product,
            supplier_id: e.target.value,
        });
    }

    const onChangeStock = (e) => {
        setProduct({
            ...product,
            newStocks: e.target.value,
        });

        if (e.target.value > 0) {
            setErrorStock(true);
            console.log('true')
        } else {
            console.log('false')
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

        await ProductSupplierService.fetchSupplierByProductId(id)
            .then(response => {
                setSupplier(response.data);
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
        RTSService.create(product)
            .then(response => {
                fetchProductList();
                setSubmitLoading(false);
                setOpen(false);
                setErrorStock(false);
                // updateOrderTransaction();
                window.scrollTo(0, 0);
                setValidator({
                    severity: 'success',
                    message: 'Successfuly Added!',
                    isShow: true,
                });
                navigate('/rts/rTSList');
            })
            .catch(e => {
                console.log("error");
                setSubmitLoading(false);
                setOpen(false);
                setErrorStock(false);
                window.scrollTo(0, 0);
                setValidator({
                    severity: 'error',
                    message: 'Error!',
                    isShow: true,
                });
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
                            // value={shopOrderTransaction.shop_id}
                            label="Shop Name"
                            name="category_id"
                            defaultValue={2}
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
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <legend align="center" style={{ fontWeight: 'bold' }} > Add RTS/BO </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Stock/Pc</th>
                        <th>Quantity / Weight</th>
                        <th>Add RTS/BO</th>
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
                                        <td>{product.product_name}</td>
                                        <td>{product.brand_name}</td>
                                        <td>{product.category_name}</td>
                                        <td>₱ {product.price}.00</td>
                                        <td>{product.stock < product.stock_warning ? <p style={{ fontWeight: 'bold', color: 'red', }}>{product.stock}</p>
                                            : <p >{product.stock}</p>}
                                        </td>
                                        <td>{product.stock < product.stock_warning ? <p style={{ fontWeight: 'bold', color: 'red', }}>{product.stock_pc}</p>
                                            : <p >{product.stock_pc}</p>}
                                        </td>
                                        <td>{product.quantity === 1 ? <p >{product.weight}{product.variation}</p>
                                            : <p >{product.quantity}x{Number.isInteger(product.weight / product.quantity) ? (product.weight / product.quantity) : (product.weight / product.quantity).toPrecision(2)}{product.variation}</p>}
                                        </td>
                                        <td>
                                            <IconButton>
                                                <UpdateIcon color="primary" onClick={(e) => handleOpen(product.id, e)} />
                                            </IconButton>
                                        </td>
                                        <td>
                                            <Link variant="primary" to={"/viewTransaction/" + product.id}   >
                                                <Button variant="contained" disabled>
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
                        Add RTS/BO
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
                            value={product.packaging}
                            label="Packaging"
                            name="pack"
                            onChange={onChangePackaging}
                        >
                            <MenuItem value={product.packaging}>{product.packaging}</MenuItem>
                            {product.quantity != 1 &&
                                <MenuItem value="Pc">Pc</MenuItem>}


                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel id="demo-simple-select-label">Supplier</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Supplier"
                            name="supplier_id"
                            onChange={onChangeSupplier}
                        >

                            {
                                supplier.map((supplier, index) => (
                                    <MenuItem value={supplier.id}>{supplier.supplier_name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Quantity (must be negative)</InputLabel>
                        <Input
                            type='number'
                            id="filled-required"
                            label="Stock"
                            variant="filled"
                            name='newStocks'
                            errorText='{this.state.password_error_text}'
                            // min='1'
                            // value={product.stock}
                            onChange={onChangeStock}
                            // helperText="Incorrect entry."
                            error={errorStock}
                        />
                    </FormControl>


                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Reason</InputLabel>
                        <Input
                            type='text'
                            id="filled-required"
                            label="Reason"
                            variant="filled"
                            name='reason'
                            error={errorStock2}
                            onChange={onChange}
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
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div >
    )
}

export default AddRTS
