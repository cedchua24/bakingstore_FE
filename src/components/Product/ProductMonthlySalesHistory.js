import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import LinearProgress from "@mui/material/LinearProgress";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useLocation } from "react-router-dom";
import ProductService from "./ProductService.service";

const money = value => Number(value || 0).toLocaleString("en-PH", {
    style: "currency", currency: "PHP", minimumFractionDigits: 2, maximumFractionDigits: 2,
});
const number = value => Number(value || 0).toLocaleString("en-PH", { maximumFractionDigits: 2 });
const totalSold = (quantity, pieces, emphasized = false) => {
    if (Number(quantity || 0) === 0 && Number(pieces || 0) === 0) return null;
    return <div style={{ whiteSpace: "nowrap", fontSize: emphasized ? 15 : 12.5, fontWeight: emphasized ? 900 : 750 }}>
        <span>{number(quantity)} Box</span><span style={{ margin: "0 4px", color: "#94a3b8", fontWeight: 600 }}>/</span><span>{number(pieces)} Pc</span>
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
const shiftMonth = (month, offset) => {
    const [year, monthNumber] = month.split("-").map(Number);
    const date = new Date(year, monthNumber - 1 + offset, 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
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
    table: { minWidth: 1260, marginBottom: 0, tableLayout: "fixed" },
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
    notSold: { display: "inline-flex", width: "fit-content", padding: "3px 7px", borderRadius: 999, color: "#a61b1b", background: "#f8d7da", fontSize: 9, fontWeight: 800, letterSpacing: ".04em" },
};

const ProductMonthlySalesHistory = () => {
    const location = useLocation();
    const initialParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const customerId = initialParams.get("customer_id") || "";
    const customerName = initialParams.get("customer_name") || "";
    const initialMonth = initialParams.get("month") || currentMonth();
    const initialComparisonPage = Math.max(0, Number(initialParams.get("comparison_page") || 0));
    const [month, setMonth] = useState(initialMonth);
    const [comparisonPage, setComparisonPage] = useState(initialComparisonPage);
    const [report, setReport] = useState(null);
    const [mode, setMode] = useState("all");
    const [query, setQuery] = useState("");
    const [visibleMetrics, setVisibleMetrics] = useState({ quantity: true, sales: false, profit: false });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const load = useCallback((selectedMonth, selectedComparisonPage = 0) => {
        setLoading(true);
        setError("");
        const filters = { comparison_page: selectedComparisonPage, ...(customerId ? { customer_id: customerId } : {}) };
        return ProductService.fetchProductMonthlySales(selectedMonth, filters)
            .then(response => setReport(response.data))
            .catch(requestError => {
                setReport(null);
                setError(requestError.response?.data?.message || "Unable to load monthly product sales.");
            })
            .finally(() => setLoading(false));
    }, [customerId]);

    useEffect(() => { load(initialMonth, initialComparisonPage); }, [initialMonth, initialComparisonPage, load]);

    const products = useMemo(() => Array.isArray(report?.data) ? report.data : [], [report]);
    const visibleProducts = useMemo(() => {
        const search = query.trim().toLowerCase();
        let list = products.filter(product => !search || [product.product_name, product.category_name, product.brand_name]
            .some(value => String(value || "").toLowerCase().includes(search)));
        if (mode === "high") list = list.filter(product => product.sales_status === "HIGH_SALES");
        if (mode === "low") list = list.filter(product => product.sales_status === "LOW_SALES");
        if (mode === "no_sales") list = list.filter(product => product.sales_status === "NO_SALES");
        if (mode === "no_sales_4") list = list.filter(product => product.sales_status === "NO_SALES_4_MONTHS");
        if (mode === "sold") list = list.filter(product => Number(product.current_month?.sales_amount || 0) > 0);
        if (mode === "trending") list = list.filter(product => product.sales_trend === "HIGHER");
        if (mode === "highest") list = list.filter(product => Number(product.average_sales || 0) > 0);
        if (["highest", "all"].includes(mode)) {
            return [...list].sort((a, b) => {
                const averageDifference = Number(b.average_sales || 0) - Number(a.average_sales || 0);
                return averageDifference || Number(b.current_month?.sales_amount || 0) - Number(a.current_month?.sales_amount || 0);
            });
        }
        if (["high", "trending", "sold"].includes(mode)) {
            return [...list].sort((a, b) => Number(b.current_month?.sales_amount || 0) - Number(a.current_month?.sales_amount || 0));
        }
        if (mode === "low") return [...list].sort((a, b) => Number(a.current_month?.sales_amount || 0) - Number(b.current_month?.sales_amount || 0));
        return [...list].sort((a, b) => Number(b.average_sales || 0) - Number(a.average_sales || 0));
    }, [products, mode, query]);

    const setAndLoad = selectedMonth => {
        setMonth(selectedMonth);
        setComparisonPage(0);
        load(selectedMonth, 0);
    };
    const changeComparisonPage = selectedPage => {
        if (selectedPage === null || selectedPage === undefined || selectedPage < 0) return;
        setComparisonPage(selectedPage);
        load(month, selectedPage);
    };
    const gap = Number(report?.sales_average_gap || 0);
    const counts = report?.counts || {};
    const toggleMetric = metric => setVisibleMetrics(current => ({ ...current, [metric]: !current[metric] }));

    return <div style={styles.page}>
        {loading && <LinearProgress />}
        <header style={styles.header}>
            <h2 className="fw-bold mb-1">{customerName ? `${customerName} Products Sold History` : "Products Sold History"}</h2>
            <p className="text-muted mb-0">
                {customerId
                    ? "All enabled products are shown; sales are filtered to this customer, including products with zero sales."
                    : "Compare all products across the selected month and the previous three months."}
            </p>
        </header>
        <div style={styles.filter}>
            <Form onSubmit={event => { event.preventDefault(); setComparisonPage(0); load(month, 0); }}><div style={styles.filterRow}>
                <Button type="button" variant="outline-secondary" onClick={() => setAndLoad(shiftMonth(month, -1))}>Previous month</Button>
                <Form.Group><Form.Label>Report month</Form.Label><Form.Control type="month" value={month} onChange={event => setMonth(event.target.value)} required /></Form.Group>
                <Button type="submit">View month</Button>
                <Button type="button" variant="outline-primary" onClick={() => setAndLoad(shiftMonth(month, 1))}>Next month</Button>
                <Button type="button" variant="outline-secondary" onClick={() => setAndLoad(currentMonth())}>Current month</Button>
            </div></Form>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {report && <>
            <section style={styles.summary}>
                <div style={{ ...styles.card, border: `2px solid ${gap >= 0 ? "#198754" : "#dc3545"}`, background: gap >= 0 ? "#f0fff4" : "#fff5f5" }}><p style={styles.label}>Selected month: {report.report_month?.label}</p><p style={{ ...styles.value, color: gap >= 0 ? "#146c43" : "#dc3545" }}>{money(report.current_month?.sales_amount)}</p></div>
                <div style={styles.card}><p style={styles.label}>Previous 3-month average</p><p style={styles.value}>{money(report.average_sales)}</p></div>
                <div style={styles.card}><p style={styles.label}>Sales vs average</p><p style={{ ...styles.value, color: gap >= 0 ? "#146c43" : "#dc3545" }}>{gap >= 0 ? "+" : "-"}{money(Math.abs(gap))}</p></div>
                <div style={styles.card}><p style={styles.label}>Total sold</p><p style={{ ...styles.value, fontSize: 17 }}>{number(report.current_month?.quantity_sold)} Box / {number(report.current_month?.pieces_sold)} Pc</p></div>
                <div style={styles.card}><p style={styles.label}>Selected-month profit</p><p style={{ ...styles.value, color: "#6f42c1" }}>{money(report.current_month?.profit_amount)}</p></div>
                <div style={{ ...styles.card, background: "#fff5f5", borderColor: "#f1aeb5" }}><p style={styles.label}>No sales in selected month</p><p style={{ ...styles.value, color: "#dc3545" }}>{number(counts.no_sales)}</p></div>
            </section>
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
                <div className="btn-group flex-wrap" role="group">
                    {[["all", `All (${counts.total_products || 0})`], ["sold", `Have sales (${Math.max(0, Number(counts.total_products || 0) - Number(counts.no_sales || 0))})`], ["highest", "Highest (3 months)"], ["trending", "Trending up"], ["high", `High (${counts.high_sales || 0})`], ["low", `Low (${counts.low_sales || 0})`], ["no_sales", "No sales now"], ["no_sales_4", "No sales 4 months"]].map(([key, label]) =>
                        <Button key={key} size="sm" variant={mode === key ? (key.startsWith("no_sales") ? "danger" : "primary") : "outline-secondary"} onClick={() => setMode(key)}>{label}</Button>
                    )}
                </div>
                <div style={styles.toolsRow}>
                    <div className="d-flex align-items-center gap-3 px-2 py-1 border rounded bg-light">
                        <strong className="small text-muted">Show:</strong>
                        {[['quantity', 'Quantity'], ['sales', 'Sales'], ['profit', 'Profit']].map(([key, label]) =>
                            <Form.Check key={key} inline className="mb-0" type="checkbox" id={`metric-${key}`} label={label} checked={visibleMetrics[key]} onChange={() => toggleMetric(key)} />
                        )}
                    </div>
                    <Form.Control style={{ width: 300, maxWidth: "100%" }} placeholder="Search product, category, brand..." value={query} onChange={event => setQuery(event.target.value)} />
                </div>
            </div>
            <div style={styles.tableWrap}>
                <table className="table table-bordered table-hover align-middle" style={styles.table}>
                    <colgroup><col style={{ width: 220 }} /><col style={{ width: 90 }} /><col style={{ width: 155 }} /><col style={{ width: 155 }} /><col style={{ width: 155 }} /><col style={{ width: 155 }} /><col style={{ width: 155 }} /><col style={{ width: 145 }} /></colgroup>
                    <thead><tr><th style={styles.th}>Product<span style={styles.thHint}>Product details</span></th><th style={{ ...styles.th, textAlign: "center" }}>Stock<span style={styles.thHint}>Available</span></th><th style={styles.selectedTh}>{report.report_month?.label}<br/><span style={styles.selectedBadge}>Selected month</span></th>{(report.previous_months || []).map((item, index) => <th style={styles.th} key={item.month}>{item.label}<span style={styles.thHint}>{index === 0 ? "Previous month" : "Comparison month"}</span></th>)}<th style={styles.averageTh}>3-month average<span style={styles.thHint}>Current comparison</span></th><th style={styles.th}>Status / Trend<span style={styles.thHint}>Vs previous month</span></th></tr></thead>
                    <tbody>
                        {visibleProducts.map(product => {
                            const meta = statusMeta[product.sales_status] || statusMeta.UNCHANGED;
                            const trend = trendMeta[product.sales_trend] || trendMeta.UNCHANGED;
                            return <tr key={product.product_id}>
                                <td><div style={styles.product}>{product.product_name}</div><div style={styles.meta}>{product.brand_name} · {product.category_name}</div></td>
                                <td>{stockDisplay(product)}</td>
                                <td className={selectedMonthClass(product)}><div style={styles.month}>{visibleMetrics.quantity && totalSold(product.current_month?.quantity_sold, product.current_month?.pieces_sold, true)}{visibleMetrics.sales && <span>{money(product.current_month?.sales_amount)}</span>}{visibleMetrics.profit && <span style={styles.profit}>Profit {money(product.current_month?.profit_amount)}</span>}{Number(product.current_month?.sales_amount || 0) === 0 && <span style={styles.notSold}>NOT SOLD</span>}</div></td>
                                {(product.previous_months || []).map(item => <td key={item.month}><div style={styles.month}>{visibleMetrics.quantity && totalSold(item.quantity_sold, item.pieces_sold)}{visibleMetrics.sales && <span>{money(item.sales_amount)}</span>}{visibleMetrics.profit && <span style={styles.profit}>Profit {money(item.profit_amount)}</span>}</div></td>)}
                                <td style={styles.averageCell}><div style={styles.month}>{visibleMetrics.quantity && totalSold(product.average_quantity, product.average_pieces)}{visibleMetrics.sales && <span>{money(product.average_sales)}</span>}{visibleMetrics.profit && <span style={styles.profit}>Profit {money(product.average_profit)}</span>}</div></td>
                                <td><span style={{ display: "inline-flex", padding: "4px 8px", borderRadius: 999, fontSize: 10, fontWeight: 800, color: meta.color, background: meta.background }}>{meta.label}</span><div style={{ ...styles.meta, marginTop: 6, color: trend.color, fontWeight: 800 }}>{trend.label}{product.sales_change_percentage === null ? "" : ` · ${Number(product.sales_change_percentage) >= 0 ? "+" : ""}${number(product.sales_change_percentage)}%`}</div></td>
                            </tr>;
                        })}
                        {!loading && visibleProducts.length === 0 && <tr><td colSpan="8" className="text-center text-muted py-4">No products match this view.</td></tr>}
                    </tbody>
                </table>
            </div>
        </>}
    </div>;
};

export default ProductMonthlySalesHistory;
