import React, { useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";
import ExpenseTransactionService from "../ExpensesV2/ExpenseTransactionService";
import ReportBar from "./ReportBar";
import "./ReportSales.css";
import "./ReportList.css";

const ReportList = () => {
    const [role] = useState(localStorage.getItem("role_as"));
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [profitTarget, setProfitTarget] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [requestError, setRequestError] = useState("");
    const [customerOrderDate, setCustomerOrderDate] = useState({
        dateFrom: "",
        dateTo: "",
    });
    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        data: [],
        code: "",
        message: "",
        total_expenses: 0,
    });

    const isAdmin = String(role) === "2";
    const dailyOrders = shopOrderTransaction?.data || [];
    const totalSales = Number(shopOrderTransaction.total_sales || 0);
    const totalProfit = Number(shopOrderTransaction.total_profit || 0);
    const totalExpenses = Number(shopOrderTransaction.total_expenses || 0);
    const totalTransactions = Number(shopOrderTransaction.total_count || 0);
    const totalCash = Number(shopOrderTransaction.total_cash || 0);
    const totalOnline = Number(shopOrderTransaction.total_online || 0);
    const netProfit = totalProfit - totalExpenses;
    const averageTransactions = dailyOrders.length
        ? Math.floor(totalTransactions / dailyOrders.length)
        : 0;
    const averageSales = dailyOrders.length ? totalSales / dailyOrders.length : 0;
    const averageProfit = dailyOrders.length ? totalProfit / dailyOrders.length : 0;
    const profitMargin = totalSales ? (totalProfit / totalSales) * 100 : 0;
    const expenseMargin = totalSales ? (totalExpenses / totalSales) * 100 : 0;
    const netProfitMargin = totalSales ? (netProfit / totalSales) * 100 : 0;

    const paymentMix = useMemo(() => {
        const paymentTotal = totalCash + totalOnline;

        return {
            cash: paymentTotal ? (totalCash / paymentTotal) * 100 : 0,
            online: paymentTotal ? (totalOnline / paymentTotal) * 100 : 0,
        };
    }, [totalCash, totalOnline]);

    const profitForecast = useMemo(() => {
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
        const elapsedDays = Math.max(
            isCurrentMonth
                ? Math.min(referenceDate.getDate(), today.getDate())
                : referenceDate.getDate(),
            1
        );
        const remainingDays = Math.max(daysInMonth - elapsedDays, 0);
        const target = Number(profitTarget || 0);
        const marginRate = totalSales > 0 ? totalProfit / totalSales : 0;
        const marginPercent = marginRate * 100;
        const requiredSales = marginRate > 0 ? target / marginRate : 0;
        const remainingProfit = Math.max(target - totalProfit, 0);
        const additionalSales = marginRate > 0 ? remainingProfit / marginRate : 0;
        const requiredDailySales = remainingDays
            ? additionalSales / remainingDays
            : additionalSales;
        const dailyGrossProfit = totalProfit / elapsedDays;
        const projectedGrossProfit = dailyGrossProfit * daysInMonth;
        const progress = target
            ? Math.min(Math.max((totalProfit / target) * 100, 0), 100)
            : 0;

        return {
            monthName: referenceDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
            }),
            target,
            marginPercent,
            requiredSales,
            remainingProfit,
            additionalSales,
            requiredDailySales,
            projectedGrossProfit,
            remainingDays,
            progress,
            isOnTrack: target > 0 && projectedGrossProfit >= target,
            hasCompleteStart: customerOrderDate.dateFrom === `${monthKey}-01`,
        };
    }, [
        customerOrderDate.dateFrom,
        customerOrderDate.dateTo,
        profitTarget,
        totalSales,
        totalProfit,
    ]);

    const numberFormat = (value) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
            maximumFractionDigits: 2,
        }).format(Number(value || 0));

    const formatDate = (date) =>
        new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    const dateRangeLabel = customerOrderDate.dateFrom && customerOrderDate.dateTo
        ? `${formatDate(customerOrderDate.dateFrom)} – ${formatDate(customerOrderDate.dateTo)}`
        : "Choose a reporting period";

    const onChangeInput = (event) => {
        const { name, value } = event.target;
        setCustomerOrderDate((current) => ({ ...current, [name]: value }));
        setFormErrors((current) => ({
            ...current,
            [name]: undefined,
            dateRange: undefined,
        }));
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

    const saveOrderTransaction = async () => {
        const errors = validate();
        setFormErrors(errors);
        setRequestError("");

        if (Object.keys(errors).length) return;

        setSubmitLoadingAdd(true);

        try {
            const response =
                await ShopOrderTransactionService.fetchOnlineShopOrderTransactionListReportByDate(
                    customerOrderDate
                );
            let reportData = {
                ...response.data,
                data: response.data?.data || [],
            };

            if (Number(reportData.total_expenses || 0) === 0) {
                const expenseResponse = await ExpenseTransactionService.getTotalExpense({
                    ...customerOrderDate,
                    approval_status: "APPROVED",
                });

                reportData = {
                    ...reportData,
                    total_expenses: Number(expenseResponse.data.total_expense) || 0,
                };
            }

            setShopOrderTransaction(reportData);
            setHasGenerated(true);
        } catch (error) {
            console.error("Unable to generate online order report", error);
            setRequestError("We couldn't generate the report. Please try again.");
        } finally {
            setSubmitLoadingAdd(false);
        }
    };

    return (
        <main className="sales-report profit-report">
            <header className="sales-report__hero">
                <div>
                    <p className="sales-report__eyebrow">Reports / Online orders</p>
                    <h1>Order profitability</h1>
                    <p>Review sales, expenses, profit, and payment performance in one place.</p>
                </div>
                <div className="sales-report__period">
                    <span>Reporting period</span>
                    <strong>{dateRangeLabel}</strong>
                </div>
            </header>

            <section className="sales-report__filter-card" aria-label="Report filters">
                <div className="sales-report__filter-copy">
                    <h2>Generate report</h2>
                    <p>Select the order dates you want to analyze.</p>
                </div>
                <Form className="sales-report__filters">
                    <Form.Group>
                        <Form.Label htmlFor="profit-date-from">From</Form.Label>
                        <Form.Control
                            id="profit-date-from"
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
                        <Form.Label htmlFor="profit-date-to">To</Form.Label>
                        <Form.Control
                            id="profit-date-to"
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
                {formErrors.dateRange && (
                    <p className="sales-report__error">{formErrors.dateRange}</p>
                )}
                {requestError && <p className="sales-report__error">{requestError}</p>}
                {submitLoadingAdd && <LinearProgress className="sales-report__progress" />}
            </section>

            {hasGenerated && (
                <>
                    <section className="sales-report__summary" aria-label="Profitability summary">
                        <div className="sales-report__summary-heading">
                            <div>
                                <p className="sales-report__eyebrow">At a glance</p>
                                <h2>Performance highlights</h2>
                            </div>
                            <span className="profit-report__days">
                                {dailyOrders.length} reporting {dailyOrders.length === 1 ? "day" : "days"}
                            </span>
                        </div>

                        <div className="profit-report__metrics">
                            <article className="sales-metric sales-metric--primary">
                                <span>Total sales</span>
                                <strong>{numberFormat(totalSales)}</strong>
                                <small>{totalTransactions.toLocaleString("en-US")} completed transactions</small>
                            </article>

                            {isAdmin && (
                                <article className="sales-metric profit-metric--profit">
                                    <span>Gross profit</span>
                                    <strong>{numberFormat(totalProfit)}</strong>
                                    <small>{profitMargin.toFixed(2)}% profit margin</small>
                                </article>
                            )}

                            <article className="sales-metric profit-metric--expense">
                                <span>Total expenses</span>
                                <strong>{numberFormat(-Math.abs(totalExpenses))}</strong>
                                <small>{expenseMargin.toFixed(2)}% expense margin</small>
                            </article>

                            {isAdmin && (
                                <article className="sales-metric profit-metric--net">
                                    <span>Net profit</span>
                                    <strong>{numberFormat(netProfit)}</strong>
                                    <small>{netProfitMargin.toFixed(2)}% net profit margin</small>
                                </article>
                            )}
                        </div>

                        <div className="profit-report__supporting-metrics">
                            <article>
                                <span>Avg. transactions / day</span>
                                <strong>{averageTransactions.toLocaleString("en-US")}</strong>
                            </article>
                            <article>
                                <span>Avg. sales / day</span>
                                <strong>{numberFormat(averageSales)}</strong>
                            </article>
                            {isAdmin && (
                                <article>
                                    <span>Avg. profit / day</span>
                                    <strong>{numberFormat(averageProfit)}</strong>
                                </article>
                            )}
                        </div>

                        <div className="profit-report__payments">
                            <article>
                                <div className="profit-report__payment-heading">
                                    <span className="sales-report__payment-dot sales-report__payment-dot--cash" />
                                    <span>Cash payments</span>
                                    <b>{paymentMix.cash.toFixed(1)}%</b>
                                </div>
                                <strong>{numberFormat(totalCash)}</strong>
                                <div className="profit-report__payment-track">
                                    <span style={{ width: `${paymentMix.cash}%` }} />
                                </div>
                            </article>
                            <article>
                                <div className="profit-report__payment-heading">
                                    <span className="sales-report__payment-dot sales-report__payment-dot--online" />
                                    <span>Online payments</span>
                                    <b>{paymentMix.online.toFixed(1)}%</b>
                                </div>
                                <strong>{numberFormat(totalOnline)}</strong>
                                <div className="profit-report__payment-track profit-report__payment-track--online">
                                    <span style={{ width: `${paymentMix.online}%` }} />
                                </div>
                            </article>
                        </div>
                    </section>

                    {isAdmin && (
                        <section
                            className="sales-report__forecast-card"
                            aria-label="Monthly gross profit forecast"
                        >
                            <div className="sales-report__forecast-heading">
                                <div>
                                    <p className="sales-report__eyebrow">Profit planning</p>
                                    <h2>Gross profit target &amp; sales forecast</h2>
                                    <p>
                                        Estimate the sales needed to reach your net profit goal for{" "}
                                        {profitForecast.monthName} using your actual profit and
                                        sales performance.
                                    </p>
                                </div>

                                <div className="profit-report__forecast-inputs">
                                    <div className="sales-report__target-input">
                                        <label htmlFor="monthly-profit-target">
                                            Monthly gross profit target
                                        </label>
                                        <div>
                                            <span>₱</span>
                                            <input
                                                id="monthly-profit-target"
                                                type="text"
                                                inputMode="numeric"
                                                value={
                                                    profitTarget
                                                        ? Number(profitTarget).toLocaleString("en-US")
                                                        : ""
                                                }
                                                onChange={(event) =>
                                                    setProfitTarget(
                                                        event.target.value.replace(/[^\d]/g, "")
                                                    )
                                                }
                                                placeholder="Enter profit target"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {!profitForecast.hasCompleteStart && (
                                <div className="sales-report__forecast-note">
                                    <strong>For the most accurate monthly projection:</strong>{" "}
                                    set “From” to the first day of {profitForecast.monthName}.
                                </div>
                            )}

                            {profitForecast.target > 0 && profitForecast.marginPercent > 0 ? (
                                <>
                                    <div className="sales-report__forecast-progress-header">
                                        <div>
                                            <span>Gross profit progress</span>
                                            <strong>{profitForecast.progress.toFixed(1)}%</strong>
                                        </div>
                                        <p>
                                            {numberFormat(totalProfit)} of{" "}
                                            {numberFormat(profitForecast.target)}
                                        </p>
                                    </div>
                                    <div className="sales-report__forecast-progress">
                                        <span style={{ width: `${profitForecast.progress}%` }} />
                                    </div>

                                    <div className="sales-report__forecast-grid">
                                        <article className="sales-forecast-metric sales-forecast-metric--required">
                                            <span>Total sales required</span>
                                            <strong>{numberFormat(profitForecast.requiredSales)}</strong>
                                            <small>
                                                Based on your actual{" "}
                                                {profitForecast.marginPercent.toFixed(2)}% gross margin
                                            </small>
                                        </article>
                                        <article className="sales-forecast-metric">
                                            <span>Actual avg. sales / day</span>
                                            <strong>{numberFormat(averageSales)}</strong>
                                            <small>Average from the selected report period</small>
                                        </article>
                                        <article className="sales-forecast-metric">
                                            <span>Actual avg. gross profit / day</span>
                                            <strong>{numberFormat(averageProfit)}</strong>
                                            <small>Gross profit per reporting day</small>
                                        </article>
                                        <article className="sales-forecast-metric">
                                            <span>Remaining profit</span>
                                            <strong>{numberFormat(profitForecast.remainingProfit)}</strong>
                                            <small>Still needed to reach the target</small>
                                        </article>
                                        <article className="sales-forecast-metric">
                                            <span>Additional sales needed</span>
                                            <strong>{numberFormat(profitForecast.additionalSales)}</strong>
                                            <small>At your current average profit-to-sales ratio</small>
                                        </article>
                                        <article className="sales-forecast-metric">
                                            <span>Required sales / remaining day</span>
                                            <strong>{numberFormat(profitForecast.requiredDailySales)}</strong>
                                            <small>
                                                Across {profitForecast.remainingDays} remaining{" "}
                                                {profitForecast.remainingDays === 1 ? "day" : "days"}
                                            </small>
                                        </article>
                                    </div>

                                    <div
                                        className={`sales-report__forecast-status ${
                                            profitForecast.isOnTrack ? "is-on-track" : "is-behind"
                                        }`}
                                    >
                                        <span>{profitForecast.isOnTrack ? "✓" : "!"}</span>
                                        <div>
                                            <strong>
                                                {profitForecast.isOnTrack
                                                    ? "On track to reach the profit target"
                                                    : "The current profit pace is below target"}
                                            </strong>
                                            <p>
                                                Projected month-end gross profit:{" "}
                                                {numberFormat(profitForecast.projectedGrossProfit)}.
                                                The estimate uses your actual average daily gross
                                                profit and sales from this report.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="sales-report__forecast-empty">
                                    <span>↗</span>
                                    <div>
                                        <strong>
                                            {profitForecast.target > 0
                                                ? "A positive gross margin is required"
                                                : "Add a gross profit target"}
                                        </strong>
                                        <p>
                                            {profitForecast.target > 0
                                                ? "The selected period has no positive gross profit, so required sales cannot be projected yet."
                                                : `Enter a target above. Required sales will be calculated from your actual ${profitMargin.toFixed(2)}% gross margin.`}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    <section className="sales-report__chart-card">
                        <ReportBar transactionList={shopOrderTransaction} showProfit={isAdmin} />
                    </section>

                    <section className="sales-report__table-card">
                        <div className="sales-report__section-heading">
                            <div>
                                <p className="sales-report__eyebrow">Order history</p>
                                <h2>Daily online orders</h2>
                            </div>
                            <span>{dailyOrders.length} results</span>
                        </div>

                        {dailyOrders.length ? (
                            <div className="sales-report__table-wrap">
                                <table className="sales-report__table profit-report__table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Cash</th>
                                            <th>Online</th>
                                            <th>Total sales</th>
                                            {isAdmin && <th>Total profit</th>}
                                            <th aria-label="Actions" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dailyOrders.map((order, index) => (
                                            <tr key={`${order.date}-${index}`}>
                                                <td><strong>{formatDate(order.date)}</strong></td>
                                                <td>{numberFormat(order.total_cash)}</td>
                                                <td>{numberFormat(order.total_online)}</td>
                                                <td><strong>{numberFormat(order.total_sales)}</strong></td>
                                                {isAdmin && <td>{numberFormat(order.total_profit)}</td>}
                                                <td>
                                                    <Link
                                                        className="sales-report__view-link"
                                                        to={`/shopOrderTransaction/customerOrderTransactionList/${order.date}`}
                                                    >
                                                        View transactions →
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="sales-report__empty">
                                <span className="sales-report__empty-icon">↗</span>
                                <strong>No orders found</strong>
                                <p>Try a different date range to see online order activity.</p>
                            </div>
                        )}
                    </section>
                </>
            )}
        </main>
    );
};

export default ReportList;
