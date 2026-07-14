import React, { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import CategoryService from '../Category/CategoryService.service';
import ShopOrderTransactionService from '../ShopOrderTransaction/ShopOrderTransactionService';
import './ProductReport.css';

const emptyReport = { data: [], code: '', message: '', id: 0 };
const money = (value) => new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
}).format(Number(value || 0));

const ReportCategorySales = () => {
    const role = localStorage.getItem('role_as');
    const [filters, setFilters] = useState({
        categoryId: '',
        type: '',
        status: '',
        limit: '',
        dateFrom: '',
        dateTo: '',
    });
    const [categories, setCategories] = useState([]);
    const [report, setReport] = useState(emptyReport);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');

    useEffect(() => {
        Promise.all([
            ShopOrderTransactionService.fetchSalesByCategory(filters),
            CategoryService.getAll(),
        ])
            .then(([reportResponse, categoryResponse]) => {
                setReport(reportResponse.data || emptyReport);
                setCategories(Array.isArray(categoryResponse.data) ? categoryResponse.data : []);
            })
            .catch(() => setError('The category sales report could not be loaded. Please try again.'))
            .finally(() => setLoading(false));
        // Load initial data once; filters are submitted explicitly afterward.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateFilter = (event) => {
        const { name, value } = event.target;
        setFilters((current) => ({ ...current, [name]: value }));
        if (value) setErrors((current) => ({ ...current, [name]: undefined }));
    };

    const runReport = () => {
        const nextErrors = {};
        if (!filters.categoryId) nextErrors.categoryId = 'Category is required.';
        if (!filters.status) nextErrors.status = 'Ranking is required.';
        if (!filters.limit) nextErrors.limit = 'Limit is required.';
        if (!filters.dateFrom) nextErrors.dateFrom = 'Start date is required.';
        if (!filters.dateTo) nextErrors.dateTo = 'End date is required.';
        if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) {
            nextErrors.dateTo = 'End date must be after the start date.';
        }
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;

        setLoading(true);
        setError('');
        ShopOrderTransactionService.fetchSalesByCategory(filters)
            .then((response) => setReport(response.data || emptyReport))
            .catch(() => setError('The category sales report could not be generated. Please try again.'))
            .finally(() => setLoading(false));
    };

    const records = Array.isArray(report.data) ? report.data : [];
    const visibleRecords = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) return records;
        return records.filter((item) => [item.id, item.product_name, item.business_type, item.packaging]
            .some((value) => String(value || '').toLowerCase().includes(term)));
    }, [query, records]);

    const totalSales = records.reduce((sum, item) => sum + Number(item.total_price || 0), 0);
    const totalProfit = records.reduce((sum, item) => sum + Number(item.total_profit || 0), 0);
    const totalUnits = records.reduce((sum, item) => sum + Number(item.total_quantity || 0), 0);
    const selectedCategory = categories.find((category) => String(category.id) === String(filters.categoryId));
    const soldLabel = (item) => Number(item.total_quantity || 0) < Number(item.quantity || 0)
        ? `${item.total_quantity || 0} Pc`
        : `${Math.floor(Number(item.total_quantity || 0) / Number(item.quantity || 1))} ${item.packaging || 'packs'} / ${item.total_quantity || 0} Pc`;

    return (
        <main className="pr-page">
            <section className="pr-hero">
                <div className="pr-hero__icon"><CategoryOutlinedIcon /></div>
                <div>
                    <span>Category performance</span>
                    <h1>Category Sales Report</h1>
                    <p>Analyze product sales, profit, and inventory movement within a selected category.</p>
                </div>
            </section>

            {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}

            <section className="pr-summary">
                <div><PaymentsOutlinedIcon /><div><span>Total sales</span><strong>{money(totalSales)}</strong></div></div>
                {role === '2' && <div><TrendingUpRoundedIcon /><div><span>Total profit</span><strong>{money(totalProfit)}</strong></div></div>}
                <div><Inventory2OutlinedIcon /><div><span>Pieces sold</span><strong>{totalUnits.toLocaleString()}</strong></div></div>
                <div><LeaderboardOutlinedIcon /><div><span>Products</span><strong>{records.length.toLocaleString()}</strong></div></div>
            </section>

            <section className="pr-filter">
                <div className="pr-filter__header">
                    <strong>Report filters</strong>
                    <span>Choose a category, sales type, ranking, result limit, and reporting period.</span>
                </div>
                <div className="pr-filter__grid">
                    <div>
                        <FormControl fullWidth size="small" error={Boolean(errors.categoryId)}>
                            <InputLabel>Category *</InputLabel>
                            <Select name="categoryId" value={filters.categoryId} label="Category *" onChange={updateFilter}>
                                {categories.map((category) => <MenuItem key={category.id} value={category.id}>{category.category_name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        {errors.categoryId && <p className="pr-filter__error">{errors.categoryId}</p>}
                    </div>
                    <FormControl fullWidth size="small">
                        <InputLabel>Type</InputLabel>
                        <Select name="type" value={filters.type} label="Type" onChange={updateFilter}>
                            <MenuItem value="">All types</MenuItem>
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="WHOLESALE">Wholesale</MenuItem>
                            <MenuItem value="RETAIL">Retail</MenuItem>
                        </Select>
                    </FormControl>
                    <div>
                        <FormControl fullWidth size="small" error={Boolean(errors.status)}>
                            <InputLabel>Rank by *</InputLabel>
                            <Select name="status" value={filters.status} label="Rank by *" onChange={updateFilter}>
                                <MenuItem value={1}>Quantity: highest first</MenuItem>
                                <MenuItem value={2}>Quantity: lowest first</MenuItem>
                                <MenuItem value={3}>Amount: highest first</MenuItem>
                                <MenuItem value={4}>Amount: lowest first</MenuItem>
                            </Select>
                        </FormControl>
                        {errors.status && <p className="pr-filter__error">{errors.status}</p>}
                    </div>
                    <div>
                        <FormControl fullWidth size="small" error={Boolean(errors.limit)}>
                            <InputLabel>Limit *</InputLabel>
                            <Select name="limit" value={filters.limit} label="Limit *" onChange={updateFilter}>
                                {[10, 50, 100, 200, 500, 1000, 2000].map((value) => <MenuItem key={value} value={value}>{value} products</MenuItem>)}
                            </Select>
                        </FormControl>
                        {errors.limit && <p className="pr-filter__error">{errors.limit}</p>}
                    </div>
                    <div>
                        <TextField fullWidth size="small" type="date" name="dateFrom" value={filters.dateFrom} onChange={updateFilter} label="Date from" error={Boolean(errors.dateFrom)} InputLabelProps={{ shrink: true }} />
                        {errors.dateFrom && <p className="pr-filter__error">{errors.dateFrom}</p>}
                    </div>
                    <div>
                        <TextField fullWidth size="small" type="date" name="dateTo" value={filters.dateTo} onChange={updateFilter} label="Date to" error={Boolean(errors.dateTo)} InputLabelProps={{ shrink: true }} />
                        {errors.dateTo && <p className="pr-filter__error">{errors.dateTo}</p>}
                    </div>
                    <Button variant="contained" onClick={runReport} disabled={loading}>Run report</Button>
                </div>
                {loading && <LinearProgress className="pr-progress" />}
            </section>

            <section className="pr-card">
                <header>
                    <div>
                        <h2>{selectedCategory?.category_name || 'Category products'}</h2>
                        <p>{visibleRecords.length} results in this report</p>
                    </div>
                    <TextField className="pr-search" size="small" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search report..." InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }} />
                </header>
                <div className="table-responsive">
                    <table className="pr-table">
                        <thead><tr><th>Rank</th><th>Product</th><th>Type</th>{role === '2' && <th>Profit</th>}<th>Sales amount</th><th>Wholesale qty</th><th>Retail qty</th><th>Total sold</th><th>Current stock</th><th>Difference</th></tr></thead>
                        <tbody>
                            {visibleRecords.map((item, index) => {
                                const packQuantity = Math.floor(Number(item.total_quantity || 0) / Number(item.quantity || 1));
                                const difference = Number(item.stock || 0) - packQuantity;
                                return (
                                    <tr key={item.mark_up_product_id || item.id || index}>
                                        <td><span className="pr-rank">{index + 1}</span></td>
                                        <td><div className="pr-product"><strong>{item.product_name || 'Unnamed product'}</strong><span>#{item.id}</span></div></td>
                                        <td><span className="pr-pill">{item.business_type || 'ALL'}</span></td>
                                        {role === '2' && <td className="pr-money">{money(item.total_profit)}</td>}
                                        <td className="pr-money">{money(item.total_price)}</td>
                                        <td>{Number(item.total_quantity || 0) < Number(item.quantity || 0) ? '—' : packQuantity}</td>
                                        <td>{item.total_quantity || 0}</td>
                                        <td><strong>{soldLabel(item)}</strong></td>
                                        <td>{item.stock || 0} {item.packaging}</td>
                                        <td className={difference < 0 ? 'pr-negative' : ''}>{item.business_type === 'ALL' ? difference : '—'}</td>
                                    </tr>
                                );
                            })}
                            {!loading && !visibleRecords.length && <tr><td colSpan={role === '2' ? 10 : 9}><div className="pr-empty"><CategoryOutlinedIcon /><strong>No category sales found</strong><span>Configure the report filters and try again.</span></div></td></tr>}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
};

export default ReportCategorySales;
