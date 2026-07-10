import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Modal from '@mui/material/Modal';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import OrderSupplierService from '../OrderSupplierTransaction/OrderSupplierServiceService';
import ProductServiceService from './ProductService.service';
import './ProductManagement.css';

const formatDate = value => value ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(new Date(value)) : 'Not set';
const money = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(value || 0));

const ExpirationEditList = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({ product_name: '', price: 0 });
    const [records, setRecords] = useState([]);
    const [selected, setSelected] = useState({ id: 0, enable: 0, expiration: '', price: 0 });
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const loadRecords = () => ProductServiceService.fetchOrderSupplierExpirationList(id)
        .then(response => setRecords(Array.isArray(response.data) ? response.data : []))
        .catch(error => console.log('error', error));

    useEffect(() => {
        ProductServiceService.get(id).then(response => setProduct(response.data)).catch(error => console.log('error', error));
        loadRecords();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const editRecord = recordId => {
        OrderSupplierService.fetchOrderBySupplierId(recordId).then(response => {
            setSelected(response.data);
            setOpen(true);
        }).catch(error => console.log('error', error));
    };

    const updateRecord = () => {
        setLoading(true);
        OrderSupplierService.setToActiveExpiration(selected).then(() => {
            setOpen(false);
            setSuccess(true);
            loadRecords();
        }).catch(error => console.log(error)).finally(() => setLoading(false));
    };

    return <main className="pm-page">
        <section className="pm-hero">
            <div className="pm-hero__icon"><EventOutlinedIcon /></div>
            <div><span>Shelf-life monitoring</span><h1>Expiration History</h1><p>Manage expiration batches and choose which record is currently active.</p></div>
            <div className="pm-hero__stats"><strong>{records.length}</strong><span>Expiration records</span><strong>{records.filter(record => record.enable === 1).length}</strong><span>Active</span></div>
        </section>

        {success && <Alert severity="success" onClose={() => setSuccess(false)} sx={{ mt: 2 }}>Expiration record updated successfully.</Alert>}

        <section className="pe-product-card">
            <div><h2>{product.product_name || 'Product'}</h2><p>Product #{id} · Expiration and supplier pricing history</p></div>
            <span className="pe-price">{money(product.price)}</span>
        </section>

        <section className="pm-card">
            <header><div><h2>Expiration records</h2><p>{records.length} {records.length === 1 ? 'batch' : 'batches'} recorded</p></div></header>
            <div className="table-responsive"><table className="pm-table">
                <thead><tr><th>Record</th><th>Expiration date</th><th>Price</th><th>Status</th><th></th></tr></thead>
                <tbody>
                    {records.map(record => <tr key={record.id}>
                        <td><strong>#{record.id}</strong></td>
                        <td><span className="pm-expiration">{formatDate(record.expiration)}</span></td>
                        <td><strong>{money(record.price)}</strong></td>
                        <td><span className={`pm-status ${record.enable === 1 ? 'pm-status--active' : 'pm-status--disabled'}`}>{record.enable === 1 ? 'Active' : 'Inactive'}</span></td>
                        <td><button className="pe-update" type="button" onClick={() => editRecord(record.id)} aria-label={`Edit expiration record ${record.id}`}><EditOutlinedIcon /></button></td>
                    </tr>)}
                    {!records.length && <tr><td colSpan="5"><div className="pm-empty"><Inventory2OutlinedIcon /><strong>No expiration records</strong><span>No supplier batches were found for this product.</span></div></td></tr>}
                </tbody>
            </table></div>
        </section>

        <Modal open={open} onClose={() => setOpen(false)}>
            <Box className="pe-modal">
                <span className="pm-category-pill">Expiration record #{selected.id}</span>
                <h2 style={{ margin: '12px 0 4px' }}>Update active status</h2>
                <p style={{ margin: '0 0 18px', color: '#6f7890', fontSize: '.82rem' }}>{selected.product_name || product.product_name}</p>
                <div className="pe-product-card" style={{ margin: '0 0 14px', padding: 14 }}><div><p>Expiration date</p><strong>{formatDate(selected.expiration)}</strong></div><strong>{money(selected.price)}</strong></div>
                <FormControlLabel control={<Checkbox checked={selected.enable === 1} onChange={event => setSelected({ ...selected, enable: event.target.checked ? 1 : 0 })} />} label="Set as active expiration record" />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={updateRecord} disabled={loading}>{loading ? <CircularProgress size={20} color="inherit" /> : 'Save changes'}</Button>
                </div>
            </Box>
        </Modal>
    </main>;
};

export default ExpirationEditList;
