import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import { BarChart } from "@mui/x-charts/BarChart";
import CustomerService from "./CustomerService";
import "./CustomerForm.css";

const localDate = (date) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const initialFilters = () => {
  const now = new Date();
  return {
    dateFrom: localDate(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
    dateTo: localDate(now),
    groupBy: "month",
  };
};

const money = (value) => Number(value || 0).toLocaleString("en-PH", {
  style: "currency", currency: "PHP", minimumFractionDigits: 2,
});

const CustomerSalesHistory = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState(initialFilters);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showProfit, setShowProfit] = useState(false);

  const fetchHistory = (requestFilters = filters) => {
    if (requestFilters.dateFrom > requestFilters.dateTo) {
      setError("Date from must be on or before date to.");
      return;
    }
    setLoading(true);
    setError("");
    CustomerService.fetchCustomerSalesHistory(customerId, requestFilters)
      .then((response) => setHistory(response.data))
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load customer sales history."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const defaults = initialFilters();
    fetchHistory(defaults);
    // Load once for the customer in the route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const rows = (history?.data || []).map((item) => ({
    ...item,
    label: item.period || item.period_start,
    total_sales: Number(item.total_sales || 0),
    total_profit: Number(item.total_profit || 0),
    total_cash: Number(item.total_cash || 0),
    total_online: Number(item.total_online || 0),
  }));
  const highestSalesPeriod = rows.length
    ? rows.reduce((highest, item) => item.total_sales > highest.total_sales ? item : highest)
    : null;
  const lowestSalesPeriod = rows.length
    ? rows.reduce((lowest, item) => item.total_sales < lowest.total_sales ? item : lowest)
    : null;
  const highestSales = highestSalesPeriod?.total_sales || 0;
  const lowestSales = lowestSalesPeriod?.total_sales || 0;
  const salesColors = rows.map((item) => {
    if (item.total_sales === highestSales) return "#218c55";
    if (item.total_sales === lowestSales && lowestSales !== highestSales) return "#c75b12";
    return "#4054f4";
  });

  return (
    <div className="customer-page">
      <div className="customer-shell">
        <Button startIcon={<ArrowBackOutlinedIcon />} onClick={() => navigate(-1)} className="customer-sales-back">
          Back to customer search
        </Button>
        <header className="customer-header">
          <div>
            <span className="customer-eyebrow">Customer analytics</span>
            <h1>Sales History</h1>
            <p>{history ? `${history.customer_name}${history.store_name ? ` · ${history.store_name}` : ""}` : "Review customer sales, profit, and payment totals."}</p>
          </div>
          <div className="customer-header__icon"><QueryStatsOutlinedIcon /></div>
        </header>

        <section className="customer-search-card customer-sales-page-card">
          <div className="customer-sales-filters">
            <TextField label="Date from" type="date" size="small" value={filters.dateFrom} InputLabelProps={{ shrink: true }}
              onChange={(event) => setFilters({ ...filters, dateFrom: event.target.value })} />
            <TextField label="Date to" type="date" size="small" value={filters.dateTo} InputLabelProps={{ shrink: true }}
              onChange={(event) => setFilters({ ...filters, dateTo: event.target.value })} />
            <TextField select label="Group by" size="small" value={filters.groupBy}
              onChange={(event) => setFilters({ ...filters, groupBy: event.target.value })}>
              <MenuItem value="day">Day</MenuItem><MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem><MenuItem value="year">Year</MenuItem>
            </TextField>
            <Button variant="contained" color="success" disabled={loading} onClick={() => fetchHistory()}>Update graph</Button>
          </div>
          <FormControlLabel
            className="customer-sales-profit-toggle"
            control={<Checkbox checked={showProfit} onChange={(event) => setShowProfit(event.target.checked)} color="success" />}
            label="Show profit"
          />
          {loading && <LinearProgress color="success" className="customer-sales-progress" />}
          {error && <Alert severity="error" className="customer-sales-alert">{error}</Alert>}

          {history && !error && (
            <>
              <div className="customer-sales-totals">
                <div><span>Total sales</span><strong>{money(history.total_sales)}</strong></div>
                <div><span>Total profit</span><strong>{money(history.total_profit)}</strong></div>
                <div className="customer-sales-highlight customer-sales-highlight--highest">
                  <span>Highest sales period</span>
                  <strong>{highestSalesPeriod ? money(highestSalesPeriod.total_sales) : "-"}</strong>
                  <small>{highestSalesPeriod?.label || "No sales period"}</small>
                </div>
                <div className="customer-sales-highlight customer-sales-highlight--lowest">
                  <span>Lowest sales period</span>
                  <strong>{lowestSalesPeriod ? money(lowestSalesPeriod.total_sales) : "-"}</strong>
                  <small>{lowestSalesPeriod?.label || "No sales period"}</small>
                </div>
              </div>
              {rows.length ? <div className="customer-sales-chart"><Box sx={{ minWidth: 720, height: 470 }}>
                <BarChart dataset={rows} height={470} margin={{ left: 85, right: 25, top: 35, bottom: 55 }} grid={{ horizontal: true }}
                  barLabel={(item) => money(item.value)}
                  series={[
                    { dataKey: "total_sales", label: "Sales", color: "#2563eb", valueFormatter: money },
                    ...(showProfit ? [{ dataKey: "total_profit", label: "Profit", color: "#16a34a", valueFormatter: money }] : []),
                  ]}
                  xAxis={[{
                    scaleType: "band",
                    dataKey: "label",
                    label: `Grouped by ${history.group_by}`,
                    colorMap: { type: "ordinal", values: rows.map((item) => item.label), colors: salesColors },
                  }]}
                  yAxis={[{ width: 80, valueFormatter: (value) => new Intl.NumberFormat("en-PH", { notation: "compact", maximumFractionDigits: 1 }).format(value) }]}
                  sx={{
                    "& .MuiBarLabel-root": { fill: "#fff", fontSize: 12, fontWeight: 800 },
                    "& .MuiChartsGrid-line": { stroke: "#d9dee7" },
                  }} />
              </Box></div> : <div className="customer-empty">No sales were found for this date range.</div>}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default CustomerSalesHistory;
