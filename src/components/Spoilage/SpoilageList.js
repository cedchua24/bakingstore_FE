import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import ProductServiceService from "../Product/ProductService.service";
import SpoilageService from "./SpoilageService";
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
import LinearProgress from '@mui/material/LinearProgress';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

import './SpoilageList.css';


const SpoilageList = (props) => {

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
        stock_pc: 0,
        newStocks: 0,
        reason: '',
        pack: ''
    });

    const [realStock, setRealStock] = useState(0);
    const [errorStock, setErrorStock] = useState(false);

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


    const onChangeStock = (e) => {
        // const realStock = product.stock;
        // const totalStock = Number(realStock) + Number(e.target.value);
        setProduct({
            ...product,
            newStocks: e.target.value,
        });

        let v = product.stock + Number(e.target.value);
        let x = product.stock_pc + Number(e.target.value);
        // if (product.pack === 'Box') {
        //     if (v < 0) {
        //         setErrorStock(true);
        //     } else {
        //         setErrorStock(false);
        //     }
        // } else {
        //     if (x < 0) {
        //         setErrorStock(true);
        //     } else {
        //         setErrorStock(false);
        //     }

        // }


    }

    const fetchByProductId = async (id) => {
        await SpoilageService.fetchById(id)
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
        setErrorStock(true);
        ProductServiceService.update(product.id, product)
            .then(response => {
                fetchProductList();
                setSubmitLoading(false);
                setOpen(false);
                setErrorStock(false);
                // updateOrderTransaction();
            })
            .catch(e => {
                console.log(e);
                setSubmitLoading(false);
                setOpen(false);
                setErrorStock(false);
            });

    }


    const fetchProductList = () => {
        SpoilageService.getAll()
            .then(response => {
                setProductList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }



    const deleteSpoilage = (id, e) => {
        setSubmitLoading(true);
        setErrorStock(true);
        SpoilageService.delete(id)
            .then(response => {
                setSubmitLoading(false);
                setOpen(false);
                fetchProductList();
            })
            .catch(e => {
                console.log('error', e);
            });
    }


    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');

    const covertDateString = (day) => {
        var d = new Date(day);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }

    const totalSpoilageCost = productList.reduce(
        (total, currentProduct) => total + Number(currentProduct.total_cost || 0),
        0
    );


    return (
        <div className="spoilage-list-page">
            <section className="spoilage-list-hero">
                <div className="spoilage-list-hero__icon"><WarningAmberRoundedIcon /></div>
                <div>
                    <span>Inventory audit</span>
                    <h1>Spoilage List</h1>
                    <p>Review damaged, expired, and unusable stock recorded across inventory.</p>
                </div>
            </section>

            <section className="spoilage-list-summary">
                <div><Inventory2OutlinedIcon /><span><small>Records</small><strong>{productList.length}</strong></span></div>
                <div><AccountBalanceWalletOutlinedIcon /><span><small>Total spoilage cost</small><strong>{numberFormat(totalSpoilageCost)}</strong></span></div>
            </section>

            {submitLoading &&
                <LinearProgress color="warning" className="spoilage-list-progress" />
            }
            <section className="spoilage-list-card">
                <div className="spoilage-list-card__header">
                    <div><h2>Recorded spoilage</h2><p>{productList.length} {productList.length === 1 ? 'record' : 'records'} found.</p></div>
                    <span><WarningAmberRoundedIcon />Audit history</span>
                </div>
                <div className="table-responsive">
            <table className="spoilage-list-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Unit</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total Cost</th>
                        <th>Reason</th>
                        <th>Date</th>
                        <th aria-label="Actions"></th>
                    </tr>
                </thead>
                {productList.length == 0 ?
                    (<tbody><tr><td colSpan="11"><div className="spoilage-list-empty"><Inventory2OutlinedIcon /><strong>No spoilage records</strong><span>Recorded spoilage will appear here.</span></div></td></tr></tbody>)
                    :
                    (
                        <tbody>


                            {
                                productList.map((product, index) => (
                                    <tr key={product.stock_order_id} >
                                        <td>{product.stock_order_id}</td>
                                        <td>{product.product_name}</td>
                                        <td>{product.brand_name}</td>
                                        <td>{product.category_name}</td>
                                        <td>{product.pack}</td>
                                        <td>{product.pack === 'Pc' ? numberFormat(product.price / product.quantity) : numberFormat(product.price)}</td>
                                        <td>{product.stock_quantity}</td>
                                        <td>{numberFormat(product.total_cost)}</td>
                                        <td>{product.reason}</td>
                                        <td>{covertDateString(product.updated_at)}</td>




                                        <td>
                                            <Button variant="outlined" startIcon={<DeleteOutlineRoundedIcon />} disabled className="spoilage-list-delete">
                                                Delete
                                            </Button>
                                        </td>
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
                        <InputLabel htmlFor="standard-adornment-amount">Add Stocks</InputLabel>
                        <Input
                            type='number'
                            id="filled-required"
                            label="Stock"
                            variant="filled"
                            name='newStocks'
                            errorText='{this.state.password_error_text}'
                            value={product.stock}
                            // min='1'
                            // value={product.stock}
                            onChange={onChangeStock}
                            // helperText="Incorrect entry."
                            error={errorStock}
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

export default SpoilageList
