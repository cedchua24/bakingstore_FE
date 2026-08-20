import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import ShopOrderTransactionService from '../ShopOrderTransaction/ShopOrderTransactionService';
import './CustomerPaymentView.css';
import './CustomerPaymentDay.css';

const inputDate = (date) => {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const money = (value) => new Intl.NumberFormat('en-PH', {
    style: 'currency', currency: 'PHP', minimumFractionDigits: 2
}).format(Number(value || 0));

const valueOf = (source, keys, fallback = 0) => {
    for (const key of keys) if (source?.[key] !== undefined && source?.[key] !== null) return source[key];
    return fallback;
};

const transactionDate = (row) => String(valueOf(row, ['date', 'transaction_date', 'created_at'], 'Unknown date')).slice(0, 10);

const displayDate = (date) => {
    if (date === 'Unknown da') return 'Unknown date';
    const parsed = new Date(`${date}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString('en-PH', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
};

const arrayOf = (source, keys) => {
    for (const key of keys) if (Array.isArray(source?.[key])) return source[key];
    return [];
};

const CustomerPaymentView = () => {
    const { paymentTypePoId } = useParams();
    const now = new Date();
    const [filters, setFilters] = useState({
        dateFrom: inputDate(new Date(now.getFullYear(), now.getMonth(), 1)),
        dateTo: inputDate(now),
        is_paid: ''
    });
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadReport = async () => {
        if (!filters.dateFrom || !filters.dateTo) return setError('Both dates are required.');
        if (filters.dateFrom > filters.dateTo) return setError('Date from must be on or before date to.');
        setLoading(true);
        setError('');
        try {
            const request = {
                dateFrom: filters.dateFrom,
                dateTo: filters.dateTo,
                payment_type_po_id: Number(paymentTypePoId),
                ...(filters.is_paid !== '' && { is_paid: Number(filters.is_paid) })
            };
            const response = await ShopOrderTransactionService.fetchOnlineShopOrderTransactionListByDateRangeV2(request);
            setReport(response.data || {});
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to load customer payments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadReport(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const groups = useMemo(() => {
        if (!report) return [];
        const reportGroups = Array.isArray(report)
            ? report
            : arrayOf(report, ['payment_accounts', 'paymentAccounts', 'accounts', 'groups', 'data']);
        return reportGroups.filter(group => {
            const account = group.payment_account || group.paymentAccount || group.payment_type_po || group.account || group;
            const groupId = valueOf(account, ['id', 'payment_type_po_id', 'paymentTypePoId'], valueOf(group, ['payment_type_po_id', 'paymentTypePoId'], null));
            return String(groupId) === String(paymentTypePoId);
        });
    }, [report, paymentTypePoId]);

    const allTransactions = groups.flatMap(group => arrayOf(group, ['transactions', 'orders', 'data', 'shop_order_transactions']));
    const transactionAmount = row => Number(valueOf(row, ['incoming_amount', 'amount', 'paid_amount', 'total_paid', 'shop_order_transaction_total_price'], 0));
    const isPaidTransaction = row => {
        const paid = valueOf(row, ['is_paid', 'isPaid', 'paid'], null);
        return Number(paid) === 1;
    };
    const totals = {
        incoming: groups.reduce((sum, group) => sum + Number(valueOf(group, ['total_incoming_amount', 'totalIncomingAmount', 'total_amount', 'totalAmount'], arrayOf(group, ['transactions', 'orders', 'data', 'shop_order_transactions']).reduce((amount, row) => amount + transactionAmount(row), 0))), 0),
        paid: groups.reduce((sum, group) => sum + Number(valueOf(group, ['total_paid', 'totalPaid', 'paid_total', 'paidTotal'], arrayOf(group, ['transactions', 'orders', 'data', 'shop_order_transactions']).filter(isPaidTransaction).reduce((amount, row) => amount + transactionAmount(row), 0))), 0),
        unpaid: groups.reduce((sum, group) => sum + Number(valueOf(group, ['total_unpaid', 'totalUnpaid', 'unpaid_total', 'unpaidTotal'], arrayOf(group, ['transactions', 'orders', 'data', 'shop_order_transactions']).filter(row => !isPaidTransaction(row)).reduce((amount, row) => amount + transactionAmount(row), 0))), 0),
        transactions: allTransactions.length,
        accounts: groups.length
    };
    const selectedGroup = groups[0] || {};
    const selectedAccount = selectedGroup.payment_account || selectedGroup.paymentAccount || selectedGroup.payment_type_po || selectedGroup.account || {};
    const selectedBank = (!Array.isArray(report?.bank) && report?.bank) || selectedAccount.bank || selectedGroup.bank || {};

    return (
        <main className="customer-payment-page">
            <header className="customer-payment-header">
                <div><span>CUSTOMER PAYMENTS · ACCOUNT #{paymentTypePoId}</span><h1>Incoming payments</h1><p>Payments for this account within an inclusive date range.</p></div>
                <Button as={Link} to="/poPaymentType" variant="outline-secondary">Back to accounts</Button>
            </header>

            {Object.keys(selectedBank).length > 0 && <section className="payment-account-highlight customer-account-highlight">
                <div className="payment-account-highlight-label">CUSTOMER PAYMENT ACCOUNT</div>
                <div className="payment-account-highlight-grid">
                    <div><span>Bank name</span><strong>{valueOf(selectedBank, ['bank_name', 'name'], valueOf(selectedAccount, ['bank_name', 'bankName'], '—'))}</strong></div>
                    <div><span>Account number</span><strong>{valueOf(selectedBank, ['account_number', 'accountNumber'], valueOf(selectedAccount, ['account_number', 'accountNumber'], '—'))}</strong></div>
                    <div className="payment-account-highlight-main"><span>Account name</span><strong>{valueOf(selectedBank, ['account_name', 'accountName'], valueOf(selectedAccount, ['account_name', 'accountName'], '—'))}</strong></div>
                    <div><span>Account description</span><strong>{valueOf(selectedBank, ['account_description', 'accountDescription'], valueOf(selectedAccount, ['account_description', 'accountDescription'], '—'))}</strong></div>
                </div>
            </section>}

            <section className="customer-payment-filter">
                <Form.Group><Form.Label>Date from</Form.Label><Form.Control type="date" value={filters.dateFrom} onChange={e => setFilters({ ...filters, dateFrom: e.target.value })} /></Form.Group>
                <Form.Group><Form.Label>Date to</Form.Label><Form.Control type="date" value={filters.dateTo} onChange={e => setFilters({ ...filters, dateTo: e.target.value })} /></Form.Group>
                <Form.Group><Form.Label>Confirmation (optional)</Form.Label><Form.Select value={filters.is_paid} onChange={e => setFilters({ ...filters, is_paid: e.target.value })}>
                    <option value="">All confirmations</option>
                    <option value="1">Confirmed</option>
                    <option value="0">Unconfirmed</option>
                </Form.Select></Form.Group>
                <Button onClick={loadReport} disabled={loading}>{loading ? <><Spinner size="sm" /> Loading</> : 'View payments'}</Button>
            </section>

            {error && <Alert variant="danger">{error}</Alert>}
            {report && <>
                <section className="customer-payment-summary">
                    <article><span>Total incoming</span><strong>{money(totals.incoming)}</strong></article>
                    <article><span>Confirmed</span><strong className="confirmed">{money(totals.paid)}</strong></article>
                    <article><span>Unconfirmed</span><strong className="unconfirmed">{money(totals.unpaid)}</strong></article>
                    <article><span>Transactions</span><strong>{totals.transactions}</strong></article>
                    <article><span>Payment accounts</span><strong>{totals.accounts}</strong></article>
                </section>

                {groups.length === 0 ? <div className="customer-payment-empty">No customer payments found for this date range.</div> : groups.map((group, groupIndex) => {
                    const transactions = arrayOf(group, ['transactions', 'orders', 'data', 'shop_order_transactions']);
                    const account = group.payment_account || group.paymentAccount || group.payment_type_po || group.account || group;
                    const dailyGroups = Object.entries(transactions.reduce((days, row) => {
                        const date = transactionDate(row);
                        if (!days[date]) days[date] = [];
                        days[date].push(row);
                        return days;
                    }, {})).sort(([dateA], [dateB]) => dateB.localeCompare(dateA));
                    return <section className="customer-payment-account" key={account.id || group.payment_type_po_id || groupIndex}>
                        <div className="customer-payment-days">{dailyGroups.map(([date, dayTransactions]) => <section className="customer-payment-day" key={date}>
                            <div className="customer-payment-day-head">
                                <div><span>PAYMENT DATE</span><h3>{displayDate(date)}</h3></div>
                                <div><small>{dayTransactions.length} transaction{dayTransactions.length === 1 ? '' : 's'}</small><strong>{money(dayTransactions.reduce((sum, row) => sum + transactionAmount(row), 0))}</strong></div>
                            </div>
                            <div className="customer-payment-table-wrap"><table className="table customer-payment-table">
                            <thead><tr><th>Order</th><th>Customer</th><th>Confirmation</th><th>Amount</th></tr></thead>
                            <tbody>{dayTransactions.map((row, index) => {
                                const customer = row.customer || row.requestor || {};
                                const order = row.order || row.shop_order_transaction || {};
                                const orderId = valueOf(order, ['id', 'order_id', 'shop_order_transaction_id'], valueOf(row, ['order_id', 'shop_order_transaction_id'], ''));
                                const confirmed = Number(valueOf(row, ['is_paid', 'isPaid', 'paid'], 0)) === 1;
                                return <tr key={row.id || row.transaction_id || index}>
                                    <td>{orderId ? <Link className="customer-order-link" to={`/shopOrderTransaction/completedShopOrderTransaction/${orderId}`}>#{orderId}</Link> : '—'}</td>
                                    <td><strong>{valueOf(customer, ['name', 'customer_name', 'requestor_name'], valueOf(row, ['customer_name', 'requestor_name'], '—'))}</strong><small>{valueOf(customer, ['store_name', 'email', 'contact_number'], '')}</small></td>
                                    <td><span className={`payment-status ${confirmed ? 'confirmed' : 'unconfirmed'}`}>{confirmed ? '✓ Confirmed' : '✕ Unconfirmed'}</span></td>
                                    <td className="amount">{money(valueOf(row, ['incoming_amount', 'amount', 'paid_amount', 'total_paid', 'shop_order_transaction_total_price']))}</td>
                                </tr>;
                            })}</tbody>
                            </table></div>
                        </section>)}</div>
                    </section>;
                })}
            </>}
        </main>
    );
};

export default CustomerPaymentView;
