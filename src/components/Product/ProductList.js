import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductServiceService from "./ProductService.service";
import CategoryServiceService from "../Category/CategoryService.service";

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import './ProductList.css';

const ProductList = () => {
    const [categoryId, setCategoryId] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const [productList, setProductList] = useState({ total_value: {}, data: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        ProductServiceService.fetchProductListV2()
            .then(response => setProductList(response.data))
            .catch(error => console.log("error", error));

        CategoryServiceService.getAll()
            .then(response => setCategoryList(response.data))
            .catch(error => console.log("error", error));
    }, []);

    const fetchProductsByCategory = () => {
        setLoading(true);
        ProductServiceService.fetchProductByCategoryId(categoryId)
            .then(response => setProductList(response.data))
            .catch(error => console.log("error", error))
            .finally(() => setLoading(false));
    };

    const products = Array.isArray(productList?.data)
        ? productList.data
        : (Array.isArray(productList) ? productList : []);

    const totalInventoryValue = productList?.total_value?.total_price
        ?? products.reduce(
            (total, product) => total + (Number(product.price || 0) * Number(product.stock || 0)),
            0
        );

    const lowStockCount = products.filter(product => {
        const currentStock = product.stock_warning_type === 'RETAIL'
            ? Number(product.stock_pc || 0)
            : Number(product.stock || 0);
        return currentStock <= Number(product.stock_warning || 0);
    }).length;

    const numberFormat = (value) => new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2
    }).format(Number(value || 0));

    const formatPackage = (product) => {
        if (product.quantity == null || product.weight == null) {
            return product.packaging || 'Package not specified';
        }

        if (Number(product.quantity) === 1) {
            return `${product.weight}${product.variation || ''} ${product.packaging || ''}`.trim();
        }

        const unitWeight = Number(product.weight) / Number(product.quantity);
        const formattedWeight = Number.isInteger(unitWeight)
            ? unitWeight
            : unitWeight.toPrecision(2);
        return `${product.quantity} × ${formattedWeight}${product.variation || ''} / ${product.packaging || 'package'}`;
    };

    return (
        <div className="product-list-page">
            <section className="product-list-header">
                <div>
                    <span className="product-list-eyebrow">Inventory catalogue</span>
                    <h1>Product List</h1>
                    <p>Review product details, pricing, stock levels, suppliers, and order history.</p>
                </div>
                <Link to="/addProduct" className="product-list-add">
                    + Add product
                </Link>
            </section>

            <section className="product-list-summary">
                <div className="product-list-summary__card">
                    <span className="product-list-summary__icon product-list-summary__icon--blue">
                        <Inventory2OutlinedIcon />
                    </span>
                    <div>
                        <span>Total products</span>
                        <strong>{products.length}</strong>
                    </div>
                </div>
                <div className="product-list-summary__card">
                    <span className="product-list-summary__icon product-list-summary__icon--green">
                        <PaymentsOutlinedIcon />
                    </span>
                    <div>
                        <span>Inventory value</span>
                        <strong>{numberFormat(totalInventoryValue)}</strong>
                    </div>
                </div>
                <div className="product-list-summary__card">
                    <span className="product-list-summary__icon product-list-summary__icon--orange">
                        <WarningAmberRoundedIcon />
                    </span>
                    <div>
                        <span>Low-stock products</span>
                        <strong>{lowStockCount}</strong>
                    </div>
                </div>
            </section>

            <section className="product-list-filter">
                <div>
                    <strong>Filter products</strong>
                    <span>Choose a category to narrow the inventory list.</span>
                </div>
                <div className="product-list-filter__controls">
                    <FormControl size="small" className="product-list-category">
                        <InputLabel id="product-list-category-label">Category</InputLabel>
                        <Select
                            labelId="product-list-category-label"
                            value={categoryId}
                            label="Category"
                            onChange={event => setCategoryId(event.target.value)}
                        >
                            <MenuItem value={0}>All categories</MenuItem>
                            {categoryList.map(category => (
                                <MenuItem value={category.id} key={category.id}>
                                    {category.category_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        disabled={loading}
                        onClick={fetchProductsByCategory}
                        startIcon={<SearchIcon />}
                        className="product-list-search"
                    >
                        {loading ? 'Loading...' : 'Apply filter'}
                    </Button>
                </div>
                {loading && <LinearProgress className="product-list-progress" />}
            </section>

            <section className="product-list-table-card">
                <div className="product-list-table-card__header">
                    <div>
                        <h2>Inventory products</h2>
                        <p>{products.length} {products.length === 1 ? 'product' : 'products'} in this view</p>
                    </div>
                    <span className="product-list-result-pill">{products.length} results</span>
                </div>

                <div className="table-responsive">
                    <table className="product-list-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Inventory</th>
                                <th>Stock warning</th>
                                <th>Value</th>
                                <th>Note</th>
                                <th>Status</th>
                                <th aria-label="Actions"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? products.map(product => {
                                const warningStock = product.stock_warning_type === 'RETAIL'
                                    ? Number(product.stock_pc || 0)
                                    : Number(product.stock || 0);
                                const isLowStock = warningStock <= Number(product.stock_warning || 0);

                                return (
                                    <tr key={product.id} className={product.disabled === 1 ? 'product-list-row--disabled' : ''}>
                                        <td>
                                            <div className="product-list-product">
                                                <span className="product-list-product__avatar">
                                                    {product.product_name ? product.product_name.charAt(0).toUpperCase() : '?'}
                                                </span>
                                                <div>
                                                    <strong>{product.product_name}</strong>
                                                    <span>#{product.id} · {product.brand_name || 'No brand'}</span>
                                                    <small>{formatPackage(product)}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="product-list-category-pill">{product.category_name}</span></td>
                                        <td><strong className="product-list-price">{numberFormat(product.price)}</strong></td>
                                        <td>
                                            <div className="product-list-stock">
                                                <div><span>Wholesale</span><strong>{product.stock ?? 0}</strong></div>
                                                <div><span>Pieces</span><strong>{product.stock_pc ?? 0}</strong></div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={isLowStock ? 'product-list-warning product-list-warning--low' : 'product-list-warning'}>
                                                <strong>{product.stock_warning ?? 0}</strong>
                                                <span>{product.stock_warning_type || 'WHOLESALE'}</span>
                                            </div>
                                        </td>
                                        <td><strong>{numberFormat(Number(product.price || 0) * Number(product.stock || 0))}</strong></td>
                                        <td>
                                            <span className={product.note ? 'product-list-note' : 'product-list-note product-list-note--empty'}>
                                                {product.note || 'No note'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={product.disabled === 0 ? 'product-list-status product-list-status--active' : 'product-list-status product-list-status--disabled'}>
                                                {product.disabled === 0
                                                    ? <><CheckCircleRoundedIcon />Active</>
                                                    : <><CancelRoundedIcon />Disabled</>}
                                            </span>
                                        </td>
                                        <td className="product-list-actions">
                                            <div>
                                                <Link to={"/supplierProductList/" + product.id}>Suppliers</Link>
                                                <Link to={"/productOrderTransactionList/" + product.id}>Orders</Link>
                                                <Link to={"/editProduct/" + product.id} className="product-list-actions__primary">Edit</Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="9">
                                        <div className="product-list-empty">
                                            <Inventory2OutlinedIcon />
                                            <h3>No products found</h3>
                                            <p>There are no products available in this category.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default ProductList;
