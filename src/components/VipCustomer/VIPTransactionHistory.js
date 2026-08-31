import React, { useCallback, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import MuiButton from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNavigate, useParams } from "react-router-dom";
import VipCustomerService from "./VipCustomerService";
import VipCustomerTransactionService from "./VipCustomerTransactionService";
import ImpactGroupSelect from "../Common/ImpactGroupSelect";
import "../Reports/ProductReport.css";
import "./VIPTransactionHistory.css";

const money = value => Number(value || 0).toLocaleString("en-PH", {
    style: "currency", currency: "PHP", minimumFractionDigits: 2, maximumFractionDigits: 2,
});
const signedMoney = value => `${Number(value || 0) > 0 ? "+" : Number(value || 0) < 0 ? "-" : ""}${money(Math.abs(Number(value || 0)))}`;
const profitMargin = (profit, sales) => {
    const salesAmount = Number(sales || 0);
    return salesAmount > 0 ? (Number(profit || 0) / salesAmount) * 100 : 0;
};
const profitMarginLabel = (profit, sales) => `${profitMargin(profit, sales).toFixed(2)}%`;
const impactGroupLabels = {
    all: "All results",
    winning: "Winning customers",
    highest_sales: "Highest sales",
    declining: "Declining customers",
    missing: "Missing customers",
};
const comparisonAmount = (comparison, fallback) => {
    if (comparison && typeof comparison === "object") {
        return Number(comparison.amount ?? comparison.paid_difference ?? comparison.paid ?? comparison.difference ?? comparison.value ?? fallback ?? 0);
    }
    return Number(comparison ?? fallback ?? 0);
};

const currentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
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
    cellProfitMargin: { display: "block", color: "#0f766e", fontSize: 12, fontWeight: 700, marginTop: 5 },
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
    actionHeader: { position: "sticky", right: 0, zIndex: 3, width: 48, minWidth: 48, textAlign: "center", backgroundColor: "#212529", color: "#ffffff", borderColor: "#495057", boxShadow: "-3px 0 6px rgba(15, 23, 42, .12)" },
    actionCell: { position: "sticky", right: 0, zIndex: 2, width: 48, minWidth: 48, textAlign: "center", background: "#ffffff", boxShadow: "-3px 0 6px rgba(15, 23, 42, .1)" },
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
    const [visibleMetrics, setVisibleMetrics] = useState({ sales: true, profit: false, profitMargin: false });
    const [reportView, setReportView] = useState("table");
    const [impactGroup, setImpactGroup] = useState("all");
    const [search, setSearch] = useState("");
    const [selectedRecoveryIds, setSelectedRecoveryIds] = useState([]);
    const [appliedFilters, setAppliedFilters] = useState({ month: currentMonth(), impactGroup: "all", search: "" });

    const loadReport = useCallback((month, request = {}) => {
        const requestedImpactGroup = request.impactGroup || "all";
        const requestedSearch = String(request.search || "").trim();
        setLoading(true);
        setError("");
        return VipCustomerTransactionService.fetchVipCustomerMonthlyPaid(id, month, undefined, {
            impact_group: requestedImpactGroup,
            limit: 100,
            ...(requestedSearch ? { search: requestedSearch } : {}),
        })
            .then(response => {
                setReport(response.data);
                const reportMonth = response.data?.report_month?.month || month;
                setAppliedFilters({ month: reportMonth, impactGroup: requestedImpactGroup, search: requestedSearch });
                setMonthlyQuota(localStorage.getItem(`vip-monthly-quota-${id}-${reportMonth}`) || "");
                setSelectedRecoveryIds([]);
            })
            .catch(requestError => {
                setReport(null);
                setError(requestError.response?.data?.message || "Unable to load transaction history. Please try again.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        loadReport(currentMonth(), { impactGroup: "all" });
        VipCustomerService.get(id).then(response => setTemplate(response.data)).catch(() => {});
    }, [id, loadReport]);

    const months = report ? [report.report_month, ...(report.previous_months || [])] : [];
    const customers = Array.isArray(report?.data) ? report.data : [];
    const impactCounts = report?.impact_counts || {};
    const winningCount = Number(impactCounts.winning ?? impactCounts.winning_customers ?? 0);
    const decliningCount = Number(impactCounts.declining ?? impactCounts.losing ?? impactCounts.declining_customers ?? 0);
    const missingCount = Number(impactCounts.missing ?? impactCounts.missing_customers ?? 0);
    const filteredTotal = Number(report?.filtered_total ?? customers.length);
    const impactGroupFor = customer => {
        const status = String(customer.impact_status || customer.status || "unchanged").toLowerCase();
        if (["winning", "growing", "positive", "above_usual", "new_or_returning"].includes(status)) return "winning";
        if (["declining", "losing", "negative", "below_usual"].includes(status)) return "declining";
        if (status === "missing") return "missing";
        return "other";
    };
    const impactGroupDetails = {
        winning: { label: "Winning customers", description: "Current paid sales exceed the previous three-month average." },
        declining: { label: "Declining customers", description: "Current paid sales are below the previous three-month average." },
        missing: { label: "Missing customers", description: "No current payment, but a previous three-month average exists." },
        other: { label: "Other customers", description: "Customers without a winning, declining, or missing verdict." },
    };
    const customerGroups = ["winning", "declining", "missing", "other"]
        .map(key => ({ key, ...impactGroupDetails[key], customers: customers.filter(customer => impactGroupFor(customer) === key) }))
        .filter(group => group.customers.length > 0);
    const showImpactGrouping = customerGroups.length > 1;
    const customersInGroup = key => customerGroups.find(group => group.key === key)?.customers || [];
    const winningSalesVsLastMonth = customersInGroup("winning").reduce((total, customer) => {
        const lastMonth = Number(customer.previous_months?.[0]?.paid_amount || 0);
        return total + comparisonAmount(customer.paid_vs_last_month, Number(customer.current_paid || 0) - lastMonth);
    }, 0);
    const decliningNeededForLastMonth = customersInGroup("declining").reduce((total, customer) => {
        const lastMonth = Number(customer.previous_months?.[0]?.paid_amount || 0);
        return total + Math.max(lastMonth - Number(customer.current_paid || 0), 0);
    }, 0);
    const missingExpectedFromLastMonth = customersInGroup("missing").reduce(
        (total, customer) => total + Number(customer.previous_months?.[0]?.paid_amount || 0),
        0
    );
    const netSalesVsLastMonth = customers.reduce((total, customer) => {
        const lastMonth = Number(customer.previous_months?.[0]?.paid_amount || 0);
        return total + comparisonAmount(customer.paid_vs_last_month, Number(customer.current_paid || 0) - lastMonth);
    }, 0);
    const hasMissingRisk = customersInGroup("missing").length > 0;
    const hasDecliningRisk = customersInGroup("declining").length > 0;
    const reportVerdict = netSalesVsLastMonth > 0
        ? {
            tone: hasMissingRisk || hasDecliningRisk ? "watch" : "positive",
            label: "Sales ahead of last month",
            message: hasMissingRisk || hasDecliningRisk
                ? "Overall sales improved, but declining and missing customers still need follow-up."
                : "The displayed customers are contributing more paid sales than last month.",
        }
        : netSalesVsLastMonth < 0
            ? {
                tone: hasMissingRisk ? "critical" : "negative",
                label: "Sales recovery needed",
                message: hasMissingRisk
                    ? "Sales are below last month, with missing customers creating the most urgent recovery opportunity."
                    : "The displayed customers need additional sales to recover last month's performance.",
            }
            : { tone: "neutral", label: "Sales are level", message: "The displayed customers are matching last month's paid sales." };
    const timingMonth = report?.report_month?.month || selectedMonth;
    const timingToday = new Date();
    const activeMonth = currentMonth();
    const [timingYear, timingMonthNumber] = String(timingMonth).split("-").map(Number);
    const timingDaysInMonth = new Date(timingYear, timingMonthNumber, 0).getDate();
    const timingElapsedDays = timingMonth < activeMonth ? timingDaysInMonth : timingMonth === activeMonth ? Math.min(timingToday.getDate(), timingDaysInMonth) : 0;
    const monthCompletion = timingDaysInMonth ? (timingElapsedDays / timingDaysInMonth) * 100 : 0;
    const displayedCurrentSales = customers.reduce((total, customer) => total + Number(customer.current_paid || 0), 0);
    const displayedLastMonthSales = customers.reduce((total, customer) => total + Number(customer.previous_months?.[0]?.paid_amount || 0), 0);
    const projectedDisplayedSales = timingElapsedDays > 0 ? (displayedCurrentSales / timingElapsedDays) * timingDaysInMonth : 0;
    const projectedNetVsLastMonth = projectedDisplayedSales - displayedLastMonthSales;
    const isCurrentReportMonth = timingMonth === activeMonth;
    const asOfLabel = isCurrentReportMonth
        ? timingToday.toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })
        : report?.report_month?.label || timingMonth;
    const lastMonthPaid = Number(report?.previous_months?.[0]?.paid_amount || 0);
    const previousMonthTotals = report?.previous_months || [];
    const lastThreeMonthAverage = previousMonthTotals.length
        ? previousMonthTotals.reduce((total, month) => total + Number(month.paid_amount || 0), 0) / previousMonthTotals.length
        : 0;
    const salesVsLastMonth = Number(report?.current_month_paid || 0) - lastMonthPaid;
    const salesVsThreeMonthAverage = Number(report?.current_month_paid || 0) - lastThreeMonthAverage;
    const recoveryCustomerKey = customer => String(customer.customer_id || customer.vip_customer_transaction_id || "");
    const recoveryTargetFor = customer => {
        const currentPaid = Number(customer.current_paid || 0);
        const previousPaid = Number(customer.previous_months?.[0]?.paid_amount || 0);
        return impactGroupFor(customer) === "missing" ? previousPaid : Math.max(previousPaid - currentPaid, 0);
    };
    const selectedRecoveryCustomers = customers.filter(customer => selectedRecoveryIds.includes(recoveryCustomerKey(customer)) && ["declining", "missing"].includes(impactGroupFor(customer)));
    const recoveryCustomersFor = group => customers.filter(customer => impactGroupFor(customer) === group && recoveryTargetFor(customer) > 0);
    const decliningRecoveryCustomers = recoveryCustomersFor("declining");
    const missingRecoveryCustomers = recoveryCustomersFor("missing");
    const allRecoverySelectedFor = groupCustomers => groupCustomers.length > 0 && groupCustomers.every(customer => selectedRecoveryIds.includes(recoveryCustomerKey(customer)));
    const potentialRecoverySales = selectedRecoveryCustomers.reduce((total, customer) => total + recoveryTargetFor(customer), 0);
    const projectedSalesWithRecovery = Number(report?.current_month_paid || 0) + potentialRecoverySales;
    const projectedRecoveryVsLastMonth = projectedSalesWithRecovery - lastMonthPaid;
    const toggleRecoveryCustomer = customer => {
        const key = recoveryCustomerKey(customer);
        setSelectedRecoveryIds(current => current.includes(key) ? current.filter(value => value !== key) : [...current, key]);
    };
    const toggleRecoveryGroup = groupCustomers => {
        const eligibleKeys = groupCustomers.map(recoveryCustomerKey);
        const allSelected = allRecoverySelectedFor(groupCustomers);
        setSelectedRecoveryIds(current => allSelected
            ? current.filter(key => !eligibleKeys.includes(key))
            : [...new Set([...current, ...eligibleKeys])]);
    };
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
    const quotaPace = getPace(quotaAmount);
    const showSales = visibleMetrics.sales;
    const showProfit = visibleMetrics.profit;
    const showProfitMargin = visibleMetrics.profitMargin;
    const tableColumnCount = months.length + 3 + (showSales ? 2 : 0) + (showProfit ? 3 : 0) + (showProfitMargin ? 1 : 0);
    const toggleMetric = metric => setVisibleMetrics(current => ({ ...current, [metric]: !current[metric] }));
    const chartData = report ? [
        {
            month: report.report_month?.label || "Selected month",
            sales: Number(report.current_month_paid || 0),
            profit: Number(report.current_month_profit || 0),
        },
        ...(report.previous_months || []).map(month => ({
            month: month.label,
            sales: Number(month.paid_amount || 0),
            profit: Number(month.profit_amount || 0),
        })),
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
        loadReport(selectedMonth, { impactGroup, search });
    };

    const applyImpactFilter = group => {
        setImpactGroup(group);
        loadReport(selectedMonth, { impactGroup: group, search });
    };

    return (
        <div className="pr-page" style={styles.page}>
            {loading && <LinearProgress color="success" />}
            <div style={styles.header}>
                {template.vip_color && <div style={{ ...styles.accent, background: template.vip_color }} />}
                <h3 className="fw-bold mb-1">{template.vip_name ? `${template.vip_name} Transaction History` : "VIP Transaction History"}</h3>
                <p className="text-muted mb-0">Monthly paid sales, recent history, and the exact amount needed to match last month</p>
            </div>

            <section className="pr-filter">
                <Form onSubmit={submit}>
                    <div className="pr-filter__header">
                        <strong>Customer impact filters</strong>
                        <span>Impact status is based on the selected month compared with the previous three-month average. Last month is secondary context.</span>
                    </div>
                    <div className="ct-filter-grid vip-impact-filter-grid">
                        <TextField fullWidth size="small" type="month" value={selectedMonth} onChange={event => setSelectedMonth(event.target.value)} label="Report month" InputLabelProps={{ shrink: true }} required />
                        <ImpactGroupSelect value={impactGroup} onChange={event => setImpactGroup(event.target.value)} options={Object.entries(impactGroupLabels).map(([value, label]) => ({ value, label }))}/>
                        <MuiButton variant="contained" type="submit" disabled={loading}>Compare customers</MuiButton>
                    </div>
                </Form>
                {loading && <LinearProgress className="pr-progress" />}
            </section>

            {report && showSales && <div className="vip-primary-sales-row" style={styles.cards}>
                <div className="vip-history-current-kpi" style={styles.card}>
                    <div className="vip-history-current-kpi__top"><p>{report.report_month?.label || "Selected month"} paid sales</p><span>Current</span></div>
                    <strong className={potentialRecoverySales > 0 ? "vip-current-sales-kpi__actual--superseded" : ""}>{money(report.current_month_paid)}</strong>
                    <small>Selected-month actual paid sales</small>
                    {potentialRecoverySales > 0 && <div className="vip-current-sales-kpi__projection"><span>New amount with selected plan</span><strong>{money(projectedSalesWithRecovery)}</strong><small>+{money(potentialRecoverySales)} potential recovery</small></div>}
                </div>
                <div style={styles.card}>
                    <p style={styles.label}>{report.previous_months?.[0]?.label || "Last month"} paid sales</p>
                    <p style={styles.value}>{money(lastMonthPaid)}</p>
                    <div className="vip-summary-comparison"><span>Selected month change</span><strong className={salesVsLastMonth >= 0 ? "pt-positive" : "pr-negative"}>{signedMoney(salesVsLastMonth)}</strong></div>
                </div>
                <div style={styles.card}>
                    <p style={styles.label}>Last 3 months average sales</p>
                    <p style={styles.value}>{money(lastThreeMonthAverage)}</p>
                    <div className="vip-summary-comparison"><span>Selected month change</span><strong className={salesVsThreeMonthAverage >= 0 ? "pt-positive" : "pr-negative"}>{signedMoney(salesVsThreeMonthAverage)}</strong></div>
                </div>
            </div>}

            <section className="pr-summary ct-summary">
                <div className="vip-impact-summary vip-impact-summary--winning" role="button" tabIndex="0" onClick={() => applyImpactFilter("winning")} onKeyDown={event => event.key === "Enter" && applyImpactFilter("winning")}><TrendingUpRoundedIcon/><div><span>Winning customers</span><strong>{winningCount.toLocaleString()}</strong><em><b>{signedMoney(winningSalesVsLastMonth)}</b> sales change vs last month</em><small>View winning customers →</small></div></div>
                <div className="vip-impact-summary vip-impact-summary--declining" role="button" tabIndex="0" onClick={() => applyImpactFilter("declining")} onKeyDown={event => event.key === "Enter" && applyImpactFilter("declining")}><TrendingDownRoundedIcon/><div><span>Declining customers</span><strong>{decliningCount.toLocaleString()}</strong><em><b>-{money(decliningNeededForLastMonth)}</b> sales gap to match last month</em><small>View declining customers →</small></div><div className="vip-impact-select-all" onClick={event => event.stopPropagation()} onKeyDown={event => event.stopPropagation()}><Form.Check type="checkbox" id="select-all-declining-recovery" label="Select all" checked={allRecoverySelectedFor(decliningRecoveryCustomers)} disabled={!decliningRecoveryCustomers.length} onChange={() => toggleRecoveryGroup(decliningRecoveryCustomers)}/></div></div>
                <div className="vip-impact-summary vip-impact-summary--missing" role="button" tabIndex="0" onClick={() => applyImpactFilter("missing")} onKeyDown={event => event.key === "Enter" && applyImpactFilter("missing")}><PersonOffOutlinedIcon/><div><span>Missing customers</span><strong>{missingCount.toLocaleString()}</strong><em><b>-{money(missingExpectedFromLastMonth)}</b> expected lost sales vs last month</em><small>View missing customers →</small></div><div className="vip-impact-select-all" onClick={event => event.stopPropagation()} onKeyDown={event => event.stopPropagation()}><Form.Check type="checkbox" id="select-all-missing-recovery" label="Select all" checked={allRecoverySelectedFor(missingRecoveryCustomers)} disabled={!missingRecoveryCustomers.length} onChange={() => toggleRecoveryGroup(missingRecoveryCustomers)}/></div></div>
            </section>
            <section className={`vip-recovery-simulator ${selectedRecoveryCustomers.length ? "vip-recovery-simulator--active" : ""}`}>
                <div><span>What-if recovery plan</span><strong>{selectedRecoveryCustomers.length ? `${selectedRecoveryCustomers.length} customer${selectedRecoveryCustomers.length === 1 ? "" : "s"} selected` : "Select declining or missing customers in the table"}</strong><small>Declining targets their last-month gap; missing targets their full last-month sales.</small></div>
                <div><span>Potential recovered sales</span><strong className="vip-recovery-simulator__amount">+{money(potentialRecoverySales)}</strong></div>
                <div><span>Projected selected-month sales</span><strong>{money(projectedSalesWithRecovery)}</strong><small className={projectedRecoveryVsLastMonth >= 0 ? "pt-positive" : "pr-negative"}>{projectedRecoveryVsLastMonth >= 0 ? "+" : "-"}{money(Math.abs(projectedRecoveryVsLastMonth))} vs last month</small></div>
            </section>
            <section className={`vip-report-verdict vip-report-verdict--${reportVerdict.tone}`}>
                <div className="vip-report-verdict__icon">{netSalesVsLastMonth >= 0 ? <TrendingUpRoundedIcon/> : <TrendingDownRoundedIcon/>}</div>
                <div><span>Report verdict · versus last month · as of {asOfLabel}</span><h4>{reportVerdict.label}</h4><p>{reportVerdict.message}</p><p className="vip-report-verdict__action"><b>Recommended action:</b> Recover {money(decliningNeededForLastMonth)} from declining customers and contact {customersInGroup("missing").length} missing customers.</p></div>
                <div className="vip-report-verdict__numbers"><strong>{signedMoney(netSalesVsLastMonth)}</strong>{isCurrentReportMonth && <><small>{monthCompletion.toFixed(0)}% of month elapsed</small><em><b>{signedMoney(projectedNetVsLastMonth)}</b> projected month-end vs last month</em></>}</div>
            </section>
            <div className="pci-benchmark-note"><strong>Primary impact benchmark</strong><span>Winning, declining, and missing verdicts are based on the selected month versus the previous 3-month average.</span><InfoOutlinedIcon className="vip-benchmark-info" titleAccess="Status uses the previous 3-month average. Summary amounts and the overall verdict compare paid sales with last month."/></div>

            <div className="d-flex justify-content-center align-items-end gap-3 flex-wrap mb-3 vip-history-controls">
                {showSales && <Form.Group className="vip-history-quota">
                    <Form.Label className="mb-1">Monthly sales quota</Form.Label>
                    <Form.Control type="number" min="0" step="0.01" placeholder="Enter target amount" value={monthlyQuota} onChange={event => saveMonthlyQuota(event.target.value)} />
                </Form.Group>}
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
                <div className="d-flex align-items-center gap-3 px-3 py-2 border rounded bg-light" role="group" aria-label="Transaction data view">
                    <strong className="small text-muted">Show:</strong>
                    {[['sales', 'Sales'], ['profit', 'Profit'], ['profitMargin', 'Profit margin']].map(([key, label]) => (
                        <Form.Check
                            key={key}
                            inline
                            className="mb-0"
                            type="checkbox"
                            id={`vip-metric-${key}`}
                            label={label}
                            checked={visibleMetrics[key]}
                            onChange={() => toggleMetric(key)}
                        />
                    ))}
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {report && <>
                <div style={(showProfit || (showSales && quotaAmount > 0)) ? styles.cards : { display: "none" }}>
                    {showSales && <>
                    {quotaAmount > 0 && <div style={{ ...styles.card, borderColor: "#6f42c1" }}>
                        <p style={styles.label}>Monthly sales quota</p>
                        <p style={{ ...styles.value, color: "#6f42c1" }}>{money(quotaAmount)}</p>
                    </div>}
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
                </div> : <section className="pr-card">
                    <header>
                        <div><h2>{impactGroupLabels[appliedFilters.impactGroup] || "VIP customers"}</h2><p>{filteredTotal.toLocaleString()} customers · selected month {appliedFilters.month}</p></div>
                        <Form onSubmit={submit} className="ct-table-tools">
                            <TextField className="pr-search" size="small" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search customer..." InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon/></InputAdornment> }}/>
                        </Form>
                    </header>
                    <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle mb-0 vip-history-table">
                        <thead style={styles.tableHeader}>
                            <tr>
                                <th className="vip-rank-column" style={styles.tableHeaderCell}>Rank movement</th>
                                <th className="vip-customer-column" style={styles.tableHeaderCell}>VIP Customer</th>
                                {months.map((month, index) => <th className={index === 0 ? "vip-current-sales-heading" : ""} style={styles.tableHeaderCell} key={month.month}>{month.label}</th>)}
                                {showSales && <>
                                <th style={styles.tableHeaderCell}>Last 3-month average</th>
                                <th className="vip-trend-column" style={styles.tableHeaderCell}>Status / Sales Trend</th>
                                </>}
                                {showProfit && <>
                                <th style={styles.tableHeaderCell}>Average profit</th>
                                <th style={styles.tableHeaderCell}>Profit gap</th>
                                <th style={styles.tableHeaderCell}>Last month profit gap</th>
                                </>}
                                {showProfitMargin && <th style={styles.tableHeaderCell}>Average margin</th>}
                                <th style={styles.actionHeader} aria-label="View reports">View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customerGroups.map(group => <React.Fragment key={group.key}>
                            {showImpactGrouping && <tr className={`vip-impact-group-row vip-impact-group-row--${group.key}`}><td colSpan={tableColumnCount}><div><strong>{group.label}</strong><span>{group.description}</span></div><b>{group.customers.length}</b></td></tr>}
                            {group.customers.map(customer => {
                                const history = new Map((customer.previous_months || []).map(month => [month.month, month]));
                                const customerLastMonthPaid = Number(customer.previous_months?.[0]?.paid_amount || 0);
                                const customerLastMonthProfit = Number(customer.previous_months?.[0]?.profit_amount || 0);
                                const customerPreviousMonths = customer.previous_months || [];
                                const customerThreeMonthAverage = customerPreviousMonths.length
                                    ? customerPreviousMonths.reduce((total, month) => total + Number(month.paid_amount || 0), 0) / customerPreviousMonths.length
                                    : 0;
                                const rankMovement = customer.rank_movement || {};
                                const currentRank = rankMovement.current_rank ?? customer.current_rank ?? customer.rank ?? "—";
                                const previousRank = rankMovement.previous_rank ?? customer.previous_rank ?? customer.last_month_rank ?? "—";
                                const movement = Number(rankMovement.movement ?? rankMovement.change ?? customer.rank_change ?? 0);
                                const impactStatus = String(customer.impact_status || customer.status || "unchanged").toLowerCase();
                                const averageGap = comparisonAmount(customer.paid_vs_three_month_average, Number(customer.current_paid || 0) - customerThreeMonthAverage);
                                const lastMonthGap = comparisonAmount(customer.paid_vs_last_month, Number(customer.current_paid || 0) - customerLastMonthPaid);
                                const customerId = customer.customer_id || customer.vip_customer_transaction_id;
                                return <tr key={customerId} className={`vip-impact-customer-row vip-impact-customer-row--${group.key}`}>
                                    <td><div className="pt-rank-move"><span className="pr-rank">{currentRank}</span><div><small>was #{previousRank}</small><strong className={movement < 0 ? "pr-negative" : "pt-positive"}>{movement > 0 ? "▲ " : movement < 0 ? "▼ " : ""}{Math.abs(movement) || "—"}</strong></div></div></td>
                                    <td>
                                        <div style={styles.customer}>{customer.customer_name || "Unnamed customer"}</div>
                                        <div style={styles.meta}>{customer.store_name || "No store name"}</div>
                                    </td>
                                    {months.map((month, index) => {
                                        const monthHistory = history.get(month.month);
                                        return <td key={month.month} className={index === 0 ? "table-success vip-current-sales-cell" : ""}>
                                            {showSales && <>
                                            <span style={styles.cellSalesLabel}>Sales</span>
                                            <strong className={index === 0 ? "vip-current-sales-value" : ""}>{money(index === 0 ? customer.current_paid : monthHistory?.paid_amount)}</strong>
                                            {index === 1 && <span className={`vip-inline-gap ${lastMonthGap >= 0 ? "vip-inline-gap--up" : "vip-inline-gap--down"}`}>
                                                <small>Current month gap</small>{lastMonthGap >= 0 ? "+" : "-"}{money(Math.abs(lastMonthGap))}
                                            </span>}
                                            {index === 1 && ["declining", "missing"].includes(impactStatus) && <Form.Check
                                                className="vip-recovery-checkbox vip-recovery-checkbox--inline"
                                                type="checkbox"
                                                id={`recovery-${recoveryCustomerKey(customer)}`}
                                                checked={selectedRecoveryIds.includes(recoveryCustomerKey(customer))}
                                                disabled={recoveryTargetFor(customer) <= 0}
                                                onChange={() => toggleRecoveryCustomer(customer)}
                                                label="Include in plan"
                                            />}
                                            </>}
                                            {showProfit && <span style={{ ...styles.cellProfit, marginTop: showSales ? 5 : 0, fontSize: showSales ? 12 : 14 }}>
                                                {showSales ? "Profit: " : ""}{money(index === 0 ? customer.current_profit : monthHistory?.profit_amount)}
                                            </span>}
                                            {showProfitMargin && <span style={{ ...styles.cellProfitMargin, marginTop: showSales || showProfit ? 5 : 0, fontSize: showSales || showProfit ? 12 : 14 }}>
                                                Margin {profitMarginLabel(index === 0 ? customer.current_profit : monthHistory?.profit_amount, index === 0 ? customer.current_paid : monthHistory?.paid_amount)}
                                            </span>}
                                        </td>;
                                    })}
                                    {showSales && <>
                                    <td><strong>{money(customerThreeMonthAverage)}</strong><span className={`vip-inline-gap ${averageGap >= 0 ? "vip-inline-gap--up" : "vip-inline-gap--down"}`}><small>Current month gap</small>{averageGap >= 0 ? "+" : "-"}{money(Math.abs(averageGap))}</span></td>
                                    <td><span className={`pci-status vip-impact-status pci-status--${impactStatus}`}>{impactStatus.replaceAll("_", " ")}</span>{renderSalesTrend(customer.current_paid, customerThreeMonthAverage, customerLastMonthPaid)}</td>
                                    </>}
                                    {showProfit && <>
                                    <td style={{ color: "#6f42c1", fontWeight: 700 }}>{money(customer.average_monthly_profit)}</td>
                                    <td>{renderTargetGap(customer.current_profit, customer.average_monthly_profit)}</td>
                                    <td>{renderTargetGap(customer.current_profit, customerLastMonthProfit)}</td>
                                    </>}
                                    {showProfitMargin && <td style={{ color: "#0f766e", fontWeight: 700 }}>{profitMarginLabel(customer.average_monthly_profit, customerThreeMonthAverage)}</td>}
                                    <td style={styles.actionCell}>
                                        <div className="d-flex flex-column align-items-center gap-1">
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
                                        {customer.customer_id && <Button
                                            variant="outline-success"
                                            size="sm"
                                            title="View product sales history"
                                            aria-label={`View product sales history for ${customer.customer_name || "customer"}`}
                                            onClick={() => {
                                                const params = new URLSearchParams({
                                                    customer_id: String(customer.customer_id),
                                                    month: report.report_month?.month || selectedMonth,
                                                    customer_name: customer.customer_name || "",
                                                });
                                                navigate(`/productMonthlySalesHistory?${params.toString()}`);
                                            }}
                                            style={{ width: 34, height: 32, padding: 0, fontSize: 16, lineHeight: 1 }}
                                        >
                                            <Inventory2OutlinedIcon fontSize="small" />
                                        </Button>}
                                        </div>
                                    </td>
                                </tr>;
                            })}</React.Fragment>)}
                            {!loading && customers.length === 0 && <tr><td colSpan={tableColumnCount} className="text-center text-muted py-4">No VIP customers found for this impact group.</td></tr>}
                        </tbody>
                        <tfoot>
                            <tr style={styles.totalRow}>
                                <td style={styles.totalCell} />
                                <td style={styles.totalCell}>
                                    <span style={styles.totalLabel}>All customers</span>
                                    <span style={styles.totalHint}>VIP totals</span>
                                </td>
                                <td style={styles.totalCell}>
                                    {showSales && <strong className="vip-current-sales-value">{money(report.current_month_paid)}</strong>}
                                    {showProfit && <span style={{ ...styles.cellProfit, marginTop: showSales ? 5 : 0 }}>{showSales ? "Profit: " : ""}{money(currentMonthProfit)}</span>}
                                    {showProfitMargin && <span style={{ ...styles.cellProfitMargin, marginTop: showSales || showProfit ? 5 : 0 }}>Margin {profitMarginLabel(currentMonthProfit, report.current_month_paid)}</span>}
                                </td>
                                {(report.previous_months || []).map(month => <td style={styles.totalCell} key={month.month}>
                                    {showSales && <strong>{money(month.paid_amount)}</strong>}
                                    {showSales && month.month === report.previous_months?.[0]?.month && <span className={`vip-inline-gap ${Number(report.current_month_paid || 0) - Number(month.paid_amount || 0) >= 0 ? "vip-inline-gap--up" : "vip-inline-gap--down"}`}><small>Vs current month</small>{renderTargetGap(report.current_month_paid, month.paid_amount)}</span>}
                                    {showProfit && <span style={{ ...styles.cellProfit, marginTop: showSales ? 5 : 0 }}>{showSales ? "Profit: " : ""}{money(month.profit_amount)}</span>}
                                    {showProfitMargin && <span style={{ ...styles.cellProfitMargin, marginTop: showSales || showProfit ? 5 : 0 }}>Margin {profitMarginLabel(month.profit_amount, month.paid_amount)}</span>}
                                </td>)}
                                {showSales && <>
                                <td style={styles.totalCell}><strong>{money(lastThreeMonthAverage)}</strong><span className="vip-inline-gap"><small>Current month gap</small>{renderTargetGap(report.current_month_paid, lastThreeMonthAverage)}</span></td>
                                <td style={styles.totalCell}>{renderSalesTrend(report.current_month_paid, lastThreeMonthAverage, lastMonthPaid)}</td>
                                </>}
                                {showProfit && <>
                                <td style={{ ...styles.totalCell, color: "#6f42c1" }}>{money(averageMonthlyProfit)}</td>
                                <td style={styles.totalCell}>{renderTargetGap(currentMonthProfit, averageMonthlyProfit)}</td>
                                <td style={styles.totalCell}>{renderTargetGap(currentMonthProfit, lastMonthProfit)}</td>
                                </>}
                                {showProfitMargin && <td style={{ ...styles.totalCell, color: "#0f766e" }}>{profitMarginLabel(averageMonthlyProfit, lastThreeMonthAverage)}</td>}
                                <td style={{ ...styles.totalCell, ...styles.actionCell, background: "#dce5ec" }} />
                            </tr>
                        </tfoot>
                    </table>
                    </div>
                </section>}
            </>}
        </div>
    );
};

export default VIPTransactionHistory;
