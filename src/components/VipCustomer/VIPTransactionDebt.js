import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import VipCustomerService from "./VipCustomerService";
import VipCustomerTransactionService from "./VipCustomerTransactionService";

const styles = {
    page: { padding: "18px 22px", backgroundColor: "#f7f9fb", minHeight: "100vh" },
    header: { textAlign: "center", marginBottom: "18px" },
    title: { fontWeight: "700", marginBottom: "4px" },
    titleAccent: { width: "42px", height: "5px", borderRadius: "999px", margin: "0 auto 8px" },
    subtitle: { color: "#6c757d", marginBottom: "0" },
    filterBar: {
        backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px",
        padding: "14px 16px", marginBottom: "18px",
    },
    filterRow: { display: "flex", alignItems: "flex-end", gap: "14px", flexWrap: "wrap" },
    filterGroup: { minWidth: "210px", marginBottom: "0" },
    errorText: { color: "#dc3545", margin: "4px 0 0", fontSize: "13px" },
    summaryGrid: {
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
        gap: "12px", marginBottom: "18px",
    },
    summaryCard: {
        backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px",
    },
    balanceCard: {
        backgroundColor: "#fff3cd", border: "1px solid #ffecb5", borderRadius: "8px",
        padding: "16px", color: "#664d03",
    },
    summaryLabel: { color: "#6c757d", fontSize: "13px", marginBottom: "5px" },
    summaryValue: { fontSize: "22px", fontWeight: "700", marginBottom: "0" },
    customerCard: {
        backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px",
        marginBottom: "16px", overflow: "hidden",
    },
    customerHeader: {
        padding: "16px", borderBottom: "1px solid #e5e7eb", display: "flex",
        justifyContent: "space-between", gap: "14px", flexWrap: "wrap",
    },
    customerName: { fontWeight: "700", marginBottom: "3px" },
    customerMeta: { color: "#6c757d", fontSize: "13px", marginBottom: "0" },
    customerTotals: { display: "flex", gap: "18px", flexWrap: "wrap" },
    totalItem: { minWidth: "110px" },
    totalLabel: { color: "#6c757d", fontSize: "12px", marginBottom: "2px" },
    totalValue: { fontWeight: "700", marginBottom: "0" },
    pendingValue: { fontWeight: "700", color: "#b45309", marginBottom: "0" },
    table: { marginBottom: "0" },
    tableHeader: { backgroundColor: "#212529", color: "#ffffff" },
    tableHeaderCell: { color: "#ffffff" },
    paymentList: { minWidth: "250px", display: "flex", flexDirection: "column", gap: "6px" },
    paymentItem: {
        border: "1px solid #d1e7dd", backgroundColor: "#f0fff4", borderRadius: "6px",
        padding: "7px 9px", fontSize: "12px",
    },
    initialBadge: {
        display: "inline-block", borderRadius: "999px", padding: "3px 8px",
        backgroundColor: "#cfe2ff", color: "#084298", fontSize: "11px",
        fontWeight: "600", marginBottom: "5px",
    },
    notStartedBadge: {
        display: "inline-block", borderRadius: "999px", padding: "4px 9px",
        backgroundColor: "#f8d7da", color: "#842029", fontSize: "12px", fontWeight: "600",
    },
    emptyState: {
        textAlign: "center", color: "#6c757d", backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb", borderRadius: "8px", padding: "32px 18px",
    },
};

const formatAmount = (value) => Number(value || 0).toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const formatDate = (value, includeTime = false) => {
    if (!value) {
        return "—";
    }

    const date = new Date(String(value).replace(" ", "T"));
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-PH", includeTime
        ? { year: "numeric", month: "short", day: "2-digit", hour: "numeric", minute: "2-digit" }
        : { year: "numeric", month: "short", day: "2-digit" }
    ).format(date);
};

const VIPTransactionDebt = () => {
    const { id } = useParams();
    const [debtCustomers, setDebtCustomers] = useState([]);
    const [vipCustomerTemplate, setVipCustomerTemplate] = useState({
        vip_name: "", details: "", vip_color: "",
    });
    const [dateFilter, setDateFilter] = useState({ dateFrom: "", dateTo: "" });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchPendingBalances = useCallback((dateFrom = "", dateTo = "") => {
        setLoading(true);
        setErrorMessage("");

        return VipCustomerTransactionService.fetchVipCustomerDebt(id, dateFrom, dateTo)
            .then(response => {
                setDebtCustomers(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                setDebtCustomers([]);
                setErrorMessage("Unable to load pending balances. Please try again.");
                console.log("error", error);
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        fetchPendingBalances();
        VipCustomerService.get(id)
            .then(response => setVipCustomerTemplate(response.data))
            .catch(error => console.log("error", error));
    }, [fetchPendingBalances, id]);

    const totals = useMemo(() => debtCustomers.reduce((result, customer) => {
        result.orders += Number(customer.debt_order_count || 0);
        result.total += Number(customer.debt_order_total_price || 0);
        result.paid += Number(customer.total_payment || 0);
        result.balance += Number(customer.balance || 0);
        return result;
    }, { orders: 0, total: 0, paid: 0, balance: 0 }), [debtCustomers]);

    const onChangeInput = (event) => {
        const { name, value } = event.target;
        setDateFilter(current => ({ ...current, [name]: value }));
    };

    const validate = () => {
        const errors = {};
        if (dateFilter.dateFrom && dateFilter.dateTo && dateFilter.dateFrom > dateFilter.dateTo) {
            errors.dateTo = "Date To must be after Date From.";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submitFilter = (event) => {
        event.preventDefault();
        if (validate()) {
            fetchPendingBalances(dateFilter.dateFrom, dateFilter.dateTo);
        }
    };

    const clearFilter = () => {
        setDateFilter({ dateFrom: "", dateTo: "" });
        setFormErrors({});
        fetchPendingBalances();
    };

    const renderPaymentHistory = (order) => {
        const payments = Array.isArray(order.payments) && order.payments.length > 0
            ? order.payments
            : (order.initial_payment ? [{
                ...order.initial_payment,
                created_at: order.initial_payment.date,
            }] : []);
        if (payments.length === 0) {
            return <span style={styles.notStartedBadge}>No payment yet</span>;
        }

        return (
            <div style={styles.paymentList}>
                {payments.map((payment, index) => {
                    const isInitialPayment = order.initial_payment && order.initial_payment.id
                        ? String(payment.id) === String(order.initial_payment.id)
                        : index === 0;

                    return (
                        <div key={payment.id || index} style={styles.paymentItem}>
                            {isInitialPayment && <div style={styles.initialBadge}>Initial payment</div>}
                            <div>
                                <strong>{formatAmount(payment.amount)}</strong> via {payment.payment_type || "Unspecified"}
                            </div>
                            {payment.payment_type_description &&
                                <div>{payment.payment_type_description}</div>
                            }
                            <div>{formatDate(payment.created_at, true)}</div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div style={styles.page}>
            {loading && <LinearProgress color="warning" />}

            <div style={styles.header}>
                {vipCustomerTemplate.vip_color &&
                    <div style={{ ...styles.titleAccent, backgroundColor: vipCustomerTemplate.vip_color }} />
                }
                <h3 style={styles.title}>
                    {vipCustomerTemplate.vip_name
                        ? `${vipCustomerTemplate.vip_name} Pending Balances`
                        : "VIP Pending Balances"}
                </h3>
                <p style={styles.subtitle}>Outstanding transactions, amounts paid, and remaining balances</p>
            </div>

            <div style={styles.filterBar}>
                <Form onSubmit={submitFilter}>
                    <div style={styles.filterRow}>
                        <Form.Group style={styles.filterGroup} controlId="debtDateFrom">
                            <Form.Label>Date From:</Form.Label>
                            <Form.Control
                                type="date" name="dateFrom" value={dateFilter.dateFrom} onChange={onChangeInput}
                            />
                        </Form.Group>
                        <Form.Group style={styles.filterGroup} controlId="debtDateTo">
                            <Form.Label>Date To:</Form.Label>
                            <Form.Control
                                type="date" name="dateTo" value={dateFilter.dateTo} onChange={onChangeInput}
                            />
                            {formErrors.dateTo && <p style={styles.errorText}>{formErrors.dateTo}</p>}
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading}>Find</Button>
                        <Button variant="outline-secondary" type="button" onClick={clearFilter} disabled={loading}>
                            Show All
                        </Button>
                    </div>
                </Form>
            </div>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <div style={styles.summaryGrid}>
                <div style={styles.summaryCard}>
                    <p style={styles.summaryLabel}>Customers with pending balances</p>
                    <p style={styles.summaryValue}>{debtCustomers.length}</p>
                </div>
                <div style={styles.summaryCard}>
                    <p style={styles.summaryLabel}>Pending transactions</p>
                    <p style={styles.summaryValue}>{totals.orders}</p>
                </div>
                <div style={styles.summaryCard}>
                    <p style={styles.summaryLabel}>Transaction total</p>
                    <p style={styles.summaryValue}>{formatAmount(totals.total)}</p>
                </div>
                <div style={styles.summaryCard}>
                    <p style={styles.summaryLabel}>Amount paid</p>
                    <p style={{ ...styles.summaryValue, color: "#146c43" }}>{formatAmount(totals.paid)}</p>
                </div>
                <div style={styles.balanceCard}>
                    <p style={styles.summaryLabel}>Total pending balance</p>
                    <p style={styles.summaryValue}>{formatAmount(totals.balance)}</p>
                </div>
            </div>

            {!loading && !errorMessage && debtCustomers.length === 0 &&
                <div style={styles.emptyState}>
                    <h5>No pending balances</h5>
                    <p className="mb-0">All VIP transactions in this date range are fully paid.</p>
                </div>
            }

            {debtCustomers.map((customer, customerIndex) => (
                <section
                    key={customer.vip_customer_transaction_id || customer.customer_id || customerIndex}
                    style={styles.customerCard}
                >
                    <div style={styles.customerHeader}>
                        <div>
                            <h5 style={styles.customerName}>{customer.customer_name || "Unnamed customer"}</h5>
                            <p style={styles.customerMeta}>
                                {customer.store_name || "No store name"}
                                {customer.contact_number ? ` • ${customer.contact_number}` : ""}
                                {customer.email ? ` • ${customer.email}` : ""}
                            </p>
                        </div>
                        <div style={styles.customerTotals}>
                            <div style={styles.totalItem}>
                                <p style={styles.totalLabel}>Orders</p>
                                <p style={styles.totalValue}>{customer.debt_order_count || 0}</p>
                            </div>
                            <div style={styles.totalItem}>
                                <p style={styles.totalLabel}>Total</p>
                                <p style={styles.totalValue}>{formatAmount(customer.debt_order_total_price)}</p>
                            </div>
                            <div style={styles.totalItem}>
                                <p style={styles.totalLabel}>Paid</p>
                                <p style={{ ...styles.totalValue, color: "#146c43" }}>
                                    {formatAmount(customer.total_payment)}
                                </p>
                            </div>
                            <div style={styles.totalItem}>
                                <p style={styles.totalLabel}>Pending</p>
                                <p style={styles.pendingValue}>{formatAmount(customer.balance)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered table-hover align-middle" style={styles.table}>
                            <thead style={styles.tableHeader}>
                                <tr>
                                    <th style={styles.tableHeaderCell}>#</th>
                                    <th style={styles.tableHeaderCell}>Transaction ID</th>
                                    <th style={styles.tableHeaderCell}>Order Date</th>
                                    <th style={styles.tableHeaderCell}>Total</th>
                                    <th style={styles.tableHeaderCell}>Paid</th>
                                    <th style={styles.tableHeaderCell}>Pending Balance</th>
                                    <th style={styles.tableHeaderCell}>Payment History</th>
                                    <th style={styles.tableHeaderCell}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(Array.isArray(customer.debt_orders) ? customer.debt_orders : [])
                                    .map((order, orderIndex) => (
                                        <tr key={order.shop_order_transaction_id || orderIndex}>
                                            <td>{orderIndex + 1}</td>
                                            <td>{order.shop_order_transaction_id}</td>
                                            <td>{formatDate(order.order_date)}</td>
                                            <td>{formatAmount(order.order_total_price)}</td>
                                            <td style={{ color: "#146c43", fontWeight: "600" }}>
                                                {formatAmount(order.total_payment)}
                                            </td>
                                            <td style={{ color: "#b45309", fontWeight: "700" }}>
                                                {formatAmount(order.balance)}
                                            </td>
                                            <td>{renderPaymentHistory(order)}</td>
                                            <td>
                                                <Link
                                                    to={`/shopOrderTransaction/finalizeShopOrder/${order.shop_order_transaction_id}`}
                                                >
                                                    <Button variant="primary" size="sm">
                                                        View Transaction
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            ))}
        </div>
    );
};

export default VIPTransactionDebt;
