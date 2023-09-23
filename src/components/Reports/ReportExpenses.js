import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ExpensesService from "../Expenses/ExpensesService";
import { styled } from '@mui/material/styles';
import { Form } from 'react-bootstrap';

const ReportExpenses = () => {


    useEffect(() => {
        fetchShopOrderTransactionList();
    }, []);

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
        ExpensesService.fetchExpensesTransaction()
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

    const saveOrderTransaction = () => {
        console.log('orderTransaction', customerOrderDate);
        ExpensesService.fetchExpensesTransactionByDate(customerOrderDate)
            .then(response => {
                setShopOrderTransaction(response.data);
            })
            .catch(e => {
                console.log("error", e)

            });
    }



    return (
        <div>
            <Form>
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date From:</Form.Label>
                    <Form.Control type="date" name="dateFrom" onChange={onChangeInput} />
                </Form.Group>
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date To:</Form.Label>
                    <Form.Control type="date" name="dateTo" onChange={onChangeInput} />
                </Form.Group>
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                    <Form.Label>Total Expenses: </Form.Label>
                    <Form.Control type="text" value={"₱ " + shopOrderTransaction.total_expenses} />
                </Form.Group>
                <Button variant="primary" onClick={saveOrderTransaction}>
                    Find
                </Button>
            </Form >
            <Div>{"Online Orders"}
            </Div>

            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>Date</th>
                        <th>Total Expenses</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        shopOrderTransaction.data.map((shopOrderTransaction, index) => (
                            <tr  >
                                <td>{shopOrderTransaction.date}</td>
                                <td>{shopOrderTransaction.total_expenses}</td>
                                <td>
                                    <Link variant="primary" to={"/reports/reportExpensesView/" + shopOrderTransaction.date}   >
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

export default ReportExpenses
