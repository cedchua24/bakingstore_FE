import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
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
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ShopOrderTransactionService from '../ShopOrderTransaction/ShopOrderTransactionService';
import SupplierService from '../Supplier/SupplierService.service';
import CategoryService from '../Category/CategoryService.service';
import ImpactGroupSelect from '../Common/ImpactGroupSelect';
import './SalesImpactAnalysis.css';

const currentMonth = () => new Date().toISOString().slice(0, 7);
const money = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(Number(value || 0));
const percent = value => value === null || value === undefined ? 'N/A' : `${Number(value) >= 0 ? '+' : ''}${Number(value).toFixed(1)}%`;
const tone = value => Number(value || 0) < 0 ? 'down' : Number(value || 0) > 0 ? 'up' : 'flat';
const unwrap = response => {
    const body = response?.data || {};
    return body.data && !Array.isArray(body.data) ? body.data : body;
};
const impactOptions = [
    ['all', 'All results'], ['winning', 'Winning'], ['highest_sales', 'Highest sales'],
    ['new_product', 'New products'], ['new_customer', 'New customers'], ['lowest_sales', 'Lowest sales'],
    ['declining', 'Declining'], ['missing', 'Missing']
];
const entityImpactOptions = kind => impactOptions
    .filter(([value]) => value !== (kind === 'product' ? 'new_customer' : 'new_product'))
    .map(([value, label]) => ({ value, label: value === 'all' ? 'All results' : value.startsWith('new_') ? `New ${kind === 'product' ? 'products' : 'customers'}` : `${label} ${kind === 'product' ? 'products' : 'customers'}` }));

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

const ComparisonCard = ({ label, value, comparison, caption, variant = '', recoveryAmount = 0 }) => {
    const direction = tone(comparison?.sales_difference);
    return <article className={`sia-metric sia-metric--${direction} ${variant ? `sia-metric--${variant}` : ''}`}>
        {variant === 'current' && <em className="sia-metric__badge">Actual to date</em>}
        <span>{label}</span>
        <strong className={recoveryAmount > 0 ? 'sia-metric__actual--superseded' : ''}>{money(value)}</strong>
        {recoveryAmount > 0 && <div className="sia-metric__selected-plan"><span>New amount with selected plan</span><strong>{money(Number(value || 0) + recoveryAmount)}</strong><small>+{money(recoveryAmount)} potential recovery</small></div>}
        {comparison && <div><b>{percent(comparison.sales_change_percentage)}</b><small>{money(comparison.sales_difference)} {caption}</small></div>}
    </article>;
};

const StatusPill = ({ status }) => <span className={`sia-status sia-status--${String(status || 'unchanged').toLowerCase()}`}>{String(status || 'UNCHANGED').replaceAll('_', ' ')}</span>;

const DriverTable = ({ title, subtitle, icon, rows, kind, emptyText, selected = [], onToggle, limit = 10 }) => {
    const [expanded, setExpanded] = useState(false);
    const leadingRows = rows.slice(0, limit);
    const remainingRows = rows.slice(limit);
    const others = remainingRows.length ? remainingRows.reduce((total, item) => ({
        __others: true,
        status: 'OTHERS',
        current_sales: total.current_sales + Number(item.current_sales || 0),
        last_month_sales: total.last_month_sales + Number(item.last_month_sales || 0),
        previous_three_month_average_sales: total.previous_three_month_average_sales + Number(item.previous_three_month_average_sales || 0),
        sales_impact: total.sales_impact + Number(item.sales_impact ?? (Number(item.current_sales || 0) - Number(item.last_month_sales || 0))),
    }), { current_sales: 0, last_month_sales: 0, previous_three_month_average_sales: 0, sales_impact: 0 }) : null;
    if (others) others.sales_change_percentage = others.last_month_sales ? (others.sales_impact / others.last_month_sales) * 100 : null;
    const displayRows = others ? [...leadingRows, others] : leadingRows;
    return <section className="sia-card">
        <header><div className="sia-card__title">{icon}<div><h2>{title}</h2><p>{subtitle}</p></div></div><div className="sia-card__header-actions"><span className="sia-count">{rows.length}</span><button type="button" aria-expanded={expanded} onClick={() => setExpanded(current => !current)}>{expanded ? 'Hide details' : 'Show details'}<ExpandMoreRoundedIcon/></button></div></header>
        {expanded && <div className="table-responsive"><table className="sia-table"><thead><tr>{onToggle && <th>Plan</th>}<th>{kind === 'product' ? 'Product' : 'Customer'}</th><th>Status</th><th>Current sales</th><th>Last month</th><th>3-month average</th><th>Sales impact</th><th>Change</th></tr></thead><tbody>
            {displayRows.map((item, index) => { const rowKey = `${kind}:${item[`${kind}_id`] || item.id || index}`; return <tr key={item.__others ? `${kind}-others` : rowKey} className={item.__others ? 'sia-table__others' : ''}>
                {onToggle && <td>{!item.__others && <Checkbox size="small" checked={selected.includes(rowKey)} onChange={() => onToggle(rowKey)}/>}</td>}
                <td><strong>{item.__others ? `Other ${remainingRows.length} ${kind === 'product' ? 'products' : 'customers'}` : kind === 'product' ? item.product_name : item.display_name || item.customer_name}</strong>{item.__others && <small>Combined total after the top {limit}</small>}{!item.__others && kind === 'product' && <small>{[item.variation, item.packaging].filter(Boolean).join(' · ')}</small>}{!item.__others && kind === 'customer' && item.store_name && <small>{item.store_name}</small>}</td>
                <td><StatusPill status={item.status}/></td><td>{money(item.current_sales)}</td><td>{money(item.last_month_sales)}</td><td>{money(item.previous_three_month_average_sales)}</td>
                <td className={`sia-impact sia-impact--${tone(item.sales_impact)}`}>{money(item.sales_impact)}</td><td className={`sia-change sia-change--${tone(item.sales_impact)}`}>{percent(item.sales_change_percentage)}</td>
            </tr>; })}
            {!rows.length && <tr><td colSpan={onToggle ? 8 : 7}><div className="sia-empty">{emptyText}</div></td></tr>}
        </tbody></table></div>}
    </section>;
};

const SalesImpactAnalysis = () => {
    const [filters, setFilters] = useState({ month: currentMonth(), supplier_id: '', category_id: '', product_impact_group: 'all', customer_impact_group: 'all', display_limit: 10 });
    const [report, setReport] = useState(null);
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedRecovery, setSelectedRecovery] = useState([]);
    const [recoveryScope, setRecoveryScope] = useState('product');

    const load = (request = filters) => {
        if (!request.month) return setError('Please choose a report month.');
        setLoading(true);
        setError('');
        const apiFilters = { ...request };
        delete apiFilters.display_limit;
        ShopOrderTransactionService.fetchMonthlySalesImpactAnalysis({
            ...apiFilters,
            limit: 5000,
            supplier_id: request.supplier_id || null,
            category_id: request.category_id || null
        }).then(response => { setReport(unwrap(response)); setSelectedRecovery([]); })
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
    const productRows = Array.isArray(products.data) ? products.data : [];
    const customerRows = Array.isArray(customers.data) ? customers.data : [];
    const decliningProducts = (products.biggest_declines || productRows.filter(item => ['DECLINING', 'LOSING'].includes(String(item.status).toUpperCase()))).filter(item => String(item.status).toUpperCase() !== 'MISSING');
    const decliningCustomers = (customers.biggest_declines || customerRows.filter(item => ['DECLINING', 'LOSING'].includes(String(item.status).toUpperCase()))).filter(item => String(item.status).toUpperCase() !== 'MISSING');
    const missingProducts = products.missing || productRows.filter(item => String(item.status).toUpperCase() === 'MISSING');
    const missingCustomers = customers.missing || customerRows.filter(item => String(item.status).toUpperCase() === 'MISSING');
    const newProducts = products.new_products || productRows.filter(item => item.is_new_product || String(item.status).toUpperCase() === 'NEW_PRODUCT');
    const newCustomers = customers.new_customers || customerRows.filter(item => item.is_new_customer || String(item.status).toUpperCase() === 'NEW_CUSTOMER');
    const reportLabel = report?.report_month?.label || 'Selected month';
    const projection = monthProjection(filters.month, summary.current?.total_sales);
    const winningProducts = products.biggest_growth || [];
    const winningCustomers = customers.biggest_growth || [];
    const recoveryTarget = item => String(item.status).toUpperCase() === 'MISSING' ? Number(item.last_month_sales || 0) : Math.max(Number(item.last_month_sales || 0) - Number(item.current_sales || 0), 0);
    const recoveryRows = recoveryScope === 'product'
        ? [...decliningProducts, ...missingProducts].map(item => ({ item, kind: 'product' }))
        : [...decliningCustomers, ...missingCustomers].map(item => ({ item, kind: 'customer' }));
    const recoveryKey = (item, kind, index = 0) => `${kind}:${item[`${kind}_id`] || item.id || index}`;
    const selectedRecoveryAmount = recoveryRows.reduce((total, row, index) => selectedRecovery.includes(recoveryKey(row.item, row.kind, index)) ? total + recoveryTarget(row.item) : total, 0);
    const toggleRecovery = key => setSelectedRecovery(current => current.includes(key) ? current.filter(value => value !== key) : [...current, key]);
    const changeRecoveryScope = scope => { setRecoveryScope(scope); setSelectedRecovery([]); };
    const toggleGroup = (rows, kind) => {
        const keys = rows.map((item, index) => recoveryKey(item, kind, index));
        const allSelected = keys.length > 0 && keys.every(key => selectedRecovery.includes(key));
        setSelectedRecovery(current => allSelected ? current.filter(key => !keys.includes(key)) : [...new Set([...current, ...keys])]);
    };
    const salesChange = rows => rows.reduce((total, item) => total + Number(item.current_sales || 0) - Number(item.last_month_sales || 0), 0);
    const recoveryAmount = rows => rows.reduce((total, item) => total + recoveryTarget(item), 0);
    const impactAmount = rows => rows.reduce((total, item) => total + Number(item.sales_impact ?? (Number(item.current_sales || 0) - Number(item.last_month_sales || 0))), 0);

    return <main className="sia-page">
        <section className="sia-hero"><div className="sia-hero__icon"><AnalyticsRoundedIcon/></div><div><span>Sales intelligence</span><h1>Sales Impact Analysis</h1><p>See monthly performance and identify the products and customers driving the change.</p></div></section>

        <section className="sia-filter"><div><strong>Analysis filters</strong><span>Compare a month with last month and the previous three-month average.</span></div><div className="sia-filter__grid">
            <TextField size="small" type="month" name="month" value={filters.month} onChange={update} label="Report month" InputLabelProps={{ shrink: true }}/>
            <FormControl size="small"><InputLabel>Category</InputLabel><Select name="category_id" value={filters.category_id} label="Category" onChange={update}><MenuItem value="">All categories</MenuItem>{categories.map(item => <MenuItem key={item.id} value={item.id}>{item.category_name}</MenuItem>)}</Select></FormControl>
            <FormControl size="small"><InputLabel>Supplier</InputLabel><Select name="supplier_id" value={filters.supplier_id} label="Supplier" onChange={update}><MenuItem value="">All suppliers</MenuItem>{suppliers.map(item => <MenuItem key={item.id} value={item.id}>{item.supplier_name}</MenuItem>)}</Select></FormControl>
            <ImpactGroupSelect name="product_impact_group" label="Product group" value={filters.product_impact_group} onChange={update} options={entityImpactOptions('product')}/>
            <ImpactGroupSelect name="customer_impact_group" label="Customer group" value={filters.customer_impact_group} onChange={update} options={entityImpactOptions('customer')}/>
            <FormControl size="small"><InputLabel>Rows shown</InputLabel><Select name="display_limit" value={filters.display_limit} label="Rows shown" onChange={update}>{[5, 10, 20, 50].map(value => <MenuItem key={value} value={value}>Top {value} + Others</MenuItem>)}</Select></FormControl>
            <Button variant="contained" disabled={loading} onClick={() => load()}>Run analysis</Button>
        </div>{loading && <LinearProgress/>}</section>
        {error && <Alert severity="error" className="sia-alert">{error}</Alert>}

        {report && <>
            <section className="sia-metrics">
                <ComparisonCard label={`${reportLabel} current sales`} value={summary.current?.total_sales} variant="current" recoveryAmount={selectedRecoveryAmount}/>
                <ComparisonCard label="Compared with last month" value={summary.last_month?.total_sales} comparison={summary.vs_last_month} caption="difference"/>
                <ComparisonCard label="Previous 3-month average" value={summary.previous_three_month_average?.total_sales} comparison={summary.vs_previous_three_month_average} caption="difference"/>
                {projection && <article className="sia-metric sia-metric--projection"><em className="sia-metric__badge">Forecast</em><span>Projected month-end sales</span><strong>{money(projection.projectedSales)}</strong><div><b>{money(projection.dailyAverage)}/day</b><small>Based on {projection.elapsedDays} of {projection.daysInMonth} days</small></div></article>}
            </section>
            <div className="sia-impact-summary-title"><strong>Product impact</strong><span>Selected month compared with last month</span></div>
            <section className="sia-impact-cards">
                <article className="sia-impact-card sia-impact-card--winning"><TrendingUpRoundedIcon/><div><span>Winning products</span><strong>{winningProducts.length}</strong><b>{money(salesChange(winningProducts))}</b><small>sales change vs last month</small></div></article>
                <article className="sia-impact-card sia-impact-card--declining"><TrendingDownRoundedIcon/><div><span>Declining products</span><strong>{decliningProducts.length}</strong><b>-{money(recoveryAmount(decliningProducts))}</b><small>sales gap to match last month</small></div>{recoveryScope === 'product' && <label><Checkbox size="small" onChange={() => toggleGroup(decliningProducts, 'product')}/> Select all</label>}</article>
                <article className="sia-impact-card sia-impact-card--missing"><Inventory2RoundedIcon/><div><span>Missing products</span><strong>{missingProducts.length}</strong><b>-{money(recoveryAmount(missingProducts))}</b><small>expected lost sales vs last month</small></div>{recoveryScope === 'product' && <label><Checkbox size="small" onChange={() => toggleGroup(missingProducts, 'product')}/> Select all</label>}</article>
            </section>
            <div className="sia-impact-summary-title"><strong>Customer impact</strong><span>Selected month compared with last month</span></div>
            <section className="sia-impact-cards">
                <article className="sia-impact-card sia-impact-card--winning"><TrendingUpRoundedIcon/><div><span>Winning customers</span><strong>{winningCustomers.length}</strong><b>{money(salesChange(winningCustomers))}</b><small>sales change vs last month</small></div></article>
                <article className="sia-impact-card sia-impact-card--declining"><TrendingDownRoundedIcon/><div><span>Declining customers</span><strong>{decliningCustomers.length}</strong><b>-{money(recoveryAmount(decliningCustomers))}</b><small>sales gap to match last month</small></div>{recoveryScope === 'customer' && <label><Checkbox size="small" onChange={() => toggleGroup(decliningCustomers, 'customer')}/> Select all</label>}</article>
                <article className="sia-impact-card sia-impact-card--missing"><GroupsRoundedIcon/><div><span>Missing customers</span><strong>{missingCustomers.length}</strong><b>-{money(recoveryAmount(missingCustomers))}</b><small>expected lost sales vs last month</small></div>{recoveryScope === 'customer' && <label><Checkbox size="small" onChange={() => toggleGroup(missingCustomers, 'customer')}/> Select all</label>}</article>
            </section>
            <section className="sia-recovery-plan"><div><span>Recovery basis — choose one</span><div className="sia-recovery-scope"><button type="button" className={recoveryScope === 'product' ? 'active' : ''} onClick={() => changeRecoveryScope('product')}>Products</button><button type="button" className={recoveryScope === 'customer' ? 'active' : ''} onClick={() => changeRecoveryScope('customer')}>Customers</button></div><strong>{selectedRecovery.length ? `${selectedRecovery.length} ${recoveryScope}${selectedRecovery.length === 1 ? '' : 's'} selected` : `Select declining or missing ${recoveryScope}s`}</strong></div><div><span>Potential recovered sales</span><strong>+{money(selectedRecoveryAmount)}</strong></div><div><span>Projected selected-month sales</span><strong>{money(Number(summary.current?.total_sales || 0) + selectedRecoveryAmount)}</strong></div></section>

            <section className={`sia-explanation sia-explanation--${String(summary.trend || 'unchanged').toLowerCase()}`}><div className="sia-explanation__icon">{summary.trend === 'LOWER' ? <TrendingDownRoundedIcon/> : <TrendingUpRoundedIcon/>}</div><div><span>Why sales changed</span><h2>{explanation.headline}</h2><p>{explanation.missing_customer_count || 0} customers stopped ordering and {explanation.declining_customer_count || 0} reduced their orders. {explanation.missing_product_count || 0} products had no sales and {explanation.declining_product_count || 0} declined.</p></div><div className="sia-net"><span>Product net impact<strong className={tone(explanation.product_net_impact)}>{money(explanation.product_net_impact)}</strong></span><span>Customer net impact<strong className={tone(explanation.customer_net_impact)}>{money(explanation.customer_net_impact)}</strong></span></div></section>

            <div className="sia-section-label sia-section-label--up"><TrendingUpRoundedIcon/><div><h2>What lifted sales</h2><p>Products and customers contributing positive sales impact.</p></div></div>
            <div className="sia-grid"><DriverTable title="Growing products" subtitle={`${money(impactAmount(winningProducts))} product impact`} icon={<Inventory2RoundedIcon/>} rows={winningProducts} kind="product" limit={Number(filters.display_limit)} emptyText="No growing products found."/><DriverTable title="Growing customers" subtitle={`${money(impactAmount(winningCustomers))} customer impact`} icon={<GroupsRoundedIcon/>} rows={winningCustomers} kind="customer" limit={Number(filters.display_limit)} emptyText="No growing customers found."/></div>

            <div className="sia-section-label sia-section-label--new"><AnalyticsRoundedIcon/><div><h2>New this month</h2><p>Products and customers created during the selected report month.</p></div></div>
            <div className="sia-grid sia-grid--paired"><DriverTable title="New products" subtitle={`${money(impactAmount(newProducts))} product impact`} icon={<Inventory2RoundedIcon/>} rows={newProducts} kind="product" limit={Number(filters.display_limit)} emptyText="No new products found."/><DriverTable title="New customers" subtitle={`${money(impactAmount(newCustomers))} customer impact`} icon={<GroupsRoundedIcon/>} rows={newCustomers} kind="customer" limit={Number(filters.display_limit)} emptyText="No new customers found."/></div>

            <div className="sia-section-label sia-section-label--declining"><TrendingDownRoundedIcon/><div><h2>Declining</h2><p>Sales remain active but are below the comparison benchmark.</p></div></div>
            <div className="sia-grid sia-grid--paired"><DriverTable title="Declining products" subtitle={`${money(impactAmount(decliningProducts))} product impact`} icon={<Inventory2RoundedIcon/>} rows={decliningProducts} kind="product" limit={Number(filters.display_limit)} emptyText="No declining products found." selected={selectedRecovery} onToggle={recoveryScope === 'product' ? toggleRecovery : null}/><DriverTable title="Declining customers" subtitle={`${money(impactAmount(decliningCustomers))} customer impact`} icon={<GroupsRoundedIcon/>} rows={decliningCustomers} kind="customer" limit={Number(filters.display_limit)} emptyText="No declining customers found." selected={selectedRecovery} onToggle={recoveryScope === 'customer' ? toggleRecovery : null}/></div>

            <div className="sia-section-label sia-section-label--missing"><TrendingDownRoundedIcon/><div><h2>Missing</h2><p>Previously active products and customers with no sales in the selected month.</p></div></div>
            <div className="sia-grid sia-grid--paired"><DriverTable title="Missing products" subtitle={`${money(impactAmount(missingProducts))} product impact`} icon={<Inventory2RoundedIcon/>} rows={missingProducts} kind="product" limit={Number(filters.display_limit)} emptyText="No missing products found." selected={selectedRecovery} onToggle={recoveryScope === 'product' ? toggleRecovery : null}/><DriverTable title="Missing customers" subtitle={`${money(impactAmount(missingCustomers))} customer impact`} icon={<GroupsRoundedIcon/>} rows={missingCustomers} kind="customer" limit={Number(filters.display_limit)} emptyText="No missing customers found." selected={selectedRecovery} onToggle={recoveryScope === 'customer' ? toggleRecovery : null}/></div>

        </>}
    </main>;
};

export default SalesImpactAnalysis;
