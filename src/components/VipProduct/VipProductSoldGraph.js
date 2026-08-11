import React, { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { BarChart } from "@mui/x-charts/BarChart";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import VipProductTransactionService from "./VipProductTransactionService";

const money = value => Number(value || 0).toLocaleString("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 2 });

const VipProductSoldGraph = () => {
    const { id, productId } = useParams();
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [metric, setMetric] = useState("sales");
    const month = params.get("month") || "";
    const comparisonPage = Number(params.get("comparison_page") || 0);

    useEffect(() => {
        VipProductTransactionService.fetchVipProductMonthlySold(id, month, { comparison_page: comparisonPage })
            .then(response => setReport(response.data))
            .catch(requestError => setError(requestError.response?.data?.message || "Unable to load VIP product graph."))
            .finally(() => setLoading(false));
    }, [id, month, comparisonPage]);

    const product = (report?.data || []).find(item => String(item.product_id) === String(productId));
    const chartData = useMemo(() => product && report ? [
        { month: report.report_month?.label, sales: Number(product.current_month?.sales_amount || 0), profit: Number(product.current_month?.profit_amount || 0), quantity: Number(product.current_month?.quantity_sold || 0) },
        ...(product.previous_months || []).map(item => ({ month: item.label, sales: Number(item.sales_amount || 0), profit: Number(item.profit_amount || 0), quantity: Number(item.quantity_sold || 0) })),
    ] : [], [product, report]);
    const highest = chartData.length ? chartData.reduce((top, item) => item[metric] > top[metric] ? item : top) : null;
    const colors = chartData.map(item => item.month === highest?.month ? "#dc2626" : "#94a3b8");
    const isMoney = metric !== "quantity";
    const format = value => isMoney ? money(value) : `${Number(value || 0).toLocaleString("en-PH")} Box`;

    return <div style={{ minHeight: "100vh", padding: 22, background: "#f6f8fb" }}>
        {loading && <LinearProgress />}
        <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(-1)}>Back to VIP product history</Button>
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && !product && <div className="alert alert-warning">VIP product report was not found.</div>}
        {product && <section style={{ padding: 20, background: "#fff", border: "1px solid #e1e6ec", borderRadius: 12 }}>
            <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap"><div><small className="text-muted fw-bold">VIP PRODUCT MONTHLY REPORT</small><h3 className="fw-bold mb-1">{product.product_name}</h3><p className="text-muted mb-0">{product.brand_name} · {product.category_name}</p></div><div className="btn-group"><Button variant={metric === "sales" ? "primary" : "outline-primary"} onClick={() => setMetric("sales")}>Sales</Button><Button variant={metric === "profit" ? "warning" : "outline-warning"} onClick={() => setMetric("profit")}>Profit</Button><Button variant={metric === "quantity" ? "secondary" : "outline-secondary"} onClick={() => setMetric("quantity")}>Quantity</Button></div></div>
            {highest && <div style={{ margin: "18px 0 4px", padding: "13px 15px", borderLeft: "5px solid #dc2626", borderRadius: 9, background: "#fff7f7" }}><small style={{ color: "#dc2626", fontWeight: 800 }}>TOP MONTH · HIGHEST {metric.toUpperCase()}</small><strong style={{ display: "block", fontSize: 18 }}>{highest.month}</strong><b style={{ color: "#dc2626", fontSize: 18 }}>{format(highest[metric])}</b></div>}
            <div style={{ overflowX: "auto" }}><Box sx={{ minWidth: 680, height: 460 }}><BarChart dataset={chartData} height={460} margin={{ left: 90, right: 25, top: 60, bottom: 45 }} grid={{ horizontal: true }} barLabel={item => format(item.value)} series={[{ dataKey: metric, label: metric[0].toUpperCase() + metric.slice(1), valueFormatter: format }]} xAxis={[{ scaleType: "band", dataKey: "month", colorMap: { type: "ordinal", values: chartData.map(item => item.month), colors } }]} yAxis={[{ min: 0, width: 85, valueFormatter: value => isMoney ? new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", notation: "compact", maximumFractionDigits: 1 }).format(value) : Number(value).toLocaleString("en-PH") }]} sx={{ "& .MuiChartsGrid-line": { stroke: "#e5e7eb", strokeDasharray: "4 4" }, "& .MuiBarLabel-root": { fill: "#fff", fontSize: 12, fontWeight: 800 } }} /></Box></div>
        </section>}
    </div>;
};

export default VipProductSoldGraph;
