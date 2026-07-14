import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ExpensesTypeService from './ExpensesTypeV2Service';
import './ExpenseType.css';

const ViewExpenseTypeList = () => {
    const { id } = useParams();
    const [result, setResult] = useState({ data: [], name: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');

    useEffect(() => {
        ExpensesTypeService.fetchExpenseTypeById(id).then((response) => setResult(response.data || { data: [], name: '' }))
            .catch(() => setError('Expense categories could not be loaded.')).finally(() => setLoading(false));
    }, [id]);

    const categories = Array.isArray(result.data) ? result.data : [];
    const visibleCategories = useMemo(() => { const term = query.trim().toLowerCase(); return term ? categories.filter((item) => [item.id, item.expense_category_name, item.expense_category_code].some((value) => String(value || '').toLowerCase().includes(term))) : categories; }, [categories, query]);

    return <main className="et-page"><div className="et-shell">
        <header className="et-hero et-hero-actions"><div className="et-hero-main"><div className="et-hero-icon"><CategoryOutlinedIcon /></div><div><span>Expense setup</span><h1>{result.name || 'Expense Type Categories'}</h1><p>Browse the categories configured beneath this expense type.</p></div></div><Button component={Link} to="/expensesV2/expenseTypeList" variant="outlined" startIcon={<ArrowBackRoundedIcon />}>Back to types</Button></header>
        {error && <Alert severity="error" className="et-alert">{error}</Alert>}
        <section className="et-stat"><CategoryOutlinedIcon /><div><span>Categories</span><strong>{categories.length}</strong></div></section>
        <section className="et-table-card"><header><div><h2>Expense categories</h2><p>{visibleCategories.length} results</p></div><TextField size="small" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories..." InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }} /></header><div className="et-table-scroll"><table className="et-table"><thead><tr><th>ID</th><th>Category code</th><th>Category name</th><th>Action</th></tr></thead><tbody>
            {visibleCategories.map((item) => <tr key={item.id}><td>#{item.id}</td><td><span className="et-code"><b>{item.chart_of_account_code}</b><i>{item.expense_type_code}</i><em>{item.expense_category_code}</em></span></td><td><strong>{item.expense_category_name}</strong></td><td><Button component={Link} to={`/expensesV2/viewExpenseTypeCategoryList/${item.expense_type_id}/${item.id}`} size="small" variant="outlined" startIcon={<VisibilityOutlinedIcon />}>View</Button></td></tr>)}
            {!loading && !visibleCategories.length && <tr><td colSpan="4"><div className="et-empty"><CategoryOutlinedIcon /><strong>No categories found</strong><span>This expense type has no matching categories.</span></div></td></tr>}
        </tbody></table></div>{loading && <LinearProgress className="et-progress" />}</section>
    </div></main>;
};

export default ViewExpenseTypeList;
