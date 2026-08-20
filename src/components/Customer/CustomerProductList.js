import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import CustomerService from "./CustomerService";
import "./CustomerReportLists.css";

const CustomerProductList = () => {

    const { id } = useParams();
    const location = useLocation();
    const [showProfit, setShowProfit] = useState(false);

    const [sortedProduct, setSortedProduct] = useState({
        data: [],
        customerDetails: {},
        code: '',
        message: '',
        id: 0
    });

    const [dateFilter, setDateFilter] = useState(() => {
        const searchParams = new URLSearchParams(location.search);
        return {
            dateFrom: searchParams.get('dateFrom') || '',
            dateTo: searchParams.get('dateTo') || '',
        };
    });

    const buildCustomerProductPayload = (customerId, filters) => {
        const payload = { id: customerId };
        if (filters.dateFrom) {
            payload.dateFrom = filters.dateFrom;
        }
        if (filters.dateTo) {
            payload.dateTo = filters.dateTo;
        }
        return payload;
    }

    const fetchCustomerProduct = useCallback((customerId, filters) => {
        CustomerService.fetchCustomerProduct(buildCustomerProductPayload(customerId, filters))
            .then(response => {
                console.log('data', response.data)
                setSortedProduct(response.data);
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
        fetchCustomerProduct(id, filters);
    }, [id, location.search, fetchCustomerProduct]);

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setDateFilter({ ...dateFilter, [name]: value });
    }

    const submitCustomerProduct = (e) => {
        e.preventDefault();
        fetchCustomerProduct(id, dateFilter);
    }

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');

    const customerName = [sortedProduct.customerDetails.first_name, sortedProduct.customerDetails.last_name]
        .filter(Boolean).join(" ") || "Customer";
    const productTotals = sortedProduct.data.reduce((totals, product) => ({
        quantity: totals.quantity + Number(product.total_quantity || 0),
        sales: totals.sales + Number(product.total_price || 0),
        profit: totals.profit + Number(product.total_profit || 0)
    }), { quantity: 0, sales: 0, profit: 0 });


    return (
        <div className="customer-list-page">
            <section className="customer-list-hero">
                <div className="customer-list-hero__copy">
                    <span>Customer purchases</span>
                    <h1>{customerName}</h1>
                    <p>See which products this customer buys and their sales contribution.</p>
                </div>
                <Form onSubmit={submitCustomerProduct} className="customer-list-filters">
                    <Form.Group controlId="customerProductDateFrom">
                        <Form.Label>Date From</Form.Label>
                        <Form.Control type="date" name="dateFrom" value={dateFilter.dateFrom} onChange={onChangeInput} />
                    </Form.Group>
                    <Form.Group controlId="customerProductDateTo">
                        <Form.Label>Date To</Form.Label>
                        <Form.Control type="date" name="dateTo" value={dateFilter.dateTo} onChange={onChangeInput} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Apply Filter
                    </Button>
                    <Form.Check type="switch" id="customer-product-profit" label="Show profit" checked={showProfit} onChange={(event) => setShowProfit(event.target.checked)} />
                </Form>
            </section>
            <section className="customer-list-metrics customer-list-metrics--products">
                <article className="customer-list-metric"><span>Products</span><strong>{sortedProduct.data.length}</strong></article>
                <article className="customer-list-metric"><span>Units Sold</span><strong>{productTotals.quantity}</strong></article>
                <article className="customer-list-metric"><span>Sales</span><strong>{numberFormat(productTotals.sales)}</strong></article>
                {showProfit && <article className="customer-list-metric customer-list-metric--total"><span>Profit</span><strong>{numberFormat(productTotals.profit)}</strong></article>}
            </section>
            <section className="customer-list-table-card customer-list-table-card--products">
            <table className="table customer-list-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Sold</th>
                        <th>Amount</th>
                        {showProfit && <th>Profit</th>}
                    </tr>
                </thead>
                {sortedProduct.data.length == 0 ?
                    (<tr style={{ color: "red" }}>{"No Data Available"}</tr>)
                    :
                    (
                        <tbody>
                            {
                                sortedProduct.data.map((data, index) => (
                                    <tr key={data.mark_up_product_id} >
                                        <td>{data.business_type}</td>
                                        <td>{data.product_name}</td>
                                        <td>{numberFormat(data.new_price)}</td>
                                        <td>{data.total_quantity}</td>
                                        <td>{numberFormat(data.total_price)}</td>
                                        {showProfit && <td>{numberFormat(data.total_profit)}</td>}
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

export default CustomerProductList
