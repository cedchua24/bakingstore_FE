import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ExpensesTypeService from './ExpensesTypeV2Service';
import './ExpenseType.css';

const ViewExpenseTypeCategoryList = () => {
    const { id, id2 } = useParams();
    const [result, setResult] = useState({ data: [], name: '', expense_category_name: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');

    useEffect(() => {
        ExpensesTypeService.fetchExpenseTypeCategoryById(id, id2)
            .then((response) => setResult(response.data || { data: [], name: '', expense_category_name: '' }))
            .catch(() => setError('Expenses could not be loaded. Please try again.'))
            .finally(() => setLoading(false));
    }, [id, id2]);

    const expenses = Array.isArray(result.data) ? result.data : [];
    const visibleExpenses = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) return expenses;
        return expenses.filter((item) => [
            item.id,
            item.expense_name,
            item.expense_code,
            item.expense_category_name,
        ].some((value) => String(value || '').toLowerCase().includes(term)));
    }, [expenses, query]);

    const hiddenCount = expenses.filter((item) => Number(item.is_hidden) === 1).length;

    return (
        <main className="et-page">
            <div className="et-shell">
                <header className="et-hero et-hero-actions">
                    <div className="et-hero-main">
                        <div className="et-hero-icon"><ReceiptLongRoundedIcon /></div>
                        <div>
                            <span>Expense setup</span>
                            <h1>{result.expense_category_name || result.name || 'Category Expenses'}</h1>
                            <p>{result.name ? `${result.name} · ` : ''}Browse the expenses configured beneath this category.</p>
                        </div>
                    </div>
                    <Button component={Link} to={`/expensesV2/viewExpenseTypeList/${id}`} variant="outlined" startIcon={<ArrowBackRoundedIcon />}>Back to categories</Button>
                </header>

                {error && <Alert severity="error" className="et-alert">{error}</Alert>}

                <div className="et-stats">
                    <section className="et-stat"><ReceiptLongRoundedIcon /><div><span>Expenses</span><strong>{expenses.length}</strong></div></section>
                    <section className="et-stat"><LockOutlinedIcon /><div><span>Hidden</span><strong>{hiddenCount}</strong></div></section>
                </div>

                <section className="et-table-card">
                    <header>
                        <div><h2>Configured expenses</h2><p>{visibleExpenses.length} results</p></div>
                        <TextField size="small" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search expenses..." InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }} />
                    </header>
                    <div className="et-table-scroll">
                        <table className="et-table">
                            <thead><tr><th>ID</th><th>Expense code</th><th>Expense name</th><th>Visibility</th></tr></thead>
                            <tbody>
                                {visibleExpenses.map((item) => (
                                    <tr key={item.id}>
                                        <td>#{item.id}</td>
                                        <td><span className="et-code"><b>{item.chart_of_account_code}</b><i>{item.expense_type_code}</i><em>{item.expense_category_code}</em><span>{item.expense_code}</span></span></td>
                                        <td><strong>{item.expense_name}</strong></td>
                                        <td><span className={`et-visibility ${Number(item.is_hidden) === 1 ? 'hidden' : 'visible'}`}>{Number(item.is_hidden) === 1 ? <LockOutlinedIcon /> : <VisibilityOutlinedIcon />}{Number(item.is_hidden) === 1 ? 'Hidden' : 'Visible'}</span></td>
                                    </tr>
                                ))}
                                {!loading && !visibleExpenses.length && <tr><td colSpan="4"><div className="et-empty"><ReceiptLongRoundedIcon /><strong>No expenses found</strong><span>This category has no matching expenses.</span></div></td></tr>}
                            </tbody>
                        </table>
                    </div>
                    {loading && <LinearProgress className="et-progress" />}
                </section>
            </div>
        </main>
    );
};

export default ViewExpenseTypeCategoryList;
