import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import ExpensesService from "../Expenses/ExpensesService";
import { styled } from '@mui/material/styles';
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

const ReportExpensesView = () => {

    useEffect(() => {
        fetchProductTransactionList();
        fetchExpensesList();
        fetchExpensesNonList();
    }, []);


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

    const fetchExpensesNonList = () => {
        ExpensesService.fetchExpensesNonMandatoryToday(id)
            .then(response => {
                setExpensesNonList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const [productName, setProductName] = useState('');


    const fetchProductTransactionList = async () => {
        await ExpensesService.fetchExpensesTransactionById(id)
            .then(response => {
                setExpensesList(response.data);
                setProductName(response.data[0].date);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const deleteExpenses = (id, e) => {
        ExpensesService.delete(id)
            .then(response => {
                fetchProductTransactionList();
                fetchExpensesList();
                fetchExpensesNonList();
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


    return (

        <div>

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
                        </tr>
                    </thead>
                    <tbody>

                        {
                            expensesMandatoryList.data.map((expenses, index) => (
                                <tr key={expenses.id} >
                                    <td>{expenses.id}</td>
                                    <td>{expenses.expenses_name}</td>
                                    <td>{expenses.details}</td>
                                    <td>{expenses.amount}</td>
                                </tr>
                            )
                            )
                        }
                        <tr >
                            <td></td>
                            <td></td>
                            <td style={{ fontWeight: 'bold', }}>Total Amount: </td>
                            <td style={{ fontWeight: 'bold', }}>₱ {expensesMandatoryList.total_expenses}</td>
                        </tr>
                    </tbody>
                </table>


            </div>
        </div>
    )
}

export default ReportExpensesView
