import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import LinearProgress from "@mui/material/LinearProgress";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useNavigate, useParams } from "react-router-dom";
import VipProductTransactionService from "./VipProductTransactionService";

const money = value => Number(value || 0).toLocaleString("en-PH", {
    style: "currency", currency: "PHP", minimumFractionDigits: 2, maximumFractionDigits: 2,
});
const number = value => Number(value || 0).toLocaleString("en-PH", { maximumFractionDigits: 2 });
const totalSold = (quantity, pieces, emphasized = false) => {
    if (Number(quantity || 0) === 0 && Number(pieces || 0) === 0) return null;
    return <div style={{ whiteSpace: "nowrap", fontSize: emphasized ? 15 : 12.5, fontWeight: emphasized ? 900 : 750 }}><span>{number(quantity)} Box</span><span style={{ margin: "0 4px", color: "#94a3b8", fontWeight: 600 }}>/</span><span>{number(pieces)} Pc</span></div>;
};
const stockDisplay = product => {
    const boxes = Number(product.stock || 0);
    const pieces = Number(product.stock_pc || 0);
    if (boxes <= 0 && pieces <= 0) return <span style={{ display: "inline-flex", padding: "2px 6px", borderRadius: 999, color: "#b42318", background: "#fff1f0", border: "1px solid #fecaca", fontSize: 9, fontWeight: 700, whiteSpace: "nowrap" }}>Out of stock</span>;
    return <span style={{ color: "#64748b", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{boxes > 0 ? `${number(boxes)} Box` : `${number(pieces)} Pc`}</span>;
};
const selectedMonthClass = () => {
    return "table-info";
};
const thisMonth = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};
const moveMonth = (month, offset) => {
    const [year, monthNumber] = month.split("-").map(Number);
    const date = new Date(year, monthNumber - 1 + offset, 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};
const quantityDifference = product => {
    const comparison = product.previous_months?.[0];
    const currentBoxes = Number(product.current_month?.quantity_sold || 0);
    const comparisonBoxes = Number(comparison?.quantity_sold || 0);
    return currentBoxes !== comparisonBoxes
        ? currentBoxes - comparisonBoxes
        : Number(product.current_month?.pieces_sold || 0) - Number(comparison?.pieces_sold || 0);
};
const averageQuantityDifference = product => {
    const currentBoxes = Number(product.current_month?.quantity_sold || 0);
    const averageBoxes = Number(product.average_quantity || 0);
    return currentBoxes !== averageBoxes
        ? currentBoxes - averageBoxes
        : Number(product.current_month?.pieces_sold || 0) - Number(product.average_pieces || 0);
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
    selectedTh: { color: "#fff", background: "#356fa8", borderColor: "#78a8d5", borderBottom: "4px solid #8ec5ff", verticalAlign: "middle", padding: "10px 9px", fontSize: 17 },
    selectedBadge: { display: "inline-flex", marginTop: 5, padding: "2px 6px", borderRadius: 999, color: "#fff", background: "#2563eb", fontSize: 8, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase" },
    thHint: { display: "block", marginTop: 4, color: "#e2e8f0", fontSize: 8, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase" },
    averageTh: { color: "#fff", background: "#6b7280", borderColor: "#8c929d", verticalAlign: "middle", padding: "12px 9px" },
    averageCell: { background: "#f8fafc" },
    product: { fontWeight: 800, fontSize: 15, lineHeight: 1.25, marginBottom: 2 },
    meta: { color: "#6b7280", fontSize: 11 },
    monthCell: { display: "flex", flexDirection: "column", gap: 3 },
    profit: { color: "#6f42c1", fontSize: 11, fontWeight: 700 },
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
    const [mode, setMode] = useState("all");
    const [visibleMetrics, setVisibleMetrics] = useState({ quantity: true, sales: false, profit: false });
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const load = useCallback((month, page = 0) => {
        setLoading(true);
        setError("");
        return VipProductTransactionService.fetchVipProductMonthlySold(id, month, { comparison_page: page })
            .then(response => setReport(response.data))
            .catch(requestError => {
                setReport(null);
                setError(requestError.response?.data?.message || "Unable to load product sales history.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => { load(thisMonth(), 0); }, [load]);

    const products = Array.isArray(report?.data) ? report.data : [];
    const dormantProducts = products.filter(product =>
        Number(product.current_month?.quantity_sold || 0) === 0
        && Number(product.current_month?.pieces_sold || 0) === 0
        && (product.previous_months || []).some(month => Number(month.quantity_sold || 0) > 0 || Number(month.pieces_sold || 0) > 0)
    );
    const activeProducts = products.filter(product => Number(product.current_month?.quantity_sold || 0) > 0 || Number(product.current_month?.pieces_sold || 0) > 0);
    const visibleProducts = useMemo(() => {
        const search = query.trim().toLowerCase();
        const matched = products.filter(product => !search || [product.product_name, product.brand_name, product.category_name]
            .some(value => String(value || "").toLowerCase().includes(search)));
        if (mode === "dormant") return matched.filter(product => dormantProducts.includes(product)).sort((a, b) => Number(b.average_sales) - Number(a.average_sales));
        if (mode === "comparison_higher") return matched.filter(product => quantityDifference(product) > 0).sort((a, b) => quantityDifference(b) - quantityDifference(a));
        if (mode === "comparison_lower") return matched.filter(product => quantityDifference(product) < 0).sort((a, b) => quantityDifference(a) - quantityDifference(b));
        if (mode === "average_higher") return matched.filter(product => averageQuantityDifference(product) > 0).sort((a, b) => averageQuantityDifference(b) - averageQuantityDifference(a));
        if (mode === "average_lower") return matched.filter(product => averageQuantityDifference(product) < 0).sort((a, b) => averageQuantityDifference(a) - averageQuantityDifference(b));
        if (mode === "current_highest") return matched.filter(product => activeProducts.includes(product)).sort((a, b) => Number(b.current_month?.sales_amount || 0) - Number(a.current_month?.sales_amount || 0));
        if (mode === "current_lowest") return matched.filter(product => activeProducts.includes(product)).sort((a, b) => Number(a.current_month?.sales_amount || 0) - Number(b.current_month?.sales_amount || 0));
        return matched.sort((a, b) => Number(b.average_sales || 0) - Number(a.average_sales || 0));
    }, [mode, products, dormantProducts, activeProducts, query]);

    const templateName = products[0]?.vip_product_name || "VIP Product";
    const change = Number(report?.sales_last_month_gap || 0);
    const setAndLoadMonth = month => { setSelectedMonth(month); setComparisonPage(0); load(month, 0); };
    const shift = offset => setAndLoadMonth(moveMonth(selectedMonth, offset));
    const toggleMetric = metric => setVisibleMetrics(current => ({ ...current, [metric]: !current[metric] }));
    const changeComparisonPage = page => {
        if (page === null || page === undefined || page < 0) return;
        setComparisonPage(page);
        load(selectedMonth, page);
    };
    const showingTruePreviousMonth = Number(report?.comparison?.page ?? comparisonPage) === 0;
    const comparisonReferenceLabel = report?.previous_months?.[0]?.label || "comparison month";
    const shortComparisonLabel = showingTruePreviousMonth ? "last month" : comparisonReferenceLabel;
    const comparisonHigherCount = products.filter(product => quantityDifference(product) > 0).length;
    const comparisonLowerCount = products.filter(product => quantityDifference(product) < 0).length;
    const averageHigherCount = products.filter(product => averageQuantityDifference(product) > 0).length;
    const averageLowerCount = products.filter(product => averageQuantityDifference(product) < 0).length;
    const openProductGraph = productId => navigate(`/vipProductSoldHistory/${id}/product/${productId}?month=${selectedMonth}&comparison_page=${comparisonPage}`);

    return <div style={styles.page}>
        {loading && <LinearProgress color="primary" />}
        <header style={styles.header}>
            <h2 style={styles.title}>{templateName} Product Sold History</h2>
            <p style={styles.subtitle}>Find products losing momentum and compare best and low performers across recent months.</p>
        </header>

        <div style={styles.filter}>
            <Form onSubmit={event => { event.preventDefault(); setComparisonPage(0); load(selectedMonth, 0); }}>
                <div style={styles.filterRow}>
                    <Button type="button" variant="outline-secondary" onClick={() => shift(-1)} disabled={loading}>Previous month</Button>
                    <Form.Group>
                        <Form.Label>Report month</Form.Label>
                        <Form.Control type="month" value={selectedMonth} onChange={event => setSelectedMonth(event.target.value)} required />
                    </Form.Group>
                    <Button type="submit" disabled={loading}>View month</Button>
                    <Button type="button" variant="outline-primary" onClick={() => shift(1)} disabled={loading}>Next month</Button>
                    <Button type="button" variant="outline-secondary" onClick={() => setAndLoadMonth(thisMonth())} disabled={loading}>Current month</Button>
                </div>
            </Form>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {report && <>
            <section style={styles.summary}>
                <div style={{ ...styles.card, border: "2px solid #198754", background: "#f0fff4" }}><p style={styles.label}>{report.report_month?.label} sales</p><p style={{ ...styles.value, color: "#146c43" }}>{money(report.current_month?.sales_amount)}</p></div>
                <div style={styles.card}><p style={styles.label}>Pieces sold</p><p style={styles.value}>{number(report.current_month?.pieces_sold)}</p></div>
                <div style={styles.card}><p style={styles.label}>Current profit</p><p style={{ ...styles.value, color: "#6f42c1" }}>{money(report.current_month?.profit_amount)}</p></div>
                <div style={styles.card}><p style={styles.label}>3-month average sales</p><p style={styles.value}>{money(report.average_sales)}</p></div>
                <div style={{ ...styles.card, background: dormantProducts.length ? "#fff5f5" : "#f0fff4", borderColor: dormantProducts.length ? "#f1aeb5" : "#a3cfbb" }}><p style={styles.label}>Sold before, not this month</p><p style={{ ...styles.value, color: dormantProducts.length ? "#dc3545" : "#146c43" }}>{dormantProducts.length}</p></div>
                <div style={styles.card}><p style={styles.label}>Sales vs last month</p><p style={{ ...styles.value, color: change >= 0 ? "#146c43" : "#dc3545" }}>{change >= 0 ? "+" : "-"}{money(Math.abs(change))}</p></div>
            </section>

            <section style={{ ...styles.card, marginBottom: 12, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div><p style={{ ...styles.label, marginBottom: 2 }}>Comparison months</p><strong>{(report.comparison?.months || report.previous_months || []).map(item => item.label).join(" · ") || "No comparison months available"}</strong><span style={{ ...styles.meta, marginLeft: 8 }}>Block {Number(report.comparison?.page ?? comparisonPage) + 1}</span></div>
                <div className="d-flex gap-2">
                    <Button size="sm" variant="outline-primary" title="Show newer comparison months" aria-label="Show newer comparison months" disabled={loading || !report.comparison?.has_newer} onClick={() => changeComparisonPage(report.comparison?.newer_page)}><ChevronLeftIcon /></Button>
                    <Button size="sm" variant="outline-primary" title="Show older comparison months" aria-label="Show older comparison months" disabled={loading || !report.comparison?.has_older} onClick={() => changeComparisonPage(report.comparison?.older_page)}><ChevronRightIcon /></Button>
                </div>
            </section>

            <div style={styles.modeBar}>
                <div style={styles.modeRow}>
                    <div className="btn-group flex-wrap w-100" role="group" aria-label="Product ranking view">
                        {[['all', `All (${products.length})`], ['current_highest', 'Highest sales'], ['current_lowest', 'Lowest sales'], ['dormant', `No sales in ${report.report_month?.label} (${dormantProducts.length})`]].map(([key, label]) =>
                            <Button key={key} size="sm" style={{ flex: "1 1 190px" }} variant={mode === key ? (key === 'dormant' ? 'danger' : 'primary') : 'outline-secondary'} onClick={() => setMode(key)}>{label}</Button>
                        )}
                    </div>
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap px-2 py-2 border rounded bg-light">
                    <strong className="small text-muted me-1">Compare quantity with {shortComparisonLabel}:</strong>
                    <Button size="sm" variant={mode === "comparison_higher" ? "success" : "outline-success"} onClick={() => setMode("comparison_higher")}>Higher ({comparisonHigherCount})</Button>
                    <Button size="sm" variant={mode === "comparison_lower" ? "danger" : "outline-danger"} onClick={() => setMode("comparison_lower")}>Lower ({comparisonLowerCount})</Button>
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap px-2 py-2 border rounded bg-light">
                    <strong className="small text-muted me-1">Compare quantity with 3-month average:</strong>
                    <Button size="sm" variant={mode === "average_higher" ? "success" : "outline-success"} onClick={() => setMode("average_higher")}>Higher ({averageHigherCount})</Button>
                    <Button size="sm" variant={mode === "average_lower" ? "danger" : "outline-danger"} onClick={() => setMode("average_lower")}>Lower ({averageLowerCount})</Button>
                </div>
                <div style={styles.modeRow}>
                    <div style={styles.metricControls}>
                        <strong className="small text-muted">Show:</strong>
                        {[['quantity', 'Quantity'], ['sales', 'Sales'], ['profit', 'Profit']].map(([key, label]) =>
                            <Form.Check key={key} inline className="mb-0" type="checkbox" id={`vip-metric-${key}`} label={label} checked={visibleMetrics[key]} onChange={() => toggleMetric(key)} />
                        )}
                    </div>
                    <Form.Control style={{ width: 300, maxWidth: "100%" }} placeholder="Search product, category, brand..." value={query} onChange={event => setQuery(event.target.value)} />
                </div>
            </div>

            <div style={styles.tableWrap}>
                <table className="table table-bordered table-hover align-middle" style={styles.table}>
                    <colgroup><col style={{ width: 180 }} /><col style={{ width: 75 }} /><col style={{ width: 140 }} /><col style={{ width: 140 }} /><col style={{ width: 140 }} /><col style={{ width: 140 }} /><col style={{ width: 170 }} /><col style={{ width: 210 }} /><col style={{ width: 52 }} /></colgroup>
                    <thead><tr>
                        <th style={styles.th}>Product<span style={styles.thHint}>Product details</span></th><th style={{ ...styles.th, textAlign: "center" }}>Stock<span style={styles.thHint}>Available</span></th><th style={styles.selectedTh}>{report.report_month?.label}<br/><span style={styles.selectedBadge}>Selected month</span></th>
                        {(report.previous_months || []).map((month, index) => <th style={styles.th} key={month.month}>{month.label}<span style={styles.thHint}>{index === 0 && showingTruePreviousMonth ? "Previous month" : "Comparison month"}</span></th>)}
                        <th style={styles.averageTh}>3-month average<span style={styles.thHint}>Current comparison</span></th><th style={{ ...styles.th, textAlign: "left", padding: "12px 14px", fontSize: 15 }}>Status / Quantity Trend<span style={{ ...styles.thHint, fontSize: 9, marginTop: 6 }}>Boxes vs {showingTruePreviousMonth ? "previous month" : comparisonReferenceLabel}</span></th><th style={styles.actionTh} title="View graph"><BarChartIcon fontSize="small" /></th>
                    </tr></thead>
                    <tbody>
                        {visibleProducts.map(product => {
                            const comparisonMonth = product.previous_months?.[0];
                            const currentBoxes = Number(product.current_month?.quantity_sold || 0);
                            const currentPieces = Number(product.current_month?.pieces_sold || 0);
                            const comparisonBoxes = Number(comparisonMonth?.quantity_sold || 0);
                            const comparisonPieces = Number(comparisonMonth?.pieces_sold || 0);
                            const averageBoxes = Number(product.average_quantity || 0);
                            const averagePieces = Number(product.average_pieces || 0);
                            const compareDifference = currentBoxes !== comparisonBoxes ? currentBoxes - comparisonBoxes : currentPieces - comparisonPieces;
                            const compareBasis = currentBoxes !== comparisonBoxes ? comparisonBoxes : comparisonPieces;
                            const comparePercentage = compareBasis > 0 ? (compareDifference / compareBasis) * 100 : compareDifference > 0 ? 100 : 0;
                            const averageDifference = currentBoxes !== averageBoxes ? currentBoxes - averageBoxes : currentPieces - averagePieces;
                            const averageBasis = currentBoxes !== averageBoxes ? averageBoxes : averagePieces;
                            const averagePercentage = averageBasis > 0 ? (averageDifference / averageBasis) * 100 : averageDifference > 0 ? 100 : 0;
                            const verdict = value => value > 0
                                ? { label: "High sales", color: "#146c43", background: "#d1e7dd" }
                                : value < 0 ? { label: "Low sales", color: "#dc3545", background: "#f8d7da" }
                                    : { label: "Unchanged", color: "#6c757d", background: "#e2e3e5" };
                            const averageVerdict = verdict(averageDifference);
                            const comparisonVerdict = verdict(compareDifference);
                            return <tr key={product.product_id}>
                            <td><div style={styles.product}>{product.product_name}</div><div style={styles.meta}>{product.brand_name} · {product.category_name}</div></td>
                            <td>{stockDisplay(product)}</td>
                            <td className={selectedMonthClass(product)}><div style={styles.monthCell}>{visibleMetrics.quantity && totalSold(product.current_month?.quantity_sold, product.current_month?.pieces_sold, true)}{visibleMetrics.sales && <span>{money(product.current_month?.sales_amount)}</span>}{visibleMetrics.profit && <span style={styles.profit}>Profit {money(product.current_month?.profit_amount)}</span>}{Number(product.current_month?.pieces_sold) === 0 && <span style={styles.dormant}>NOT SOLD</span>}</div></td>
                            {(product.previous_months || []).map(month => <td key={month.month}><div style={styles.monthCell}>{visibleMetrics.quantity && totalSold(month.quantity_sold, month.pieces_sold)}{visibleMetrics.sales && <span>{money(month.sales_amount)}</span>}{visibleMetrics.profit && <span style={styles.profit}>Profit {money(month.profit_amount)}</span>}</div></td>)}
                            <td style={styles.averageCell}><div style={styles.monthCell}>{visibleMetrics.quantity && totalSold(product.average_quantity, product.average_pieces)}{visibleMetrics.sales && <span>{money(product.average_sales)}</span>}{visibleMetrics.profit && <span style={styles.profit}>Profit {money(product.average_profit)}</span>}</div></td>
                            <td style={{ padding: "12px 14px" }}>
                                <div><span style={{ display: "block", marginBottom: 6, color: "#64748b", fontSize: 9, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase" }}>3-month average</span><span style={{ display: "inline-flex", padding: "5px 9px", borderRadius: 999, fontSize: 11, fontWeight: 800, color: averageVerdict.color, background: averageVerdict.background }}>{averageVerdict.label}</span><span style={{ display: "block", marginTop: 5, color: averageVerdict.color, fontSize: 15, fontWeight: 800 }}>{averagePercentage >= 0 ? "+" : ""}{number(averagePercentage)}%</span></div>
                                <div style={{ marginTop: 12, paddingTop: 10, borderTop: "2px solid #cbd5e1" }}><span style={{ display: "block", marginBottom: 5, color: "#64748b", fontSize: 9, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase" }}>Vs {showingTruePreviousMonth ? `last month (${comparisonReferenceLabel})` : comparisonReferenceLabel}</span><span style={{ display: "inline-flex", marginBottom: 5, padding: "5px 9px", borderRadius: 999, fontSize: 11, fontWeight: 800, color: comparisonVerdict.color, background: comparisonVerdict.background }}>{comparisonVerdict.label}</span><span style={{ display: "block", color: comparisonVerdict.color, fontSize: 15, fontWeight: 800 }}>{comparePercentage >= 0 ? "+" : ""}{number(comparePercentage)}%</span></div>
                            </td>
                            <td style={styles.actionCell}><Button size="sm" variant="outline-primary" title="View graph" aria-label={`View graph for ${product.product_name}`} onClick={() => openProductGraph(product.product_id)} style={{ width: 34, height: 32, padding: 0 }}><BarChartIcon fontSize="small" /></Button></td>
                        </tr>;
                        })}
                        {!loading && visibleProducts.length === 0 && <tr><td colSpan="9" className="text-center text-muted py-4">No products match this view.</td></tr>}
                    </tbody>
                </table>
            </div>
        </>}
    </div>;
};

export default VipProductSoldHistory;
