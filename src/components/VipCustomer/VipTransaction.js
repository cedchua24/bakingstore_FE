import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Form } from 'react-bootstrap';
import LinearProgress from '@mui/material/LinearProgress';
import VipCustomerTransactionService from "./VipCustomerTransactionService";
import VipCustomerService from "./VipCustomerService";

const formatDateParam = (date) => {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

const getDefaultDateFilter = () => {
    var today = new Date();
    var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
        dateFrom: formatDateParam(firstDayOfMonth),
        dateTo: formatDateParam(today),
    };
}

const styles = {
    page: {
        padding: '18px 22px',
        backgroundColor: '#f7f9fb',
        minHeight: '100vh',
    },
    header: {
        textAlign: 'center',
        marginBottom: '18px',
    },
    title: {
        fontWeight: '700',
        marginBottom: '4px',
    },
    titleAccent: {
        width: '42px',
        height: '5px',
        borderRadius: '999px',
        margin: '0 auto 8px',
    },
    details: {
        color: '#6c757d',
        marginBottom: '0',
    },
    filterBar: {
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '14px 16px',
        marginBottom: '18px',
    },
    filterRow: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '14px',
        flexWrap: 'wrap',
    },
    filterGroup: {
        minWidth: '210px',
        marginBottom: '0',
    },
    errorText: {
        color: 'red',
        margin: '4px 0 0',
        fontSize: '13px',
    },
    tableWrapper: {
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    table: {
        marginBottom: '0',
    },
    groupHeader: {
        textAlign: 'center',
        verticalAlign: 'middle',
        backgroundColor: '#3f444a',
        color: '#ffffff',
    },
    subHeader: {
        backgroundColor: '#555b62',
        color: '#ffffff',
    },
    daysBadge: {
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: '999px',
        backgroundColor: '#fff3cd',
        color: '#664d03',
        fontWeight: '600',
        fontSize: '12px',
    },
    dateStack: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    datePill: {
        display: 'inline-block',
        padding: '3px 8px',
        borderRadius: '6px',
        backgroundColor: '#f1f3f5',
        color: '#343a40',
        fontSize: '12px',
        whiteSpace: 'nowrap',
    },
    customerName: {
        fontWeight: '700',
        marginBottom: '2px',
    },
    storeName: {
        color: '#6c757d',
        fontSize: '12px',
    },
    draftTotalCell: {
        backgroundColor: '#fff8e1',
        fontWeight: '700',
    },
    paymentSummary: {
        minWidth: '105px',
        fontSize: '12px',
        lineHeight: '1.45',
    },
    paymentSummaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
        whiteSpace: 'nowrap',
    },
    paymentLabel: {
        color: '#6c757d',
    },
    paidValue: {
        color: '#146c43',
        fontWeight: '600',
    },
    balanceValue: {
        color: '#b45309',
        fontWeight: '600',
    },
    emptyState: {
        textAlign: 'center',
        color: '#6c757d',
        padding: '22px',
    },
    possibleSalesRow: {
        backgroundColor: '#fff3cd',
        color: '#664d03',
    },
    grandTotalRow: {
        backgroundColor: '#d1e7dd',
        color: '#0f5132',
    },
    paymentsTotalRow: {
        backgroundColor: '#cfe2ff',
        color: '#084298',
    },
    footerLabel: {
        textAlign: 'right',
        fontWeight: '700',
    },
    footerValue: {
        fontWeight: '700',
    },
    analysisPanel: {
        marginTop: '16px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
    },
    analysisTitle: {
        fontWeight: '700',
        marginBottom: '10px',
    },
    analysisGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '10px',
    },
    analysisSecondaryGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '10px',
        marginTop: '10px',
    },
    analysisItem: {
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: '#f8f9fa',
    },
    openTransactionItem: {
        border: '1px solid #ffecb5',
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: '#fff3cd',
        color: '#664d03',
    },
    completedTransactionItem: {
        border: '1px solid #a3cfbb',
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: '#d1e7dd',
        color: '#0f5132',
    },
    collectedPaymentsHero: {
        border: '2px solid #0d6efd',
        borderRadius: '10px',
        padding: '18px 20px',
        marginBottom: '12px',
        backgroundColor: '#e7f1ff',
        color: '#084298',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        boxShadow: '0 3px 10px rgba(13, 110, 253, 0.12)',
    },
    keyMetricBadge: {
        display: 'inline-block',
        padding: '3px 9px',
        borderRadius: '999px',
        backgroundColor: '#0d6efd',
        color: '#ffffff',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '0.04em',
        marginBottom: '7px',
    },
    collectedPaymentsValue: {
        color: '#084298',
        fontSize: '30px',
        fontWeight: '800',
        marginBottom: '0',
    },
    estimatedBalanceItem: {
        border: '1px solid #feb272',
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: '#ffe5d0',
        color: '#984c0c',
    },
    analysisLabel: {
        color: '#6c757d',
        fontSize: '13px',
        marginBottom: '4px',
    },
    analysisHelp: {
        color: '#6c757d',
        fontSize: '12px',
        marginTop: '5px',
        marginBottom: '0',
    },
    analysisValue: {
        fontWeight: '700',
        fontSize: '18px',
        marginBottom: '0',
    },
    projectedSalesItem: {
        border: '1px solid #c5b3e6',
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: '#e2d9f3',
        color: '#432874',
    },
    noteButton: {
        whiteSpace: 'nowrap',
    },
    actionButton: {
        whiteSpace: 'nowrap',
    },
}

const VipTransaction = () => {

    const { id } = useParams();

    const [vipTransactionList, setVipTransactionList] = useState([]);
    const [submitLoadingFetch, setSubmitLoadingFetch] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [dateFilter, setDateFilter] = useState(getDefaultDateFilter());
    const [vipCustomerTemplate, setVipCustomerTemplate] = useState({
        vip_name: '',
        details: '',
        vip_color: '',
    });

    const fetchVipCustomerLastOrder = useCallback((dateFrom, dateTo) => {
        setSubmitLoadingFetch(true);
        return VipCustomerTransactionService.fetchVipCustomerLastOrder(id, dateFrom, dateTo)
            .then(response => {
                setVipTransactionList(response.data);
                setSubmitLoadingFetch(false);
            })
            .catch(e => {
                setSubmitLoadingFetch(false);
                console.log("error", e)
            });
    }, [id]);

    const fetchVipCustomerTemplate = useCallback(() => {
        VipCustomerService.get(id)
            .then(response => {
                setVipCustomerTemplate(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }, [id]);

    useEffect(() => {
        var defaultDateFilter = getDefaultDateFilter();
        fetchVipCustomerLastOrder(defaultDateFilter.dateFrom, defaultDateFilter.dateTo);
        fetchVipCustomerTemplate();
    }, [fetchVipCustomerLastOrder, fetchVipCustomerTemplate]);

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setDateFilter({ ...dateFilter, [name]: value });
    }

    const validate = () => {
        const errors = {};
        if (!dateFilter.dateFrom) {
            errors.dateFrom = "Date From is Required!";
        }
        if (!dateFilter.dateTo) {
            errors.dateTo = "Date To is Required!";
        }
        if (dateFilter.dateFrom && dateFilter.dateTo && dateFilter.dateFrom > dateFilter.dateTo) {
            errors.dateTo = "Date To must be after Date From!";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const submitVipCustomerLastOrder = (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        setIsAddDisabled(true);
        fetchVipCustomerLastOrder(dateFilter.dateFrom, dateFilter.dateTo)
            .finally(() => {
                setIsAddDisabled(false);
            });
    }

    const formatStatementDate = (date) => {
        if (!date) {
            return '';
        }
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }

    const formatDaysAgo = (date) => {
        if (!date) {
            return '';
        }
        var today = new Date();
        var orderDate = new Date(date);
        today.setHours(0, 0, 0, 0);
        orderDate.setHours(0, 0, 0, 0);
        var diffTime = today.getTime() - orderDate.getTime();
        var diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
            return 'Today';
        }
        if (diffDays === 1) {
            return '1 day ago';
        }
        return diffDays + ' days ago';
    }

    const renderDaysAgo = (date) => {
        var daysAgo = formatDaysAgo(date);
        if (!daysAgo) {
            return '';
        }
        return <span style={styles.daysBadge}>{daysAgo}</span>;
    }

    const parseJsonArray = (value) => {
        if (!value) {
            return [];
        }
        if (Array.isArray(value)) {
            return value;
        }
        try {
            var parsedValue = JSON.parse(value);
            return Array.isArray(parsedValue) ? parsedValue : [];
        } catch (e) {
            return [];
        }
    }

    const renderDraftOrderDates = (vipTransaction) => {
        var draftOrderDates = parseJsonArray(vipTransaction.draft_order_dates);
        if (draftOrderDates.length === 0 && vipTransaction.draft_order_date) {
            draftOrderDates = [vipTransaction.draft_order_date];
        }
        if (draftOrderDates.length === 0) {
            return '';
        }

        return (
            <div style={styles.dateStack}>
                {draftOrderDates.map((draftOrderDate, index) => (
                    <span key={index} style={styles.datePill}>{formatStatementDate(draftOrderDate)}</span>
                ))}
            </div>
        );
    }

    const formatTotalOrderPrice = (price) => {
        if (price === null || price === undefined || price === '') {
            return '';
        }
        return Number(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    const formatNonZeroPrice = (price) => {
        if (Number(price || 0) === 0) {
            return '';
        }
        return formatTotalOrderPrice(price);
    }

    const getGrandTotal = () => {
        return vipTransactionList.reduce((total, vipTransaction) => {
            var totalOrderPrice = Number(vipTransaction.total_order_price || 0);
            return total + totalOrderPrice;
        }, 0);
    }

    const getTotalCompletedPayment = () => {
        return vipTransactionList.reduce((total, vipTransaction) => {
            var totalCompletedPayment = Number(vipTransaction.total_completed_payment || 0);
            return total + totalCompletedPayment;
        }, 0);
    }

    const getOpenTransactionPayment = (vipTransaction) => {
        var completedSales = Number(vipTransaction.total_order_price || 0);
        var allPayments = Number(vipTransaction.total_completed_payment || 0);
        return Math.max(allPayments - completedSales, 0);
    }

    const getTotalOpenTransactionPayments = () => {
        return vipTransactionList.reduce((total, vipTransaction) => {
            return total + getOpenTransactionPayment(vipTransaction);
        }, 0);
    }

    const getOpenTransactionBalance = (vipTransaction) => {
        var openTransactionValue = Number(vipTransaction.draft_order_total_price || 0);
        return Math.max(openTransactionValue - getOpenTransactionPayment(vipTransaction), 0);
    }

    const getEstimatedOpenBalance = () => {
        return Math.max(getPossibleSales() - getTotalOpenTransactionPayments(), 0);
    }

    const renderPaymentSummary = (paidAmount, balance) => {
        if (Number(paidAmount || 0) === 0 && Number(balance || 0) === 0) {
            return '';
        }

        return (
            <div style={styles.paymentSummary}>
                <div style={styles.paymentSummaryRow}>
                    <span style={styles.paymentLabel}>Paid</span>
                    <span style={styles.paidValue}>{formatTotalOrderPrice(paidAmount)}</span>
                </div>
                <div style={styles.paymentSummaryRow}>
                    <span style={styles.paymentLabel}>Balance</span>
                    <span style={styles.balanceValue}>{formatTotalOrderPrice(balance)}</span>
                </div>
            </div>
        );
    }

    const getPossibleSales = () => {
        return vipTransactionList.reduce((total, vipTransaction) => {
            var draftOrderTotalPrice = Number(vipTransaction.draft_order_total_price || 0);
            return total + draftOrderTotalPrice;
        }, 0);
    }

    const getProjectedSales = () => {
        return getPossibleSales() + getGrandTotal();
    }

    const buildCustomerTransactionLink = (customerId) => {
        var params = new URLSearchParams({
            dateFrom: dateFilter.dateFrom,
            dateTo: dateFilter.dateTo,
        });
        return "/customers/customerTransactionList/" + customerId + "?" + params.toString();
    }

    const buildCustomerProductLink = (customerId) => {
        var params = new URLSearchParams({
            dateFrom: dateFilter.dateFrom,
            dateTo: dateFilter.dateTo,
        });
        return "/customers/customerProductList/" + customerId + "?" + params.toString();
    }

    return (
        <div style={styles.page}>

            {submitLoadingFetch &&
                <LinearProgress color="warning" />
            }

            <div style={styles.header}>
                {vipCustomerTemplate.vip_color &&
                    <div style={{ ...styles.titleAccent, backgroundColor: vipCustomerTemplate.vip_color }}></div>
                }
                <h3 style={styles.title}>{vipCustomerTemplate.vip_name}</h3>
                {vipCustomerTemplate.details &&
                    <p style={styles.details}>{vipCustomerTemplate.details}</p>
                }
            </div>

            <div style={styles.filterBar}>
                <Form onSubmit={submitVipCustomerLastOrder}>
                    <div style={styles.filterRow}>
                        <Form.Group style={styles.filterGroup} controlId="formDateFrom">
                            <Form.Label>Date From*:</Form.Label>
                            <Form.Control type="date" name="dateFrom" value={dateFilter.dateFrom} onChange={onChangeInput} />
                            {formErrors.dateFrom && <p style={styles.errorText}>{formErrors.dateFrom}</p>}
                        </Form.Group>
                        <Form.Group style={styles.filterGroup} controlId="formDateTo">
                            <Form.Label>Date To*:</Form.Label>
                            <Form.Control type="date" name="dateTo" value={dateFilter.dateTo} onChange={onChangeInput} />
                            {formErrors.dateTo && <p style={styles.errorText}>{formErrors.dateTo}</p>}
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={isAddDisabled}>
                            Find
                        </Button>
                    </div>
                </Form>
            </div>

            <div className="table-responsive" style={styles.tableWrapper}>
                <table className="table table-bordered table-hover align-middle" style={styles.table}>
                    <thead>
                        <tr>
                            <th rowSpan="2" style={styles.groupHeader}>#</th>
                            <th rowSpan="2" style={styles.groupHeader}>Customer / Store</th>
                            <th colSpan="3" style={styles.groupHeader}>Draft Order</th>
                            <th colSpan="2" style={styles.groupHeader}>Last Order</th>
                            <th rowSpan="2" style={styles.groupHeader}>Completed Transaction</th>
                            <th rowSpan="2" style={styles.groupHeader}>All Payments Collected</th>
                            <th rowSpan="2" style={styles.groupHeader}>Note</th>
                            <th rowSpan="2" style={styles.groupHeader}>Transaction</th>
                            <th rowSpan="2" style={styles.groupHeader}>Products</th>
                        </tr>
                        <tr>
                            <th style={styles.subHeader}>Dates</th>
                            <th style={styles.subHeader}>Total Amount</th>
                            <th style={styles.subHeader}>Payment Status</th>
                            <th style={styles.subHeader}>Date</th>
                            <th style={styles.subHeader}>Days Ago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            vipTransactionList.length > 0 ? vipTransactionList.map((vipTransaction, index) => (
                                <tr key={vipTransaction.vip_customer_transaction_id} >
                                    <td>{index + 1}</td>
                                    <td>
                                        <div style={styles.customerName}>{vipTransaction.customer_name}</div>
                                        <div style={styles.storeName}>{vipTransaction.store_name || 'No store name'}</div>
                                    </td>
                                    <td>{renderDraftOrderDates(vipTransaction)}</td>
                                    <td style={styles.draftTotalCell}>
                                        {formatNonZeroPrice(vipTransaction.draft_order_total_price)}
                                    </td>
                                    <td>
                                        {renderPaymentSummary(
                                            getOpenTransactionPayment(vipTransaction),
                                            getOpenTransactionBalance(vipTransaction)
                                        )}
                                    </td>
                                    <td>{formatStatementDate(vipTransaction.last_order_date)}</td>
                                    <td>{renderDaysAgo(vipTransaction.last_order_date)}</td>
                                    <td>{formatNonZeroPrice(vipTransaction.total_order_price)}</td>
                                    <td>{formatNonZeroPrice(vipTransaction.total_completed_payment)}</td>
                                    <td>
                                        <Link to={"/vipNote/" + vipTransaction.vip_customer_transaction_id}>
                                            <Button variant="info" size="sm" style={styles.noteButton}>
                                                Add Note
                                            </Button>
                                        </Link>
                                    </td>
                                    <td>
                                        {vipTransaction.customer_id &&
                                            <Link variant="primary" to={buildCustomerTransactionLink(vipTransaction.customer_id)}>
                                                <Button variant="primary" size="sm" style={styles.actionButton}>
                                                    View Transaction
                                                </Button>
                                            </Link>
                                        }
                                    </td>
                                    <td>
                                        {vipTransaction.customer_id &&
                                            <Link variant="primary" to={buildCustomerProductLink(vipTransaction.customer_id)}>
                                                <Button variant="primary" size="sm" style={styles.actionButton}>
                                                    View Products
                                                </Button>
                                            </Link>
                                        }
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="12" style={styles.emptyState}>No VIP customer transactions found.</td>
                                </tr>
                            )
                        }
                    </tbody>
                    <tfoot>
                        <tr style={styles.possibleSalesRow}>
                            <td colSpan="3" style={styles.footerLabel}>Open Transaction Value</td>
                            <td style={{ ...styles.footerValue, ...styles.draftTotalCell }}>
                                {formatTotalOrderPrice(getPossibleSales())}
                            </td>
                            <td style={styles.footerValue}>
                                {renderPaymentSummary(
                                    getTotalOpenTransactionPayments(),
                                    getEstimatedOpenBalance()
                                )}
                            </td>
                            <td colSpan="7"></td>
                        </tr>
                        <tr style={styles.grandTotalRow}>
                            <td colSpan="7" style={styles.footerLabel}>Completed Transaction Value</td>
                            <td style={styles.footerValue}>{formatTotalOrderPrice(getGrandTotal())}</td>
                            <td colSpan="4"></td>
                        </tr>
                        <tr style={styles.paymentsTotalRow}>
                            <td colSpan="8" style={styles.footerLabel}>All Payments Collected</td>
                            <td style={styles.footerValue}>{formatTotalOrderPrice(getTotalCompletedPayment())}</td>
                            <td colSpan="3"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div style={styles.analysisPanel}>
                <h5 style={styles.analysisTitle}>Sales Analysis</h5>
                <div style={styles.collectedPaymentsHero}>
                    <div>
                        <span style={styles.keyMetricBadge}>KEY METRIC</span>
                        <p style={{ ...styles.analysisLabel, color: '#084298', marginBottom: '3px' }}>
                            All Payments Collected
                        </p>
                        <p style={styles.analysisHelp}>Total cash received from full and partial payments across every status</p>
                    </div>
                    <p style={styles.collectedPaymentsValue}>
                        {formatTotalOrderPrice(getTotalCompletedPayment())}
                    </p>
                </div>
                <div style={styles.analysisGrid}>
                    <div style={styles.openTransactionItem}>
                        <p style={styles.analysisLabel}>Open Transaction Value</p>
                        <p style={styles.analysisValue}>{formatTotalOrderPrice(getPossibleSales())}</p>
                        <p style={styles.analysisHelp}>Full value of transactions not completed yet</p>
                    </div>
                    <div style={styles.completedTransactionItem}>
                        <p style={styles.analysisLabel}>Completed Transaction Value</p>
                        <p style={styles.analysisValue}>{formatTotalOrderPrice(getGrandTotal())}</p>
                        <p style={styles.analysisHelp}>Value of fully completed transactions</p>
                    </div>
                </div>
                <div style={styles.analysisSecondaryGrid}>
                    <div style={styles.estimatedBalanceItem}>
                        <p style={styles.analysisLabel}>Estimated Open Balance</p>
                        <p style={{ ...styles.analysisValue, color: '#b45309' }}>
                            {formatTotalOrderPrice(getEstimatedOpenBalance())}
                        </p>
                        <p style={styles.analysisHelp}>Open value less partial payments already collected</p>
                    </div>
                    <div style={styles.projectedSalesItem}>
                        <p style={styles.analysisLabel}>Projected Sales After Completion</p>
                        <p style={styles.analysisValue}>{formatTotalOrderPrice(getProjectedSales())}</p>
                        <p style={styles.analysisHelp}>Completed sales plus all open transaction value</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VipTransaction
