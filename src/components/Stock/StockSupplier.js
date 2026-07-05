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
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

import './StockWarning.css';
import './StockSupplier.css';

const StockSupplier = () => {
    const [productList, setProductList] = useState({ data: [] });
    const [supplierList, setSupplierList] = useState([]);
    const [supplierId, setSupplierId] = useState(5);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        ProductServiceService.fetchStockPerSupplier(5)
            .then(response => setProductList(response.data))
            .catch(error => console.log("error", error));

        SupplierService.getAll()
            .then(response => setSupplierList(response.data))
            .catch(error => console.log("error", error));
    }, []);

    const fetchProducts = () => {
        setLoading(true);
        ProductServiceService.fetchStockPerSupplier(supplierId)
            .then(response => setProductList(response.data))
            .catch(error => console.log("error", error))
            .finally(() => setLoading(false));
    };

    const products = Array.isArray(productList?.data)
        ? productList.data
        : (Array.isArray(productList) ? productList : []);

    const pendingOrderCount = products.reduce(
        (total, product) => total + (
            Array.isArray(product.pending_orders) ? product.pending_orders.length : 0
        ),
        0
    );

    const lowStockCount = products.filter(product => {
        const currentStock = product.stock_warning_type === 'RETAIL'
            ? Number(product.stock_pc || 0)
            : Number(product.stock || 0);
        return currentStock <= Number(product.stock_warning || 0);
    }).length;

    const formatMoney = (value) => new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2
    }).format(Number(value || 0));

    const formatPackage = (product) => {
        if (product.quantity == null || product.weight == null) {
            return 'Package not specified';
        }
        if (Number(product.quantity) === 1) {
            return `${product.weight}${product.variation || ''}`;
        }

        const unitWeight = Number(product.weight) / Number(product.quantity);
        return `${product.quantity} × ${Number.isInteger(unitWeight) ? unitWeight : unitWeight.toPrecision(2)}${product.variation || ''}`;
    };

    const sumPendingOrderQuantities = (pendingOrders) => {
        const totalsByUnit = pendingOrders.reduce((totals, order) => {
            const quantityMatch = String(order.quantity || '').trim().match(/^(-?\d+(?:\.\d+)?)\s*(.*)$/);
            if (!quantityMatch) return totals;

            const unit = quantityMatch[2].trim().toUpperCase();
            totals[unit] = (totals[unit] || 0) + Number(quantityMatch[1]);
            return totals;
        }, {});

        const totals = Object.entries(totalsByUnit).map(([unit, amount]) =>
            `${amount.toLocaleString()}${unit ? ` ${unit}` : ''}`
        );
        return totals.length ? totals.join(' + ') : 'Not specified';
    };

    return (
        <div className="stock-warning-page stock-supplier-page">
            <section className="stock-warning-hero stock-supplier-hero">
                <div className="stock-warning-hero__icon"><LocalShippingOutlinedIcon /></div>
                <div className="stock-warning-hero__copy">
                    <span className="stock-warning-eyebrow">Supplier inventory</span>
                    <h1>Products by Supplier</h1>
                    <p>Review a supplier's products, current stock, and incoming purchase orders.</p>
                </div>
                <div className="stock-warning-summary">
                    <div className="stock-warning-summary__item">
                        <Inventory2OutlinedIcon />
                        <div><strong>{products.length}</strong><span>Products</span></div>
                    </div>
                    <div className="stock-warning-summary__item">
                        <WarningAmberRoundedIcon />
                        <div><strong>{lowStockCount}</strong><span>Low stock</span></div>
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
                    <p>Choose a supplier to review all products associated with it.</p>
                </div>
                <div className="stock-warning-filter__controls">
                    <FormControl size="small" className="stock-warning-category">
                        <InputLabel id="stock-supplier-label">Supplier</InputLabel>
                        <Select
                            labelId="stock-supplier-label"
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

            <section className="stock-warning-table-card">
                <div className="stock-warning-table-card__header">
                    <div>
                        <h2>Supplier products</h2>
                        <p>{products.length} {products.length === 1 ? 'product' : 'products'} supplied in this view.</p>
                    </div>
                    <span className="stock-warning-live-pill"><span />Live inventory</span>
                </div>

                <div className="table-responsive">
                    <table className="stock-warning-table stock-supplier-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Supplier</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Current stock</th>
                                <th>Pending supplier orders</th>
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
                                    <tr key={product.id} className={product.disabled === 1 ? 'stock-supplier-row--disabled' : ''}>
                                        <td>
                                            <div className="stock-warning-product">
                                                <span className="stock-warning-product__avatar">
                                                    {product.product_name ? product.product_name.charAt(0).toUpperCase() : '?'}
                                                </span>
                                                <div>
                                                    <strong>{product.product_name}</strong>
                                                    <span>#{product.id} · {product.brand_name || 'No brand'}</span>
                                                    <span className="stock-warning-package">{formatPackage(product)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="stock-warning-supplier-pill">{product.supplier_name || 'Not specified'}</span></td>
                                        <td><span className="stock-warning-category-pill">{product.category_name}</span></td>
                                        <td><strong className="stock-supplier-price">{formatMoney(product.price)}</strong></td>
                                        <td>
                                            <div className="stock-warning-levels">
                                                <div><span>Wholesale</span><strong>{product.stock ?? 0}</strong></div>
                                                <div><span>Pieces</span><strong>{product.stock_pc ?? 0}</strong></div>
                                                {isLowStock && (
                                                    <span className="stock-warning-critical">
                                                        <WarningAmberRoundedIcon />Low stock
                                                    </span>
                                                )}
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
                                );
                            }) : (
                                <tr>
                                    <td colSpan="7">
                                        <div className="stock-warning-empty">
                                            <Inventory2OutlinedIcon />
                                            <h3>No supplier products found</h3>
                                            <p>There are no products associated with this supplier.</p>
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

export default StockSupplier;
