import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
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

const money = (value) => new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
}).format(Number(value || 0));

const today = () => new Date().toLocaleDateString('en-CA');

const ReportExpenseTransaction = () => {
    const role = localStorage.getItem('role_as');
    const [filters, setFilters] = useState({
        id: 0,
        expense_type_id: 0,
        expense_category_id: 0,
        expense_id: 0,
        approval_status: 'APPROVED',
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

    const loadTransactions = (requestFilters = filters) => {
        setLoading(true);
        setError('');
        return ExpenseTransactionService.searchExpenseTransactionList(requestFilters)
            .then((response) => setTransactions(Array.isArray(response.data) ? response.data : []))
            .catch(() => setError('The expense transaction report could not be loaded. Please try again.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        Promise.all([
            ExpensesTypeService.getAll(),
            ExpenseTransactionService.searchExpenseTransactionList(filters),
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

    const changeType = (event) => {
        const typeId = event.target.value;
        setFilters((current) => ({ ...current, expense_type_id: typeId, expense_category_id: 0, expense_id: 0 }));
        setExpenseCategories([]);
        setExpenses([]);
        if (!typeId) return;
        ExpensesCategoryService.fetchExpenseCategoryById(typeId)
            .then((response) => setExpenseCategories(Array.isArray(response.data) ? response.data : []))
            .catch(() => setError('Expense categories could not be loaded.'));
    };

    const changeCategory = (event) => {
        const categoryId = event.target.value;
        setFilters((current) => ({ ...current, expense_category_id: categoryId, expense_id: 0 }));
        setExpenses([]);
        if (!categoryId) return;
        ExpensesService.fetchExpenseV2ById(categoryId)
            .then((response) => setExpenses(Array.isArray(response.data) ? response.data : []))
            .catch(() => setError('Expenses could not be loaded.'));
    };

    const visibleTransactions = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) return transactions;
        return transactions.filter((item) => [
            item.id,
            item.chart_of_account_code,
            item.expense_type,
            item.expense_category_name,
            item.expense_name,
            item.name,
            item.approver_name,
            item.approval_status,
            item.details,
        ].some((value) => String(value || '').toLowerCase().includes(term)));
    }, [query, transactions]);

    const groupedTransactions = useMemo(() => visibleTransactions.reduce((groups, item) => {
        const type = item.expense_type || 'Other expenses';
        if (!groups[type]) groups[type] = { items: [], total: 0 };
        groups[type].items.push(item);
        groups[type].total += Number(item.amount || 0);
        return groups;
    }, {}), [visibleTransactions]);

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
                        <FormControl fullWidth size="small"><InputLabel>Expense type</InputLabel><Select name="expense_type_id" value={filters.expense_type_id} label="Expense type" onChange={changeType}><MenuItem value={0}>All types</MenuItem>{expenseTypes.map((item) => <MenuItem key={item.id} value={item.id}>{item.expense_type}</MenuItem>)}</Select></FormControl>
                        <FormControl fullWidth size="small" disabled={!filters.expense_type_id}><InputLabel>Category</InputLabel><Select name="expense_category_id" value={filters.expense_category_id} label="Category" onChange={changeCategory}><MenuItem value={0}>All categories</MenuItem>{expenseCategories.map((item) => <MenuItem key={item.id} value={item.id}>{item.expense_category_name}</MenuItem>)}</Select></FormControl>
                        <FormControl fullWidth size="small" disabled={!filters.expense_category_id}><InputLabel>Expense</InputLabel><Select name="expense_id" value={filters.expense_id} label="Expense" onChange={updateFilter}><MenuItem value={0}>All expenses</MenuItem>{expenses.map((item) => <MenuItem key={item.id} value={item.id}>{Number(role) !== 2 && Number(item.is_hidden) === 1 ? '*****' : item.expense_name}</MenuItem>)}</Select></FormControl>
                        <TextField fullWidth size="small" type="date" name="dateFrom" value={filters.dateFrom} onChange={updateFilter} label="Date from" InputLabelProps={{ shrink: true }} />
                        <TextField fullWidth size="small" type="date" name="dateTo" value={filters.dateTo} onChange={updateFilter} label="Date to" InputLabelProps={{ shrink: true }} />
                        <Button variant="contained" onClick={() => loadTransactions()} disabled={loading || !filters.dateFrom || !filters.dateTo}>Run report</Button>
                    </div>
                    {loading && <LinearProgress className="er-progress" />}
                </section>

                <section className="er-table-card">
                    <header>
                        <div><h2>Expense details</h2><p>{visibleTransactions.length} results across {Object.keys(groupedTransactions).length} expense types</p></div>
                        <TextField size="small" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search expenses..." InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }} />
                    </header>
                    <div className="er-table-scroll">
                        <table className="er-table">
                            <thead><tr><th>ID / Code</th><th>Expense</th><th>Requestor</th><th>Approver</th><th>Status</th><th>Amount</th><th>Payment</th><th>Details</th><th>Received</th><th>Date</th><th>Action</th></tr></thead>
                            <tbody>
                                {Object.entries(groupedTransactions).map(([type, group]) => (
                                    <React.Fragment key={type}>
                                        <tr className="er-group"><td colSpan="11"><strong>{type}</strong><span>{group.items.length} transactions</span></td></tr>
                                        {group.items.map((item) => (
                                            <tr key={item.id}>
                                                <td><strong>#{item.id}</strong><small>{accountCode(item)}</small></td>
                                                <td><strong>{Number(item.is_hidden) === 1 ? '•••••' : item.expense_name || '—'}</strong><small>{item.expense_category_name || 'Uncategorized'}</small></td>
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
                                        <tr className="er-total"><td colSpan="5">{type} total</td><td>{money(group.total)}</td><td colSpan="5" /></tr>
                                    </React.Fragment>
                                ))}
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
