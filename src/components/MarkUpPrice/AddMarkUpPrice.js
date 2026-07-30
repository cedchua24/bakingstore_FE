import React, { useMemo, useState } from "react";
import MarkUpPriceService from "./MarkUpPriceService.service";

import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

const AddMarkUpPrice = ({ products, onSaved }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [error, setError] = useState('');
    const [markupOption, setMarkupOption] = useState('');
    const [markupValue, setMarkupValue] = useState('');
    const [markupError, setMarkupError] = useState('');
    const [retailOption, setRetailOption] = useState('');
    const [retailValue, setRetailValue] = useState('');
    const [retailError, setRetailError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const productOptions = useMemo(() => (
        Array.isArray(products)
            ? [...products].sort((a, b) =>
                String(a.category_name ?? '').localeCompare(String(b.category_name ?? ''))
                || String(a.product_name ?? a.name ?? '').localeCompare(String(b.product_name ?? b.name ?? ''))
            )
            : []
    ), [products]);

    const getProductId = product => product?.id ?? product?.product_id ?? 0;
    const getProductName = product => product?.product_name ?? product?.name ?? '';
    const supplierPrice = Number(selectedProduct?.price ?? selectedProduct?.supplier_price ?? 0);
    const productQuantity = Number(selectedProduct?.quantity ?? 1);
    const hasRetailPrice = productQuantity > 1;
    const retailSupplierPrice = Math.ceil(supplierPrice / Math.max(productQuantity, 1));
    const numericMarkup = Number(markupValue || 0);
    const profit = markupOption === 'PERCENTAGE'
        ? (supplierPrice / 100) * numericMarkup
        : numericMarkup;
    const newPrice = supplierPrice + profit;
    const numericRetailMarkup = Number(retailValue || 0);
    const retailProfit = retailOption === 'PERCENTAGE'
        ? (retailSupplierPrice / 100) * numericRetailMarkup
        : numericRetailMarkup;
    const retailNewPrice = Math.ceil(retailSupplierPrice + retailProfit);

    const formatMoney = value => new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2
    }).format(Number(value || 0));

    const getPackageDetails = product => {
        const quantity = Number(product.quantity ?? 1);
        const totalWeight = Number(product.weight ?? 0);
        const variation = product.variation || '';

        if (!totalWeight) {
            return product.packaging || '';
        }

        if (quantity > 1) {
            const unitWeight = totalWeight / quantity;
            const formattedUnitWeight = Number.isInteger(unitWeight)
                ? unitWeight
                : Number(unitWeight.toFixed(2));
            return `${totalWeight}${variation} | ${quantity} × ${formattedUnitWeight}${variation}`;
        }

        const packaging = product.packaging || '';
        const isDuplicatePackaging = packaging
            && variation
            && packaging.trim().toLowerCase() === variation.trim().toLowerCase();
        return `${totalWeight}${variation}${packaging && !isDuplicatePackaging ? ` · ${packaging}` : ''}`;
    };

    const getProductLabel = product => {
        const packageDetails = getPackageDetails(product);
        const stock = product.stock == null ? '' : ` · Stock: ${product.stock}`;
        return `${getProductName(product)}${packageDetails ? ` · ${packageDetails}` : ''} · ${formatMoney(product.price ?? product.supplier_price)}${stock}`;
    };

    const saveMarkUpPrice = event => {
        event.preventDefault();
        const productId = getProductId(selectedProduct);

        if (!productId) {
            setError('Choose a product.');
            return;
        }
        if (!markupOption) {
            setMarkupError('Choose a markup method.');
            return;
        }
        if (numericMarkup <= 0) {
            setMarkupError('Enter a markup greater than zero.');
            return;
        }
        if (hasRetailPrice && !retailOption) {
            setRetailError('Choose a retail markup method.');
            return;
        }
        if (hasRetailPrice && numericRetailMarkup <= 0) {
            setRetailError('Enter a retail markup greater than zero.');
            return;
        }

        setSubmitting(true);
        setError('');
        setMessage('');

        MarkUpPriceService.sanctum()
            .then(() => MarkUpPriceService.create({
                product_id: productId,
                price: supplierPrice,
                mark_up_option: markupOption,
                mark_up_price: numericMarkup,
                new_price: newPrice,
                profit,
                branch_stock_transaction_id: 1,
                business_type: 'WHOLESALE'
            }))
            .then(() => hasRetailPrice
                ? MarkUpPriceService.saveMarkUp({
                    product_id: productId,
                    price: retailSupplierPrice,
                    mark_up_option: retailOption,
                    mark_up_price: numericRetailMarkup,
                    new_price: retailNewPrice,
                    profit: retailNewPrice - retailSupplierPrice,
                    branch_stock_transaction_id: 1,
                    business_type: 'RETAIL'
                })
                : null
            )
            .then(() => {
                setMessage('Markup price created successfully.');
                setSelectedProduct(null);
                setMarkupOption('');
                setMarkupValue('');
                setRetailOption('');
                setRetailValue('');
                onSaved?.();
            })
            .catch(errorResponse => {
                console.log(errorResponse);
                const validationMessage = errorResponse.response?.data?.errors
                    ? Object.values(errorResponse.response.data.errors).flat()[0]
                    : null;
                setMessage(validationMessage || errorResponse.response?.data?.message || 'Unable to create the markup price.');
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <section className="markup-create-card">
            <div className="markup-create-card__header">
                <div>
                    <h2>Create markup price</h2>
                    <p>Choose one product to create its markup pricing.</p>
                </div>
                <span><AddBusinessOutlinedIcon />New price</span>
            </div>

            {message && (
                <Alert severity={message.includes('successfully') ? 'success' : 'error'}>
                    {message}
                </Alert>
            )}

            <form onSubmit={saveMarkUpPrice}>
                <div className="markup-product-picker">
                    <Autocomplete
                        fullWidth
                        options={productOptions}
                        value={selectedProduct}
                        onChange={(event, value) => {
                            setSelectedProduct(value);
                            setError('');
                            setMarkupOption('');
                            setMarkupValue('');
                            setMarkupError('');
                            setRetailOption('');
                            setRetailValue('');
                            setRetailError('');
                        }}
                        groupBy={product => product.category_name || 'Uncategorized'}
                        isOptionEqualToValue={(option, value) =>
                            String(getProductId(option)) === String(getProductId(value))
                        }
                        getOptionLabel={getProductLabel}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Choose product"
                                placeholder="Search product name..."
                                error={Boolean(error)}
                                helperText={error}
                            />
                        )}
                    />

                    {selectedProduct ? (
                        <>
                            <div className="markup-selected-product">
                                <span><Inventory2OutlinedIcon /></span>
                                <div>
                                    <small>Selected product</small>
                                    <strong>{getProductName(selectedProduct)}</strong>
                                    <p>
                                        Product #{getProductId(selectedProduct)}
                                        {selectedProduct.category_name ? ` · ${selectedProduct.category_name}` : ''}
                                        {getPackageDetails(selectedProduct) ? ` · ${getPackageDetails(selectedProduct)}` : ''}
                                    </p>
                                </div>
                            </div>
                            <div className="markup-pricing-grid">
                            <div className="markup-pricing-panel markup-pricing-panel--whole">
                                <div className="markup-pricing-panel__header">
                                    <span><AddBusinessOutlinedIcon /></span>
                                    <div><h3>Whole package markup</h3><p>Set the selling price for the complete package.</p></div>
                                </div>
                                <div className="markup-pricing-panel__base">
                                    <span>Supplier price</span><strong>{formatMoney(supplierPrice)}</strong>
                                </div>
                                <div className="markup-whole-fields">
                                    <TextField
                                        select
                                        fullWidth
                                        size="small"
                                        label="Markup method"
                                        value={markupOption}
                                        onChange={event => {
                                            setMarkupOption(event.target.value);
                                            setMarkupValue('');
                                            setMarkupError('');
                                        }}
                                        error={Boolean(markupError && !markupOption)}
                                    >
                                        <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                                        <MenuItem value="AMOUNT">Fixed amount</MenuItem>
                                    </TextField>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="number"
                                        label={markupOption === 'PERCENTAGE' ? 'Markup percentage' : 'Markup amount'}
                                        value={markupValue}
                                        disabled={!markupOption}
                                        onChange={event => {
                                            setMarkupValue(event.target.value);
                                            setMarkupError('');
                                        }}
                                        error={Boolean(markupError)}
                                        helperText={markupError}
                                        InputProps={{
                                            startAdornment: markupOption === 'AMOUNT'
                                                ? <InputAdornment position="start">₱</InputAdornment>
                                                : undefined,
                                            endAdornment: markupOption === 'PERCENTAGE'
                                                ? <InputAdornment position="end">%</InputAdornment>
                                                : undefined
                                        }}
                                    />
                                </div>
                                <div className="markup-pricing-panel__result">
                                    <div><span>Profit</span><strong>+ {formatMoney(profit)}</strong></div>
                                    <ArrowForwardRoundedIcon />
                                    <div><span>New selling price</span><strong>{formatMoney(newPrice)}</strong></div>
                                </div>
                            </div>
                            {hasRetailPrice && (
                                <div className="markup-pricing-panel markup-pricing-panel--whole">
                                    <div className="markup-pricing-panel__header">
                                        <span><Inventory2OutlinedIcon /></span>
                                        <div><h3>Retail markup</h3><p>Set the selling price for one individual unit.</p></div>
                                    </div>
                                    <div className="markup-pricing-panel__base">
                                        <span>Price per unit</span><strong>{formatMoney(retailSupplierPrice)}</strong>
                                    </div>
                                    <div className="markup-whole-fields">
                                        <TextField
                                            select
                                            fullWidth
                                            size="small"
                                            label="Retail markup method"
                                            value={retailOption}
                                            onChange={event => {
                                                setRetailOption(event.target.value);
                                                setRetailValue('');
                                                setRetailError('');
                                            }}
                                            error={Boolean(retailError && !retailOption)}
                                        >
                                            <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                                            <MenuItem value="AMOUNT">Fixed amount</MenuItem>
                                        </TextField>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="number"
                                            label={retailOption === 'PERCENTAGE' ? 'Retail markup percentage' : 'Retail markup amount'}
                                            value={retailValue}
                                            disabled={!retailOption}
                                            onChange={event => {
                                                setRetailValue(event.target.value);
                                                setRetailError('');
                                            }}
                                            error={Boolean(retailError)}
                                            helperText={retailError}
                                            InputProps={{
                                                startAdornment: retailOption === 'AMOUNT'
                                                    ? <InputAdornment position="start">₱</InputAdornment>
                                                    : undefined,
                                                endAdornment: retailOption === 'PERCENTAGE'
                                                    ? <InputAdornment position="end">%</InputAdornment>
                                                    : undefined
                                            }}
                                        />
                                    </div>
                                    <div className="markup-pricing-panel__result">
                                        <div><span>Profit per unit</span><strong>+ {formatMoney(retailProfit)}</strong></div>
                                        <ArrowForwardRoundedIcon />
                                        <div><span>Retail selling price</span><strong>{formatMoney(retailNewPrice)}</strong></div>
                                    </div>
                                </div>
                            )}
                            </div>
                        </>
                    ) : (
                        <div className="markup-product-placeholder">
                            <AddBusinessOutlinedIcon />
                            <p>Choose a product to continue.</p>
                        </div>
                    )}
                </div>

                <div className="markup-create-actions">
                    <Button type="submit" variant="contained" disabled={submitting || !selectedProduct}>
                        {submitting ? 'Creating price...' : 'Create markup price'}
                    </Button>
                </div>
                {submitting && <LinearProgress className="markup-create-progress" />}
            </form>
        </section>
    );
};

export default AddMarkUpPrice;
