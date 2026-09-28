import React, { useEffect, useMemo, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";
import "./MonthlySalesForecast.css";

const currentYear = new Date().getFullYear();

const money = (value) => new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
}).format(Number(value) || 0);

const compactMoney = (value) => new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    notation: "compact",
    maximumFractionDigits: 1,
}).format(Number(value) || 0);

const MonthlySalesForecast = () => {
    const isAdmin = String(localStorage.getItem("role_as")) === "2";
    const [year, setYear] = useState(currentYear);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [report, setReport] = useState({ data: [], summary: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadReport = async (requestedYear) => {
        setLoading(true);
        setError("");
        try {
            const response = await ShopOrderTransactionService.fetchOnlineShopMonthlySalesForecast({
                year: Number(requestedYear),
            });
            setReport(response.data || { data: [], summary: {} });
            setSelectedYear(Number(requestedYear));
        } catch (requestError) {
            const validationMessage = requestError.response?.data?.errors?.year?.[0];
            setError(validationMessage || requestError.response?.data?.message || "Unable to load the monthly sales forecast.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReport(currentYear);
    }, []);

    const months = Array.isArray(report.data) ? report.data : [];
    const summary = report.summary || {};
    const maxSales = useMemo(
        () => Math.max(...months.map((month) => Number(month.total_sales) || 0), 1),
        [months]
    );
    const maxActualSales = Math.max(0, ...months.filter((month) => month.type === "actual").map((month) => Number(month.total_sales) || 0));
    const maxProfit = Math.max(0, ...months.filter((month) => month.type === "actual").map((month) => Number(month.total_profit) || 0));
    const maxOrders = Math.max(...months.map((month) => Number(month.total_count) || 0), 0);
    const actualMonths = months.filter((month) => month.type === "actual").length;
    const forecastMonths = months.filter((month) => month.type === "forecast").length;
    const actualOrders = months.reduce(
        (total, month) => total + (month.type === "actual" ? Number(month.total_count) || 0 : 0),
        0
    );
    const averageMonthlySales = months.length
        ? months.reduce((total, month) => total + (Number(month.total_sales) || 0), 0) / months.length
        : 0;
    const peakMonth = months.filter((month) => month.type === "actual").reduce(
        (peak, month) => Number(month.total_sales) > Number(peak?.total_sales || 0) ? month : peak,
        null
    );
    const lastActualMonth = [...months].reverse().find((month) => month.type === "actual");
    const finalMonth = months[months.length - 1];
    const outlookChange = Number(lastActualMonth?.total_sales)
        ? ((Number(finalMonth?.total_sales || 0) - Number(lastActualMonth.total_sales)) / Number(lastActualMonth.total_sales)) * 100
        : 0;

    const submitYear = (event) => {
        event.preventDefault();
        const parsedYear = Number(year);
        if (!Number.isInteger(parsedYear) || parsedYear < 2000 || parsedYear > currentYear) {
            setError(`Choose a year from 2000 to ${currentYear}.`);
            return;
        }
        loadReport(parsedYear);
    };

    return (
        <main className="monthly-forecast">
            <header className="monthly-forecast__hero">
                <div>
                    <p className="monthly-forecast__eyebrow">Sales report</p>
                    <h1>Monthly sales forecast</h1>
                    <p>Review online shop sales from January to December and plan ahead with trend-based projections.</p>
                </div>
                <form className="monthly-forecast__year-search" onSubmit={submitYear}>
                    <label htmlFor="forecast-year">Report year</label>
                    <div>
                        <input
                            id="forecast-year"
                            type="number"
                            min="2000"
                            max={currentYear}
                            value={year}
                            onChange={(event) => setYear(event.target.value)}
                        />
                        <button type="submit" disabled={loading}>View report</button>
                    </div>
                </form>
            </header>

            {loading && <LinearProgress className="monthly-forecast__loader" aria-label="Loading monthly sales" />}
            {error && <div className="monthly-forecast__error" role="alert">{error}</div>}

            {!loading && !error && (
                <>
                    <section className={`monthly-forecast__summary${isAdmin ? "" : " monthly-forecast__summary--sales-only"}`} aria-label="Annual sales summary">
                        <article className="monthly-forecast__metric monthly-forecast__metric--primary">
                            <span>Projected annual sales</span>
                            <strong>{money(summary.projected_annual_sales)}</strong>
                            <small>{selectedYear} total, including forecast</small>
                        </article>
                        <article className="monthly-forecast__metric">
                            <span>Recorded sales</span>
                            <strong>{money(summary.actual_sales)}</strong>
                            <small>{actualMonths} actual {actualMonths === 1 ? "month" : "months"}</small>
                        </article>
                        <article className="monthly-forecast__metric monthly-forecast__metric--forecast">
                            <span>Forecast sales</span>
                            <strong>{money(summary.forecast_sales)}</strong>
                            <small>{forecastMonths ? `${forecastMonths} projected months` : "Historical year — no forecast"}</small>
                        </article>
                        {isAdmin && <article className="monthly-forecast__metric">
                            <span>Projected annual profit</span>
                            <strong>{money(summary.projected_annual_profit)}</strong>
                            <small>Actual and forecast profit</small>
                        </article>}
                    </section>

                    <section className="monthly-forecast__chart-card">
                        <div className="monthly-forecast__section-heading">
                            <div>
                                <p className="monthly-forecast__eyebrow">January–December</p>
                                <h2>{selectedYear} sales outlook</h2>
                            </div>
                            <div className="monthly-forecast__legend">
                                <span><i className="is-actual" /> Actual</span>
                                {forecastMonths > 0 && <span><i className="is-forecast" /> Forecast</span>}
                                <span><i className="is-increase" /> Increase</span>
                                <span><i className="is-decrease" /> Decrease</span>
                            </div>
                        </div>
                        <div className="monthly-forecast__chart-insights">
                            <div><span>Monthly average</span><strong>{money(averageMonthlySales)}</strong></div>
                            <div><span>Highest month</span><strong>{peakMonth?.month || "—"}</strong><small>{peakMonth ? money(peakMonth.total_sales) : "No data"}</small></div>
                            <div><span>{forecastMonths ? "Year-end outlook" : "First to last month"}</span><strong className={outlookChange >= 0 ? "is-positive" : "is-negative"}>{outlookChange >= 0 ? "+" : ""}{outlookChange.toFixed(1)}%</strong><small>{forecastMonths ? `from ${lastActualMonth?.month || "latest actual"} to December` : "change across the year"}</small></div>
                        </div>
                        <div className="monthly-forecast__chart" aria-label={`Monthly sales chart for ${selectedYear}`}>
                            <svg className="monthly-forecast__trend-line" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true">
                                {months.slice(1).map((month, index) => {
                                    const previous = Number(months[index].total_sales) || 0;
                                    const current = Number(month.total_sales) || 0;
                                    return <line key={`${month.period}-trend`} className={current >= previous ? "is-increase" : "is-decrease"} x1={50 + (index * 100)} y1={10 + ((1 - (previous / maxSales)) * 180)} x2={50 + ((index + 1) * 100)} y2={10 + ((1 - (current / maxSales)) * 180)} />;
                                })}
                                {months.map((month, index) => {
                                    const current = Number(month.total_sales) || 0;
                                    const previous = Number(months[index - 1]?.total_sales);
                                    return <circle key={`${month.period}-point`} className={index === 0 || current >= previous ? "is-increase" : "is-decrease"} cx={50 + (index * 100)} cy={10 + ((1 - (current / maxSales)) * 180)} r="5" />;
                                })}
                            </svg>
                            {months.map((month, index) => (
                                <div className={`monthly-forecast__bar-column${month.type === "forecast" && months[index - 1]?.type !== "forecast" ? " is-forecast-start" : ""}${month.type === "actual" && Number(month.total_sales) === maxActualSales ? " is-highest-sales" : ""}`} key={month.period}>
                                    <span className="monthly-forecast__bar-value">{month.type === "actual" && Number(month.total_sales) === maxActualSales && <b>★ Top</b>}{compactMoney(month.total_sales)}</span>
                                    <div className="monthly-forecast__bar-track">
                                        <div
                                            className={`monthly-forecast__bar monthly-forecast__bar--${month.type}`}
                                            style={{ height: `${Math.max((Number(month.total_sales) / maxSales) * 100, month.total_sales ? 4 : 1)}%` }}
                                            title={`${month.month}: ${money(month.total_sales)} (${month.type})`}
                                        />
                                    </div>
                                    <strong>{month.month.slice(0, 3)}</strong>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="monthly-forecast__table-card">
                        <div className="monthly-forecast__section-heading">
                            <div>
                                <p className="monthly-forecast__eyebrow">Monthly details</p>
                                <h2>{isAdmin ? "Sales and profit breakdown" : "Monthly sales breakdown"}</h2>
                            </div>
                            <span className="monthly-forecast__method"><TrendingUpRoundedIcon /> Linear trend forecast</span>
                        </div>
                        <div className="monthly-forecast__table-wrap">
                            <table>
                                <colgroup>
                                    <col style={{ width: isAdmin ? "22%" : "26%" }} />
                                    <col style={{ width: isAdmin ? "18%" : "20%" }} />
                                    <col style={{ width: isAdmin ? "25%" : "32%" }} />
                                    {isAdmin && <col style={{ width: "20%" }} />}
                                    <col style={{ width: isAdmin ? "15%" : "22%" }} />
                                </colgroup>
                                <thead><tr><th>Month</th><th>Status</th><th>Sales</th>{isAdmin && <th>Profit</th>}<th>Orders</th></tr></thead>
                                <tbody>
                                    {months.map((month, index) => {
                                        const previousSales = Number(months[index - 1]?.total_sales) || 0;
                                        const sales = Number(month.total_sales) || 0;
                                        const change = previousSales ? ((sales - previousSales) / previousSales) * 100 : null;
                                        const profitMargin = sales ? ((Number(month.total_profit) || 0) / sales) * 100 : 0;
                                        const today = new Date();
                                        const daysInMonth = new Date(selectedYear, Number(month.month_number), 0).getDate();
                                        const isCurrentMonth = selectedYear === today.getFullYear() && Number(month.month_number) === today.getMonth() + 1;
                                        const isIncompleteMonth = isCurrentMonth && today.getDate() < daysInMonth;
                                        const daysRemaining = isIncompleteMonth ? daysInMonth - today.getDate() : 0;
                                        const hasHighestSales = month.type === "actual" && sales > 0 && sales === maxActualSales;
                                        const hasHighestProfit = month.type === "actual" && Number(month.total_profit) > 0 && Number(month.total_profit) === maxProfit;
                                        const hasHighestOrders = month.total_count !== null && Number(month.total_count) > 0 && Number(month.total_count) === maxOrders;

                                        const beginsForecast = month.type === "forecast" && months[index - 1]?.type !== "forecast";

                                        return <tr key={month.period} className={`monthly-forecast__row monthly-forecast__row--${month.type}${beginsForecast ? " is-forecast-start" : ""}`}>
                                            <td><CalendarMonthRoundedIcon /><span><strong>{month.month}</strong><small>{month.period}</small></span></td>
                                            <td>
                                                <span className={`monthly-forecast__status monthly-forecast__status--${isIncompleteMonth ? "progress" : month.type}`}>{isIncompleteMonth ? "In progress" : month.type}</span>
                                                {isIncompleteMonth && <small className="monthly-forecast__days-status">{today.getDate()} of {daysInMonth} days recorded · {daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining</small>}
                                            </td>
                                            <td className={hasHighestSales ? "monthly-forecast__highest" : ""}>{hasHighestSales && <span className="monthly-forecast__highest-badge">★ Highest</span>}<strong>{money(month.total_sales)}</strong>{month.type === "actual" && change !== null && <small className={`monthly-forecast__change ${change >= 0 ? "is-up" : "is-down"}`}>{change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(1)}% vs prior month</small>}</td>
                                            {isAdmin && <td className={hasHighestProfit ? "monthly-forecast__highest" : ""}>{hasHighestProfit && <span className="monthly-forecast__highest-badge">★ Highest</span>}<strong className="monthly-forecast__profit">{money(month.total_profit)}</strong><small>{profitMargin.toFixed(1)}% margin</small></td>}
                                            <td className={hasHighestOrders ? "monthly-forecast__highest" : ""}>{hasHighestOrders && <span className="monthly-forecast__highest-badge">★ Highest</span>}{month.total_count === null ? <span className="monthly-forecast__not-applicable">Forecast only</span> : <><strong>{Number(month.total_count).toLocaleString("en-US")}</strong><small>completed orders</small></>}</td>
                                        </tr>;
                                    })}
                                </tbody>
                                <tfoot><tr><td colSpan="2"><strong>{selectedYear} annual total</strong><small>{forecastMonths ? "Actual + projected" : "Recorded results"}</small></td><td><strong>{money(summary.projected_annual_sales)}</strong></td>{isAdmin && <td><strong>{money(summary.projected_annual_profit)}</strong></td>}<td><strong>{actualOrders.toLocaleString("en-US")}</strong><small>actual orders</small></td></tr></tfoot>
                            </table>
                        </div>
                        {forecastMonths > 0 && <p className="monthly-forecast__note">Forecast months use the linear trend from recorded monthly sales. Forecast values are estimates and will be replaced by actual results as the year progresses.</p>}
                    </section>
                </>
            )}
        </main>
    );
};

export default MonthlySalesForecast;
