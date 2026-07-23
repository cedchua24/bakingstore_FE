import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import CustomerService from "./CustomerService";
import { Link } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import "./CustomerReportLists.css";

const CustomerTransactionList = () => {

    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [customerTransactionList, setCustomerTransactionList] = useState({
        data: [],
        payment: [],
        customerDetails: {},
        code: '',
        message: '',
        total_price: 0,
        total_count: 0,
        total_profit: 0
    });

    const [dateFilter, setDateFilter] = useState(() => {
        const searchParams = new URLSearchParams(location.search);
        return {
            dateFrom: searchParams.get('dateFrom') || '',
            dateTo: searchParams.get('dateTo') || '',
        };
    });

    const buildCustomerTransactionPayload = (customerId, filters) => {
        const payload = { id: customerId };
        if (filters.dateFrom) {
            payload.dateFrom = filters.dateFrom;
        }
        if (filters.dateTo) {
            payload.dateTo = filters.dateTo;
        }
        return payload;
    }

    const fetchCustomerTransaction = useCallback((customerId, filters) => {
        CustomerService.fetchCustomerTransaction(buildCustomerTransactionPayload(customerId, filters))
            .then(response => {
                console.log('data', response.data)
                setCustomerTransactionList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const filters = {
            dateFrom: searchParams.get('dateFrom') || '',
            dateTo: searchParams.get('dateTo') || '',
        };
        setDateFilter(filters);
        fetchCustomerTransaction(id, filters);
    }, [id, location.search, fetchCustomerTransaction]);

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setDateFilter({ ...dateFilter, [name]: value });
    }

    const submitCustomerTransaction = (e) => {
        e.preventDefault();
        fetchCustomerTransaction(id, dateFilter);
    }

    const showAllDates = () => {
        const emptyFilters = { dateFrom: '', dateTo: '' };
        setDateFilter(emptyFilters);
        fetchCustomerTransaction(id, emptyFilters);
        navigate(location.pathname, { replace: true });
    }

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');


    const totalSum = (numbers) => {
        // numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return numberFormat(numbers.reduce((acc, { shop_order_transaction_total_price }) => acc + shop_order_transaction_total_price, 0));
    }

    const customerName = [customerTransactionList.customerDetails.first_name, customerTransactionList.customerDetails.last_name]
        .filter(Boolean).join(" ") || "Customer";


    return (
        <div className="customer-list-page">
            <section className="customer-list-hero">
                <div className="customer-list-hero__copy">
                    <span>Customer activity</span>
                    <h1>{customerName}</h1>
                    <p>Review transaction history, payment totals, and order performance.</p>
                </div>
                <Form onSubmit={submitCustomerTransaction} className="customer-list-filters">
                    <Form.Group controlId="customerTransactionDateFrom">
                        <Form.Label>Date From</Form.Label>
                        <Form.Control type="date" name="dateFrom" value={dateFilter.dateFrom} onChange={onChangeInput} />
                    </Form.Group>
                    <Form.Group controlId="customerTransactionDateTo">
                        <Form.Label>Date To</Form.Label>
                        <Form.Control type="date" name="dateTo" value={dateFilter.dateTo} onChange={onChangeInput} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Apply Filter
                    </Button>
                    <Button variant="outline-secondary" type="button" onClick={showAllDates}>
                        All Dates
                    </Button>
                </Form>
            </section>
            <section className="customer-list-metrics">

                {
                    customerTransactionList.payment.map((payment, index) => (
                        <article className="customer-list-metric" key={payment.id || index}>
                            <div>
                                <span>{payment.payment_type} {payment.payment_type_description}</span>
                            {payment.total_paid_count != payment.total_count ?
                                <Tooltip title={"Need to Double Check all transaction in " + payment.payment_type}>
                                        <span className="customer-list-metric__check">
                                        <CloseIcon style={{ color: 'red', }} />
                                    </span>
                                </Tooltip> : <CheckIcon style={{ color: 'green', }} />}
                            </div>
                            <strong>{numberFormat(payment.total_amount)}</strong>
                        </article>
                    )
                    )
                }
                <article className="customer-list-metric customer-list-metric--total">
                    <span>Total Amount</span>
                    <strong>{totalSum(customerTransactionList.data)}</strong>
                </article>
            </section>

            <section className="customer-list-table-card">
            <table className="table customer-list-table" >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Shop Name</th>
                        <th>Customer Type</th>
                        <th>Customer</th>
                        <th>Total Quantity</th>
                        <th>Total Cash</th>
                        <th>Total Online</th>
                        <th>Bank</th>
                        <th>Total Amount</th>
                        <th>Profit</th>
                        <th>Date</th>
                        <th>Payment Status</th>
                        <th></th>
                    </tr>
                </thead>
                {customerTransactionList.data.length == 0 ?
                    (<tr style={{ color: "red", }}>{"No Data Available"}</tr>)
                    :
                    (
                        <tbody>

                            {
                                customerTransactionList.data.map((customerTransactionList, index) => (
                                    <tr key={customerTransactionList.id} style={{ border: "2px solid black" }}>
                                        <td >{customerTransactionList.id}</td>
                                        <td>{customerTransactionList.shop_name}</td>
                                        <td>{customerTransactionList.customer_type}</td>
                                        <td>{customerTransactionList.requestor_name}</td>
                                        <td>{customerTransactionList.shop_order_transaction_total_quantity != 0 ? customerTransactionList.shop_order_transaction_total_quantity : ""}</td>
                                        <td>{customerTransactionList.total_cash != 0 ? numberFormat(customerTransactionList.total_cash) : ""}</td>
                                        <td>{customerTransactionList.total_online != 0 ? numberFormat(customerTransactionList.total_online) : ""}</td>
                                        <td>
                                            {Array.isArray(customerTransactionList.mode_of_payment) && customerTransactionList.mode_of_payment.length > 0 &&
                                                <div className="customer-list-payment-list">
                                                {customerTransactionList.mode_of_payment.map((sot, index) => (
                                                    <span key={sot.id || index}><small>{sot.payment_type}</small>{numberFormat(sot.amount)}</span>
                                                ))}
                                                </div>
                                            }
                                        </td>

                                        <td style={{ fontWeight: 'bold', }}>{customerTransactionList.shop_order_transaction_total_price != 0 ? numberFormat(customerTransactionList.shop_order_transaction_total_price) : ""}</td>
                                        <td style={{ fontWeight: 'bold', }}>{customerTransactionList.profit != 0 ? numberFormat(customerTransactionList.profit) : ""}</td>
                                        <td>{customerTransactionList.date}</td>
                                        <td><span className={`customer-list-status customer-list-status--${customerTransactionList.status === 1 ? "completed" : customerTransactionList.status === 2 ? "pending" : "cancelled"}`}>
                                            {customerTransactionList.status === 1 ? "COMPLETED" : customerTransactionList.status === 2 ? "PENDING" : "CANCELLED"}
                                        </span></td>
                                        <td>
                                            <Link variant="primary" to={"../shopOrderTransaction/completedShopOrderTransaction/" + customerTransactionList.id}   >
                                                <Button variant="primary" >
                                                    View
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                )
                                )
                            }
                        </tbody>)}
            </table>
            </section>
        </div>
    )
}

export default CustomerTransactionList
