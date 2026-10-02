import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import ProductServiceService from "../Product/ProductService.service";
import CategoryServiceService from "../Category/CategoryService.service";
import SupplierServiceService from "../Supplier/SupplierService.service";

import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import SearchIcon from '@mui/icons-material/Search';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import StockSearchBar from './StockSearchBar';
import { formatSupplierSentTracking, isSentToSupplier } from './supplierOrderTracking';

import './StockWarning.css';

const NoStock = () => {
    const [productList, setProductList] = useState({ data: [] });
    const [categoryList, setCategoryList] = useState([]);
    const [supplierList, setSupplierList] = useState([]);
    const [categoryId, setCategoryId] = useState(0);
    const [supplierId, setSupplierId] = useState(0);
    const [appliedCategoryId, setAppliedCategoryId] = useState(0);
    const [appliedSupplierId, setAppliedSupplierId] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const requestSequence = useRef(0);
    const skipNextDebouncedFetch = useRef(false);

    useEffect(() => {
        CategoryServiceService.getAll()
            .then(response => setCategoryList(response.data))
            .catch(error => console.log("error", error));

        SupplierServiceService.getAll()
            .then(response => setSupplierList(response.data?.data || response.data || []))
            .catch(error => console.log("error", error));
    }, []);

    const fetchProducts = useCallback((filters = {}) => {
        const currentRequest = requestSequence.current + 1;
        requestSequence.current = currentRequest;
        setLoading(true);
        return ProductServiceService.fetchOutOfStock({
            category_id: filters.categoryId ?? appliedCategoryId,
            supplier_id: filters.supplierId ?? appliedSupplierId,
            search: filters.search ?? searchQuery.trim()
        })
            .then(response => {
                if (currentRequest === requestSequence.current) setProductList(response.data);
            })
            .catch(error => console.log("error", error))
            .finally(() => {
                if (currentRequest === requestSequence.current) setLoading(false);
            });
    }, [appliedCategoryId, appliedSupplierId, searchQuery]);

    useEffect(() => {
        if (skipNextDebouncedFetch.current) {
            skipNextDebouncedFetch.current = false;
            return undefined;
        }
        const timeoutId = setTimeout(() => fetchProducts(), 400);
        return () => clearTimeout(timeoutId);
    }, [fetchProducts]);

    const applyFilters = () => {
        const filtersChanged = categoryId !== appliedCategoryId || supplierId !== appliedSupplierId;
        if (filtersChanged) skipNextDebouncedFetch.current = true;
        setAppliedCategoryId(categoryId);
        setAppliedSupplierId(supplierId);
        fetchProducts({ categoryId, supplierId });
    };

    const productRows = Array.isArray(productList?.data)
        ? productList.data
        : (Array.isArray(productList) ? productList : []);
    const products = Array.from(
        productRows.reduce((productsById, product) => {
            if (!productsById.has(product.id)) productsById.set(product.id, product);
            return productsById;
        }, new Map()).values()
    );
    const filteredProducts = products;
    const pendingOrderCount = products.reduce(
        (total, product) => total + (
            Array.isArray(product.pending_orders) ? product.pending_orders.length : 0
        ),
        0
    );

    const formatProductPackage = (product) => {
        if (product.quantity == null || product.weight == null) {
            return 'Package not specified';
        }

        if (product.quantity === 1) {
            return `${product.weight}${product.variation || ''}`;
        }

        const unitWeight = product.weight / product.quantity;
        return `${product.quantity} × ${Number.isInteger(unitWeight) ? unitWeight : unitWeight.toPrecision(2)}${product.variation || ''}`;
    };

    const sumPendingOrderQuantities = (pendingOrders) => {
        const totalsByUnit = pendingOrders.reduce((totals, pendingOrder) => {
            const quantityMatch = String(pendingOrder.quantity || '').trim().match(/^(-?\d+(?:\.\d+)?)\s*(.*)$/);
            if (!quantityMatch) return totals;

            const unit = quantityMatch[2].trim().toUpperCase();
            totals[unit] = (totals[unit] || 0) + Number(quantityMatch[1]);
            return totals;
        }, {});

        const totals = Object.entries(totalsByUnit).map(([unit, amount]) =>
            `${amount.toLocaleString()}${unit ? ` ${unit}` : ''}`
        );
        return totals.length > 0 ? totals.join(' + ') : 'Not specified';
    };

    const formatDate = (date) => {
        if (!date) return 'Not recorded';
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) return 'Not recorded';

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        }).format(parsedDate);
    };

    return (
        <div className="stock-warning-page">
            <section className="stock-warning-hero stock-warning-hero--out">
                <div className="stock-warning-hero__icon">
                    <ErrorOutlineRoundedIcon />
                </div>
                <div className="stock-warning-hero__copy">
                    <span className="stock-warning-eyebrow">Critical inventory monitor</span>
                    <h1>Out-of-Stock Products</h1>
                    <p>Track unavailable products and confirm whether replacement stock is already on order.</p>
                </div>
                <div className="stock-warning-summary">
                    <div className="stock-warning-summary__item">
                        <Inventory2OutlinedIcon />
                        <div><strong>{products.length}</strong><span>Out-of-stock products</span></div>
                    </div>
                    <div className="stock-warning-summary__item">
                        <LocalShippingOutlinedIcon />
                        <div><strong>{pendingOrderCount}</strong><span>Pending orders</span></div>
                    </div>
                </div>
            </section>

            <section className="stock-warning-filter">
                <div>
                    <span className="stock-warning-filter__label">Filter inventory</span>
                    <p>Choose a category or supplier to narrow the out-of-stock list.</p>
                </div>
                <div className="stock-warning-filter__controls">
                    <Autocomplete
                        size="small"
                        className="stock-warning-category"
                        options={[{ id: 0, category_name: 'All categories' }, ...categoryList]}
                        value={[{ id: 0, category_name: 'All categories' }, ...categoryList].find(category => Number(category.id) === Number(categoryId)) || null}
                        onChange={(_, category) => setCategoryId(category?.id || 0)}
                        getOptionLabel={category => category.category_name || ''}
                        isOptionEqualToValue={(option, value) => Number(option.id) === Number(value.id)}
                        renderInput={params => <TextField {...params} label="Category" placeholder="Search categories" />}
                    />
                    <Autocomplete
                        size="small"
                        className="stock-warning-category"
                        options={[{ id: 0, supplier_name: 'All suppliers' }, ...supplierList]}
                        value={[{ id: 0, supplier_name: 'All suppliers' }, ...supplierList].find(supplier => Number(supplier.id) === Number(supplierId)) || null}
                        onChange={(_, supplier) => setSupplierId(supplier?.id || 0)}
                        getOptionLabel={supplier => supplier.supplier_name || ''}
                        isOptionEqualToValue={(option, value) => Number(option.id) === Number(value.id)}
                        renderInput={params => <TextField {...params} label="Supplier" placeholder="Search suppliers" />}
                    />
                    <Button
                        variant="contained"
                        disabled={loading}
                        onClick={applyFilters}
                        startIcon={<SearchIcon />}
                        className="stock-warning-search"
                    >
                        {loading ? 'Loading...' : 'Apply filter'}
                    </Button>
                </div>
                {loading && <LinearProgress color="warning" className="stock-warning-progress" />}
            </section>

            <StockSearchBar value={searchQuery} onChange={setSearchQuery} />
            <section className="stock-warning-table-card">
                <div className="stock-warning-table-card__header">
                    <div>
                        <h2>Products requiring restock</h2>
                        <p>{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found.</p>
                    </div>
                    <span className="stock-warning-critical stock-warning-critical--header">
                        <ErrorOutlineRoundedIcon />Immediate attention
                    </span>
                </div>

                <div className="table-responsive">
                    <table className="stock-warning-table stock-balanced-table no-stock-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Current stock</th>
                                <th>Last stock date</th>
                                <th>Pending supplier orders</th>
                                <th>History</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? filteredProducts.map(product => (
                                <tr key={`out-of-stock-${product.id}`}>
                                    <td>
                                        <div className="stock-warning-product">
                                            <div>
                                                <strong>{product.product_name}</strong>
                                                <span>#{product.id} · {product.brand_name || 'No brand'}</span>
                                                <span className="stock-warning-package">{formatProductPackage(product)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="stock-warning-category-pill">{product.category_name}</span></td>
                                    <td><span className="stock-warning-out-pill">Out of stock</span></td>
                                    <td>
                                        <div className="stock-warning-levels">
                                            <div><span>Wholesale</span><strong>{product.stock ?? 0}</strong></div>
                                            <div><span>Pieces</span><strong>{product.stock_pc ?? 0}</strong></div>
                                        </div>
                                    </td>
                                    <td><span className="stock-warning-date">{formatDate(product.updated_at)}</span></td>
                                    <td className="stock-warning-orders-cell">
                                        {Array.isArray(product.pending_orders) && product.pending_orders.length > 0 ? (
                                            <div className="stock-warning-orders">
                                                {product.pending_orders.length > 1 && (
                                                    <div className="stock-warning-orders__summary">
                                                        <span>{product.pending_orders.length} pending orders</span>
                                                        <div>
                                                            <small>Total quantity</small>
                                                            <strong>{sumPendingOrderQuantities(product.pending_orders)}</strong>
                                                        </div>
                                                    </div>
                                                )}
                                                {product.pending_orders.map(order => (
                                                    <Link
                                                        to={"/orderSupplierApproval/" + order.order_supplier_transaction_id}
                                                        className="stock-warning-order"
                                                        key={order.order_supplier_transaction_id}
                                                    >
                                                        <div className="stock-warning-order__icon"><LocalShippingOutlinedIcon /></div>
                                                        <div className="stock-warning-order__details">
                                                            <strong>{order.supplier}</strong>
                                                            <span>PO #{order.order_supplier_transaction_id} · {order.date}</span>
                                                            <span className={`stock-warning-order__status stock-warning-order__status--${String(order.status || 'PENDING').toLowerCase()}`}>
                                                                {String(order.status || 'PENDING').replaceAll('_', ' ')}
                                                            </span>
                                                            {isSentToSupplier(order.status) && order.send_date && (
                                                                <span className="stock-warning-order__sent-age">
                                                                    {formatSupplierSentTracking(order.send_date)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="stock-warning-order__quantity">
                                                            <span>{String(order.status || '').toUpperCase() === 'SEND_TO_SUPPLIER' ? 'Incoming' : ''}</span><strong>{order.quantity}</strong>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="stock-warning-no-orders">
                                                <LocalShippingOutlinedIcon /><span>No pending supplier order</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="stock-warning-actions">
                                        <div className="stock-warning-action-stack">
                                            <Link to={"/viewTransaction/" + product.id} className="stock-warning-history-link">
                                                Stock history
                                            </Link>
                                            <Link to={"/viewOutOfStockHistory/" + product.id} className="stock-warning-history-link">
                                                OOS history
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7">
                                        <div className="stock-warning-empty">
                                            <Inventory2OutlinedIcon />
                                            <h3>No out-of-stock products</h3>
                                            <p>There are no unavailable products in this category.</p>
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

export default NoStock;
