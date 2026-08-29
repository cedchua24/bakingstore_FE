import React, { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import FiberNewRoundedIcon from '@mui/icons-material/FiberNewRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import ExpensesTypeService from '../ExpensesV2/ExpensesTypeV2Service';
import ExpenseTransactionService from '../ExpensesV2/ExpenseTransactionService';
import './MonthlyExpenseComparison.css';
import './MonthlyExpenseComparisonMonth.css';
import './MonthlyExpenseComparisonGrouping.css';
import './MonthlyExpenseCategoryComparison.css';
import './MonthlyExpenseComparisonTree.css';
import './MonthlyExpenseAdminPrivacy.css';

const money = (value) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 }).format(Number(value || 0));
const number = (value) => Number(value || 0);
const pick = (source, keys, fallback = 0) => {
    for (const key of keys) if (source?.[key] !== undefined && source?.[key] !== null) return source[key];
    return fallback;
};
const selectedIds = (value) => (typeof value === 'string' ? value.split(',') : value).map(Number).filter((id) => id > 0);
const currentMonth = () => new Date().toLocaleDateString('en-CA').slice(0, 7);

const categoryMeta = {
    UNUSUAL: { label: 'Unusual', icon: <AutoAwesomeRoundedIcon />, className: 'unusual' },
    INCREASED: { label: 'Increased', icon: <TrendingUpRoundedIcon />, className: 'increased' },
    DECREASED: { label: 'Decreased', icon: <TrendingDownRoundedIcon />, className: 'decreased' },
    NEW: { label: 'New expense', icon: <FiberNewRoundedIcon />, className: 'new' },
};

const expenseTypePalettes = [
    { main: '#68408f', category: '#eee7f5', expense: '#f7f3fa', border: '#d7c8e5', text: '#50336b' },
    { main: '#176b70', category: '#e2f1f0', expense: '#f1f8f7', border: '#bfdeda', text: '#16575b' },
    { main: '#a45b18', category: '#f8eadb', expense: '#fcf5ed', border: '#edd0ae', text: '#7d4615' },
    { main: '#315f9a', category: '#e5edf8', expense: '#f2f6fb', border: '#c5d5eb', text: '#294f7e' },
    { main: '#9a3f5f', category: '#f6e5eb', expense: '#fbf2f5', border: '#e8c5d1', text: '#783249' },
    { main: '#4e6c35', category: '#eaf1e4', expense: '#f5f8f2', border: '#cdddbf', text: '#405a2c' },
];

const MonthlyExpenseComparison = ({ movementOnly = false }) => {
    const isAdmin = Number(localStorage.getItem('role_as')) === 2;
    const [showHiddenExpenses, setShowHiddenExpenses] = useState(false);
    const [filters, setFilters] = useState({ month: currentMonth(), expense_type_ids: [], expense_category_ids: [], expense_ids: [], chart_of_account_ids: [], approval_statuses: ['APPROVED'], is_received: [] });
    const [types, setTypes] = useState([]);
    const [report, setReport] = useState({ summary: {}, data: [] });
    const [activeGroup, setActiveGroup] = useState('ALL');
    const [expandedTypes, setExpandedTypes] = useState({});
    const [expandedCategories, setExpandedCategories] = useState({});
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const shouldMaskHiddenExpenses = !showHiddenExpenses;

    const loadReport = (payload = filters) => {
        setLoading(true);
        setError('');
        return ExpenseTransactionService.getMonthlyExpenseComparisonV2(payload)
            .then((response) => setReport(response.data || { summary: {}, data: [] }))
            .catch(() => setError('The monthly expense comparison could not be loaded. Please try again.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        Promise.all([ExpensesTypeService.getAll(), ExpenseTransactionService.getMonthlyExpenseComparisonV2(filters)])
            .then(([typeResponse, reportResponse]) => {
                const loadedTypes = Array.isArray(typeResponse.data) ? typeResponse.data : [];
                const loadedReport = reportResponse.data || { summary: {}, data: [] };
                setTypes(loadedTypes);
                setReport(loadedReport);
                if (movementOnly) {
                    const defaultRows = [
                        ...(Array.isArray(loadedReport.increased_expenses) ? loadedReport.increased_expenses : []),
                        ...(Array.isArray(loadedReport.new_expenses) ? loadedReport.new_expenses : []),
                    ];
                    const defaultTypeIds = Array.from(new Set(defaultRows.map((item) => {
                        const directId = Number(item.expense_type_id);
                        if (directId > 0) return directId;
                        const matchingType = loadedTypes.find((type) => String(type.expense_type || '').trim().toLowerCase() === String(item.expense_type || '').trim().toLowerCase());
                        return Number(matchingType?.id || 0);
                    }).filter((id) => id > 0)));
                    if (defaultTypeIds.length) setFilters((current) => ({ ...current, expense_type_ids: defaultTypeIds }));
                }
            })
            .catch(() => setError('The monthly expense comparison could not be loaded. Please try again.'))
            .finally(() => setLoading(false));
        // Initial report uses the default approved filter.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (movementOnly && filters.month >= currentMonth() && activeGroup === 'DECREASED') setActiveGroup('ALL');
    }, [activeGroup, filters.month, movementOnly]);

    const multiValue = (event) => typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
    const changeType = (event) => {
        const raw = multiValue(event);
        const ids = raw.includes('__all__') ? [] : selectedIds(raw);
        setFilters((current) => ({ ...current, expense_type_ids: ids, expense_category_ids: [], expense_ids: [] }));
    };
    const label = (selected, options, key, allLabel) => selected.length ? (options.filter((item) => selected.includes(Number(item.id))).map((item) => item[key]).slice(0, 2).join(', ') + (selected.length > 2 ? ` +${selected.length - 2}` : '')) : allLabel;

    const summary = report.summary || {};
    const groups = useMemo(() => ({
        UNUSUAL: Array.isArray(report.unusual_expenses) ? report.unusual_expenses : [],
        INCREASED: Array.isArray(report.increased_expenses) ? report.increased_expenses : [],
        DECREASED: Array.isArray(report.decreased_expenses) ? report.decreased_expenses : [],
        NEW: Array.isArray(report.new_expenses) ? report.new_expenses : [],
    }), [report]);
    const selectedMonthIsComplete = filters.month < currentMonth();
    const availableGroups = useMemo(() => movementOnly ? {
        INCREASED: groups.INCREASED,
        ...(selectedMonthIsComplete ? { DECREASED: groups.DECREASED } : {}),
        NEW: groups.NEW,
    } : groups, [groups, movementOnly, selectedMonthIsComplete]);
    const displayedCategoryMeta = useMemo(() => movementOnly ? Object.fromEntries(Object.entries(categoryMeta).filter(([key]) => key === 'NEW' || key === 'INCREASED' || key === 'DECREASED')) : categoryMeta, [movementOnly]);
    const allRows = useMemo(() => movementOnly
        ? Object.entries(availableGroups).flatMap(([classification, rows]) => rows.map((row) => ({ ...row, classification: row.classification || classification })))
        : Array.isArray(report.data) && report.data.length ? report.data : Object.entries(groups).flatMap(([classification, rows]) => rows.map((row) => ({ ...row, classification: row.classification || classification }))), [availableGroups, report.data, groups, movementOnly]);
    const scopedRows = useMemo(() => activeGroup === 'ALL' ? allRows : (availableGroups[activeGroup] || []), [activeGroup, allRows, availableGroups]);
    const visibleRows = useMemo(() => {
        const rows = scopedRows;
        const term = query.trim().toLowerCase();
        return term ? rows.filter((item) => [Number(item.is_hidden) === 1 && shouldMaskHiddenExpenses ? '***' : item.expense_name, Number(item.is_hidden) === 1 && shouldMaskHiddenExpenses ? '' : item.expense, item.expense_category_name, item.expense_type, item.classification, item.status].some((value) => String(value || '').toLowerCase().includes(term))) : rows;
    }, [query, scopedRows, shouldMaskHiddenExpenses]);
    const movementTotals = useMemo(() => scopedRows.reduce((totals, item) => {
        totals.current += number(pick(item, ['current_month_amount', 'current_amount', 'current_month_total']));
        totals.previous += number(pick(item, ['previous_month_amount', 'previous_amount', 'previous_month_total']));
        totals.average += number(pick(item, ['previous_three_month_average', 'three_month_average', 'average_amount']));
        return totals;
    }, { current: 0, previous: 0, average: 0 }), [scopedRows]);
    const groupedRows = useMemo(() => visibleRows.reduce((result, item) => {
        const typeName = item.expense_type || 'Other expenses';
        const categoryName = item.expense_category_name || 'Uncategorized';
        if (!result[typeName]) result[typeName] = { categories: {}, count: 0, total: 0, previousTotal: 0, averageTotal: 0 };
        if (!result[typeName].categories[categoryName]) result[typeName].categories[categoryName] = { items: [], total: 0, previousTotal: 0, averageTotal: 0 };
        const amount = number(pick(item, ['current_month_amount', 'current_amount', 'current_month_total']));
        const previousAmount = number(pick(item, ['previous_month_amount', 'previous_amount', 'previous_month_total']));
        const averageAmount = number(pick(item, ['previous_three_month_average', 'three_month_average', 'average_amount']));
        result[typeName].categories[categoryName].items.push(item);
        result[typeName].categories[categoryName].total += amount;
        result[typeName].categories[categoryName].previousTotal += previousAmount;
        result[typeName].categories[categoryName].averageTotal += averageAmount;
        result[typeName].count += 1;
        result[typeName].total += amount;
        result[typeName].previousTotal += previousAmount;
        result[typeName].averageTotal += averageAmount;
        return result;
    }, {}), [visibleRows]);

    const selectedMonthDate = new Date(`${filters.month || currentMonth()}-01T00:00:00`);
    const currentLabel = pick(report, ['current_month_label'], new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(selectedMonthDate));
    const previousDate = new Date(selectedMonthDate); previousDate.setMonth(previousDate.getMonth() - 1);
    const previousLabel = pick(report, ['previous_month_label'], new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(previousDate));
    const toggleExpanded = (setter, key) => setter((current) => ({ ...current, [key]: !current[key] }));

    return <main className={`mec-page ${movementOnly ? 'mec-movement-page' : ''}`}><div className="mec-shell">
        <header className="mec-hero"><div className="mec-hero-icon"><CompareArrowsRoundedIcon /></div><div><span>Financial intelligence</span><h1>{movementOnly ? 'Expense Movement Watch' : 'Monthly Expense Comparison'}</h1><p>{movementOnly ? `Focus on new and changing expenses for ${currentLabel}.` : `Compare ${currentLabel} against ${previousLabel} and the previous three-month average.`}</p></div></header>
        {error && <Alert severity="error" className="mec-alert">{error}</Alert>}
        <section className="mec-filters"><header><div><strong>Comparison filters</strong><span>Select the current comparison month. Previous periods are calculated automatically.</span></div></header><div className="mec-filter-grid">
            <TextField size="small" type="month" label="Comparison month" value={filters.month} onChange={(event) => setFilters((current) => ({ ...current, month: event.target.value }))} InputLabelProps={{ shrink: true }} />
            <FormControl size="small"><InputLabel>Expense type</InputLabel><Select multiple value={filters.expense_type_ids} label="Expense type" onChange={changeType} renderValue={(selected) => label(selected, types, 'expense_type', 'All expense types')}><MenuItem value="__all__"><Checkbox checked={!filters.expense_type_ids.length} /><ListItemText primary="All expense types" /></MenuItem>{types.map((item) => <MenuItem key={item.id} value={item.id}><Checkbox checked={filters.expense_type_ids.includes(Number(item.id))} /><ListItemText primary={item.expense_type} /></MenuItem>)}</Select></FormControl>
            {movementOnly && <FormControl size="small"><InputLabel>Movement</InputLabel><Select value={activeGroup} label="Movement" onChange={(event) => setActiveGroup(event.target.value)}><MenuItem value="ALL">New and increased</MenuItem><MenuItem value="NEW">New expense</MenuItem><MenuItem value="INCREASED">Increased</MenuItem><MenuItem value="DECREASED" disabled={!selectedMonthIsComplete}>Decreased {!selectedMonthIsComplete ? '(month incomplete)' : ''}</MenuItem></Select></FormControl>}
            <Button variant="contained" onClick={() => loadReport()} disabled={loading}>Run comparison</Button>
        </div>{loading && <LinearProgress />}</section>

        {movementOnly && !selectedMonthIsComplete && <Alert severity="info" className="mec-movement-note"><strong>Decreased expenses are not shown yet.</strong> The selected month is still in progress. Decreases will appear after the month is complete so partial-month spending is not treated as a decrease.</Alert>}

        <section className="mec-totals"><article><span>{currentLabel}</span><strong>{money(movementOnly ? movementTotals.current : pick(summary, ['current_month_total']))}</strong><small>{movementOnly && activeGroup !== 'ALL' ? categoryMeta[activeGroup]?.label : 'Current month'}</small></article><article><span>{previousLabel}</span><strong>{money(movementOnly ? movementTotals.previous : pick(summary, ['previous_month_total']))}</strong><small>{money(movementOnly ? movementTotals.current - movementTotals.previous : pick(summary, ['difference_from_previous_month']))} difference</small></article><article><span>Previous 3 months</span><strong>{money(movementOnly ? movementTotals.average : pick(summary, ['previous_three_month_average_total', 'three_month_average_total']))}</strong><small>{money(movementOnly ? movementTotals.current - movementTotals.average : pick(summary, ['difference_from_three_month_average']))} difference</small></article></section>
        <section className={`mec-signals ${movementOnly ? 'movement-only' : ''}`}>{Object.entries(displayedCategoryMeta).map(([key, meta]) => { const disabled = movementOnly && key === 'DECREASED' && !selectedMonthIsComplete; return <button key={key} type="button" disabled={disabled} className={`${meta.className} ${activeGroup === key ? 'active' : ''}`} onClick={() => setActiveGroup(activeGroup === key ? 'ALL' : key)}><i>{meta.icon}</i><span>{meta.label}</span><strong>{disabled ? '—' : number(pick(summary, [`${key.toLowerCase()}_expense_count`], groups[key].length))}</strong></button>; })}</section>

        <section className="mec-table-card"><header><div><span>{activeGroup === 'ALL' ? (movementOnly ? 'New and changing expenses' : 'All classifications') : categoryMeta[activeGroup].label}</span><h2>{movementOnly ? 'Expense movement details' : 'Expense comparison details'}</h2><p>Expand an expense type, then a category, to review its expenses.</p></div><div className="mec-table-actions"><FormControlLabel className="mec-hide-expenses" control={<Checkbox checked={showHiddenExpenses} disabled={!isAdmin} onChange={(event) => setShowHiddenExpenses(event.target.checked)} />} label="Confidential" /><TextField size="small" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search expenses..." InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }} /></div></header><div className="mec-table-scroll"><table><thead><tr><th>Expense hierarchy</th><th>Classification</th><th>{currentLabel}</th><th>{previousLabel}</th><th>Previous 3-month average</th><th>vs {previousLabel}</th><th>vs 3-month average</th></tr></thead><tbody>
            {Object.entries(groupedRows).map(([typeName, type], typeIndex) => {
                const palette = expenseTypePalettes[typeIndex % expenseTypePalettes.length];
                const groupStyle = { '--mec-main': palette.main, '--mec-category': palette.category, '--mec-expense': palette.expense, '--mec-border': palette.border, '--mec-text': palette.text };
                const typePreviousDifference = type.total - type.previousTotal;
                const typeAverageDifference = type.total - type.averageTotal;
                const typeOpen = Boolean(query.trim()) || Boolean(expandedTypes[typeName]);
                return <React.Fragment key={typeName}>
                    <tr className="mec-type-summary" style={groupStyle}>
                        <td><button type="button" onClick={() => toggleExpanded(setExpandedTypes, typeName)} aria-expanded={typeOpen}>{typeOpen ? <KeyboardArrowDownRoundedIcon /> : <KeyboardArrowRightRoundedIcon />}<span>Expense type</span><strong>{typeName}</strong><small>{type.count} {type.count === 1 ? 'expense' : 'expenses'}</small></button></td>
                        <td><span className="mec-badge type-total">Type total</span></td><td><b>{money(type.total)}</b></td><td>{money(type.previousTotal)}</td><td>{money(type.averageTotal)}</td><td className={typePreviousDifference >= 0 ? 'positive' : 'negative'}>{money(typePreviousDifference)}</td><td className={typeAverageDifference >= 0 ? 'positive' : 'negative'}>{money(typeAverageDifference)}</td>
                    </tr>
                    {typeOpen && Object.entries(type.categories).map(([categoryName, category], categoryIndex) => {
                        const previousDifference = category.total - category.previousTotal;
                        const averageDifference = category.total - category.averageTotal;
                        const previousPercent = category.previousTotal ? (previousDifference / category.previousTotal) * 100 : category.total ? 100 : 0;
                        const averagePercent = category.averageTotal ? (averageDifference / category.averageTotal) * 100 : category.total ? 100 : 0;
                        const categoryKey = `${typeName}::${categoryName}`;
                        const categoryOpen = Boolean(query.trim()) || Boolean(expandedCategories[categoryKey]);
                        return <React.Fragment key={`${typeName}-${categoryName}`}>
                            <tr className="mec-category-summary" style={groupStyle}>
                                <td><button type="button" onClick={() => toggleExpanded(setExpandedCategories, categoryKey)} aria-expanded={categoryOpen}><b>{String(categoryIndex + 1).padStart(2, '0')}</b>{categoryOpen ? <KeyboardArrowDownRoundedIcon /> : <KeyboardArrowRightRoundedIcon />}<span>Category</span><strong>{categoryName}</strong><small>{category.items.length} {category.items.length === 1 ? 'expense' : 'expenses'}</small></button></td>
                                <td><span className="mec-badge category-total">Category total</span></td><td><b>{money(category.total)}</b></td><td>{money(category.previousTotal)}</td><td>{money(category.averageTotal)}</td><td className={previousDifference >= 0 ? 'positive' : 'negative'}>{money(previousDifference)}<small>{previousPercent.toFixed(1)}%</small></td><td className={averageDifference >= 0 ? 'positive' : 'negative'}>{money(averageDifference)}<small>{averagePercent.toFixed(1)}%</small></td>
                            </tr>
                            {categoryOpen && category.items.map((item, index) => {
                                const classification = String(pick(item, ['classification', 'comparison_status', 'status'], 'UNCHANGED')).toUpperCase();
                                const meta = categoryMeta[classification];
                                const expenseName = Number(item.is_hidden) === 1 && shouldMaskHiddenExpenses ? '***' : pick(item, ['expense_name', 'expense'], 'Unnamed expense');
                                return <tr className="mec-expense-summary" style={groupStyle} key={item.expense_id || item.id || index}><td><div><i>↳</i><span>Expense</span><strong>{expenseName}</strong></div></td><td><span className={`mec-badge ${meta?.className || 'unchanged'}`}>{meta?.label || 'Unchanged'}</span></td><td><b>{money(pick(item, ['current_month_amount', 'current_amount', 'current_month_total']))}</b></td><td>{money(pick(item, ['previous_month_amount', 'previous_amount', 'previous_month_total']))}</td><td>{money(pick(item, ['previous_three_month_average', 'three_month_average', 'average_amount']))}</td><td className={number(pick(item, ['difference_from_previous_month', 'previous_month_difference'])) >= 0 ? 'positive' : 'negative'}>{money(pick(item, ['difference_from_previous_month', 'previous_month_difference']))}<small>{pick(item, ['percentage_change_from_previous_month', 'previous_month_percentage_change'], 0)}%</small></td><td className={number(pick(item, ['difference_from_three_month_average', 'three_month_average_difference'])) >= 0 ? 'positive' : 'negative'}>{money(pick(item, ['difference_from_three_month_average', 'three_month_average_difference']))}<small>{pick(item, ['percentage_change_from_three_month_average', 'three_month_average_percentage_change'], 0)}%</small></td></tr>;
                            })}
                        </React.Fragment>;
                    })}
                </React.Fragment>;
            })}
            {!loading && !visibleRows.length && <tr><td colSpan="7"><div className="mec-empty"><CompareArrowsRoundedIcon /><strong>No comparison results</strong><span>Try another filter selection.</span></div></td></tr>}
        </tbody></table></div></section>
    </div></main>;
};

export default MonthlyExpenseComparison;
