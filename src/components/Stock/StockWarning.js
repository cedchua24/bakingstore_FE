import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import ProductServiceService from "../Product/ProductService.service";
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
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import StockSearchBar, { matchesStockSearch } from './StockSearchBar';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

import './StockWarning.css';

const isSentToSupplier = (status) =>
    ['SEND_TO_SUPPLIER', 'SENT_TO_SUPPLIER'].includes(String(status || '').toUpperCase());

const formatSupplierSentTracking = (value) => {
    if (!value) return '';

    const sentDate = new Date(String(value).replace(' ', 'T'));
    if (Number.isNaN(sentDate.getTime())) return '';

    const today = new Date();
    const sentDay = new Date(sentDate.getFullYear(), sentDate.getMonth(), sentDate.getDate());
    const currentDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const daysAgo = Math.max(0, Math.floor((currentDay - sentDay) / 86400000));
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(sentDate);
    const elapsed = daysAgo === 0
        ? 'Today'
        : `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;

    return `Sent ${formattedDate} · ${elapsed}`;
};



const StockWarning = (props) => {

    // const productList = props.productList;
    useEffect(() => {
        fetchProductList(0);
        fetchCategoryList();
    }, []);

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const [productList, setProductList] = useState({
        data: [],
        id: 0
    });

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
        newStocks: 0,
        pack: ''
    });

    const [realStock, setRealStock] = useState(0);
    const [errorStock, setErrorStock] = useState(false);

    const onChangeInput = (e) => {
        console.log(e.target.value)
        setCategoryId(e.target.value)
    }

    const onChangePackaging = (e) => {
        console.log(e.target.value)
        setProduct({
            ...product,
            pack: e.target.value,
        });
    }

    const onChangeStock = (e) => {
        // const realStock = product.stock;
        // const totalStock = Number(realStock) + Number(e.target.value);
        setProduct({
            ...product,
            newStocks: e.target.value,
        });

        if (Number(e.target.value) < 1) {
            setErrorStock(true);
        } else {
            setErrorStock(false);
        }
    }

    const fetchByProductId = async (id) => {
        await ProductServiceService.get(id)
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
        ProductServiceService.update(product.id, product)
            .then(response => {
                fetchProductList();
                setSubmitLoading(false);
                setOpen(false);
                // updateOrderTransaction();
            })
            .catch(e => {
                console.log(e);
                setSubmitLoading(false);
                setOpen(false);
            });

    }


    const fetchProductList = (selectedCategoryId = 0) => {
        ProductServiceService.fetchByStockWarning(selectedCategoryId)
            .then(response => {
                setProductList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            })
            .finally(() => {
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
            });
    }

    const fetchProductByCategoryId = () => {
        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        fetchProductList(categoryId);
    }

    const products = Array.isArray(productList.data) ? productList.data : [];
    const filteredProducts = products.filter(item => matchesStockSearch(item, searchQuery));
    const pendingOrderCount = products.reduce(
        (total, currentProduct) => total + (
            Array.isArray(currentProduct.pending_orders)
                ? currentProduct.pending_orders.length
                : 0
        ),
        0
    );

    const formatProductPackage = (currentProduct) => {
        if (currentProduct.quantity == null || currentProduct.weight == null) {
            return 'Package not specified';
        }

        if (currentProduct.quantity === 1) {
            return `${currentProduct.weight}${currentProduct.variation || ''}`;
        }

        const unitWeight = currentProduct.weight / currentProduct.quantity;
        const formattedUnitWeight = Number.isInteger(unitWeight)
            ? unitWeight
            : unitWeight.toPrecision(2);

        return `${currentProduct.quantity} × ${formattedUnitWeight}${currentProduct.variation || ''}`;
    };

    const sumPendingOrderQuantities = (pendingOrders) => {
        const totalsByUnit = pendingOrders.reduce((totals, pendingOrder) => {
            const quantityText = String(pendingOrder.quantity || '').trim();
            const quantityMatch = quantityText.match(/^(-?\d+(?:\.\d+)?)\s*(.*)$/);

            if (!quantityMatch) {
                return totals;
            }

            const amount = Number(quantityMatch[1]);
            const unit = quantityMatch[2].trim().toUpperCase();
            totals[unit] = (totals[unit] || 0) + amount;
            return totals;
        }, {});

        const formattedTotals = Object.entries(totalsByUnit).map(([unit, amount]) =>
            `${amount.toLocaleString()}${unit ? ` ${unit}` : ''}`
        );

        return formattedTotals.length > 0 ? formattedTotals.join(' + ') : 'Not specified';
    };

    return (
        <div className="stock-warning-page">
            <section className="stock-warning-hero">
                <div className="stock-warning-hero__icon">
                    <WarningAmberRoundedIcon />
                </div>
                <div className="stock-warning-hero__copy">
                    <span className="stock-warning-eyebrow">Inventory monitor</span>
                    <h1>Stock Warning</h1>
                    <p>Products at or below their warning level, with incoming supplier orders at a glance.</p>
                </div>
                <div className="stock-warning-summary">
                    <div className="stock-warning-summary__item">
                        <Inventory2OutlinedIcon />
                        <div>
                            <strong>{products.length}</strong>
                            <span>Low-stock products</span>
                        </div>
                    </div>
                    <div className="stock-warning-summary__item">
                        <LocalShippingOutlinedIcon />
                        <div>
                            <strong>{pendingOrderCount}</strong>
                            <span>Pending orders</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stock-warning-filter">
                <div>
                    <span className="stock-warning-filter__label">Filter inventory</span>
                    <p>Choose a category to narrow the warning list.</p>
                </div>
                <div className="stock-warning-filter__controls">
                    <FormControl size="small" className="stock-warning-category">
                        <InputLabel id="stock-warning-category-label">Category</InputLabel>
                        <Select
                            labelId="stock-warning-category-label"
                            id="stock-warning-category"
                            value={categoryId}
                            label="Category"
                            name="categoryId"
                            onChange={onChangeInput}
                        >
                            <MenuItem value={0}>All categories</MenuItem>
                            {
                                categeryList.map((category) => (
                                    <MenuItem value={category.id} key={category.id}>{category.category_name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        disabled={isAddDisabled}
                        onClick={fetchProductByCategoryId}
                        startIcon={<SearchIcon />}
                        className="stock-warning-search"
                    >
                        {submitLoadingAdd ? 'Loading...' : 'Apply filter'}
                    </Button>
                </div>
                {submitLoadingAdd && <LinearProgress color="warning" className="stock-warning-progress" />}
            </section>

            <StockSearchBar value={searchQuery} onChange={setSearchQuery} />
            <section className="stock-warning-table-card">
                <div className="stock-warning-table-card__header">
                    <div>
                        <h2>Products needing attention</h2>
                        <p>{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found.</p>
                    </div>
                    <span className="stock-warning-live-pill">
                        <span />
                        Live inventory
                    </span>
                </div>

                <div className="table-responsive">
                    <table className="stock-warning-table">
                        <colgroup>
                            <col className="stock-warning-col-product" />
                            <col className="stock-warning-col-category" />
                            <col className="stock-warning-col-threshold" />
                            <col className="stock-warning-col-stock" />
                            <col className="stock-warning-col-orders" />
                            <col className="stock-warning-col-actions" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Warning level</th>
                                <th>Current stock</th>
                                <th>Pending supplier orders</th>
                                <th aria-label="Actions"></th>
                            </tr>
                        </thead>
                        <tbody>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <div className="stock-warning-product">
                                        <div>
                                            <strong>{product.product_name}</strong>
                                            <span>#{product.id} · {product.brand_name || 'No brand'}</span>
                                            <span className="stock-warning-package">
                                                {formatProductPackage(product)}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="stock-warning-category-pill">{product.category_name}</span>
                                </td>
                                <td>
                                    <div className="stock-warning-threshold">
                                        <strong>{product.stock_warning}</strong>
                                        <span>{product.stock_warning_type === 'WHOLESALE' ? 'wholesale units' : 'pieces'}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="stock-warning-levels">
                                        <div>
                                            <span>Wholesale</span>
                                            <strong>{product.stock ?? 0}</strong>
                                        </div>
                                        <div>
                                            <span>Pieces</span>
                                            <strong>{product.stock_pc ?? 0}</strong>
                                        </div>
                                        <span className="stock-warning-critical">
                                            <WarningAmberRoundedIcon />
                                            Low stock
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
                                            {product.pending_orders.map((pendingOrder) => (
                                                <Link
                                                    to={"/orderSupplierApproval/" + pendingOrder.order_supplier_transaction_id}
                                                    className="stock-warning-order"
                                                    key={pendingOrder.order_supplier_transaction_id}
                                                >
                                                    <div className="stock-warning-order__icon">
                                                        <LocalShippingOutlinedIcon />
                                                    </div>
                                                    <div className="stock-warning-order__details">
                                                        <strong>{pendingOrder.supplier}</strong>
                                                        <span>PO #{pendingOrder.order_supplier_transaction_id} · {pendingOrder.date}</span>
                                                        <span className={`stock-warning-order__status stock-warning-order__status--${String(pendingOrder.status || 'PENDING').toLowerCase()}`}>
                                                            {String(pendingOrder.status || 'PENDING').replaceAll('_', ' ')}
                                                        </span>
                                                        {isSentToSupplier(pendingOrder.status)
                                                            && pendingOrder.send_date && (
                                                            <span className="stock-warning-order__sent-age">
                                                                {formatSupplierSentTracking(pendingOrder.send_date)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="stock-warning-order__quantity">
                                                        <span>Incoming</span>
                                                        <strong>{pendingOrder.quantity}</strong>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="stock-warning-no-orders">
                                            <LocalShippingOutlinedIcon />
                                            <span>No pending supplier order</span>
                                        </div>
                                    )}
                                </td>
                                <td className="stock-warning-actions">
                                    <Link to={"/viewTransaction/" + product.id} className="stock-warning-history-link">
                                        View history
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">
                                <div className="stock-warning-empty">
                                    <Inventory2OutlinedIcon />
                                    <h3>No stock warnings found</h3>
                                    <p>There are no low-stock products in this category.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                        </tbody>
                    </table>
                </div>
            </section>
            <Modal
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
                        <InputLabel id="demo-simple-select-label">Packaging</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={product.packaging}
                            label="Packaging"
                            name="pack"
                            onChange={onChangePackaging}
                        >
                            <MenuItem value={product.packaging}>{product.packaging}</MenuItem>
                            <MenuItem value="Pc">Pc</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Add Stocks</InputLabel>
                        <Input
                            type='number'
                            id="filled-required"
                            label="Stock"
                            variant="filled"
                            name='newStocks'
                            errorText='{this.state.password_error_text}'
                            min='1'
                            // value={product.stock}
                            onChange={onChangeStock}
                            // helperText="Incorrect entry."
                            error={errorStock}
                        />
                    </FormControl>

                    {/* <FormControl fullWidth sx={{ m: 0 }} variant="standard">
                        <TextField
                            disabled
                            id="filled-required"
                            label="Stock"
                            variant="filled"
                            name='product_name'
                            value={product.stock}
                        />
                    </FormControl> */}

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
                            Submits
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default StockWarning
