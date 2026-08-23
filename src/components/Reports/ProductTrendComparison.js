import React, { useEffect, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useNavigate } from 'react-router-dom';
import ShopOrderTransactionService from '../ShopOrderTransaction/ShopOrderTransactionService';
import SupplierService from '../Supplier/SupplierService.service';
import CategoryService from '../Category/CategoryService.service';
import './ProductReport.css';

const money = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(value || 0));
const number = value => Number(value || 0).toLocaleString();
const currentMonth = () => new Date().toISOString().slice(0, 7);
const pick = (item, keys, fallback = 0) => keys.find(key => item?.[key] !== undefined) ? item[keys.find(key => item?.[key] !== undefined)] : fallback;
const salesKeys = {
    current: ['current_sales', 'current_month_sales', 'selected_month_sales', 'current_sales_amount', 'selected_sales', 'total_current_sales'],
    previous: ['previous_sales', 'previous_month_sales', 'last_month_sales', 'previous_sales_amount', 'last_sales', 'total_previous_sales']
};
const finite = value => value !== null && value !== '' && Number.isFinite(Number(value));
const comparisonSales = item => {
    const change = Number(pick(item, ['sales_change', 'sales_amount_change', 'amount_change'], 0));
    const percent = Number(pick(item, ['sales_change_percentage', 'percentage_change', 'sales_change_percent'], 0));
    let current = pick(item, salesKeys.current, NaN);
    let previous = pick(item, salesKeys.previous, NaN);
    if (!finite(previous) && percent && finite(change)) previous = change / (percent / 100);
    if (!finite(current) && finite(previous) && finite(change)) current = Number(previous) + change;
    return { current: finite(current) ? Number(current) : 0, previous: finite(previous) ? Number(previous) : 0, change, percent };
};
const historySales = entry => {
    if (finite(entry)) return Number(entry);
    const direct = pick(entry, ['sales', 'total_sales', 'sales_amount', 'total_price', 'amount', 'revenue', 'value'], NaN);
    if (finite(direct)) return Number(direct);
    const dynamicKey = Object.keys(entry || {}).find(key => /sales|amount|price|revenue/i.test(key) && !/change|percent|profit/i.test(key) && finite(entry[key]));
    return dynamicKey ? Number(entry[dynamicKey]) : 0;
};
const meaningfulNumber = (source, keys, fallback = 0) => {
    const values = keys.map(key => source?.[key]).filter(value => value !== undefined && value !== null && value !== '' && finite(value));
    const populated = values.find(value => Number(value) !== 0);
    return Number(populated ?? values[0] ?? fallback) || 0;
};
const soldQuantity = source => {
    const known = meaningfulNumber(source, ['total_quantity', 'current_total_quantity', 'selected_month_quantity', 'current_month_quantity', 'current_quantity', 'total_pieces', 'pieces_sold', 'quantity_sold'], NaN);
    if (finite(known) && known !== 0) return known;
    const dynamicKey = Object.keys(source || {}).find(key => /(total|current|selected).*(quantity|pieces)|(quantity|pieces).*sold/i.test(key) && !/average|previous|last|pack|product/i.test(key) && Number(source[key]) !== 0 && finite(source[key]));
    return dynamicKey ? Number(source[dynamicKey]) : 0;
};
const soldQuantityLabel = (totalPieces, packSize, packaging) => {
    const total = Number(totalPieces || 0);
    const size = Math.max(1, Number(packSize || 1));
    if (total < size) return `${number(total)} Pc`;
    const packageEquivalent = total / size;
    return `${number(packageEquivalent)} ${packaging}`;
};
const soldQuantityTitle = (totalPieces, packSize, packaging) => {
    const total = Number(totalPieces || 0);
    const size = Math.max(1, Number(packSize || 1));
    const packages = Math.floor(total / size);
    const remainder = total % size;
    const breakdown = packages > 0
        ? `${number(packages)} ${packaging}${remainder ? ` + ${number(remainder)} Pc` : ''}`
        : `${number(total)} Pc`;
    return `${number(total)} pieces total · ${number(size)} pieces per ${String(packaging).toLowerCase()} · ${breakdown}`;
};
const shiftMonth = (month, offset) => {
    const [year, monthNumber] = String(month).split('-').map(Number);
    const date = new Date(year, monthNumber - 1 + offset, 1);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
};
const projectedOutput = (month, boxes, pieces, packSize = 1, sales = 0) => {
    const [year, monthNumber] = String(month).split('-').map(Number);
    if (!year || !monthNumber) return null;
    const now = new Date();
    const daysInMonth = new Date(year, monthNumber, 0).getDate();
    const selected = `${year}-${String(monthNumber).padStart(2, '0')}`;
    const todayMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    if (selected > todayMonth) return null;
    const elapsedDays = selected === todayMonth ? Math.min(now.getDate(), daysInMonth) : daysInMonth;
    const runRate = daysInMonth / elapsedDays;
    const projectedTotalPieces = Math.round(((boxes * packSize) + pieces) * runRate);
    return { boxes: Math.floor(projectedTotalPieces / packSize), pieces: projectedTotalPieces, sales: Number(sales || 0) * runRate, projected: selected === todayMonth };
};
const trendDetails = (item, history, month) => {
    const packSize = Math.max(1, meaningfulNumber(item, ['quantity', 'product_quantity', 'pieces_per_box', 'pack_quantity', 'pieces_per_pack', 'conversion_quantity'], 1));
    const entryTotal = entry => soldQuantity(entry);
    const currentTotal = soldQuantity(item) || entryTotal(history?.[0]);
    const previousTotal = meaningfulNumber(item, ['previous_total_quantity', 'previous_month_quantity', 'previous_quantity', 'last_month_quantity'], entryTotal(history?.[1]));
    const averageTotal = meaningfulNumber(item, ['average_total_quantity', 'three_month_average_quantity'], history.length ? history.reduce((sum, entry) => sum + entryTotal(entry), 0) / history.length : 0);
    const currentBoxes = Math.floor(currentTotal / packSize);
    const currentPieces = Math.round(currentTotal % packSize);
    const averageBoxes = Math.floor(averageTotal / packSize);
    const averagePieces = Math.round(averageTotal % packSize);
    const compare = [currentTotal, previousTotal];
    const averageCompare = [currentTotal, averageTotal];
    const percentage = ([current, basis]) => basis > 0 ? ((current - basis) / basis) * 100 : current > 0 ? 100 : 0;
    const vsPrevious = percentage(compare);
    const vsAverage = percentage(averageCompare);
    const projection = projectedOutput(month, currentBoxes, currentPieces, packSize, comparisonSales(item).current);
    const target = averageTotal;
    const projectedValue = projection?.pieces || 0;
    const attainment = target > 0 && projection ? projectedValue / target * 100 : 0;
    const assessment = attainment >= 100 ? 'On track' : attainment >= 80 ? 'At risk' : 'Unlikely';
    return { currentBoxes, currentPieces, currentTotal, previousTotal, averageTotal, vsPrevious, vsAverage, projection, attainment, assessment };
};

const ProductTrendComparison = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({ month: currentMonth(), limit: 10, sort: 'current_sales', direction: 'desc', type: 'ALL', category_id: '', supplier_id: '' });
    const [report, setReport] = useState({ data: [] });
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');

    const load = (request = filters) => {
        if (!request.month) return setError('Please choose a month.');
        setLoading(true);
        setError('');
        ShopOrderTransactionService.fetchMonthlyProductSalesComparison({
            ...request,
            limit: Number(request.limit),
            category_id: request.category_id || null,
            supplier_id: request.supplier_id || null
        }).then(response => setReport(response.data?.data && !Array.isArray(response.data.data) ? response.data.data : response.data || { data: [] }))
          .catch(err => setError(err.response?.data?.message || 'Unable to load the product comparison.'))
          .finally(() => setLoading(false));
    };

    useEffect(() => {
        load(filters);
        SupplierService.getAll().then(response => setSuppliers(response.data?.data || response.data || [])).catch(() => {});
        CategoryService.getAll().then(response => setCategories(response.data?.data || response.data || [])).catch(() => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const update = event => setFilters(current => ({ ...current, [event.target.name]: event.target.value }));
    const rows = Array.isArray(report.data) ? report.data : Array.isArray(report.products) ? report.products : [];
    const filtered = useMemo(() => {
        const search = query.trim().toLowerCase();
        return search ? rows.filter(item => String(pick(item, ['product_name', 'name', 'product'], '')).toLowerCase().includes(search)) : rows;
    }, [rows, query]);
    const totals = report.summary || report.totals || {};
    const currentSales = pick(totals, salesKeys.current, rows.reduce((sum, item) => sum + comparisonSales(item).current, 0));
    const previousSales = pick(totals, salesKeys.previous, rows.reduce((sum, item) => sum + comparisonSales(item).previous, 0));
    const decliningCount = Array.isArray(report.declining_products) ? report.declining_products.length : rows.filter(item => Number(pick(item, ['sales_change', 'sales_amount_change'])) < 0).length;
    const monthLabels = report.months || report.periods || [];

    return <main className="pr-page pt-page">
        <section className="pr-hero"><div className="pr-hero__icon"><CompareArrowsRoundedIcon /></div><div><span>Month-over-month intelligence</span><h1>Product Trend Comparison</h1><p>Compare every product with last month and review its three-month sales direction.</p></div></section>
        <section className="pr-summary"><div><TrendingUpRoundedIcon/><div><span>Selected month sales</span><strong>{money(currentSales)}</strong></div></div><div><CompareArrowsRoundedIcon/><div><span>Previous month sales</span><strong>{money(previousSales)}</strong></div></div><div><TrendingDownRoundedIcon/><div><span>Declining products</span><strong>{number(decliningCount)}</strong></div></div></section>
        <section className="pr-filter"><div className="pr-filter__header"><strong>Comparison filters</strong><span>Select a month; the report automatically compares it with the prior month and a three-month window.</span></div><div className="pr-filter__grid pt-filter__grid">
            <TextField fullWidth size="small" type="month" name="month" value={filters.month} onChange={update} label="Report month" InputLabelProps={{ shrink: true }}/>
            <FormControl fullWidth size="small"><InputLabel>Show</InputLabel><Select name="limit" value={filters.limit} label="Show" onChange={update}>{[10, 50, 100, 250, 500, 1000, 5000].map(value => <MenuItem key={value} value={value}>Top {value}</MenuItem>)}</Select></FormControl>
            <FormControl fullWidth size="small"><InputLabel>Sort by</InputLabel><Select name="sort" value={filters.sort} label="Sort by" onChange={update}><MenuItem value="current_sales">Current sales</MenuItem><MenuItem value="current_quantity">Current quantity</MenuItem><MenuItem value="biggest_drop">Biggest sales drop</MenuItem><MenuItem value="rank_drop">Biggest rank drop</MenuItem></Select></FormControl>
            <FormControl fullWidth size="small"><InputLabel>Direction</InputLabel><Select name="direction" value={filters.direction} label="Direction" onChange={update}><MenuItem value="desc">Highest first</MenuItem><MenuItem value="asc">Lowest first</MenuItem></Select></FormControl>
            <FormControl fullWidth size="small"><InputLabel>Type</InputLabel><Select name="type" value={filters.type} label="Type" onChange={update}><MenuItem value="ALL">All</MenuItem><MenuItem value="WHOLESALE">Wholesale</MenuItem><MenuItem value="RETAIL">Retail</MenuItem></Select></FormControl>
            <FormControl fullWidth size="small"><InputLabel>Category</InputLabel><Select name="category_id" value={filters.category_id} label="Category" onChange={update}><MenuItem value="">All categories</MenuItem>{categories.map(item => <MenuItem key={item.id} value={item.id}>{item.category_name}</MenuItem>)}</Select></FormControl>
            <FormControl fullWidth size="small"><InputLabel>Supplier</InputLabel><Select name="supplier_id" value={filters.supplier_id} label="Supplier" onChange={update}><MenuItem value="">All suppliers</MenuItem>{suppliers.map(item => <MenuItem key={item.id} value={item.id}>{item.supplier_name}</MenuItem>)}</Select></FormControl>
            <Button variant="contained" onClick={() => load()} disabled={loading}>Compare products</Button>
        </div>{loading && <LinearProgress className="pr-progress"/>}</section>
        {error && <Alert severity="error" className="pt-alert">{error}</Alert>}
        <section className="pr-card"><header><div><h2>Monthly product movement</h2><p>{filtered.length} products · {monthLabels.length ? monthLabels.join(' vs ') : 'three-month comparison'}</p></div><TextField className="pr-search" size="small" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search product..." InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon/></InputAdornment> }}/></header><div className="table-responsive"><table className="pr-table pt-table"><thead><tr><th>Rank movement<span className="pt-th-hint">Current vs previous</span></th><th>Product</th><th>Current month<span className="pt-th-hint">Sales and quantity</span></th><th>Previous months<span className="pt-th-hint">Sales and quantity</span></th><th>Current stock</th><th>Status / Quantity Trend<span className="pt-th-hint">Packages vs previous month</span></th><th className="pt-graph-heading" title="View graph"><BarChartRoundedIcon fontSize="small"/></th></tr></thead><tbody>
            {filtered.map((item, index) => {
                const name = pick(item, ['product_name', 'name', 'product'], 'Unnamed product');
                const currentRank = pick(item, ['current_rank', 'rank'], index + 1);
                const previousRank = pick(item, ['previous_rank', 'last_month_rank'], '—');
                const rankChange = Number(pick(item, ['rank_change'], Number(previousRank) - Number(currentRank)));
                const history = pick(item, ['three_month_comparison', 'three_month_sales', 'monthly_sales'], []);
                const historyRows = Array.isArray(history) ? history : [];
                const trend = trendDetails(item, historyRows, filters.month);
                const currentHistory = historyRows.find(entry => entry.month === filters.month) || historyRows[0];
                const previousHistory = historyRows.filter(entry => entry !== currentHistory);
                const currentMonthSales = currentHistory ? historySales(currentHistory) : comparisonSales(item).current;
                const currentMonthQuantity = currentHistory ? soldQuantity(currentHistory) : trend.currentTotal;
                const currentStock = Number(pick(item, ['current_stock'], 0) || 0);
                const currentStockPieces = Number(pick(item, ['current_stock_pc'], 0) || 0);
                const packaging = pick(item, ['packaging'], 'Box') || 'Box';
                const piecesPerPackage = Number(pick(item, ['quantity'], 1) || 1);
                const stockLabel = currentStockPieces >= piecesPerPackage
                    ? `${number(currentStock)} ${packaging}`
                    : `${number(currentStockPieces)} Pc`;
                const projectedLabel = soldQuantityLabel(trend.projection?.pieces, piecesPerPackage, packaging);
                const impactParams = new URLSearchParams({ month: filters.month, limit: '10', type: filters.type, ...(filters.category_id && { category_id: filters.category_id }), ...(filters.supplier_id && { supplier_id: filters.supplier_id }) });
                const verdict = value => value > 0 ? 'High sales' : value < 0 ? 'Low sales' : 'Unchanged';
                return <tr key={item.product_id || item.mark_up_product_id || item.id || index}><td><div className="pt-rank-move"><span className="pr-rank">{currentRank}</span><div><small>was #{previousRank}</small><strong className={rankChange < 0 ? 'pr-negative' : 'pt-positive'}>{rankChange > 0 ? '▲ ' : rankChange < 0 ? '▼ ' : ''}{Math.abs(rankChange) || '—'}</strong></div></div></td><td><div className="pr-product"><strong>{name}</strong><i className={`pt-product-verdict ${rankChange > 0 ? 'pt-product-verdict--up' : rankChange < 0 ? 'pt-product-verdict--down' : 'pt-product-verdict--same'}`} title={rankChange > 0 ? `Rank improved by ${rankChange}` : rankChange < 0 ? `Rank dropped by ${Math.abs(rankChange)}` : 'Rank unchanged'} aria-label={rankChange > 0 ? `Rank improved by ${rankChange}` : rankChange < 0 ? `Rank dropped by ${Math.abs(rankChange)}` : 'Rank unchanged'}/><span>#{item.product_id || item.id || '—'} · {piecesPerPackage} Pc/{packaging}</span></div></td><td><div className={`pt-current-month ${trend.vsPrevious > 0 ? 'pt-current-month--up' : trend.vsPrevious < 0 ? 'pt-current-month--down' : 'pt-current-month--same'}`}><small>{currentHistory?.month || filters.month}</small><strong>{money(currentMonthSales)}</strong><em title={soldQuantityTitle(currentMonthQuantity, piecesPerPackage, packaging)}>{soldQuantityLabel(currentMonthQuantity, piecesPerPackage, packaging)}</em></div></td><td><div className="pt-history">{previousHistory.map((entry, i) => { const entryQuantity = soldQuantity(entry); return <span key={entry.month || i}><small>{entry.month || entry.label || `M${i + 1}`}</small><strong>{money(historySales(entry))}</strong><em title={soldQuantityTitle(entryQuantity, piecesPerPackage, packaging)}>{soldQuantityLabel(entryQuantity, piecesPerPackage, packaging)}</em></span>; })}</div></td><td><strong className="pt-total-label">{stockLabel}</strong></td><td><div className="pt-trend"><div><small>Vs last month ({shiftMonth(filters.month, -1)})</small><b className={trend.vsPrevious < 0 ? 'down' : 'up'}>{verdict(trend.vsPrevious)}</b><strong className={trend.vsPrevious < 0 ? 'down' : 'up'}>{trend.vsPrevious >= 0 ? '+' : ''}{trend.vsPrevious.toFixed(1)}%</strong></div><div><small>3-month average</small><b className={trend.vsAverage < 0 ? 'down' : 'up'}>{verdict(trend.vsAverage)}</b><strong className={trend.vsAverage < 0 ? 'down' : 'up'}>{trend.vsAverage >= 0 ? '+' : ''}{trend.vsAverage.toFixed(1)}%</strong></div>{trend.projection && <div><small>{trend.projection.projected ? 'Projected month-end output' : 'Final output'}</small><strong className="projection" title={soldQuantityTitle(trend.projection.pieces, piecesPerPackage, packaging)}>{projectedLabel}</strong><strong className="pt-projected-sales">{money(trend.projection.sales)}</strong>{trend.projection.projected && <em>Based on current daily sales</em>}<b className={`assessment assessment--${trend.assessment.toLowerCase().replace(' ', '-')}`}>{trend.assessment}</b><strong className={trend.attainment < 80 ? 'down' : 'up'}>{trend.attainment.toFixed(1)}% of 3-month average</strong></div>}</div></td><td className="pt-graph-cell"><IconButton color="primary" size="small" title={`View comparison graph for ${name}`} onClick={() => navigate(`/productMonthlySalesHistory/product/${item.product_id || item.id}?month=${filters.month}&source=trend`)}><BarChartRoundedIcon fontSize="small"/></IconButton><IconButton color="secondary" size="small" title={`View customer impact for ${name}`} onClick={() => navigate(`/reports/productTrendComparison/product/${item.product_id || item.id}/customer-impact?${impactParams}`)}><VisibilityRoundedIcon fontSize="small"/></IconButton></td></tr>;
            })}
            {!filtered.length && !loading && <tr><td colSpan="7"><div className="pr-empty"><Inventory2OutlinedIcon/><strong>No comparison data found</strong><span>Try another month or change the filters.</span></div></td></tr>}
        </tbody></table></div></section>
    </main>;
};

export default ProductTrendComparison;
