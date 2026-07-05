import React, { useState } from "react";
import MarkUpPriceService from "./MarkUpPriceService.service";
import BranchStockTransactionService from "../OtherService/BranchStockTransactionService";

import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

const emptyPrice = {
    product_id: 0,
    product_name: '',
    quantity: 0,
    price: 0,
    mark_up_option: '',
    mark_up_price: 0,
    new_price: 0,
    profit: 0,
    branch_stock_transaction_id: 0,
    business_type: ''
};

const AddMarkUpPrice = ({ products, onSaved }) => {
    const [warehouses, setWarehouses] = useState([]);
    const [wholesale, setWholesale] = useState(emptyPrice);
    const [retail, setRetail] = useState(emptyPrice);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const formatMoney = value => new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2
    }).format(Number(value || 0));

    const selectProduct = (event, value) => {
        if (!value) {
            setWholesale(emptyPrice);
            setRetail(emptyPrice);
            setWarehouses([]);
            return;
        }

        BranchStockTransactionService.fetchBranchStockWarehouseList(value.id)
            .then(response => setWarehouses(response.data))
            .catch(error => console.log("error", error));

        setWholesale({
            ...emptyPrice,
            product_id: value.id,
            product_name: value.product_name,
            quantity: Number(value.quantity || 0),
            price: Number(value.price || 0),
            business_type: 'WHOLESALE'
        });
        setRetail({
            ...emptyPrice,
            product_id: value.id,
            product_name: value.product_name,
            quantity: Number(value.quantity || 0),
            price: Math.ceil(Number(value.price || 0) / Math.max(Number(value.quantity || 1), 1)),
            business_type: 'RETAIL'
        });
        setErrors(current => ({ ...current, product_id: undefined }));
    };

    const selectWarehouse = (event, value) => {
        const warehouseId = value?.id || 0;
        setWholesale(current => ({ ...current, branch_stock_transaction_id: warehouseId }));
        setRetail(current => ({ ...current, branch_stock_transaction_id: warehouseId }));
        setErrors(current => ({ ...current, branch_stock_transaction_id: undefined }));
    };

    const updatePricing = (setter, current, field, value, round = false) => {
        if (field === 'mark_up_option') {
            setter({ ...current, mark_up_option: value, mark_up_price: 0, new_price: 0, profit: 0 });
            return;
        }

        const adjustment = Number(value || 0);
        const profit = current.mark_up_option === 'PERCENTAGE'
            ? (Number(current.price || 0) / 100) * adjustment
            : adjustment;
        const calculatedPrice = Number(current.price || 0) + profit;
        setter({
            ...current,
            mark_up_price: adjustment,
            profit,
            new_price: round ? Math.ceil(calculatedPrice) : calculatedPrice
        });
    };

    const validate = () => {
        const nextErrors = {};
        if (!wholesale.product_id) nextErrors.product_id = 'Choose a product.';
        if (!wholesale.branch_stock_transaction_id) nextErrors.branch_stock_transaction_id = 'Choose a warehouse.';
        if (!wholesale.mark_up_option) nextErrors.wholesale_option = 'Choose a wholesale markup method.';
        if (Number(wholesale.mark_up_price) <= 0) nextErrors.wholesale_value = 'Enter a wholesale markup.';
        if (wholesale.quantity > 1) {
            if (!retail.mark_up_option) nextErrors.retail_option = 'Choose a retail markup method.';
            if (Number(retail.mark_up_price) <= 0) nextErrors.retail_value = 'Enter a retail markup.';
        }
        return nextErrors;
    };

    const saveMarkUpPrice = event => {
        event.preventDefault();
        const nextErrors = validate();
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;

        setSubmitting(true);
        setMessage('');
        MarkUpPriceService.sanctum()
            .then(() => MarkUpPriceService.create(wholesale))
            .then(() => wholesale.quantity > 1 ? MarkUpPriceService.saveMarkUp(retail) : null)
            .then(() => {
                setMessage('Markup prices saved successfully.');
                onSaved?.();
            })
            .catch(error => {
                console.log(error);
                setMessage('Unable to save markup prices.');
            })
            .finally(() => setSubmitting(false));
    };

    const renderPricingPanel = (title, icon, pricing, setter, isRetail = false) => (
        <div className="markup-pricing-panel">
            <div className="markup-pricing-panel__header">
                <span>{icon}</span>
                <div><h3>{title}</h3><p>{isRetail ? 'Price per individual unit' : 'Price per complete package'}</p></div>
            </div>
            <div className="markup-pricing-panel__base">
                <span>Supplier price</span><strong>{formatMoney(pricing.price)}</strong>
            </div>
            <TextField
                select
                fullWidth
                size="small"
                label="Markup method"
                value={pricing.mark_up_option}
                onChange={event => updatePricing(setter, pricing, 'mark_up_option', event.target.value, isRetail)}
                error={Boolean(errors[isRetail ? 'retail_option' : 'wholesale_option'])}
                helperText={errors[isRetail ? 'retail_option' : 'wholesale_option']}
            >
                <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                <MenuItem value="AMOUNT">Fixed amount</MenuItem>
            </TextField>
            <TextField
                fullWidth
                size="small"
                type="number"
                label={pricing.mark_up_option === 'PERCENTAGE' ? 'Markup percentage' : 'Markup amount'}
                value={pricing.mark_up_price || ''}
                disabled={!pricing.mark_up_option}
                onChange={event => updatePricing(setter, pricing, 'mark_up_price', event.target.value, isRetail)}
                error={Boolean(errors[isRetail ? 'retail_value' : 'wholesale_value'])}
                helperText={errors[isRetail ? 'retail_value' : 'wholesale_value']}
                InputProps={{
                    startAdornment: pricing.mark_up_option === 'AMOUNT'
                        ? <InputAdornment position="start">₱</InputAdornment>
                        : undefined,
                    endAdornment: pricing.mark_up_option === 'PERCENTAGE'
                        ? <InputAdornment position="end">%</InputAdornment>
                        : undefined
                }}
            />
            <div className="markup-pricing-panel__result">
                <div><span>Profit</span><strong>+ {formatMoney(pricing.profit)}</strong></div>
                <ArrowForwardRoundedIcon />
                <div><span>New price</span><strong>{formatMoney(pricing.new_price)}</strong></div>
            </div>
        </div>
    );

    return (
        <section className="markup-create-card">
            <div className="markup-create-card__header">
                <div><h2>Create markup price</h2><p>Select a product and calculate its wholesale and retail selling prices.</p></div>
                <span><AddBusinessOutlinedIcon />New price</span>
            </div>
            {message && <Alert severity={message.startsWith('Unable') ? 'error' : 'success'}>{message}</Alert>}
            <form onSubmit={saveMarkUpPrice}>
                <div className="markup-selection">
                    <Autocomplete
                        options={products}
                        onChange={selectProduct}
                        getOptionLabel={product => `${product.product_name} · ${formatMoney(product.price)}`}
                        renderInput={params => (
                            <TextField {...params} label="Choose product" error={Boolean(errors.product_id)} helperText={errors.product_id} />
                        )}
                    />
                    <Autocomplete
                        options={warehouses}
                        onChange={selectWarehouse}
                        disabled={!wholesale.product_id}
                        getOptionLabel={warehouse => warehouse.warehouse_name || ''}
                        renderInput={params => (
                            <TextField {...params} label="Choose warehouse" error={Boolean(errors.branch_stock_transaction_id)} helperText={errors.branch_stock_transaction_id} />
                        )}
                    />
                </div>
                {wholesale.product_id ? (
                    <div className="markup-pricing-grid">
                        {renderPricingPanel('Wholesale', <StorefrontOutlinedIcon />, wholesale, setWholesale)}
                        {wholesale.quantity > 1
                            ? renderPricingPanel('Retail', <ShoppingBagOutlinedIcon />, retail, setRetail, true)
                            : <div className="markup-retail-unavailable">
                                <ShoppingBagOutlinedIcon />
                                <h3>Retail price not required</h3>
                                <p>This product contains one unit per package.</p>
                            </div>}
                    </div>
                ) : (
                    <div className="markup-product-placeholder">
                        <AddBusinessOutlinedIcon />
                        <p>Choose a product to configure its pricing.</p>
                    </div>
                )}
                <div className="markup-create-actions">
                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Saving prices...' : 'Save markup prices'}
                    </Button>
                </div>
                {submitting && <LinearProgress className="markup-create-progress" />}
            </form>
        </section>
    );
};

export default AddMarkUpPrice;
