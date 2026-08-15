import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import ProductServiceService from "../Product/ProductService.service";
import './ViewStockTransactionList.css';

const normalizeTransactions = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
};

const formatLabel = (value) => String(value || 'Not specified')
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, letter => letter.toUpperCase());

const formatDate = (value) => {
    if (!value) return { date: 'Date unavailable', time: '' };

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return { date: value, time: '' };

    return {
        date: new Intl.DateTimeFormat('en-PH', {
            month: 'short', day: 'numeric', year: 'numeric'
        }).format(parsed),
        time: new Intl.DateTimeFormat('en-PH', {
            hour: 'numeric', minute: '2-digit'
        }).format(parsed)
    };
};

const ViewStockTransactionList = () => {
    const { id } = useParams();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError('');

        ProductServiceService.fetchById(id)
            .then(response => {
                if (active) setTransactions(normalizeTransactions(response.data));
            })
            .catch(() => {
                if (active) setError('We could not load this stock history. Please try again.');
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => { active = false; };
    }, [id]);

    const filteredTransactions = useMemo(() => {
        const search = query.trim().toLowerCase();
        if (!search) return transactions;

        return transactions.filter(transaction => [
            transaction.id,
            transaction.product_name,
            transaction.stock_type,
            transaction.pack,
            transaction.stock_reason,
            transaction.stock,
            transaction.updated_at
        ].some(value => String(value ?? '').toLowerCase().includes(search)));
    }, [query, transactions]);

    const productName = transactions[0]?.product_name || `Product #${id}`;

    return (
        <main className="stock-history-page">
            <Link className="stock-history-back" to="/addStock">
                <ArrowBackRoundedIcon /> Back to stock list
            </Link>

            <section className="stock-history-hero">
                <div className="stock-history-hero__icon"><HistoryRoundedIcon /></div>
                <div className="stock-history-hero__copy">
                    <span>Inventory activity</span>
                    <h1>Modify History</h1>
                    <p>Review every recorded stock movement for <strong>{productName}</strong>.</p>
                </div>
                <div className="stock-history-hero__stat">
                    <SwapVertRoundedIcon />
                    <div><strong>{transactions.length}</strong><span>Total transactions</span></div>
                </div>
            </section>

            <section className="stock-history-card">
                <header className="stock-history-card__header">
                    <div>
                        <h2>Transaction log</h2>
                        <p>{filteredTransactions.length} {filteredTransactions.length === 1 ? 'record' : 'records'} shown</p>
                    </div>
                    <label className="stock-history-search">
                        <SearchRoundedIcon />
                        <input
                            type="search"
                            value={query}
                            onChange={event => setQuery(event.target.value)}
                            placeholder="Search transactions"
                            aria-label="Search stock transactions"
                        />
                    </label>
                </header>

                {loading ? (
                    <div className="stock-history-state">
                        <span className="stock-history-loader" />
                        <h3>Loading stock history</h3>
                        <p>Fetching the latest transaction records.</p>
                    </div>
                ) : error ? (
                    <div className="stock-history-state stock-history-state--error">
                        <HistoryRoundedIcon />
                        <h3>Unable to load transactions</h3>
                        <p>{error}</p>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="stock-history-state">
                        <Inventory2OutlinedIcon />
                        <h3>{query ? 'No matching transactions' : 'No transactions yet'}</h3>
                        <p>{query ? 'Try a different product name, type, or reason.' : 'Stock changes for this product will appear here.'}</p>
                    </div>
                ) : (
                    <div className="stock-history-table-wrap">
                        <table className="stock-history-table">
                            <thead>
                                <tr>
                                    <th>Transaction</th>
                                    <th>Product</th>
                                    <th>Stock unit</th>
                                    <th>Type</th>
                                    <th>Reason</th>
                                    <th>Stock balance</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((transaction, index) => {
                                    const timestamp = formatDate(transaction.updated_at);
                                    return (
                                        <tr key={transaction.id ?? `${transaction.updated_at}-${index}`}>
                                            <td><span className="stock-history-id">#{transaction.id ?? '—'}</span></td>
                                            <td><strong className="stock-history-product">{transaction.product_name || 'Unnamed product'}</strong></td>
                                            <td><span className="stock-history-unit">{formatLabel(transaction.pack)}</span></td>
                                            <td><span className="stock-history-type">{formatLabel(transaction.stock_type)}</span></td>
                                            <td><span className="stock-history-reason">{transaction.stock_reason || 'No reason provided'}</span></td>
                                            <td><strong className="stock-history-balance">{transaction.stock ?? '—'}</strong></td>
                                            <td><span className="stock-history-date"><strong>{timestamp.date}</strong><small>{timestamp.time}</small></span></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
};

export default ViewStockTransactionList;
