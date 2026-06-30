import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";

const ReportBar = ({ transactionList, showProfit = false }) => {
    const [view, setView] = useState("sales");
    const data = transactionList?.data || [];

    const chartData = useMemo(
        () =>
            data.map((day) => ({
                ...day,
                total_sales: Number(day.total_sales || 0),
                total_profit: Number(day.total_profit || 0),
                total_count: Number(day.total_count || 0),
                displayDate: new Date(`${day.date}T00:00:00`).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                }),
            })),
        [data]
    );

    const metrics = {
        sales: {
            title: "Total sales by day",
            description: "Compare daily revenue across the selected period.",
            dataKey: "total_sales",
            label: "Total sales",
            color: "#4f46e5",
            currency: true,
        },
        profit: {
            title: "Gross profit by day",
            description: "See which days contributed the most gross profit.",
            dataKey: "total_profit",
            label: "Gross profit",
            color: "#14a895",
            currency: true,
        },
        transactions: {
            title: "Transactions by day",
            description: "Compare completed order volume across the selected period.",
            dataKey: "total_count",
            label: "Transactions",
            color: "#f59e0b",
            currency: false,
        },
    };

    const activeMetric = metrics[view];

    const numberFormat = (value) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
            maximumFractionDigits: 0,
        }).format(Number(value || 0));

    const compactCurrency = (value) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
            notation: "compact",
            maximumFractionDigits: 1,
        }).format(Number(value || 0));

    const peakDay = useMemo(() => {
        if (!chartData.length) return null;

        return chartData.reduce((peak, day) =>
            day[activeMetric.dataKey] > peak[activeMetric.dataKey] ? day : peak
        );
    }, [activeMetric.dataKey, chartData]);

    const chartHeight = Math.max(360, chartData.length * 48 + 90);
    const valueFormatter = (value) =>
        activeMetric.currency
            ? numberFormat(value)
            : `${Number(value || 0).toLocaleString("en-US")} transactions`;

    if (!chartData.length) {
        return (
            <div className="sales-report__empty">
                <span className="sales-report__empty-icon">↗</span>
                <strong>No chart data available</strong>
                <p>Try another date range to compare daily performance.</p>
            </div>
        );
    }

    return (
        <>
            <div className="sales-chart__header">
                <div>
                    <p className="sales-report__eyebrow">Daily performance</p>
                    <h2>{activeMetric.title}</h2>
                    <p>{activeMetric.description}</p>
                </div>
                <div className="sales-chart__toggle" aria-label="Chart metric">
                    <button
                        type="button"
                        className={view === "sales" ? "active" : ""}
                        onClick={() => setView("sales")}
                    >
                        Sales
                    </button>
                    {showProfit && (
                        <button
                            type="button"
                            className={view === "profit" ? "active" : ""}
                            onClick={() => setView("profit")}
                        >
                            Profit
                        </button>
                    )}
                    <button
                        type="button"
                        className={view === "transactions" ? "active" : ""}
                        onClick={() => setView("transactions")}
                    >
                        Transactions
                    </button>
                </div>
            </div>

            {peakDay && (
                <div className="sales-chart__insight">
                    <span>Peak day</span>
                    <strong>
                        {new Date(`${peakDay.date}T00:00:00`).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </strong>
                    <b>{valueFormatter(peakDay[activeMetric.dataKey])}</b>
                </div>
            )}

            <div className="sales-chart__scroll">
                <Box sx={{ minWidth: 700, height: chartHeight }}>
                    <BarChart
                        dataset={chartData}
                        layout="horizontal"
                        height={chartHeight}
                        margin={{ left: 78, right: 36, top: 28, bottom: 45 }}
                        grid={{ vertical: true }}
                        series={[
                            {
                                dataKey: activeMetric.dataKey,
                                label: activeMetric.label,
                                color: activeMetric.color,
                                valueFormatter,
                            },
                        ]}
                        xAxis={[
                            {
                                min: 0,
                                valueFormatter: activeMetric.currency
                                    ? compactCurrency
                                    : (value) => Number(value || 0).toLocaleString("en-US"),
                            },
                        ]}
                        yAxis={[
                            {
                                scaleType: "band",
                                dataKey: "displayDate",
                                width: 72,
                            },
                        ]}
                        sx={{
                            "& .MuiChartsGrid-line": {
                                stroke: "#e7e9f2",
                                strokeDasharray: "4 4",
                            },
                            "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
                                stroke: "#cfd3df",
                            },
                            "& .MuiChartsAxis-tickLabel": {
                                fill: "#596174",
                                fontSize: 12,
                            },
                        }}
                    />
                </Box>
            </div>
        </>
    );
};

export default ReportBar;
