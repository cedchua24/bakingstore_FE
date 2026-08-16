import React, { useEffect, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import ShopOrderTransactionService from '../ShopOrderTransaction/ShopOrderTransactionService';
import SupplierService from '../Supplier/SupplierService.service';
import './ProductReport.css';

const money = value => new Intl.NumberFormat('en-PH', { style:'currency', currency:'PHP' }).format(Number(value || 0));

const ReportProductSorted = () => {
    const role = localStorage.getItem('role_as');
    const [filters, setFilters] = useState({ status:0, limit:0, type:'', supplier_id:'', dateFrom:'', dateTo:'' });
    const [suppliers, setSuppliers] = useState([]);
    const [report, setReport] = useState({ data:[], id:0 });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');

    useEffect(() => {
        ShopOrderTransactionService.fetchSortedProductReport(filters).then(response => setReport(response.data || {data:[]})).catch(error => console.log('error', error));
        SupplierService.getAll().then(response => setSuppliers(response.data || [])).catch(error => console.log('error', error));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const update = event => {
        const { name, value } = event.target;
        setFilters({...filters,[name]:value});
        if (value) setErrors(current => ({...current,[name]:undefined}));
    };
    const runReport = () => {
        const next = {...(!filters.type&&{type:'Required'}),...(!filters.status&&{status:'Required'}),...(!filters.limit&&{limit:'Required'}),...(!filters.dateFrom&&{dateFrom:'Required'}),...(!filters.dateTo&&{dateTo:'Required'})};
        setErrors(next); if(Object.keys(next).length) return;
        setLoading(true); ShopOrderTransactionService.fetchSortedProductReport(filters).then(response => setReport(response.data || {data:[]})).catch(error => console.log('error',error)).finally(()=>setLoading(false));
    };
    const records = Array.isArray(report.data) ? report.data : [];
    const filtered = useMemo(()=>{const q=query.trim().toLowerCase();return q?records.filter(item=>[item.id,item.product_name,item.business_type,item.packaging].some(value=>String(value??'').toLowerCase().includes(q))):records;},[records,query]);
    const sales = records.reduce((sum,item)=>sum+Number(item.total_price||0),0);
    const profit = records.reduce((sum,item)=>sum+Number(item.total_profit||0),0);
    const units = records.reduce((sum,item)=>sum+Number(item.total_quantity||0),0);
    const soldLabel = item => Number(item.total_quantity||0)<Number(item.quantity||0)?`${item.total_quantity} Pc`:`${Math.floor(Number(item.total_quantity||0)/Number(item.quantity||1))} ${item.packaging||'packs'} / ${item.total_quantity} Pc`;

    return <main className="pr-page">
        <section className="pr-hero"><div className="pr-hero__icon"><LeaderboardOutlinedIcon /></div><div><span>Sales performance</span><h1>Product Sales Ranking</h1><p>Rank products by quantity or sales amount across a selected reporting period.</p></div></section>
        <section className="pr-summary"><div><PaymentsOutlinedIcon/><div><span>Total sales</span><strong>{money(sales)}</strong></div></div>{role==='2'&&<div><TrendingUpRoundedIcon/><div><span>Total profit</span><strong>{money(profit)}</strong></div></div>}<div><Inventory2OutlinedIcon/><div><span>Pieces sold</span><strong>{units.toLocaleString()}</strong></div></div></section>
        <section className="pr-filter"><div className="pr-filter__header"><strong>Report filters</strong><span>Configure ranking, sales type, supplier, and reporting period.</span></div><div className="pr-filter__grid">
            <div><FormControl fullWidth size="small" error={Boolean(errors.type)}><InputLabel>Type *</InputLabel><Select name="type" value={filters.type} label="Type *" onChange={update}><MenuItem value="All">All</MenuItem><MenuItem value="WHOLESALE">Wholesale</MenuItem><MenuItem value="RETAIL">Retail</MenuItem></Select></FormControl>{errors.type&&<p className="pr-filter__error">Type is required</p>}</div>
            <div><FormControl fullWidth size="small"><InputLabel>Rank by</InputLabel><Select name="status" value={filters.status} label="Rank by" onChange={update}><MenuItem value={1}>Quantity: highest first</MenuItem><MenuItem value={2}>Quantity: lowest first</MenuItem><MenuItem value={3}>Amount: highest first</MenuItem><MenuItem value={4}>Amount: lowest first</MenuItem></Select></FormControl>{errors.status&&<p className="pr-filter__error">Ranking is required</p>}</div>
            <div><FormControl fullWidth size="small"><InputLabel>Limit</InputLabel><Select name="limit" value={filters.limit} label="Limit" onChange={update}>{[10,50,100,200,500].map(value=><MenuItem key={value} value={value}>{value} products</MenuItem>)}</Select></FormControl>{errors.limit&&<p className="pr-filter__error">Limit is required</p>}</div>
            <FormControl size="small"><InputLabel>Supplier</InputLabel><Select name="supplier_id" value={filters.supplier_id} label="Supplier" onChange={update}><MenuItem value="">All suppliers</MenuItem>{suppliers.map(item=><MenuItem key={item.id} value={item.id}>{item.supplier_name}</MenuItem>)}</Select></FormControl>
            <div><TextField fullWidth size="small" type="date" name="dateFrom" value={filters.dateFrom} onChange={update} label="Date from" InputLabelProps={{shrink:true}}/>{errors.dateFrom&&<p className="pr-filter__error">Date from is required</p>}</div>
            <div><TextField fullWidth size="small" type="date" name="dateTo" value={filters.dateTo} onChange={update} label="Date to" InputLabelProps={{shrink:true}}/>{errors.dateTo&&<p className="pr-filter__error">Date to is required</p>}</div>
            <Button variant="contained" onClick={runReport} disabled={loading}>Run report</Button>
        </div>{loading&&<LinearProgress className="pr-progress"/>}</section>
        <section className="pr-card"><header><div><h2>Ranked products</h2><p>{filtered.length} results in this report</p></div><TextField className="pr-search" size="small" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search report..." InputProps={{startAdornment:<InputAdornment position="start"><SearchRoundedIcon/></InputAdornment>}}/></header><div className="table-responsive"><table className="pr-table"><thead><tr><th>Rank</th><th>Product</th><th>Type</th><th>Sales amount</th>{role==='2'&&<th>Profit</th>}<th>Wholesale qty</th><th>Retail qty</th><th>Total sold</th><th>Current stock</th><th>Difference</th></tr></thead><tbody>
            {filtered.map((item,index)=>{const difference=Number(item.stock||0)-Math.floor(Number(item.total_quantity||0)/Number(item.quantity||1));return <tr key={item.mark_up_product_id||item.id||index}><td><span className="pr-rank">{index+1}</span></td><td><div className="pr-product"><strong>{item.product_name}</strong><span>#{item.id}</span></div></td><td><span className="pr-pill">{item.business_type||'ALL'}</span></td><td className="pr-money">{money(item.total_price)}</td>{role==='2'&&<td className="pr-money">{money(item.total_profit)}</td>}<td>{Number(item.total_quantity||0)<Number(item.quantity||0)?'—':Math.floor(Number(item.total_quantity||0)/Number(item.quantity||1))}</td><td>{item.total_quantity??0}</td><td><strong>{soldLabel(item)}</strong></td><td>{item.stock??0} {item.packaging}</td><td className={difference<0?'pr-negative':''}>{item.business_type==='ALL'?difference:'—'}</td></tr>})}
            {!filtered.length&&<tr><td colSpan={role==='2'?10:9}><div className="pr-empty"><LeaderboardOutlinedIcon/><strong>No ranked products found</strong><span>Configure the report filters and try again.</span></div></td></tr>}
        </tbody></table></div></section>
    </main>;
};
export default ReportProductSorted;
