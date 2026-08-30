import React, { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ExpensesV2Service from './ExpensesV2Service';
import ExpensesCategoryV2Service from './ExpensesCategoryV2Service';
import ExpensesTypeV2Service from './ExpensesTypeV2Service';
import './ExpenseType.css';
import './ViewExpenseEdit.css';

const emptyEditor = { id: 0, expense_category_id: '', expense_name: '', expense_code: '', details: '', account_nature: 'DEBIT', is_hidden: false, status: 0 };

const ViewExpense = () => {
    const [types, setTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [filters, setFilters] = useState({ expense_type_id: '', expense_category_id: '' });
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [editor, setEditor] = useState(emptyEditor);
    const [editCategories, setEditCategories] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editError, setEditError] = useState('');

    useEffect(() => {
        Promise.all([ExpensesTypeV2Service.getAll(), ExpensesV2Service.fetchExpenseV2ById(0)])
            .then(([typeResponse, expenseResponse]) => {
                setTypes(Array.isArray(typeResponse.data) ? typeResponse.data : []);
                setExpenses(Array.isArray(expenseResponse.data) ? expenseResponse.data : []);
            })
            .catch(() => setError('Expenses could not be loaded.'))
            .finally(() => setLoading(false));
    }, []);

    const loadExpenses = (nextFilters) => {
        setLoading(true);
        setError('');
        const request = nextFilters.expense_type_id && nextFilters.expense_category_id
            ? ExpensesV2Service.fetchExpenseByTypeaAndCategory(nextFilters)
            : ExpensesV2Service.fetchExpenseV2ById(0);
        request.then((response) => setExpenses(Array.isArray(response.data) ? response.data : []))
            .catch(() => setError('Expenses could not be loaded.'))
            .finally(() => setLoading(false));
    };

    const changeType = (event) => {
        const expense_type_id = event.target.value;
        const next = { expense_type_id, expense_category_id: '' };
        setFilters(next);
        setCategories([]);
        if (expense_type_id) ExpensesCategoryV2Service.fetchExpenseCategoryById(expense_type_id).then((response) => setCategories(Array.isArray(response.data) ? response.data : [])).catch(() => setError('Categories could not be loaded.'));
        else loadExpenses(next);
    };

    const changeCategory = (event) => {
        const next = { ...filters, expense_category_id: event.target.value };
        setFilters(next);
        if (next.expense_category_id) loadExpenses(next);
    };

    const visibleExpenses = useMemo(() => {
        const term = query.trim().toLowerCase();
        return term ? expenses.filter((item) => [item.id, item.expense_type, item.expense_category_name, item.expense_name, item.chart_of_account_code, item.expense_code].some((value) => String(value || '').toLowerCase().includes(term))) : expenses;
    }, [expenses, query]);

    const openEditor = (item) => {
        setEditor({
            id: item.id,
            expense_category_id: item.expense_category_id || '',
            expense_name: item.expense_name || '',
            expense_code: item.expense_code || '',
            details: item.details || '',
            account_nature: item.account_nature || 'DEBIT',
            is_hidden: Number(item.is_hidden) === 1,
            status: Number(item.status || 0),
        });
        setEditError('');
        setEditOpen(true);
        ExpensesCategoryV2Service.fetchExpenseCategoryById(item.expense_type_id)
            .then((response) => setEditCategories(Array.isArray(response.data) ? response.data : []))
            .catch(() => setEditError('Categories could not be loaded.'));
    };

    const changeEditor = (event) => {
        const { name, value, checked, type } = event.target;
        setEditor((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    };

    const saveEditor = () => {
        if (!editor.expense_category_id || !editor.expense_name.trim() || !String(editor.expense_code).trim()) {
            setEditError('Category, expense name, and expense code are required.');
            return;
        }
        const payload = {
            expense_category_id: Number(editor.expense_category_id),
            expense_name: editor.expense_name.trim(),
            expense_code: String(editor.expense_code).trim(),
            details: editor.details.trim(),
            account_nature: editor.account_nature,
            is_hidden: Boolean(editor.is_hidden),
            status: Number(editor.status),
        };
        setSaving(true);
        setEditError('');
        ExpensesV2Service.sanctum().then(() => ExpensesV2Service.patch(editor.id, payload))
            .then(() => {
                setEditOpen(false);
                setEditor(emptyEditor);
                loadExpenses(filters);
            })
            .catch((requestError) => setEditError(requestError.response?.data?.message || 'The expense could not be updated.'))
            .finally(() => setSaving(false));
    };

    return <main className="et-page"><div className="et-shell">
        <header className="et-hero"><div className="et-hero-icon"><ReceiptLongOutlinedIcon /></div><div><span>Expense setup</span><h1>Expenses</h1><p>Review configured expenses, their hierarchy, codes, and visibility.</p></div></header>
        {error && <Alert severity="error" className="et-alert">{error}</Alert>}
        <div className="et-stats"><section className="et-stat"><ReceiptLongOutlinedIcon /><div><span>Visible results</span><strong>{visibleExpenses.length}</strong></div></section><section className="et-stat"><VisibilityOffOutlinedIcon /><div><span>Hidden</span><strong>{visibleExpenses.filter((item) => Number(item.is_hidden) === 1).length}</strong></div></section></div>
        <section className="et-table-card"><header><div><h2>Expense directory</h2><p>Select a type and category to narrow the results.</p></div><div className="et-directory-filters"><FormControl size="small"><InputLabel>Expense type</InputLabel><Select value={filters.expense_type_id} label="Expense type" onChange={changeType}><MenuItem value="">All expense types</MenuItem>{types.map((item) => <MenuItem key={item.id} value={item.id}>{item.expense_type}</MenuItem>)}</Select></FormControl><FormControl size="small" disabled={!filters.expense_type_id}><InputLabel>Category</InputLabel><Select value={filters.expense_category_id} label="Category" onChange={changeCategory}><MenuItem value="">Select category</MenuItem>{categories.map((item) => <MenuItem key={item.id} value={item.id}>{item.expense_category_name}</MenuItem>)}</Select></FormControl><TextField size="small" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search expenses..." InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }} /></div></header>
            <div className="et-table-scroll"><table className="et-table"><thead><tr><th>ID</th><th>Full code</th><th>Expense type</th><th>Category</th><th>Expense</th><th>Visibility</th><th>Action</th></tr></thead><tbody>
                {visibleExpenses.map((item) => <tr key={item.id}><td>#{item.id}</td><td><span className="et-code"><b>{item.chart_of_account_code}</b><i>{item.expense_type_code}</i><em>{item.expense_category_code}</em><span>{item.expense_code}</span></span></td><td>{item.expense_type}</td><td>{item.expense_category_name}</td><td><strong>{item.expense_name}</strong></td><td><span className={`et-visibility ${Number(item.is_hidden) === 1 ? 'hidden' : 'visible'}`}>{Number(item.is_hidden) === 1 ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}{Number(item.is_hidden) === 1 ? 'Hidden' : 'Visible'}</span></td><td><Button size="small" variant="outlined" startIcon={<EditOutlinedIcon />} onClick={() => openEditor(item)}>Edit</Button></td></tr>)}
                {!loading && !visibleExpenses.length && <tr><td colSpan="7"><div className="et-empty"><ReceiptLongOutlinedIcon /><strong>No expenses found</strong><span>Change the filters or search term.</span></div></td></tr>}
            </tbody></table></div>{loading && <LinearProgress className="et-progress" />}
        </section>
        <Dialog open={editOpen} onClose={() => !saving && setEditOpen(false)} fullWidth maxWidth="sm" PaperProps={{ className: 'vee-dialog' }}>
            <DialogTitle><span>Expense setup</span><strong>Edit Expense</strong><small>Update the expense record without changing its parent expense type.</small></DialogTitle>
            <DialogContent className="vee-fields">
                {editError && <Alert severity="error">{editError}</Alert>}
                <FormControl fullWidth size="small"><InputLabel>Expense category *</InputLabel><Select name="expense_category_id" value={editor.expense_category_id} label="Expense category *" onChange={changeEditor}>{editCategories.map((item) => <MenuItem key={item.id} value={item.id}>{item.expense_category_name}</MenuItem>)}</Select></FormControl>
                <TextField fullWidth size="small" name="expense_name" value={editor.expense_name} onChange={changeEditor} label="Expense name *" />
                <TextField fullWidth size="small" name="expense_code" value={editor.expense_code} onChange={changeEditor} label="Expense code *" />
                <TextField fullWidth size="small" name="details" value={editor.details} onChange={changeEditor} label="Details" multiline minRows={3} />
                <FormControl fullWidth size="small"><InputLabel>Account nature</InputLabel><Select name="account_nature" value={editor.account_nature} label="Account nature" onChange={changeEditor}><MenuItem value="DEBIT">Debit</MenuItem><MenuItem value="CREDIT">Credit</MenuItem></Select></FormControl>
                <FormControl fullWidth size="small"><InputLabel>Status</InputLabel><Select name="status" value={editor.status} label="Status" onChange={changeEditor}><MenuItem value={0}>Active</MenuItem><MenuItem value={1}>Inactive</MenuItem></Select></FormControl>
                <FormControlLabel className="vee-hidden" control={<Checkbox name="is_hidden" checked={editor.is_hidden} onChange={changeEditor} />} label="Mark this expense as confidential" />
            </DialogContent>
            <DialogActions><Button onClick={() => setEditOpen(false)} disabled={saving}>Cancel</Button><Button variant="contained" onClick={saveEditor} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button></DialogActions>
        </Dialog>
    </div></main>;
};

export default ViewExpense;
