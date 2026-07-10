import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import CategoryServiceService from '../Category/CategoryService.service';
import './ProductManagement.css';

const money = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(value || 0));
const formatDate = value => value ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(value)) : 'Not set';

const ProductManagementList = ({ title, description, eyebrow, fetchProducts, mode }) => {
    const [result, setResult] = useState({ data: [], total_value: {} });
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(0);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const load = selectedCategory => {
        setLoading(true);
        fetchProducts(selectedCategory)
            .then(response => setResult(response.data || { data: [] }))
            .catch(error => console.log('error', error))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load(0);
        CategoryServiceService.getAll().then(response => setCategories(response.data || [])).catch(error => console.log('error', error));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const products = Array.isArray(result?.data) ? result.data : (Array.isArray(result) ? result : []);
    const filtered = useMemo(() => {
        const search = query.trim().toLowerCase();
        if (!search) return products;
        return products.filter(product => [product.id, product.product_name, product.category_name, product.brand_name, product.note, product.packaging]
            .some(value => String(value ?? '').toLowerCase().includes(search)));
    }, [products, query]);
    const totalValue = products.reduce((sum, product) => sum + Number(product.price || 0) * Number(product.stock || 0), 0);

    return (
        <main className="pm-page">
            <section className="pm-hero">
                <div className="pm-hero__icon"><Inventory2OutlinedIcon /></div>
                <div><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>
                <div className="pm-hero__stats"><strong>{products.length}</strong><span>Products</span><strong>{money(totalValue)}</strong><span>Inventory value</span></div>
            </section>

            <section className="pm-toolbar">
                <FormControl size="small" className="pm-category">
                    <InputLabel>Category</InputLabel>
                    <Select value={categoryId} label="Category" onChange={event => setCategoryId(event.target.value)}>
                        <MenuItem value={0}>All categories</MenuItem>
                        {categories.map(category => <MenuItem key={category.id} value={category.id}>{category.category_name}</MenuItem>)}
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={() => load(categoryId)} disabled={loading}>Apply filter</Button>
                <TextField
                    size="small" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search products..."
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }}
                />
                {loading && <LinearProgress className="pm-progress" />}
            </section>

            <section className="pm-card">
                <header><div><h2>{title}</h2><p>{filtered.length} {filtered.length === 1 ? 'record' : 'records'} found</p></div></header>
                <div className="table-responsive">
                    <table className="pm-table">
                        <thead><tr><th>Product</th><th>Classification</th><th>Price</th><th>Inventory</th><th>Status</th><th>{mode === 'expiration' ? 'Expiration' : 'Note'}</th><th></th></tr></thead>
                        <tbody>
                            {filtered.map(product => {
                                const expiringSoon = mode === 'expiration' && product.expiration && result.today && new Date(product.expiration) <= new Date(new Date(result.today).getTime() + 90 * 86400000);
                                return <tr key={product.id}>
                                    <td><div className="pm-product"><strong>{product.product_name}</strong><span>#{product.id} · {product.packaging || 'No packaging'}</span></div></td>
                                    <td><span className="pm-category-pill">{product.category_name || 'Uncategorized'}</span><small>{product.brand_name || 'No brand'}</small></td>
                                    <td><strong>{money(product.price)}</strong><small>{product.quantity === 1 ? `${product.weight}${product.variation || ''}` : `${product.quantity} × ${product.weight / product.quantity}${product.variation || ''}`}</small></td>
                                    <td><div className="pm-stock"><span><b>{product.stock ?? 0}</b> wholesale</span><span><b>{product.stock_pc ?? 0}</b> pieces</span><small>{money(Number(product.price || 0) * Number(product.stock || 0))} value</small></div></td>
                                    <td><span className={`pm-status ${product.disabled === 0 ? 'pm-status--active' : 'pm-status--disabled'}`}>{product.disabled === 0 ? 'Active' : 'Disabled'}</span></td>
                                    <td>{mode === 'expiration' ? <span className={expiringSoon ? 'pm-expiration pm-expiration--soon' : 'pm-expiration'}>{formatDate(product.expiration)}</span> : <span className="pm-note">{product.note || 'No note'}</span>}</td>
                                    <td><Link className="pm-action" to={mode === 'expiration' ? `/expirationEditList/${product.id}` : `/editProduct/${product.id}`}>{mode === 'expiration' ? <EventOutlinedIcon /> : <EditOutlinedIcon />}{mode === 'expiration' ? 'Manage' : 'Update'}</Link></td>
                                </tr>;
                            })}
                            {!filtered.length && <tr><td colSpan="7"><div className="pm-empty"><Inventory2OutlinedIcon /><strong>No products found</strong><span>Try another category or search term.</span></div></td></tr>}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
};

export default ProductManagementList;
