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
    const [productName, setProductName] = useState('');
    useEffect(() => {
        fetchProductTransactionList();
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
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Expenses Name</th>
                        <th>Amount</th>
                        <th>Expenses Category</th>
                        <th>Details</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        expensesList.data.map((expenses, index) => (
                            <tr key={expenses.id} >
                                <td>{expenses.id}</td>
                                <td>{expenses.expenses_name}</td>
                                <td>{expenses.amount}</td>
                                <td>{expenses.expenses_category_name}</td>
                                <td>{expenses.details}</td>
                                {/* <td>
                                    <Link variant="primary" to={expenses.id}   >
                                        <Button variant="primary" >
                                            Update
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={(e) => deleteExpenses(expenses.id, e)} >
                                        Delete
                                    </Button>
                                </td> */}
                            </tr>
                        )
                        )
                    }
                    <tr  >
                        <td></td>
                        <td>Total Expenses: </td>
                        <td>₱ {expensesList.expenses.total_expenses}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default ReportExpensesView
