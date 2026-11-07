import React, { useEffect, useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import moment from "moment";
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import { formatPaymentLabel } from "./shopOrderPaymentHelpers";
import "./PaidOutsideTransactionList.css";

const emptyResult = {
    total_transactions: 0,
    total_payments: 0,
    total_paid: 0,
    data: []
};

const PaidOutsideTransactionList = () => {
    const { date } = useParams();
    const [result, setResult] = useState(emptyResult);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        setLoading(true);
        setError("");

        ShopOrderTransactionService.fetchOnlineShopOrderTransactionPaidOutsideDateV2({ date })
            .then((response) => setResult({ ...emptyResult, ...response.data }))
            .catch((requestError) => {
                setResult(emptyResult);
                setError(requestError.response?.data?.message || "Unable to load other-date transactions.");
            })
            .finally(() => setLoading(false));
    }, [date]);

    const money = (value) => new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP"
    }).format(Number(value) || 0);

    const visibleTransactions = useMemo(() => {
        const transactions = Array.isArray(result.data) ? result.data : [];
        const query = search.trim().toLowerCase();
        if (!query) return transactions;

        return transactions.filter((transaction) => [
            transaction.id,
            transaction.requestor_name,
            transaction.store_name,
            transaction.date,
            transaction.payment_date,
            transaction.shop_order_transaction_total_price,
            transaction.paid_amount,
            transaction.payment_timing,
            Array.isArray(transaction.mode_of_payment)
                ? transaction.mode_of_payment.map(formatPaymentLabel).join(" ")
                : ""
        ].some((value) => String(value ?? "").toLowerCase().includes(query)));
    }, [search, result.data]);

    const statusLabel = (status) => {
        if (Number(status) === 1) return "Completed";
        if (Number(status) === 2) return "Pending";
        return "Cancelled";
    };

    const statusClass = (status) => {
        if (Number(status) === 1) return "paid-outside-status is-completed";
        if (Number(status) === 2) return "paid-outside-status is-pending";
        return "paid-outside-status is-cancelled";
    };

    return (
        <main className="paid-outside-page">
            <header className="paid-outside-hero">
                <div>
                    <p>Payment-date report</p>
                    <h1>Other-Date Orders</h1>
                    <span>Orders from another date paid on {moment(date).format("MMMM D, YYYY")}</span>
                </div>
                <Button
                    as={Link}
                    to={`/shopOrderTransaction/customerOrderTransactionList/${date}`}
                    variant="light"
                >
                    Back to order report
                </Button>
            </header>

            {loading && <LinearProgress color="warning" />}
            {error && <div className="paid-outside-error" role="alert">{error}</div>}

            {!loading && !error && (
                <>
                    <section className="paid-outside-summary" aria-label="Other-date payment totals">
                        <article>
                            <span>Transactions</span>
                            <strong>{Number(result.total_transactions) || 0}</strong>
                        </article>
                        <article>
                            <span>Payments</span>
                            <strong>{Number(result.total_payments) || 0}</strong>
                        </article>
                        <article className="is-total">
                            <span>Received on {moment(date).format("MMM D")}</span>
                            <strong>{money(result.total_paid)}</strong>
                        </article>
                    </section>

                    <section className="paid-outside-card">
                        <div className="paid-outside-card-heading">
                            <div>
                                <p>Transaction details</p>
                                <h2>Online Orders Paid on Another Date</h2>
                            </div>
                            <div className="paid-outside-tools">
                                <Form.Control
                                    type="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search transactions..."
                                    aria-label="Search other-date transactions"
                                />
                                <span>{visibleTransactions.length} records</span>
                            </div>
                        </div>

                        <div className="paid-outside-table-wrap">
                            <table className="paid-outside-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Customer</th>
                                        <th>Account / Amount Received</th>
                                        <th>Order Total</th>
                                        <th>Order Date</th>
                                        <th>Payment Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleTransactions.length === 0 ? (
                                        <tr>
                                            <td className="paid-outside-empty" colSpan="8">
                                                No transactions found.
                                            </td>
                                        </tr>
                                    ) : visibleTransactions.map((transaction) => (
                                            <tr key={transaction.id}>
                                                <td><Link className="paid-outside-order-link" to={`/shopOrderTransaction/completedShopOrderTransaction/${transaction.id}`}>#{transaction.id}</Link></td>
                                                <td>
                                                    <strong>{transaction.requestor_name || "-"}</strong>
                                                    <small>{transaction.store_name || ""}</small>
                                                </td>
                                                <td>
                                                    <div className="paid-outside-accounts">
                                                        {Array.isArray(transaction.mode_of_payment) && transaction.mode_of_payment.length > 0
                                                            ? transaction.mode_of_payment.map((payment, index) => (
                                                                <div className="paid-outside-account-entry" key={payment.id || `${transaction.id}-${index}`}>
                                                                    <small>{formatPaymentLabel(payment)}</small>
                                                                    <strong>
                                                                        {payment.paid_amount != null || payment.amount != null
                                                                            ? money(payment.paid_amount ?? payment.amount)
                                                                            : "—"}
                                                                    </strong>
                                                                </div>
                                                            ))
                                                            : (
                                                                <div className="paid-outside-account-entry">
                                                                    <small>Unspecified account</small>
                                                                    <strong>{money(transaction.paid_amount)}</strong>
                                                                </div>
                                                            )}
                                                    </div>
                                                </td>
                                                <td>{money(transaction.shop_order_transaction_total_price)}</td>
                                                <td>{moment(transaction.date).format("MMM DD, YYYY")}</td>
                                                <td>{moment(transaction.payment_date).format("MMM DD, YYYY")}</td>
                                                <td><span className={statusClass(transaction.status)}>{statusLabel(transaction.status)}</span></td>
                                                <td>
                                                    <div className="paid-outside-actions">
                                                        <Link to={`/shopOrderTransaction/completedShopOrderTransaction/${transaction.id}`}>View</Link>
                                                    </div>
                                                </td>
                                            </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
            )}
        </main>
    );
};

export default PaidOutsideTransactionList;
