import React, { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ChartOfAccountService from './ChartOfAccountService';
import ExpensesTypeService from './ExpensesTypeV2Service';
import './ExpenseType.css';

const initialExpenseType = { chart_of_account_id: '', expense_type_code: '', expense_type: '' };

const AddExpenseTypeV2 = () => {
    const [expenseType, setExpenseType] = useState(initialExpenseType);
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [errors, setErrors] = useState({});
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [query, setQuery] = useState('');

    const loadData = () => Promise.all([ExpensesTypeService.getAll(), ChartOfAccountService.getAll()])
        .then(([typeResponse, accountResponse]) => {
            setExpenseTypes(Array.isArray(typeResponse.data) ? typeResponse.data : []);
            setAccounts(Array.isArray(accountResponse.data) ? accountResponse.data : []);
        })
        .catch(() => setNotice({ severity: 'error', message: 'Expense type data could not be loaded.' }))
        .finally(() => setLoading(false));

    useEffect(() => { loadData(); }, []);

    const update = (event) => {
        const { name, value } = event.target;
        setExpenseType((current) => ({ ...current, [name]: value }));
        if (value !== '') setErrors((current) => ({ ...current, [name]: undefined }));
    };

    const save = () => {
        const nextErrors = {};
        if (!expenseType.chart_of_account_id) nextErrors.chart_of_account_id = 'Account is required.';
        if (expenseType.expense_type_code === '') nextErrors.expense_type_code = 'Type code is required.';
        if (!expenseType.expense_type.trim()) nextErrors.expense_type = 'Expense type is required.';
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;

        setSaving(true);
        setNotice(null);
        ExpensesTypeService.sanctum()
            .then(() => ExpensesTypeService.create(expenseType))
            .then((response) => {
                setNotice({ severity: 'success', message: response.data?.message || 'Expense type created successfully.' });
                setExpenseType(initialExpenseType);
                return ExpensesTypeService.getAll();
            })
            .then((response) => setExpenseTypes(Array.isArray(response.data) ? response.data : []))
            .catch(() => setNotice({ severity: 'error', message: 'This expense type already exists or could not be saved.' }))
            .finally(() => setSaving(false));
    };

    const visibleTypes = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) return expenseTypes;
        return expenseTypes.filter((item) => [item.id, item.expense_type, item.chart_of_account_name, item.chart_of_account_code, item.expense_type_code]
            .some((value) => String(value || '').toLowerCase().includes(term)));
    }, [expenseTypes, query]);

    return <main className="et-page"><div className="et-shell">
        <header className="et-hero"><div className="et-hero-icon"><AddCircleOutlineRoundedIcon /></div><div><span>Expense setup</span><h1>Add Expense Type</h1><p>Create an expense type and connect it to the chart of accounts.</p></div></header>
        {notice && <Alert severity={notice.severity} className="et-alert" onClose={() => setNotice(null)}>{notice.message}</Alert>}
        <section className="et-form-card"><header><div><strong>Expense type details</strong><span>Assign an account and a single-digit type code.</span></div></header><div className="et-form-grid">
            <div><FormControl fullWidth size="small" error={Boolean(errors.chart_of_account_id)}><InputLabel>Chart of account *</InputLabel><Select name="chart_of_account_id" value={expenseType.chart_of_account_id} label="Chart of account *" onChange={update}>{accounts.map((item) => <MenuItem key={item.id} value={item.id} disabled={Number(item.status) === 1}>{item.chart_of_account_name} — {item.chart_of_account_code}</MenuItem>)}</Select></FormControl>{errors.chart_of_account_id && <p className="et-error">{errors.chart_of_account_id}</p>}</div>
            <div><FormControl fullWidth size="small" error={Boolean(errors.expense_type_code)}><InputLabel>Type code *</InputLabel><Select name="expense_type_code" value={expenseType.expense_type_code} label="Type code *" onChange={update}>{Array.from({ length: 10 }, (_, code) => <MenuItem key={code} value={code}>{code}</MenuItem>)}</Select></FormControl>{errors.expense_type_code && <p className="et-error">{errors.expense_type_code}</p>}</div>
            <div><TextField fullWidth size="small" name="expense_type" value={expenseType.expense_type} label="Expense type *" placeholder="e.g. Operating Expenses" onChange={update} error={Boolean(errors.expense_type)} />{errors.expense_type && <p className="et-error">{errors.expense_type}</p>}</div>
            <Button variant="contained" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Add expense type'}</Button>
        </div>{saving && <LinearProgress className="et-progress" />}</section>
        <section className="et-table-card"><header><div><h2>Expense types</h2><p>{visibleTypes.length} configured types</p></div><TextField size="small" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search types..." InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }} /></header><div className="et-table-scroll"><table className="et-table"><thead><tr><th>ID</th><th>Account code</th><th>Expense type</th><th>Account</th></tr></thead><tbody>
            {visibleTypes.map((item) => <tr key={item.id}><td>#{item.id}</td><td><span className="et-code"><b>{item.chart_of_account_code}</b><i>{item.expense_type_code}</i></span></td><td><strong>{item.expense_type}</strong></td><td>{item.chart_of_account_name || '—'}</td></tr>)}
            {!loading && !visibleTypes.length && <tr><td colSpan="4"><div className="et-empty"><AccountTreeOutlinedIcon /><strong>No expense types found</strong><span>Add your first type or change the search.</span></div></td></tr>}
        </tbody></table></div>{loading && <LinearProgress className="et-progress" />}</section>
    </div></main>;
};

export default AddExpenseTypeV2;
