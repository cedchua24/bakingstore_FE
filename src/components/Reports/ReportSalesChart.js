import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';

const ReportSalesChart = ({ transactionList }) => {
    const [view, setView] = useState('sales');
    const data = transactionList?.data || [];

    const chartData = useMemo(
        () => data.map((day) => ({
            ...day,
            total_sales: Number(day.total_sales || 0),
            total_count: Number(day.total_count || 0),
            displayDate: new Date(`${day.date}T00:00:00`).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            }),
        })),
        [data]
    );

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'PHP',
            maximumFractionDigits: 0,
        }).format(Number(value || 0));

    const compactCurrency = (value) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'PHP',
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(Number(value || 0));

    const peakDay = useMemo(() => {
        if (!chartData.length) return null;

        return chartData.reduce((peak, day) => {
            const currentValue = view === 'sales' ? day.total_sales : day.total_count;
            const peakValue = view === 'sales' ? peak.total_sales : peak.total_count;
            return currentValue > peakValue ? day : peak;
        });
    }, [chartData, view]);

    const chartHeight = Math.max(360, chartData.length * 52 + 90);

    if (!chartData.length) {
        return (
            <div className="sales-report__empty">
                <span className="sales-report__empty-icon">↗</span>
                <strong>No chart data yet</strong>
                <p>Select a date range and generate the report to see daily performance.</p>
            </div>
        );
    }

    return (
        <>
            <div className="sales-chart__header">
                <div>
                    <p className="sales-report__eyebrow">Daily performance</p>
                    <h2>{view === 'sales' ? 'Total sales by day' : 'Transactions by day'}</h2>
                    <p>
                        {view === 'sales'
                            ? 'Compare daily revenue across the selected period.'
                            : 'See how many completed transactions were recorded each day.'}
                    </p>
                </div>

                <div className="sales-chart__toggle" aria-label="Chart metric">
                    <button
                        type="button"
                        className={view === 'sales' ? 'active' : ''}
                        onClick={() => setView('sales')}
                    >
                        Sales
                    </button>
                    <button
                        type="button"
                        className={view === 'transactions' ? 'active' : ''}
                        onClick={() => setView('transactions')}
                    >
                        Transactions
                    </button>
                </div>
            </div>

            {peakDay && (
                <div className="sales-chart__insight">
                    <span>Peak day</span>
                    <strong>
                        {new Date(`${peakDay.date}T00:00:00`).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </strong>
                    <b>
                        {view === 'sales'
                            ? numberFormat(peakDay.total_sales)
                            : `${peakDay.total_count.toLocaleString('en-US')} transactions`}
                    </b>
                </div>
            )}

            <div className="sales-chart__scroll">
                <Box sx={{ minWidth: 700, height: chartHeight }}>
                    <BarChart
                        dataset={chartData}
                        layout="horizontal"
                        height={chartHeight}
                        margin={{ left: 78, right: 30, top: 35, bottom: 45 }}
                        grid={{ vertical: true }}
                        barLabel={(item) =>
                            view === 'sales'
                                ? numberFormat(item.value)
                                : Number(item.value || 0).toLocaleString('en-US')
                        }
                        series={
                            view === 'sales'
                                ? [
                                    {
                                        dataKey: 'total_sales',
                                        label: 'Total Sales',
                                        color: '#4f46e5',
                                        valueFormatter: numberFormat,
                                    },
                                ]
                                : [
                                    {
                                        dataKey: 'total_count',
                                        label: 'Transactions',
                                        color: '#14b8a6',
                                        valueFormatter: (value) =>
                                            `${Number(value || 0).toLocaleString('en-US')} transactions`,
                                    },
                                ]
                        }
                        xAxis={[
                            {
                                min: 0,
                                valueFormatter:
                                    view === 'sales'
                                        ? compactCurrency
                                        : (value) => Number(value || 0).toLocaleString('en-US'),
                            },
                        ]}
                        yAxis={[
                            {
                                scaleType: 'band',
                                dataKey: 'displayDate',
                                width: 72,
                            },
                        ]}
                        sx={{
                            '& .MuiChartsGrid-line': {
                                stroke: '#e7e9f2',
                                strokeDasharray: '4 4',
                            },
                            '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': {
                                stroke: '#cfd3df',
                            },
                            '& .MuiChartsAxis-tickLabel': {
                                fill: '#596174',
                                fontSize: 12,
                            },
                            '& .MuiBarLabel-root': {
                                fill: '#ffffff',
                                fontSize: 12,
                                fontWeight: 750,
                            },
                        }}
                    />
                </Box>
            </div>
        </>
    );
};

export default ReportSalesChart;
