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
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import HistoryToggleOffRoundedIcon from '@mui/icons-material/HistoryToggleOffRounded';
import ProductService from '../Product/ProductService.service';
import SupplierService from '../Supplier/SupplierService.service';
import CategoryService from '../Category/CategoryService.service';
import './ProductReport.css';

const money = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(value || 0));
const date = value => value ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(value)) : null;

const ReportProductUnsold = () => {
    const [filters, setFilters] = useState({ supplier_id: '', category_id: '', dateFrom: '', dateTo: '' });
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [records, setRecords] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');

    useEffect(() => {
        ProductService.getUnsoldProducts(filters).then(response => setRecords(response.data?.data || [])).catch(error => console.log('error', error));
        SupplierService.getAll().then(response => setSuppliers(response.data || [])).catch(error => console.log('error', error));
        CategoryService.getAll().then(response => setCategories(response.data || [])).catch(error => console.log('error', error));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const runReport = () => {
        const nextErrors = { ...(!filters.dateFrom && { dateFrom: 'Required' }), ...(!filters.dateTo && { dateTo: 'Required' }) };
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;
        setLoading(true);
        ProductService.getUnsoldProducts(filters).then(response => setRecords(response.data?.data || [])).catch(error => console.log('error', error)).finally(() => setLoading(false));
    };
    const update = event => setFilters({ ...filters, [event.target.name]: event.target.value });
    const filtered = useMemo(() => { const q = query.trim().toLowerCase(); return q ? records.filter(item => [item.id,item.product_name,item.category_name,item.brand_name].some(value => String(value ?? '').toLowerCase().includes(q))) : records; }, [records, query]);
    const totalValue = records.reduce((sum, item) => sum + Number(item.total_value || 0), 0);
    const neverSold = records.filter(item => !item.last_sold_at).length;

    return <main className="pr-page">
        <section className="pr-hero"><div className="pr-hero__icon"><HistoryToggleOffRoundedIcon /></div><div><span>Inventory intelligence</span><h1>Unsold Products</h1><p>Find products without recent sales and identify inventory that needs attention.</p></div></section>
        <section className="pr-summary"><div><Inventory2OutlinedIcon /><div><span>Unsold products</span><strong>{records.length}</strong></div></div><div><PaymentsOutlinedIcon /><div><span>Inventory value</span><strong>{money(totalValue)}</strong></div></div><div><HistoryToggleOffRoundedIcon /><div><span>Never sold</span><strong>{neverSold}</strong></div></div></section>
        <section className="pr-filter"><div className="pr-filter__header"><strong>Report filters</strong><span>Choose a period and optionally narrow results by supplier or category.</span></div><div className="pr-filter__grid">
            <FormControl size="small"><InputLabel>Supplier</InputLabel><Select name="supplier_id" value={filters.supplier_id} label="Supplier" onChange={update}><MenuItem value="">All suppliers</MenuItem>{suppliers.map(item => <MenuItem key={item.id} value={item.id}>{item.supplier_name}</MenuItem>)}</Select></FormControl>
            <FormControl size="small"><InputLabel>Category</InputLabel><Select name="category_id" value={filters.category_id} label="Category" onChange={update}><MenuItem value="">All categories</MenuItem>{categories.map(item => <MenuItem key={item.id} value={item.id}>{item.category_name}</MenuItem>)}</Select></FormControl>
            <div><TextField fullWidth size="small" type="date" name="dateFrom" value={filters.dateFrom} onChange={update} label="Date from" InputLabelProps={{ shrink:true }} />{errors.dateFrom && <p className="pr-filter__error">Date from is required</p>}</div>
            <div><TextField fullWidth size="small" type="date" name="dateTo" value={filters.dateTo} onChange={update} label="Date to" InputLabelProps={{ shrink:true }} />{errors.dateTo && <p className="pr-filter__error">Date to is required</p>}</div>
            <Button variant="contained" onClick={runReport} disabled={loading}>Run report</Button>
        </div>{loading && <LinearProgress className="pr-progress" />}</section>
        <section className="pr-card"><header><div><h2>Unsold inventory</h2><p>{filtered.length} products found</p></div><TextField className="pr-search" size="small" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search products..." InputProps={{startAdornment:<InputAdornment position="start"><SearchRoundedIcon /></InputAdornment>}} /></header><div className="table-responsive"><table className="pr-table"><thead><tr><th>Product</th><th>Package</th><th>Price</th><th>Stock</th><th>Total value</th><th>Last sold</th></tr></thead><tbody>
            {filtered.map(item => <tr key={item.id}><td><div className="pr-product"><strong>{item.product_name}</strong><span>#{item.id} · {item.category_name || item.brand_name || 'Product'}</span></div></td><td>{item.quantity === 1 ? `${item.weight}${item.variation || ''}` : `${item.quantity} × ${(Number(item.weight || 0)/Number(item.quantity || 1)).toPrecision(2)}${item.variation || ''}`}</td><td><strong>{money(item.price)}</strong></td><td><div className="pr-stock"><span>{item.stock ?? 0} WS</span><span>{item.stock_pc ?? 0} RTL</span></div></td><td className="pr-money">{money(item.total_value)}</td><td>{date(item.last_sold_at) || <span className="pr-negative">No sales recorded</span>}</td></tr>)}
            {!filtered.length && <tr><td colSpan="6"><div className="pr-empty"><Inventory2OutlinedIcon /><strong>No unsold products found</strong><span>Adjust the filters and run the report again.</span></div></td></tr>}
        </tbody></table></div></section>
    </main>;
};
export default ReportProductUnsold;
