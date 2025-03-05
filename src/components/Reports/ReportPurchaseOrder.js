import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";
import OrderSupplierTransactionService from "../OrderSupplierTransaction/OrderSupplierTransactionService";

import { styled } from '@mui/material/styles';
import { Form } from 'react-bootstrap';

import PageviewIcon from '@mui/icons-material/Pageview';
import LinearProgress from '@mui/material/LinearProgress';

const ReportPurchaseOrder = () => {


    useEffect(() => {
        fetchShopOrderTransactionList();
    }, []);

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [date, setDate] = useState('');

    const [customerOrderDate, setCustomerOrderDate] = useState({
        dateFrom: "",
        dateTo: ""
    });

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        data: [],
        payment: [],
        code: '',
        message: '',
    });

    const fetchShopOrderTransactionList = () => {
        OrderSupplierTransactionService.fetchOrderSupplierReport()
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

    const saveOrderTransaction = () => {
        console.log("count: ", Object.keys(validate(customerOrderDate)).length);
        console.log("validate: ", validate(customerOrderDate));
        console.log("date: ", date);
        setFormErrors(validate(customerOrderDate));
        if (Object.keys(validate(customerOrderDate)).length > 0) {
            console.log("Has Validation: ");
        } else {
            console.log("Ready for saving: ");
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            OrderSupplierTransactionService.fetchOrderSupplierReport(customerOrderDate)
                .then(response => {
                    setShopOrderTransaction(response.data);
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                })
                .catch(e => {
                    console.log("error", e)
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                });
        }
    }

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');



    return (
        <div >


            <div style={{ float: 'left', width: 700 }}>
                <Div>{"Purchase Order Report"}
                </Div>

                <Form>
                    {formErrors.dateFrom && <p style={{ color: "red" }}>{formErrors.dateFrom}</p>}
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                        <Form.Label>Date From:</Form.Label>
                        <Form.Control type="date" name="dateFrom" onChange={onChangeInput} />
                    </Form.Group>
                    {formErrors.dateTo && <p style={{ color: "red" }}>{formErrors.dateTo}</p>}
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                        <Form.Label>Date To:</Form.Label>
                        <Form.Control type="date" name="dateTo" onChange={onChangeInput} />
                    </Form.Group>
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label>Total Amount: </Form.Label>
                        <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_sales)} />
                    </Form.Group>
                    <Button variant="primary" onClick={saveOrderTransaction} disabled={isAddDisabled}>
                        Find
                    </Button>
                    <br></br>
                    <br></br>
                    {submitLoadingAdd &&
                        <LinearProgress color="warning" />
                    }
                    <br></br>
                </Form >

            </div>


            <div style={{ float: 'right', marginRight: 300 }}>

                {
                    shopOrderTransaction.payment.map((payment, index) => (
                        <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                            <Form.Label> {payment.bank_name + " - "} {payment.account_name} {payment.account_number} </Form.Label>
                            {/* <Link variant="primary" to={"../shopOrderTransaction/paymentTypeSales/" + payment.id + "+" + date}   >
                                <PageviewIcon color="primary" />
                            </Link> */}
                            <Form.Control type="text" value={numberFormat(payment.total_amount)} />

                        </Form.Group>
                    )
                    )
                }

            </div>




            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>Date</th>
                        <th>Total Count</th>
                        <th>Total Amount</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        shopOrderTransaction.data.map((shopOrderTransaction, index) => (
                            <tr  >
                                <td>{shopOrderTransaction.date}</td>
                                <td>{shopOrderTransaction.total_count}</td>
                                <td>{numberFormat(shopOrderTransaction.total_sales)}</td>
                                <td>
                                    <Link variant="primary" to={"../reports/purchaseOrderList/" + shopOrderTransaction.date}   >
                                        <Button variant="primary" >
                                            View
                                        </Button>
                                    </Link></td>
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
        </div >
    )
}

export default ReportPurchaseOrder
