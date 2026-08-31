import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import LinearProgress from "@mui/material/LinearProgress";
import MuiButton from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import BarChartIcon from "@mui/icons-material/BarChart";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { useLocation, useNavigate } from "react-router-dom";
import ProductService from "./ProductService.service";
import ImpactGroupSelect from "../Common/ImpactGroupSelect";
import "../Reports/ProductReport.css";
import "../VipCustomer/VIPTransactionHistory.css";
import "./ProductMonthlySalesHistory.css";

const money = value => Number(value || 0).toLocaleString("en-PH", {
    style: "currency", currency: "PHP", minimumFractionDigits: 2, maximumFractionDigits: 2,
});
const signedMoney = value => `${Number(value || 0) > 0 ? "+" : Number(value || 0) < 0 ? "-" : ""}${money(Math.abs(Number(value || 0)))}`;
const number = value => Number(value || 0).toLocaleString("en-PH", { maximumFractionDigits: 2 });
const profitMargin = (profit, sales) => {
    const salesAmount = Number(sales || 0);
    if (salesAmount === 0) return 0;
    return (Number(profit || 0) / salesAmount) * 100;
};
const profitMarginLabel = (profit, sales) => `${number(profitMargin(profit, sales))}%`;
// `quantity_sold` is a total piece count. Convert it into complete packages
// plus the remaining loose pieces, matching ProductTrendComparison.
const soldQuantity = (quantity, pieces) => {
    const totalPieces = Number(pieces || 0);
    return totalPieces !== 0 ? totalPieces : Number(quantity || 0);
};
const soldQuantityLabel = (totalPieces, piecesPerPackage = 1, packaging = "Box") => {
    const total = Number(totalPieces || 0);
    const size = Math.max(1, Number(piecesPerPackage || 1));
    if (total < size) return `${number(total)} Pc`;
    const packageEquivalent = total / size;
    return `${number(packageEquivalent)} ${packaging}`;
};
const soldQuantityTitle = (totalPieces, piecesPerPackage = 1, packaging = "Box") => {
    const total = Number(totalPieces || 0);
    const size = Math.max(1, Number(piecesPerPackage || 1));
    const packages = Math.floor(total / size);
    const remainder = total % size;
    const breakdown = packages > 0
        ? `${number(packages)} ${packaging}${remainder ? ` + ${number(remainder)} Pc` : ""}`
        : `${number(total)} Pc`;
    return `${number(total)} pieces total · ${number(size)} pieces per ${packaging.toLowerCase()} · ${breakdown}`;
};
const totalSold = (quantity, pieces, emphasized = false, piecesPerPackage = 1, packaging = "Box") => {
    const totalPieces = soldQuantity(quantity, pieces);
    if (totalPieces === 0) return null;
    return <div style={{ fontSize: emphasized ? 15 : 12.5, fontWeight: emphasized ? 900 : 750, lineHeight: 1.35 }}>
        <span title={soldQuantityTitle(totalPieces, piecesPerPackage, packaging)} style={{ display: "block", whiteSpace: "nowrap", cursor: "help" }}>{soldQuantityLabel(totalPieces, piecesPerPackage, packaging)}</span>
    </div>;
};
const stockDisplay = product => {
    const boxStock = Number(product.stock || 0);
    const pieceStock = Number(product.stock_pc || 0);
    if (boxStock <= 0 && pieceStock <= 0) {
        return <span style={{ display: "inline-flex", padding: "2px 6px", borderRadius: 999, color: "#b42318", background: "#fff1f0", border: "1px solid #fecaca", fontSize: 9, fontWeight: 700, whiteSpace: "nowrap" }}>Out of stock</span>;
    }
    return <span style={{ color: "#64748b", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{boxStock > 0 ? `${number(boxStock)} Box` : `${number(pieceStock)} Pc`}</span>;
};
const currentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};
const impactGroupLabels = { all: "All results", winning: "Winning products", highest_sales: "Highest sales products", declining: "Declining products", missing: "Missing products" };
const projectedOutput = (month, boxes, pieces) => {
    if (!/^\d{4}-\d{2}$/.test(month || "")) return null;
    const now = new Date();
    const [year, monthNumber] = month.split("-").map(Number);
    const daysInMonth = new Date(year, monthNumber, 0).getDate();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    if (month > currentMonth) return null;
    const elapsedDays = month === currentMonth ? Math.min(now.getDate(), daysInMonth) : daysInMonth;
    const runRate = daysInMonth / elapsedDays;
    return {
        boxes: Math.round(Number(boxes || 0) * runRate),
        pieces: Math.round(Number(pieces || 0) * runRate),
        projected: month === currentMonth,
    };
};
const projectionAssessment = (projection, targetBoxes, targetPieces) => {
    if (!projection?.projected) return null;
    const useBoxes = Number(targetBoxes || 0) > 0;
    const target = useBoxes ? Number(targetBoxes) : Number(targetPieces || 0);
    const projected = useBoxes ? projection.boxes : projection.pieces;
    const attainment = target > 0 ? (projected / target) * 100 : projected > 0 ? 100 : 0;
    if (attainment >= 100) return { label: "On Track", color: "#146c43", background: "#d1e7dd", attainment };
    if (attainment >= 80) return { label: "At risk", color: "#92400e", background: "#fef3c7", attainment };
    return { label: "Unlikely", color: "#b42318", background: "#fee2e2", attainment };
};

const statusMeta = {
    HIGH_SALES: { label: "High sales", color: "#146c43", background: "#d1e7dd" },
    LOW_SALES: { label: "Low sales", color: "#842029", background: "#f8d7da" },
    NO_SALES: { label: "No sales this month", color: "#842029", background: "#f8d7da" },
    NO_SALES_4_MONTHS: { label: "No sales for 4 months", color: "#664d03", background: "#fff3cd" },
    UNCHANGED: { label: "Unchanged", color: "#41464b", background: "#e2e3e5" },
};

const selectedMonthClass = () => {
    return "table-info";
};

const trendMeta = {
    HIGHER: { label: "Higher than last month", color: "#146c43" },
    LOWER: { label: "Lower than last month", color: "#dc3545" },
    UNCHANGED: { label: "Same as last month", color: "#6c757d" },
};
const styles = {
    page: { minHeight: "100vh", padding: 22, background: "#f6f8fb" },
    header: { marginBottom: 18, textAlign: "center" },
    filter: { padding: 15, marginBottom: 16, background: "#fff", border: "1px solid #e1e6ec", borderRadius: 10 },
    filterRow: { display: "flex", alignItems: "flex-end", gap: 9, flexWrap: "wrap" },
    summary: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))", gap: 10, marginBottom: 16 },
    card: { padding: 14, background: "#fff", border: "1px solid #e1e6ec", borderRadius: 10 },
    label: { margin: "0 0 4px", color: "#6b7280", fontSize: 10, fontWeight: 800, textTransform: "uppercase" },
    value: { margin: 0, color: "#1f2937", fontSize: 21, fontWeight: 800 },
    controls: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: 12, padding: 13, background: "#fff", border: "1px solid #e1e6ec", borderRadius: "10px 10px 0 0" },
    toolsRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", paddingTop: 10, borderTop: "1px solid #edf0f3" },
    tableWrap: { overflowX: "auto", background: "#fff", border: "1px solid #e1e6ec", borderTop: 0, borderRadius: "0 0 10px 10px" },
    table: { minWidth: 1247, marginBottom: 0, tableLayout: "fixed" },
    th: { color: "#fff", background: "#60758a", borderColor: "#8193a5", verticalAlign: "middle", padding: "12px 9px", fontSize: 14 },
    selectedTh: { color: "#fff", background: "#356fa8", borderColor: "#78a8d5", borderBottom: "4px solid #8ec5ff", verticalAlign: "middle", padding: "10px 9px", fontSize: 17 },
    selectedBadge: { display: "inline-flex", marginTop: 5, padding: "2px 6px", borderRadius: 999, color: "#fff", background: "#2563eb", fontSize: 8, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase" },
    thHint: { display: "block", marginTop: 4, color: "#e2e8f0", fontSize: 8, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase" },
    averageTh: { color: "#fff", background: "#6b7280", borderColor: "#8c929d", verticalAlign: "middle", padding: "12px 9px" },
    averageCell: { background: "#f8fafc" },
    product: { marginBottom: 2, fontWeight: 800 },
    meta: { color: "#6b7280", fontSize: 11 },
    month: { display: "flex", flexDirection: "column", gap: 3 },
    profit: { color: "#6f42c1", fontSize: 11, fontWeight: 700 },
    profitMargin: { color: "#0f766e", fontSize: 11, fontWeight: 700 },
    notSold: { display: "inline-flex", width: "fit-content", padding: "3px 7px", borderRadius: 999, color: "#a61b1b", background: "#f8d7da", fontSize: 9, fontWeight: 800, letterSpacing: ".04em" },
    actionTh: { position: "sticky", right: 0, zIndex: 3, width: 44, minWidth: 44, textAlign: "center", color: "#fff", background: "#455a6f", borderColor: "#8193a5" },
    actionCell: { position: "sticky", right: 0, zIndex: 2, width: 44, minWidth: 44, textAlign: "center", background: "#fff", boxShadow: "-3px 0 6px rgba(15, 23, 42, .08)" },
};

const ProductMonthlySalesHistory = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const customerId = initialParams.get("customer_id") || "";
    const customerName = initialParams.get("customer_name") || "";
    const initialMonth = initialParams.get("month") || currentMonth();
    const initialComparisonPage = Math.max(0, Number(initialParams.get("comparison_page") || 0));
    const [month, setMonth] = useState(initialMonth);
    const [comparisonPage, setComparisonPage] = useState(initialComparisonPage);
    const [report, setReport] = useState(null);
    const [impactGroup, setImpactGroup] = useState("all");
    const [appliedGroup, setAppliedGroup] = useState("all");
    const [query, setQuery] = useState("");
    const [selectedRecoveryIds, setSelectedRecoveryIds] = useState([]);
    const [visibleMetrics, setVisibleMetrics] = useState({ quantity: true, sales: true, profit: false, profitMargin: false });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const load = useCallback((selectedMonth, selectedComparisonPage = 0, request = {}) => {
        const requestedGroup = request.impactGroup || "all";
        const requestedSearch = String(request.search || "").trim();
        setLoading(true);
        setError("");
        const filters = { comparison_page: selectedComparisonPage, impact_group: requestedGroup, limit: 100, ...(requestedSearch ? { search: requestedSearch } : {}), ...(customerId ? { customer_id: customerId } : {}) };
        return ProductService.fetchProductMonthlySales(selectedMonth, filters)
            .then(response => { setReport(response.data); setAppliedGroup(requestedGroup); setSelectedRecoveryIds([]); })
            .catch(requestError => {
                setReport(null);
                setError(requestError.response?.data?.message || "Unable to load monthly product sales.");
            })
            .finally(() => setLoading(false));
    }, [customerId]);

    useEffect(() => { load(initialMonth, initialComparisonPage, { impactGroup: "all" }); }, [initialMonth, initialComparisonPage, load]);

    const products = useMemo(() => Array.isArray(report?.data) ? report.data : [], [report]);
    const impactStatus = product => {
        const supplied = String(product.impact_status || product.status || "").toLowerCase();
        if (["winning", "growing", "positive", "above_usual", "new_or_returning"].includes(supplied)) return "winning";
        if (["declining", "losing", "negative", "below_usual"].includes(supplied)) return "declining";
        if (supplied === "missing") return "missing";
        const currentSales = Number(product.current_month?.sales_amount || 0);
        const averageSales = Number(product.average_sales || 0);
        if (currentSales === 0 && averageSales > 0) return "missing";
        if (currentSales > averageSales) return "winning";
        if (currentSales < averageSales) return "declining";
        return "other";
    };
    const groupDetails = {
        winning: { label: "Winning products", description: "Current sales exceed the previous three-month average." },
        declining: { label: "Declining products", description: "Current sales are below the previous three-month average." },
        missing: { label: "Missing products", description: "Previously selling products with no sales this month." },
        highest_sales: { label: "Highest sales products", description: "Products ranked by selected-month sales, highest first. Their impact verdict may still be winning or declining." },
        other: { label: "Other products", description: "Products without a winning, declining, or missing verdict." },
    };
    // Keep the selected filter reliable even when an older API response ignores impact_group.
    const visibleProducts = appliedGroup === "highest_sales"
        ? [...products].sort((first, second) => Number(second.current_month?.sales_amount || 0) - Number(first.current_month?.sales_amount || 0))
        : ["winning", "declining", "missing"].includes(appliedGroup)
            ? products.filter(product => impactStatus(product) === appliedGroup)
            : products;
    const impactProductGroups = ["winning", "declining", "missing", "other"]
        .map(key => ({ key, ...groupDetails[key], products: visibleProducts.filter(product => impactStatus(product) === key) }))
        .filter(group => group.products.length > 0);
    const productGroups = appliedGroup === "highest_sales"
        ? [{ key: "highest_sales", ...groupDetails.highest_sales, products: visibleProducts }]
        : impactProductGroups;
    const impactCounts = report?.impact_counts || {};
    const winningCount = Number(impactCounts.winning ?? products.filter(product => impactStatus(product) === "winning").length);
    const decliningCount = Number(impactCounts.declining ?? impactCounts.losing ?? products.filter(product => impactStatus(product) === "declining").length);
    const missingCount = Number(impactCounts.missing ?? products.filter(product => impactStatus(product) === "missing").length);
    const productsInGroup = group => products.filter(product => impactStatus(product) === group);
    const winningSalesVsLastMonth = productsInGroup("winning").reduce((total, product) => total + Number(product.current_month?.sales_amount || 0) - Number(product.previous_months?.[0]?.sales_amount || 0), 0);
    const decliningNeededForLastMonth = productsInGroup("declining").reduce((total, product) => total + Math.max(Number(product.previous_months?.[0]?.sales_amount || 0) - Number(product.current_month?.sales_amount || 0), 0), 0);
    const missingExpectedFromLastMonth = productsInGroup("missing").reduce((total, product) => total + Number(product.previous_months?.[0]?.sales_amount || 0), 0);
    const filteredTotal = appliedGroup === "all" ? Number(report?.filtered_total ?? visibleProducts.length) : visibleProducts.length;
    const showImpactGrouping = productGroups.length > 1 || appliedGroup !== "all";
    const tableColumnCount = (report?.previous_months || []).length + 7;
    const productKey = product => product.product_id ?? product.id ?? product.mark_up_product_id;
    const rankMap = salesFor => new Map(
        [...products]
            .sort((first, second) => Number(salesFor(second) || 0) - Number(salesFor(first) || 0))
            .map((product, index) => [productKey(product), index + 1])
    );
    const calculatedCurrentRanks = rankMap(product => product.current_month?.sales_amount);
    const calculatedPreviousRanks = rankMap(product => product.previous_months?.[0]?.sales_amount);

    const changeComparisonPage = selectedPage => {
        if (selectedPage === null || selectedPage === undefined || selectedPage < 0) return;
        setComparisonPage(selectedPage);
        load(month, selectedPage, { impactGroup, search: query });
    };
    const gap = Number(report?.sales_average_gap || 0);
    const currentSalesTotal = Number(report?.current_month?.sales_amount || 0);
    const lastMonthSales = Number(report?.previous_months?.[0]?.sales_amount ?? products.reduce((total, product) => total + Number(product.previous_months?.[0]?.sales_amount || 0), 0));
    const salesVsLastMonth = currentSalesTotal - lastMonthSales;
    const recoveryProductKey = product => String(productKey(product) || "");
    const recoveryTargetFor = product => {
        const currentSales = Number(product.current_month?.sales_amount || 0);
        const previousSales = Number(product.previous_months?.[0]?.sales_amount || 0);
        return impactStatus(product) === "missing" ? previousSales : Math.max(previousSales - currentSales, 0);
    };
    const recoveryProductsFor = group => products.filter(product => impactStatus(product) === group && recoveryTargetFor(product) > 0);
    const decliningRecoveryProducts = recoveryProductsFor("declining");
    const missingRecoveryProducts = recoveryProductsFor("missing");
    const allRecoverySelectedFor = groupProducts => groupProducts.length > 0 && groupProducts.every(product => selectedRecoveryIds.includes(recoveryProductKey(product)));
    const selectedRecoveryProducts = products.filter(product => selectedRecoveryIds.includes(recoveryProductKey(product)) && ["declining", "missing"].includes(impactStatus(product)));
    const potentialRecoverySales = selectedRecoveryProducts.reduce((total, product) => total + recoveryTargetFor(product), 0);
    const projectedSalesWithRecovery = currentSalesTotal + potentialRecoverySales;
    const projectedRecoveryVsLastMonth = projectedSalesWithRecovery - lastMonthSales;
    const toggleRecoveryProduct = product => {
        const key = recoveryProductKey(product);
        setSelectedRecoveryIds(current => current.includes(key) ? current.filter(value => value !== key) : [...current, key]);
    };
    const toggleRecoveryGroup = groupProducts => {
        const eligibleKeys = groupProducts.map(recoveryProductKey);
        const allSelected = allRecoverySelectedFor(groupProducts);
        setSelectedRecoveryIds(current => allSelected ? current.filter(key => !eligibleKeys.includes(key)) : [...new Set([...current, ...eligibleKeys])]);
    };
    const showingTruePreviousMonth = Number(report?.comparison?.page ?? comparisonPage) === 0;
    const comparisonReferenceLabel = report?.previous_months?.[0]?.label || "comparison month";
    const toggleMetric = metric => setVisibleMetrics(current => ({ ...current, [metric]: !current[metric] }));
    const openProductGraph = productId => {
        const params = new URLSearchParams({ month, comparison_page: String(comparisonPage) });
        if (customerId) params.set("customer_id", customerId);
        if (customerName) params.set("customer_name", customerName);
        navigate(`/productMonthlySalesHistory/product/${productId}?${params.toString()}`);
    };

    return <div className="pr-page" style={styles.page}>
        {loading && <LinearProgress />}
        <header style={styles.header}>
            <h2 className="fw-bold mb-1">{customerName ? `${customerName} Products Sold History` : "Products Sold History"}</h2>
            <p className="text-muted mb-0">
                {customerId
                    ? "All enabled products are shown; sales are filtered to this customer, including products with zero sales."
                    : "Compare all products across the selected month and the previous three months."}
            </p>
        </header>
        <section className="pr-filter"><Form onSubmit={event => { event.preventDefault(); setComparisonPage(0); load(month, 0, { impactGroup, search: query }); }}>
            <div className="pr-filter__header"><strong>Product impact filters</strong><span>Impact status compares selected-month product sales with the previous three-month average.</span></div>
            <div className="ct-filter-grid vip-impact-filter-grid">
                <TextField fullWidth size="small" type="month" value={month} onChange={event => setMonth(event.target.value)} label="Report month" InputLabelProps={{ shrink: true }} required />
                <ImpactGroupSelect value={impactGroup} onChange={event => setImpactGroup(event.target.value)} options={Object.entries(impactGroupLabels).map(([value, label]) => ({ value, label }))}/>
                <MuiButton variant="contained" type="submit" disabled={loading}>Compare products</MuiButton>
            </div>
        </Form>{loading && <LinearProgress className="pr-progress" />}</section>
        {error && <div className="alert alert-danger">{error}</div>}
        {report && <>
            <section className="product-primary-sales-row" style={styles.summary}>
                <div className="product-current-sales-kpi" style={styles.card}>
                    <div className="product-current-sales-kpi__top"><p>{report.report_month?.label || "Selected month"} sales</p><span>Current</span></div>
                    <strong className={potentialRecoverySales > 0 ? "vip-current-sales-kpi__actual--superseded" : ""}>{money(currentSalesTotal)}</strong>
                    <small>Selected-month actual sales</small>
                    {potentialRecoverySales > 0 && <div className="vip-current-sales-kpi__projection"><span>New amount with selected plan</span><strong>{money(projectedSalesWithRecovery)}</strong><small>+{money(potentialRecoverySales)} potential recovery</small></div>}
                </div>
                <div style={styles.card}>
                    <p style={styles.label}>{comparisonReferenceLabel} sales</p>
                    <p style={styles.value}>{money(lastMonthSales)}</p>
                    <div className="product-summary-comparison"><span>Selected month change</span><strong className={salesVsLastMonth >= 0 ? "pt-positive" : "pr-negative"}>{salesVsLastMonth >= 0 ? "+" : "-"}{money(Math.abs(salesVsLastMonth))}</strong></div>
                </div>
                <div style={styles.card}>
                    <p style={styles.label}>Previous 3-month average</p>
                    <p style={styles.value}>{money(report.average_sales)}</p>
                    <div className="product-summary-comparison"><span>Selected month change</span><strong className={gap >= 0 ? "pt-positive" : "pr-negative"}>{gap >= 0 ? "+" : "-"}{money(Math.abs(gap))}</strong></div>
                </div>
            </section>
            <section className="pr-summary ct-summary">
                <div className="vip-impact-summary vip-impact-summary--winning"><TrendingUpRoundedIcon/><div><span>Winning products</span><strong>{winningCount.toLocaleString()}</strong><em><b>{signedMoney(winningSalesVsLastMonth)}</b> sales change vs last month</em></div></div>
                <div className="vip-impact-summary vip-impact-summary--declining"><TrendingDownRoundedIcon/><div><span>Declining products</span><strong>{decliningCount.toLocaleString()}</strong><em><b>-{money(decliningNeededForLastMonth)}</b> sales gap to match last month</em></div><div className="vip-impact-select-all"><Form.Check type="checkbox" id="select-all-declining-products" label="Select all" checked={allRecoverySelectedFor(decliningRecoveryProducts)} disabled={!decliningRecoveryProducts.length} onChange={() => toggleRecoveryGroup(decliningRecoveryProducts)}/></div></div>
                <div className="vip-impact-summary vip-impact-summary--missing"><Inventory2OutlinedIcon/><div><span>Missing products</span><strong>{missingCount.toLocaleString()}</strong><em><b>-{money(missingExpectedFromLastMonth)}</b> expected lost sales vs last month</em></div><div className="vip-impact-select-all"><Form.Check type="checkbox" id="select-all-missing-products" label="Select all" checked={allRecoverySelectedFor(missingRecoveryProducts)} disabled={!missingRecoveryProducts.length} onChange={() => toggleRecoveryGroup(missingRecoveryProducts)}/></div></div>
            </section>
            <section className={`vip-recovery-simulator ${selectedRecoveryProducts.length ? "vip-recovery-simulator--active" : ""}`}>
                <div><span>What-if recovery plan</span><strong>{selectedRecoveryProducts.length ? `${selectedRecoveryProducts.length} product${selectedRecoveryProducts.length === 1 ? "" : "s"} selected` : "Select declining or missing products in the table"}</strong><small>Declining targets their last-month gap; missing targets their full last-month sales.</small></div>
                <div><span>Potential recovered sales</span><strong className="vip-recovery-simulator__amount">+{money(potentialRecoverySales)}</strong></div>
                <div><span>Projected selected-month sales</span><strong>{money(projectedSalesWithRecovery)}</strong><small className={projectedRecoveryVsLastMonth >= 0 ? "pt-positive" : "pr-negative"}>{projectedRecoveryVsLastMonth >= 0 ? "+" : "-"}{money(Math.abs(projectedRecoveryVsLastMonth))} vs last month</small></div>
            </section>
            <div className="pci-benchmark-note"><strong>Primary impact benchmark</strong><span>Winning, declining, and missing product verdicts use the selected month versus the previous 3-month average.</span></div>
            <section style={{ ...styles.card, marginBottom: 12, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                    <p style={{ ...styles.label, marginBottom: 2 }}>Comparison months</p>
                    <strong>{(report.comparison?.months || report.previous_months || []).map(item => item.label).join(" · ") || "No comparison months available"}</strong>
                    <span style={{ ...styles.meta, marginLeft: 8 }}>Block {Number(report.comparison?.page ?? comparisonPage) + 1}</span>
                </div>
                <div className="d-flex gap-2">
                    <Button type="button" size="sm" variant="outline-primary" title="Show newer comparison months" aria-label="Show newer comparison months" disabled={loading || !report.comparison?.has_newer} onClick={() => changeComparisonPage(report.comparison?.newer_page)}>
                        <ChevronLeftIcon />
                    </Button>
                    <Button type="button" size="sm" variant="outline-primary" title="Show older comparison months" aria-label="Show older comparison months" disabled={loading || !report.comparison?.has_older} onClick={() => changeComparisonPage(report.comparison?.older_page)}>
                        <ChevronRightIcon />
                    </Button>
                </div>
            </section>
            <div style={styles.controls}>
                <div><strong>{impactGroupLabels[appliedGroup]}</strong><span style={{ ...styles.meta, display: "block", marginTop: 2 }}>{filteredTotal.toLocaleString()} products · selected month {report.report_month?.month || month}</span></div>
                <div style={styles.toolsRow}>
                    <div className="d-flex align-items-center gap-3 px-2 py-1 border rounded bg-light">
                        <strong className="small text-muted">Show:</strong>
                        {[['quantity', 'Quantity'], ['sales', 'Sales'], ['profit', 'Profit'], ['profitMargin', 'Profit margin']].map(([key, label]) =>
                            <Form.Check key={key} inline className="mb-0" type="checkbox" id={`metric-${key}`} label={label} checked={visibleMetrics[key]} onChange={() => toggleMetric(key)} />
                        )}
                    </div>
                    <Form onSubmit={event => { event.preventDefault(); load(month, 0, { impactGroup, search: query }); }}><TextField size="small" style={{ width: 300, maxWidth: "100%" }} placeholder="Search product, category, brand..." value={query} onChange={event => setQuery(event.target.value)} InputProps={{ startAdornment:<InputAdornment position="start"><SearchRoundedIcon/></InputAdornment> }}/></Form>
                </div>
            </div>
            <div style={styles.tableWrap}>
                <table className="table table-bordered table-hover align-middle product-impact-table" style={styles.table}>
                    <colgroup><col style={{ width: 60 }} /><col style={{ width: 150 }} /><col style={{ width: 64 }} /><col style={{ width: 112 }} /><col style={{ width: 104 }} /><col style={{ width: 104 }} /><col style={{ width: 104 }} /><col style={{ width: 128 }} /><col style={{ width: 174 }} /><col style={{ width: 44 }} /></colgroup>
                    <thead><tr><th style={styles.th}>Rank<span style={styles.thHint}>Movement</span></th><th style={styles.th}>Product<span style={styles.thHint}>Product details</span></th><th style={{ ...styles.th, textAlign: "center" }}>Stock<span style={styles.thHint}>Available</span></th><th className="vip-current-sales-heading" style={styles.selectedTh}>{report.report_month?.label}<br/><span style={styles.selectedBadge}>Selected month</span></th>{(report.previous_months || []).map((item, index) => <th style={styles.th} key={item.month}>{item.label}<span style={styles.thHint}>{index === 0 && showingTruePreviousMonth ? "Previous month" : "Comparison month"}</span></th>)}<th style={styles.averageTh}>3-month average<span style={styles.thHint}>Current comparison</span></th><th style={{ ...styles.th, padding: "12px 14px", fontSize: 15 }}>Status / Sales Trend<span style={{ ...styles.thHint, fontSize: 9, marginTop: 6 }}>Sales vs {showingTruePreviousMonth ? "previous month" : comparisonReferenceLabel}</span></th><th style={styles.actionTh} title="View graph"><BarChartIcon fontSize="small" /></th></tr></thead>
                    <tbody>
                        {productGroups.map(group => <React.Fragment key={group.key}>
                        {showImpactGrouping && <tr className={`vip-impact-group-row vip-impact-group-row--${group.key}`}><td colSpan={tableColumnCount}><div><strong>{group.label}</strong><span>{group.description}</span></div><b>{group.products.length}</b></td></tr>}
                        {group.products.map(product => {
                            const meta = group.key === "winning" ? { label: "Winning", color: "#146c43", background: "#d1e7dd" }
                                : group.key === "declining" ? { label: "Declining", color: "#a65308", background: "#fff0dc" }
                                    : group.key === "missing" ? { label: "Missing", color: "#b42318", background: "#fee2e2" }
                                        : group.key === "highest_sales"
                                            ? (impactStatus(product) === "winning" ? { label: "Winning", color: "#146c43", background: "#d1e7dd" }
                                                : impactStatus(product) === "declining" ? { label: "Declining", color: "#a65308", background: "#fff0dc" }
                                                    : impactStatus(product) === "missing" ? { label: "Missing", color: "#b42318", background: "#fee2e2" }
                                                        : statusMeta[product.sales_status] || statusMeta.UNCHANGED)
                                            : statusMeta[product.sales_status] || statusMeta.UNCHANGED;
                            const comparisonMonth = product.previous_months?.[0];
                            const currentBoxes = Number(product.current_month?.quantity_sold || 0);
                            const comparisonBoxes = Number(comparisonMonth?.quantity_sold || 0);
                            const currentPieces = Number(product.current_month?.pieces_sold || 0);
                            const comparisonPieces = Number(comparisonMonth?.pieces_sold || 0);
                            const averageBoxes = Number(product.average_quantity || 0);
                            const averagePieces = Number(product.average_pieces || 0);
                            const currentSales = Number(product.current_month?.sales_amount || 0);
                            const comparisonSales = Number(comparisonMonth?.sales_amount || 0);
                            const averageSales = Number(product.average_sales || 0);
                            const averageDifference = currentSales - averageSales;
                            const averageBasis = averageSales;
                            const averageChangePercentage = averageBasis > 0
                                ? (averageDifference / averageBasis) * 100
                                : averageDifference > 0 ? 100 : 0;
                            const salesComparison = currentSales - comparisonSales;
                            const trend = salesComparison > 0 ? trendMeta.HIGHER : salesComparison < 0 ? trendMeta.LOWER : trendMeta.UNCHANGED;
                            const salesChangePercentage = comparisonSales > 0 ? (salesComparison / comparisonSales) * 100 : salesComparison > 0 ? 100 : 0;
                            const quantityTrendTitle = `${report.report_month?.label}: ${number(currentBoxes)} Box / ${number(currentPieces)} Pc; ${comparisonReferenceLabel}: ${number(comparisonBoxes)} Box / ${number(comparisonPieces)} Pc`;
                            const projection = projectedOutput(month, currentBoxes, currentPieces);
                            const projectionStatus = projectionAssessment(projection, averageBoxes, averagePieces);
                            const fallbackCurrentRank = calculatedCurrentRanks.get(productKey(product));
                            const fallbackPreviousRank = calculatedPreviousRanks.get(productKey(product));
                            const currentRank = product.current_rank ?? product.rank ?? product.current_month?.current_rank ?? product.current_month?.rank ?? fallbackCurrentRank ?? "—";
                            const previousRank = product.previous_rank ?? product.last_month_rank ?? comparisonMonth?.previous_rank ?? comparisonMonth?.rank ?? fallbackPreviousRank ?? "—";
                            const fallbackMovement = Number(previousRank) - Number(currentRank);
                            const movementValue = product.rank_change ?? product.rank_movement;
                            const movement = Number(typeof movementValue === "object" ? movementValue?.movement ?? movementValue?.change ?? fallbackMovement : movementValue ?? fallbackMovement);
                            const movementDirection = String(product.rank_movement_direction || (movement > 0 ? "UP" : movement < 0 ? "DOWN" : "SAME")).toUpperCase();
                            const movedUp = movementDirection === "UP";
                            const movedDown = movementDirection === "DOWN";
                            return <tr key={product.product_id} className={`vip-impact-customer-row vip-impact-customer-row--${group.key}`}>
                                <td><div className="pt-rank-move"><span className="pr-rank">{currentRank}</span><div><small>{previousRank === "—" ? "No prior rank" : `was #${previousRank}`}</small><strong className={movedDown ? "pr-negative" : movedUp ? "pt-positive" : "pr-subtle"}>{movedUp ? "▲ " : movedDown ? "▼ " : ""}{Math.abs(movement) || "—"}</strong></div></div></td>
                                <td><div style={styles.product}>{product.product_name}</div><div style={styles.meta}>{product.brand_name} · {product.category_name}</div></td>
                                <td>{stockDisplay(product)}</td>
                                <td className={`${selectedMonthClass(product)} vip-current-sales-cell`}><div style={styles.month}>{visibleMetrics.quantity && totalSold(product.current_month?.quantity_sold, product.current_month?.pieces_sold, true, product.quantity)}{visibleMetrics.quantity && projectionStatus && <span style={{ display: "block", width: "100%", maxWidth: 90, height: 4, marginTop: 6, marginBottom: 3, borderRadius: 999, background: meta.color }} />}{visibleMetrics.sales && <span className="vip-current-sales-value">{money(product.current_month?.sales_amount)}</span>}{visibleMetrics.profit && <span style={styles.profit}>Profit {money(product.current_month?.profit_amount)}</span>}{visibleMetrics.profitMargin && <span style={styles.profitMargin}>Margin {profitMarginLabel(product.current_month?.profit_amount, product.current_month?.sales_amount)}</span>}{Number(product.current_month?.sales_amount || 0) === 0 && <span style={styles.notSold}>NOT SOLD</span>}</div></td>
                                {(product.previous_months || []).map((item, index) => <td key={item.month}><div style={styles.month}>{visibleMetrics.quantity && totalSold(item.quantity_sold, item.pieces_sold, false, product.quantity)}{visibleMetrics.sales && <span>{money(item.sales_amount)}</span>}{index === 0 && visibleMetrics.sales && <span className={`vip-inline-gap ${salesComparison >= 0 ? "vip-inline-gap--up" : "vip-inline-gap--down"}`}><small>Current month gap</small>{salesComparison >= 0 ? "+" : "-"}{money(Math.abs(salesComparison))}</span>}{index === 0 && ["declining", "missing"].includes(impactStatus(product)) && <Form.Check className="vip-recovery-checkbox vip-recovery-checkbox--inline" type="checkbox" id={`product-recovery-${recoveryProductKey(product)}`} checked={selectedRecoveryIds.includes(recoveryProductKey(product))} disabled={recoveryTargetFor(product) <= 0} onChange={() => toggleRecoveryProduct(product)} label="Include in plan"/>}{visibleMetrics.profit && <span style={styles.profit}>Profit {money(item.profit_amount)}</span>}{visibleMetrics.profitMargin && <span style={styles.profitMargin}>Margin {profitMarginLabel(item.profit_amount, item.sales_amount)}</span>}</div></td>)}
                                <td style={styles.averageCell}><div style={styles.month}>{visibleMetrics.quantity && totalSold(product.average_quantity, product.average_pieces, false, product.quantity)}{visibleMetrics.sales && <span>{money(product.average_sales)}</span>}{visibleMetrics.profit && <span style={styles.profit}>Profit {money(product.average_profit)}</span>}{visibleMetrics.profitMargin && <span style={styles.profitMargin}>Margin {profitMarginLabel(product.average_profit, product.average_sales)}</span>}</div></td>
                                <td>
                                    <div>
                                        <span style={{ display: "block", marginBottom: 4, color: "#64748b", fontSize: 8, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase" }}>3-month average</span>
                                        <span style={{ display: "inline-flex", padding: "4px 8px", borderRadius: 999, fontSize: 10, fontWeight: 800, color: meta.color, background: meta.background }}>{meta.label}</span>
                                        <span style={{ display: "block", marginTop: 4, color: averageChangePercentage >= 0 ? "#146c43" : "#dc3545", fontSize: 13, fontWeight: 800 }}>
                                            {averageChangePercentage >= 0 ? "+" : ""}{number(averageChangePercentage)}%
                                        </span>
                                    </div>
                                    <div title={quantityTrendTitle} style={{ ...styles.meta, marginTop: 9, paddingTop: 8, borderTop: "2px solid #cbd5e1", color: trend.color, fontWeight: 800, cursor: "help" }}>
                                        <span style={{ display: "block", marginBottom: 3, color: "#64748b", fontSize: 8, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase" }}>
                                            Vs {showingTruePreviousMonth ? `last month (${comparisonReferenceLabel})` : comparisonReferenceLabel}
                                        </span>
                                        <span style={{ display: "inline-flex", marginBottom: 4, padding: "4px 8px", borderRadius: 999, fontSize: 10, fontWeight: 800, color: trend.color, background: trend === trendMeta.HIGHER ? "#d1e7dd" : trend === trendMeta.LOWER ? "#f8d7da" : "#e2e3e5" }}>
                                            {trend === trendMeta.HIGHER ? "High sales" : trend === trendMeta.LOWER ? "Low sales" : "Unchanged"}
                                        </span>
                                        <span style={{ display: "block", fontSize: 13 }}>{salesChangePercentage >= 0 ? "+" : ""}{number(salesChangePercentage)}%</span>
                                    </div>
                                    {projection && <div style={{ marginTop: 9, paddingTop: 8, borderTop: "2px solid #cbd5e1" }}>
                                        <span style={{ display: "block", marginBottom: 4, color: "#64748b", fontSize: 8, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase" }}>{projection.projected ? "Projected month-end output" : "Final output"}</span>
                                        <strong style={{ display: "block", color: "#1d4ed8", fontSize: 12, lineHeight: 1.4 }}>{number(projection.boxes)} Box<br/>{number(projection.pieces)} Pc</strong>
                                        {projection.projected && <span style={{ display: "block", marginTop: 3, color: "#64748b", fontSize: 8 }}>Based on current daily sales</span>}
                                        {projectionStatus && <div style={{ marginTop: 6 }}>
                                            <span style={{ display: "inline-flex", padding: "4px 8px", borderRadius: 999, color: projectionStatus.color, background: projectionStatus.background, fontSize: 9, fontWeight: 900 }}>{projectionStatus.label}</span>
                                            <span style={{ display: "block", marginTop: 4, color: projectionStatus.color, fontSize: 10, fontWeight: 800 }}>{number(projectionStatus.attainment)}% of 3-month average</span>
                                        </div>}
                                    </div>}
                                </td>
                                    <td style={styles.actionCell}><Button size="sm" variant="outline-primary" title="View graph" aria-label={`View graph for ${product.product_name}`} onClick={() => openProductGraph(product.product_id)} style={{ width: 30, height: 30, padding: 0 }}><BarChartIcon fontSize="small" /></Button></td>
                            </tr>;
                        })}</React.Fragment>)}
                        {!loading && visibleProducts.length === 0 && <tr><td colSpan={tableColumnCount} className="text-center text-muted py-4">No products match this impact group.</td></tr>}
                    </tbody>
                </table>
            </div>
        </>}
    </div>;
};

export default ProductMonthlySalesHistory;
