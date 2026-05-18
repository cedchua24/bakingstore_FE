import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";
import { styled } from '@mui/material/styles';
import { Form } from 'react-bootstrap';


import LinearProgress from '@mui/material/LinearProgress';

const EmployeePerformance = () => {
    const { date } = useParams();

    useEffect(() => {
        saveOrderTransaction();
    }, []);

    const [role, setRole] = useState(localStorage.getItem('role_as'));

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [showGraph, setShowGraph] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [customerOrderDate, setCustomerOrderDate] = useState({
        dateFrom: date,
        dateTo: date
    });



    const [preparerList, setPreparerList] = useState([]);
    const [checkerList, setCheckerList] = useState([]);
    const [dispatcherList, setDispatcherList] = useState([]);
    const [salesRepList, setSalesRepList] = useState([]);



    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: "2rem",
        padding: theme.spacing(1),
        textAlign: "center",
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
        setFormErrors(validate(customerOrderDate));
        if (Object.keys(validate(customerOrderDate)).length > 0) {
            console.log("Has Validation: ");
        } else {
            console.log("Ready for saving: ");
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            ShopOrderTransactionService.fetchEmployeePrepare(customerOrderDate)
                .then(response => {
                    setPreparerList(response.data);
                })
                .catch(e => {
                    console.log("error", e)
                });
            ShopOrderTransactionService.fetchEmployeeChecker(customerOrderDate)
                .then(response => {
                    setCheckerList(response.data);
                })
                .catch(e => {
                    console.log("error", e)
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                });
            ShopOrderTransactionService.fetchEmployeeDispatcher(customerOrderDate)
                .then(response => {
                    setDispatcherList(response.data);
                })
                .catch(e => {
                    console.log("error", e)
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                });
            ShopOrderTransactionService.fetchEmployeeSales(customerOrderDate)
                .then(response => {
                    setSalesRepList(response.data);
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

            <div>
                <Form>
                    {formErrors.dateFrom && <p style={{ color: "red" }}>{formErrors.dateFrom}</p>}
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                        <Form.Label>Date From:</Form.Label>
                        <Form.Control type="date" name="dateFrom" onChange={onChangeInput} value={customerOrderDate.dateFrom} />
                    </Form.Group>
                    {formErrors.dateTo && <p style={{ color: "red" }}>{formErrors.dateTo}</p>}
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                        <Form.Label>Date To:</Form.Label>
                        <Form.Control type="date" name="dateTo" onChange={onChangeInput} value={customerOrderDate.dateTo} />
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
            <br></br>

            <legend align="center" style={{ fontWeight: 'bold' }} > Top Sales Representative Performers </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Employee</th>
                        <th>Transaction Count</th>
                        <th>Product Quantity</th>
                        <th>Total Amount</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        salesRepList.map((data, index) => (
                            <tr  >
                                <td>{data.id}</td>
                                <td>{data.preparer_name}</td>
                                <td>{data.total_transaction_count}</td>
                                <td>{data.total_quantity}</td>
                                <td>{numberFormat(data.total_amount)}</td>
                                <td>

                                    <Link variant="primary" to={"/data/customerOrderTransactionList/" + data.date}   >
                                        <Button variant="primary" disabled>
                                            View Transaction
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        )
                        )
                    }
                </tbody>

                <br></br>

            </table>
            <br></br>

            <legend align="center" style={{ fontWeight: 'bold' }} > Top Preparer Performers  </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Employee</th>
                        <th>Transaction Count</th>
                        <th>Product Quantity</th>
                        <th>Total Amount</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        preparerList.map((data, index) => (
                            <tr  >
                                <td>{data.id}</td>
                                <td>{data.preparer_name}</td>
                                <td>{data.total_transaction_count}</td>
                                <td>{data.total_quantity}</td>
                                <td>{numberFormat(data.total_amount)}</td>
                                <td>

                                    <Link variant="primary" to={"/data/customerOrderTransactionList/" + data.date}   >
                                        <Button variant="primary" disabled>
                                            View Transaction
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        )
                        )
                    }
                </tbody>

                <br></br>

            </table>

            <br></br>

            <legend align="center" style={{ fontWeight: 'bold' }} > Top Checker Performers  </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Employee</th>
                        <th>Transaction Count</th>
                        <th>Product Quantity</th>
                        <th>Total Amount</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        checkerList.map((data, index) => (
                            <tr  >
                                <td>{data.id}</td>
                                <td>{data.preparer_name}</td>
                                <td>{data.total_transaction_count}</td>
                                <td>{data.total_quantity}</td>
                                <td>{numberFormat(data.total_amount)}</td>
                                <td>

                                    <Link variant="primary" to={"/data/customerOrderTransactionList/" + data.date}   >
                                        <Button variant="primary" disabled>
                                            View Transaction
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        )
                        )
                    }
                </tbody>

                <br></br>

            </table>

            <br></br>

            <legend align="center" style={{ fontWeight: 'bold' }} > Top Dispatcher Performers  </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Employee</th>
                        <th>Transaction Count</th>
                        <th>Product Quantity</th>
                        <th>Total Amount</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        dispatcherList.map((data, index) => (
                            <tr  >
                                <td>{data.id}</td>
                                <td>{data.preparer_name}</td>
                                <td>{data.total_transaction_count}</td>
                                <td>{data.total_quantity}</td>
                                <td>{numberFormat(data.total_amount)}</td>
                                <td>

                                    <Link variant="primary" to={"/data/customerOrderTransactionList/" + data.date}   >
                                        <Button variant="primary" disabled>
                                            View Transaction
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        )
                        )
                    }
                </tbody>

                <br></br>

            </table>
        </div >
    )
}

export default EmployeePerformance
