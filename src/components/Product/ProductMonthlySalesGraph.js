import React, { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { BarChart } from "@mui/x-charts/BarChart";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ProductService from "./ProductService.service";
import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";

const money = value => Number(value || 0).toLocaleString("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 2 });

const ProductMonthlySalesGraph = () => {
    const { productId } = useParams();
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [metric, setMetric] = useState("sales");
    const month = params.get("month") || "";
    const comparisonPage = Number(params.get("comparison_page") || 0);
    const customerId = params.get("customer_id") || "";
    const source = params.get("source") || "";

    useEffect(() => {
        const request = source === "trend"
            ? ShopOrderTransactionService.fetchMonthlyProductSalesComparison({ month, limit: 5000, sort: "current_sales", direction: "desc", type: "ALL", supplier_id: null, category_id: null })
            : ProductService.fetchProductMonthlySales(month, { comparison_page: comparisonPage, ...(customerId ? { customer_id: customerId } : {}) });
        request
            .then(response => {
                if (source !== "trend") return setReport(response.data);
                const payload = response.data?.data && !Array.isArray(response.data.data) ? response.data.data : response.data || {};
                const rows = Array.isArray(payload.data) ? payload.data : Array.isArray(payload.products) ? payload.products : [];
                const item = rows.find(row => String(row.product_id || row.id) === String(productId));
                if (!item) return setReport({ data: [] });
                const history = item.three_month_comparison || item.three_month_sales || item.monthly_sales || [];
                const packSize = Math.max(1, Number(item.quantity || 1));
                const sales = entry => Number(entry?.sales ?? entry?.total_sales ?? entry?.sales_amount ?? entry?.total_price ?? entry?.amount ?? 0);
                const pieces = entry => Number(entry?.total_quantity ?? entry?.current_quantity ?? entry?.pieces_sold ?? entry?.quantity_sold ?? 0);
                const normalized = history.map(entry => ({ label: entry.label || entry.month, sales_amount: sales(entry), profit_amount: Number(entry.profit ?? entry.total_profit ?? entry.profit_amount ?? 0), quantity_sold: Math.floor(pieces(entry) / packSize) }));
                setReport({ report_month: { label: normalized[0]?.label || month }, data: [{ ...item, product_id: item.product_id || item.id, current_month: normalized[0] || {}, previous_months: normalized.slice(1) }] });
            })
            .catch(requestError => setError(requestError.response?.data?.message || "Unable to load product graph."))
            .finally(() => setLoading(false));
    }, [month, comparisonPage, customerId, source, productId]);

    const product = (report?.data || []).find(item => String(item.product_id) === String(productId));
    const chartData = useMemo(() => product && report ? [
        { month: report.report_month?.label, sales: Number(product.current_month?.sales_amount || 0), profit: Number(product.current_month?.profit_amount || 0), quantity: Number(product.current_month?.quantity_sold || 0) },
        ...(product.previous_months || []).map(item => ({ month: item.label, sales: Number(item.sales_amount || 0), profit: Number(item.profit_amount || 0), quantity: Number(item.quantity_sold || 0) })),
    ] : [], [product, report]);
    const highest = chartData.length ? chartData.reduce((top, item) => item[metric] > top[metric] ? item : top) : null;
    const colors = chartData.map(item => item.month === highest?.month ? "#dc2626" : "#94a3b8");
    const isMoney = metric !== "quantity";
    const formatValue = value => isMoney ? money(value) : `${Number(value || 0).toLocaleString("en-PH")} Box`;

    return <div style={{ minHeight: "100vh", padding: 22, background: "#f6f8fb" }}>
        {loading && <LinearProgress />}
        <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(-1)}>Back to product history</Button>
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && !product && <div className="alert alert-warning">Product report was not found.</div>}
        {product && <section style={{ padding: 20, background: "#fff", border: "1px solid #e1e6ec", borderRadius: 12 }}>
            <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                <div><p className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: 11 }}>Product monthly report</p><h3 className="fw-bold mb-1">{product.product_name}</h3><p className="text-muted mb-0">{product.brand_name} · {product.category_name}</p></div>
                <div className="btn-group"><Button variant={metric === "sales" ? "primary" : "outline-primary"} onClick={() => setMetric("sales")}>Sales</Button><Button variant={metric === "profit" ? "warning" : "outline-warning"} onClick={() => setMetric("profit")}>Profit</Button><Button variant={metric === "quantity" ? "secondary" : "outline-secondary"} onClick={() => setMetric("quantity")}>Quantity</Button></div>
            </div>
            {highest && <div style={{ margin: "18px 0 4px", padding: "13px 15px", borderLeft: "5px solid #dc2626", borderRadius: 9, background: "#fff7f7" }}><small style={{ color: "#dc2626", fontWeight: 800 }}>TOP MONTH · HIGHEST {metric.toUpperCase()}</small><strong style={{ display: "block", fontSize: 18 }}>{highest.month}</strong><b style={{ color: "#dc2626", fontSize: 18 }}>{formatValue(highest[metric])}</b></div>}
            <div style={{ overflowX: "auto" }}><Box sx={{ minWidth: 680, height: 460 }}><BarChart dataset={chartData} height={460} margin={{ left: 90, right: 25, top: 60, bottom: 45 }} grid={{ horizontal: true }} barLabel={item => formatValue(item.value)} series={[{ dataKey: metric, label: metric[0].toUpperCase() + metric.slice(1), valueFormatter: formatValue }]} xAxis={[{ scaleType: "band", dataKey: "month", colorMap: { type: "ordinal", values: chartData.map(item => item.month), colors } }]} yAxis={[{ min: 0, width: 85, valueFormatter: value => isMoney ? new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", notation: "compact", maximumFractionDigits: 1 }).format(value) : Number(value).toLocaleString("en-PH") }]} sx={{ "& .MuiChartsGrid-line": { stroke: "#e5e7eb", strokeDasharray: "4 4" }, "& .MuiBarLabel-root": { fill: "#fff", fontSize: 12, fontWeight: 800 } }} /></Box></div>
        </section>}
    </div>;
};

export default ProductMonthlySalesGraph;
