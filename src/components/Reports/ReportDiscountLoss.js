import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DiscountService from "../OtherService/DiscountService";
import "./ReportDiscountLoss.css";

const money = (value) => new Intl.NumberFormat('en-PH', {
    style: 'currency', currency: 'PHP',
}).format(Number(value) || 0);
const rowMoney = (value) => value === undefined || value === null ? '—' : money(value);

const rowDiscountTotal = (row) => row.so_discount_amount == null || row.shop_order_quantity == null
    ? null
    : Number(row.so_discount_amount) * Number(row.shop_order_quantity);

const currentMonthRange = () => {
    const today = new Date();
    const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    return {
        dateFrom: `${month}-01`,
        dateTo: `${month}-${String(today.getDate()).padStart(2, '0')}`,
    };
};

const ReportDiscountLoss = () => {
    const [report, setReport] = useState({ data: [], total_amount: 0 });
    const [initialDates] = useState(currentMonthRange);
    const [dates, setDates] = useState(initialDates);
    const [period, setPeriod] = useState(`${initialDates.dateFrom} — ${initialDates.dateTo}`);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [validation, setValidation] = useState('');

    useEffect(() => {
        let active = true;
        DiscountService.fetchDiscountLossReport(initialDates)
            .then(({ data }) => { if (active) setReport(data || { data: [] }); })
            .catch(() => { if (active) setError('Unable to load the report. Please try again.'); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [initialDates]);

    const generate = async (event) => {
        event.preventDefault();
        if (!dates.dateFrom || !dates.dateTo) {
            setValidation('Choose both a start date and an end date.');
            return;
        }
        if (dates.dateFrom > dates.dateTo) {
            setValidation('The end date must be on or after the start date.');
            return;
        }
        setValidation('');
        setError('');
        setLoading(true);
        try {
            const { data } = await DiscountService.fetchDiscountLossReport(dates);
            setReport(data || { data: [] });
            setPeriod(`${dates.dateFrom} — ${dates.dateTo}`);
        } catch {
            setError('Unable to update the report. The previous results are still shown. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const rows = Array.isArray(report.data) ? report.data : [];
    const totalPrice = rows.reduce((total, row) => total + (Number(row.shop_order_total_price) || 0), 0);
    const hasPrices = rows.every(row => row.shop_order_total_price !== undefined && row.shop_order_total_price !== null);
    const totalDiscount = rows.reduce((total, row) => total + (rowDiscountTotal(row) || 0), 0);
    const totalLoss = report.total_amount ?? rows.reduce((total, row) => total + (Number(row.loss_amount) || 0), 0);

    return (
        <main className="discount-loss-report" aria-busy={loading}>
            <header className="dlr-header">
                <div><p className="dlr-eyebrow">Reports / Discounts</p><h1>Discount loss report</h1>
                    <p>Review discounted sales and their impact on your business.</p></div>
                <div className="dlr-period"><span>Reporting period</span><strong>{period}</strong></div>
            </header>
            <form className="dlr-filters" onSubmit={generate}>
                <div><label htmlFor="discount-date-from">From</label><input id="discount-date-from" type="date" value={dates.dateFrom} disabled={loading}
                    onChange={event => setDates({ ...dates, dateFrom: event.target.value })} /></div>
                <div><label htmlFor="discount-date-to">To</label><input id="discount-date-to" type="date" value={dates.dateTo} disabled={loading}
                    onChange={event => setDates({ ...dates, dateTo: event.target.value })} /></div>
                <button type="submit" disabled={loading}>{loading ? 'Loading report…' : 'Generate report'}</button>
                {validation && <p className="dlr-error" role="alert">{validation}</p>}
            </form>
            {error && <p className="dlr-error dlr-alert" role="alert">{error}</p>}
            <section className="dlr-metrics" aria-label="Report totals">
                <article className="dlr-metric-primary"><span>Total discounts</span><strong>{money(totalDiscount)}</strong><small>Total discount given across all listed units</small></article>
                <article><span>Order total after discount</span><strong>{hasPrices ? money(totalPrice) : '—'}</strong><small>{hasPrices ? 'Sum of order total prices in this report' : 'Some order prices are unavailable'}</small></article>
                <article className="dlr-metric-loss"><span>Total loss amount</span><strong>{money(totalLoss)}</strong><small>For the reporting period</small></article>
                <article><span>Report items</span><strong>{rows.length.toLocaleString()}</strong><small>Discounted item entries</small></article>
            </section>
            <section className="dlr-details" aria-labelledby="discount-items-title">
                <div className="dlr-table-heading"><div><h2 id="discount-items-title">Discounted items</h2><p>Discount amounts first, with per-item pricing, order totals, and losses for context.</p></div><span>{rows.length} items</span></div>
                {loading && <p role="status" className="dlr-status">Loading report…</p>}
                <div className="dlr-table-scroll" tabIndex="0" role="region" aria-label="Discounted items table">
                    <table>
                        <thead><tr>
                            <th scope="col">Product / date</th>
                            <th scope="col" className="dlr-number dlr-discount-heading">Discount amount<small>All units</small></th>
                            <th scope="col" className="dlr-number">Qty</th>
                            <th scope="col" className="dlr-number">Capital price<small>Per item</small></th>
                            <th scope="col" className="dlr-number">Price / item<small>Original → discounted</small></th>
                            <th scope="col" className="dlr-number">Order total<small>After discount</small></th>
                            <th scope="col" className="dlr-number">Loss<small>All units</small></th>
                            <th scope="col">Details</th>
                        </tr></thead>
                        <tbody>{rows.map((row, index) => <tr key={`${row.id}-${index}`}>
                            <td className="dlr-product"><strong>{row.product_name}</strong><small>#{row.id} · {row.business_type || '—'}</small><small className="dlr-product-date">{row.date || '—'}</small></td>
                            <td className="dlr-number dlr-discount"><strong>{rowMoney(rowDiscountTotal(row))}</strong><small>{rowMoney(row.so_discount_amount)} / item</small><span className="dlr-badge">{row.discount === 'PERCENTAGE' ? 'Percentage' : row.discount === 'AMOUNT' ? 'Fixed amount' : row.discount || '—'}</span></td>
                            <td className="dlr-number">{row.shop_order_quantity}</td>
                            <td className="dlr-number">{rowMoney(row.capital_price)}</td>
                            <td className="dlr-number dlr-srp">
                                <span className="dlr-srp-original"><span className="dlr-srp-label">Original: </span><s>{rowMoney(row.new_price)}</s></span>
                                <strong><span aria-hidden="true">→ </span><span className="dlr-srp-label">Current: </span>{rowMoney(row.shop_order_price)}</strong>
                            </td>
                            <td className="dlr-number dlr-price">{rowMoney(row.shop_order_total_price)}</td>
                            <td className="dlr-number dlr-loss">{rowMoney(row.loss_amount)}</td>
                            <td><Link className="dlr-view" to={`../shopOrderTransaction/completedShopOrderTransaction/${row.transaction_id}`} aria-label={`View transaction for ${row.product_name}`} title="View transaction"><VisibilityOutlinedIcon fontSize="small" /></Link></td>
                        </tr>)}
                        {!loading && !error && rows.length === 0 && <tr><td colSpan="8" className="dlr-empty"><strong>No discounted items found</strong><span>Try another date range to see more results.</span></td></tr>}
                        </tbody>
                    </table>
                </div>
                <p className="dlr-footnote">Price / item shows the original price → current order price per item. Total discount = discount per item × quantity. Order totals, total discounts, and losses cover all units in the row. — means the price is unavailable.</p>
            </section>
        </main>
    );
};

export default ReportDiscountLoss;
