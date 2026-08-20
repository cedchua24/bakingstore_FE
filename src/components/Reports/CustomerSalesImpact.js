import React, { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import ShopOrderTransactionService from '../ShopOrderTransaction/ShopOrderTransactionService';
import './ProductReport.css';

const money = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(value || 0));
const number = value => Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 1 });
const thisMonth = () => new Date().toISOString().slice(0, 7);
const first = (source, keys, fallback = 0) => {
    const key = keys.find(candidate => source?.[candidate] !== undefined && source?.[candidate] !== null);
    return key ? source[key] : fallback;
};
const period = (item, key, flatPrefix) => {
    const source = item?.[key] || {};
    return {
        sales: first(source, ['sales_amount', 'sales', 'total_sales', 'amount'], first(item, [`${flatPrefix}_sales`, `${flatPrefix}_sales_amount`], 0)),
        profit: first(source, ['profit', 'total_profit', 'profit_amount'], first(item, [`${flatPrefix}_profit`], 0)),
        orders: first(source, ['order_count', 'orders', 'total_orders'], first(item, [`${flatPrefix}_order_count`, `${flatPrefix}_orders`], 0))
    };
};
const impact = (item, key, prefix) => {
    const source = item?.[key] || {};
    return {
        sales: Number(first(source, ['sales_impact', 'sales_change', 'amount_change'], first(item, [`${prefix}_sales_impact`, `${prefix}_sales_change`], 0))),
        profit: Number(first(source, ['profit_impact', 'profit_change'], first(item, [`${prefix}_profit_impact`], 0))),
        percent: Number(first(source, ['sales_change_percentage', 'change_percentage', 'percentage'], first(item, [`${prefix}_sales_change_percentage`, `${prefix}_change_percentage`], 0)))
    };
};
const customerName = item => first(item, ['customer_name', 'display_name', 'name'], [item?.first_name, item?.last_name].filter(Boolean).join(' ') || 'Unnamed customer');
const statusLabel = status => String(status || 'UNCHANGED').replaceAll('_', ' ');
const groupMap = {
    data: ['data', 'All comparison results'],
    top_customers: ['top_customers', 'Highest sales this month'],
    positive_impact_customers: ['positive_impact_customers', 'Winning customers'],
    declining_customers: ['declining_customers', 'Declining customers'],
    missing_customers: ['missing_customers', 'Missing customers']
};

const CustomerSalesImpact = () => {
    const [filters, setFilters] = useState({ month: thisMonth(), limit: 10, group: 'positive_impact_customers' });
    const [report, setReport] = useState({ data: [] });
    const [query, setQuery] = useState('');
    const [showProfit, setShowProfit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const load = (request = filters) => {
        if (!request.month) return setError('Please choose a report month.');
        setLoading(true);
        setError('');
        const { group, ...apiFilters } = request;
        const groupSort = { data: 'current_sales', top_customers: 'current_sales', positive_impact_customers: 'biggest_increase', declining_customers: 'biggest_drop', missing_customers: 'biggest_drop' };
        ShopOrderTransactionService.fetchMonthlyCustomerSalesComparison({
            ...apiFilters,
            limit: Number(apiFilters.limit),
            sort: groupSort[group] || 'current_sales',
            direction: 'desc'
        }).then(response => {
            const body = response.data?.data && !Array.isArray(response.data.data) ? response.data.data : response.data;
            setReport(body || { data: [] });
        }).catch(err => setError(err.response?.data?.message || 'Unable to load the customer sales comparison.'))
          .finally(() => setLoading(false));
    };

    useEffect(() => {
        load(filters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const update = event => {
        const { name, value } = event.target;
        setFilters(current => ({ ...current, [name]: value }));
    };
    const groupKey = groupMap[filters.group]?.[0] || 'data';
    const rawRows = Array.isArray(report[groupKey]) ? report[groupKey] : [];
    const rows = useMemo(() => {
        const term = query.trim().toLowerCase();
        return term ? rawRows.filter(item => `${customerName(item)} ${first(item, ['store_name', 'business_name'], '')}`.toLowerCase().includes(term)) : rawRows;
    }, [rawRows, query]);
    const positiveCount = Array.isArray(report.positive_impact_customers) ? report.positive_impact_customers.length : 0;
    const decliningCount = Array.isArray(report.declining_customers) ? report.declining_customers.length : 0;
    const missingCount = Array.isArray(report.missing_customers) ? report.missing_customers.length : 0;

    return <main className="pr-page ct-page">
        <section className="pr-hero"><div className="pr-hero__icon"><GroupsOutlinedIcon/></div><div><span>Customer reports</span><h1>Customer Sales Impact</h1><p>Find the customers driving growth, causing declines, or no longer ordering in the selected month.</p></div></section>
        <section className="pr-summary ct-summary"><div><TrendingUpRoundedIcon/><div><span>Winning customers</span><strong>{number(positiveCount)}</strong></div></div><div><TrendingDownRoundedIcon/><div><span>Declining customers</span><strong>{number(decliningCount)}</strong></div></div><div><PersonOffOutlinedIcon/><div><span>Missing customers</span><strong>{number(missingCount)}</strong></div></div></section>
        <section className="pr-filter"><div className="pr-filter__header"><strong>Customer impact filters</strong><span>Impact status is based on the selected month compared with the previous three-month average. Last month is secondary context.</span></div><div className="ct-filter-grid">
            <TextField fullWidth size="small" type="month" name="month" value={filters.month} onChange={update} label="Report month" InputLabelProps={{ shrink: true }}/>
            <FormControl fullWidth size="small"><InputLabel>Show</InputLabel><Select name="limit" value={filters.limit} label="Show" onChange={update}>{[10,50,100,250,500,1000,5000].map(value => <MenuItem key={value} value={value}>Top {value}</MenuItem>)}</Select></FormControl>
            <FormControl fullWidth size="small"><InputLabel>Impact group</InputLabel><Select name="group" value={filters.group} label="Impact group" onChange={update}><MenuItem value="positive_impact_customers">Winning customers</MenuItem><MenuItem value="declining_customers">Declining customers</MenuItem><MenuItem value="missing_customers">Missing customers</MenuItem><MenuItem value="top_customers">Highest sales</MenuItem><MenuItem value="data">All results</MenuItem></Select></FormControl>
            <Button variant="contained" onClick={() => load()} disabled={loading}>Compare customers</Button>
        </div>{loading && <LinearProgress className="pr-progress"/>}</section>
        {error && <Alert severity="error" className="pt-alert">{error}</Alert>}
        <div className="pci-benchmark-note"><strong>Primary impact benchmark</strong><span>Winning, declining, and missing verdicts are based on the selected month versus the previous 3-month average.</span></div>
        <section className="pr-card"><header><div><h2>{groupMap[filters.group]?.[1]}</h2><p>{rows.length} customers · selected month {filters.month}</p></div><div className="ct-table-tools"><FormControlLabel control={<Switch size="small" checked={showProfit} onChange={event => setShowProfit(event.target.checked)}/>} label="Show profit"/><TextField className="pr-search" size="small" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search customer..." InputProps={{ startAdornment:<InputAdornment position="start"><SearchRoundedIcon/></InputAdornment> }}/></div></header><div className="table-responsive"><table className="pr-table ct-table"><thead><tr><th>Rank movement</th><th>Customer</th><th className="pci-current-col">Current month</th><th>Last month</th><th>Previous 3-month average</th><th>Vs last month</th><th>Vs 3-month average</th><th>Status</th></tr></thead><tbody>
            {rows.map((item,index) => {
                const current = period(item, 'current_month', 'current');
                const last = period(item, 'last_month', 'previous');
                const average = period(item, 'previous_three_month_average', 'three_month_average');
                const versusLast = impact(item, 'vs_last_month', 'vs_last_month');
                const versusAverage = impact(item, 'vs_previous_three_month_average', 'vs_three_month_average');
                const currentRank = first(item, ['current_rank', 'rank'], index + 1);
                const previousRank = first(item, ['previous_rank', 'last_month_rank'], '—');
                const rankChange = Number(first(item, ['rank_change'], Number(previousRank) - Number(currentRank))) || 0;
                const status = first(item, ['status'], 'UNCHANGED');
                const Impact = ({ value }) => <div className="ct-impact"><strong className={value.sales < 0 ? 'pr-negative' : 'pt-positive'}>{value.sales >= 0 ? '+' : ''}{money(value.sales)}</strong>{showProfit && <span>{value.profit ? `${value.profit >= 0 ? '+' : ''}${money(value.profit)} profit` : '—'}</span>}<b className={value.percent < 0 ? 'ct-percent ct-percent--down' : 'ct-percent ct-percent--up'}>{value.percent >= 0 ? '+' : ''}{number(value.percent)}%</b></div>;
                return <tr key={item.customer_id || item.id || index}><td><div className="pt-rank-move"><span className="pr-rank">{currentRank}</span><div><small>was #{previousRank}</small><strong className={rankChange < 0 ? 'pr-negative' : 'pt-positive'}>{rankChange > 0 ? '▲ ' : rankChange < 0 ? '▼ ' : ''}{Math.abs(rankChange) || '—'}</strong></div></div></td><td><div className="pr-product"><strong>{customerName(item)}</strong><span>{first(item, ['store_name', 'business_name'], '')}</span></div></td><td className="pci-current-cell"><strong>{money(current.sales)}</strong><span className="pci-qty">{number(current.orders)} orders</span>{showProfit && <small>{money(current.profit)} profit</small>}</td><td><strong>{money(last.sales)}</strong><span className="pci-qty">{number(last.orders)} orders</span>{showProfit && <small>{money(last.profit)} profit</small>}</td><td><strong>{money(average.sales)}</strong><span className="pci-qty">{number(average.orders)} avg. orders</span>{showProfit && <small>{money(average.profit)} avg. profit</small>}</td><td><Impact value={versusLast}/></td><td><Impact value={versusAverage}/></td><td><span className={`pci-status pci-status--${String(status).toLowerCase()}`}>{statusLabel(status)}</span></td></tr>;
            })}
            {!rows.length && !loading && <tr><td colSpan="8"><div className="pr-empty"><CompareArrowsRoundedIcon/><strong>No customer impact found</strong><span>Try another month, impact group, or filter.</span></div></td></tr>}
        </tbody></table></div></section>
    </main>;
};

export default CustomerSalesImpact;
