import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import ShopOrderTransactionService from '../ShopOrderTransaction/ShopOrderTransactionService';
import SupplierService from '../Supplier/SupplierService.service';
import CategoryService from '../Category/CategoryService.service';
import './SalesImpactAnalysis.css';

const currentMonth = () => new Date().toISOString().slice(0, 7);
const money = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(Number(value || 0));
const percent = value => value === null || value === undefined ? 'N/A' : `${Number(value) >= 0 ? '+' : ''}${Number(value).toFixed(1)}%`;
const tone = value => Number(value || 0) < 0 ? 'down' : Number(value || 0) > 0 ? 'up' : 'flat';
const unwrap = response => {
    const body = response?.data || {};
    return body.data && !Array.isArray(body.data) ? body.data : body;
};

const monthProjection = (month, sales) => {
    const now = new Date();
    const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    if (month !== current) return null;
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const elapsedDays = now.getDate();
    if (elapsedDays >= daysInMonth) return null;
    const dailyAverage = Number(sales || 0) / elapsedDays;
    return { dailyAverage, projectedSales: dailyAverage * daysInMonth, elapsedDays, daysInMonth };
};

const ComparisonCard = ({ label, value, comparison, caption, variant = '' }) => {
    const direction = tone(comparison?.sales_difference);
    return <article className={`sia-metric sia-metric--${direction} ${variant ? `sia-metric--${variant}` : ''}`}>
        {variant === 'current' && <em className="sia-metric__badge">Actual to date</em>}
        <span>{label}</span>
        <strong>{money(value)}</strong>
        {comparison && <div><b>{percent(comparison.sales_change_percentage)}</b><small>{money(comparison.sales_difference)} {caption}</small></div>}
    </article>;
};

const StatusPill = ({ status }) => <span className={`sia-status sia-status--${String(status || 'unchanged').toLowerCase()}`}>{String(status || 'UNCHANGED').replaceAll('_', ' ')}</span>;

const DriverTable = ({ title, subtitle, icon, rows, kind, emptyText }) => <section className="sia-card">
    <header><div className="sia-card__title">{icon}<div><h2>{title}</h2><p>{subtitle}</p></div></div><span className="sia-count">{rows.length}</span></header>
    <div className="table-responsive"><table className="sia-table"><thead><tr><th>{kind === 'product' ? 'Product' : 'Customer'}</th><th>Status</th><th>Current sales</th><th>Last month</th><th>3-month average</th><th>Sales impact</th><th>Change</th></tr></thead><tbody>
        {rows.map((item, index) => <tr key={item[`${kind}_id`] || index}>
            <td><strong>{kind === 'product' ? item.product_name : item.display_name || item.customer_name}</strong>{kind === 'product' && <small>{[item.variation, item.packaging].filter(Boolean).join(' · ')}</small>}{kind === 'customer' && item.store_name && <small>{item.store_name}</small>}</td>
            <td><StatusPill status={item.status}/></td><td>{money(item.current_sales)}</td><td>{money(item.last_month_sales)}</td><td>{money(item.previous_three_month_average_sales)}</td>
            <td className={`sia-impact sia-impact--${tone(item.sales_impact)}`}>{money(item.sales_impact)}</td><td className={`sia-change sia-change--${tone(item.sales_impact)}`}>{percent(item.sales_change_percentage)}</td>
        </tr>)}
        {!rows.length && <tr><td colSpan="7"><div className="sia-empty">{emptyText}</div></td></tr>}
    </tbody></table></div>
</section>;

const SalesImpactAnalysis = () => {
    const [filters, setFilters] = useState({ month: currentMonth(), limit: 10, supplier_id: '', category_id: '' });
    const [report, setReport] = useState(null);
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const load = (request = filters) => {
        if (!request.month) return setError('Please choose a report month.');
        setLoading(true);
        setError('');
        ShopOrderTransactionService.fetchMonthlySalesImpactAnalysis({
            ...request,
            limit: Number(request.limit),
            supplier_id: request.supplier_id || null,
            category_id: request.category_id || null
        }).then(response => setReport(unwrap(response)))
          .catch(err => setError(err.response?.data?.message || 'Unable to load the sales impact analysis.'))
          .finally(() => setLoading(false));
    };

    useEffect(() => {
        load(filters);
        SupplierService.getAll().then(response => setSuppliers(response.data?.data || response.data || [])).catch(() => {});
        CategoryService.getAll().then(response => setCategories(response.data?.data || response.data || [])).catch(() => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const update = event => setFilters(current => ({ ...current, [event.target.name]: event.target.value }));
    const summary = report?.sales_summary || {};
    const explanation = report?.why_sales_changed || {};
    const products = report?.product_impact || {};
    const customers = report?.customer_impact || {};
    const negativeProducts = [...(products.missing || []), ...(products.biggest_declines || []).filter(item => item.status !== 'MISSING')];
    const negativeCustomers = [...(customers.missing || []), ...(customers.biggest_declines || []).filter(item => item.status !== 'MISSING')];
    const reportLabel = report?.report_month?.label || 'Selected month';
    const projection = monthProjection(filters.month, summary.current?.total_sales);

    return <main className="sia-page">
        <section className="sia-hero"><div className="sia-hero__icon"><AnalyticsRoundedIcon/></div><div><span>Sales intelligence</span><h1>Sales Impact Analysis</h1><p>See monthly performance and identify the products and customers driving the change.</p></div></section>

        <section className="sia-filter"><div><strong>Analysis filters</strong><span>Compare a month with last month and the previous three-month average.</span></div><div className="sia-filter__grid">
            <TextField size="small" type="month" name="month" value={filters.month} onChange={update} label="Report month" InputLabelProps={{ shrink: true }}/>
            <FormControl size="small"><InputLabel>Category</InputLabel><Select name="category_id" value={filters.category_id} label="Category" onChange={update}><MenuItem value="">All categories</MenuItem>{categories.map(item => <MenuItem key={item.id} value={item.id}>{item.category_name}</MenuItem>)}</Select></FormControl>
            <FormControl size="small"><InputLabel>Supplier</InputLabel><Select name="supplier_id" value={filters.supplier_id} label="Supplier" onChange={update}><MenuItem value="">All suppliers</MenuItem>{suppliers.map(item => <MenuItem key={item.id} value={item.id}>{item.supplier_name}</MenuItem>)}</Select></FormControl>
            <FormControl size="small"><InputLabel>Drivers shown</InputLabel><Select name="limit" value={filters.limit} label="Drivers shown" onChange={update}>{[5, 10, 20, 50].map(value => <MenuItem key={value} value={value}>Top {value}</MenuItem>)}</Select></FormControl>
            <Button variant="contained" disabled={loading} onClick={() => load()}>Run analysis</Button>
        </div>{loading && <LinearProgress/>}</section>
        {error && <Alert severity="error" className="sia-alert">{error}</Alert>}

        {report && <>
            <section className="sia-metrics">
                <ComparisonCard label={`${reportLabel} current sales`} value={summary.current?.total_sales} variant="current"/>
                <ComparisonCard label="Compared with last month" value={summary.last_month?.total_sales} comparison={summary.vs_last_month} caption="difference"/>
                <ComparisonCard label="Previous 3-month average" value={summary.previous_three_month_average?.total_sales} comparison={summary.vs_previous_three_month_average} caption="difference"/>
                {projection && <article className="sia-metric sia-metric--projection"><em className="sia-metric__badge">Forecast</em><span>Projected month-end sales</span><strong>{money(projection.projectedSales)}</strong><div><b>{money(projection.dailyAverage)}/day</b><small>Based on {projection.elapsedDays} of {projection.daysInMonth} days</small></div></article>}
            </section>

            <section className={`sia-explanation sia-explanation--${String(summary.trend || 'unchanged').toLowerCase()}`}><div className="sia-explanation__icon">{summary.trend === 'LOWER' ? <TrendingDownRoundedIcon/> : <TrendingUpRoundedIcon/>}</div><div><span>Why sales changed</span><h2>{explanation.headline}</h2><p>{explanation.missing_customer_count || 0} customers stopped ordering and {explanation.declining_customer_count || 0} reduced their orders. {explanation.missing_product_count || 0} products had no sales and {explanation.declining_product_count || 0} declined.</p></div><div className="sia-net"><span>Product net impact<strong className={tone(explanation.product_net_impact)}>{money(explanation.product_net_impact)}</strong></span><span>Customer net impact<strong className={tone(explanation.customer_net_impact)}>{money(explanation.customer_net_impact)}</strong></span></div></section>

            <div className="sia-section-label"><TrendingDownRoundedIcon/><div><h2>What pulled sales down</h2><p>Missing and declining contributors compared with their usual three-month sales.</p></div></div>
            <div className="sia-grid"><DriverTable title="Product losses" subtitle={`${money(products.negative_net_impact)} net sales impact`} icon={<Inventory2RoundedIcon/>} rows={negativeProducts} kind="product" emptyText="No declining or missing products found."/><DriverTable title="Customer losses" subtitle={`${money(customers.negative_net_impact)} net sales impact`} icon={<GroupsRoundedIcon/>} rows={negativeCustomers} kind="customer" emptyText="No declining or missing customers found."/></div>

            <div className="sia-section-label sia-section-label--up"><TrendingUpRoundedIcon/><div><h2>What lifted sales</h2><p>Products and customers contributing positive sales impact.</p></div></div>
            <div className="sia-grid"><DriverTable title="Growing products" subtitle={`${money(products.positive_net_impact)} positive impact`} icon={<Inventory2RoundedIcon/>} rows={products.biggest_growth || []} kind="product" emptyText="No growing products found."/><DriverTable title="Growing customers" subtitle={`${money(customers.positive_net_impact)} positive impact`} icon={<GroupsRoundedIcon/>} rows={customers.biggest_growth || []} kind="customer" emptyText="No growing customers found."/></div>
        </>}
    </main>;
};

export default SalesImpactAnalysis;
