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
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SearchIcon from '@mui/icons-material/Search';

import './AddRTS.css';


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
        width: 'min(480px, calc(100vw - 28px))',
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
        bgcolor: 'background.paper',
        borderRadius: '16px',
        boxShadow: 24,
        p: 3,
    };

    const [open, setOpen] = React.useState(false);

    const handleOpen = (id, e) => {
        console.log('e', id);
        fetchByProductId(id);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setSubmitLoading(false);
        setErrorStock(true);
        setErrorStock2(true);
    };

    const [product, setProduct] = useState({
        id: 0,
        product_name: '',
        type: 'RETURN',
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

        if (e.target.value === '' || Number(e.target.value) >= 0) {
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
                setProduct({
                    ...response.data,
                    type: 'RETURN',
                    pack: response.data.packaging || '',
                    supplier_id: '',
                    newStocks: '',
                    reason: ''
                });
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
        RTSService.create({
            ...product,
            type: 'RETURN'
        })
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
        <div className="add-rts-page">
            <section className="add-rts-hero">
                <div className="add-rts-hero__icon"><AssignmentReturnOutlinedIcon /></div>
                <div><span>Supplier returns</span><h1>Add RTS/BO</h1><p>Record products being returned to a supplier and adjust inventory accurately.</p></div>
            </section>
            <Form className="add-rts-filter">
                <div className="add-rts-filter__copy"><strong>Filter products</strong><span>Select a category to find stock for return.</span></div>
                <div className="add-rts-filter__controls">
                <Box sx={{ minWidth: 120 }}>
                    <FormControl size="small" sx={{ m: 0, minWidth: 240 }}>
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={shopOrderTransaction.shop_id}
                            label="Category"
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
                    startIcon={<SearchIcon />}
                    className="add-rts-filter__button"
                >
                    Search
                </Button>
                </div>
                {submitLoadingAdd &&
                    <LinearProgress color="warning" className="add-rts-progress" />
                }
            </Form>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <section className="add-rts-card">
                <div className="add-rts-card__header"><div><h2>Available products</h2><p>Choose a product to start a supplier return.</p></div><span><Inventory2OutlinedIcon />{productList.data?.length || 0} products</span></div>
                <div className="table-responsive">
            <table className="add-rts-table">
                <thead>
                    <tr>
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
                    (<tbody><tr><td colSpan="10"><div className="add-rts-empty"><Inventory2OutlinedIcon /><strong>No products available</strong><span>Try selecting another category.</span></div></td></tr></tbody>)
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
                                            <IconButton className="add-rts-action" aria-label={`Return ${product.product_name}`}>
                                                <UpdateIcon onClick={(e) => handleOpen(product.id, e)} />
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
                </div>
            </section>
            < Modal

                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style} className="add-rts-modal">
                    <div className="add-rts-modal__header"><span><AssignmentReturnOutlinedIcon /></span><div><Typography id="keep-mounted-modal-title" variant="h6" component="h2">Add RTS/BO</Typography><p>Record stock being returned to the supplier.</p></div></div>

                    {submitLoading &&
                        <div className="add-rts-modal__loading">
                            <CircularProgress size={24} />
                        </div>
                    }
                    <div className="add-rts-modal__stock"><div><span>Wholesale stock</span><strong>{product.stock ?? 0}</strong></div><div><span>Piece stock</span><strong>{product.stock_pc ?? 0}</strong></div></div>
                    <div className="add-rts-modal__fields">
                    <TextField
                        fullWidth
                        disabled
                        label="Product Name"
                        name='product_name'
                        value={product.product_name || ''}
                    />
                    <TextField
                        fullWidth
                        disabled
                        label="Type"
                        value="RETURN"
                    />
                    <FormControl fullWidth required>
                        <InputLabel id="rts-packaging-label">Stock unit</InputLabel>
                        <Select
                            labelId="rts-packaging-label"
                            value={product.pack || ''}
                            label="Stock unit"
                            name="pack"
                            onChange={onChangePackaging}
                        >
                            <MenuItem value={product.packaging}>{product.packaging}</MenuItem>
                            {product.quantity != 1 &&
                                <MenuItem value="Pc">Pc</MenuItem>}


                        </Select>
                    </FormControl>

                    <FormControl fullWidth required>
                        <InputLabel id="rts-supplier-label">Supplier</InputLabel>
                        <Select
                            labelId="rts-supplier-label"
                            value={product.supplier_id || ''}
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

                    <TextField
                            fullWidth required
                            type='number'
                            label="Return quantity"
                            name='newStocks'
                            value={product.newStocks}
                            onChange={onChangeStock}
                            error={errorStock}
                            helperText={errorStock ? 'Enter a quantity less than zero.' : 'This amount will be deducted from stock.'}
                            inputProps={{ max: -1 }}
                        />

                        <TextField
                            fullWidth required
                            label="Reason"
                            name='reason'
                            value={product.reason || ''}
                            error={errorStock2}
                            onChange={onChange}
                            multiline minRows={3}
                            helperText={errorStock2 ? 'Explain why this product is being returned.' : 'Reason recorded in the return history.'}
                        />
                    </div>

                    <Box
                        className="add-rts-modal__actions"
                    >
                        <Button type="button" onClick={handleClose}>Cancel</Button>
                        <Button
                            variant="contained"
                            type="submit"
                            onClick={updateProduct}
                            disabled={errorStock || errorStock2 || submitLoading || !product.pack || !product.supplier_id}
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
