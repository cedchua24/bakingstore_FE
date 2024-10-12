import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import CustomerService from "./CustomerService";
import { Link } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import PageviewIcon from '@mui/icons-material/Pageview';

const CustomerProductList = () => {

    const { id } = useParams();

    useEffect(() => {
        fetchCustomerTransaction(id);
    }, []);

    const [sortedProduct, setSortedProduct] = useState({
        data: [],
        customerDetails: {},
        code: '',
        message: '',
        id: 0
    });

    const [date, setDate] = useState('');

    const fetchCustomerTransaction = (id) => {
        CustomerService.fetchCustomerProduct(id)
            .then(response => {
                console.log('data', response.data)
                setSortedProduct(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');


    return (
        <div>
            <h1>{sortedProduct.customerDetails.first_name + " " + sortedProduct.customerDetails.last_name}</h1>
            <br></br>
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
