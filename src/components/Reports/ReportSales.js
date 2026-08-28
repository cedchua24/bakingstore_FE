import React, { useMemo, useState } from "react";
import { Button, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";
import ReportSalesChart from "./ReportSalesChart";
import "./ReportSales.css";

const ReportSales = () => {
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [showPaymentBreakdown, setShowPaymentBreakdown] = useState(false);
    const [monthlyTarget, setMonthlyTarget] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [requestError, setRequestError] = useState("");
    const [customerOrderDate, setCustomerOrderDate] = useState({
        dateFrom: "",
        dateTo: ""
    });
    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        data: [],
        code: '',
        message: '',
    });

    const dailySales = shopOrderTransaction?.data || [];

    const totals = useMemo(
        () => dailySales.reduce(
            (summary, day) => ({
                cash: summary.cash + Number(day.total_cash || 0),
                online: summary.online + Number(day.total_online || 0),
                sales: summary.sales + Number(day.total_sales || 0),
                transactions: summary.transactions + Number(day.total_count || 0),
            }),
            { cash: 0, online: 0, sales: 0, transactions: 0 }
        ),
        [dailySales]
    );

    const averageTransactions = dailySales.length
        ? Math.floor(totals.transactions / dailySales.length)
        : 0;
    const averageSales = dailySales.length ? totals.sales / dailySales.length : 0;

    const forecast = useMemo(() => {
        const referenceDate = customerOrderDate.dateTo
            ? new Date(`${customerOrderDate.dateTo}T00:00:00`)
            : new Date();
        const year = referenceDate.getFullYear();
        const month = referenceDate.getMonth();
        const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        const isCurrentMonth =
            today.getFullYear() === year && today.getMonth() === month;
        const effectiveDay = isCurrentMonth
            ? Math.min(referenceDate.getDate(), today.getDate())
            : referenceDate.getDate();
        const elapsedDays = Math.max(effectiveDay, 1);
        const remainingDays = Math.max(daysInMonth - elapsedDays, 0);
        const monthSales = dailySales
            .filter((day) => String(day.date).startsWith(monthKey))
            .reduce((sum, day) => sum + Number(day.total_sales || 0), 0);
        const target = Number(monthlyTarget || 0);
        const remainingAmount = Math.max(target - monthSales, 0);
        const currentDailyPace = monthSales / elapsedDays;
        const projectedSales = currentDailyPace * daysInMonth;
        const requiredDailySales = remainingDays
            ? remainingAmount / remainingDays
            : remainingAmount;
        const progress = target ? Math.min((monthSales / target) * 100, 100) : 0;

        return {
            monthName: referenceDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
            }),
            monthSales,
            target,
            elapsedDays,
            remainingDays,
            remainingAmount,
            currentDailyPace,
            projectedSales,
            requiredDailySales,
            progress,
            isOnTrack: target > 0 && projectedSales >= target,
            isUnfinishedMonth: isCurrentMonth && elapsedDays < daysInMonth,
            daysInMonth,
            hasCompleteStart:
                customerOrderDate.dateFrom === `${monthKey}-01`,
        };
    }, [customerOrderDate.dateFrom, customerOrderDate.dateTo, dailySales, monthlyTarget]);

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'PHP',
            maximumFractionDigits: 0,
        }).format(Number(value || 0));

    const formatDate = (date) =>
        new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

    const onChangeInput = (event) => {
        const { name, value } = event.target;
        setCustomerOrderDate((current) => ({ ...current, [name]: value }));
        setFormErrors((current) => ({ ...current, [name]: undefined, dateRange: undefined }));
    };

    const validate = () => {
        const errors = {};

        if (!customerOrderDate.dateFrom) errors.dateFrom = "Select a start date.";
        if (!customerOrderDate.dateTo) errors.dateTo = "Select an end date.";
        if (
            customerOrderDate.dateFrom &&
            customerOrderDate.dateTo &&
            customerOrderDate.dateFrom > customerOrderDate.dateTo
        ) {
            errors.dateRange = "The end date must be on or after the start date.";
        }

        return errors;
    };

    const saveOrderTransaction = () => {
        const errors = validate();
        setFormErrors(errors);
        setRequestError("");

        if (Object.keys(errors).length) return;

        setSubmitLoadingAdd(true);
        ShopOrderTransactionService.fetchSalesListV2(customerOrderDate)
            .then((response) => {
                setShopOrderTransaction({
                    ...response.data,
                    data: response.data?.data || [],
                });
                setHasGenerated(true);
            })
            .catch(() => {
                setRequestError("We couldn't generate the report. Please try again.");
            })
            .finally(() => {
                setSubmitLoadingAdd(false);
            });
    };

    const dateRangeLabel = customerOrderDate.dateFrom && customerOrderDate.dateTo
        ? `${formatDate(customerOrderDate.dateFrom)} – ${formatDate(customerOrderDate.dateTo)}`
        : "Choose a reporting period";

    return (
        <main className="sales-report">
            <header className="sales-report__hero">
                <div>
                    <p className="sales-report__eyebrow">Reports / Sales</p>
                    <h1>Sales performance</h1>
                    <p>Track revenue, payment mix, and transaction volume over time.</p>
                </div>
                <div className="sales-report__period">
                    <span>Reporting period</span>
                    <strong>{dateRangeLabel}</strong>
                </div>
            </header>

            <section className="sales-report__filter-card" aria-label="Report filters">
                <div className="sales-report__filter-copy">
                    <h2>Generate report</h2>
                    <p>Select the date range you want to analyze.</p>
                </div>
                <Form className="sales-report__filters">
                    <Form.Group>
                        <Form.Label htmlFor="sales-date-from">From</Form.Label>
                        <Form.Control
                            id="sales-date-from"
                            type="date"
                            name="dateFrom"
                            value={customerOrderDate.dateFrom}
                            onChange={onChangeInput}
                            isInvalid={Boolean(formErrors.dateFrom)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors.dateFrom}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="sales-date-to">To</Form.Label>
                        <Form.Control
                            id="sales-date-to"
                            type="date"
                            name="dateTo"
                            value={customerOrderDate.dateTo}
                            onChange={onChangeInput}
                            isInvalid={Boolean(formErrors.dateTo)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formErrors.dateTo}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button
                        className="sales-report__generate"
                        onClick={saveOrderTransaction}
                        disabled={submitLoadingAdd}
                    >
                        {submitLoadingAdd ? "Generating…" : "Generate report"}
                    </Button>
                </Form>
                {formErrors.dateRange && <p className="sales-report__error">{formErrors.dateRange}</p>}
                {requestError && <p className="sales-report__error">{requestError}</p>}
                {submitLoadingAdd && <LinearProgress className="sales-report__progress" />}
            </section>

            {hasGenerated && (
                <>
                    <section className="sales-report__summary" aria-label="Sales summary">
                        <div className="sales-report__summary-heading">
                            <div>
                                <p className="sales-report__eyebrow">At a glance</p>
                                <h2>Performance highlights</h2>
                            </div>
                            <button
                                type="button"
                                className="sales-report__payment-toggle"
                                onClick={() => setShowPaymentBreakdown((visible) => !visible)}
                                aria-expanded={showPaymentBreakdown}
                            >
                                {showPaymentBreakdown ? "Hide payment breakdown" : "Show payment breakdown"}
                                <span aria-hidden="true">{showPaymentBreakdown ? "↑" : "↓"}</span>
                            </button>
                        </div>

                        <div className="sales-report__metrics">
                        <article className="sales-metric sales-metric--primary">
                            <span>Total sales</span>
                            <strong>{numberFormat(totals.sales)}</strong>
                            <small>Across {dailySales.length} reporting {dailySales.length === 1 ? "day" : "days"}</small>
                        </article>
                        <article className="sales-metric sales-metric--transactions">
                            <span>Avg. transactions / day</span>
                            <strong>{averageTransactions.toLocaleString('en-US')}</strong>
                            <small>{totals.transactions.toLocaleString('en-US')} total transactions</small>
                        </article>
                        <article className="sales-metric sales-metric--average">
                            <span>Avg. sales / reporting day</span>
                            <strong>{numberFormat(averageSales)}</strong>
                            <small>Based on {dailySales.length} days with sales records</small>
                        </article>
                        {forecast.isUnfinishedMonth && (
                            <article className="sales-metric sales-metric--forecast">
                                <em>Forecast</em>
                                <span>Projected month-end sales</span>
                                <strong>{numberFormat(forecast.projectedSales)}</strong>
                                <small>
                                    {numberFormat(forecast.currentDailyPace)}/calendar day · Based on {forecast.elapsedDays} of {forecast.daysInMonth} days
                                </small>
                            </article>
                        )}
                        </div>

                        {showPaymentBreakdown && (
                            <div className="sales-report__payment-breakdown">
                                <article>
                                    <div>
                                        <span className="sales-report__payment-dot sales-report__payment-dot--cash" />
                                        <span>Cash payments</span>
                                    </div>
                                    <strong>{numberFormat(totals.cash)}</strong>
                                    <small>
                                        {totals.sales ? `${((totals.cash / totals.sales) * 100).toFixed(1)}% of sales` : "0% of sales"}
                                    </small>
                                </article>
                                <article>
                                    <div>
                                        <span className="sales-report__payment-dot sales-report__payment-dot--online" />
                                        <span>Online payments</span>
                                    </div>
                                    <strong>{numberFormat(totals.online)}</strong>
                                    <small>
                                        {totals.sales ? `${((totals.online / totals.sales) * 100).toFixed(1)}% of sales` : "0% of sales"}
                                    </small>
                                </article>
                            </div>
                        )}
                    </section>

                    <section className="sales-report__forecast-card" aria-label="Monthly sales forecast">
                        <div className="sales-report__forecast-heading">
                            <div>
                                <p className="sales-report__eyebrow">Monthly planning</p>
                                <h2>Target &amp; forecast</h2>
                                <p>
                                    Set your goal for {forecast.monthName} and see the daily pace needed to reach it.
                                </p>
                            </div>
                            <div className="sales-report__target-input">
                                <label htmlFor="monthly-sales-target">Monthly sales target</label>
                                <div>
                                    <span>₱</span>
                                    <input
                                        id="monthly-sales-target"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="Enter target amount"
                                        value={
                                            monthlyTarget
                                                ? Number(monthlyTarget).toLocaleString("en-US")
                                                : ""
                                        }
                                        onChange={(event) =>
                                            setMonthlyTarget(event.target.value.replace(/[^\d]/g, ""))
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {!forecast.hasCompleteStart && (
                            <div className="sales-report__forecast-note">
                                <strong>For the most accurate forecast:</strong> set “From” to the first day of {forecast.monthName}.
                            </div>
                        )}

                        {forecast.target > 0 ? (
                            <>
                                <div className="sales-report__forecast-progress-header">
                                    <div>
                                        <span>Monthly target progress</span>
                                        <strong>{forecast.progress.toFixed(1)}%</strong>
                                    </div>
                                    <p>
                                        {numberFormat(forecast.monthSales)} of {numberFormat(forecast.target)}
                                    </p>
                                </div>
                                <div
                                    className="sales-report__forecast-progress"
                                    role="progressbar"
                                    aria-label="Monthly target progress"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    aria-valuenow={Math.round(forecast.progress)}
                                >
                                    <span style={{ width: `${forecast.progress}%` }} />
                                </div>

                                <div className="sales-report__forecast-grid">
                                    <article className="sales-forecast-metric sales-forecast-metric--required">
                                        <span>Required sales / remaining day</span>
                                        <strong>{numberFormat(forecast.requiredDailySales)}</strong>
                                        <small>
                                            {forecast.remainingDays
                                                ? `${forecast.remainingDays} calendar days remaining`
                                                : "The selected month has ended"}
                                        </small>
                                    </article>
                                    <article className="sales-forecast-metric">
                                        <span>Still needed</span>
                                        <strong>{numberFormat(forecast.remainingAmount)}</strong>
                                        <small>Amount remaining to reach the target</small>
                                    </article>
                                    <article className="sales-forecast-metric">
                                        <span>Current daily pace</span>
                                        <strong>{numberFormat(forecast.currentDailyPace)}</strong>
                                        <small>Based on {forecast.elapsedDays} elapsed calendar days</small>
                                    </article>
                                    <article className="sales-forecast-metric">
                                        <span>Projected month-end sales</span>
                                        <strong>{numberFormat(forecast.projectedSales)}</strong>
                                        <small>At the current average pace</small>
                                    </article>
                                </div>

                                <div className={`sales-report__forecast-status ${forecast.isOnTrack ? "is-on-track" : "is-behind"}`}>
                                    <span aria-hidden="true">{forecast.isOnTrack ? "✓" : "!"}</span>
                                    <div>
                                        <strong>
                                            {forecast.remainingAmount === 0
                                                ? "Monthly target achieved"
                                                : forecast.isOnTrack
                                                    ? "On track to reach the target"
                                                    : "More daily sales are needed"}
                                        </strong>
                                        <p>
                                            {forecast.remainingAmount === 0
                                                ? `Sales are ${numberFormat(forecast.monthSales - forecast.target)} above the target.`
                                                : forecast.isOnTrack
                                                    ? `The current projection is ${numberFormat(forecast.projectedSales - forecast.target)} above target.`
                                                    : `Increase the current pace by ${numberFormat(Math.max(forecast.requiredDailySales - forecast.currentDailyPace, 0))} per day.`}
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="sales-report__forecast-empty">
                                <span>◎</span>
                                <div>
                                    <strong>Enter a monthly target to start forecasting</strong>
                                    <p>We’ll calculate the sales required per day and your projected month-end result.</p>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="sales-report__chart-card">
                        <ReportSalesChart transactionList={{ ...shopOrderTransaction, data: dailySales }} />
                    </section>

                    <section className="sales-report__table-card">
                        <div className="sales-report__section-heading">
                            <div>
                                <p className="sales-report__eyebrow">Detailed breakdown</p>
                                <h2>Daily sales</h2>
                            </div>
                            <span>{dailySales.length} {dailySales.length === 1 ? "record" : "records"}</span>
                        </div>

                        {dailySales.length ? (
                            <div className="sales-report__table-wrap">
                                <table className="sales-report__table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Transactions</th>
                                            <th>Cash</th>
                                            <th>Online</th>
                                            <th>Total sales</th>
                                            <th><span className="visually-hidden">Actions</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dailySales.map((day) => (
                                            <tr key={day.date}>
                                                <td><strong>{formatDate(day.date)}</strong></td>
                                                <td>{Number(day.total_count || 0).toLocaleString('en-US')}</td>
                                                <td>{numberFormat(day.total_cash)}</td>
                                                <td>{numberFormat(day.total_online)}</td>
                                                <td><strong>{numberFormat(day.total_sales)}</strong></td>
                                                <td>
                                                    <Link
                                                        className="sales-report__view-link"
                                                        to={`/shopOrderTransaction/customerOrderTransactionList/${day.date}`}
                                                    >
                                                        View details →
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="sales-report__empty">
                                <strong>No sales found</strong>
                                <p>There are no sales records in this date range.</p>
                            </div>
                        )}
                    </section>
                </>
            )}
        </main>
    );
};

export default ReportSales;
