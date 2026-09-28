import React, { useEffect, useState } from "react";
import MarkUpPriceService from "./MarkUpPriceService.service";
import MarkUpPriceList from "./MarkUpPriceList";
import CategoryService from "../Category/CategoryService.service";
import SupplierService from "../Supplier/SupplierService.service";
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import PercentRoundedIcon from '@mui/icons-material/PercentRounded';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import './MarkUpPrice.css';

const SortOption = ({ metric, direction }) => {
    const isHighest = direction === 'Highest';

    return (
        <span className={`markup-sort-option markup-sort-option--${isHighest ? 'high' : 'low'}`}>
            {isHighest ? <TrendingUpRoundedIcon /> : <TrendingDownRoundedIcon />}
            <span><strong>{metric}</strong><small>{direction} first</small></span>
        </span>
    );
};

const MarkUpPercentage = () => {
    const [markupPriceList, setMarkupPriceList] = useState([]);
    const [businessType, setBusinessType] = useState('wholesale');
    const [catalogSort, setCatalogSort] = useState('highest_markup');
    const [appliedSort, setAppliedSort] = useState('highest_markup');
    const [limit, setLimit] = useState('100');
    const [categoryId, setCategoryId] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const normalizedSearch = searchQuery.trim().toLowerCase();
    const visibleMarkupPrices = markupPriceList.filter(record =>
        !normalizedSearch || [
            record.id,
            record.product_id,
            record.product_name,
            record.business_type,
            record.packaging,
            record.variation
        ].some(value => String(value ?? '').toLowerCase().includes(normalizedSearch))
    );
    const productCount = new Set(
        visibleMarkupPrices.map(record => record.product_id ?? `record-${record.id}`)
    ).size;

    const fetchMarkupPrices = () => {
        setLoading(true);
        setError('');
        MarkUpPriceService.catalog({
            sort: catalogSort,
            limit,
            ...(businessType !== 'all' ? { business_type: businessType } : {}),
            ...(categoryId ? { category_id: categoryId } : {}),
            ...(supplierId ? { supplier_id: supplierId } : {})
        })
            .then(response => {
                const records = Array.isArray(response.data?.data)
                    ? response.data.data
                    : response.data;
                setMarkupPriceList(Array.isArray(records) ? records : []);
                setAppliedSort(catalogSort);
            })
            .catch(() => {
                setMarkupPriceList([]);
                setError('Unable to load the mark up catalogue. Please try again.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchMarkupPrices();
        // The remaining filter changes are applied with the Submit button.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        CategoryService.getAll()
            .then(response => setCategories(response.data?.data || response.data || []))
            .catch(() => setCategories([]));
        SupplierService.getAll()
            .then(response => setSuppliers(response.data?.data || response.data || []))
            .catch(() => setSuppliers([]));
    }, []);

    return (
        <div className="markup-page">
            <section className="markup-hero markup-hero--list">
                <div className="markup-hero__icon"><PercentRoundedIcon /></div>
                <div className="markup-hero__copy">
                    <span>Pricing analysis</span>
                    <h1>Mark Up Percentage &amp; Margin</h1>
                    <p>Compare product mark ups from highest to lowest.</p>
                </div>
                <div className="markup-hero__summary">
                    <PercentRoundedIcon />
                    <div><strong>{productCount}</strong><span>Products · {visibleMarkupPrices.length} prices</span></div>
                </div>
            </section>

            {error && <Alert severity="error" className="mb-3">{error}</Alert>}

            <section className="markup-list-search markup-ranking-filters">
                <div className="markup-ranking-heading">
                    <div>
                        <strong>Mark up ranking</strong>
                        <span>Sort markup or markup margin for wholesale and retail prices.</span>
                    </div>
                    <small>Choose your filters, then submit to refresh the results.</small>
                </div>
                <TextField
                    className="markup-ranking-search"
                    size="small"
                    value={searchQuery}
                    onChange={event => setSearchQuery(event.target.value)}
                    placeholder="Search products..."
                    inputProps={{ 'aria-label': 'Search mark up ranking' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start"><SearchIcon /></InputAdornment>
                        )
                    }}
                />
                <TextField
                    select
                    size="small"
                    value={catalogSort}
                    onChange={event => setCatalogSort(event.target.value)}
                    label="Sort by"
                    sx={{ minWidth: 230 }}
                >
                    <MenuItem value="highest_markup"><SortOption metric="Markup" direction="Highest" /></MenuItem>
                    <MenuItem value="lowest_markup"><SortOption metric="Markup" direction="Lowest" /></MenuItem>
                    <MenuItem value="highest_markup_margin"><SortOption metric="Markup Margin" direction="Highest" /></MenuItem>
                    <MenuItem value="lowest_markup_margin"><SortOption metric="Markup Margin" direction="Lowest" /></MenuItem>
                </TextField>
                <TextField
                    select
                    size="small"
                    value={categoryId}
                    onChange={event => setCategoryId(event.target.value)}
                    label="Category"
                    sx={{ minWidth: 170 }}
                >
                    <MenuItem value="">All categories</MenuItem>
                    {categories.map(category => (
                        <MenuItem key={category.id} value={category.id}>{category.category_name}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    size="small"
                    value={supplierId}
                    onChange={event => setSupplierId(event.target.value)}
                    label="Supplier"
                    sx={{ minWidth: 170 }}
                >
                    <MenuItem value="">All suppliers</MenuItem>
                    {suppliers.map(supplier => (
                        <MenuItem key={supplier.id} value={supplier.id}>{supplier.supplier_name}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    size="small"
                    value={businessType}
                    onChange={event => setBusinessType(event.target.value)}
                    label="Price type"
                    sx={{ minWidth: 150 }}
                >
                    <MenuItem value="all">All price types</MenuItem>
                    <MenuItem value="wholesale">Wholesale</MenuItem>
                    <MenuItem value="retail">Retail</MenuItem>
                </TextField>
                <TextField
                    select
                    size="small"
                    value={limit}
                    onChange={event => setLimit(event.target.value)}
                    label="Limit"
                    sx={{ minWidth: 120 }}
                >
                    <MenuItem value="all">All</MenuItem>
                    {[10, 20, 50, 100, 200, 500].map(value => (
                        <MenuItem key={value} value={String(value)}>{value}</MenuItem>
                    ))}
                </TextField>
                <Button
                    variant="contained"
                    size="small"
                    onClick={fetchMarkupPrices}
                    disabled={loading}
                    className="markup-ranking-submit"
                >
                    Submit
                </Button>
                {loading && <LinearProgress className="markup-ranking-progress" />}
            </section>

            <MarkUpPriceList
                markupPriceList={visibleMarkupPrices}
                onUpdated={fetchMarkupPrices}
                showProfitMargin
                marginLabel="Markup margin"
                hideProfit
                hideEdit
                highlightMetric={appliedSort.includes('margin') ? 'margin' : 'markup'}
                highlightSellingPrice={false}
            />
        </div>
    );
};

export default MarkUpPercentage;
