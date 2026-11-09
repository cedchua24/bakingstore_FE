import React, { useEffect, useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import moment from "moment";
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import { formatPaymentLabel } from "./shopOrderPaymentHelpers";
import "./AwaitingCompletionTransactionList.css";

const emptyResult = {
    total_transactions: 0,
    total_payments: 0,
    potential_total_sales: 0,
    potential_total_profit: 0,
    total_paid: 0,
    total_outstanding_balance: 0,
    data: [],
};

const money = (value) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
}).format(Number(value) || 0);

const safeDate = (value) => (
    value && moment(value).isValid() ? moment(value).format("MMM DD, YYYY") : "—"
);

const transactionTotal = (transaction) => Number(
    transaction.shop_order_transaction_total_price ??
    transaction.total_price ??
    transaction.total
) || 0;

const paidTotal = (transaction) => Number(
    transaction.total_paid ??
    transaction.paid_amount ??
    transaction.amount_paid
) || 0;

const outstandingTotal = (transaction) => {
    const suppliedBalance = transaction.outstanding_balance ??
        transaction.total_outstanding_balance ??
        transaction.balance;

    return suppliedBalance != null
        ? Math.max(Number(suppliedBalance) || 0, 0)
        : Math.max(transactionTotal(transaction) - paidTotal(transaction), 0);
};

const getPayments = (transaction) => {
    if (Array.isArray(transaction.mode_of_payment)) return transaction.mode_of_payment;
    if (Array.isArray(transaction.payments)) return transaction.payments;
    if (Array.isArray(transaction.payment_history)) return transaction.payment_history;
    return [];
};

const AwaitingCompletionTransactionList = () => {
    const [searchParams] = useSearchParams();
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";
    const [result, setResult] = useState(emptyResult);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!dateFrom || !dateTo) {
            setError("A start date and end date are required to load incomplete transactions.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        ShopOrderTransactionService.fetchOnlineShopOrderTransactionAwaitingCompletionV2({
            dateFrom,
            dateTo,
        })
            .then((response) => setResult({
                ...emptyResult,
                ...(response.data || {}),
                data: Array.isArray(response.data?.data) ? response.data.data : [],
            }))
            .catch((requestError) => {
                setResult(emptyResult);
                setError(
                    requestError.response?.data?.message ||
                    "Unable to load transactions awaiting completion."
                );
            })
            .finally(() => setLoading(false));
    }, [dateFrom, dateTo]);

    const visibleTransactions = useMemo(() => {
        const transactions = Array.isArray(result.data) ? result.data : [];
        const query = search.trim().toLowerCase();
        if (!query) return transactions;

        return transactions.filter((transaction) => {
            const paymentText = getPayments(transaction)
                .map((payment) => [
                    formatPaymentLabel(payment),
                    payment.amount,
                    payment.paid_amount,
                    payment.payment_date,
                    payment.date,
                ].join(" "))
                .join(" ");

            return [
                transaction.id,
                transaction.shop_name,
                transaction.requestor_name,
                transaction.customer_name,
                transaction.store_name,
                transaction.customer_type,
                transaction.date,
                transactionTotal(transaction),
                paidTotal(transaction),
                outstandingTotal(transaction),
                paymentText,
            ].some((value) => String(value ?? "").toLowerCase().includes(query));
        });
    }, [result.data, search]);

    const responseTotal = Number(result.total_transactions) || result.data.length;
    const totalSales = Number(result.potential_total_sales) ||
        result.data.reduce((sum, transaction) => sum + transactionTotal(transaction), 0);
    const totalPaid = Number(result.total_paid) ||
        result.data.reduce((sum, transaction) => sum + paidTotal(transaction), 0);
    const outstanding = Number(result.total_outstanding_balance) ||
        result.data.reduce((sum, transaction) => sum + outstandingTotal(transaction), 0);
    const dateLabel = dateFrom && dateTo
        ? `${moment(dateFrom).format("MMM D, YYYY")} – ${moment(dateTo).format("MMM D, YYYY")}`
        : "Date range unavailable";

    return (
        <main className="awaiting-page">
            <header className="awaiting-hero">
                <div>
                    <p>Payment monitoring</p>
                    <h1>Transactions Awaiting Completion</h1>
                    <span>Online orders dated {dateLabel} that are not yet fully paid</span>
                </div>
                <Button as={Link} to="/reports/reportsList" variant="light">
                    Back to profitability report
                </Button>
            </header>

            {loading && <LinearProgress color="warning" />}
            {error && <div className="awaiting-error" role="alert">{error}</div>}

            {!loading && !error && (
                <>
                    <section className="awaiting-summary" aria-label="Incomplete payment totals">
                        <article>
                            <span>Transactions</span>
                            <strong>{responseTotal.toLocaleString("en-US")}</strong>
                            <small>{Number(result.total_payments) || result.data.reduce((sum, transaction) => sum + (Number(transaction.payment_count) || getPayments(transaction).length), 0)} payments recorded</small>
                        </article>
                        <article>
                            <span>Order value</span>
                            <strong>{money(totalSales)}</strong>
                        </article>
                        <article className="is-paid">
                            <span>Total paid</span>
                            <strong>{money(totalPaid)}</strong>
                        </article>
                        <article className="is-outstanding">
                            <span>Outstanding balance</span>
                            <strong>{money(outstanding)}</strong>
                        </article>
                    </section>

                    <section className="awaiting-card">
                        <div className="awaiting-card-heading">
                            <div>
                                <p>Details</p>
                                <h2>Incomplete Online Order Payments</h2>
                            </div>
                            <div className="awaiting-tools">
                                <Form.Control
                                    type="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search orders..."
                                    aria-label="Search incomplete transactions"
                                />
                                <span>{visibleTransactions.length} records</span>
                            </div>
                        </div>

                        <div className="awaiting-table-wrap">
                            <table className="awaiting-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Shop</th>
                                        <th>Customer</th>
                                        <th>Qty</th>
                                        <th>Order Total</th>
                                        <th>Paid</th>
                                        <th>Outstanding</th>
                                        <th>Payments</th>
                                        <th>Order Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleTransactions.length === 0 ? (
                                        <tr>
                                            <td className="awaiting-empty" colSpan="10">
                                                No incomplete transactions found for this date range.
                                            </td>
                                        </tr>
                                    ) : visibleTransactions.map((transaction) => {
                                        const payments = getPayments(transaction);

                                        return (
                                            <tr key={transaction.id}>
                                                <td>
                                                    <Link
                                                        className="awaiting-order-link"
                                                        to={`/shopOrderTransaction/completedShopOrderTransaction/${transaction.id}`}
                                                    >
                                                        #{transaction.id}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <strong>{transaction.shop_name || transaction.shop?.name || "—"}</strong>
                                                    <small>{transaction.customer_type || ""}</small>
                                                </td>
                                                <td>
                                                    <strong>{transaction.requestor_name || transaction.customer_name || "—"}</strong>
                                                    <small>{transaction.store_name || ""}</small>
                                                </td>
                                                <td>{transaction.shop_order_transaction_total_quantity ?? transaction.total_quantity ?? "—"}</td>
                                                <td className="awaiting-money">{money(transactionTotal(transaction))}</td>
                                                <td className="awaiting-money is-paid">{money(paidTotal(transaction))}</td>
                                                <td className="awaiting-money is-outstanding">{money(outstandingTotal(transaction))}</td>
                                                <td>
                                                    <div className="awaiting-payments">
                                                        {payments.length > 0 && (
                                                            <span className="awaiting-payment-count">
                                                                {Number(transaction.payment_count) || payments.length} payment{(Number(transaction.payment_count) || payments.length) === 1 ? "" : "s"}
                                                            </span>
                                                        )}
                                                        {payments.length > 0 ? payments.map((payment, index) => (
                                                            <div key={payment.id || `${transaction.id}-${index}`}>
                                                                <strong className="awaiting-payment__amount">{money(payment.paid_amount ?? payment.amount)}</strong>
                                                                <small className="awaiting-payment__account">
                                                                    <span>Account</span>
                                                                    {formatPaymentLabel(payment) || "Unspecified account"}
                                                                </small>
                                                                {(payment.payment_date || payment.date) && (
                                                                    <small className="awaiting-payment__date">
                                                                        <span aria-hidden="true">▣</span>
                                                                        Paid {safeDate(payment.payment_date || payment.date)}
                                                                    </small>
                                                                )}
                                                            </div>
                                                        )) : <span>No payment recorded</span>}
                                                    </div>
                                                </td>
                                                <td>{safeDate(transaction.date)}</td>
                                                <td>
                                                    <Link
                                                        className="awaiting-view"
                                                        to={`/shopOrderTransaction/completedShopOrderTransaction/${transaction.id}`}
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
            )}
        </main>
    );
};

export default AwaitingCompletionTransactionList;
