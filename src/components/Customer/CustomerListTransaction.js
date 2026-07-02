import React, { useState } from "react";
import CustomerService from "./CustomerService";
import { Link } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { Button, Form } from 'react-bootstrap';
import LinearProgress from '@mui/material/LinearProgress';

const CustomerListTransaction = () => {

    const [sortedCustomer, setSortedCustomer] = useState({
        dateFrom: '',
        dateTo: '',
        type: 'ALL'
    });

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [customerList, setCustomerList] = useState({
        data: [],
    });

    const onChangeInput = (e) => {
        setSortedCustomer({ ...sortedCustomer, [e.target.name]: e.target.value });
    }

    const submitSortedCustomerList = () => {
        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        setErrorMessage('');
        CustomerService.fetchCustomerTransactionListByDate(sortedCustomer)
            .then(response => {
                setCustomerList(response.data);
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
            })
            .catch(e => {
                console.log("error", e)
                setErrorMessage('Unable to load customer transactions. Please try again.');
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
            });
    }

    const clearFilters = () => {
        setSortedCustomer({ dateFrom: '', dateTo: '', type: 'ALL' });
        setCustomerList({ data: [] });
        setErrorMessage('');
    }

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(Number(value) || 0).replace(/(\.|,)00$/g, '');

    const totalSum = (numbers) => {
        return numberFormat(numbers.reduce((acc, { total_balance }) => acc + (Number(total_balance) || 0), 0));
    }

    const totalProfit = (numbers) => {
        return numberFormat(numbers.reduce((acc, { total_profit }) => acc + (Number(total_profit) || 0), 0));
    }

    const formatStatementDate = (date) => {
        if (!date) {
            return '-';
        }

        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }

    const getVipCustomers = (customer) => {
        if (!customer || !Array.isArray(customer.vip_customers)) {
            return [];
        }

        return customer.vip_customers.filter(vipCustomer => vipCustomer && vipCustomer.vip_name);
    }

    const renderVipCustomers = (customer) => {
        const vipCustomers = getVipCustomers(customer);

        if (vipCustomers.length === 0) {
            return null;
        }

        return (
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '3px', marginTop: '4px' }}>
                {vipCustomers.map((vipCustomer, index) => (
                    <span
                        key={vipCustomer.vip_customer_transaction_id || `${vipCustomer.vip_customer_id}-${index}`}
                        title={`VIP Customer: ${vipCustomer.vip_name}`}
                        style={{
                            display: 'inline-block',
                            padding: '2px 7px',
                            color: '#fff',
                            backgroundColor: vipCustomer.vip_color || '#198754',
                            borderRadius: '999px',
                            boxShadow: `0 3px 7px ${(vipCustomer.vip_color || '#198754')}45`,
                            fontSize: '9px',
                            fontWeight: '900',
                            lineHeight: 1.25,
                            letterSpacing: '.02em',
                            textShadow: '0 1px 1px rgba(0, 0, 0, .25)',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {vipCustomer.vip_name}
                    </span>
                ))}
            </span>
        );
    }

    const customerTypeLabel = {
        ALL: 'All customers',
        VIP: 'VIP customers',
        NON_VIP: 'Non-VIP customers'
    }[sortedCustomer.type] || 'All customers';

    return (
        <div style={{ padding: '8px 0 32px' }}>
            <div style={{ marginBottom: '24px' }}>
                <div style={{ color: '#6c757d', fontSize: '13px', fontWeight: '700', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                    Customer reports
                </div>
                <h2 style={{ margin: '4px 0 6px', color: '#212529', fontWeight: '800' }}>Customer Transactions</h2>
                <p style={{ margin: 0, color: '#6c757d' }}>
                    Review customer sales, profit, and VIP membership within a date range.
                </p>
            </div>

            <div style={{
                padding: '20px',
                marginBottom: '20px',
                backgroundColor: '#fff',
                border: '1px solid #e9ecef',
                borderRadius: '14px',
                boxShadow: '0 6px 22px rgba(33, 37, 41, 0.05)'
            }}>
                <Form>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px', alignItems: 'end' }}>
                        <Form.Group controlId="customerTransactionDateFrom">
                            <Form.Label style={{ color: '#495057', fontSize: '13px', fontWeight: '700' }}>Date from</Form.Label>
                            <Form.Control type="date" name="dateFrom" value={sortedCustomer.dateFrom} onChange={onChangeInput} />
                        </Form.Group>
                        <Form.Group controlId="customerTransactionDateTo">
                            <Form.Label style={{ color: '#495057', fontSize: '13px', fontWeight: '700' }}>Date to</Form.Label>
                            <Form.Control type="date" name="dateTo" value={sortedCustomer.dateTo} onChange={onChangeInput} />
                        </Form.Group>
                        <Form.Group controlId="customerTransactionType">
                            <Form.Label style={{ color: '#495057', fontSize: '13px', fontWeight: '700' }}>Customer type</Form.Label>
                            <Form.Select name="type" value={sortedCustomer.type} onChange={onChangeInput}>
                                <option value="ALL">All customers</option>
                                <option value="VIP">VIP customers</option>
                                <option value="NON_VIP">Non-VIP customers</option>
                            </Form.Select>
                        </Form.Group>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={submitSortedCustomerList}
                                disabled={isAddDisabled}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '700', padding: '8px 18px' }}
                            >
                                <SearchIcon style={{ fontSize: '18px' }} />
                                {submitLoadingAdd ? 'Loading...' : 'View report'}
                            </Button>
                            <Button type="button" variant="outline-secondary" onClick={clearFilters} disabled={submitLoadingAdd}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </Form>
                {submitLoadingAdd && <LinearProgress color="primary" style={{ marginTop: '18px', borderRadius: '999px' }} />}
                {errorMessage &&
                    <div role="alert" style={{ marginTop: '16px', padding: '10px 12px', color: '#842029', backgroundColor: '#f8d7da', borderRadius: '8px' }}>
                        {errorMessage}
                    </div>
                }
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                {[
                    { label: 'Customers', value: customerList.data.length, color: '#0d6efd' },
                    { label: 'Total sales', value: totalSum(customerList.data), color: '#198754' },
                    { label: 'Total profit', value: totalProfit(customerList.data), color: '#6f42c1' }
                ].map(metric => (
                    <div key={metric.label} style={{
                        padding: '16px 18px',
                        backgroundColor: '#fff',
                        border: '1px solid #e9ecef',
                        borderLeft: `4px solid ${metric.color}`,
                        borderRadius: '12px'
                    }}>
                        <div style={{ color: '#6c757d', fontSize: '12px', fontWeight: '700', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                            {metric.label}
                        </div>
                        <div style={{ marginTop: '4px', color: '#212529', fontSize: '24px', fontWeight: '800' }}>{metric.value}</div>
                    </div>
                ))}
            </div>

            <div style={{ backgroundColor: '#fff', border: '1px solid #e9ecef', borderRadius: '14px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', borderBottom: '1px solid #e9ecef' }}>
                    <div>
                        <h5 style={{ margin: 0, color: '#212529', fontWeight: '800' }}>Customer results</h5>
                        <div style={{ marginTop: '3px', color: '#6c757d', fontSize: '13px' }}>
                            Showing {customerTypeLabel.toLowerCase()}. VIP customers are marked with their account color.
                        </div>
                    </div>
                    <span style={{ padding: '4px 9px', color: '#495057', backgroundColor: '#f1f3f5', borderRadius: '999px', fontSize: '12px', fontWeight: '700' }}>
                        {customerList.data.length} records
                    </span>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0" style={{ minWidth: '880px', fontSize: '13px' }}>
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                            <tr>
                                {['ID', 'Customer / Store', 'Contact details', 'Financials', 'Status / Created', 'Actions'].map(heading => (
                                    <th key={heading} style={{ padding: '10px 12px', color: '#495057', fontSize: '11px', letterSpacing: '.04em', textTransform: 'uppercase', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap' }}>
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {customerList.data.length === 0 ?
                                <tr>
                                    <td colSpan="6" style={{ padding: '52px 20px', textAlign: 'center' }}>
                                        <div style={{ color: '#495057', fontSize: '16px', fontWeight: '700' }}>No customer transactions yet</div>
                                        <div style={{ marginTop: '5px', color: '#868e96', fontSize: '13px' }}>Choose a date range and select "View report".</div>
                                    </td>
                                </tr>
                                :
                                customerList.data.map((customer) => (
                                    <tr key={customer.id}>
                                        <td style={{
                                            padding: '10px 12px',
                                            color: '#212529',
                                            fontWeight: '800',
                                            borderLeft: `4px solid ${getVipCustomers(customer)[0]?.vip_color || 'transparent'}`
                                        }}>
                                            #{customer.id}
                                            {renderVipCustomers(customer)}
                                        </td>
                                        <td style={{ padding: '10px 12px', minWidth: '160px' }}>
                                            <div style={{ fontWeight: '800', color: '#212529', lineHeight: 1.35 }}>
                                                {[customer.first_name, customer.last_name].filter(Boolean).join(' ') || 'Unnamed customer'}
                                            </div>
                                            {customer.store_name &&
                                                <div style={{
                                                    marginTop: '4px',
                                                    color: '#526b8a',
                                                    fontSize: '11px',
                                                    fontWeight: '500',
                                                    lineHeight: 1.45,
                                                    letterSpacing: '.02em',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {customer.store_name}
                                                </div>
                                            }
                                        </td>
                                        <td style={{ padding: '10px 12px', minWidth: '235px', maxWidth: '300px' }}>
                                            {customer.contact_number &&
                                                <div style={{ color: '#212529', lineHeight: 1.4 }}>
                                                    <span style={{ color: '#868e96', fontSize: '11px', fontWeight: '700' }}>TEL&nbsp;&nbsp;</span>
                                                    {customer.contact_number}
                                                </div>
                                            }
                                            {customer.email &&
                                                <div style={{ color: '#495057', lineHeight: 1.4, overflowWrap: 'anywhere' }}>
                                                    <span style={{ color: '#868e96', fontSize: '11px', fontWeight: '700' }}>EMAIL&nbsp;&nbsp;</span>
                                                    {customer.email}
                                                </div>
                                            }
                                            {customer.address &&
                                                <div style={{ marginTop: '2px', color: '#6c757d', fontSize: '12px', lineHeight: 1.35 }}>
                                                    {customer.address}
                                                </div>
                                            }
                                            {!customer.contact_number && !customer.email && !customer.address &&
                                                <span style={{ color: '#adb5bd' }}>-</span>
                                            }
                                        </td>
                                        <td style={{ padding: '10px 12px', minWidth: '130px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: '#198754', fontWeight: '800' }}>
                                                <span style={{ color: '#868e96', fontSize: '11px', fontWeight: '700' }}>SALES</span>
                                                {numberFormat(customer.total_balance)}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '4px', color: '#6f42c1', fontWeight: '800' }}>
                                                <span style={{ color: '#868e96', fontSize: '11px', fontWeight: '700' }}>PROFIT</span>
                                                {numberFormat(customer.total_profit)}
                                            </div>
                                        </td>
                                        <td style={{ padding: '10px 12px', minWidth: '130px' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                color: customer.disabled === 0 ? '#0f5132' : '#842029',
                                                backgroundColor: customer.disabled === 0 ? '#d1e7dd' : '#f8d7da',
                                                borderRadius: '999px',
                                                fontSize: '12px',
                                                fontWeight: '700'
                                            }}>
                                                {customer.disabled === 0 ? 'Active' : 'Inactive'}
                                            </span>
                                            <div style={{ marginTop: '7px', color: '#868e96', fontSize: '11px', whiteSpace: 'nowrap' }}>
                                                {formatStatementDate(customer.created_at)}
                                            </div>
                                        </td>
                                        <td style={{ padding: '10px 12px' }}>
                                            <div style={{ display: 'flex', gap: '5px', whiteSpace: 'nowrap' }}>
                                                <Link to={"/customers/customerTransactionList/" + customer.id}>
                                                    <Button size="sm" variant="primary">
                                                        Orders
                                                    </Button>
                                                </Link>
                                                <Link to={"/customers/customerProductList/" + customer.id}>
                                                    <Button size="sm" variant="outline-primary">
                                                        Products
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default CustomerListTransaction
