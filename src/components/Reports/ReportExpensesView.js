import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import ExpensesService from "../Expenses/ExpensesService";
import { styled } from '@mui/material/styles';

const ReportExpensesView = () => {

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
    useEffect(() => {
        fetchProductTransactionList();
        fetchExpensesList();
        fetchExpensesNonList();
    }, []);

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

    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: "2rem",
        padding: theme.spacing(1),
    }));


    return (

        <div>
            <Div>{id}</Div>
            <div>
                <Div>{"Mandatory"}
                </Div>
                <table class="table table-bordered">
                    <thead class="table-dark">
                        <tr class="table-secondary">
                            <th>ID</th>
                            <th>Expenses Name</th>
                            <th>Amount</th>
                            <th>Details</th>
                            <th>Date</th>
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
                                    <td>{expenses.amount}</td>
                                    <td>{expenses.details}</td>
                                    <td>{expenses.date}</td>
                                </tr>
                            )
                            )
                        }
                        <tr >
                            <td></td>
                            <td style={{ fontWeight: 'bold', }}>Total Amount: </td>
                            <td style={{ fontWeight: 'bold', }}>₱ {expensesMandatoryList.total_expenses}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <Div>{"Non Mandatory"}
                </Div>
                <table class="table table-bordered">
                    <thead class="table-dark">
                        <tr class="table-secondary">
                            <th>ID</th>
                            <th>Expenses Name</th>
                            <th>Amount</th>
                            <th>Details</th>
                            <th>Date</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            expensesNonList.data.map((expenses, index) => (
                                <tr key={expenses.id} >
                                    <td>{expenses.id}</td>
                                    <td>{expenses.expenses_name}</td>
                                    <td>{expenses.amount}</td>
                                    <td>{expenses.details}</td>
                                    <td>{expenses.date}</td>
                                </tr>
                            )
                            )
                        }
                        <tr >
                            <td></td>
                            <td style={{ fontWeight: 'bold', }}>Total Amount: </td>
                            <td style={{ fontWeight: 'bold', }}>₱ {expensesNonList.total_expenses}</td>
                            <td></td>
                        </tr>
                        <tr >
                            <td></td>
                            <td style={{ fontWeight: 'bold', }}></td>
                            <td style={{ fontWeight: 'bold', }}></td>
                            <td></td>
                        </tr>

                        <tr >
                            <td></td>
                            <td style={{ fontWeight: 'bold', }}>Grand Total: </td>
                            <td style={{ fontWeight: 'bold', }}>₱ {expensesNonList.total_expenses + expensesMandatoryList.total_expenses}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ReportExpensesView
