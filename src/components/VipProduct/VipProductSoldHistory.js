import React, { useCallback, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import LinearProgress from "@mui/material/LinearProgress";
import MuiButton from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import BarChartIcon from "@mui/icons-material/BarChart";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { useNavigate, useParams } from "react-router-dom";
import VipProductTransactionService from "./VipProductTransactionService";
import "../Reports/ProductReport.css";
import "../VipCustomer/VIPTransactionHistory.css";
import "./VipProductSoldHistory.css";

const money = value => Number(value || 0).toLocaleString("en-PH", {
    style: "currency", currency: "PHP", minimumFractionDigits: 2, maximumFractionDigits: 2,
});
const number = value => Number(value || 0).toLocaleString("en-PH", { maximumFractionDigits: 2 });
const profitMargin = (profit, sales) => {
    const salesAmount = Number(sales || 0);
    return salesAmount > 0 ? (Number(profit || 0) / salesAmount) * 100 : 0;
};
const profitMarginLabel = (profit, sales) => `${number(profitMargin(profit, sales))}%`;
const soldQuantity = (quantity, pieces) => {
    const totalPieces = Number(pieces || 0);
    return totalPieces !== 0 ? totalPieces : Number(quantity || 0);
};
const soldQuantityLabel = (totalPieces, piecesPerBox = 1) => {
    const total = Number(totalPieces || 0);
    const size = Math.max(1, Number(piecesPerBox || 1));
    return total < size ? `${number(total)} Pc` : `${number(total / size)} Box`;
};
const soldQuantityTitle = (totalPieces, piecesPerBox = 1) => {
    const total = Number(totalPieces || 0);
    const size = Math.max(1, Number(piecesPerBox || 1));
    const boxes = Math.floor(total / size);
    const remainder = total % size;
    const breakdown = boxes > 0 ? `${number(boxes)} Box${remainder ? ` + ${number(remainder)} Pc` : ""}` : `${number(total)} Pc`;
    return `${number(total)} pieces total · ${number(size)} pieces per box · ${breakdown}`;
};
const totalSold = (quantity, pieces, emphasized = false, piecesPerBox = 1) => {
    const totalPieces = soldQuantity(quantity, pieces);
    if (totalPieces === 0) return null;
    return <div style={{ fontSize: emphasized ? 15 : 12.5, fontWeight: emphasized ? 900 : 750, lineHeight: 1.35 }}>
        <span title={soldQuantityTitle(totalPieces, piecesPerBox)} style={{ display: "block", whiteSpace: "nowrap", cursor: "help" }}>{soldQuantityLabel(totalPieces, piecesPerBox)}</span>
    </div>;
};
const stockDisplay = product => {
    const boxes = Number(product.stock || 0);
    const pieces = Number(product.stock_pc || 0);
    if (boxes <= 0 && pieces <= 0) return <span style={{ display: "inline-flex", padding: "2px 6px", borderRadius: 999, color: "#b42318", background: "#fff1f0", border: "1px solid #fecaca", fontSize: 9, fontWeight: 700, whiteSpace: "nowrap" }}>Out of stock</span>;
    return <span style={{ color: "#64748b", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{boxes > 0 ? `${number(boxes)} Box` : `${number(pieces)} Pc`}</span>;
};
const thisMonth = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};
const impactGroupLabels = { all: "All results", winning: "Winning products", declining: "Declining products", missing: "Missing products", highest_sales: "Highest sales products" };
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
const styles = {
    page: { minHeight: "100vh", padding: "22px", background: "#f6f8fb" },
    header: { marginBottom: 18, textAlign: "center" },
    title: { margin: 0, fontWeight: 800 },
    subtitle: { margin: "5px 0 0", color: "#6b7280" },
    filter: { padding: 15, marginBottom: 16, background: "#fff", border: "1px solid #e1e6ec", borderRadius: 10 },
    filterRow: { display: "flex", alignItems: "flex-end", gap: 9, flexWrap: "wrap" },
    summary: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: 11, marginBottom: 16 },
    card: { padding: 15, background: "#fff", border: "1px solid #e1e6ec", borderRadius: 10 },
    label: { margin: "0 0 4px", color: "#6b7280", fontSize: 11, fontWeight: 800, textTransform: "uppercase" },
    value: { margin: 0, color: "#1f2937", fontSize: 22, fontWeight: 800 },
    modeBar: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: 11, padding: 13, background: "#fff", border: "1px solid #e1e6ec", borderRadius: "10px 10px 0 0" },
    modeRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
    metricControls: { display: "flex", alignItems: "center", gap: 16, width: "fit-content", padding: "6px 10px", background: "#f8fafc", border: "1px solid #d8dee6", borderRadius: 6 },
    tableWrap: { overflowX: "auto", background: "#fff", border: "1px solid #e1e6ec", borderTop: 0, borderRadius: "0 0 10px 10px" },
    table: { minWidth: 1247, margin: 0, tableLayout: "fixed" },
    th: { color: "#fff", background: "#60758a", borderColor: "#8193a5", verticalAlign: "middle", padding: "12px 9px", fontSize: 14 },
    selectedTh: { color: "#fff", background: "#60758a", borderColor: "#8193a5", borderBottom: "3px solid #cbd5e1", verticalAlign: "middle", padding: "10px 9px", fontSize: 17 },
    selectedBadge: { display: "inline-flex", marginTop: 5, padding: "2px 6px", borderRadius: 999, color: "#334155", background: "#e2e8f0", fontSize: 8, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase" },
    thHint: { display: "block", marginTop: 4, color: "#e2e8f0", fontSize: 8, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase" },
    averageTh: { color: "#fff", background: "#6b7280", borderColor: "#8c929d", verticalAlign: "middle", padding: "12px 9px" },
    averageCell: { background: "#f8fafc" },
    product: { fontWeight: 800, fontSize: 15, lineHeight: 1.25, marginBottom: 2 },
    meta: { color: "#6b7280", fontSize: 11 },
    monthCell: { display: "flex", flexDirection: "column", gap: 3 },
    profit: { color: "#6f42c1", fontSize: 11, fontWeight: 700 },
    profitMargin: { color: "#0f766e", fontSize: 11, fontWeight: 700 },
    dormant: { display: "inline-flex", padding: "4px 8px", color: "#842029", background: "#f8d7da", borderRadius: 999, fontSize: 10, fontWeight: 800 },
    actionTh: { position: "sticky", right: 0, zIndex: 3, width: 52, minWidth: 52, textAlign: "center", color: "#fff", background: "#455a6f", borderColor: "#8193a5" },
    actionCell: { position: "sticky", right: 0, zIndex: 2, width: 52, minWidth: 52, textAlign: "center", background: "#fff", boxShadow: "-3px 0 6px rgba(15, 23, 42, .08)" },
};

const VipProductSoldHistory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedMonth, setSelectedMonth] = useState(thisMonth());
    const [comparisonPage, setComparisonPage] = useState(0);
    const [report, setReport] = useState(null);
    const [impactGroup, setImpactGroup] = useState("all");
    const [appliedGroup, setAppliedGroup] = useState("all");
    const [visibleMetrics, setVisibleMetrics] = useState({ quantity: true, sales: true, profit: false, profitMargin: false });
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const load = useCallback((month, page = 0, request = {}) => {
        const requestedGroup = request.impactGroup || "all";
        const requestedSearch = String(request.search || "").trim();
        setLoading(true);
        setError("");
        return VipProductTransactionService.fetchVipProductMonthlySold(id, month, { comparison_page: page, impact_group: requestedGroup, limit: 100, ...(requestedSearch ? { search: requestedSearch } : {}) })
            .then(response => { setReport(response.data); setAppliedGroup(requestedGroup); })
            .catch(requestError => {
                setReport(null);
                setError(requestError.response?.data?.message || "Unable to load product sales history.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => { load(thisMonth(), 0, { impactGroup: "all" }); }, [load]);

    const products = Array.isArray(report?.data) ? report.data : [];
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
    const impactProductGroups = ["winning", "declining", "missing", "other"]
        .map(key => ({ key, ...groupDetails[key], products: products.filter(product => impactStatus(product) === key) }))
        .filter(group => group.products.length > 0);
    const productGroups = appliedGroup === "highest_sales"
        ? [{ key: "highest_sales", ...groupDetails.highest_sales, products }]
        : impactProductGroups;
    const visibleProducts = products;
    const impactCounts = report?.impact_counts || {};
    const winningCount = Number(impactCounts.winning ?? impactProductGroups.find(group => group.key === "winning")?.products.length ?? 0);
    const decliningCount = Number(impactCounts.declining ?? impactCounts.losing ?? impactProductGroups.find(group => group.key === "declining")?.products.length ?? 0);
    const missingCount = Number(impactCounts.missing ?? impactProductGroups.find(group => group.key === "missing")?.products.length ?? 0);
    const filteredTotal = Number(report?.filtered_total ?? products.length);
    const showImpactGrouping = productGroups.length > 1 || appliedGroup === "highest_sales";
    const tableColumnCount = (report?.previous_months || []).length + 7;
    const productKey = product => product.product_id ?? product.id ?? product.mark_up_product_id;
    const rankMap = salesFor => new Map([...products].sort((a, b) => Number(salesFor(b) || 0) - Number(salesFor(a) || 0)).map((product, index) => [productKey(product), index + 1]));
    const calculatedCurrentRanks = rankMap(product => product.current_month?.sales_amount);
    const calculatedPreviousRanks = rankMap(product => product.previous_months?.[0]?.sales_amount);

    const templateName = products[0]?.vip_product_name || "VIP Product";
    const change = Number(report?.sales_last_month_gap || 0);
    const toggleMetric = metric => setVisibleMetrics(current => ({ ...current, [metric]: !current[metric] }));
    const showingTruePreviousMonth = Number(report?.comparison?.page ?? comparisonPage) === 0;
    const comparisonReferenceLabel = report?.previous_months?.[0]?.label || "comparison month";
    const openProductGraph = productId => navigate(`/vipProductSoldHistory/${id}/product/${productId}?month=${selectedMonth}&comparison_page=${comparisonPage}`);

    return <div className="pr-page" style={styles.page}>
        {loading && <LinearProgress color="primary" />}
        <header style={styles.header}>
            <h2 style={styles.title}>{templateName} Product Sold History</h2>
            <p style={styles.subtitle}>Find products losing momentum and compare best and low performers across recent months.</p>
        </header>

        <section className="pr-filter"><Form onSubmit={event => { event.preventDefault(); setComparisonPage(0); load(selectedMonth, 0, { impactGroup, search: query }); }}>
            <div className="pr-filter__header"><strong>VIP product impact filters</strong><span>Impact status compares selected-month product sales with the previous three-month average.</span></div>
            <div className="ct-filter-grid vip-impact-filter-grid">
                <TextField fullWidth size="small" type="month" value={selectedMonth} onChange={event => setSelectedMonth(event.target.value)} label="Report month" InputLabelProps={{ shrink: true }} required />
                <FormControl fullWidth size="small"><InputLabel>Impact group</InputLabel><Select value={impactGroup} label="Impact group" onChange={event => setImpactGroup(event.target.value)}>{Object.entries(impactGroupLabels).map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}</Select></FormControl>
                <MuiButton variant="contained" type="submit" disabled={loading}>Compare products</MuiButton>
            </div>
        </Form>{loading && <LinearProgress className="pr-progress" />}</section>

        {error && <div className="alert alert-danger">{error}</div>}
        {report && <>
            <section className="pr-summary ct-summary">
                <div className="vip-impact-summary vip-impact-summary--winning"><TrendingUpRoundedIcon/><div><span>Winning products</span><strong>{winningCount.toLocaleString()}</strong></div></div>
                <div className="vip-impact-summary vip-impact-summary--declining"><TrendingDownRoundedIcon/><div><span>Declining products</span><strong>{decliningCount.toLocaleString()}</strong></div></div>
                <div className="vip-impact-summary vip-impact-summary--missing"><Inventory2OutlinedIcon/><div><span>Missing products</span><strong>{missingCount.toLocaleString()}</strong></div></div>
            </section>
            <div className="pci-benchmark-note"><strong>Primary impact benchmark</strong><span>Winning, declining, and missing VIP product verdicts use the selected month versus the previous 3-month average.</span></div>
            <section style={styles.summary}>
                <div style={{ ...styles.card, border: "2px solid #198754", background: "#f0fff4" }}><p style={styles.label}>{report.report_month?.label} sales</p><p style={{ ...styles.value, color: "#146c43" }}>{money(report.current_month?.sales_amount)}</p></div>
                <div style={styles.card}><p style={styles.label}>Current profit</p><p style={{ ...styles.value, color: "#6f42c1" }}>{money(report.current_month?.profit_amount)}</p></div>
                <div style={styles.card}><p style={styles.label}>3-month average sales</p><p style={styles.value}>{money(report.average_sales)}</p></div>
                <div style={styles.card}><p style={styles.label}>Sales vs last month</p><p style={{ ...styles.value, color: change >= 0 ? "#146c43" : "#dc3545" }}>{change >= 0 ? "+" : "-"}{money(Math.abs(change))}</p></div>
            </section>

            <div style={styles.modeBar}>
                <div><strong>{impactGroupLabels[appliedGroup]}</strong><span style={{ ...styles.meta, display: "block", marginTop: 2 }}>{filteredTotal.toLocaleString()} products · selected month {report.report_month?.month || selectedMonth}</span></div>
                <div style={styles.modeRow}>
                    <div style={styles.metricControls}>
                        <strong className="small text-muted">Show:</strong>
                        {[['quantity', 'Quantity'], ['sales', 'Sales'], ['profit', 'Profit'], ['profitMargin', 'Profit margin']].map(([key, label]) =>
                            <Form.Check key={key} inline className="mb-0" type="checkbox" id={`vip-metric-${key}`} label={label} checked={visibleMetrics[key]} onChange={() => toggleMetric(key)} />
                        )}
                    </div>
                    <Form onSubmit={event => { event.preventDefault(); load(selectedMonth, 0, { impactGroup, search: query }); }}><TextField size="small" style={{ width: 300, maxWidth: "100%" }} placeholder="Search product, category, brand..." value={query} onChange={event => setQuery(event.target.value)} InputProps={{ startAdornment:<InputAdornment position="start"><SearchRoundedIcon/></InputAdornment> }}/></Form>
                </div>
            </div>

            <div style={styles.tableWrap}>
                <table className="table table-bordered table-hover align-middle vip-product-impact-table" style={styles.table}>
                    <colgroup><col style={{ width: 78 }} /><col style={{ width: 180 }} /><col style={{ width: 75 }} /><col style={{ width: 140 }} /><col style={{ width: 140 }} /><col style={{ width: 140 }} /><col style={{ width: 140 }} /><col style={{ width: 170 }} /><col style={{ width: 210 }} /><col style={{ width: 52 }} /></colgroup>
                    <thead><tr>
                        <th style={styles.th}>Rank<span style={styles.thHint}>Movement</span></th><th style={styles.th}>Product<span style={styles.thHint}>Product details</span></th><th style={{ ...styles.th, textAlign: "center" }}>Stock<span style={styles.thHint}>Available</span></th><th className="vip-current-sales-heading" style={styles.selectedTh}>{report.report_month?.label}<br/><span style={styles.selectedBadge}>Selected month</span></th>
                        {(report.previous_months || []).map((month, index) => <th style={styles.th} key={month.month}>{month.label}<span style={styles.thHint}>{index === 0 && showingTruePreviousMonth ? "Previous month" : "Comparison month"}</span></th>)}
                        <th style={styles.averageTh}>3-month average<span style={styles.thHint}>Current comparison</span></th><th style={{ ...styles.th, textAlign: "left", padding: "12px 14px", fontSize: 15 }}>Status / Sales Trend<span style={{ ...styles.thHint, fontSize: 9, marginTop: 6 }}>Sales vs {showingTruePreviousMonth ? "previous month" : comparisonReferenceLabel}</span></th><th style={styles.actionTh} title="View graph"><BarChartIcon fontSize="small" /></th>
                    </tr></thead>
                    <tbody>
                        {productGroups.map(group => <React.Fragment key={group.key}>
                        {showImpactGrouping && <tr className={`vip-impact-group-row vip-impact-group-row--${group.key}`}><td colSpan={tableColumnCount}><div><strong>{group.label}</strong><span>{group.description}</span></div><b>{group.products.length}</b></td></tr>}
                        {group.products.map(product => {
                            const comparisonMonth = product.previous_months?.[0];
                            const currentBoxes = Number(product.current_month?.quantity_sold || 0);
                            const currentPieces = Number(product.current_month?.pieces_sold || 0);
                            const averageBoxes = Number(product.average_quantity || 0);
                            const averagePieces = Number(product.average_pieces || 0);
                            const currentSales = Number(product.current_month?.sales_amount || 0);
                            const comparisonSales = Number(comparisonMonth?.sales_amount || 0);
                            const averageSales = Number(product.average_sales || 0);
                            const compareDifference = currentSales - comparisonSales;
                            const compareBasis = comparisonSales;
                            const comparePercentage = compareBasis > 0 ? (compareDifference / compareBasis) * 100 : compareDifference > 0 ? 100 : 0;
                            const averageDifference = currentSales - averageSales;
                            const averageBasis = averageSales;
                            const averagePercentage = averageBasis > 0 ? (averageDifference / averageBasis) * 100 : averageDifference > 0 ? 100 : 0;
                            const verdict = value => value > 0
                                ? { label: "High sales", color: "#146c43", background: "#d1e7dd" }
                                : value < 0 ? { label: "Low sales", color: "#dc3545", background: "#f8d7da" }
                                    : { label: "Unchanged", color: "#6c757d", background: "#e2e3e5" };
                            const averageVerdict = group.key === "winning" ? { label: "Winning", color: "#146c43", background: "#d1e7dd" }
                                : group.key === "declining" ? { label: "Declining", color: "#a65308", background: "#fff0dc" }
                                    : group.key === "missing" ? { label: "Missing", color: "#b42318", background: "#fee2e2" }
                                        : group.key === "highest_sales"
                                            ? (impactStatus(product) === "winning" ? { label: "Winning", color: "#146c43", background: "#d1e7dd" }
                                                : impactStatus(product) === "declining" ? { label: "Declining", color: "#a65308", background: "#fff0dc" }
                                                    : impactStatus(product) === "missing" ? { label: "Missing", color: "#b42318", background: "#fee2e2" }
                                                        : verdict(averageDifference))
                                            : verdict(averageDifference);
                            const comparisonVerdict = verdict(compareDifference);
                            const selectedMonthStyle = group.key === "winning" ? { background: "#edf9f2", borderColor: "#b9e3cc" }
                                : group.key === "declining" ? { background: "#fffaf2", borderColor: "#f3c982" }
                                    : group.key === "missing" ? { background: "#fff3f3", borderColor: "#efb1b1" }
                                        : group.key === "highest_sales" ? { background: "#eef6ff", borderColor: "#93c5fd" }
                                            : { background: "#f5f6f8", borderColor: "#d7dce5" };
                            const projection = projectedOutput(selectedMonth, currentBoxes, currentPieces);
                            const projectionStatus = projectionAssessment(projection, averageBoxes, averagePieces);
                            const fallbackCurrentRank = calculatedCurrentRanks.get(productKey(product));
                            const fallbackPreviousRank = calculatedPreviousRanks.get(productKey(product));
                            const currentRank = product.current_rank ?? product.rank ?? product.current_month?.rank ?? fallbackCurrentRank ?? "—";
                            const previousRank = product.previous_rank ?? product.last_month_rank ?? comparisonMonth?.rank ?? fallbackPreviousRank ?? "—";
                            const fallbackMovement = Number(previousRank) - Number(currentRank);
                            const movementValue = product.rank_change ?? product.rank_movement;
                            const movement = Number(typeof movementValue === "object" ? movementValue?.movement ?? movementValue?.change ?? fallbackMovement : movementValue ?? fallbackMovement);
                            const direction = String(product.rank_movement_direction || (movement > 0 ? "UP" : movement < 0 ? "DOWN" : "SAME")).toUpperCase();
                            return <tr key={product.product_id} className={`vip-impact-customer-row vip-impact-customer-row--${group.key}`}>
                            <td><div className="pt-rank-move"><span className="pr-rank">{currentRank}</span><div><small>{previousRank === "—" ? "No prior rank" : `was #${previousRank}`}</small><strong className={direction === "DOWN" ? "pr-negative" : direction === "UP" ? "pt-positive" : "pr-subtle"}>{direction === "UP" ? "▲ " : direction === "DOWN" ? "▼ " : ""}{Math.abs(movement) || "—"}</strong></div></div></td>
                            <td><div style={styles.product}>{product.product_name}</div><div style={styles.meta}>{product.brand_name} · {product.category_name}</div></td>
                            <td>{stockDisplay(product)}</td>
                            <td className="vip-current-sales-cell" style={selectedMonthStyle}><div style={styles.monthCell}>{visibleMetrics.quantity && totalSold(product.current_month?.quantity_sold, product.current_month?.pieces_sold, true, product.quantity)}{visibleMetrics.quantity && <span title={`${comparisonVerdict.label} versus last month`} style={{ display: "block", width: 64, height: 3, marginTop: 6, marginBottom: 3, borderRadius: 999, background: averageVerdict.color }} />}{visibleMetrics.sales && <span className="vip-current-sales-value">{money(product.current_month?.sales_amount)}</span>}{visibleMetrics.profit && <span style={styles.profit}>Profit {money(product.current_month?.profit_amount)}</span>}{visibleMetrics.profitMargin && <span style={styles.profitMargin}>Margin {profitMarginLabel(product.current_month?.profit_amount, product.current_month?.sales_amount)}</span>}{Number(product.current_month?.pieces_sold) === 0 && <span style={styles.dormant}>NOT SOLD</span>}</div></td>
                            {(product.previous_months || []).map(month => <td key={month.month}><div style={styles.monthCell}>{visibleMetrics.quantity && totalSold(month.quantity_sold, month.pieces_sold, false, product.quantity)}{visibleMetrics.sales && <span>{money(month.sales_amount)}</span>}{visibleMetrics.profit && <span style={styles.profit}>Profit {money(month.profit_amount)}</span>}{visibleMetrics.profitMargin && <span style={styles.profitMargin}>Margin {profitMarginLabel(month.profit_amount, month.sales_amount)}</span>}</div></td>)}
                            <td style={styles.averageCell}><div style={styles.monthCell}>{visibleMetrics.quantity && totalSold(product.average_quantity, product.average_pieces, false, product.quantity)}{visibleMetrics.sales && <span>{money(product.average_sales)}</span>}{visibleMetrics.profit && <span style={styles.profit}>Profit {money(product.average_profit)}</span>}{visibleMetrics.profitMargin && <span style={styles.profitMargin}>Margin {profitMarginLabel(product.average_profit, product.average_sales)}</span>}</div></td>
                            <td style={{ padding: "12px 14px" }}>
                                <div><span style={{ display: "block", marginBottom: 6, color: "#64748b", fontSize: 9, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase" }}>3-month average</span><span style={{ display: "inline-flex", padding: "5px 9px", borderRadius: 999, fontSize: 11, fontWeight: 800, color: averageVerdict.color, background: averageVerdict.background }}>{averageVerdict.label}</span><span style={{ display: "block", marginTop: 5, color: averageVerdict.color, fontSize: 15, fontWeight: 800 }}>{averagePercentage >= 0 ? "+" : ""}{number(averagePercentage)}%</span></div>
                                <div style={{ marginTop: 12, paddingTop: 10, borderTop: "2px solid #cbd5e1" }}><span style={{ display: "block", marginBottom: 5, color: "#64748b", fontSize: 9, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase" }}>Vs {showingTruePreviousMonth ? `last month (${comparisonReferenceLabel})` : comparisonReferenceLabel}</span><span style={{ display: "inline-flex", marginBottom: 5, padding: "5px 9px", borderRadius: 999, fontSize: 11, fontWeight: 800, color: comparisonVerdict.color, background: comparisonVerdict.background }}>{comparisonVerdict.label}</span><span style={{ display: "block", color: comparisonVerdict.color, fontSize: 15, fontWeight: 800 }}>{comparePercentage >= 0 ? "+" : ""}{number(comparePercentage)}%</span></div>
                                {projection && <div style={{ marginTop: 14, paddingTop: 12, borderTop: "4px double #94a3b8" }}>
                                    <span style={{ display: "block", marginBottom: 5, color: "#64748b", fontSize: 9, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase" }}>{projection.projected ? "Projected month-end output" : "Final output"}</span>
                                    <strong style={{ display: "block", color: "#1d4ed8", lineHeight: 1.4 }}>{number(projection.boxes)} Box<br/>{number(projection.pieces)} Pc</strong>
                                    {projection.projected && <span style={{ display: "block", marginTop: 3, color: "#64748b", fontSize: 9 }}>Based on current daily sales</span>}
                                    {projectionStatus && <div style={{ marginTop: 7 }}>
                                        <span style={{ display: "inline-flex", padding: "4px 8px", borderRadius: 999, color: projectionStatus.color, background: projectionStatus.background, fontSize: 10, fontWeight: 900 }}>{projectionStatus.label}</span>
                                        <span style={{ display: "block", marginTop: 4, color: projectionStatus.color, fontSize: 11, fontWeight: 800 }}>{number(projectionStatus.attainment)}% of 3-month average</span>
                                    </div>}
                                </div>}
                            </td>
                            <td style={styles.actionCell}><Button size="sm" variant="outline-primary" title="View graph" aria-label={`View graph for ${product.product_name}`} onClick={() => openProductGraph(product.product_id)} style={{ width: 34, height: 32, padding: 0 }}><BarChartIcon fontSize="small" /></Button></td>
                        </tr>;
                        })}</React.Fragment>)}
                        {!loading && visibleProducts.length === 0 && <tr><td colSpan={tableColumnCount} className="text-center text-muted py-4">No products match this impact group.</td></tr>}
                    </tbody>
                </table>
            </div>
        </>}
    </div>;
};

export default VipProductSoldHistory;
