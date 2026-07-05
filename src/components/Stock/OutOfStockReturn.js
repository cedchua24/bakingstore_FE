import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductServiceService from "../Product/ProductService.service";
import CategoryServiceService from "../Category/CategoryService.service";
import CustomerService from "../Customer/CustomerService";
import OutOfStockUpdateService from "../OtherService/OutOfStockUpdateService";

import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import './OutOfStockReturn.css';

const OutOfStockReturn = () => {
    const [productList, setProductList] = useState({ data: [] });
    const [categoryList, setCategoryList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [categoryId, setCategoryId] = useState(0);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [alert, setAlert] = useState({ visible: false, severity: '', message: '' });
    const [followUp, setFollowUp] = useState({
        product_id: 0,
        product_name: '',
        customer_id: ''
    });

    useEffect(() => {
        ProductServiceService.fetchProductToNotify(0)
            .then(response => setProductList(response.data))
            .catch(error => console.log("error", error));

        CategoryServiceService.getAll()
            .then(response => setCategoryList(response.data))
            .catch(error => console.log("error", error));

        CustomerService.fetchCustomerEnabled()
            .then(response => setCustomerList(response.data))
            .catch(error => console.log("error", error));
    }, []);

    const products = Array.isArray(productList?.data)
        ? productList.data
        : (Array.isArray(productList) ? productList : []);

    const outOfStockCount = products.filter(
        product => Number(product.stock || 0) === 0 && Number(product.stock_pc || 0) === 0
    ).length;

    const fetchProducts = () => {
        setLoading(true);
        ProductServiceService.fetchProductToNotify(categoryId)
            .then(response => setProductList(response.data))
            .catch(error => console.log("error", error))
            .finally(() => setLoading(false));
    };

    const openFollowUp = (product) => {
        setFollowUp({
            product_id: product.id,
            product_name: product.product_name,
            customer_id: ''
        });
        setModalOpen(true);
    };

    const saveFollowUp = () => {
        setSubmitting(true);
        OutOfStockUpdateService.create(followUp)
            .then(response => {
                if (response.data.code === 200) {
                    setAlert({ visible: true, severity: 'success', message: 'Customer follow-up added successfully.' });
                    setModalOpen(false);
                } else {
                    setAlert({
                        visible: true,
                        severity: 'error',
                        message: response.data.message || 'Unable to add the customer follow-up.'
                    });
                }
                window.scrollTo(0, 0);
            })
            .catch(error => {
                console.log(error);
                setAlert({ visible: true, severity: 'error', message: 'Unable to add the customer follow-up.' });
            })
            .finally(() => setSubmitting(false));
    };

    const formatMoney = (value) => new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2
    }).format(Number(value || 0));

    const formatPackage = (product) => {
        if (product.quantity == null || product.weight == null) return product.packaging || 'Package not specified';
        if (Number(product.quantity) === 1) return `${product.weight}${product.variation || ''}`;
        const unitWeight = Number(product.weight) / Number(product.quantity);
        return `${product.quantity} × ${Number.isInteger(unitWeight) ? unitWeight : unitWeight.toPrecision(2)}${product.variation || ''} / ${product.packaging || 'package'}`;
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(440px, calc(100vw - 28px))',
        bgcolor: 'background.paper',
        borderRadius: '14px',
        boxShadow: 24,
        p: 3
    };

    return (
        <div className="oos-return-page">
            <section className="oos-return-hero">
                <div className="oos-return-hero__icon"><NotificationsActiveOutlinedIcon /></div>
                <div className="oos-return-hero__copy">
                    <span>Customer restock queue</span>
                    <h1>Customers to Notify</h1>
                    <p>Track products customers are waiting for and manage restock follow-ups.</p>
                </div>
                <div className="oos-return-summary">
                    <div><Inventory2OutlinedIcon /><span><strong>{products.length}</strong>Products</span></div>
                    <div><WarningAmberRoundedIcon /><span><strong>{outOfStockCount}</strong>Out of stock</span></div>
                </div>
            </section>

            {alert.visible && <Alert severity={alert.severity} className="oos-return-alert">{alert.message}</Alert>}

            <section className="oos-return-filter">
                <div><strong>Filter products</strong><span>Choose a category to narrow the follow-up queue.</span></div>
                <div className="oos-return-filter__controls">
                    <FormControl size="small" className="oos-return-category">
                        <InputLabel id="oos-return-category-label">Category</InputLabel>
                        <Select
                            labelId="oos-return-category-label"
                            value={categoryId}
                            label="Category"
                            onChange={event => setCategoryId(event.target.value)}
                        >
                            <MenuItem value={0}>All categories</MenuItem>
                            {categoryList.map(category => (
                                <MenuItem value={category.id} key={category.id}>{category.category_name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        disabled={loading}
                        onClick={fetchProducts}
                        startIcon={<SearchIcon />}
                        className="oos-return-search"
                    >
                        {loading ? 'Loading...' : 'Apply filter'}
                    </Button>
                </div>
                {loading && <LinearProgress className="oos-return-progress" />}
            </section>

            <section className="oos-return-card">
                <div className="oos-return-card__header">
                    <div><h2>Restock follow-up products</h2><p>{products.length} {products.length === 1 ? 'product' : 'products'} in this view.</p></div>
                    <span><NotificationsActiveOutlinedIcon />Notification queue</span>
                </div>
                <div className="table-responsive">
                    <table className="oos-return-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Inventory</th>
                                <th>Warning level</th>
                                <th>Note</th>
                                <th>Status</th>
                                <th aria-label="Actions"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? products.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="oos-return-product">
                                            <span>{product.product_name ? product.product_name.charAt(0).toUpperCase() : '?'}</span>
                                            <div>
                                                <strong>{product.product_name}</strong>
                                                <small>#{product.id} · {product.brand_name || 'No brand'}</small>
                                                <em>{formatPackage(product)}</em>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="oos-return-category-pill">{product.category_name}</span></td>
                                    <td><strong className="oos-return-price">{formatMoney(product.price)}</strong></td>
                                    <td>
                                        <div className="oos-return-stock">
                                            <span>Wholesale <strong>{product.stock ?? 0}</strong></span>
                                            <span>Pieces <strong>{product.stock_pc ?? 0}</strong></span>
                                        </div>
                                    </td>
                                    <td><strong className="oos-return-warning">{product.stock_warning ?? 0}</strong></td>
                                    <td><span className="oos-return-note">{product.note || 'No note'}</span></td>
                                    <td>
                                        <span className={product.disabled === 0 ? 'oos-return-status oos-return-status--active' : 'oos-return-status oos-return-status--disabled'}>
                                            {product.disabled === 0
                                                ? <><CheckCircleRoundedIcon />Active</>
                                                : <><CancelRoundedIcon />Disabled</>}
                                        </span>
                                    </td>
                                    <td className="oos-return-actions">
                                        <button type="button" onClick={() => openFollowUp(product)}>
                                            <PersonAddAltOutlinedIcon />Add follow-up
                                        </button>
                                        <Link to={"/viewCustomerNotify/" + product.id}>View customers</Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8">
                                        <div className="oos-return-empty">
                                            <NotificationsActiveOutlinedIcon />
                                            <h3>No products to follow up</h3>
                                            <p>There are no customer notification products in this category.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box sx={modalStyle}>
                    <div className="oos-return-modal__header">
                        <span><PersonAddAltOutlinedIcon /></span>
                        <div><h2>Add customer follow-up</h2><p>Save a customer interested in this product.</p></div>
                    </div>
                    <div className="oos-return-modal__fields">
                        <TextField fullWidth disabled label="Product" value={followUp.product_name || ''} />
                        <Autocomplete
                            options={customerList}
                            onChange={(event, value) => setFollowUp({ ...followUp, customer_id: value?.id || '' })}
                            getOptionLabel={customer => `${customer.first_name || ''} ${customer.last_name || ''}`.trim()}
                            renderInput={params => <TextField {...params} label="Choose customer" />}
                        />
                    </div>
                    <div className="oos-return-modal__actions">
                        <Button onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button variant="contained" disabled={!followUp.customer_id || submitting} onClick={saveFollowUp}>
                            {submitting ? 'Saving...' : 'Add follow-up'}
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default OutOfStockReturn;
