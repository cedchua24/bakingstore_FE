import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import ModeOfPaymentPoService from '../OtherService/ModeOfPaymentPoService';
import './CustomerPaymentView.css';
import './CustomerPaymentDay.css';
import './SupplierPaymentView.css';

const localDate = date => {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};
const money = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(value || 0));
const pick = (source, keys, fallback = '') => {
    for (const key of keys) if (source?.[key] !== undefined && source?.[key] !== null) return source[key];
    return fallback;
};
const list = (source, keys) => {
    for (const key of keys) if (Array.isArray(source?.[key])) return source[key];
    return [];
};
const rowDate = row => String(pick(row, ['date', 'payment_date', 'transaction_date', 'created_at'], 'Unknown date')).slice(0, 10);
const prettyDate = date => {
    if (date === 'Unknown da') return 'Unknown date';
    const parsed = new Date(`${date}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};
const amountOf = row => Number(pick(row, ['amount', 'payment_amount', 'total_amount', 'amount_paid'], 0));

const SupplierPaymentView = () => {
    const { paymentTypePoId } = useParams();
    const now = new Date();
    const [filters, setFilters] = useState({ dateFrom: localDate(new Date(now.getFullYear(), now.getMonth(), 1)), dateTo: localDate(now) });
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const load = async () => {
        if (!filters.dateFrom || !filters.dateTo) return setError('Both dates are required.');
        if (filters.dateFrom > filters.dateTo) return setError('Date from must be on or before date to.');
        setLoading(true); setError('');
        try {
            const response = await ModeOfPaymentPoService.fetchSupplierPaymentTransactionListByDateRange({
                ...filters,
                payment_type_po_id: Number(paymentTypePoId)
            });
            setReport(response.data || {});
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to load supplier payments.');
        } finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const groups = useMemo(() => {
        if (!report) return [];
        const found = Array.isArray(report) ? report : list(report, ['payment_accounts', 'paymentAccounts', 'accounts', 'groups', 'data']);
        return found.filter(group => {
            const account = group.payment_account || group.paymentAccount || group.payment_type_po || group.account || group;
            return String(pick(account, ['id', 'payment_type_po_id', 'paymentTypePoId'], pick(group, ['payment_type_po_id', 'paymentTypePoId']))) === String(paymentTypePoId);
        });
    }, [report, paymentTypePoId]);

    const transactions = groups.flatMap(group => list(group, ['transactions', 'payments', 'data', 'mode_of_payments']));
    const total = groups.reduce((sum, group) => sum + Number(pick(group, ['total_outgoing_payment_amount', 'totalOutgoingPaymentAmount', 'total_amount', 'totalAmount'], list(group, ['transactions', 'payments', 'data', 'mode_of_payments']).reduce((subtotal, row) => subtotal + amountOf(row), 0))), 0);
    const selectedGroup = groups[0] || {};
    const selectedAccount = selectedGroup.payment_account || selectedGroup.paymentAccount || selectedGroup.payment_type_po || selectedGroup.account || {};
    const selectedBank = (!Array.isArray(report?.bank) && report?.bank) || selectedAccount.bank || selectedGroup.bank || {};

    return <main className="customer-payment-page supplier-payment-page">
        <header className="customer-payment-header">
            <div><span>SUPPLIER PAYMENTS · ACCOUNT #{paymentTypePoId}</span><h1>Outgoing payments</h1><p>Supplier payments for this account, separated by payment date.</p></div>
            <Button as={Link} to="/poPaymentType" variant="outline-secondary">Back to accounts</Button>
        </header>
        {Object.keys(selectedBank).length > 0 && <section className="payment-account-highlight supplier-account-highlight">
            <div className="payment-account-highlight-label">SUPPLIER PAYMENT ACCOUNT</div>
            <div className="payment-account-highlight-grid">
                <div><span>Bank name</span><strong>{pick(selectedBank, ['bank_name', 'name'], pick(selectedAccount, ['bank_name', 'bankName'], '—'))}</strong></div>
                <div><span>Account number</span><strong>{pick(selectedBank, ['account_number', 'accountNumber'], pick(selectedAccount, ['account_number', 'accountNumber'], '—'))}</strong></div>
                <div className="payment-account-highlight-main"><span>Account name</span><strong>{pick(selectedBank, ['account_name', 'accountName'], pick(selectedAccount, ['account_name', 'accountName'], '—'))}</strong></div>
                <div><span>Account description</span><strong>{pick(selectedBank, ['account_description', 'accountDescription'], pick(selectedAccount, ['account_description', 'accountDescription'], '—'))}</strong></div>
            </div>
        </section>}
        <section className="customer-payment-filter">
            <Form.Group><Form.Label>Date from</Form.Label><Form.Control type="date" value={filters.dateFrom} onChange={e => setFilters({ ...filters, dateFrom: e.target.value })} /></Form.Group>
            <Form.Group><Form.Label>Date to</Form.Label><Form.Control type="date" value={filters.dateTo} onChange={e => setFilters({ ...filters, dateTo: e.target.value })} /></Form.Group>
            <Button onClick={load} disabled={loading}>{loading ? <><Spinner size="sm" /> Loading</> : 'View payments'}</Button>
        </section>
        {error && <Alert variant="danger">{error}</Alert>}
        {report && <>
            <section className="customer-payment-summary supplier-payment-summary">
                <article><span>Total outgoing</span><strong>{money(total)}</strong></article>
                <article><span>Payments</span><strong>{transactions.length}</strong></article>
            </section>
            {groups.length === 0 ? <div className="customer-payment-empty">No supplier payments found for this account and date range.</div> : groups.map((group, groupIndex) => {
                const account = group.payment_account || group.paymentAccount || group.payment_type_po || group.account || group;
                const rows = list(group, ['transactions', 'payments', 'data', 'mode_of_payments']);
                const days = Object.entries(rows.reduce((result, row) => { const date = rowDate(row); (result[date] ||= []).push(row); return result; }, {})).sort(([a], [b]) => b.localeCompare(a));
                return <section className="customer-payment-account" key={pick(account, ['id'], groupIndex)}>
                    <div className="customer-payment-days">{days.map(([date, dayRows]) => <section className="customer-payment-day" key={date}>
                        <div className="customer-payment-day-head"><div><span>PAYMENT DATE</span><h3>{prettyDate(date)}</h3></div><div><small>{dayRows.length} payment{dayRows.length === 1 ? '' : 's'}</small><strong>{money(dayRows.reduce((sum, row) => sum + amountOf(row), 0))}</strong></div></div>
                        <div className="customer-payment-table-wrap"><table className="table customer-payment-table supplier-payment-table"><thead><tr><th>Supplier order</th><th>Supplier</th><th>Invoice</th><th>Amount</th></tr></thead><tbody>{dayRows.map((row, index) => {
                            const supplier = row.supplier || {};
                            const order = row.order_supplier_transaction || row.orderSupplierTransaction || row.order || {};
                            const orderId = pick(order, ['id', 'order_supplier_transaction_id'], pick(row, ['order_supplier_transaction_id'], ''));
                            return <tr key={pick(row, ['id', 'transaction_id'], index)}>
                                <td>{orderId ? <><Link className="supplier-order-link" to={`/ViewOrder/${orderId}`}>#{orderId}</Link><small>{pick(order, ['status_name', 'reference_number', 'date'])}</small></> : '—'}</td>
                                <td><strong>{pick(supplier, ['supplier_name', 'name'], pick(row, ['supplier_name'], '—'))}</strong><small>{pick(supplier, ['contact_number', 'email', 'address'])}</small></td>
                                <td>{pick(row, ['invoice_number'], pick(order, ['invoice_number'], '—'))}</td>
                                <td className="amount">{money(amountOf(row))}</td>
                            </tr>;
                        })}</tbody></table></div>
                    </section>)}</div>
                </section>;
            })}
        </>}
    </main>;
};

export default SupplierPaymentView;
