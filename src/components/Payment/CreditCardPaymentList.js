import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HistoryIcon from "@mui/icons-material/History";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PaymentTermService from "../OtherService/PaymentTermService";
import "./CreditCardPaymentList.css";

const currencyFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
});

const CreditCardPaymentList = () => {
    const [paymentTermList, setPaymentTermList] = useState({ data: [], details: {} });
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        PaymentTermService.fetchCreditCardPaymentListV2(2)
            .then((response) => setPaymentTermList(response.data))
            .catch(() => setError("We couldn't load your credit cards. Please try again."))
            .finally(() => setLoading(false));
    }, []);

    const cards = Array.isArray(paymentTermList.data) ? paymentTermList.data : [];

    const totals = useMemo(() => cards.reduce((result, card) => ({
        credit: result.credit + Number(card.credit_limit || 0),
        available: result.available + Number(card.balance_due || 0),
        due: result.due + Number(card.total_balance_due || 0),
    }), { credit: 0, available: 0, due: 0 }), [cards]);

    const filteredCards = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return cards;
        return cards.filter((card) => [
            card.bank_name,
            card.account_name,
            card.account_description,
            card.account_number,
        ].some((value) => String(value || "").toLowerCase().includes(query)));
    }, [cards, search]);

    const formatCurrency = (value) => currencyFormatter.format(Number(value || 0));

    const moneyClass = (value, baseClass = "credit-card-money") =>
        `${baseClass}${Number(value || 0) < 0 ? " credit-card-money--negative" : ""}`;

    const formatDate = (value) => {
        if (!value || value === 0 || value === "0") return "—";
        const date = new Date(value);
        return Number.isNaN(date.getTime())
            ? value
            : new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" }).format(date);
    };

    const maskedNumber = (value) => {
        const number = String(value || "").replace(/\s/g, "");
        return number.length > 4 ? `•••• ${number.slice(-4)}` : number || "No number";
    };

    return (
        <main className="credit-card-page">
            <header className="credit-card-header">
                <div>
                    <span className="credit-card-eyebrow">Payments</span>
                    <h1>Credit cards</h1>
                    <p>Track limits, upcoming dues, and payment activity in one place.</p>
                </div>
                <div className="credit-card-count">
                    <CreditCardIcon />
                    <span><strong>{cards.length}</strong> active {cards.length === 1 ? "card" : "cards"}</span>
                </div>
            </header>

            <section className="credit-summary-grid" aria-label="Credit card summary">
                <article className="credit-summary-card credit-summary-card--primary">
                    <div className="credit-summary-icon"><CreditCardIcon /></div>
                    <div><span>Total credit limit</span><strong>{formatCurrency(totals.credit)}</strong></div>
                </article>
                <article className="credit-summary-card">
                    <div className="credit-summary-icon credit-summary-icon--green"><AccountBalanceWalletOutlinedIcon /></div>
                    <div><span>Available limit</span><strong>{formatCurrency(totals.available)}</strong></div>
                </article>
                <article className="credit-summary-card">
                    <div className="credit-summary-icon credit-summary-icon--orange"><PaymentsOutlinedIcon /></div>
                    <div><span>Total balance due</span><strong>{formatCurrency(totals.due)}</strong></div>
                </article>
            </section>

            <section className="credit-card-panel">
                <div className="credit-card-toolbar">
                    <div>
                        <h2>Your cards</h2>
                        <p>{filteredCards.length} {filteredCards.length === 1 ? "card" : "cards"} shown</p>
                    </div>
                    <label className="credit-card-search">
                        <SearchIcon />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search bank, name, or number"
                            aria-label="Search credit cards"
                        />
                    </label>
                </div>

                {loading && <div className="credit-card-state">Loading credit cards…</div>}
                {!loading && error && <div className="credit-card-state credit-card-state--error">{error}</div>}
                {!loading && !error && filteredCards.length === 0 && (
                    <div className="credit-card-state">No credit cards match your search.</div>
                )}

                {!loading && !error && filteredCards.length > 0 && (
                    <div className="credit-card-table-wrap">
                        <table className="credit-card-table">
                            <thead>
                                <tr>
                                    <th>Card</th>
                                    <th>Statement / due</th>
                                    <th>Credit limit</th>
                                    <th>Available</th>
                                    <th>Upcoming due</th>
                                    <th>Status</th>
                                    <th><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCards.map((card, index) => {
                                    const isPaid = Number(card.total_balance_due || 0) === 0;
                                    return (
                                        <tr key={card.id}>
                                            <td>
                                                <div className={`credit-card-identity credit-card-identity--${index % 4}`}>
                                                    <div className="credit-card-logo"><CreditCardIcon /></div>
                                                    <div>
                                                        <strong>{card.bank_name || "Credit card"}</strong>
                                                        <span>{card.account_description || card.account_name}</span>
                                                        <small>{maskedNumber(card.account_number)}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td data-label="Statement / due">
                                                <div className="credit-card-dates">
                                                    <span>Statement <strong>Day {card.statement_date || "—"}</strong></span>
                                                    <span>Due <strong>Day {card.due_date || "—"}</strong></span>
                                                </div>
                                            </td>
                                            <td data-label="Credit limit" className={moneyClass(card.credit_limit)}>{formatCurrency(card.credit_limit)}</td>
                                            <td data-label="Available" className={moneyClass(card.balance_due, "credit-card-money credit-card-money--positive")}>{formatCurrency(card.balance_due)}</td>
                                            <td data-label="Upcoming due">
                                                <div className="credit-card-due">
                                                    <strong className={Number(card.amount_due || 0) < 0 ? "credit-card-money--negative" : ""}>{formatCurrency(card.amount_due)}</strong>
                                                    <span>{formatDate(card.due)}</span>
                                                </div>
                                            </td>
                                            <td data-label="Status">
                                                <span className={`credit-card-status ${isPaid ? "credit-card-status--paid" : "credit-card-status--due"}`}>
                                                    <i />{isPaid ? "Paid" : "Payment due"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="credit-card-actions">
                                                    <Link className="credit-action-icon" to={`/viewBankTransactionList/${card.id}`} title="Transaction history" aria-label="Transaction history">
                                                        <ReceiptLongOutlinedIcon />
                                                    </Link>
                                                    <Link className="credit-action-icon" to={`/creditCardPayHistory/${card.id}`} title="Payment history" aria-label="Payment history">
                                                        <HistoryIcon />
                                                    </Link>
                                                    <Link className="credit-pay-button" to={`/viewOrderSupplierTransaction/${card.id}`}>
                                                        Pay <ArrowForwardIcon />
                                                    </Link>
                                                </div>
                                            </td>
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

export default CreditCardPaymentList;
