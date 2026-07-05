import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import OutOfStockService from '../OtherService/OutOfStockService';

import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

import './ViewOutOfStockHistory.css';

const ViewOutOfStockHistory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [history, setHistory] = useState({
        product_name: '',
        data: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        OutOfStockService.fetchOOSbyProductId(id)
            .then(response => setHistory(response.data))
            .catch(fetchError => {
                console.log("error", fetchError);
                setError('Unable to load the out-of-stock history.');
            })
            .finally(() => setLoading(false));
    }, [id]);

    const records = useMemo(
        () => Array.isArray(history.data) ? history.data : [],
        [history.data]
    );

    const latestRecord = useMemo(() => {
        return records.reduce((latest, record) => {
            if (!latest) return record;
            return new Date(record.created_at) > new Date(latest.created_at) ? record : latest;
        }, null);
    }, [records]);

    const formatDate = (date) => {
        if (!date) return 'Not recorded';
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) return 'Not recorded';

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit'
        }).format(parsedDate);
    };

    const formatTime = (date) => {
        if (!date) return '';
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) return '';

        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        }).format(parsedDate);
    };

    return (
        <div className="oos-history-page">
            <button type="button" className="oos-history-back" onClick={() => navigate(-1)}>
                <ArrowBackRoundedIcon /> Back
            </button>

            <section className="oos-history-hero">
                <div className="oos-history-hero__icon">
                    <HistoryRoundedIcon />
                </div>
                <div className="oos-history-hero__copy">
                    <span>Inventory event history</span>
                    <h1>{history.product_name || 'Out-of-Stock History'}</h1>
                    <p>A chronological record of when this product was reported unavailable.</p>
                </div>
                <span className="oos-history-product-id">Product #{id}</span>
            </section>

            {error && <Alert severity="error" className="oos-history-alert">{error}</Alert>}

            <section className="oos-history-summary">
                <div>
                    <span className="oos-history-summary__icon oos-history-summary__icon--red">
                        <ErrorOutlineRoundedIcon />
                    </span>
                    <div>
                        <span>Total events</span>
                        <strong>{records.length}</strong>
                    </div>
                </div>
                <div>
                    <span className="oos-history-summary__icon oos-history-summary__icon--blue">
                        <CalendarMonthOutlinedIcon />
                    </span>
                    <div>
                        <span>Latest event</span>
                        <strong>{latestRecord ? formatDate(latestRecord.created_at) : 'No events'}</strong>
                    </div>
                </div>
            </section>

            <section className="oos-history-card">
                <div className="oos-history-card__header">
                    <div>
                        <h2>History timeline</h2>
                        <p>{records.length} {records.length === 1 ? 'record' : 'records'} found for this product.</p>
                    </div>
                    <span className="oos-history-card__badge"><HistoryRoundedIcon />Event log</span>
                </div>

                {loading ? (
                    <div className="oos-history-loading">
                        <CircularProgress size={30} />
                        <span>Loading history...</span>
                    </div>
                ) : records.length > 0 ? (
                    <div className="oos-history-timeline">
                        {records.map((record, index) => (
                            <article className="oos-history-event" key={record.id}>
                                <div className="oos-history-event__rail">
                                    <span>{index + 1}</span>
                                </div>
                                <div className="oos-history-event__content">
                                    <div className="oos-history-event__title">
                                        <div>
                                            <Inventory2OutlinedIcon />
                                            <strong>Out-of-stock event</strong>
                                        </div>
                                        <span>Record #{record.id}</span>
                                    </div>
                                    <p>{record.comment || 'No comment was provided for this event.'}</p>
                                    <div className="oos-history-event__date">
                                        <CalendarMonthOutlinedIcon />
                                        <span>{formatDate(record.created_at)}</span>
                                        {formatTime(record.created_at) && <small>at {formatTime(record.created_at)}</small>}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="oos-history-empty">
                        <HistoryRoundedIcon />
                        <h3>No out-of-stock history</h3>
                        <p>No out-of-stock events have been recorded for this product.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ViewOutOfStockHistory;
