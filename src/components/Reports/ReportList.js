import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";
import { styled } from '@mui/material/styles';
import { Form } from 'react-bootstrap';


import LinearProgress from '@mui/material/LinearProgress';

const ReportList = () => {


    useEffect(() => {
        fetchShopOrderTransactionList();
    }, []);

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [customerOrderDate, setCustomerOrderDate] = useState({
        dateFrom: "",
        dateTo: ""
    });

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        data: [],
        code: '',
        message: '',
    });

    const fetchShopOrderTransactionList = () => {
        ShopOrderTransactionService.fetchOnlineShopOrderTransactionListReport()
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
        setFormErrors(validate(customerOrderDate));
        if (Object.keys(validate(customerOrderDate)).length > 0) {
            console.log("Has Validation: ");
        } else {
            console.log("Ready for saving: ");
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            ShopOrderTransactionService.fetchOnlineShopOrderTransactionListReportByDate(customerOrderDate)
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
        <div>
            <div style={{ float: 'right', marginRight: 100 }}>
                <table class="table table-bordered">
                    <thead class="table-dark">
                        <tr class="table-secondary">
                            <th></th>
                            <th></th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr  >
                            <td>Total Profit: </td>
                            <td>{numberFormat(shopOrderTransaction.total_profit)}</td>
                        </tr>
                        <tr  >
                            <td>Total Mandatory Expenses: </td>
                            <td>{numberFormat(shopOrderTransaction.expenses_mandatory)}</td>
                        </tr>
                        <tr  >
                            <td style={{ fontWeight: 'bold', }}>Net Profit: </td>
                            <td style={{ fontWeight: 'bold', }}>{numberFormat(shopOrderTransaction.total_profit - shopOrderTransaction.expenses_mandatory)}</td>
                        </tr>

                    </tbody>
                </table>
            </div>
            <div style={{ float: 'right', marginRight: 200 }}>
                <Form>

                    <Form.Group className="w-10 mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label>Mandatory Expenses: </Form.Label>
                        <Form.Control type="text" value={numberFormat(shopOrderTransaction.expenses_mandatory)} />
                    </Form.Group>
                    <Form.Group className="w-10 mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label>Non Mandatory Expenses: </Form.Label>
                        <Form.Control type="text" value={numberFormat(shopOrderTransaction.expenses_non_mandatory)} />
                    </Form.Group>
                    <Form.Group className="w-10 mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label>Total Expenses: </Form.Label>
                        <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_expenses)} />
                    </Form.Group>
                </Form >
            </div>
            <div>
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
                        <Form.Label>Total Cash Payment: </Form.Label>
                        <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_cash)} />
                    </Form.Group>
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label>Total Online Payment: </Form.Label>
                        <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_online)} />
                    </Form.Group>
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label>Total Sales: </Form.Label>
                        <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_sales)} />
                    </Form.Group>
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                        <Form.Label>Total Profit: </Form.Label>
                        <Form.Control type="text" value={numberFormat(shopOrderTransaction.total_profit)} />
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



            <Div>{"Online Orders"}
            </Div>

            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>Date</th>
                        <th>Total Cash</th>
                        <th>Total Online</th>
                        <th>Total Sales</th>
                        <th>Total Profit</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        shopOrderTransaction.data.map((shopOrderTransaction, index) => (
                            <tr  >
                                <td>{shopOrderTransaction.date}</td>
                                <td>{numberFormat(shopOrderTransaction.total_cash)}</td>
                                <td>{numberFormat(shopOrderTransaction.total_online)}</td>
                                <td>{numberFormat(shopOrderTransaction.total_sales)}</td>
                                <td>{numberFormat(shopOrderTransaction.total_profit)}</td>
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
        </div >
    )
}

export default ReportList
