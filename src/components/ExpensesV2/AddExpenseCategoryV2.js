import React, { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { Button, Form, InputGroup } from 'react-bootstrap';
import ExpensesTypeV2Service from './ExpensesTypeV2Service';
import ExpensesCategoryV2Service from './ExpensesCategoryV2Service';
import './AddExpenseV2.css';
import './AddExpenseCategoryV2.css';

const emptyCategory = { expense_type_id: '', expense_category_code: '', expense_category_name: '' };

const AddExpenseCategoryV2 = () => {
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(emptyCategory);
    const [errors, setErrors] = useState({});
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [query, setQuery] = useState('');

    useEffect(() => {
        Promise.all([ExpensesTypeV2Service.getAll(), ExpensesCategoryV2Service.getAll()])
            .then(([types, categoryList]) => {
                setExpenseTypes(Array.isArray(types.data) ? types.data : []);
                setCategories(Array.isArray(categoryList.data) ? categoryList.data : []);
            })
            .catch(() => setNotice({ severity: 'error', message: 'Expense category data could not be loaded.' }))
            .finally(() => setLoading(false));
    }, []);

    const update = ({ target: { name, value } }) => {
        setCategory((current) => ({ ...current, [name]: value }));
        if (value !== '') setErrors((current) => ({ ...current, [name]: undefined }));
    };

    const save = () => {
        const nextErrors = {};
        if (!category.expense_type_id) nextErrors.expense_type_id = 'Expense type is required.';
        if (!category.expense_category_code) nextErrors.expense_category_code = 'Category code is required.';
        if (!category.expense_category_name.trim()) nextErrors.expense_category_name = 'Category name is required.';
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;

        setSaving(true);
        setNotice(null);
        ExpensesCategoryV2Service.sanctum()
            .then(() => ExpensesCategoryV2Service.create(category))
            .then((response) => {
                setNotice({ severity: 'success', message: response.data?.message || 'Expense category created successfully.' });
                setCategory(emptyCategory);
                return ExpensesCategoryV2Service.getAll();
            })
            .then((response) => setCategories(Array.isArray(response.data) ? response.data : []))
            .catch(() => setNotice({ severity: 'error', message: 'This expense category already exists or could not be saved.' }))
            .finally(() => setSaving(false));
    };

    const visibleCategories = useMemo(() => {
        const term = query.trim().toLowerCase();
        return term ? categories.filter((item) => [item.id, item.expense_type, item.expense_category_name, item.chart_of_account_code, item.expense_type_code, item.expense_category_code]
            .some((value) => String(value || '').toLowerCase().includes(term))) : categories;
    }, [categories, query]);

    return <main className="aev-page"><div className="aev-shell">
        <header className="aev-hero"><span>Expense setup</span><h1>Add Expense Category</h1><p>Create a category under an existing expense type.</p></header>
        {notice && <Alert severity={notice.severity} className="aec-alert" onClose={() => setNotice(null)}>{notice.message}</Alert>}
        <section className="aev-form-card">
            <div className="aev-card-heading"><strong>Category details</strong><span>Choose its parent type, assign a two-digit code, and enter a clear name.</span></div>
            <Form className="aev-form-grid">
                <Form.Label>Expense type *</Form.Label>
                <Form.Select name="expense_type_id" value={category.expense_type_id} onChange={update} isInvalid={Boolean(errors.expense_type_id)}><option value="">Select expense type</option>{expenseTypes.map((item) => <option key={item.id} value={item.id}>{item.expense_type} — {item.chart_of_account_code}{item.expense_type_code}</option>)}</Form.Select>
                {errors.expense_type_id && <p>{errors.expense_type_id}</p>}
                <Form.Label>Category code *</Form.Label>
                <Form.Select name="expense_category_code" value={category.expense_category_code} onChange={update} isInvalid={Boolean(errors.expense_category_code)}><option value="">Select category code</option>{Array.from({ length: 99 }, (_, index) => String(index + 1).padStart(2, '0')).map((code) => <option key={code} value={code}>{code}</option>)}</Form.Select>
                {errors.expense_category_code && <p>{errors.expense_category_code}</p>}
                <Form.Group className="mb-3"><Form.Label>Expense category *</Form.Label><Form.Control name="expense_category_name" value={category.expense_category_name} placeholder="e.g. Store Repairs and Maintenance" onChange={update} isInvalid={Boolean(errors.expense_category_name)} /><Form.Control.Feedback type="invalid">{errors.expense_category_name}</Form.Control.Feedback></Form.Group>
                <Button className="aev-submit" disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Add expense category'}</Button>
            </Form>
            {saving && <LinearProgress />}
        </section>
        <section className="aev-table-card">
            <header><div><span>Category directory</span><h2>Expense categories</h2></div><strong>{visibleCategories.length} configured categories</strong></header>
            <div className="aec-search"><InputGroup><InputGroup.Text><SearchRoundedIcon /></InputGroup.Text><Form.Control value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories..." /></InputGroup></div>
            <div className="aev-table-scroll"><table className="table table-bordered mb-0"><thead className="table-light"><tr><th>ID</th><th>Full code</th><th>Expense type</th><th>Expense category</th></tr></thead><tbody>
                {visibleCategories.map((item) => <tr key={item.id}><td>#{item.id}</td><td><span className="aec-code"><b>{item.chart_of_account_code}</b><i>{item.expense_type_code}</i><em>{item.expense_category_code}</em></span></td><td>{item.expense_type}</td><td><strong>{item.expense_category_name}</strong></td></tr>)}
                {!loading && !visibleCategories.length && <tr><td colSpan="4" className="aec-empty"><AddCircleOutlineRoundedIcon /><strong>No expense categories found</strong><span>Add your first category or change the search.</span></td></tr>}
            </tbody></table></div>{loading && <LinearProgress />}
        </section>
    </div></main>;
};

export default AddExpenseCategoryV2;
