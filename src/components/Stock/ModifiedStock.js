import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';
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


import { Form } from 'react-bootstrap';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';




const ModifiedStock = (props) => {

    // const productList = props.productList;
    useEffect(() => {
        fetchProductList();
        fetchCategoryList();
    }, []);

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [productList, setProductList] = useState({
        data: [],
        total_amount: [],
        code: '',
        message: '',
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

    const [customerOrderDate, setCustomerOrderDate] = useState({
        date: ""
    });

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
        newStocks: 0,
        pack: ''
    });

    const [realStock, setRealStock] = useState(0);
    const [errorStock, setErrorStock] = useState(false);

    const onChangeInput = (e) => {
        console.log(e.target.value)
        setProduct({
            ...product,
            pack: e.target.value,
        });
        setCategoryId(e.target.value)
        // setShopOrderTransaction({ ...shopOrderTransaction, [e.target.name]: e.target.value });
    }

    const onChangePackaging = (e) => {
        console.log(e.target.value)
        setProduct({
            ...product,
            pack: e.target.value,
        });
    }

    const onChangeStock = (e) => {
        // const realStock = product.stock;
        // const totalStock = Number(realStock) + Number(e.target.value);
        setProduct({
            ...product,
            newStocks: e.target.value,
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
        ProductServiceService.fetchModifiedStockDaily()
            .then(response => {
                setProductList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const onChangeInputDate = (e) => {
        setCustomerOrderDate({ ...customerOrderDate, [e.target.name]: e.target.value });
    }

    const validate = (values) => {
        const errors = {};
        if (customerOrderDate.date.length == 0) {
            errors.date = "Date is Required!";
        }

        return errors;
    }

    const saveOrderTransaction = () => {
        console.log('orderTransaction: ', customerOrderDate.date);
        console.log("count: ", Object.keys(validate(customerOrderDate)).length);
        console.log("validate: ", validate(customerOrderDate));
        setFormErrors(validate(customerOrderDate));
        if (Object.keys(validate(customerOrderDate)).length > 0) {
            console.log("Has Validation: ");

        } else {
            console.log("Ready for saving: ");
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            ProductServiceService.fetchModifiedStockDaily(customerOrderDate.date)
                .then(response => {
                    setProductList(response.data);
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                })
                .catch(e => {
                    console.log("error", e)
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                });
        }
    }

    return (
        <div>
            <Form>
                {formErrors.date && <p style={{ color: "red" }}>{formErrors.date}</p>}
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" name="date" onChange={onChangeInputDate} />
                </Form.Group>

                <Button variant="primary"
                    onClick={saveOrderTransaction}
                    disabled={isAddDisabled}
                >
                    Find
                </Button>
                <br></br>
                <br></br>
                {submitLoadingAdd &&
                    <LinearProgress color="warning" />
                }
                <br></br>
            </Form >
            <br></br>
            <legend align="center" style={{ fontWeight: 'bold' }} > Modified Stock Daily </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Brand</th>
                        <th>Product</th>
                        <th>Reason</th>
                        <th>Quantity</th>
                        <th>Date</th>
                        {/* <th>Transaction</th> */}
                    </tr>
                </thead>
                <tbody>


                    {
                        productList.data.map((product, index) => (
                            <tr key={product.id} >
                                <td>{product.id}</td>
                                <td>{product.brand_name}</td>
                                <td>{product.product_name}</td>
                                <td>{product.stock_reason}</td>
                                <td>{product.stock + " " + product.pack}</td>
                                <td>{product.updated_at}</td>
                                {/* <td>
                                    <Link variant="primary" to={"/viewTransaction/" + product.id}   >
                                        <Button variant="contained" >
                                            View
                                        </Button>
                                    </Link>
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
                            <MenuItem value="Pc">Pc</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Add Stocks</InputLabel>
                        <Input
                            type='number'
                            id="filled-required"
                            label="Stock"
                            variant="filled"
                            name='newStocks'
                            errorText='{this.state.password_error_text}'
                            min='1'
                            // value={product.stock}
                            onChange={onChangeStock}
                            // helperText="Incorrect entry."
                            error={errorStock}
                        />
                    </FormControl>

                    {/* <FormControl fullWidth sx={{ m: 0 }} variant="standard">
                        <TextField
                            disabled
                            id="filled-required"
                            label="Stock"
                            variant="filled"
                            name='product_name'
                            value={product.stock}
                        />
                    </FormControl> */}

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

export default ModifiedStock
