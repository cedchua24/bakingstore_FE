import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ExpensesTypeService from './ExpensesTypeV2Service';
import './ExpenseType.css';

const ExpenseTypeList = () => {
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');

    useEffect(() => {
        ExpensesTypeService.getAll().then((response) => setExpenseTypes(Array.isArray(response.data) ? response.data : []))
            .catch(() => setError('Expense types could not be loaded.')).finally(() => setLoading(false));
    }, []);

    const visibleTypes = useMemo(() => { const term = query.trim().toLowerCase(); return term ? expenseTypes.filter((item) => [item.id, item.expense_type, item.chart_of_account_name, item.chart_of_account_code, item.expense_type_code].some((value) => String(value || '').toLowerCase().includes(term))) : expenseTypes; }, [expenseTypes, query]);

    return <main className="et-page"><div className="et-shell">
        <header className="et-hero et-hero-actions"><div className="et-hero-main"><div className="et-hero-icon"><AccountTreeOutlinedIcon /></div><div><span>Expense setup</span><h1>Expense Types</h1><p>Browse expense classifications and open their category structure.</p></div></div><Button component={Link} to="/expensesV2/addExpenseTypeV2" variant="contained" startIcon={<AddRoundedIcon />}>Add type</Button></header>
        {error && <Alert severity="error" className="et-alert">{error}</Alert>}
        <section className="et-stat"><AccountTreeOutlinedIcon /><div><span>Configured types</span><strong>{expenseTypes.length}</strong></div></section>
        <section className="et-table-card"><header><div><h2>All expense types</h2><p>{visibleTypes.length} results</p></div><TextField size="small" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search types..." InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }} /></header><div className="et-table-scroll"><table className="et-table"><thead><tr><th>ID</th><th>Account code</th><th>Expense type</th><th>Account</th><th>Action</th></tr></thead><tbody>
            {visibleTypes.map((item) => <tr key={item.id}><td>#{item.id}</td><td><span className="et-code"><b>{item.chart_of_account_code}</b><i>{item.expense_type_code}</i></span></td><td><strong>{item.expense_type}</strong></td><td>{item.chart_of_account_name || '—'}</td><td><Button component={Link} to={`/expensesV2/viewExpenseTypeList/${item.id}`} size="small" variant="outlined" startIcon={<VisibilityOutlinedIcon />}>View</Button></td></tr>)}
            {!loading && !visibleTypes.length && <tr><td colSpan="5"><div className="et-empty"><AccountTreeOutlinedIcon /><strong>No expense types found</strong><span>Try another search or add an expense type.</span></div></td></tr>}
        </tbody></table></div>{loading && <LinearProgress className="et-progress" />}</section>
    </div></main>;
};

export default ExpenseTypeList;
