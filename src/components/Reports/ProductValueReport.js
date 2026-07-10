import React, { useEffect, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import ProductService from '../Product/ProductService.service';
import CategoryService from '../Category/CategoryService.service';
import './ProductReport.css';

const money = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(value || 0));

const ProductValueReport = () => {
    const [categoryId, setCategoryId] = useState(0);
    const [categories, setCategories] = useState([]);
    const [report, setReport] = useState({ total_value: {}, data: [] });
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');

    const loadReport = selectedCategory => {
        setLoading(true);
        ProductService.fetchProductValue(selectedCategory)
            .then(response => setReport(response.data || { total_value: {}, data: [] }))
            .catch(error => console.log('error', error))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadReport(0);
        CategoryService.getAll().then(response => setCategories(response.data || [])).catch(error => console.log('error', error));
    }, []);

    const products = Array.isArray(report.data) ? report.data : [];
    const totals = report.total_value || {};
    const capital = Number(totals.total_price ?? products.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.stock || 0), 0));
    const capitalWithProfit = Number(totals.total_new_value ?? products.reduce((sum, item) => sum + Number(item.new_price || 0) * Number(item.stock || 0), 0));
    const expectedProfit = Number(totals.total_profit ?? products.reduce((sum, item) => sum + Number(item.profit || 0) * Number(item.stock || 0), 0));
    const filtered = useMemo(() => {
        const search = query.trim().toLowerCase();
        if (!search) return products;
        return products.filter(item => [item.id, item.product_name, item.brand_name, item.category_name, item.packaging]
            .some(value => String(value ?? '').toLowerCase().includes(search)));
    }, [products, query]);
    const packageLabel = item => Number(item.quantity) === 1
        ? `${item.weight}${item.variation || ''}`
        : `${item.quantity} × ${(Number(item.weight || 0) / Number(item.quantity || 1)).toPrecision(2)}${item.variation || ''}`;

    return <main className="pr-page">
        <section className="pr-hero">
            <div className="pr-hero__icon"><AccountBalanceWalletOutlinedIcon /></div>
            <div><span>Inventory valuation</span><h1>Product Capital Report</h1><p>Review invested capital, selling value, and expected profit across current inventory.</p></div>
        </section>

        <section className="pr-summary">
            <div><PaymentsOutlinedIcon /><div><span>Current capital</span><strong>{money(capital)}</strong></div></div>
            <div><AccountBalanceWalletOutlinedIcon /><div><span>Capital with profit</span><strong>{money(capitalWithProfit)}</strong></div></div>
            <div><TrendingUpRoundedIcon /><div><span>Expected profit</span><strong>{money(expectedProfit)}</strong></div></div>
        </section>

        <section className="pr-filter">
            <div className="pr-filter__header"><strong>Report filter</strong><span>Choose a category to recalculate inventory capital.</span></div>
            <div className="pr-filter__grid" style={{ gridTemplateColumns: 'minmax(220px, 320px) 140px' }}>
                <FormControl size="small"><InputLabel>Category</InputLabel><Select value={categoryId} label="Category" onChange={event => setCategoryId(event.target.value)}><MenuItem value={0}>All categories</MenuItem>{categories.map(item => <MenuItem key={item.id} value={item.id}>{item.category_name}</MenuItem>)}</Select></FormControl>
                <Button variant="contained" onClick={() => loadReport(categoryId)} disabled={loading}>Apply filter</Button>
            </div>
            {loading && <LinearProgress className="pr-progress" />}
        </section>

        <section className="pr-card">
            <header><div><h2>Product values</h2><p>{filtered.length} {filtered.length === 1 ? 'product' : 'products'} found</p></div><TextField className="pr-search" size="small" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search products..." InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }} /></header>
            <div className="table-responsive"><table className="pr-table"><thead><tr><th>Product</th><th>Classification</th><th>Price comparison</th><th>Package</th><th>Inventory</th><th>Status</th><th>Capital</th><th>With profit</th><th>Expected profit</th></tr></thead><tbody>
                {filtered.map(item => {
                    const pricesMatch = Number(item.price) === Number(item.mup_price);
                    return <tr key={item.id}>
                        <td><div className="pr-product"><strong>{item.product_name}</strong><span>#{item.id}</span></div></td>
                        <td><span className="pr-pill">{item.category_name || 'Uncategorized'}</span><div className="pr-subtle" style={{ marginTop: 4 }}>{item.brand_name || 'No brand'}</div></td>
                        <td><div className="pr-product"><strong>{money(item.mup_price)} → {money(item.price)}</strong><span className={pricesMatch ? 'pr-money' : 'pr-negative'}>{pricesMatch ? 'Prices match' : 'Price changed'}</span></div></td>
                        <td>{packageLabel(item)}<div className="pr-subtle">{item.packaging || 'No packaging'}</div></td>
                        <td><div className="pr-stock"><span>{item.stock ?? 0} in stock</span></div></td>
                        <td><span className={`pr-status ${item.disabled === 0 ? 'pr-status--active' : 'pr-status--disabled'}`}>{item.disabled === 0 ? 'Active' : 'Disabled'}</span></td>
                        <td><strong>{money(Number(item.price || 0) * Number(item.stock || 0))}</strong></td>
                        <td><strong>{money(Number(item.new_price || 0) * Number(item.stock || 0))}</strong></td>
                        <td className="pr-money">{money(Number(item.profit || 0) * Number(item.stock || 0))}</td>
                    </tr>;
                })}
                {!filtered.length && <tr><td colSpan="9"><div className="pr-empty"><Inventory2OutlinedIcon /><strong>No product values found</strong><span>Try another category or search term.</span></div></td></tr>}
            </tbody></table></div>
        </section>
    </main>;
};

export default ProductValueReport;
