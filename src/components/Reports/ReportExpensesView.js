import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import ExpensesService from "../Expenses/ExpensesService";
import { styled } from '@mui/material/styles';
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const ReportExpensesView = () => {

    useEffect(() => {
        fetchProductTransactionList();
        fetchExpensesList();
    }, []);

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const { id } = useParams();
    const [expensesList, setExpensesList] = useState({
        data: [],
        code: '',
        message: '',
        expenses: {}
    });


    const [expensesMandatoryList, setExpensesMandatoryuList] = useState({
        data: [],
        code: '',
        message: '',
    });

    const [expensesNonList, setExpensesNonList] = useState({
        data: [],
        code: '',
        message: '',
    });

    const fetchExpensesList = () => {
        ExpensesService.fetchExpensesMandatoryToday(id)
            .then(response => {
                setExpensesMandatoryuList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchProductTransactionList = async () => {
        await ExpensesService.fetchExpensesTransactionById(id)
            .then(response => {
                setExpensesList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }
    const deleteExpense = (id, e) => {
        ExpensesService.delete(id)
            .then(response => {
                fetchExpensesList();
                setValidator({
                    severity: 'success',
                    message: 'SuccessFully Deleted',
                    isShow: true,
                });
            })
            .catch(e => {
                console.log('error', e);
            });
    }



    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: "2rem",
        padding: theme.spacing(1),
    }));

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');



    return (

        <div>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>
            <div>

                <legend align="center" style={{ fontWeight: 'bold' }} > Expense  </legend>
                <legend align="center" style={{ fontWeight: 'bold' }} > <h6>{id} </h6>  </legend>
                <table class="table table-bordered">
                    <thead class="table-dark">
                        <tr class="table-secondary">
                            <th>ID</th>
                            <th>Expenses Name</th>
                            <th>Details</th>
                            <th>Amount</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            expensesMandatoryList.data.map((expenses, index) => (
                                <tr key={expenses.id} >
                                    <td>{expenses.id}</td>
                                    <td>{expenses.expenses_name}</td>
                                    <td>{expenses.details}</td>
                                    <td>{numberFormat(expenses.amount)}</td>
                                    <td>
                                        <Link variant="primary" to={"/editExpenses/" + expenses.id}   >
                                            <Button variant="primary" >
                                                Update
                                            </Button>
                                        </Link>
                                    </td>
                                    <td>
                                        <Button variant="danger" onClick={(e) => deleteExpense(expenses.id, e)} >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            )
                            )
                        }
                        <tr >
                            <td></td>
                            <td></td>
                            <td style={{ fontWeight: 'bold', }}>Total Amount: </td>
                            <td style={{ fontWeight: 'bold', }}>{numberFormat(expensesMandatoryList.total_expenses)}</td>
                        </tr>
                    </tbody>
                </table>


            </div>
        </div>
    )
}

export default ReportExpensesView
