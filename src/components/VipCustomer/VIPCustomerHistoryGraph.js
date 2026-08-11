import React, { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { BarChart } from "@mui/x-charts/BarChart";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import VipCustomerTransactionService from "./VipCustomerTransactionService";

const money = value => Number(value || 0).toLocaleString("en-PH", {
    style: "currency", currency: "PHP", minimumFractionDigits: 2, maximumFractionDigits: 2,
});

const VIPCustomerHistoryGraph = () => {
    const { id, customerId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const month = searchParams.get("month") || "";
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [metric, setMetric] = useState("sales");

    useEffect(() => {
        setLoading(true);
        VipCustomerTransactionService.fetchVipCustomerMonthlyPaid(id, month)
            .then(response => setReport(response.data))
            .catch(requestError => setError(requestError.response?.data?.message || "Unable to load customer history."))
            .finally(() => setLoading(false));
    }, [id, month]);

    const customer = (report?.data || []).find(item =>
        String(item.customer_id || item.vip_customer_transaction_id) === String(customerId)
    );
    const chartData = useMemo(() => {
        if (!customer || !report) return [];
        return [
            {
                month: report.report_month?.label || "Selected month",
                sales: Number(customer.current_paid || 0),
                profit: Number(customer.current_profit || 0),
            },
            ...(customer.previous_months || []).map(item => ({
                month: item.label,
                sales: Number(item.paid_amount || 0),
                profit: Number(item.profit_amount || 0),
            })),
        ];
    }, [customer, report]);
    const highest = chartData.length
        ? chartData.reduce((top, item) => item[metric] > top[metric] ? item : top)
        : null;
    const colors = chartData.map(item => item.month === highest?.month ? "#dc2626" : "#94a3b8");

    return <div style={{ padding: "20px 24px", background: "#f7f9fb", minHeight: "100vh" }}>
        {loading && <LinearProgress />}
        <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(-1)}>
            Back to VIP history
        </Button>
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && !customer && <div className="alert alert-warning">Customer report was not found.</div>}
        {customer && <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
            <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                <div>
                    <p className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: 11 }}>Customer monthly report</p>
                    <h3 className="fw-bold mb-1">{customer.customer_name || "VIP Customer"}</h3>
                    <p className="text-muted mb-0">{customer.store_name || "No store name"}</p>
                </div>
                <div className="btn-group" role="group" aria-label="Graph metric">
                    <Button variant={metric === "sales" ? "primary" : "outline-primary"} onClick={() => setMetric("sales")}>Sales</Button>
                    <Button variant={metric === "profit" ? "warning" : "outline-warning"} onClick={() => setMetric("profit")}>Profit</Button>
                </div>
            </div>

            {highest && <div style={{ margin: "18px 0 4px", padding: "13px 15px", borderRadius: 9, borderLeft: "5px solid #dc2626", background: "#fff7f7" }}>
                <span style={{ display: "block", color: "#dc2626", fontSize: 10, fontWeight: 800, letterSpacing: ".06em" }}>TOP MONTH · HIGHEST {metric.toUpperCase()}</span>
                <strong style={{ display: "block", fontSize: 18 }}>{highest.month}</strong>
                <span style={{ color: "#dc2626", fontSize: 18, fontWeight: 800 }}>{money(highest[metric])}</span>
            </div>}

            <div style={{ overflowX: "auto" }}>
                <Box sx={{ minWidth: 680, height: 460 }}>
                    <BarChart
                        dataset={chartData}
                        height={460}
                        margin={{ left: 90, right: 25, top: 60, bottom: 45 }}
                        grid={{ horizontal: true }}
                        barLabel={item => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", notation: "compact", maximumFractionDigits: 2 }).format(Number(item.value || 0))}
                        series={[{ dataKey: metric, label: metric === "sales" ? "Paid sales" : "Profit", valueFormatter: money }]}
                        xAxis={[{ scaleType: "band", dataKey: "month", colorMap: { type: "ordinal", values: chartData.map(item => item.month), colors } }]}
                        yAxis={[{ min: 0, width: 85, valueFormatter: value => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", notation: "compact", maximumFractionDigits: 1 }).format(Number(value || 0)) }]}
                        sx={{
                            "& .MuiChartsGrid-line": { stroke: "#e5e7eb", strokeDasharray: "4 4" },
                            "& .MuiBarLabel-root": { fill: "#ffffff", fontSize: 12, fontWeight: 800 },
                            "& .MuiChartsAxis-tickLabel": { fill: "#596174", fontSize: 12 },
                        }}
                    />
                </Box>
            </div>
        </div>}
    </div>;
};

export default VIPCustomerHistoryGraph;
