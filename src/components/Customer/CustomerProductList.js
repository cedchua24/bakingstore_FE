import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import CustomerService from "./CustomerService";

const CustomerProductList = () => {

    const { id } = useParams();
    const location = useLocation();

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


    return (
        <div>
            <h1>{sortedProduct.customerDetails.first_name + " " + sortedProduct.customerDetails.last_name}</h1>
            <Form onSubmit={submitCustomerProduct} className="mb-3">
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
                    <Form.Group controlId="customerProductDateFrom">
                        <Form.Label>Date From:</Form.Label>
                        <Form.Control type="date" name="dateFrom" value={dateFilter.dateFrom} onChange={onChangeInput} />
                    </Form.Group>
                    <Form.Group controlId="customerProductDateTo">
                        <Form.Label>Date To:</Form.Label>
                        <Form.Control type="date" name="dateTo" value={dateFilter.dateTo} onChange={onChangeInput} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Find
                    </Button>
                </div>
            </Form>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>Type</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Sold</th>
                        <th>Amount</th>
                        <th>Profit</th>
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
                                        <td>{numberFormat(data.total_profit)}</td>
                                    </tr>
                                )
                                )
                            }
                        </tbody>)}
            </table>
            <div></div>
        </div>
    )
}

export default CustomerProductList
