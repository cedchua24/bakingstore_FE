import React, { useCallback, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useNavigate, useParams } from "react-router-dom";
import VipCustomerService from "./VipCustomerService";
import VipCustomerTransactionService from "./VipCustomerTransactionService";

const money = value => Number(value || 0).toLocaleString("en-PH", {
    style: "currency", currency: "PHP", minimumFractionDigits: 2, maximumFractionDigits: 2,
});

const currentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const shiftMonth = (month, amount) => {
    const [year, monthNumber] = month.split("-").map(Number);
    const date = new Date(year, monthNumber - 1 + amount, 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const styles = {
    page: { padding: "18px 22px", background: "#f7f9fb", minHeight: "100vh" },
    header: { textAlign: "center", marginBottom: 18 },
    accent: { width: 44, height: 5, borderRadius: 20, margin: "0 auto 8px" },
    filter: { background: "white", border: "1px solid #e5e7eb", borderRadius: 9, padding: 16, marginBottom: 18 },
    filterRow: { display: "flex", alignItems: "flex-end", gap: 10, flexWrap: "wrap" },
    cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginBottom: 18 },
    card: { background: "white", border: "1px solid #e5e7eb", borderRadius: 9, padding: 16 },
    currentSalesCard: {
        background: "linear-gradient(135deg, #e8f7ee 0%, #f5fff8 100%)",
        border: "2px solid #198754", borderRadius: 10, padding: 16,
        boxShadow: "0 5px 14px rgba(25, 135, 84, .14)",
    },
    currentBadge: {
        display: "inline-block", marginBottom: 7, padding: "3px 8px", borderRadius: 999,
        color: "#ffffff", background: "#198754", fontSize: 10, fontWeight: 800,
        letterSpacing: ".06em",
    },
    profitSection: {
        gridColumn: "1 / -1", padding: 18, border: "1px solid #d8ccf0", borderRadius: 12,
        background: "linear-gradient(135deg, #f5f0ff 0%, #fbf9ff 100%)",
    },
    profitHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 13 },
    profitTitle: { color: "#4c2a85", fontSize: 17, fontWeight: 800, margin: 0 },
    profitGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 },
    profitCard: { padding: 14, background: "#ffffff", border: "1px solid #ded4ef", borderRadius: 9 },
    profitValue: { color: "#6f42c1", fontSize: 22, fontWeight: 800, margin: 0 },
    cellSalesLabel: { display: "block", color: "#6c757d", fontSize: 9, fontWeight: 700, textTransform: "uppercase" },
    cellProfit: { display: "block", color: "#6f42c1", fontSize: 12, fontWeight: 700, marginTop: 5 },
    neededCard: {
        gridColumn: "1 / -1", background: "#fff5f5", border: "2px solid #dc3545",
        borderRadius: 10, padding: "20px 22px", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 18, flexWrap: "wrap",
    },
    neededValue: { color: "#dc3545", fontSize: 32, fontWeight: 800, margin: 0 },
    alertTitle: { color: "#212529", fontSize: 18, fontWeight: 800, margin: "0 0 4px", letterSpacing: ".01em" },
    alertEmphasis: { color: "#dc3545", fontWeight: 900 },
    neededResult: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, flexWrap: "wrap" },
    statusBadge: { borderRadius: 999, padding: "6px 11px", fontSize: 12, fontWeight: 800, letterSpacing: ".04em" },
    metricGrid: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 },
    metricBox: { minWidth: 145, padding: "9px 12px", background: "#ffffff", border: "1px solid #ead5d7", borderRadius: 8 },
    metricLabel: { display: "block", color: "#6c757d", fontSize: 10, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 2 },
    metricValue: { display: "block", color: "#212529", fontSize: 15, fontWeight: 700 },
    label: { color: "#6c757d", fontSize: 13, marginBottom: 5 },
    value: { fontSize: 23, fontWeight: 700, margin: 0 },
    tableCard: { background: "white", border: "1px solid #e5e7eb", borderRadius: 9, overflowX: "auto", overflowY: "hidden" },
    chartCard: { background: "white", border: "1px solid #e5e7eb", borderRadius: 9, padding: 18, overflow: "hidden" },
    chartHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 8 },
    chartInsights: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 10, margin: "16px 0 4px" },
    chartInsight: { borderRadius: 9, padding: "12px 14px", background: "#f8fafc", border: "1px solid #e2e8f0" },
    tableHeader: { backgroundColor: "#212529", color: "#ffffff" },
    tableHeaderCell: { backgroundColor: "#212529", color: "#ffffff", borderColor: "#495057" },
    actionHeader: { position: "sticky", right: 0, zIndex: 3, width: 52, minWidth: 52, textAlign: "center", backgroundColor: "#212529", color: "#ffffff", borderColor: "#495057", boxShadow: "-3px 0 6px rgba(15, 23, 42, .12)" },
    actionCell: { position: "sticky", right: 0, zIndex: 2, width: 52, minWidth: 52, textAlign: "center", background: "#ffffff", boxShadow: "-3px 0 6px rgba(15, 23, 42, .1)" },
    totalRow: { background: "#dce5ec" },
    totalCell: { background: "#dce5ec", color: "#26313d", borderColor: "#aebdca", borderTop: "3px solid #647789", padding: "14px 10px", fontWeight: 800 },
    totalLabel: { display: "block", color: "#1f2933", fontSize: 15, fontWeight: 900 },
    totalHint: { display: "block", color: "#6c7a89", fontSize: 9, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", marginTop: 2 },
    customer: { fontWeight: 700, marginBottom: 2 },
    meta: { color: "#6c757d", fontSize: 12 },
};

const VIPTransactionHistory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedMonth, setSelectedMonth] = useState(currentMonth());
    const [report, setReport] = useState(null);
    const [template, setTemplate] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [monthlyQuota, setMonthlyQuota] = useState("");
    const [viewMode, setViewMode] = useState("sales");
    const [reportView, setReportView] = useState("table");
    const [sortBy, setSortBy] = useState("sales");

    const loadReport = useCallback(month => {
        setLoading(true);
        setError("");
        return VipCustomerTransactionService.fetchVipCustomerMonthlyPaid(id, month)
            .then(response => {
                setReport(response.data);
                const reportMonth = response.data?.report_month?.month || month;
                setMonthlyQuota(localStorage.getItem(`vip-monthly-quota-${id}-${reportMonth}`) || "");
            })
            .catch(requestError => {
                setReport(null);
                setError(requestError.response?.data?.message || "Unable to load transaction history. Please try again.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        loadReport(currentMonth());
        VipCustomerService.get(id).then(response => setTemplate(response.data)).catch(() => {});
    }, [id, loadReport]);

    const months = report ? [report.report_month, ...(report.previous_months || [])] : [];
    const customers = Array.isArray(report?.data) ? report.data : [];
    const sortedCustomers = [...customers].sort((firstCustomer, secondCustomer) => {
        if (sortBy === "profit") {
            return Number(secondCustomer.current_profit || 0) - Number(firstCustomer.current_profit || 0);
        }
        if (sortBy === "name") {
            return String(firstCustomer.customer_name || "").localeCompare(String(secondCustomer.customer_name || ""));
        }
        return Number(secondCustomer.current_paid || 0) - Number(firstCustomer.current_paid || 0);
    });
    const lastMonthPaid = Number(report?.previous_months?.[0]?.paid_amount || 0);
    const neededFromLastMonth = Math.max(lastMonthPaid - Number(report?.current_month_paid || 0), 0);
    const previousMonthTotals = report?.previous_months || [];
    const lastThreeMonthAverage = previousMonthTotals.length
        ? previousMonthTotals.reduce((total, month) => total + Number(month.paid_amount || 0), 0) / previousMonthTotals.length
        : 0;
    const neededFromThreeMonthAverage = Math.max(lastThreeMonthAverage - Number(report?.current_month_paid || 0), 0);
    const quotaAmount = Number(monthlyQuota || 0);
    const currentMonthProfit = Number(report?.current_month_profit || 0);
    const lastMonthProfit = Number(report?.previous_months?.[0]?.profit_amount || 0);
    const averageMonthlyProfit = Number(report?.average_monthly_profit || 0);
    const profitDifference = currentMonthProfit - averageMonthlyProfit;
    const currentProfitMargin = Number(report?.current_month_paid || 0) > 0
        ? (currentMonthProfit / Number(report.current_month_paid)) * 100
        : 0;
    const getPace = target => {
        const reportMonth = report?.report_month?.month;
        const now = new Date();
        const todayMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        const [year, monthNumber] = String(reportMonth || todayMonth).split("-").map(Number);
        const daysInMonth = new Date(year, monthNumber, 0).getDate();
        const elapsedDays = reportMonth < todayMonth ? daysInMonth : reportMonth > todayMonth ? 0 : now.getDate();
        const expectedToDate = Number(target || 0) * (elapsedDays / daysInMonth);
        const actual = Number(report?.current_month_paid || 0);

        return {
            elapsedDays,
            daysInMonth,
            expectedToDate,
            projectedMonthEnd: elapsedDays > 0 ? (actual / elapsedDays) * daysInMonth : 0,
            variance: actual - expectedToDate,
            status: elapsedDays === 0 ? "Not started" : actual >= expectedToDate ? "On track" : "Behind",
        };
    };
    const lastMonthPace = getPace(lastMonthPaid);
    const threeMonthPace = getPace(lastThreeMonthAverage);
    const quotaPace = getPace(quotaAmount);
    const showSales = viewMode === "sales" || viewMode === "both";
    const showProfit = viewMode === "profit" || viewMode === "both";
    const chartData = report ? [
        ...(report.previous_months || []).map(month => ({
            month: month.label,
            sales: Number(month.paid_amount || 0),
            profit: Number(month.profit_amount || 0),
        })).reverse(),
        {
            month: report.report_month?.label || "Selected month",
            sales: Number(report.current_month_paid || 0),
            profit: Number(report.current_month_profit || 0),
        },
    ] : [];
    const chartSeries = [
        ...(showSales ? [{ dataKey: "sales", label: "Paid sales", color: "#2563eb", valueFormatter: money }] : []),
        ...(showProfit ? [{ dataKey: "profit", label: "Profit", color: "#f97316", valueFormatter: money }] : []),
    ];
    const highestSalesMonth = chartData.length
        ? chartData.reduce((highest, month) => month.sales > highest.sales ? month : highest)
        : null;
    const highestProfitMonth = chartData.length
        ? chartData.reduce((highest, month) => month.profit > highest.profit ? month : highest)
        : null;
    const highlightedMonth = showProfit && !showSales ? highestProfitMonth : highestSalesMonth;
    const graphMonthColors = chartData.map(month =>
        month.month === highlightedMonth?.month ? "#dc2626" : "#94a3b8"
    );
    const renderPaceDetails = pace => (
        <div style={styles.metricGrid}>
            <div style={styles.metricBox}>
                <span style={styles.metricLabel}>Expected by day {pace.elapsedDays}</span>
                <span style={styles.metricValue}>{money(pace.expectedToDate)}</span>
            </div>
            <div style={styles.metricBox}>
                <span style={styles.metricLabel}>{pace.variance >= 0 ? "Ahead of pace" : "Behind pace"}</span>
                <span style={{ ...styles.metricValue, color: pace.variance >= 0 ? "#146c43" : "#dc3545" }}>
                    {money(Math.abs(pace.variance))}
                </span>
            </div>
            <div style={{ ...styles.metricBox, borderColor: "#b6d4fe", background: "#f5f9ff" }}>
                <span style={styles.metricLabel}>Projected month-end</span>
                <span style={{ ...styles.metricValue, color: "#0d6efd" }}>{money(pace.projectedMonthEnd)}</span>
            </div>
        </div>
    );

    const renderNeededResult = (amount, pace) => {
        const onTrack = pace.status === "On track";
        const notStarted = pace.status === "Not started";
        const badgeColors = notStarted
            ? { color: "#495057", background: "#e9ecef" }
            : onTrack
                ? { color: "#146c43", background: "#d1e7dd" }
                : { color: "#842029", background: "#f8d7da" };

        return <div style={styles.neededResult}>
            <span style={{ ...styles.statusBadge, ...badgeColors }}>{pace.status.toUpperCase()}</span>
            <p style={{ ...styles.neededValue, ...(amount === 0 ? { color: "#146c43" } : {}) }}>{money(amount)}</p>
        </div>;
    };

    const renderTargetGap = (current, target, prominent = false) => {
        const difference = Number(current || 0) - Number(target || 0);
        const exceeded = difference >= 0;

        return <span
            className={exceeded ? "text-success fw-bold" : "text-danger fw-bold"}
            style={prominent ? { fontSize: 30 } : undefined}
        >
            {exceeded ? `+${money(difference)}` : `-${money(Math.abs(difference))}`}
        </span>;
    };

    const renderSalesTrend = (current, average, lastMonth) => {
        const currentSales = Number(current || 0);
        const averageSales = Number(average || 0);
        const lastMonthSales = Number(lastMonth || 0);
        const reportMonth = report?.report_month?.month || selectedMonth;
        const now = new Date();
        const thisMonth = currentMonth();
        const [year, monthNumber] = String(reportMonth).split("-").map(Number);
        const daysInMonth = new Date(year, monthNumber, 0).getDate();
        const elapsedDays = reportMonth < thisMonth ? daysInMonth : reportMonth === thisMonth ? Math.min(now.getDate(), daysInMonth) : 0;
        const projected = elapsedDays > 0 ? (currentSales / elapsedDays) * daysInMonth : 0;
        const averageChange = averageSales > 0 ? ((currentSales - averageSales) / averageSales) * 100 : currentSales > 0 ? 100 : 0;
        const lastMonthChange = lastMonthSales > 0 ? ((currentSales - lastMonthSales) / lastMonthSales) * 100 : currentSales > 0 ? 100 : 0;
        const attainment = averageSales > 0 ? (projected / averageSales) * 100 : projected > 0 ? 100 : 0;
        const projectionStatus = attainment >= 100
            ? { label: "On Track", color: "#146c43", background: "#d1e7dd" }
            : attainment >= 80
                ? { label: "At Risk", color: "#92400e", background: "#fef3c7" }
                : { label: "Unlikely", color: "#b42318", background: "#fee2e2" };
        const comparisonColor = value => value >= 0 ? "#146c43" : "#dc3545";

        return <div style={{ minWidth: 180 }}>
            <div>
                <span style={{ ...styles.cellSalesLabel, marginBottom: 3 }}>Vs 3-month average</span>
                <strong style={{ color: comparisonColor(averageChange) }}>{averageChange >= 0 ? "+" : ""}{averageChange.toFixed(1)}%</strong>
            </div>
            <div style={{ marginTop: 7, paddingTop: 6, borderTop: "1px solid #cbd5e1" }}>
                <span style={{ ...styles.cellSalesLabel, marginBottom: 3 }}>Vs last month</span>
                <strong style={{ color: comparisonColor(lastMonthChange) }}>{lastMonthChange >= 0 ? "+" : ""}{lastMonthChange.toFixed(1)}%</strong>
            </div>
            {elapsedDays > 0 && <div style={{ marginTop: 7, paddingTop: 6, borderTop: "2px solid #cbd5e1" }}>
                <span style={{ ...styles.cellSalesLabel, marginBottom: 3 }}>{reportMonth === thisMonth ? "Projected month-end sales" : "Final sales"}</span>
                <strong style={{ display: "block", color: "#1d4ed8" }}>{money(projected)}</strong>
                {reportMonth === thisMonth && <>
                    <span style={{ display: "inline-flex", marginTop: 5, padding: "4px 8px", borderRadius: 999, color: projectionStatus.color, background: projectionStatus.background, fontSize: 10, fontWeight: 900 }}>{projectionStatus.label}</span>
                    <span style={{ display: "block", marginTop: 3, color: projectionStatus.color, fontSize: 10, fontWeight: 800 }}>{attainment.toFixed(1)}% of 3-month average</span>
                </>}
            </div>}
        </div>;
    };

    const saveMonthlyQuota = value => {
        setMonthlyQuota(value);
        const reportMonth = report?.report_month?.month || selectedMonth;
        const storageKey = `vip-monthly-quota-${id}-${reportMonth}`;
        if (value === "") {
            localStorage.removeItem(storageKey);
        } else {
            localStorage.setItem(storageKey, value);
        }
    };

    const submit = event => {
        event.preventDefault();
        loadReport(selectedMonth);
    };

    const move = amount => {
        const next = shiftMonth(selectedMonth, amount);
        setSelectedMonth(next);
        loadReport(next);
    };

    return (
        <div style={styles.page}>
            {loading && <LinearProgress color="success" />}
            <div style={styles.header}>
                {template.vip_color && <div style={{ ...styles.accent, background: template.vip_color }} />}
                <h3 className="fw-bold mb-1">{template.vip_name ? `${template.vip_name} Transaction History` : "VIP Transaction History"}</h3>
                <p className="text-muted mb-0">Monthly paid sales, recent history, and the exact amount needed to match last month</p>
            </div>

            <div style={styles.filter}>
                <Form onSubmit={submit}>
                    <div style={styles.filterRow}>
                        <Button variant="outline-secondary" type="button" onClick={() => move(-1)} disabled={loading}>Previous month</Button>
                        <Form.Group>
                            <Form.Label>Report month</Form.Label>
                            <Form.Control type="month" value={selectedMonth} onChange={event => setSelectedMonth(event.target.value)} required />
                        </Form.Group>
                        {showSales && <Form.Group>
                            <Form.Label>Monthly sales quota</Form.Label>
                            <Form.Control
                                type="number" min="0" step="0.01" placeholder="Enter target amount"
                                value={monthlyQuota} onChange={event => saveMonthlyQuota(event.target.value)}
                                style={{ minWidth: 190 }}
                            />
                        </Form.Group>}
                        <Button variant="primary" type="submit" disabled={loading}>View month</Button>
                        <Button variant="outline-primary" type="button" onClick={() => move(1)} disabled={loading}>Next month</Button>
                        <Button variant="outline-secondary" type="button" onClick={() => {
                            const month = currentMonth();
                            setSelectedMonth(month);
                            loadReport(month);
                        }} disabled={loading}>Current month</Button>
                    </div>
                </Form>
            </div>

            <div className="d-flex justify-content-center align-items-end gap-3 flex-wrap mb-3">
                <div className="btn-group" role="group" aria-label="Report display">
                    <Button
                        variant={reportView === "table" ? "dark" : "outline-dark"}
                        onClick={() => setReportView("table")}
                    >
                        Table
                    </Button>
                    <Button
                        variant={reportView === "graph" ? "dark" : "outline-dark"}
                        onClick={() => setReportView("graph")}
                    >
                        Graph
                    </Button>
                </div>
                <div className="btn-group" role="group" aria-label="Transaction data view">
                    {[{ key: "sales", label: "Sales" }, { key: "profit", label: "Profit" }, { key: "both", label: "Sales & Profit" }].map(option => (
                        <Button
                            key={option.key}
                            variant={viewMode === option.key ? "primary" : "outline-primary"}
                            onClick={() => setViewMode(option.key)}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
                <Form.Group style={{ minWidth: 210 }}>
                    <Form.Label className="mb-1">Order customer list by</Form.Label>
                    <Form.Select value={sortBy} onChange={event => setSortBy(event.target.value)}>
                        <option value="sales">Current sales — highest first</option>
                        <option value="profit">Current profit — highest first</option>
                        <option value="name">Customer name — A to Z</option>
                    </Form.Select>
                </Form.Group>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {report && <>
                <div style={styles.cards}>
                    {showSales && <>
                    <div style={styles.currentSalesCard}>
                        <span style={styles.currentBadge}>CURRENT SALES</span>
                        <p style={styles.label}>{report.report_month?.label || "Selected month"} paid sales</p>
                        <p style={{ ...styles.value, color: "#146c43", fontSize: 28 }}>{money(report.current_month_paid)}</p>
                    </div>
                    {quotaAmount > 0 && <div style={{ ...styles.card, borderColor: "#6f42c1" }}>
                        <p style={styles.label}>Monthly sales quota</p>
                        <p style={{ ...styles.value, color: "#6f42c1" }}>{money(quotaAmount)}</p>
                    </div>}
                    <div style={styles.card}>
                        <p style={styles.label}>{report.previous_months?.[0]?.label || "Last month"} paid sales</p>
                        <p style={styles.value}>{money(lastMonthPaid)}</p>
                    </div>
                    <div style={styles.card}>
                        <p style={styles.label}>Last 3 months average sales</p>
                        <p style={styles.value}>{money(lastThreeMonthAverage)}</p>
                    </div>
                    </>}
                    {showProfit && <section style={styles.profitSection}>
                        <div style={styles.profitHeader}>
                            <div>
                                <h4 style={styles.profitTitle}>Profit Performance</h4>
                                <p className="text-muted mb-0" style={{ fontSize: 12 }}>Completed customer orders for {report.report_month?.label}</p>
                            </div>
                            <span style={{ ...styles.statusBadge, color: profitDifference >= 0 ? "#146c43" : "#842029", background: profitDifference >= 0 ? "#d1e7dd" : "#f8d7da" }}>
                                {profitDifference >= 0 ? "ABOVE AVERAGE" : "BELOW AVERAGE"}
                            </span>
                        </div>
                        <div style={styles.profitGrid}>
                            <div style={{ ...styles.profitCard, border: "2px solid #6f42c1" }}>
                                <p style={styles.label}>Current month profit</p>
                                <p style={{ ...styles.profitValue, fontSize: 26 }}>{money(currentMonthProfit)}</p>
                            </div>
                            <div style={styles.profitCard}>
                                <p style={styles.label}>{report.previous_months?.[0]?.label || "Last month"} profit</p>
                                <p style={styles.profitValue}>{money(lastMonthProfit)}</p>
                            </div>
                            <div style={styles.profitCard}>
                                <p style={styles.label}>Average monthly profit</p>
                                <p style={styles.profitValue}>{money(averageMonthlyProfit)}</p>
                            </div>
                            <div style={styles.profitCard}>
                                <p style={styles.label}>{profitDifference >= 0 ? "Profit above average" : "Profit needed for average"}</p>
                                <p style={{ ...styles.profitValue, color: profitDifference >= 0 ? "#146c43" : "#dc3545" }}>
                                    {profitDifference >= 0 ? "+" : "-"}{money(Math.abs(profitDifference))}
                                </p>
                            </div>
                            <div style={styles.profitCard}>
                                <p style={styles.label}>Current profit margin</p>
                                <p style={styles.profitValue}>{currentProfitMargin.toFixed(2)}%</p>
                            </div>
                        </div>
                    </section>}
                    {showSales && <>
                    {quotaAmount > 0 && <div style={{ ...styles.neededCard, borderColor: quotaPace.status === "Behind" ? "#dc3545" : "#198754", background: quotaPace.status === "Behind" ? "#fff5f5" : "#f0fff4" }}>
                        <div style={{ flex: "1 1 650px" }}>
                            <h4 style={styles.alertTitle}>
                                Monthly quota <span style={{ ...styles.alertEmphasis, color: "#6f42c1" }}>SALES TARGET</span>
                            </h4>
                            <p className="mb-0 text-muted">Your custom target for <strong>{report.report_month?.label}</strong></p>
                            {renderPaceDetails(quotaPace)}
                        </div>
                        <div style={styles.neededResult}>
                            <span style={{ ...styles.statusBadge, color: quotaPace.status === "Behind" ? "#842029" : "#146c43", background: quotaPace.status === "Behind" ? "#f8d7da" : "#d1e7dd" }}>
                                {quotaPace.status.toUpperCase()}
                            </span>
                            {renderTargetGap(report.current_month_paid, quotaAmount, true)}
                        </div>
                    </div>}
                    <div style={{ ...styles.neededCard, ...(neededFromLastMonth === 0 ? { background: "#f0fff4", borderColor: "#198754" } : {}) }}>
                        <div style={{ flex: "1 1 650px" }}>
                            <h4 style={styles.alertTitle}>
                                Exact amount needed to match <span style={styles.alertEmphasis}>LAST MONTH</span>
                            </h4>
                            <p className="mb-0 text-muted">
                                Based on <strong>{report.previous_months?.[0]?.label || "last month"}</strong> sales
                            </p>
                            {renderPaceDetails(lastMonthPace)}
                        </div>
                        {renderNeededResult(neededFromLastMonth, lastMonthPace)}
                    </div>
                    <div style={{ ...styles.neededCard, ...(neededFromThreeMonthAverage === 0 ? { background: "#f0fff4", borderColor: "#198754" } : {}) }}>
                        <div style={{ flex: "1 1 650px" }}>
                            <h4 style={styles.alertTitle}>
                                Exact amount needed to reach the <span style={styles.alertEmphasis}>LAST 3-MONTH AVERAGE</span>
                            </h4>
                            <p className="mb-0 text-muted">Based on the <strong>previous three completed months</strong></p>
                            {renderPaceDetails(threeMonthPace)}
                        </div>
                        {renderNeededResult(neededFromThreeMonthAverage, threeMonthPace)}
                    </div>
                    </>}
                </div>

                {reportView === "graph" ? <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <div>
                            <h4 className="fw-bold mb-1">Monthly performance report</h4>
                            <p className="text-muted mb-0">Compare the selected month with the three previous months.</p>
                        </div>
                        <span className="badge bg-light text-dark border">{report.report_month?.label}</span>
                    </div>
                    <div style={styles.chartInsights}>
                        {showSales && highestSalesMonth && <div style={{ ...styles.chartInsight, borderLeft: "5px solid #dc2626", background: "#fff7f7" }}>
                            <span style={{ ...styles.metricLabel, color: "#dc2626" }}>TOP MONTH · HIGHEST PAID SALES</span>
                            <strong style={{ display: "block", fontSize: 18 }}>{highestSalesMonth.month}</strong>
                            <span style={{ color: "#dc2626", fontSize: 17, fontWeight: 800 }}>{money(highestSalesMonth.sales)}</span>
                        </div>}
                        {showProfit && highestProfitMonth && <div style={{ ...styles.chartInsight, borderLeft: "5px solid #f97316", background: "#fffaf5" }}>
                            <span style={{ ...styles.metricLabel, color: "#c2410c" }}>TOP MONTH · HIGHEST PROFIT</span>
                            <strong style={{ display: "block", fontSize: 18 }}>{highestProfitMonth.month}</strong>
                            <span style={{ color: "#c2410c", fontSize: 17, fontWeight: 800 }}>{money(highestProfitMonth.profit)}</span>
                        </div>}
                    </div>
                    {chartData.length > 0 ? <div style={{ overflowX: "auto" }}>
                        <Box sx={{ minWidth: 680, height: 440 }}>
                            <BarChart
                                dataset={chartData}
                                height={440}
                                margin={{ left: 85, right: 25, top: 65, bottom: 45 }}
                                grid={{ horizontal: true }}
                                barLabel={item => new Intl.NumberFormat("en-PH", {
                                    style: "currency", currency: "PHP", notation: "compact", maximumFractionDigits: 2,
                                }).format(Number(item.value || 0))}
                                series={chartSeries}
                                xAxis={[{
                                    scaleType: "band",
                                    dataKey: "month",
                                    ...(chartSeries.length === 1 ? {
                                        colorMap: {
                                            type: "ordinal",
                                            values: chartData.map(month => month.month),
                                            colors: graphMonthColors,
                                        },
                                    } : {}),
                                }]}
                                yAxis={[{
                                    min: 0,
                                    width: 80,
                                    valueFormatter: value => new Intl.NumberFormat("en-PH", {
                                        style: "currency", currency: "PHP", notation: "compact", maximumFractionDigits: 1,
                                    }).format(Number(value || 0)),
                                }]}
                                sx={{
                                    "& .MuiChartsGrid-line": { stroke: "#e5e7eb", strokeDasharray: "4 4" },
                                    "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": { stroke: "#cfd4da" },
                                    "& .MuiChartsAxis-tickLabel": { fill: "#596174", fontSize: 12 },
                                    "& .MuiBarLabel-root": { fill: "#ffffff", fontSize: 12, fontWeight: 800 },
                                }}
                            />
                        </Box>
                    </div> : <div className="text-center text-muted py-5">No graph data available for this month.</div>}
                </div> : <div style={styles.tableCard} className="table-responsive">
                    <table className="table table-bordered table-hover align-middle mb-0" style={{ minWidth: 1250 }}>
                        <thead style={styles.tableHeader}>
                            <tr>
                                <th style={styles.tableHeaderCell}>VIP Customer</th>
                                {months.map(month => <th style={styles.tableHeaderCell} key={month.month}>{month.label}</th>)}
                                {showSales && <>
                                <th style={styles.tableHeaderCell}>Last 3-month average</th>
                                <th style={styles.tableHeaderCell}>3-month average gap</th>
                                <th style={styles.tableHeaderCell}>Last month gap</th>
                                <th style={{ ...styles.tableHeaderCell, minWidth: 210 }}>Status / Sales Trend</th>
                                </>}
                                {showProfit && <>
                                <th style={styles.tableHeaderCell}>Average profit</th>
                                <th style={styles.tableHeaderCell}>Profit gap</th>
                                <th style={styles.tableHeaderCell}>Last month profit gap</th>
                                </>}
                                <th style={styles.actionHeader} aria-label="View graph" />
                            </tr>
                        </thead>
                        <tbody>
                            {sortedCustomers.map(customer => {
                                const history = new Map((customer.previous_months || []).map(month => [month.month, month]));
                                const customerLastMonthPaid = Number(customer.previous_months?.[0]?.paid_amount || 0);
                                const customerLastMonthProfit = Number(customer.previous_months?.[0]?.profit_amount || 0);
                                const customerPreviousMonths = customer.previous_months || [];
                                const customerThreeMonthAverage = customerPreviousMonths.length
                                    ? customerPreviousMonths.reduce((total, month) => total + Number(month.paid_amount || 0), 0) / customerPreviousMonths.length
                                    : 0;
                                const customerId = customer.customer_id || customer.vip_customer_transaction_id;
                                return <tr key={customerId}>
                                    <td>
                                        <div style={styles.customer}>{customer.customer_name || "Unnamed customer"}</div>
                                        <div style={styles.meta}>{customer.store_name || "No store name"}</div>
                                    </td>
                                    {months.map((month, index) => {
                                        const monthHistory = history.get(month.month);
                                        return <td key={month.month} className={index === 0 ? "table-success" : ""}>
                                            {showSales && <>
                                            <span style={styles.cellSalesLabel}>Sales</span>
                                            <strong>{money(index === 0 ? customer.current_paid : monthHistory?.paid_amount)}</strong>
                                            </>}
                                            {showProfit && <span style={{ ...styles.cellProfit, marginTop: showSales ? 5 : 0, fontSize: showSales ? 12 : 14 }}>
                                                {showSales ? "Profit: " : ""}{money(index === 0 ? customer.current_profit : monthHistory?.profit_amount)}
                                            </span>}
                                        </td>;
                                    })}
                                    {showSales && <>
                                    <td>{money(customerThreeMonthAverage)}</td>
                                    <td>{renderTargetGap(customer.current_paid, customerThreeMonthAverage)}</td>
                                    <td>{renderTargetGap(customer.current_paid, customerLastMonthPaid)}</td>
                                    <td>{renderSalesTrend(customer.current_paid, customerThreeMonthAverage, customerLastMonthPaid)}</td>
                                    </>}
                                    {showProfit && <>
                                    <td style={{ color: "#6f42c1", fontWeight: 700 }}>{money(customer.average_monthly_profit)}</td>
                                    <td>{renderTargetGap(customer.current_profit, customer.average_monthly_profit)}</td>
                                    <td>{renderTargetGap(customer.current_profit, customerLastMonthProfit)}</td>
                                    </>}
                                    <td style={styles.actionCell}>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            title="View graph"
                                            aria-label={`View graph for ${customer.customer_name || "customer"}`}
                                            onClick={() => navigate(`/vipTransactionHistory/${id}/customer/${customerId}?month=${report.report_month?.month || selectedMonth}`)}
                                            style={{ width: 34, height: 32, padding: 0, fontSize: 16, lineHeight: 1 }}
                                        >
                                            <BarChartIcon fontSize="small" />
                                        </Button>
                                    </td>
                                </tr>;
                            })}
                            {!loading && customers.length === 0 && <tr><td colSpan={months.length + 2 + (showSales ? 4 : 0) + (showProfit ? 3 : 0)} className="text-center text-muted py-4">No VIP customers found for this template.</td></tr>}
                        </tbody>
                        <tfoot>
                            <tr style={styles.totalRow}>
                                <td style={styles.totalCell}>
                                    <span style={styles.totalLabel}>All customers</span>
                                    <span style={styles.totalHint}>VIP totals</span>
                                </td>
                                <td style={styles.totalCell}>
                                    {showSales && <strong>{money(report.current_month_paid)}</strong>}
                                    {showProfit && <span style={{ ...styles.cellProfit, marginTop: showSales ? 5 : 0 }}>{showSales ? "Profit: " : ""}{money(currentMonthProfit)}</span>}
                                </td>
                                {(report.previous_months || []).map(month => <td style={styles.totalCell} key={month.month}>
                                    {showSales && <strong>{money(month.paid_amount)}</strong>}
                                    {showProfit && <span style={{ ...styles.cellProfit, marginTop: showSales ? 5 : 0 }}>{showSales ? "Profit: " : ""}{money(month.profit_amount)}</span>}
                                </td>)}
                                {showSales && <>
                                <td style={styles.totalCell}>{money(lastThreeMonthAverage)}</td>
                                <td style={styles.totalCell}>{renderTargetGap(report.current_month_paid, lastThreeMonthAverage)}</td>
                                <td style={styles.totalCell}>{renderTargetGap(report.current_month_paid, lastMonthPaid)}</td>
                                <td style={styles.totalCell}>{renderSalesTrend(report.current_month_paid, lastThreeMonthAverage, lastMonthPaid)}</td>
                                </>}
                                {showProfit && <>
                                <td style={{ ...styles.totalCell, color: "#6f42c1" }}>{money(averageMonthlyProfit)}</td>
                                <td style={styles.totalCell}>{renderTargetGap(currentMonthProfit, averageMonthlyProfit)}</td>
                                <td style={styles.totalCell}>{renderTargetGap(currentMonthProfit, lastMonthProfit)}</td>
                                </>}
                                <td style={{ ...styles.totalCell, ...styles.actionCell, background: "#dce5ec" }} />
                            </tr>
                        </tfoot>
                    </table>
                </div>}
            </>}
        </div>
    );
};

export default VIPTransactionHistory;
