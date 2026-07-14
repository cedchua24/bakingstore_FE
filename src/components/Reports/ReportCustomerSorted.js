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
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import ShopOrderTransactionService from '../ShopOrderTransaction/ShopOrderTransactionService';
import './ReportCustomerSorted.css';

const emptyReport = { data: [], code: '', message: '', id: 0 };
const money = (value) => new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
}).format(Number(value || 0));

const formatDateInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getDefaultFilters = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    return {
        status: 1,
        limit: 100,
        dateFrom: formatDateInput(new Date(year, month, 1)),
        dateTo: formatDateInput(new Date(year, month + 1, 0)),
    };
};

const ReportCustomerSorted = () => {
    const [filters, setFilters] = useState(getDefaultFilters);
    const [report, setReport] = useState(emptyReport);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');

    const loadReport = (requestFilters) => {
        setLoading(true);
        setError('');
        ShopOrderTransactionService.fetchSortedCustomerReport(requestFilters)
            .then((response) => setReport(response.data || emptyReport))
            .catch(() => setError('The customer sales report could not be loaded. Please try again.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadReport(filters);
        // Load the default report once; filters are submitted explicitly afterward.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateFilter = (event) => {
        const { name, value } = event.target;
        setFilters((current) => ({ ...current, [name]: value }));
        if (value) setErrors((current) => ({ ...current, [name]: undefined }));
    };

    const runReport = () => {
        const nextErrors = {};
        if (!filters.status) nextErrors.status = 'Ranking is required.';
        if (!filters.limit) nextErrors.limit = 'Limit is required.';
        if (!filters.dateFrom) nextErrors.dateFrom = 'Start date is required.';
        if (!filters.dateTo) nextErrors.dateTo = 'End date is required.';
        if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) {
            nextErrors.dateTo = 'End date must be after the start date.';
        }
        setErrors(nextErrors);
        if (!Object.keys(nextErrors).length) loadReport(filters);
    };

    const records = Array.isArray(report.data) ? report.data : [];
    const visibleRecords = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) return records;
        return records.filter((customer) => [customer.id, customer.first_name, customer.last_name]
            .some((value) => String(value || '').toLowerCase().includes(term)));
    }, [query, records]);

    const totalSales = records.reduce((sum, customer) => sum + Number(customer.total_price || 0), 0);
    const totalProfit = records.reduce((sum, customer) => sum + Number(customer.total_profit || 0), 0);
    const customerName = (customer) => [customer.first_name, customer.last_name].filter(Boolean).join(' ') || 'Unnamed customer';

    return (
        <main className="cr-page">
            <div className="cr-shell">
                <header className="cr-hero">
                    <div className="cr-hero-icon"><LeaderboardOutlinedIcon /></div>
                    <div>
                        <span>Customer insights</span>
                        <h1>Customer Sales Ranking</h1>
                        <p>Identify your highest-value customers across a selected reporting period.</p>
                    </div>
                </header>

                {error && <Alert severity="error" className="cr-alert">{error}</Alert>}

                <section className="cr-summary">
                    <article><GroupsOutlinedIcon /><div><span>Customers</span><strong>{records.length.toLocaleString()}</strong></div></article>
                    <article><PaymentsOutlinedIcon /><div><span>Total sales</span><strong>{money(totalSales)}</strong></div></article>
                    <article><TrendingUpRoundedIcon /><div><span>Total profit</span><strong>{money(totalProfit)}</strong></div></article>
                </section>

                <section className="cr-filter-card">
                    <header><div><strong>Report filters</strong><span>Choose a ranking, result limit, and reporting period.</span></div></header>
                    <div className="cr-filter-grid">
                        <div>
                            <FormControl fullWidth size="small" error={Boolean(errors.status)}>
                                <InputLabel>Rank by</InputLabel>
                                <Select name="status" value={filters.status} label="Rank by" onChange={updateFilter}>
                                    <MenuItem value={1}>Sales: highest first</MenuItem>
                                    <MenuItem value={2}>Sales: lowest first</MenuItem>
                                </Select>
                            </FormControl>
                            {errors.status && <p className="cr-field-error">{errors.status}</p>}
                        </div>
                        <div>
                            <FormControl fullWidth size="small" error={Boolean(errors.limit)}>
                                <InputLabel>Limit</InputLabel>
                                <Select name="limit" value={filters.limit} label="Limit" onChange={updateFilter}>
                                    {[10, 50, 100, 200, 500].map((value) => <MenuItem key={value} value={value}>{value} customers</MenuItem>)}
                                </Select>
                            </FormControl>
                            {errors.limit && <p className="cr-field-error">{errors.limit}</p>}
                        </div>
                        <div>
                            <TextField fullWidth size="small" type="date" name="dateFrom" value={filters.dateFrom} onChange={updateFilter} label="Date from" error={Boolean(errors.dateFrom)} InputLabelProps={{ shrink: true }} />
                            {errors.dateFrom && <p className="cr-field-error">{errors.dateFrom}</p>}
                        </div>
                        <div>
                            <TextField fullWidth size="small" type="date" name="dateTo" value={filters.dateTo} onChange={updateFilter} label="Date to" error={Boolean(errors.dateTo)} InputLabelProps={{ shrink: true }} />
                            {errors.dateTo && <p className="cr-field-error">{errors.dateTo}</p>}
                        </div>
                        <Button variant="contained" onClick={runReport} disabled={loading}>Run report</Button>
                    </div>
                    {loading && <LinearProgress className="cr-progress" />}
                </section>

                <section className="cr-table-card">
                    <header>
                        <div><h2>Ranked customers</h2><p>{visibleRecords.length} results in this report</p></div>
                        <TextField size="small" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customer..." InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }} />
                    </header>
                    <div className="cr-table-scroll">
                        <table className="cr-table">
                            <thead><tr><th>Rank</th><th>Customer</th><th>Profit</th><th>Sales amount</th></tr></thead>
                            <tbody>
                                {visibleRecords.map((customer, index) => (
                                    <tr key={customer.id || index}>
                                        <td><span className="cr-rank">{index + 1}</span></td>
                                        <td><div className="cr-customer"><strong>{customerName(customer)}</strong><span>Customer #{customer.id}</span></div></td>
                                        <td className="cr-money cr-profit">{money(customer.total_profit)}</td>
                                        <td className="cr-money">{money(customer.total_price)}</td>
                                    </tr>
                                ))}
                                {!loading && !visibleRecords.length && <tr><td colSpan="4"><div className="cr-empty"><GroupsOutlinedIcon /><strong>No customers found</strong><span>Configure the report filters or try another search.</span></div></td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default ReportCustomerSorted;
