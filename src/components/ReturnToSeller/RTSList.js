import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import ProductServiceService from "../Product/ProductService.service";
import RTSService from "./RTSService";
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
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

import './RTSList.css';


const RTSList = (props) => {

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
        width: 'min(460px, calc(100vw - 28px))',
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

    const handleClose = () => setOpen(false);

    const [product, setProduct] = useState({
        id: 0,
        product_id: 0,
        product_name: '',
        quantity: 0,
        type: 0,
        status: 0,
        current_status: 0,
        reason: '',
        pack: ''
    });

    const [realStock, setRealStock] = useState(0);
    const [errorStock, setErrorStock] = useState(false);

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const onChangeInput = (e) => {
        console.log(e.target.value)
        setProduct({ ...product, [e.target.name]: e.target.value });

    }




    const fetchByProductId = async (id) => {
        await RTSService.fetchById(id)
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
        RTSService.update(product.id, product)
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
        RTSService.getAll()
            .then(response => {
                setProductList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }



    const deleteSpoilage = (id, e) => {
        RTSService.delete(id)
            .then(response => {
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

    const totalReturnCost = productList.reduce((total, item) => total + Number(item.total_cost || 0), 0);
    const inTransitCount = productList.filter(item => Number(item.status) === 1).length;
    const statusLabel = (status) => Number(status) === 0 ? 'Declared RTS/BO'
        : Number(status) === 1 ? 'Sent to supplier'
            : Number(status) === 2 ? 'Received to warehouse'
                : 'Refunded';


    return (
        <div className="rts-list-page">
            <section className="rts-list-hero"><div className="rts-list-hero__icon"><AssignmentReturnOutlinedIcon /></div><div><span>Supplier returns</span><h1>RTS/BO List</h1><p>Track product returns from declaration through supplier handling and resolution.</p></div></section>
            <section className="rts-list-summary">
                <div><Inventory2OutlinedIcon /><span><small>Total records</small><strong>{productList.length}</strong></span></div>
                <div><LocalShippingOutlinedIcon /><span><small>In transit</small><strong>{inTransitCount}</strong></span></div>
                <div><AccountBalanceWalletOutlinedIcon /><span><small>Total return value</small><strong>{numberFormat(totalReturnCost)}</strong></span></div>
            </section>
            <section className="rts-list-card">
                <div className="rts-list-card__header"><div><h2>Return records</h2><p>{productList.length} {productList.length === 1 ? 'return' : 'returns'} found.</p></div><span><AssignmentReturnOutlinedIcon />Return history</span></div>
                <div className="table-responsive">
            <table className="rts-list-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Supplier</th>
                        <th>Product details</th>
                        <th>Unit</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Type</th>
                        <th>Total Cost</th>
                        <th>Reason</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th className="rts-list-actions-column">Actions</th>
                    </tr>
                </thead>
                {productList.length == 0 ?
                    (<tbody><tr><td colSpan="12"><div className="rts-list-empty"><Inventory2OutlinedIcon /><strong>No RTS/BO records</strong><span>Supplier return records will appear here.</span></div></td></tr></tbody>)
                    :
                    (
                        <tbody>


                            {
                                productList.map((product, index) => (
                                    <tr key={product.rts_id} >
                                        <td>{product.id}</td>
                                        <td>{product.supplier_name}</td>
                                        <td>
                                            <div className="rts-list-product">
                                                <strong>{product.product_name}</strong>
                                                <span>{product.brand_name || 'No brand'} · {product.category_name || 'No category'}</span>
                                            </div>
                                        </td>
                                        <td>{product.pack || product.type}</td>
                                        <td>{product.pack === 'Pc' ? numberFormat(product.price / product.quantity) : numberFormat(product.price)}</td>
                                        <td>{product.rts_quantity}</td>
                                        <td>{product.type}</td>
                                        <td>{numberFormat(product.total_cost)}</td>
                                        <td>{product.reason}</td>
                                        <td>{covertDateString(product.updated_at)}</td>
                                        <td><span className={`rts-list-status rts-list-status--${product.status}`}>{statusLabel(product.status)}</span></td>

                                        <td className="rts-list-actions-column">
                                            <IconButton className="rts-list-action" aria-label={`Update ${product.product_name}`}>
                                                <UpdateIcon onClick={(e) => handleOpen(product.id, e)} />
                                            </IconButton>
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
                <Box sx={style} className="rts-list-modal">
                    <div className="rts-list-modal__header"><span><AssignmentReturnOutlinedIcon /></span><div><Typography id="keep-mounted-modal-title" variant="h6" component="h2">Update return status</Typography><p>Move this RTS/BO record to its next state.</p></div></div>

                    {submitLoading &&
                        <div className="rts-list-modal__loading">
                            <CircularProgress size={24} />
                        </div>
                    }
                    <div className="rts-list-modal__fields">
                    <TextField
                        fullWidth
                        disabled
                        id="filled-required"
                        label="Product Name"
                        name='product_name'
                        value={product.product_name}
                    />

                    <TextField
                        fullWidth
                        disabled
                        id="filled-required"
                        label="Quantity"
                        name='product_name'
                        value={product.quantity}
                    />
                    <TextField
                        fullWidth
                        disabled
                        id="filled-required"
                        label="Reason"
                        name='reason'
                        value={product.reason}
                    />

                    <FormControl fullWidth required>
                        <InputLabel id="rts-status-label">Choose status</InputLabel>
                        <Select
                            labelId="rts-status-label"
                            name='status'
                            value={product.status ?? ''}
                            label="Choose status"
                            onChange={onChangeInput}
                        >
                            {product.current_status != 0 && <MenuItem value={0}>Declare RTS/BO</MenuItem>}
                            {product.current_status != 1 && <MenuItem value={1}>Send to Supplier</MenuItem>}
                            {product.current_status != 2 && <MenuItem value={2}>Received to Warehouse</MenuItem>}
                            {product.current_status != 3 && <MenuItem value={3}>Refund</MenuItem>}
                        </Select>
                    </FormControl>
                    </div>

                    <Box
                        className="rts-list-modal__actions"
                    >
                        <Button type="button" onClick={handleClose}>Cancel</Button>
                        <Button
                            variant="contained"
                            type="submit"
                            onClick={updateProduct}
                            disabled={errorStock || submitLoading}
                            size="large" >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div >
    )
}

export default RTSList
