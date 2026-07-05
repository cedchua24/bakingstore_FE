import React, { useEffect, useMemo, useState } from "react";

import ProductService from "../Product/ProductService.service";
import CategoryService from "../Category/CategoryService.service";

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import './MarkUpPrice.css';
import './MarkUpNewPrice.css';

const MarkUpNewPrice = () => {
    const [productList, setProductList] = useState({ data: [] });
    const [categoryList, setCategoryList] = useState([]);
    const [categoryId, setCategoryId] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        ProductService.fetchProductValue(0)
            .then(response => setProductList(response.data))
            .catch(error => console.log("error", error));

        CategoryService.getAll()
            .then(response => setCategoryList(response.data))
            .catch(error => console.log("error", error));
    }, []);

    const allProducts = Array.isArray(productList?.data) ? productList.data : [];
    const changedProducts = useMemo(
        () => allProducts.filter(product => Number(product.price) !== Number(product.mup_price)),
        [allProducts]
    );

    const totals = useMemo(() => changedProducts.reduce((summary, product) => {
        summary.previous += Number(product.mup_price || 0);
        summary.current += Number(product.price || 0);
        return summary;
    }, { previous: 0, current: 0 }), [changedProducts]);

    const fetchProducts = () => {
        setLoading(true);
        ProductService.fetchProductValue(categoryId)
            .then(response => setProductList(response.data))
            .catch(error => console.log("error", error))
            .finally(() => setLoading(false));
    };

    const formatMoney = value => new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2
    }).format(Number(value || 0));

    const formatPackage = product => {
        if (product.quantity == null || product.weight == null) return product.packaging || 'Package not specified';
        if (Number(product.quantity) === 1) return `${product.weight}${product.variation || ''}`;
        const unitWeight = Number(product.weight) / Number(product.quantity);
        return `${product.quantity} × ${Number.isInteger(unitWeight) ? unitWeight : unitWeight.toPrecision(2)}${product.variation || ''} / ${product.packaging || 'package'}`;
    };

    return (
        <div className="markup-page">
            <section className="markup-hero markup-new-hero">
                <div className="markup-hero__icon"><PriceChangeOutlinedIcon /></div>
                <div className="markup-hero__copy">
                    <span>Price discrepancy review</span>
                    <h1>Mark Up New Price</h1>
                    <p>Compare saved markup prices against each product's current selling price.</p>
                </div>
                <div className="markup-hero__summary">
                    <TrendingUpRoundedIcon />
                    <div><strong>{changedProducts.length}</strong><span>Price changes</span></div>
                </div>
            </section>

            <section className="markup-new-summary">
                <div><span>Previous price total</span><strong>{formatMoney(totals.previous)}</strong></div>
                <div><span>Current price total</span><strong>{formatMoney(totals.current)}</strong></div>
                <div><span>Net price movement</span><strong className={totals.current - totals.previous >= 0 ? 'markup-new-positive' : 'markup-new-negative'}>{formatMoney(totals.current - totals.previous)}</strong></div>
            </section>

            <section className="markup-new-filter">
                <div><strong>Filter price changes</strong><span>Choose a category to narrow the discrepancy list.</span></div>
                <div className="markup-new-filter__controls">
                    <FormControl size="small" className="markup-new-category">
                        <InputLabel id="markup-new-category-label">Category</InputLabel>
                        <Select
                            labelId="markup-new-category-label"
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
                        className="markup-new-search"
                    >
                        {loading ? 'Loading...' : 'Apply filter'}
                    </Button>
                </div>
                {loading && <LinearProgress className="markup-new-progress" />}
            </section>

            <section className="markup-list-card">
                <div className="markup-list-card__header">
                    <div><h2>Products with new prices</h2><p>{changedProducts.length} products differ from their saved markup price.</p></div>
                    <span><PriceChangeOutlinedIcon />Changes only</span>
                </div>
                <div className="table-responsive">
                    <table className="markup-new-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Previous price</th>
                                <th>Current price</th>
                                <th>Change</th>
                                <th>Inventory</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {changedProducts.length > 0 ? changedProducts.map(product => {
                                const difference = Number(product.price || 0) - Number(product.mup_price || 0);
                                const percentage = Number(product.mup_price || 0) > 0
                                    ? (difference / Number(product.mup_price)) * 100
                                    : 0;
                                return (
                                    <tr key={product.id}>
                                        <td>
                                            <div className="markup-list-product">
                                                <span>{product.product_name ? product.product_name.charAt(0).toUpperCase() : '?'}</span>
                                                <div>
                                                    <strong>{product.product_name}</strong>
                                                    <small>#{product.id} · {product.brand_name || 'No brand'}</small>
                                                    <em className="markup-new-package">{formatPackage(product)}</em>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="markup-new-category-pill">{product.category_name}</span></td>
                                        <td>{formatMoney(product.mup_price)}</td>
                                        <td><strong className="markup-selling-price">{formatMoney(product.price)}</strong></td>
                                        <td>
                                            <span className={difference >= 0 ? 'markup-new-change markup-new-change--up' : 'markup-new-change markup-new-change--down'}>
                                                {difference >= 0 ? '+' : ''}{formatMoney(difference)}
                                                <small>{percentage >= 0 ? '+' : ''}{percentage.toFixed(1)}%</small>
                                            </span>
                                        </td>
                                        <td>
                                            <div className="markup-new-stock">
                                                <span>Wholesale <strong>{product.stock ?? 0}</strong></span>
                                                <span>Pieces <strong>{product.stock_pc ?? 0}</strong></span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={product.disabled === 0 ? 'markup-new-status markup-new-status--active' : 'markup-new-status markup-new-status--disabled'}>
                                                {product.disabled === 0
                                                    ? <><CheckCircleRoundedIcon />Active</>
                                                    : <><CancelRoundedIcon />Disabled</>}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="7">
                                        <div className="markup-list-empty">
                                            <Inventory2OutlinedIcon />
                                            <h3>No price changes found</h3>
                                            <p>Current prices match the saved markup prices.</p>
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

export default MarkUpNewPrice;
