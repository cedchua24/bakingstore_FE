import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductServiceService from "../Product/ProductService.service";
import CustomerService from "../Customer/CustomerService";
import CategoryServiceService from "../Category/CategoryService.service";
import OutOfStockUpdateService from "../OtherService/OutOfStockUpdateService";

import Autocomplete from '@mui/material/Autocomplete';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import SearchIcon from '@mui/icons-material/Search';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import StockSearchBar, { matchesStockSearch } from './StockSearchBar';

import './StockWarning.css';
import './StockList.css';

const emptyProduct = {
    id: 0,
    product_name: '',
    packaging: '',
    quantity: 0,
    stock_reason: '',
    stock: 0,
    type: '',
    stock_pc: 0,
    newStocks: '',
    pack: ''
};

const StockList = () => {
    const [productList, setProductList] = useState({ data: [] });
    const [categoryId, setCategoryId] = useState(2);
    const [categoryList, setCategoryList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [filterLoading, setFilterLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [modifyOpen, setModifyOpen] = useState(false);
    const [notifyOpen, setNotifyOpen] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [customerFollowUp, setCustomerFollowUp] = useState({
        product_id: 0,
        product_name: '',
        customer_id: ''
    });

    useEffect(() => {
        ProductServiceService.fetchProductByCategoryId(2)
            .then(response => setProductList(response.data))
            .catch(error => console.log("error", error));

        CategoryServiceService.getAll()
            .then(response => setCategoryList(response.data))
            .catch(error => console.log("error", error));

        CustomerService.fetchCustomerEnabled()
            .then(response => setCustomerList(response.data))
            .catch(error => console.log("error", error));
    }, []);

    const fetchProducts = (selectedCategoryId = categoryId) => {
        setFilterLoading(true);
        ProductServiceService.fetchProductByCategoryId(selectedCategoryId)
            .then(response => setProductList(response.data))
            .catch(error => console.log("error", error))
            .finally(() => setFilterLoading(false));
    };

    const products = Array.isArray(productList?.data)
        ? productList.data
        : (Array.isArray(productList) ? productList : []);
    const filteredProducts = products.filter(item => matchesStockSearch(item, searchQuery));

    const pendingOrderCount = products.reduce(
        (total, currentProduct) => total + (
            Array.isArray(currentProduct.pending_orders)
                ? currentProduct.pending_orders.length
                : 0
        ),
        0
    );

    const lowStockCount = products.filter(currentProduct => {
        const currentStock = currentProduct.stock_warning_type === 'RETAIL'
            ? Number(currentProduct.stock_pc || 0)
            : Number(currentProduct.stock || 0);
        return currentStock <= Number(currentProduct.stock_warning || 0);
    }).length;

    const formatMoney = (value) => new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2
    }).format(Number(value || 0));

    const formatPackage = (currentProduct) => {
        if (currentProduct.quantity == null || currentProduct.weight == null) {
            return 'Package not specified';
        }
        if (Number(currentProduct.quantity) === 1) {
            return `${currentProduct.weight}${currentProduct.variation || ''}`;
        }

        const unitWeight = Number(currentProduct.weight) / Number(currentProduct.quantity);
        return `${currentProduct.quantity} × ${Number.isInteger(unitWeight) ? unitWeight : unitWeight.toPrecision(2)}${currentProduct.variation || ''}`;
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

    const openModifyStock = (productId) => {
        ProductServiceService.get(productId)
            .then(response => {
                setProduct({
                    ...response.data,
                    newStocks: '',
                    stock_reason: '',
                    type: '',
                    pack: ''
                });
                setModifyOpen(true);
            })
            .catch(error => console.log("error", error));
    };

    const updateProduct = () => {
        setSubmitLoading(true);
        ProductServiceService.update(product.id, product)
            .then(() => {
                setModifyOpen(false);
                setProduct(emptyProduct);
                fetchProducts();
            })
            .catch(error => console.log(error))
            .finally(() => setSubmitLoading(false));
    };

    const openCustomerFollowUp = (currentProduct) => {
        setCustomerFollowUp({
            product_id: currentProduct.id,
            product_name: currentProduct.product_name,
            customer_id: ''
        });
        setNotifyOpen(true);
    };

    const saveCustomerFollowUp = () => {
        setSubmitLoading(true);
        OutOfStockUpdateService.create(customerFollowUp)
            .then(() => {
                setNotifyOpen(false);
                setCustomerFollowUp({ product_id: 0, product_name: '', customer_id: '' });
            })
            .catch(error => console.log(error))
            .finally(() => setSubmitLoading(false));
    };

    const canModifyStock = Boolean(
        product.pack
        && product.type
        && String(product.newStocks).trim()
        && Number.isFinite(Number(product.newStocks))
        && Number(product.newStocks) !== 0
        && String(product.stock_reason || '').trim()
    );

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(440px, calc(100vw - 28px))',
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
        bgcolor: 'background.paper',
        borderRadius: '14px',
        boxShadow: 24,
        p: 3
    };

    return (
        <div className="stock-warning-page stock-list-page">
            <section className="stock-warning-hero stock-list-hero">
                <div className="stock-warning-hero__icon"><Inventory2OutlinedIcon /></div>
                <div className="stock-warning-hero__copy">
                    <span className="stock-warning-eyebrow">Inventory management</span>
                    <h1>Stock List</h1>
                    <p>Monitor inventory, incoming supplier orders, customer follow-ups, and stock adjustments.</p>
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
                    <p>Choose a category to view its current stock.</p>
                </div>
                <div className="stock-warning-filter__controls">
                    <FormControl size="small" className="stock-warning-category">
                        <InputLabel id="stock-list-category-label">Category</InputLabel>
                        <Select
                            labelId="stock-list-category-label"
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
                        disabled={filterLoading}
                        onClick={() => fetchProducts()}
                        startIcon={<SearchIcon />}
                        className="stock-warning-search"
                    >
                        {filterLoading ? 'Loading...' : 'Apply filter'}
                    </Button>
                </div>
                {filterLoading && <LinearProgress color="warning" className="stock-warning-progress" />}
            </section>

            <StockSearchBar value={searchQuery} onChange={setSearchQuery} />

            <section className="stock-warning-table-card">
                <div className="stock-warning-table-card__header">
                    <div>
                        <h2>Current inventory</h2>
                        <p>{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found.</p>
                    </div>
                    <span className="stock-warning-live-pill"><span />Live inventory</span>
                </div>

                <div className="table-responsive">
                    <table className="stock-warning-table stock-list-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Warning level</th>
                                <th>Current stock</th>
                                <th>Pending supplier orders</th>
                                <th aria-label="Actions"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? filteredProducts.map(currentProduct => {
                                const warningStock = currentProduct.stock_warning_type === 'RETAIL'
                                    ? Number(currentProduct.stock_pc || 0)
                                    : Number(currentProduct.stock || 0);
                                const isLowStock = warningStock <= Number(currentProduct.stock_warning || 0);

                                return (
                                    <tr key={currentProduct.id}>
                                        <td>
                                            <div className="stock-warning-product">
                                                <div>
                                                    <strong>{currentProduct.product_name}</strong>
                                                    <span>#{currentProduct.id} · {currentProduct.brand_name || 'No brand'}</span>
                                                    <span className="stock-warning-package">{formatPackage(currentProduct)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="stock-warning-category-pill">{currentProduct.category_name}</span></td>
                                        <td><strong className="stock-list-price">{formatMoney(currentProduct.price)}</strong></td>
                                        <td>
                                            <div className="stock-warning-threshold">
                                                <strong className={isLowStock ? '' : 'stock-list-threshold--healthy'}>
                                                    {currentProduct.stock_warning ?? 0}
                                                </strong>
                                                <span>{currentProduct.stock_warning_type === 'RETAIL' ? 'pieces' : 'wholesale units'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="stock-warning-levels">
                                                <div><span>Wholesale</span><strong>{currentProduct.stock ?? 0}</strong></div>
                                                <div><span>Pieces</span><strong>{currentProduct.stock_pc ?? 0}</strong></div>
                                                {isLowStock && (
                                                    <span className="stock-warning-critical">
                                                        <WarningAmberRoundedIcon />Low stock
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="stock-warning-orders-cell">
                                            {Array.isArray(currentProduct.pending_orders) && currentProduct.pending_orders.length > 0 ? (
                                                <div className="stock-warning-orders">
                                                    {currentProduct.pending_orders.length > 1 && (
                                                        <div className="stock-warning-orders__summary">
                                                            <span>{currentProduct.pending_orders.length} pending orders</span>
                                                            <div>
                                                                <small>Total incoming</small>
                                                                <strong>{sumPendingOrderQuantities(currentProduct.pending_orders)}</strong>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {currentProduct.pending_orders.map(order => (
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
                                        <td className="stock-list-actions">
                                            <div>
                                                <button type="button" onClick={() => openModifyStock(currentProduct.id)}>
                                                    <EditOutlinedIcon />Modify
                                                </button>
                                                <button type="button" onClick={() => openCustomerFollowUp(currentProduct)}>
                                                    <PersonAddAltOutlinedIcon />Follow up
                                                </button>
                                                <Link to={"/viewStockTransactionList/" + currentProduct.id}>Stock history</Link>
                                                <Link to={"/viewOutOfStockHistory/" + currentProduct.id}>OOS history</Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="7">
                                        <div className="stock-warning-empty">
                                            <Inventory2OutlinedIcon />
                                            <h3>No stock records found</h3>
                                            <p>There are no products available in this category.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <Modal open={modifyOpen} onClose={() => setModifyOpen(false)}>
                <Box sx={modalStyle}>
                    <div className="stock-list-modal__header">
                        <span><EditOutlinedIcon /></span>
                        <div><h2>Modify stock</h2><p>Record a manual inventory adjustment.</p></div>
                    </div>
                    {submitLoading && <CircularProgress size={25} className="stock-list-modal__spinner" />}
                    <div className="stock-list-modal__fields">
                        <TextField fullWidth disabled label="Product" value={product.product_name || ''} />
                        <FormControl fullWidth required>
                            <InputLabel id="modify-stock-package-label">Stock unit</InputLabel>
                            <Select
                                labelId="modify-stock-package-label"
                                value={product.pack || ''}
                                label="Stock unit"
                                onChange={event => setProduct({ ...product, pack: event.target.value })}
                            >
                                <MenuItem value={product.packaging}>{product.packaging || 'Wholesale package'}</MenuItem>
                                {Number(product.quantity) !== 1 && <MenuItem value="Pc">Piece</MenuItem>}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth required>
                            <InputLabel id="modify-stock-type-label">Type</InputLabel>
                            <Select
                                labelId="modify-stock-type-label"
                                value={product.type || ''}
                                label="Type"
                                onChange={event => setProduct({ ...product, type: event.target.value })}
                            >
                                <MenuItem value="INVENTORY">INVENTORY</MenuItem>
                                <MenuItem value="REPACK">REPACK</MenuItem>
                                <MenuItem value="ADJUSTMENT">ADJUSTMENT</MenuItem>
                                <MenuItem value="SPOILAGE" disabled>SPOILAGE</MenuItem>
                                <MenuItem value="RETURN" disabled>RETURN</MenuItem>
                                <MenuItem value="RECEIVED_TO_WAREHOUSE" disabled>RECEIVED_TO_WAREHOUSE</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            required
                            label="Quantity adjustment"
                            type="number"
                            value={product.newStocks}
                            onChange={event => setProduct({ ...product, newStocks: event.target.value })}
                            helperText="Use a positive or negative quantity."
                        />
                        <TextField
                            fullWidth
                            required
                            label="Reason"
                            multiline
                            minRows={2}
                            value={product.stock_reason}
                            onChange={event => setProduct({ ...product, stock_reason: event.target.value })}
                        />
                    </div>
                    <div className="stock-list-modal__actions">
                        <Button onClick={() => setModifyOpen(false)}>Cancel</Button>
                        <Button variant="contained" disabled={!canModifyStock || submitLoading} onClick={updateProduct}>
                            Save adjustment
                        </Button>
                    </div>
                </Box>
            </Modal>

            <Modal open={notifyOpen} onClose={() => setNotifyOpen(false)}>
                <Box sx={modalStyle}>
                    <div className="stock-list-modal__header">
                        <span><PersonAddAltOutlinedIcon /></span>
                        <div><h2>Add customer follow-up</h2><p>Save a customer interested in this unavailable product.</p></div>
                    </div>
                    {submitLoading && <CircularProgress size={25} className="stock-list-modal__spinner" />}
                    <div className="stock-list-modal__fields">
                        <TextField fullWidth disabled label="Product" value={customerFollowUp.product_name || ''} />
                        <Autocomplete
                            options={customerList}
                            onChange={(event, value) => setCustomerFollowUp({
                                ...customerFollowUp,
                                customer_id: value?.id || ''
                            })}
                            getOptionLabel={customer => `${customer.first_name || ''} ${customer.last_name || ''}`.trim()}
                            renderInput={params => <TextField {...params} label="Choose customer" />}
                        />
                    </div>
                    <div className="stock-list-modal__actions">
                        <Button onClick={() => setNotifyOpen(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            disabled={!customerFollowUp.customer_id || submitLoading}
                            onClick={saveCustomerFollowUp}
                        >
                            Add follow-up
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default StockList;
