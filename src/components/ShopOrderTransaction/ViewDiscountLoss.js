import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import SpoilageService from "../Spoilage/SpoilageService";
import DiscountService from "../OtherService/DiscountService";


import { styled } from '@mui/material/styles';
import { Form } from 'react-bootstrap';

import PageviewIcon from '@mui/icons-material/Pageview';
import LinearProgress from '@mui/material/LinearProgress';

const ViewDiscountLoss = () => {

    const { id } = useParams();

    useEffect(() => {
        fetchShopOrderTransactionList();
    }, []);

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [date, setDate] = useState({
        today: id
    });

    const [customerOrderDate, setCustomerOrderDate] = useState({
        dateFrom: "",
        dateTo: ""
    });

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        data: [],
        total_amount: [],
        code: '',
        message: '',
    });

    const fetchShopOrderTransactionList = () => {
        DiscountService.fetchDiscountLossReport(date)
            .then(response => {
                // setShopOrderTransactionList(response.data);
                setShopOrderTransaction(response.data);
            })
            .catch(e => {
                console.log("error", e)

            });
    }



    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: "2rem",
        padding: theme.spacing(1),
    }));

    const onChangeInput = (e) => {
        console.log(e.target.value);

        setCustomerOrderDate({ ...customerOrderDate, [e.target.name]: e.target.value });

    }

    const validate = (values) => {
        const errors = {};
        if (customerOrderDate.dateFrom.length == 0) {
            errors.dateFrom = "Date From Required!";
        }
        if (customerOrderDate.dateTo.length == 0) {
            errors.dateTo = "Date To Required!";
        }

        return errors;
    }


    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');



    return (
        <div >


            <div style={{ float: 'left', }}>

                <Form>
                    <Form.Group className="w-15 mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label>Total Loss Amount: </Form.Label>
                        <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_amount)} />
                    </Form.Group>
                    <br></br>
                    <br></br>
                    {submitLoadingAdd &&
                        <LinearProgress color="warning" />
                    }
                    <br></br>
                </Form >

            </div>

            <legend align="center" style={{ fontWeight: 'bold' }} > Discount Loss Report   </legend>
            <legend align="center" style={{ fontWeight: 'bold' }} > {id}   </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Discount Amount</th>
                        <th>Quantity</th>
                        <th>Total Discount Amount</th>
                        <th>Total Loss Amount</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        shopOrderTransaction.data.map((shopOrderTransaction, index) => (
                            <tr  >
                                <td>{shopOrderTransaction.id}</td>
                                <td>{shopOrderTransaction.product_name}</td>
                                <td>{shopOrderTransaction.so_discount_amount}</td>
                                <td>{shopOrderTransaction.shop_order_quantity}</td>
                                <td>{shopOrderTransaction.discount_amount}</td>
                                <td>{shopOrderTransaction.loss_amount}</td>
                                <td>{shopOrderTransaction.business_type}</td>
                                <td>{shopOrderTransaction.date}</td>
                                <td>
                                    <Link variant="primary" to={"../shopOrderTransaction/completedShopOrderTransaction/" + shopOrderTransaction.transaction_id}   >
                                        <Button variant="primary" >
                                            View
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
        </div >
    )
}

export default ViewDiscountLoss
