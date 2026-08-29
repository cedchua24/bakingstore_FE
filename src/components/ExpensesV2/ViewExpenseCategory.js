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
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ExpensesCategoryV2Service from './ExpensesCategoryV2Service';
import ExpensesTypeV2Service from './ExpensesTypeV2Service';
import './ExpenseType.css';

const ViewExpenseCategory = () => {
    const [types, setTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [typeId, setTypeId] = useState('');
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([ExpensesTypeV2Service.getAll(), ExpensesCategoryV2Service.fetchExpenseCategoryById(0)])
            .then(([typeResponse, categoryResponse]) => {
                setTypes(Array.isArray(typeResponse.data) ? typeResponse.data : []);
                setCategories(Array.isArray(categoryResponse.data) ? categoryResponse.data : []);
            })
            .catch(() => setError('Expense categories could not be loaded.'))
            .finally(() => setLoading(false));
    }, []);

    const filterByType = (event) => {
        const value = event.target.value;
        setTypeId(value);
        setLoading(true);
        setError('');
        ExpensesCategoryV2Service.fetchExpenseCategoryById(value || 0)
            .then((response) => setCategories(Array.isArray(response.data) ? response.data : []))
            .catch(() => setError('Expense categories could not be loaded.'))
            .finally(() => setLoading(false));
    };

    const visibleCategories = useMemo(() => {
        const term = query.trim().toLowerCase();
        return term ? categories.filter((item) => [item.id, item.expense_type, item.expense_category_name, item.chart_of_account_code, item.expense_type_code, item.expense_category_code].some((value) => String(value || '').toLowerCase().includes(term))) : categories;
    }, [categories, query]);

    return <main className="et-page"><div className="et-shell">
        <header className="et-hero et-hero-actions"><div className="et-hero-main"><div className="et-hero-icon"><CategoryOutlinedIcon /></div><div><span>Expense setup</span><h1>Expense Categories</h1><p>Browse categories across every expense type or narrow the directory by type.</p></div></div></header>
        {error && <Alert severity="error" className="et-alert">{error}</Alert>}
        <section className="et-stat"><CategoryOutlinedIcon /><div><span>Visible categories</span><strong>{visibleCategories.length}</strong></div></section>
        <section className="et-table-card"><header><div><h2>Category directory</h2><p>{typeId ? 'Filtered by expense type' : 'Showing all categories'}</p></div><div className="et-directory-filters"><FormControl size="small"><InputLabel>Expense type</InputLabel><Select value={typeId} label="Expense type" onChange={filterByType}><MenuItem value="">All expense types</MenuItem>{types.map((item) => <MenuItem key={item.id} value={item.id}>{item.expense_type}</MenuItem>)}</Select></FormControl><TextField size="small" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories..." InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }} /></div></header>
            <div className="et-table-scroll"><table className="et-table"><thead><tr><th>ID</th><th>Full code</th><th>Expense type</th><th>Category</th><th>Action</th></tr></thead><tbody>
                {visibleCategories.map((item) => <tr key={item.id}><td>#{item.id}</td><td><span className="et-code"><b>{item.chart_of_account_code}</b><i>{item.expense_type_code}</i><em>{item.expense_category_code}</em></span></td><td>{item.expense_type}</td><td><strong>{item.expense_category_name}</strong></td><td><Button component={Link} to={`/expensesV2/viewExpenseTypeCategoryList/${item.expense_type_id}/${item.id}`} size="small" variant="outlined" startIcon={<VisibilityOutlinedIcon />}>View</Button></td></tr>)}
                {!loading && !visibleCategories.length && <tr><td colSpan="5"><div className="et-empty"><CategoryOutlinedIcon /><strong>No categories found</strong><span>Change the selected type or search term.</span></div></td></tr>}
            </tbody></table></div>{loading && <LinearProgress className="et-progress" />}
        </section>
    </div></main>;
};

export default ViewExpenseCategory;
