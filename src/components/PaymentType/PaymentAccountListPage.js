import React, { useEffect, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import PaymentTypePoService from '../OtherService/PaymentTypePoService';
import PoPaymentTypeList from './PoPaymentTypeList';
import './PoPaymentType.css';

const PaymentAccountListPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        PaymentTypePoService.getAll()
            .then(response => setAccounts(Array.isArray(response.data) ? response.data : []))
            .catch(requestError => setError(requestError.response?.data?.message || 'Unable to load payment accounts.'))
            .finally(() => setLoading(false));
    }, []);

    return <main className="po-payment-page payment-account-list-page">
        <header className="po-payment-page-header">
            <div>
                <span>PAYMENT SETTINGS</span>
                <h1>Payment Account List</h1>
                <p>View supplier and customer payment accounts and their transaction history.</p>
            </div>
            <div className="po-payment-record-count">{accounts.length} accounts</div>
        </header>

        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? <div className="payment-account-list-loading"><Spinner animation="border" /><span>Loading payment accounts…</span></div> :
            <section className="po-payment-card">
                <PoPaymentTypeList paymentTypeList={accounts} deletePaymentType={() => {}} />
            </section>}
    </main>;
};

export default PaymentAccountListPage;
