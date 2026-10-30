import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CentralCustomerPaymentService from './CentralCustomerPaymentService';
import { ACCOUNTING_TOKEN_KEY } from './accountingApi';
import './RefundTransactionList.css';

const money = (value) => new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
}).format(Number(value || 0));

const displayDate = (value) => {
    if (!value) return '—';
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
};

const RefundTransactionList = () => {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState({ date_from: '', date_to: '' });

    const loadRefunds = useCallback((requestFilters = {}) => {
        setLoading(true);
        setError('');

        if (!localStorage.getItem(ACCOUNTING_TOKEN_KEY)) {
            setRefunds([]);
            setError('Connect Central Accounting first to load the refund queue.');
            setLoading(false);
            return Promise.resolve();
        }

        if (requestFilters.date_from && requestFilters.date_to && requestFilters.date_from > requestFilters.date_to) {
            setRefunds([]);
            setError('The date from must be before or equal to the date to.');
            setLoading(false);
            return Promise.resolve();
        }

        return CentralCustomerPaymentService.refundCandidates(requestFilters)
            .then(setRefunds)
            .catch((requestError) => {
                setRefunds([]);
                setError(requestError.response?.data?.message || 'The Central Accounting refund list could not be loaded. Please try again.');
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadRefunds({});
    }, [loadRefunds]);

    const visibleRefunds = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) return refunds;

        return refunds.filter((refund) => [
            refund.transaction_id,
            refund.date,
            refund.total_amount,
            refund.total_account,
            refund.refund_amount,
        ].some((value) => String(value ?? '').toLowerCase().includes(term)));
    }, [query, refunds]);

    const totals = useMemo(() => refunds.reduce((summary, refund) => ({
        orderAmount: summary.orderAmount + Number(refund.total_amount || 0),
        accountAmount: summary.accountAmount + Number(refund.total_account || 0),
        refundAmount: summary.refundAmount + Number(refund.refund_amount || 0),
    }), { orderAmount: 0, accountAmount: 0, refundAmount: 0 }), [refunds]);

    return (
        <main className="refund-page">
            <section className="refund-hero">
                <div>
                    <span className="refund-kicker">ACCOUNTING</span>
                    <h1>Customer Refunds</h1>
                    <p>Online orders where the received account amount is greater than the order total.</p>
                </div>
                <button className="refund-refresh" type="button" onClick={() => loadRefunds(filters)} disabled={loading}>
                    <RefreshRoundedIcon fontSize="small" />
                    Refresh
                </button>
            </section>

            <section className="refund-summary" aria-label="Refund summary">
                <article>
                    <span>Transactions to refund</span>
                    <strong>{refunds.length}</strong>
                </article>
                <article>
                    <span>Total order amount</span>
                    <strong>{money(totals.orderAmount)}</strong>
                </article>
                <article>
                    <span>Net account after refunds</span>
                    <strong>{money(totals.accountAmount)}</strong>
                </article>
                <article className="refund-summary-due">
                    <span>Total refund due</span>
                    <strong>{money(totals.refundAmount)}</strong>
                </article>
            </section>

            <section className="refund-card">
                <header className="refund-card-header">
                    <div>
                        <span className="refund-kicker">REFUND QUEUE</span>
                        <h2>Overpaid online orders</h2>
                    </div>
                    <form className="refund-filters" onSubmit={(event) => { event.preventDefault(); loadRefunds(filters); }}>
                        <label>
                            <span>From</span>
                            <input type="date" value={filters.date_from} onChange={(event) => setFilters((current) => ({ ...current, date_from: event.target.value }))} />
                        </label>
                        <label>
                            <span>To</span>
                            <input type="date" value={filters.date_to} onChange={(event) => setFilters((current) => ({ ...current, date_to: event.target.value }))} />
                        </label>
                        <button type="submit" disabled={loading}>Apply</button>
                        <button type="button" className="refund-clear" disabled={loading} onClick={() => { const emptyFilters = { date_from: '', date_to: '' }; setFilters(emptyFilters); loadRefunds(emptyFilters); }}>All dates</button>
                    </form>
                    <label className="refund-search">
                        <SearchRoundedIcon fontSize="small" />
                        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search transaction or date" aria-label="Search refunds" />
                    </label>
                </header>

                {error && <Alert severity="error" className="refund-alert">{error}</Alert>}

                {loading ? (
                    <div className="refund-loading"><CircularProgress size={34} /><span>Loading refunds…</span></div>
                ) : (
                    <div className="refund-table-wrap">
                        <table className="refund-table">
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Date</th>
                                    <th>Total amount</th>
                                    <th>Total account</th>
                                    <th>Refund amount</th>
                                    <th aria-label="Actions"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleRefunds.length === 0 ? (
                                    <tr>
                                        <td className="refund-empty" colSpan="6">
                                            {query ? 'No refunds match your search.' : 'No online-order refunds are currently needed.'}
                                        </td>
                                    </tr>
                                ) : visibleRefunds.map((refund) => (
                                    <tr key={refund.transaction_id}>
                                        <td>
                                            <strong>#{refund.transaction_id}</strong>
                                            <span className="refund-needed-badge">Refund needed</span>
                                        </td>
                                        <td>{displayDate(refund.date)}</td>
                                        <td>{money(refund.total_amount)}</td>
                                        <td>{money(refund.total_account)}</td>
                                        <td className="refund-amount">{money(refund.refund_amount)}</td>
                                        <td>
                                            <Link
                                                className="refund-view-link"
                                                to={`/shopOrderTransaction/completedShopOrderTransaction/${refund.transaction_id}`}
                                                aria-label={`View transaction ${refund.transaction_id}`}
                                            >
                                                <VisibilityOutlinedIcon fontSize="small" />
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
};

export default RefundTransactionList;
