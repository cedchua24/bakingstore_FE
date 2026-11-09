import React, { useEffect, useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import moment from "moment";
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import { formatPaymentLabel } from "./shopOrderPaymentHelpers";
import "./OutsidePeriodPaymentList.css";

const emptyResult = {
    total_transactions: 0,
    total_unique_transactions: 0,
    total_payments: 0,
    total_paid: 0,
    data: [],
};

const money = (value) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
}).format(Number(value) || 0);

const safeDate = (value) => (
    value && moment(value).isValid() ? moment(value).format("MMM DD, YYYY") : "—"
);

const orderTotal = (transaction) => Number(
    transaction.shop_order_transaction_total_price ??
    transaction.total_price ??
    transaction.order_total
) || 0;

const paymentAmount = (transaction) => Number(
    transaction.amount_received ??
    transaction.payment_amount ??
    transaction.paid_amount ??
    transaction.amount
) || 0;

const getPayments = (transaction) => {
    if (Array.isArray(transaction.mode_of_payment)) return transaction.mode_of_payment;
    if (Array.isArray(transaction.payments)) return transaction.payments;
    if (Array.isArray(transaction.payment_history)) return transaction.payment_history;
    if (transaction.payment && typeof transaction.payment === "object") return [transaction.payment];
    if (transaction.payment_method && typeof transaction.payment_method === "object") return [transaction.payment_method];
    return [];
};

const OutsidePeriodPaymentList = () => {
    const [searchParams] = useSearchParams();
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";
    const [result, setResult] = useState(emptyResult);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!dateFrom || !dateTo) {
            setError("A start date and end date are required to load outside-period payments.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        ShopOrderTransactionService.fetchOnlineShopOrderTransactionPaidOutsidePeriodV2({
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
                    "Unable to load payments from orders outside the selected period."
                );
            })
            .finally(() => setLoading(false));
    }, [dateFrom, dateTo]);

    const getPlacement = (transaction) => {
        const suppliedPlacement = transaction.order_period_position ??
            transaction.period_position ??
            transaction.outside_period_position;
        if (suppliedPlacement) return String(suppliedPlacement);
        if (!transaction.date || !dateFrom || !dateTo) return "Outside period";
        return moment(transaction.date).isBefore(moment(dateFrom), "day")
            ? "Before period"
            : "After period";
    };

    const visiblePayments = useMemo(() => {
        const rows = Array.isArray(result.data) ? result.data : [];
        const query = search.trim().toLowerCase();
        if (!query) return rows;

        return rows.filter((transaction) => [
            transaction.id,
            transaction.shop_order_transaction_id,
            transaction.shop_name,
            transaction.requestor_name,
            transaction.customer_name,
            transaction.store_name,
            transaction.date,
            transaction.payment_date,
            paymentAmount(transaction),
            getPayments(transaction).map((payment) => [
                formatPaymentLabel(payment),
                payment.amount,
                payment.paid_amount,
                payment.payment_date,
                payment.date,
            ].join(" ")).join(" "),
            getPlacement(transaction),
        ].some((value) => String(value ?? "").toLowerCase().includes(query)));
    }, [result.data, search, dateFrom, dateTo]);

    const dateEntryCount = Number(result.total_transaction_payment_dates) ||
        result.data.reduce((sum, row) => sum + Math.max(
            Array.isArray(row.payment_dates) ? row.payment_dates.length : 0,
            1
        ), 0);
    const uniqueCount = Number(result.total_transactions) ||
        Number(result.total_unique_transactions) ||
        new Set(result.data.map((row) => row.shop_order_transaction_id || row.id)).size;
    const paymentCount = Number(result.total_payments) || result.data.reduce(
        (sum, row) => sum + (Number(row.payment_count) || getPayments(row).length),
        0
    );
    const paidTotal = Number(result.total_paid) ||
        result.data.reduce((sum, row) => sum + paymentAmount(row), 0);
    const dateLabel = dateFrom && dateTo
        ? `${moment(dateFrom).format("MMM D, YYYY")} – ${moment(dateTo).format("MMM D, YYYY")}`
        : "Date range unavailable";

    return (
        <main className="outside-payment-page">
            <header className="outside-payment-hero">
                <div>
                    <p>Payment-date audit</p>
                    <h1>Orders Placed Outside Period</h1>
                    <span>Payments received {dateLabel} for orders created outside those dates</span>
                </div>
                <Button as={Link} to="/reports/reportSales" variant="light">
                    Back to money received
                </Button>
            </header>

            {loading && <LinearProgress color="warning" />}
            {error && <div className="outside-payment-error" role="alert">{error}</div>}

            {!loading && !error && (
                <>
                    <section className="outside-payment-summary" aria-label="Outside-period payment totals">
                        <article>
                            <span>Transaction / payment-date entries</span>
                            <strong>{dateEntryCount.toLocaleString("en-US")}</strong>
                            <small>Count displayed by the Money received report</small>
                        </article>
                        <article>
                            <span>Unique orders</span>
                            <strong>{uniqueCount.toLocaleString("en-US")}</strong>
                            <small>An order can have multiple payments</small>
                        </article>
                        <article>
                            <span>Total payments</span>
                            <strong>{paymentCount.toLocaleString("en-US")}</strong>
                            <small>Individual receipts within the period</small>
                        </article>
                        <article className="is-total">
                            <span>Total received</span>
                            <strong>{money(paidTotal)}</strong>
                            <small>Already included in Money received</small>
                        </article>
                    </section>

                    <section className="outside-payment-card">
                        <div className="outside-payment-card-heading">
                            <div>
                                <p>Details</p>
                                <h2>Outside-Period Order Payments</h2>
                            </div>
                            <div className="outside-payment-tools">
                                <Form.Control
                                    type="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search transactions..."
                                    aria-label="Search outside-period payments"
                                />
                                <span>{visiblePayments.length} records</span>
                            </div>
                        </div>

                        <div className="outside-payment-table-wrap">
                            <table className="outside-payment-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Shop</th>
                                        <th>Customer</th>
                                        <th>Order Date</th>
                                        <th>Timing</th>
                                        <th>Payments</th>
                                        <th>Order Total</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visiblePayments.length === 0 ? (
                                        <tr>
                                            <td className="outside-payment-empty" colSpan="8">
                                                No outside-period order payments found for this date range.
                                            </td>
                                        </tr>
                                    ) : visiblePayments.map((transaction, index) => {
                                        const transactionId = transaction.shop_order_transaction_id || transaction.id;
                                        const payments = getPayments(transaction);
                                        const placement = getPlacement(transaction);

                                        return (
                                            <tr key={`${transactionId}-${transaction.payment_id || transaction.payment_date || index}-${index}`}>
                                                <td>
                                                    <Link
                                                        className="outside-payment-order-link"
                                                        to={`/shopOrderTransaction/completedShopOrderTransaction/${transactionId}`}
                                                    >
                                                        #{transactionId}
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
                                                <td>{safeDate(transaction.date || transaction.order_date)}</td>
                                                <td>
                                                    <span className={`outside-payment-timing ${placement.toLowerCase().includes("before") ? "is-before" : "is-after"}`}>
                                                        {placement}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="outside-payment-list">
                                                        <span className="outside-payment-count">
                                                            {Number(transaction.payment_count) || payments.length} payment{(Number(transaction.payment_count) || payments.length) === 1 ? "" : "s"}
                                                        </span>
                                                        {payments.length > 0 ? payments.map((payment, paymentIndex) => (
                                                            <div className="outside-payment-entry" key={payment.id || `${transactionId}-${payment.payment_date || paymentIndex}-${paymentIndex}`}>
                                                                <strong className="outside-payment-entry__amount">{money(payment.paid_amount ?? payment.amount)}</strong>
                                                                <small className="outside-payment-entry__account">
                                                                    <span>Account</span>
                                                                    {formatPaymentLabel(payment) || "Unspecified account"}
                                                                </small>
                                                                <small className="outside-payment-entry__date">
                                                                    <span aria-hidden="true">▣</span>
                                                                    Paid {safeDate(payment.payment_date || payment.date)}
                                                                </small>
                                                            </div>
                                                        )) : (
                                                            <div className="outside-payment-entry">
                                                                <strong className="outside-payment-entry__amount">{money(paymentAmount(transaction))}</strong>
                                                                <small className="outside-payment-entry__account">
                                                                    <span>Account</span>
                                                                    {transaction.payment_type || "Unspecified account"}
                                                                </small>
                                                                <small className="outside-payment-entry__date">
                                                                    <span aria-hidden="true">▣</span>
                                                                    Paid {safeDate(transaction.payment_date || transaction.paid_at)}
                                                                </small>
                                                            </div>
                                                        )}
                                                        {payments.length > 1 && (
                                                            <div className="outside-payment-total">
                                                                <span>Total paid</span>
                                                                <strong>{money(payments.reduce(
                                                                    (sum, payment) => sum + (Number(payment.paid_amount ?? payment.amount) || 0),
                                                                    0
                                                                ))}</strong>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="outside-payment-money">{money(orderTotal(transaction))}</td>
                                                <td>
                                                    <Link
                                                        className="outside-payment-view"
                                                        to={`/shopOrderTransaction/completedShopOrderTransaction/${transactionId}`}
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

export default OutsidePeriodPaymentList;
