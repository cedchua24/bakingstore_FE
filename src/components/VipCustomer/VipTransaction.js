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
    analysisItem: {
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: '#f8f9fa',
    },
    analysisLabel: {
        color: '#6c757d',
        fontSize: '13px',
        marginBottom: '4px',
    },
    analysisValue: {
        fontWeight: '700',
        fontSize: '18px',
        marginBottom: '0',
    },
    projectedSalesItem: {
        border: '1px solid #b6d4fe',
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: '#cfe2ff',
        color: '#084298',
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

    const getGrandTotal = () => {
        return vipTransactionList.reduce((total, vipTransaction) => {
            var totalOrderPrice = Number(vipTransaction.total_order_price || 0);
            return total + totalOrderPrice;
        }, 0);
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
                            <th rowSpan="2" style={styles.groupHeader}>Customer</th>
                            <th rowSpan="2" style={styles.groupHeader}>Store Name</th>
                            <th colSpan="2" style={styles.groupHeader}>Draft Order</th>
                            <th colSpan="2" style={styles.groupHeader}>Last Order</th>
                            <th rowSpan="2" style={styles.groupHeader}>Total Amount Completed</th>
                            <th rowSpan="2" style={styles.groupHeader}>Note</th>
                            <th rowSpan="2" style={styles.groupHeader}>Transaction</th>
                            <th rowSpan="2" style={styles.groupHeader}>Products</th>
                        </tr>
                        <tr>
                            <th style={styles.subHeader}>Dates</th>
                            <th style={styles.subHeader}>Total Amount</th>
                            <th style={styles.subHeader}>Date</th>
                            <th style={styles.subHeader}>Days Ago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            vipTransactionList.length > 0 ? vipTransactionList.map((vipTransaction, index) => (
                                <tr key={vipTransaction.vip_customer_transaction_id} >
                                    <td>{index + 1}</td>
                                    <td>{vipTransaction.customer_name}</td>
                                    <td>{vipTransaction.store_name}</td>
                                    <td>{renderDraftOrderDates(vipTransaction)}</td>
                                    <td>{formatTotalOrderPrice(vipTransaction.draft_order_total_price)}</td>
                                    <td>{formatStatementDate(vipTransaction.last_order_date)}</td>
                                    <td>{renderDaysAgo(vipTransaction.last_order_date)}</td>
                                    <td>{formatTotalOrderPrice(vipTransaction.total_order_price)}</td>
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
                                    <td colSpan="11" style={styles.emptyState}>No VIP customer transactions found.</td>
                                </tr>
                            )
                        }
                    </tbody>
                    <tfoot>
                        <tr style={styles.possibleSalesRow}>
                            <td colSpan="4" style={styles.footerLabel}>Possible Sales</td>
                            <td style={styles.footerValue}>{formatTotalOrderPrice(getPossibleSales())}</td>
                            <td colSpan="6"></td>
                        </tr>
                        <tr style={styles.grandTotalRow}>
                            <td colSpan="7" style={styles.footerLabel}>Grand Total</td>
                            <td style={styles.footerValue}>{formatTotalOrderPrice(getGrandTotal())}</td>
                            <td colSpan="3"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div style={styles.analysisPanel}>
                <h5 style={styles.analysisTitle}>Sales Analysis</h5>
                <div style={styles.analysisGrid}>
                    <div style={styles.analysisItem}>
                        <p style={styles.analysisLabel}>Possible Sales</p>
                        <p style={styles.analysisValue}>{formatTotalOrderPrice(getPossibleSales())}</p>
                    </div>
                    <div style={styles.analysisItem}>
                        <p style={styles.analysisLabel}>Grand Total Completed</p>
                        <p style={styles.analysisValue}>{formatTotalOrderPrice(getGrandTotal())}</p>
                    </div>
                    <div style={styles.projectedSalesItem}>
                        <p style={styles.analysisLabel}>Projected Sales if Completed</p>
                        <p style={styles.analysisValue}>{formatTotalOrderPrice(getProjectedSales())}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VipTransaction
