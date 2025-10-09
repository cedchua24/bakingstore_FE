import React, { useState, useEffect } from "react";
import ProductServiceService from "../Product/ProductService.service";
import { Link } from "react-router-dom";
import BrandServiceService from "../Brand/BrandService.service";
import CategoryServiceService from "../Category/CategoryService.service";
import CustomerService from "../Customer/CustomerService";
import OutOfStockUpdateService from "../OtherService/OutOfStockUpdateService";

import { Form } from 'react-bootstrap';
import Autocomplete from '@mui/material/Autocomplete';

import IconButton from '@mui/material/IconButton';
import UpdateIcon from '@mui/icons-material/Update';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';


import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress';

import LinearProgress from '@mui/material/LinearProgress';

import MenuItem from '@mui/material/MenuItem';

import Select from '@mui/material/Select';



const OutOfStockReturn = () => {

    useEffect(() => {
        fetchProductList();
        fetchBrandList();
        fetchCategoryList();
        fetchUserList();
    }, []);

    const [categoryId, setCategoryId] = useState(0);
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [customerList, setCustomerList] = useState([]);

    const [submitLoading, setSubmitLoading] = useState(false);
    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        '& .MuiTextField-root': { m: 1, width: '25ch' },
    };

    const [open, setOpen] = React.useState(false);

    const handleOpenNotify = (id, e) => {
        console.log('e', id);
        fetchShopOrder(id);
        setOpen(true);
    }

    const [orderSupplierModal, setOrderSupplierModal] = useState({
        id: 0,
        customer_id: '',
        status: 0
    });

    const fetchUserList = () => {
        CustomerService.fetchCustomerEnabled()
            .then(response => {
                setCustomerList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
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



    const updateOrderSupplier = () => {
        setSubmitLoading(true);
        OutOfStockUpdateService.create(orderSupplierModal)
            .then(response => {
                if (response.data.code == 200) {
                    setSubmitLoading(false);
                    setOpen(false);
                    window.scrollTo(0, 0);
                    setValidator({
                        severity: 'success',
                        message: 'Successfuly Added!',
                        isShow: true,
                    });
                    fetchProductList();
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

    const handleClose = () => setOpen(false);

    const [product, setProduct] = useState({
        id: 0,
        category_id: 0,
        category_name: '',
        brand_id: 0,
        brand_name: '',
        product_name: "",
        price: 0,
        stock: 0,
        weight: 0,
        quantity: 0,
        packaging: ''
    })

    const [brandList, setBrandList] = useState([]);
    const [categeryList, setCategoryList] = useState([]);

    const [message, setMessage] = useState(false);

    const [productList, setProductList] = useState({
        total_value: '',
        data: []
    });

    const onChangeInput = (e) => {
        console.log(e.target.value)
        setCategoryId(e.target.value)
    }


    const fetchProductList = () => {
        ProductServiceService.fetchProductToNotify(0)
            .then(response => {
                setProductList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchBrandList = () => {
        BrandServiceService.getAll()
            .then(response => {
                setBrandList(response.data);
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

    const deleteProduct = (id, e) => {

        const index = productList.findIndex(brand => brand.id === id);
        const newProduct = [...productList];
        newProduct.splice(index, 1);

        ProductServiceService.delete(id)
            .then(response => {
                setProductList(newProduct);
            })
            .catch(e => {
                console.log('error', e);
            });
    }

    const handleInputChange = (e, value) => {
        e.persist();
        setOrderSupplierModal({
            ...orderSupplierModal,
            customer_id: value.id,
        });
    }

    const fetchProductByCategoryId = () => {
        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        ProductServiceService.fetchProductToNotify(categoryId)
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

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');


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
                    <br></br>
                    {/* <FormControl sx={{ m: 1, minWidth: 220, minHeight: 70 }}>
                        <InputLabel htmlFor="standard-adornment-amount">Total Value</InputLabel>
                        <Input
                            type='text'
                            id="filled-"
                            label="Quantity"
                            variant="filled"
                            name='shop_order_quantity'
                            value={numberFormat(productList.total_value.total_price)}
                            disabled
                        />
                    </FormControl> */}

                </Box>

                <Button
                    variant="contained"
                    disabled={isAddDisabled}
                    onClick={fetchProductByCategoryId}
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
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
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
            <legend align="center" style={{ fontWeight: 'bold' }} > Customer To Notify Stock </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity / Weight</th>
                        <th>Stock</th>
                        <th>Stock / Per Piece</th>
                        <th>Packaging</th>
                        <th>Stock Warning</th>
                        <th>Status</th>
                        <th>Note</th>
                        <th>Add Customer Follow Up</th>
                        <th>Customer Follow Up List</th>
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
                                        <td>{numberFormat(product.price)}</td>
                                        {/* <td>{product.weight}x{product.quantity}kg</td> */}
                                        <td>{product.quantity === 1 ? <p >{product.weight}kg</p>
                                            : <p >{product.quantity}x{Number.isInteger(product.weight / product.quantity) ? (product.weight / product.quantity) : (product.weight / product.quantity).toPrecision(2)}{product.variation}</p>}
                                        </td>
                                        <td>{product.stock}</td>
                                        <td>{product.stock_pc}</td>
                                        <td>{product.packaging}</td>
                                        <td>{product.stock_warning}</td>
                                        <td>{product.disabled === 0 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
                                        <td><p>{product.note}</p></td>
                                        <td>
                                            <IconButton>
                                                <UpdateIcon color="primary" onClick={(e) => handleOpenNotify(product.id, e)} />
                                            </IconButton>
                                        </td>
                                        <td>
                                            <Link variant="primary" to={"/viewCustomerNotify/" + product.id}   >
                                                <Button variant="contained" >
                                                    View Customer to Notify
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                )
                                )
                            }
                        </tbody>)}
            </table>



        </div>
    )
}

export default OutOfStockReturn
