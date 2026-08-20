import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import VipProductService from "./VipProductService";
import VipProductTransactionService from "./VipProductTransactionService";
import {
    formatSupplierSentTracking,
    isSentToSupplier,
} from "../Stock/supplierOrderTracking";

const formatDateParam = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getDefaultDateFilter = () => {
    const today = new Date();
    return {
        dateFrom: formatDateParam(new Date(today.getFullYear(), today.getMonth(), 1)),
        dateTo: formatDateParam(today),
    };
};

const formatDate = (date) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).format(new Date(date));
};

const formatDaysAgo = (date) => {
    if (!date) return "";
    const today = new Date();
    const soldDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    soldDate.setHours(0, 0, 0, 0);
    const days = Math.floor((today.getTime() - soldDate.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
};

const formatNumber = (value) => Number(value || 0).toLocaleString("en-US");
const formatMoney = (value) => Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const formatSold = (product) => {
    const totalSold = Number(product.total_sold || 0);
    const piecesPerPackage = Number(product.quantity || 0);

    if (!piecesPerPackage || totalSold < piecesPerPackage) {
        return `${formatNumber(totalSold)} Pc`;
    }

    const packageCount = Math.floor(totalSold / piecesPerPackage);
    return `${formatNumber(packageCount)} ${product.packaging || "Box"} / ${formatNumber(totalSold)} Pc`;
};

const normalizeArray = (value, separator = ",") => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    return String(value).split(separator).filter(Boolean);
};

const getSupplierOrderUnit = (product, orderType) => (
    orderType === "WHOLESALE"
        ? (product.packaging || "")
        : (product.variation || "")
);

const isOutOfStock = (product) => (
    Number(product.stock || 0) === 0 && Number(product.stock_pc || 0) === 0
);

const isStockWarning = (product) => {
    if (isOutOfStock(product)) return false;
    const currentStock = product.stock_warning_type === "RETAIL"
        ? Number(product.stock_pc || 0)
        : Number(product.stock || 0);
    return currentStock <= Number(product.stock_warning || 0);
};

const styles = {
    page: {
        padding: "18px 22px",
        backgroundColor: "#f7f9fb",
        minHeight: "100vh",
    },
    header: {
        textAlign: "center",
        marginBottom: "18px",
    },
    accent: {
        width: "46px",
        height: "5px",
        borderRadius: "999px",
        margin: "0 auto 8px",
    },
    details: {
        color: "#6c757d",
        marginBottom: 0,
    },
    filterBar: {
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "14px 16px",
        marginBottom: "16px",
    },
    filterRow: {
        display: "flex",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: "14px",
    },
    filterGroup: {
        minWidth: "210px",
        marginBottom: 0,
    },
    error: {
        color: "#dc3545",
        fontSize: "13px",
        margin: "4px 0 0",
    },
    summaryGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "12px",
        marginBottom: "16px",
    },
    summaryCard: {
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "14px 16px",
    },
    summaryLabel: {
        color: "#6c757d",
        fontSize: "12px",
        fontWeight: 700,
        marginBottom: "4px",
        textTransform: "uppercase",
    },
    summaryValue: {
        fontSize: "24px",
        fontWeight: 800,
        marginBottom: 0,
    },
    tableWrapper: {
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        overflowX: "auto",
        overflowY: "hidden",
        WebkitOverflowScrolling: "touch",
    },
    groupHeader: {
        backgroundColor: "#3f444a",
        color: "#fff",
        fontSize: "12px",
        padding: "8px 9px",
        textAlign: "center",
        verticalAlign: "middle",
        whiteSpace: "nowrap",
    },
    subHeader: {
        backgroundColor: "#e9ecef",
        color: "#212529",
        fontSize: "11px",
        padding: "7px 8px",
        textAlign: "center",
        verticalAlign: "middle",
        whiteSpace: "nowrap",
    },
    productName: {
        fontSize: "13px",
        fontWeight: 700,
    },
    muted: {
        color: "#6c757d",
        fontSize: "11px",
    },
    stack: {
        display: "flex",
        flexDirection: "column",
        gap: "3px",
    },
    pendingList: {
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        minWidth: "195px",
    },
    pendingCard: {
        display: "flex",
        alignItems: "center",
        gap: "7px",
        padding: "7px",
        border: "1px solid #d8e3f8",
        borderRadius: "9px",
        backgroundColor: "#f7faff",
        color: "#172033",
    },
    pendingIcon: {
        width: "30px",
        height: "30px",
        borderRadius: "6px",
        backgroundColor: "#e7f0ff",
        color: "#2563eb",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
    },
    pendingContent: {
        minWidth: 0,
        flex: 1,
    },
    pendingSupplier: {
        display: "block",
        fontSize: "12px",
        fontWeight: 700,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    pendingMeta: {
        color: "#6c757d",
        fontSize: "10px",
        whiteSpace: "nowrap",
    },
    pendingStatus: {
        display: "inline-flex",
        width: "fit-content",
        marginTop: "3px",
        padding: "2px 6px",
        borderRadius: "999px",
        fontSize: "9px",
        fontWeight: 800,
        letterSpacing: "0.04em",
    },
    pendingAge: {
        display: "block",
        marginTop: "3px",
        color: "#718096",
        fontSize: "10px",
        fontWeight: 600,
        lineHeight: 1,
    },
    pendingQuantity: {
        textAlign: "right",
        whiteSpace: "nowrap",
    },
    incomingLabel: {
        color: "#6c757d",
        fontSize: "10px",
        display: "block",
    },
    incomingValue: {
        color: "#0d6efd",
        fontWeight: 700,
        fontSize: "12px",
    },
    pendingTotal: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px 7px",
        borderRadius: "7px",
        backgroundColor: "#fff3cd",
        color: "#664d03",
        fontSize: "11px",
        fontWeight: 700,
    },
    noPending: {
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        color: "#8a94a6",
        fontSize: "11px",
        padding: "6px 2px",
    },
    daysBadge: {
        display: "inline-block",
        marginTop: "4px",
        padding: "3px 8px",
        borderRadius: "999px",
        backgroundColor: "#fff3cd",
        color: "#664d03",
        fontSize: "11px",
        fontWeight: 700,
        whiteSpace: "nowrap",
    },
    warning: {
        color: "#b45309",
        fontWeight: 700,
    },
    danger: {
        color: "#b42318",
        fontWeight: 700,
    },
    healthy: {
        color: "#146c43",
        fontWeight: 700,
    },
    empty: {
        padding: "24px",
        textAlign: "center",
        color: "#6c757d",
    },
};

const VipProductTransactionReport = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [template, setTemplate] = useState({});
    const [dateFilter, setDateFilter] = useState(getDefaultDateFilter());
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchReport = useCallback((dateFrom, dateTo) => {
        setLoading(true);
        setError("");
        return Promise.all([
            VipProductTransactionService.fetchVipProductLastOrder(id, dateFrom, dateTo),
            VipProductTransactionService.fetchVipTransactionByVipId(id),
        ])
            .then(([reportResponse, transactionResponse]) => {
                const transactionByProduct = new Map(
                    transactionResponse.data.map((transaction) => [
                        Number(transaction.product_id),
                        transaction.id,
                    ])
                );
                setProducts(reportResponse.data.map((product) => ({
                    ...product,
                    vip_product_transaction_id: product.vip_product_transaction_id
                        || transactionByProduct.get(Number(product.product_id)),
                })));
            })
            .catch(() => setError("Unable to fetch VIP Product transactions."))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        const initialFilter = getDefaultDateFilter();
        fetchReport(initialFilter.dateFrom, initialFilter.dateTo);
        VipProductService.get(id)
            .then((response) => setTemplate(response.data))
            .catch(() => setError("Unable to fetch VIP Product Template."));
    }, [fetchReport, id]);

    const summary = useMemo(() => {
        const pendingOrderIds = new Set();
        products.forEach((product) => {
            normalizeArray(product.pending_order_transaction_ids)
                .forEach((transactionId) => pendingOrderIds.add(String(transactionId)));
        });

        return {
            stockWarnings: products.filter(isStockWarning).length,
            outOfStock: products.filter(isOutOfStock).length,
            pendingTransactions: pendingOrderIds.size,
        };
    }, [products]);

    const submitFilter = (event) => {
        event.preventDefault();
        const validationErrors = {};
        if (!dateFilter.dateFrom) validationErrors.dateFrom = "Date From is required.";
        if (!dateFilter.dateTo) validationErrors.dateTo = "Date To is required.";
        if (dateFilter.dateFrom && dateFilter.dateTo && dateFilter.dateFrom > dateFilter.dateTo) {
            validationErrors.dateTo = "Date To must be after Date From.";
        }
        setErrors(validationErrors);
        if (!Object.keys(validationErrors).length) {
            fetchReport(dateFilter.dateFrom, dateFilter.dateTo);
        }
    };

    const renderPendingOrders = (product) => {
        const ids = normalizeArray(product.pending_order_transaction_ids);
        const statuses = normalizeArray(product.pending_order_status);
        const dates = normalizeArray(product.pending_order_dates);
        const sendDates = normalizeArray(product.pending_order_send_dates);
        const suppliers = normalizeArray(product.pending_order_suppliers, "||");
        const quantities = normalizeArray(product.pending_order_quantity);
        const orderTypes = normalizeArray(product.pending_order_types || product.pending_order_type);
        const incomingOrderCount = statuses.filter(status => String(status || "").toUpperCase() === "SEND_TO_SUPPLIER").length;
        const totalIncomingQuantity = quantities.reduce((total, quantity, index) =>
            String(statuses[index] || "").toUpperCase() === "SEND_TO_SUPPLIER"
                ? total + Number(quantity || 0)
                : total,
        0);

        if (!ids.length && !dates.length && !suppliers.length) {
            return (
                <span style={styles.noPending}>
                    <LocalShippingOutlinedIcon sx={{ fontSize: 17 }} />
                    No pending supplier order
                </span>
            );
        }

        return (
            <div style={styles.pendingList}>
                {incomingOrderCount > 1 &&
                    <div style={styles.pendingTotal}>
                        <span>Total Incoming</span>
                        <span>
                            {formatNumber(totalIncomingQuantity)}{" "}
                            {getSupplierOrderUnit(product, orderTypes[0] || product.last_order_type)}
                        </span>
                    </div>
                }
                {ids.map((transactionId, index) => {
                    const orderType = orderTypes[index] || product.last_order_type;
                    const status = String(statuses[index] || "PENDING").toUpperCase();
                    const isIncoming = status === "SEND_TO_SUPPLIER";
                    const sentTracking = isSentToSupplier(status)
                        ? formatSupplierSentTracking(sendDates[index])
                        : "";
                    const statusColors = {
                        PENDING: { color: "#8a4b08", backgroundColor: "#fff1d6" },
                        SEND_TO_SUPPLIER: { color: "#2457a6", backgroundColor: "#eaf1ff" },
                        SENT_TO_SUPPLIER: { color: "#2457a6", backgroundColor: "#eaf1ff" },
                        APPROVED: { color: "#2457a6", backgroundColor: "#eaf1ff" },
                        COMPLETED: { color: "#216e46", backgroundColor: "#e9f8ef" },
                        CANCELLED: { color: "#a63832", backgroundColor: "#ffedeb" },
                        CANCELED: { color: "#a63832", backgroundColor: "#ffedeb" },
                    };
                    return (
                        <Link
                            key={`${transactionId}-${index}`}
                            to={`/orderSupplierApproval/${transactionId}`}
                            style={{ textDecoration: "none" }}
                        >
                            <div style={styles.pendingCard}>
                                <span style={styles.pendingIcon}>
                                    <LocalShippingOutlinedIcon sx={{ fontSize: 19 }} />
                                </span>
                                <span style={styles.pendingContent}>
                                    <span style={styles.pendingSupplier}>
                                        {suppliers[index] || "Unknown Supplier"}
                                    </span>
                                    <span style={styles.pendingMeta}>
                                        PO #{transactionId} · {formatDate(dates[index])}
                                    </span>
                                    <span style={{ ...styles.pendingStatus, ...(statusColors[status] || {}) }}>
                                        {status.replaceAll("_", " ")}
                                    </span>
                                    {sentTracking && (
                                        <span style={styles.pendingAge}>
                                            {sentTracking}
                                        </span>
                                    )}
                                </span>
                                <span style={styles.pendingQuantity}>
                                    <span style={styles.incomingLabel}>{isIncoming ? "Incoming" : ""}</span>
                                    <span style={styles.incomingValue}>
                                        {formatNumber(quantities[index])}{" "}
                                        {getSupplierOrderUnit(product, orderType)}
                                    </span>
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        );
    };

    return (
        <div style={styles.page}>
            {loading && <LinearProgress color="warning" />}
            <div style={styles.header}>
                <div style={{ ...styles.accent, backgroundColor: template.vip_color || "#6c757d" }} />
                <h3>{template.vip_product_name || "VIP Product Transaction"}</h3>
                <p style={styles.details}>{template.details}</p>
            </div>

            {error && <Alert severity="error" style={{ marginBottom: "16px" }}>{error}</Alert>}

            <div style={styles.filterBar}>
                <Form onSubmit={submitFilter}>
                    <div style={styles.filterRow}>
                        <Form.Group style={styles.filterGroup}>
                            <Form.Label>Date From *</Form.Label>
                            <Form.Control
                                type="date"
                                value={dateFilter.dateFrom}
                                onChange={(event) => setDateFilter({ ...dateFilter, dateFrom: event.target.value })}
                            />
                            {errors.dateFrom && <p style={styles.error}>{errors.dateFrom}</p>}
                        </Form.Group>
                        <Form.Group style={styles.filterGroup}>
                            <Form.Label>Date To *</Form.Label>
                            <Form.Control
                                type="date"
                                value={dateFilter.dateTo}
                                onChange={(event) => setDateFilter({ ...dateFilter, dateTo: event.target.value })}
                            />
                            {errors.dateTo && <p style={styles.error}>{errors.dateTo}</p>}
                        </Form.Group>
                        <Button type="submit" disabled={loading}>Find</Button>
                    </div>
                </Form>
            </div>

            <div style={styles.summaryGrid}>
                {[
                    ["Stock Warning Products", summary.stockWarnings, "#b45309"],
                    ["Out of Stock Products", summary.outOfStock, "#b42318"],
                    ["Pending Supplier Transactions", summary.pendingTransactions, "#432874"],
                ].map(([label, value, color]) => (
                    <div key={label} style={styles.summaryCard}>
                        <p style={styles.summaryLabel}>{label}</p>
                        <p style={{ ...styles.summaryValue, color }}>{value}</p>
                    </div>
                ))}
            </div>

            <div className="table-responsive" style={styles.tableWrapper}>
                <table
                    className="table table-sm table-bordered table-hover align-middle mb-0"
                    style={{
                        fontSize: "13px",
                        lineHeight: 1.35,
                        tableLayout: "fixed",
                        minWidth: "1160px",
                        width: "1160px",
                    }}
                >
                    <thead>
                        <tr>
                            <th rowSpan="2" style={{ ...styles.groupHeader, width: "38px" }}>#</th>
                            <th rowSpan="2" style={{ ...styles.groupHeader, width: "210px" }}>Product Details</th>
                            <th style={{ ...styles.groupHeader, width: "180px" }}>Current Inventory</th>
                            <th colSpan="2" style={{ ...styles.groupHeader, width: "170px" }}>Sold to Customers</th>
                            <th colSpan="3" style={{ ...styles.groupHeader, width: "300px" }}>Last Supplier Order</th>
                            <th rowSpan="2" style={{ ...styles.groupHeader, width: "250px" }}>Pending Supplier Orders</th>
                            <th rowSpan="2" style={{ ...styles.groupHeader, width: "82px" }}>Actions</th>
                        </tr>
                        <tr>
                            <th style={styles.subHeader}>Current Stock</th>
                            <th style={styles.subHeader}>Total Sold</th>
                            <th style={styles.subHeader}>Last Sold</th>
                            <th style={styles.subHeader}>Supplier / Date</th>
                            <th style={styles.subHeader}>Quantity / Type</th>
                            <th style={styles.subHeader}>Order</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length ? products.map((product, index) => {
                            const outOfStock = isOutOfStock(product);
                            const stockWarning = isStockWarning(product);

                            return (
                                <tr key={product.product_id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div style={styles.productName}>{product.product_name}</div>
                                        <div style={styles.muted}>{product.category_name} · {product.brand_name}</div>
                                        <div style={styles.muted}>
                                            Price: ₱{formatMoney(product.price)} / {product.packaging || "package"}
                                        </div>
                                        <div style={styles.muted}>
                                            {formatNumber(product.quantity)} {product.variation || "Pc"} per pack
                                        </div>
                                        {Number(product.quantity || 0) > 1 &&
                                            <div style={styles.muted}>
                                                Per {product.variation || "Pc"}: ₱{formatMoney(
                                                    Number(product.price || 0) / Number(product.quantity)
                                                )} / {product.variation || "Pc"}
                                            </div>
                                        }
                                        {Number(product.sale_price || 0) > 0 &&
                                            <div style={styles.muted}>Sale: ₱{formatMoney(product.sale_price)}</div>
                                        }
                                    </td>
                                    <td>
                                        <strong>
                                            {formatNumber(product.stock)} {product.packaging || "Box"} / {formatNumber(product.stock_pc)} Pc
                                        </strong>
                                        <div style={outOfStock ? styles.danger : (stockWarning ? styles.warning : styles.healthy)}>
                                            {outOfStock ? "Out of Stock" : (stockWarning ? "Low Stock" : "Healthy")}
                                        </div>
                                        <div style={styles.muted}>
                                            Warning at {formatNumber(product.stock_warning)} {product.stock_warning_type}
                                        </div>
                                    </td>
                                    <td><strong>{formatSold(product)}</strong></td>
                                    <td>
                                        {product.last_customer_order_date &&
                                            <span style={styles.daysBadge}>
                                                {formatDaysAgo(product.last_customer_order_date)}
                                            </span>
                                        }
                                        {!product.last_customer_order_date && "-"}
                                    </td>
                                    <td>
                                        <div style={styles.stack}>
                                            <strong>{product.last_order_supplier || "No completed order"}</strong>
                                            <span style={styles.muted}>{formatDate(product.last_order_date)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <strong>{formatNumber(product.last_order_quantity)}</strong>
                                        <div style={styles.muted}>
                                            {getSupplierOrderUnit(product, product.last_order_type) || "-"}
                                        </div>
                                    </td>
                                    <td>
                                        {product.last_order_supplier_transaction_id
                                            ? <Link to={`/orderSupplierApproval/${product.last_order_supplier_transaction_id}`}>
                                                <Button variant="outline-primary" size="sm">
                                                    PO #{product.last_order_supplier_transaction_id}
                                                </Button>
                                            </Link>
                                            : <span style={styles.muted}>-</span>}
                                    </td>
                                    <td>{renderPendingOrders(product)}</td>
                                    <td>
                                        <div className="d-flex align-items-center justify-content-center gap-1">
                                            {product.vip_product_transaction_id
                                                ? <Link to={`/vipProductNote/${product.vip_product_transaction_id}`} title="Add or view note" aria-label="Add or view note">
                                                    <Button variant="info" size="sm" style={{ width: 32, height: 32, padding: 0 }}><EditNoteOutlinedIcon fontSize="small" /></Button>
                                                </Link>
                                                : <span style={styles.muted}>-</span>}
                                            <Link to={`/viewOutOfStockHistory/${product.id || product.product_id}`} title="View out-of-stock history" aria-label="View out-of-stock history">
                                                <Button variant="outline-danger" size="sm" style={{ width: 32, height: 32, padding: 0 }}><HistoryOutlinedIcon fontSize="small" /></Button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="10" style={styles.empty}>No VIP Product transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VipProductTransactionReport;
