import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import { BarChart } from "@mui/x-charts/BarChart";
import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";
import ProductService from "./ProductService.service";
import "./ProductSoldHistory.css";

const toInputDate = date => {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const initialDates = () => {
    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 29);
    return { dateFrom: toInputDate(dateFrom), dateTo: toInputDate(dateTo) };
};

const groupOptions = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
];

const typeOptions = [
    { value: "", label: "All types" },
    { value: "0", label: "Online Orders" },
    { value: "1", label: "Shop Orders" },
];

const formatQuantity = value => Number(value || 0).toLocaleString("en-PH", { maximumFractionDigits: 2 });
const formatBarQuantity = value => Number(value || 0).toLocaleString("en-PH", {
    notation: Math.abs(Number(value || 0)) >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 2,
});
const formatDate = value => {
    if (!value) return "—";
    const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
};

const ProductSoldHistory = () => {
    const { productId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const defaults = useMemo(initialDates, []);
    const [filters, setFilters] = useState({
        dateFrom: searchParams.get("dateFrom") || defaults.dateFrom,
        dateTo: searchParams.get("dateTo") || defaults.dateTo,
        groupBy: searchParams.get("groupBy") || "day",
        type: searchParams.get("type") || "",
    });
    const [report, setReport] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadHistory = useCallback(requestFilters => {
        setLoading(true);
        setError("");
        const request = {
            dateFrom: requestFilters.dateFrom,
            dateTo: requestFilters.dateTo,
            groupBy: requestFilters.groupBy,
            ...(requestFilters.type !== "" ? { type: Number(requestFilters.type) } : {}),
        };
        return ShopOrderTransactionService.fetchProductSoldHistory(productId, request)
            .then(response => setReport(response.data))
            .catch(requestError => {
                setReport(null);
                const errors = requestError.response?.data?.errors;
                const validationMessage = errors && Object.values(errors).flat()[0];
                setError(validationMessage || requestError.response?.data?.message || "Unable to load this product's sold history.");
            })
            .finally(() => setLoading(false));
    }, [productId]);

    useEffect(() => {
        loadHistory(filters);
        ProductService.get(productId)
            .then(response => setProduct(response.data))
            .catch(() => setProduct(null));
        // Load the URL-selected/default range once when opening a product.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    const submit = event => {
        event.preventDefault();
        if (filters.dateFrom > filters.dateTo) {
            setError("Date from must be on or before date to.");
            return;
        }
        const urlFilters = { dateFrom: filters.dateFrom, dateTo: filters.dateTo, groupBy: filters.groupBy };
        if (filters.type !== "") urlFilters.type = filters.type;
        setSearchParams(urlFilters);
        loadHistory(filters);
    };

    const periods = Array.isArray(report?.data) ? report.data : [];
    const totalSold = Number(report?.total_sold_quantity ?? periods.reduce((sum, row) => sum + Number(row.sold_quantity || 0), 0));
    const activePeriods = periods.filter(row => Number(row.sold_quantity || 0) > 0).length;
    const periodsWithSales = periods.filter(row => Number(row.sold_quantity || 0) > 0);
    const highestPeriod = periodsWithSales.reduce((highest, row) => !highest || Number(row.sold_quantity) > Number(highest.sold_quantity) ? row : highest, null);
    const lowestPeriod = periodsWithSales.reduce((lowest, row) => !lowest || Number(row.sold_quantity) < Number(lowest.sold_quantity) ? row : lowest, null);
    const chartData = periods.map(row => ({ label: row.period, quantity: Number(row.sold_quantity || 0) }));
    const highestQuantity = highestPeriod ? Number(highestPeriod.sold_quantity) : 0;
    const chartColors = chartData.map(item => highestQuantity > 0 && item.quantity === highestQuantity ? "#218653" : "#bf5b18");
    const packaging = report?.packaging
        || report?.product_packaging
        || product?.packaging
        || report?.quantity_unit
        || "piece";

    return <main className="sold-history-page">
        <Link to="/productList" className="sold-history-back"><ArrowBackRoundedIcon /> Back to product list</Link>

        <header className="sold-history-header">
            <div>
                <span className="sold-history-eyebrow"><BarChartRoundedIcon /> Product sales</span>
                <h1>{report?.product_name || product?.product_name || `Product #${productId}`} sold history</h1>
                <p>Review sold stock over a custom date range and group it by day, week, month, or year.</p>
            </div>
            <span className="sold-history-product-id">Product #{report?.product_id || productId}</span>
        </header>

        <form className="sold-history-filter" onSubmit={submit}>
            <TextField label="Date from" type="date" size="small" value={filters.dateFrom} onChange={event => setFilters(current => ({ ...current, dateFrom: event.target.value }))} InputLabelProps={{ shrink: true }} required />
            <TextField label="Date to" type="date" size="small" value={filters.dateTo} onChange={event => setFilters(current => ({ ...current, dateTo: event.target.value }))} InputLabelProps={{ shrink: true }} required />
            <FormControl size="small">
                <InputLabel id="sold-history-group-label">Group by</InputLabel>
                <Select labelId="sold-history-group-label" label="Group by" value={filters.groupBy} onChange={event => setFilters(current => ({ ...current, groupBy: event.target.value }))}>
                    {groupOptions.map(option => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl size="small">
                <InputLabel id="sold-history-type-label">Transaction type</InputLabel>
                <Select labelId="sold-history-type-label" label="Transaction type" value={filters.type} onChange={event => setFilters(current => ({ ...current, type: event.target.value }))}>
                    {typeOptions.map(option => <MenuItem key={option.value || "all"} value={option.value}>{option.label}</MenuItem>)}
                </Select>
            </FormControl>
            <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <BarChartRoundedIcon />}>View history</Button>
        </form>

        {error && <Alert severity="error" className="sold-history-alert">{error}</Alert>}

        {report && <>
            <section className="sold-history-summary">
                <article><span><Inventory2OutlinedIcon /></span><div><small>Total sold</small><strong>{formatQuantity(totalSold)} {packaging}</strong></div></article>
                <article><span><CalendarMonthRoundedIcon /></span><div><small>Periods with sales</small><strong>{activePeriods} of {periods.length}</strong></div></article>
                <article className="sold-history-summary__highest"><span><TrendingUpRoundedIcon /></span><div><small>Highest sold period</small><strong>{highestPeriod ? `${formatQuantity(highestPeriod.sold_quantity)} ${packaging}` : "—"}</strong>{highestPeriod && <em>{highestPeriod.period}</em>}</div></article>
                <article className="sold-history-summary__lowest"><span><TrendingDownRoundedIcon /></span><div><small>Lowest sold period</small><strong>{lowestPeriod ? `${formatQuantity(lowestPeriod.sold_quantity)} ${packaging}` : "—"}</strong>{lowestPeriod && <em>{lowestPeriod.period}</em>}</div></article>
            </section>

            <section className="sold-history-card">
                <div className="sold-history-card__heading"><div><h2>Sold quantity trend</h2><p>{formatDate(report.date_from)} – {formatDate(report.date_to)} · Grouped by {report.group_by}</p></div></div>
                {chartData.length ? <Box className="sold-history-chart"><BarChart dataset={chartData} xAxis={[{ scaleType: "band", dataKey: "label", colorMap: { type: "ordinal", values: chartData.map(item => item.label), colors: chartColors } }]} yAxis={[{ min: 0, valueFormatter: formatQuantity }]} series={[{ dataKey: "quantity", label: `Sold quantity (${packaging})`, valueFormatter: value => `${formatQuantity(value)} ${packaging}` }]} barLabel={item => Number(item.value || 0) > 0 ? formatBarQuantity(item.value) : ""} grid={{ horizontal: true }} height={360} margin={{ left: 65, right: 25, top: 45, bottom: 55 }} sx={{ "& .MuiBarLabel-root": { fill: "#fff", fontSize: 12, fontWeight: 800, pointerEvents: "none" } }} /></Box> : <div className="sold-history-empty">No periods were returned for this date range.</div>}
            </section>

            <section className="sold-history-card">
                <div className="sold-history-card__heading"><div><h2>Period details</h2><p>{periods.length} grouped {periods.length === 1 ? "period" : "periods"}</p></div></div>
                <div className="table-responsive"><table className="sold-history-table"><thead><tr><th>Period</th><th>Start</th><th>End</th><th>Sold quantity</th><th>Order quantity</th></tr></thead><tbody>
                    {periods.map((row, index) => <tr key={`${row.period}-${index}`}><td><strong>{row.period}</strong></td><td>{formatDate(row.period_start)}</td><td>{formatDate(row.period_end)}</td><td className="sold-history-quantity">{formatQuantity(row.sold_quantity)} {packaging}</td><td>{formatQuantity(row.total_order_quantity)}</td></tr>)}
                    {!periods.length && <tr><td colSpan="5" className="sold-history-empty">No sold history found.</td></tr>}
                </tbody></table></div>
            </section>
        </>}
    </main>;
};

export default ProductSoldHistory;
