import React, { useEffect, useMemo, useState } from "react";

import ProductServiceService from "../Product/ProductService.service";

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import StockSearchBar, { matchesStockSearch } from './StockSearchBar';

import './ModifiedStock.css';

const ModifiedStock = () => {
    const [report, setReport] = useState({ data: [] });
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        ProductServiceService.fetchModifiedStockDaily()
            .then(response => setReport(response.data))
            .catch(fetchError => {
                console.log("error", fetchError);
                setError('Unable to load modified stock records.');
            });
    }, []);

    const records = useMemo(
        () => Array.isArray(report.data) ? report.data : [],
        [report.data]
    );
    const filteredRecords = records.filter(item => matchesStockSearch(item, searchQuery));

    const totals = useMemo(() => records.reduce((summary, record) => {
        const totalCost = Number(record.total_cost || 0);
        if (Number(record.stock || 0) > 0) summary.added += totalCost;
        if (Number(record.stock || 0) < 0) summary.reduced += totalCost;
        summary.net += totalCost;
        return summary;
    }, { added: 0, reduced: 0, net: 0 }), [records]);

    const fetchReport = () => {
        if (!date) {
            setError('Choose a date before searching.');
            return;
        }

        setLoading(true);
        setError('');
        ProductServiceService.fetchModifiedStockDaily(date)
            .then(response => setReport(response.data))
            .catch(fetchError => {
                console.log("error", fetchError);
                setError('Unable to load modified stock records for this date.');
            })
            .finally(() => setLoading(false));
    };

    const formatMoney = (value) => new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2
    }).format(Number(value || 0));

    const formatDate = (value) => {
        if (!value) return 'Not recorded';
        const parsedDate = new Date(value);
        if (Number.isNaN(parsedDate.getTime())) return value;
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: 'numeric',
            minute: '2-digit'
        }).format(parsedDate);
    };

    return (
        <div className="modified-stock-page">
            <section className="modified-stock-hero">
                <div className="modified-stock-hero__icon"><TuneRoundedIcon /></div>
                <div>
                    <span>Inventory audit</span>
                    <h1>Modified Stock</h1>
                    <p>Review manual stock additions and reductions for a selected day.</p>
                </div>
            </section>

            {error && <Alert severity="error" className="modified-stock-alert">{error}</Alert>}

            <section className="modified-stock-summary">
                <div>
                    <span className="modified-stock-summary__icon modified-stock-summary__icon--green">
                        <AddCircleOutlineRoundedIcon />
                    </span>
                    <div><span>Total added</span><strong>{formatMoney(totals.added)}</strong></div>
                </div>
                <div>
                    <span className="modified-stock-summary__icon modified-stock-summary__icon--red">
                        <RemoveCircleOutlineRoundedIcon />
                    </span>
                    <div><span>Total reduced</span><strong>{formatMoney(totals.reduced)}</strong></div>
                </div>
                <div>
                    <span className="modified-stock-summary__icon modified-stock-summary__icon--blue">
                        <AccountBalanceWalletOutlinedIcon />
                    </span>
                    <div><span>Net adjustment</span><strong>{formatMoney(totals.net)}</strong></div>
                </div>
            </section>

            <section className="modified-stock-filter">
                <div>
                    <strong>Report date</strong>
                    <span>Select a day to review its stock adjustments.</span>
                </div>
                <div className="modified-stock-filter__controls">
                    <TextField
                        type="date"
                        size="small"
                        value={date}
                        onChange={event => setDate(event.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <Button
                        variant="contained"
                        disabled={loading}
                        onClick={fetchReport}
                        startIcon={<SearchIcon />}
                        className="modified-stock-search"
                    >
                        {loading ? 'Loading...' : 'Find records'}
                    </Button>
                </div>
                {loading && <LinearProgress className="modified-stock-progress" />}
            </section>

            <StockSearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search adjustment records..." />

            <section className="modified-stock-card">
                <div className="modified-stock-card__header">
                    <div>
                        <h2>Adjustment records</h2>
                        <p>{filteredRecords.length} {filteredRecords.length === 1 ? 'change' : 'changes'} found.</p>
                    </div>
                    <span><CalendarMonthOutlinedIcon />{date || 'Latest report'}</span>
                </div>
                <div className="table-responsive">
                    <table className="modified-stock-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Reason</th>
                                <th>Adjustment</th>
                                <th>Unit price</th>
                                <th>Total impact</th>
                                <th>Date modified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.length > 0 ? filteredRecords.map(record => {
                                const isAddition = Number(record.stock || 0) > 0;
                                return (
                                    <tr key={record.id}>
                                        <td>
                                            <div className="modified-stock-product">
                                                <div>
                                                    <strong>{record.product_name}</strong>
                                                    <small>#{record.id} · {record.brand_name || 'No brand'}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="modified-stock-reason">{record.stock_reason || 'No reason provided'}</span></td>
                                        <td>
                                            <span className={isAddition ? 'modified-stock-quantity modified-stock-quantity--added' : 'modified-stock-quantity modified-stock-quantity--reduced'}>
                                                {isAddition ? '+' : ''}{record.stock} {record.pack}
                                            </span>
                                        </td>
                                        <td>{formatMoney(record.price)}</td>
                                        <td>
                                            <strong className={isAddition ? 'modified-stock-impact--added' : 'modified-stock-impact--reduced'}>
                                                {formatMoney(record.total_cost)}
                                            </strong>
                                        </td>
                                        <td><span className="modified-stock-date">{formatDate(record.updated_at)}</span></td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="6">
                                        <div className="modified-stock-empty">
                                            <Inventory2OutlinedIcon />
                                            <h3>No stock modifications</h3>
                                            <p>No manual adjustments were recorded for this report.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default ModifiedStock;
