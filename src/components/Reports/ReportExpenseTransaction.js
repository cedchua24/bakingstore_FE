import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ExpensesTypeService from '../ExpensesV2/ExpensesTypeV2Service';
import ExpensesCategoryService from '../ExpensesV2/ExpensesCategoryV2Service';
import ExpensesService from '../ExpensesV2/ExpensesV2Service';
import ExpenseTransactionService from '../ExpensesV2/ExpenseTransactionService';
import './ReportExpenseTransaction.css';
import './ReportExpenseConfidential.css';

const money = (value) => new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
}).format(Number(value || 0));

const today = () => new Date().toLocaleDateString('en-CA');

const expenseTypePalettes = [
    { main: '#68408f', category: '#eee7f5', expense: '#f7f3fa', border: '#d7c8e5', text: '#50336b' },
    { main: '#176b70', category: '#e2f1f0', expense: '#f1f8f7', border: '#bfdeda', text: '#16575b' },
    { main: '#a45b18', category: '#f8eadb', expense: '#fcf5ed', border: '#edd0ae', text: '#7d4615' },
    { main: '#315f9a', category: '#e5edf8', expense: '#f2f6fb', border: '#c5d5eb', text: '#294f7e' },
    { main: '#9a3f5f', category: '#f6e5eb', expense: '#fbf2f5', border: '#e8c5d1', text: '#783249' },
    { main: '#4e6c35', category: '#eaf1e4', expense: '#f5f8f2', border: '#cdddbf', text: '#405a2c' },
];

const ReportExpenseTransaction = () => {
    const role = localStorage.getItem('role_as');
    const isAdmin = Number(role) === 2;
    const [showHiddenExpenses, setShowHiddenExpenses] = useState(false);
    const [filters, setFilters] = useState({
        expense_type_ids: [],
        expense_category_ids: [],
        expense_ids: [],
        chart_of_account_ids: [],
        approval_statuses: ['APPROVED'],
        is_received: [],
        dateFrom: today(),
        dateTo: today(),
    });
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');
    const shouldMaskHiddenExpenses = !showHiddenExpenses;

    const loadTransactions = (requestFilters = filters) => {
        setLoading(true);
        setError('');
        return ExpenseTransactionService.searchExpenseTransactionListV2(requestFilters)
            .then((response) => setTransactions(Array.isArray(response.data) ? response.data : []))
            .catch(() => setError('The expense transaction report could not be loaded. Please try again.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        Promise.all([
            ExpensesTypeService.getAll(),
            ExpenseTransactionService.searchExpenseTransactionListV2(filters),
        ])
            .then(([typeResponse, transactionResponse]) => {
                setExpenseTypes(Array.isArray(typeResponse.data) ? typeResponse.data : []);
                setTransactions(Array.isArray(transactionResponse.data) ? transactionResponse.data : []);
            })
            .catch(() => setError('The expense transaction report could not be loaded. Please try again.'))
            .finally(() => setLoading(false));
        // Load initial data once; filters are submitted explicitly afterward.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateFilter = (event) => {
        const { name, value } = event.target;
        setFilters((current) => ({ ...current, [name]: value }));
    };

    const selectedIds = (value) => (typeof value === 'string' ? value.split(',') : value)
        .map(Number)
        .filter((id) => Number.isFinite(id) && id > 0);

    const uniqueById = (items) => Array.from(new Map(items.map((item) => [Number(item.id), item])).values());

    const selectedNames = (selected, options, nameKey, allLabel) => {
        if (!selected.length) return allLabel;
        const names = options.filter((item) => selected.includes(Number(item.id))).map((item) => item[nameKey]);
        if (names.length <= 2) return names.join(', ');
        return `${names.slice(0, 2).join(', ')} +${names.length - 2}`;
    };
    const selectedExpenseNames = (selected) => {
        if (!selected.length) return 'All expenses';
        const names = expenses.filter((item) => selected.includes(Number(item.id))).map((item) => Number(item.is_hidden) === 1 && shouldMaskHiddenExpenses ? '***' : item.expense_name);
        return names.length <= 2 ? names.join(', ') : `${names.slice(0, 2).join(', ')} +${names.length - 2}`;
    };

    const changeType = (event) => {
        const rawValue = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
        const typeIds = rawValue.includes('__all__') ? [] : selectedIds(rawValue);
        setFilters((current) => ({ ...current, expense_type_ids: typeIds, expense_category_ids: [], expense_ids: [] }));
        setExpenseCategories([]);
        setExpenses([]);
        if (!typeIds.length) return;
        Promise.all(typeIds.map((typeId) => ExpensesCategoryService.fetchExpenseCategoryById(typeId)))
            .then((responses) => setExpenseCategories(uniqueById(responses.flatMap(
                (response) => Array.isArray(response.data) ? response.data : []
            )).sort((a, b) => String(a.expense_category_name || '').localeCompare(String(b.expense_category_name || '')))))
            .catch(() => setError('Expense categories could not be loaded.'));
    };

    const changeCategory = (event) => {
        const rawValue = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
        const categoryIds = rawValue.includes('__all__') ? [] : selectedIds(rawValue);
        setFilters((current) => ({ ...current, expense_category_ids: categoryIds, expense_ids: [] }));
        setExpenses([]);
        if (!categoryIds.length) return;
        Promise.all(categoryIds.map((categoryId) => ExpensesService.fetchExpenseV2ById(categoryId)))
            .then((responses) => setExpenses(uniqueById(responses.flatMap(
                (response) => Array.isArray(response.data) ? response.data : []
            )).sort((a, b) => String(a.expense_name || '').localeCompare(String(b.expense_name || '')))))
            .catch(() => setError('Expenses could not be loaded.'));
    };

    const changeExpense = (event) => {
        const rawValue = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
        const expenseIds = rawValue.includes('__all__') ? [] : selectedIds(rawValue);
        setFilters((current) => ({ ...current, expense_ids: expenseIds }));
    };

    const visibleTransactions = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) return transactions;
        return transactions.filter((item) => [
            item.id,
            item.chart_of_account_code,
            item.expense_type,
            item.expense_category_name,
            Number(item.is_hidden) === 1 && shouldMaskHiddenExpenses ? '***' : item.expense_name,
            item.name,
            item.approver_name,
            item.approval_status,
            item.details,
        ].some((value) => String(value || '').toLowerCase().includes(term)));
    }, [query, shouldMaskHiddenExpenses, transactions]);

    const groupedTransactions = useMemo(() => visibleTransactions.reduce((types, item) => {
        const typeName = item.expense_type || 'Other expenses';
        const categoryName = item.expense_category_name || 'Uncategorized';
        const expenseName = Number(item.is_hidden) === 1 && shouldMaskHiddenExpenses ? '***' : item.expense_name || 'Unnamed expense';
        const amount = Number(item.amount || 0);

        if (!types[typeName]) types[typeName] = { categories: {}, count: 0, total: 0 };
        if (!types[typeName].categories[categoryName]) types[typeName].categories[categoryName] = { expenses: {}, count: 0, total: 0 };
        if (!types[typeName].categories[categoryName].expenses[expenseName]) types[typeName].categories[categoryName].expenses[expenseName] = { items: [], total: 0 };

        const type = types[typeName];
        const category = type.categories[categoryName];
        const expense = category.expenses[expenseName];
        expense.items.push(item);
        expense.total += amount;
        category.count += 1;
        category.total += amount;
        type.count += 1;
        type.total += amount;
        return types;
    }, {}), [shouldMaskHiddenExpenses, visibleTransactions]);

    const groupingCounts = useMemo(() => Object.values(groupedTransactions).reduce((counts, type) => {
        const categories = Object.values(type.categories);
        counts.categories += categories.length;
        counts.expenses += categories.reduce((sum, category) => sum + Object.keys(category.expenses).length, 0);
        return counts;
    }, { categories: 0, expenses: 0 }), [groupedTransactions]);

    const totalExpenses = transactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const receivedCount = transactions.filter((item) => Number(item.is_received) === 1).length;
    const pendingCount = transactions.length - receivedCount;

    const paymentDetails = (item) => {
        if (!Number(item.payment_type_po_id)) return '—';
        if (Number(item.payment_type_po_id) === 1) return item.bank_name || 'Bank payment';

        const isOnlineTransfer = String(item.payment_term || '').trim().toLowerCase() === 'online transfer';
        const details = [
            isOnlineTransfer ? item.payment_term : null,
            item.bank_name,
            item.account_name,
            item.account_number,
        ].filter(Boolean);
        const uniqueDetails = details.filter((value, index) => details.findIndex(
            (candidate) => String(candidate).trim().toLowerCase() === String(value).trim().toLowerCase()
        ) === index);

        return uniqueDetails.length ? uniqueDetails.join(' · ') : item.payment_term || '—';
    };

    const accountCode = (item) => {
        const segments = [
            ['chart', item.chart_of_account_code],
            ['type', item.expense_type_code],
            ['category', item.expense_category_code],
            ['expense', item.expense_code],
        ].filter(([, value]) => value !== undefined && value !== null && value !== '');

        if (!segments.length) return '—';
        return (
            <span className="er-account-code">
                {segments.map(([name, value]) => <b key={name} className={`er-code-${name}`}>{value}</b>)}
            </span>
        );
    };

    const formatDate = (value) => {
        if (!value) return '—';
        const date = new Date(String(value).replace(' ', 'T'));
        return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-US', {
            year: 'numeric', month: 'short', day: '2-digit',
        }).format(date);
    };

    return (
        <main className="er-page">
            <div className="er-shell">
                <header className="er-hero">
                    <div className="er-hero-icon"><ReceiptLongRoundedIcon /></div>
                    <div><span>Financial reports</span><h1>Expense Transactions</h1><p>Review approved expenses, payment details, recipients, and category totals.</p></div>
                </header>

                {error && <Alert severity="error" className="er-alert">{error}</Alert>}

                <section className="er-summary">
                    <article><AccountBalanceWalletOutlinedIcon /><div><span>Total expenses</span><strong>{money(totalExpenses)}</strong></div></article>
                    <article><ReceiptLongRoundedIcon /><div><span>Transactions</span><strong>{transactions.length.toLocaleString()}</strong></div></article>
                    <article><CheckCircleOutlineRoundedIcon /><div><span>Received</span><strong>{receivedCount.toLocaleString()}</strong></div></article>
                    <article><PendingActionsRoundedIcon /><div><span>Not received</span><strong>{pendingCount.toLocaleString()}</strong></div></article>
                </section>

                <section className="er-filter-card">
                    <header><strong>Report filters</strong><span>Narrow the report by expense classification and date.</span></header>
                    <div className="er-filter-grid">
                        <FormControl fullWidth size="small"><InputLabel>Expense type</InputLabel><Select multiple name="expense_type_ids" value={filters.expense_type_ids} label="Expense type" onChange={changeType} renderValue={(selected) => selectedNames(selected, expenseTypes, 'expense_type', 'All types')} MenuProps={{ PaperProps: { className: 'er-checkbox-menu' } }}><MenuItem value="__all__"><Checkbox size="small" checked={!filters.expense_type_ids.length} /><ListItemText primary="All expense types" /></MenuItem>{expenseTypes.map((item) => <MenuItem key={item.id} value={Number(item.id)}><Checkbox size="small" checked={filters.expense_type_ids.includes(Number(item.id))} /><ListItemText primary={item.expense_type} /></MenuItem>)}</Select></FormControl>
                        <FormControl fullWidth size="small" disabled={!filters.expense_type_ids.length}><InputLabel>Category</InputLabel><Select multiple name="expense_category_ids" value={filters.expense_category_ids} label="Category" onChange={changeCategory} renderValue={(selected) => selectedNames(selected, expenseCategories, 'expense_category_name', 'All categories')} MenuProps={{ PaperProps: { className: 'er-checkbox-menu' } }}><MenuItem value="__all__"><Checkbox size="small" checked={!filters.expense_category_ids.length} /><ListItemText primary="All categories" /></MenuItem>{expenseCategories.map((item) => <MenuItem key={item.id} value={Number(item.id)}><Checkbox size="small" checked={filters.expense_category_ids.includes(Number(item.id))} /><ListItemText primary={item.expense_category_name} /></MenuItem>)}</Select></FormControl>
                        <FormControl fullWidth size="small" disabled={!filters.expense_category_ids.length}><InputLabel>Expense</InputLabel><Select multiple name="expense_ids" value={filters.expense_ids} label="Expense" onChange={changeExpense} renderValue={selectedExpenseNames} MenuProps={{ PaperProps: { className: 'er-checkbox-menu' } }}><MenuItem value="__all__"><Checkbox size="small" checked={!filters.expense_ids.length} /><ListItemText primary="All expenses" /></MenuItem>{expenses.map((item) => <MenuItem key={item.id} value={Number(item.id)}><Checkbox size="small" checked={filters.expense_ids.includes(Number(item.id))} /><ListItemText primary={Number(item.is_hidden) === 1 && shouldMaskHiddenExpenses ? '***' : item.expense_name} /></MenuItem>)}</Select></FormControl>
                        <TextField fullWidth size="small" type="date" name="dateFrom" value={filters.dateFrom} onChange={updateFilter} label="Date from" InputLabelProps={{ shrink: true }} />
                        <TextField fullWidth size="small" type="date" name="dateTo" value={filters.dateTo} onChange={updateFilter} label="Date to" InputLabelProps={{ shrink: true }} />
                        <Button variant="contained" onClick={() => loadTransactions()} disabled={loading || !filters.dateFrom || !filters.dateTo}>Run report</Button>
                    </div>
                    {loading && <LinearProgress className="er-progress" />}
                </section>

                <section className="er-table-card">
                    <header>
                        <div><h2>Expense details</h2><p>{visibleTransactions.length} transactions · {groupingCounts.categories} categories · {groupingCounts.expenses} expenses</p></div>
                        <div className="er-table-actions"><FormControlLabel className="er-confidential" control={<Checkbox checked={showHiddenExpenses} disabled={!isAdmin} onChange={(event) => setShowHiddenExpenses(event.target.checked)} />} label="Confidential" /><TextField size="small" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search expenses..." InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }} /></div>
                    </header>
                    <div className="er-table-scroll">
                        <table className="er-table">
                            <thead><tr><th>ID / Code</th><th>Expense</th><th>Requestor</th><th>Approver</th><th>Status</th><th>Amount</th><th>Payment</th><th>Details</th><th>Received</th><th>Date</th><th>Action</th></tr></thead>
                            <tbody>
                                {Object.entries(groupedTransactions).map(([typeName, type], typeIndex) => {
                                    const palette = expenseTypePalettes[typeIndex % expenseTypePalettes.length];
                                    const groupStyle = {
                                        '--er-type-main': palette.main,
                                        '--er-type-category': palette.category,
                                        '--er-type-expense': palette.expense,
                                        '--er-type-border': palette.border,
                                        '--er-type-text': palette.text,
                                    };
                                    return (
                                    <React.Fragment key={typeName}>
                                        <tr className="er-group er-group-type" style={groupStyle}><td colSpan="11"><span className="er-group-label">Expense type</span><strong>{typeName}</strong><span>{type.count} transactions</span><b>{money(type.total)}</b></td></tr>
                                        {Object.entries(type.categories).map(([categoryName, category], categoryIndex) => (
                                            <React.Fragment key={`${typeName}-${categoryName}`}>
                                                <tr className="er-group er-group-category" style={groupStyle}><td colSpan="11"><span className="er-group-number">{String(categoryIndex + 1).padStart(2, '0')}</span><span className="er-group-label">Category</span><strong>{categoryName}</strong><span>{category.count} {category.count === 1 ? 'transaction' : 'transactions'}</span><b>{money(category.total)}</b></td></tr>
                                                {Object.entries(category.expenses).map(([expenseName, expense]) => (
                                                    <React.Fragment key={`${typeName}-${categoryName}-${expenseName}`}>
                                                        <tr className="er-group er-group-expense" style={groupStyle}><td colSpan="11"><span className="er-group-branch">↳</span><span className="er-group-label">Expense</span><strong>{expenseName}</strong><span>{expense.items.length} {expense.items.length === 1 ? 'transaction' : 'transactions'}</span><b>{money(expense.total)}</b></td></tr>
                                                        {expense.items.map((item) => (
                                            <tr className="er-transaction-row" key={item.id}>
                                                <td><strong>#{item.id}</strong><small>{accountCode(item)}</small></td>
                                                <td><strong>{Number(item.is_hidden) === 1 && shouldMaskHiddenExpenses ? '***' : item.expense_name || '—'}</strong><small>{item.expense_category_name || 'Uncategorized'}</small></td>
                                                <td>{item.name || '—'}</td>
                                                <td>{item.approver_name || '—'}</td>
                                                <td><span className={`er-status er-status-${String(item.approval_status || 'pending').toLowerCase()}`}>{item.approval_status || 'PENDING'}</span></td>
                                                <td className="er-money">{money(item.amount)}</td>
                                                <td className="er-payment">{paymentDetails(item)}</td>
                                                <td className="er-details">{item.details || '—'}</td>
                                                <td><span className={`er-received ${Number(item.is_received) === 1 ? 'yes' : 'no'}`}>{Number(item.is_received) === 1 ? 'Received' : 'Pending'}</span></td>
                                                <td>{formatDate(item.expense_date)}</td>
                                                <td><Button component={Link} to={`/expensesV2/editExpenseTransaction/${item.id}`} size="small" variant="outlined">{Number(item.is_received) === 1 ? 'View' : 'Update'}</Button></td>
                                            </tr>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                        <tr className="er-total er-type-total" style={groupStyle}><td colSpan="5">{typeName} total</td><td>{money(type.total)}</td><td colSpan="5" /></tr>
                                    </React.Fragment>
                                    );
                                })}
                                {!loading && !visibleTransactions.length && <tr><td colSpan="11"><div className="er-empty"><ReceiptLongRoundedIcon /><strong>No expenses found</strong><span>Change the filters or search term and try again.</span></div></td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default ReportExpenseTransaction;
