import React, { useState } from "react";
import { Link } from "react-router-dom";
import MarkUpPriceService from "./MarkUpPriceService.service";

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';

const MarkUpPriceList = ({
    markupPriceList,
    onUpdated,
    replacementProductPrice,
    replacementPiecesPerPack,
    v2RequiredProductIds = []
}) => {
    const records = Array.isArray(markupPriceList) ? markupPriceList : [];
    const productGroups = Array.from(records.reduce((groups, record) => {
        const productKey = record.product_id ?? `record-${record.id}`;

        if (!groups.has(productKey)) {
            groups.set(productKey, {
                productId: record.product_id,
                productName: record.product_name,
                records: []
            });
        }

        groups.get(productKey).records.push(record);
        return groups;
    }, new Map()).values());
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [pairedMarkups, setPairedMarkups] = useState([]);
    const [markup, setMarkup] = useState({
        id: 0,
        price: 0,
        product_name: '',
        mark_up_option: '',
        mark_up_price: 0,
        new_price: 0,
        profit: 0
    });

    const formatMoney = value => new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2
    }).format(Number(value || 0));

    const getVariantLabel = record => record.business_type === 'WHOLESALE'
        ? `${record.weight / Math.max(record.quantity, 1)}${record.variation || ''} × ${record.quantity} ${record.packaging || ''}`
        : `${Number(record.weight / Math.max(record.quantity, 1)).toPrecision(2)}${record.variation || ''}`;

    const applyReplacementCost = record => {
        if (replacementProductPrice == null) return record;

        const newBasePrice = record.business_type === "RETAIL"
            ? Number(replacementProductPrice) / Math.max(Number(replacementPiecesPerPack || 1), 1)
            : Number(replacementProductPrice);
        const adjustment = Number(record.mark_up_price || 0);
        const profit = record.mark_up_option === "PERCENTAGE"
            ? newBasePrice / 100 * adjustment
            : adjustment;

        return { ...record, price: newBasePrice, profit, new_price: newBasePrice + profit };
    };

    const openEditor = (id, groupRecords = []) => {
        setLoading(true);
        setMessage('');
        const pairedRecords = replacementProductPrice != null && groupRecords.length > 1
            ? groupRecords
            : [];

        if (pairedRecords.length) {
            Promise.all(pairedRecords.map(record => MarkUpPriceService.get(record.id)))
                .then(responses => {
                    setPairedMarkups(responses.map(response => applyReplacementCost(response.data)));
                    setOpen(true);
                })
                .catch(error => console.log("error", error))
                .finally(() => setLoading(false));
            return;
        }

        MarkUpPriceService.get(id)
            .then(response => {
                setPairedMarkups([]);
                setMarkup(applyReplacementCost(response.data));
                setOpen(true);
            })
            .catch(error => console.log("error", error))
            .finally(() => setLoading(false));
    };

    const changeOption = value => {
        setMarkup(current => ({
            ...current,
            mark_up_option: value,
            mark_up_price: 0,
            profit: 0,
            new_price: current.price
        }));
    };

    const changeAdjustment = value => {
        const adjustment = Number(value || 0);
        const profit = markup.mark_up_option === 'PERCENTAGE'
            ? (Number(markup.price || 0) / 100) * adjustment
            : adjustment;
        setMarkup(current => ({
            ...current,
            mark_up_price: adjustment,
            profit,
            new_price: Number(current.price || 0) + profit
        }));
    };

    const changePairedAdjustment = (id, value) => {
        setPairedMarkups(current => current.map(record => {
            if (record.id !== id) return record;
            const adjustment = Number(value || 0);
            const profit = record.mark_up_option === 'PERCENTAGE'
                ? Number(record.price || 0) / 100 * adjustment
                : adjustment;
            return { ...record, mark_up_price: adjustment, profit, new_price: Number(record.price || 0) + profit };
        }));
    };

    const saveUpdate = () => {
        setLoading(true);
        const replacements = pairedMarkups.length ? pairedMarkups : [markup];
        Promise.all(replacements.map(record => MarkUpPriceService.replace(record)))
            .then(response => {
                const failedResponse = response.find(item => item.data?.code === 400);
                if (failedResponse) {
                    setMessage(failedResponse.data.message || 'Unable to replace these prices.');
                    return;
                }
                setOpen(false);
                onUpdated?.();
            })
            .catch(error => {
                console.log(error);
                const responseMessage = error.response?.data?.message;
                const validationMessage = error.response?.data?.errors
                    ? Object.values(error.response.data.errors).flat()[0]
                    : null;
                setMessage(validationMessage || responseMessage || 'Unable to replace this price.');
            })
            .finally(() => setLoading(false));
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(450px, calc(100vw - 28px))',
        bgcolor: 'background.paper',
        borderRadius: '14px',
        boxShadow: 24,
        p: 3
    };

    return (
        <section className="markup-list-card">
            <div className="markup-list-card__header">
                <div>
                    <h2>Price records</h2>
                    <p>{productGroups.length} product{productGroups.length === 1 ? '' : 's'} · {records.length} wholesale and retail configurations.</p>
                </div>
                <span><PriceChangeOutlinedIcon />Current pricing</span>
            </div>
            <div className="table-responsive">
                <table className="markup-list-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Type</th>
                            <th>Supplier price</th>
                            <th>Markup</th>
                            <th>Profit</th>
                            <th>Selling price</th>
                            <th aria-label="Actions"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length > 0 ? productGroups.map(group => group.records.map((record, recordIndex) => {
                            const requiresV2 = v2RequiredProductIds.includes(Number(record.product_id));
                            return (
                            <tr key={record.id} className={recordIndex === 0 ? 'markup-list-group-start' : ''}>
                                {recordIndex === 0 && (
                                <td rowSpan={group.records.length} className="markup-list-product-cell">
                                    <div className="markup-list-product">
                                        <span>{record.product_name ? record.product_name.charAt(0).toUpperCase() : '?'}</span>
                                        <div>
                                            <strong>{record.product_name}</strong>
                                            <small className="markup-list-group-meta">
                                                Product #{group.productId || record.id} · {group.records.length} configuration{group.records.length === 1 ? '' : 's'}
                                            </small>
                                            <small>#{record.id} · {record.business_type === 'WHOLESALE'
                                                ? `${record.weight / Math.max(record.quantity, 1)}${record.variation} × ${record.quantity} ${record.packaging || ''}`
                                                : `${Number(record.weight / Math.max(record.quantity, 1)).toPrecision(2)}${record.variation}`}</small>
                                        </div>
                                    </div>
                                </td>
                                )}
                                <td>
                                    <div className="markup-list-type">
                                        <span className={`markup-type markup-type--${String(record.business_type || 'wholesale').toLowerCase()}`}>
                                            {record.business_type || 'WHOLESALE'}
                                        </span>
                                        <small>{getVariantLabel(record)}</small>
                                    </div>
                                </td>
                                <td>{formatMoney(record.price)}</td>
                                <td>
                                    <strong>{record.mark_up_option === 'PERCENTAGE'
                                        ? `${record.mark_up_price}%`
                                        : formatMoney(record.mark_up_price)}</strong>
                                </td>
                                <td><span className="markup-profit">+ {formatMoney(Number(record.new_price) - Number(record.price))}</span></td>
                                <td><strong className="markup-selling-price">{formatMoney(record.new_price)}</strong></td>
                                <td className="markup-list-actions">
                                    {requiresV2 ? (
                                        <Link className="markup-list-v2-action" to={`/markUpNewPriceV2?product_id=${record.product_id}`}>
                                            <PriceChangeOutlinedIcon />Review price change
                                        </Link>
                                    ) : (
                                        <button type="button" onClick={() => openEditor(record.id, group.records)}><EditOutlinedIcon />Edit</button>
                                    )}
                                    <Link to={"../viewMarkUpHistory/" + record.product_id}><HistoryRoundedIcon />History</Link>
                                </td>
                            </tr>
                            );
                        })) : (
                            <tr>
                                <td colSpan="8">
                                    <div className="markup-list-empty">
                                        <PriceChangeOutlinedIcon />
                                        <h3>No markup prices found</h3>
                                        <p>Create a markup price to see it here.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={modalStyle}>
                    <div className="markup-modal__header">
                        <span><EditOutlinedIcon /></span>
                        <div><h2>Update markup price</h2><p>The current record will be disabled and a new active record will be created.</p></div>
                    </div>
                    {message && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}
                    {loading && <CircularProgress size={25} className="markup-modal__spinner" />}
                    <div className="markup-modal__fields">
                        {pairedMarkups.length ? pairedMarkups.map(record => (
                            <Box key={record.id} sx={{ display: 'grid', gap: 1.25, p: 1.5, border: '1px solid #e5e7eb', borderRadius: 2 }}>
                                <strong>{record.business_type}</strong>
                                <TextField fullWidth disabled label="Supplier price" value={formatMoney(record.price)} />
                                <TextField
                                    fullWidth
                                    type="number"
                                    label={record.mark_up_option === 'PERCENTAGE' ? 'Markup percentage' : 'Markup amount'}
                                    value={record.mark_up_price || ''}
                                    onChange={event => changePairedAdjustment(record.id, event.target.value)}
                                    InputProps={{
                                        startAdornment: record.mark_up_option === 'AMOUNT'
                                            ? <InputAdornment position="start">₱</InputAdornment>
                                            : undefined,
                                        endAdornment: record.mark_up_option === 'PERCENTAGE'
                                            ? <InputAdornment position="end">%</InputAdornment>
                                            : undefined
                                    }}
                                />
                                <div className="markup-modal__result">
                                    <span>New selling price</span><strong>{formatMoney(record.new_price)}</strong>
                                </div>
                            </Box>
                        )) : <>
                        <TextField fullWidth disabled label="Product" value={markup.product_name || ''} />
                        <TextField fullWidth disabled label="Supplier price" value={formatMoney(markup.price)} />
                        <TextField
                            select
                            fullWidth
                            label="Markup method"
                            value={markup.mark_up_option || ''}
                            onChange={event => changeOption(event.target.value)}
                        >
                            <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                            <MenuItem value="AMOUNT">Fixed amount</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            type="number"
                            label={markup.mark_up_option === 'PERCENTAGE' ? 'Markup percentage' : 'Markup amount'}
                            value={markup.mark_up_price || ''}
                            onChange={event => changeAdjustment(event.target.value)}
                            InputProps={{
                                startAdornment: markup.mark_up_option === 'AMOUNT'
                                    ? <InputAdornment position="start">₱</InputAdornment>
                                    : undefined,
                                endAdornment: markup.mark_up_option === 'PERCENTAGE'
                                    ? <InputAdornment position="end">%</InputAdornment>
                                    : undefined
                            }}
                        />
                        <div className="markup-modal__result">
                            <span>New selling price</span><strong>{formatMoney(markup.new_price)}</strong>
                        </div>
                        </>}
                    </div>
                    <div className="markup-modal__actions">
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            disabled={loading || (pairedMarkups.length
                                ? pairedMarkups.some(record => Number(record.mark_up_price) <= 0)
                                : Number(markup.mark_up_price) <= 0)}
                            onClick={saveUpdate}
                        >
                            {pairedMarkups.length ? 'Replace both markups' : 'Replace markup'}
                        </Button>
                    </div>
                </Box>
            </Modal>
        </section>
    );
};

export default MarkUpPriceList;
