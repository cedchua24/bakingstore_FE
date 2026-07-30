import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductServiceService from "./ProductService.service";
import CategoryServiceService from "../Category/CategoryService.service";
import OrderSupplierServiceService from "../OrderSupplierTransaction/OrderSupplierServiceService";

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';

import './ProductList.css';

const ProductList = () => {
    const [categoryId, setCategoryId] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const [productList, setProductList] = useState({ total_value: {}, data: [] });
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceHistoryProduct, setPriceHistoryProduct] = useState(null);
    const [priceHistory, setPriceHistory] = useState([]);
    const [priceHistoryLoading, setPriceHistoryLoading] = useState(false);
    const [priceHistoryError, setPriceHistoryError] = useState('');

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
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const filteredProducts = products.filter(product => !normalizedSearch || [
        product.id,
        product.product_name,
        product.category_name,
        product.brand_name,
        product.packaging,
        product.note
    ].some(value => String(value ?? '').toLowerCase().includes(normalizedSearch)));

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

    const viewPriceHistory = (product) => {
        setPriceHistoryProduct(product);
        setPriceHistory([]);
        setPriceHistoryError('');
        setPriceHistoryLoading(true);

        OrderSupplierServiceService.fetchPriceHistory(product.id)
            .then(response => {
                const payload = response.data;
                const history = Array.isArray(payload)
                    ? payload
                    : (Array.isArray(payload?.data) ? payload.data : []);
                setPriceHistory(history);
            })
            .catch(() => setPriceHistoryError('Unable to load the price history. Please try again.'))
            .finally(() => setPriceHistoryLoading(false));
    };

    const closePriceHistory = () => {
        if (!priceHistoryLoading) {
            setPriceHistoryProduct(null);
        }
    };

    const formatHistoryDate = (entry) => {
        const value = entry.order_date ?? entry.date ?? entry.created_at;
        if (!value) return '—';

        const parsedDate = new Date(value);
        return Number.isNaN(parsedDate.getTime())
            ? value
            : parsedDate.toLocaleDateString('en-PH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
    };

    const formatHistoryUnit = (entry) => {
        const orderType = String(
            entry.business_type ?? entry.order_type ?? entry.pricing_variation ?? entry.variation ?? ''
        ).toUpperCase();
        const unitPrice = Number(entry.price ?? entry.unit_price);
        const wholesalePrice = Number(entry.real_price);
        const isRetail = orderType === 'RETAIL'
            || (
                orderType !== 'WHOLESALE'
                && Number.isFinite(unitPrice)
                && Number.isFinite(wholesalePrice)
                && wholesalePrice > 0
                && unitPrice !== wholesalePrice
            );

        return isRetail
            ? 'PC'
            : String(entry.packaging ?? priceHistoryProduct?.packaging ?? 'BOX').toUpperCase();
    };

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
                    <TextField
                        size="small"
                        value={searchQuery}
                        onChange={event => setSearchQuery(event.target.value)}
                        placeholder="Search products..."
                        className="product-list-product-search"
                        inputProps={{ 'aria-label': 'Search products' }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
                        }}
                    />
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
                        <p>{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found</p>
                    </div>
                    <span className="product-list-result-pill">{filteredProducts.length} results</span>
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
                                <th>Status</th>
                                <th aria-label="Actions"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? filteredProducts.map(product => {
                                const warningStock = product.stock_warning_type === 'RETAIL'
                                    ? Number(product.stock_pc || 0)
                                    : Number(product.stock || 0);
                                const isLowStock = warningStock <= Number(product.stock_warning || 0);

                                return (
                                    <tr key={product.id} className={product.disabled === 1 ? 'product-list-row--disabled' : ''}>
                                        <td>
                                            <div className="product-list-product">
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
                                            <span className={product.disabled === 0 ? 'product-list-status product-list-status--active' : 'product-list-status product-list-status--disabled'}>
                                                {product.disabled === 0
                                                    ? <><CheckCircleRoundedIcon />Active</>
                                                    : <><CancelRoundedIcon />Disabled</>}
                                            </span>
                                        </td>
                                        <td className="product-list-actions">
                                            <div>
                                                <button type="button" onClick={() => viewPriceHistory(product)}>
                                                    Price history
                                                </button>
                                                <Link to={"/supplierProductList/" + product.id}>Suppliers</Link>
                                                <Link to={"/productOrderTransactionList/" + product.id}>Orders</Link>
                                                <Link to={"/editProduct/" + product.id} className="product-list-actions__primary">Edit</Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="8">
                                        <div className="product-list-empty">
                                            <Inventory2OutlinedIcon />
                                            <h3>No products found</h3>
                                            <p>Try another category or search term.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <Dialog
                open={Boolean(priceHistoryProduct)}
                onClose={closePriceHistory}
                fullWidth
                maxWidth="md"
                aria-labelledby="price-history-title"
            >
                <DialogTitle id="price-history-title" className="price-history-title">
                    <span><HistoryRoundedIcon /> Price history</span>
                    <small>{priceHistoryProduct?.product_name}</small>
                </DialogTitle>
                <DialogContent dividers>
                    {priceHistoryLoading ? (
                        <div className="price-history-loading">
                            <CircularProgress size={28} />
                            <span>Loading price history...</span>
                        </div>
                    ) : priceHistoryError ? (
                        <Alert severity="error">{priceHistoryError}</Alert>
                    ) : priceHistory.length > 0 ? (
                        <div className="table-responsive">
                            <table className="price-history-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Purchase order</th>
                                        <th>Supplier</th>
                                        <th>Unit</th>
                                        <th>Unit price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {priceHistory.map((entry, index) => {
                                        const unitPrice = entry.price ?? entry.unit_price ?? entry.real_price;
                                        const purchaseOrderId = entry.order_supplier_transaction_id;
                                        return (
                                            <tr key={entry.id ?? `${formatHistoryDate(entry)}-${index}`}>
                                                <td>{formatHistoryDate(entry)}</td>
                                                <td>
                                                    {purchaseOrderId
                                                        ? (
                                                            <Link
                                                                className="price-history-po-link"
                                                                to={`/orderSupplierApproval/${purchaseOrderId}`}
                                                            >
                                                                #{purchaseOrderId}
                                                            </Link>
                                                        )
                                                        : '\u2014'}
                                                </td>
                                                <td>{entry.supplier_name ?? entry.supplier?.supplier_name ?? entry.supplier?.name ?? '—'}</td>
                                                <td><strong>{formatHistoryUnit(entry)}</strong></td>
                                                <td><strong>{numberFormat(unitPrice)}</strong></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="price-history-empty">
                            <HistoryRoundedIcon />
                            <h3>No price history</h3>
                            <p>No supplier price records were found for this product.</p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closePriceHistory} disabled={priceHistoryLoading}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProductList;
