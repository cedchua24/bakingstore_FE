import React from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Chip from '@mui/material/Chip';
import { centralCustomerPaymentLabel } from './useCentralCustomerPaymentSummaries';

const money = (value) => new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2,
}).format(Number(value || 0));

const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(String(value).replace(' ', 'T'));
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    }).format(date);
};

const uniqueParts = (parts) => parts
    .filter((value) => value !== undefined && value !== null && String(value).trim() !== '')
    .filter((value, index, values) => values.findIndex(
        (candidate) => String(candidate).trim().toLowerCase() === String(value).trim().toLowerCase()
    ) === index);

const legacyLabel = (transaction) => uniqueParts([
    transaction.payment_term,
    transaction.bank_name,
    transaction.account_name,
    transaction.account_number,
]).join(' · ');

const centralRows = (transaction, summaries) => {
    const summary = summaries[String(transaction.id)];
    if (!Array.isArray(summary?.data)) return [];

    return summary.data.flatMap((payment) => (payment.lines || []).map((line) => ({
        key: `central-${payment.id}-${line.id}`,
        source: 'Central Accounting',
        account: centralCustomerPaymentLabel(line),
        amount: line.amount,
        date: payment.payment_date,
        status: payment.status,
        reference: line.reference,
    })));
};

const paymentRows = (transactions, summaries) => transactions.flatMap((transaction) => {
    if (Number(transaction.payment_type_po_id) > 0) {
        return [{
            key: `legacy-${transaction.id}`,
            source: 'Legacy',
            account: legacyLabel(transaction),
            amount: transaction.amount,
            date: transaction.date_received || transaction.expense_date,
            status: Number(transaction.is_received) === 1 ? 'received' : 'pending',
            transactionId: transaction.id,
        }];
    }

    return centralRows(transaction, summaries).map((row) => ({
        ...row,
        transactionId: transaction.id,
    }));
});

const statusColor = (status) => {
    if (status === 'posted' || status === 'received') return 'success';
    if (status === 'voided' || status === 'cancelled') return 'error';
    return 'warning';
};

const ExpensePaymentDetailsDialog = ({
    open,
    onClose,
    title = 'Expense payment details',
    transactions = [],
    summaries = {},
    loading = false,
    error = '',
}) => {
    const rows = paymentRows(transactions, summaries);

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="md" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                {loading && (
                    <div style={{ display: 'grid', minHeight: 150, placeItems: 'center' }}>
                        <CircularProgress size={32} />
                    </div>
                )}

                {!loading && error && <Alert severity="error">{error}</Alert>}

                {!loading && !error && rows.length === 0 && (
                    <Alert severity="info">No payment record is available for the selected expense.</Alert>
                )}

                {!loading && !error && rows.length > 0 && (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: 680, borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    {['Expense', 'Source', 'Payment account', 'Date', 'Amount', 'Status'].map((heading) => (
                                        <th key={heading} style={{ padding: '10px 9px', color: '#68717c', background: '#f3f5f7', fontSize: '.68rem', textAlign: 'left', textTransform: 'uppercase' }}>{heading}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.key}>
                                        <td style={{ padding: '12px 9px', borderBottom: '1px solid #eceef1' }}>#{row.transactionId}</td>
                                        <td style={{ padding: '12px 9px', borderBottom: '1px solid #eceef1' }}><Chip size="small" label={row.source} variant="outlined" /></td>
                                        <td style={{ padding: '12px 9px', borderBottom: '1px solid #eceef1' }}>
                                            {row.account || 'Payment account unavailable'}
                                            {row.reference && <small style={{ display: 'block', marginTop: 3, color: '#858d96' }}>Reference: {row.reference}</small>}
                                        </td>
                                        <td style={{ padding: '12px 9px', borderBottom: '1px solid #eceef1', whiteSpace: 'nowrap' }}>{formatDate(row.date) || '—'}</td>
                                        <td style={{ padding: '12px 9px', borderBottom: '1px solid #eceef1', fontWeight: 750, whiteSpace: 'nowrap' }}>{money(row.amount)}</td>
                                        <td style={{ padding: '12px 9px', borderBottom: '1px solid #eceef1' }}><Chip size="small" color={statusColor(row.status)} label={String(row.status || 'pending').replaceAll('_', ' ')} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExpensePaymentDetailsDialog;
