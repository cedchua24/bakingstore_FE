import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductServiceService from "../Product/ProductService.service";
import SupplierService from "../Supplier/SupplierService.service";

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import StockSearchBar, { matchesStockSearch } from './StockSearchBar';
import { formatSupplierSentTracking, isSentToSupplier } from './supplierOrderTracking';

import './StockWarning.css';

const StockSupplierWarning = () => {
    const [productList, setProductList] = useState({ data: [] });
    const [supplierList, setSupplierList] = useState([]);
    const [supplierId, setSupplierId] = useState(5);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        ProductServiceService.fetchStockWarningPerSupplier(5)
            .then(response => setProductList(response.data))
            .catch(error => console.log("error", error));

        SupplierService.getAll()
            .then(response => setSupplierList(response.data))
            .catch(error => console.log("error", error));
    }, []);

    const fetchProducts = () => {
        setLoading(true);
        ProductServiceService.fetchStockWarningPerSupplier(supplierId)
            .then(response => setProductList(response.data))
            .catch(error => console.log("error", error))
            .finally(() => setLoading(false));
    };

    const products = Array.isArray(productList.data) ? productList.data : [];
    const filteredProducts = products.filter(item => matchesStockSearch(item, searchQuery));
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

    return (
        <div className="stock-warning-page">
            <section className="stock-warning-hero">
                <div className="stock-warning-hero__icon">
                    <WarningAmberRoundedIcon />
                </div>
                <div className="stock-warning-hero__copy">
                    <span className="stock-warning-eyebrow">Supplier inventory monitor</span>
                    <h1>Stock Warning by Supplier</h1>
                    <p>Review low-stock products and incoming purchase orders for the selected supplier.</p>
                </div>
                <div className="stock-warning-summary">
                    <div className="stock-warning-summary__item">
                        <Inventory2OutlinedIcon />
                        <div><strong>{products.length}</strong><span>Low-stock products</span></div>
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
                    <p>Choose a supplier to review its low-stock products.</p>
                </div>
                <div className="stock-warning-filter__controls">
                    <FormControl size="small" className="stock-warning-category">
                        <InputLabel id="stock-supplier-warning-label">Supplier</InputLabel>
                        <Select
                            labelId="stock-supplier-warning-label"
                            value={supplierId}
                            label="Supplier"
                            onChange={event => setSupplierId(event.target.value)}
                        >
                            {supplierList.map(supplier => (
                                <MenuItem value={supplier.id} key={supplier.id}>
                                    {supplier.supplier_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        disabled={loading}
                        onClick={fetchProducts}
                        startIcon={<SearchIcon />}
                        className="stock-warning-search"
                    >
                        {loading ? 'Loading...' : 'Apply filter'}
                    </Button>
                </div>
                {loading && <LinearProgress color="warning" className="stock-warning-progress" />}
            </section>

            <StockSearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search products or suppliers..." />
            <section className="stock-warning-table-card">
                <div className="stock-warning-table-card__header">
                    <div>
                        <h2>Products needing attention</h2>
                        <p>{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found.</p>
                    </div>
                    <span className="stock-warning-live-pill"><span />Live inventory</span>
                </div>

                <div className="table-responsive">
                    <table className="stock-warning-table stock-balanced-table stock-supplier-warning-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Supplier</th>
                                <th>Category</th>
                                <th>Warning level</th>
                                <th>Current stock</th>
                                <th>Pending supplier orders</th>
                                <th>History</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? filteredProducts.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="stock-warning-product">
                                            <div>
                                                <strong>{product.product_name}</strong>
                                                <span>#{product.id} · {product.brand_name || 'No brand'}</span>
                                                <span className="stock-warning-package">{formatProductPackage(product)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="stock-warning-supplier-pill">{product.supplier_name || 'Not specified'}</span></td>
                                    <td><span className="stock-warning-category-pill">{product.category_name}</span></td>
                                    <td>
                                        <div className="stock-warning-threshold">
                                            <strong>{product.stock_warning}</strong>
                                            <span>{product.stock_warning_type === 'WHOLESALE' ? 'wholesale units' : 'pieces'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="stock-warning-levels">
                                            <div><span>Wholesale</span><strong>{product.stock ?? 0}</strong></div>
                                            <div><span>Pieces</span><strong>{product.stock_pc ?? 0}</strong></div>
                                            <span className="stock-warning-critical">
                                                <WarningAmberRoundedIcon />Low stock
                                            </span>
                                        </div>
                                    </td>
                                    <td className="stock-warning-orders-cell">
                                        {Array.isArray(product.pending_orders) && product.pending_orders.length > 0 ? (
                                            <div className="stock-warning-orders">
                                                {product.pending_orders.length > 1 && (
                                                    <div className="stock-warning-orders__summary">
                                                        <span>{product.pending_orders.length} pending orders</span>
                                                        <div>
                                                            <small>Total incoming</small>
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
                                                            <span>Incoming</span><strong>{order.quantity}</strong>
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
                                        <Link to={"/viewTransaction/" + product.id} className="stock-warning-history-link">
                                            View history
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7">
                                        <div className="stock-warning-empty">
                                            <Inventory2OutlinedIcon />
                                            <h3>No stock warnings found</h3>
                                            <p>There are no low-stock products for this supplier.</p>
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

export default StockSupplierWarning;
