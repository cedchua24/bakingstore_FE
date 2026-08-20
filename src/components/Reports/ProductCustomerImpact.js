import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ShopOrderTransactionService from '../ShopOrderTransaction/ShopOrderTransactionService';
import './ProductReport.css';

const money = value => Number(value || 0).toLocaleString('en-PH', { style:'currency', currency:'PHP' });
const number = value => Number(value || 0).toLocaleString('en-PH', { maximumFractionDigits:1 });
const pick = (item, keys, fallback=0) => keys.find(key => item?.[key] !== undefined) ? item[keys.find(key => item?.[key] !== undefined)] : fallback;
const periodValues = (item, key) => {
    const period = item?.[key] || {};
    return {
        sales: pick(period, ['sales_amount','average_sales_amount','average_sales','sales','total_sales'], 0),
        quantity: pick(period, ['ordered_quantity','average_ordered_quantity','quantity_sold','average_quantity','quantity'], 0),
        pieces: pick(period, ['pieces_sold','average_pieces_sold','total_pieces'], 0),
    };
};
const quantityLabel = values => Number(values.quantity || 0) > 0 ? `${number(values.quantity)} Box` : `${number(values.pieces)} Pc`;
const ImpactCell = ({ value={} }) => {
    const sales = Number(pick(value,['sales_impact'],0));
    const quantity = Number(pick(value,['quantity_impact'],0));
    const percentage = Number(pick(value,['sales_change_percentage','percentage_change'],0));
    const negative = sales < 0 || quantity < 0;
    return <div className="pci-impact"><strong className={negative?'pr-negative':'pt-positive'}>{sales>0?'+':''}{money(sales)}</strong><span className={negative?'pr-negative':'pt-positive'}>{quantity>0?'+':''}{number(quantity)} Box</span><em className={`pt-change ${percentage<0?'pt-change--down':'pt-change--up'}`}>{percentage>0?'+':''}{number(percentage)}%</em></div>;
};

const ProductCustomerImpact = () => {
    const { productId } = useParams();
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [report, setReport] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const month = params.get('month') || '';

    useEffect(() => {
        ShopOrderTransactionService.fetchMonthlyProductCustomerImpact({ product_id:Number(productId), month, limit:Number(params.get('limit') || 10), type:params.get('type') || 'ALL', category_id:params.get('category_id') || null, supplier_id:params.get('supplier_id') || null })
            .then(response => setReport(response.data?.data && !Array.isArray(response.data.data) ? response.data.data : response.data || {}))
            .catch(err => setError(err.response?.data?.message || 'Unable to load customer impact.'))
            .finally(() => setLoading(false));
    }, [productId, month, params]);

    const groups = [
        ['positive_impact_customers','Positive impact customers','Above their previous 3-month average','positive'],
        ['negative_impact_customers','Negative impact customers','Below their previous 3-month average','negative'],
        ['missing_customers','Missing customers','Previous buyers with no order this month compared with their 3-month average','missing'],
    ];
    const product = report.product || report.product_details || {};
    return <main className="pr-page pci-page">
        {loading&&<LinearProgress/>}<Button startIcon={<ArrowBackRoundedIcon/>} onClick={()=>navigate(-1)}>Back to product trends</Button>
        <section className="pr-hero pci-hero"><div><span>Customer impact · {month}</span><h1>{product.product_name || report.product_name || 'Product customer impact'}</h1><p>Customers who drove growth, reduced purchasing, or stopped ordering in the selected month.</p></div></section>
        {error&&<div className="alert alert-danger">{error}</div>}
        {!loading&&!error&&<div className="pci-benchmark-note"><strong>Primary impact benchmark</strong><span>Customer impact groups are classified against the previous 3-month average. Last month is shown as secondary context.</span></div>}
        {!loading&&!error&&groups.map(([key,title,subtitle,tone])=>{const rows=Array.isArray(report[key])?report[key]:[];return <section className={`pci-card pci-card--${tone}`} key={key}><header><h2>{title}</h2><p>{subtitle} · {rows.length} customers</p></header><div className="table-responsive"><table className="pr-table pci-table"><thead><tr><th>Customer</th><th>Status</th><th className="pci-current-col">Current month</th><th>Last month</th><th>Previous 3-month average</th><th>Vs last month</th><th>Vs 3-month average</th></tr></thead><tbody>
            {rows.map((item,index)=>{const current=periodValues(item,'current_month');const lastMonth=periodValues(item,'last_month');const average=periodValues(item,'previous_three_month_average');return <tr key={item.customer_id||index}><td><div className="pr-product"><strong>{pick(item,['customer_name','name'],'Unknown customer')}</strong><span>{pick(item,['store_name','business_name'],'No store name')}</span></div></td><td><span className={`pci-status pci-status--${String(item.status||tone).toLowerCase()}`}>{item.status||tone}</span></td><td className="pci-current-cell"><strong>{money(current.sales)}</strong><span className="pci-qty">{quantityLabel(current)}</span></td><td><strong>{money(lastMonth.sales)}</strong><span className="pci-qty">{quantityLabel(lastMonth)}</span></td><td><strong>{money(average.sales)}</strong><span className="pci-qty">{quantityLabel(average)}</span></td><td><ImpactCell value={item.vs_last_month}/></td><td><ImpactCell value={item.vs_previous_three_month_average}/></td></tr>})}
            {!rows.length&&<tr><td colSpan="7"><div className="pr-empty"><strong>No customers in this group</strong></div></td></tr>}
        </tbody></table></div></section>})}
    </main>;
};
export default ProductCustomerImpact;
