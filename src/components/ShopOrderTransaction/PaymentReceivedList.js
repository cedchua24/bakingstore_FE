import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import moment from "moment";
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import "./PaymentReceivedList.css";

const emptyReport = {
    total_paid_inside_period: 0,
    total_paid_outside_period: 0,
    total_paid_inside_period_count: 0,
    total_paid_outside_period_count: 0,
    total_received: 0,
    total_post_paid: 0,
    total_paid_outdated: 0,
    paid_inside_period_transactions: [],
    paid_outside_period_transactions: []
};

const PaymentReceivedList = () => {
    const { date } = useParams();
    const [report, setReport] = useState(emptyReport);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        setError("");

        ShopOrderTransactionService.fetchOnlineShopOrderTransactionListV2({ date })
            .then((response) => setReport({ ...emptyReport, ...response.data }))
            .catch((requestError) => {
                setReport(emptyReport);
                setError(requestError.response?.data?.message || "Unable to load payment details.");
            })
            .finally(() => setLoading(false));
    }, [date]);

    const money = (value) => new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP"
    }).format(Number(value) || 0);

    const paidInside = Number(report.total_paid_inside_period) || 0;
    const paidOutside = Number(report.total_paid_outside_period) || 0;
    const insideCount = Number(report.total_paid_inside_period_count) || 0;
    const outsideCount = Number(report.total_paid_outside_period_count) || 0;
    const totalReceived = Number(report.total_received ?? (paidInside + paidOutside)) || 0;
    const totalPostPaid = Number(report.total_post_paid ?? report.total_paid_outdated) || 0;
    const totalPaymentCount = insideCount + outsideCount;

    const paymentGroups = [
        {
            key: "inside",
            title: "Same-Day Transaction Payments",
            description: "Payment date and transaction date are the selected day.",
            count: insideCount,
            transactions: Array.isArray(report.paid_inside_period_transactions)
                ? report.paid_inside_period_transactions
                : []
        },
        {
            key: "outside",
            title: "Other-Date Transaction Payments",
            description: "Paid on the selected day for a transaction dated on another day.",
            count: outsideCount,
            transactions: Array.isArray(report.paid_outside_period_transactions)
                ? report.paid_outside_period_transactions
                : []
        }
    ];

    const statusLabel = (status) => {
        if (Number(status) === 1) return "Completed";
        if (Number(status) === 2) return "Pending";
        return "Cancelled";
    };

    const statusClass = (status) => {
        if (Number(status) === 1) return "payment-received-status is-completed";
        if (Number(status) === 2) return "payment-received-status is-pending";
        return "payment-received-status is-cancelled";
    };

    return (
        <main className="payment-received-page">
            <header className="payment-received-hero">
                <div>
                    <p>Daily collection</p>
                    <h1>Payment Details</h1>
                    <span>{moment(date).format("MMMM D, YYYY")}</span>
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

            {error && <div className="payment-received-error" role="alert">{error}</div>}

            {!loading && !error && (
                <>
                    <section className="payment-received-summary" aria-label="Payment totals">
                        <article>
                            <span>All Payments Received</span>
                            <strong>{money(totalReceived)}</strong>
                            <small>{totalPaymentCount} payment{totalPaymentCount === 1 ? "" : "s"} received on this day</small>
                        </article>
                        <article>
                            <span>Same-Day Orders</span>
                            <strong>{money(paidInside)}</strong>
                            <small>{insideCount} payment{insideCount === 1 ? "" : "s"} · order and payment dates match</small>
                        </article>
                        <article>
                            <span>Other-Date Orders</span>
                            <strong>{money(paidOutside)}</strong>
                            <small>{outsideCount} payment{outsideCount === 1 ? "" : "s"} · paid on this day</small>
                        </article>
                    </section>
                    <p className="payment-received-equation">
                        Total Received = Same-Day Orders + Other-Date Orders paid on the selected day
                    </p>

                    <section className="payment-received-post-paid" aria-label="Post paid total">
                        <div>
                            <span>Collected Later · Post Paid</span>
                            <p>Orders dated {moment(date).format("MMM D, YYYY")} that were paid after that date.</p>
                        </div>
                        <div>
                            <strong>{money(totalPostPaid)}</strong>
                            <small>Not included in Total Received</small>
                        </div>
                    </section>

                    <section className="payment-received-groups">
                        {paymentGroups.map((group) => (
                            <article className="payment-received-card" key={group.key}>
                                <div className="payment-received-card-heading">
                                    <div>
                                        <h2>{group.title}</h2>
                                        <p>{group.description}</p>
                                    </div>
                                    <span>{group.count}</span>
                                </div>

                                {group.transactions.length === 0 ? (
                                    <div className="payment-received-empty">No payments in this group.</div>
                                ) : (
                                    <div className="payment-received-table-wrap">
                                        <table className="payment-received-table">
                                            <thead>
                                                <tr>
                                                    <th>Order</th>
                                                    <th>Transaction Date</th>
                                                    <th>Payment Date</th>
                                                    <th>Status</th>
                                                    <th>Transaction Total</th>
                                                    <th>Paid Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {group.transactions.map((payment, index) => (
                                                    <tr key={`${group.key}-${payment.transaction_id}-${index}`}>
                                                        <td>
                                                            <Link to={`/shopOrderTransaction/completedShopOrderTransaction/${payment.transaction_id}`}>
                                                                #{payment.transaction_id}
                                                            </Link>
                                                        </td>
                                                        <td>{moment(payment.transaction_date).format("MMM DD, YYYY")}</td>
                                                        <td>{moment(payment.payment_date).format("MMM DD, YYYY")}</td>
                                                        <td><span className={statusClass(payment.status)}>{statusLabel(payment.status)}</span></td>
                                                        <td>{money(payment.transaction_total)}</td>
                                                        <td><strong>{money(payment.paid_amount)}</strong></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </article>
                        ))}
                    </section>
                </>
            )}
        </main>
    );
};

export default PaymentReceivedList;
