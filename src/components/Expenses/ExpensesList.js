import React from 'react'
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';

const ExpensesList = (props) => {

    const expensesMandatoryList = props.expensesMandatoryList;
    const expensesNonList = props.expensesNonList;

    const deleteExpenses = props.deleteExpenses;

    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: "2rem",
        padding: theme.spacing(1),
    }));

    return (
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
                                <td>
                                    <Link variant="primary" to={"/editExpenses/" + expenses.id}   >
                                        <Button variant="primary" >
                                            Update
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={(e) => deleteExpenses(expenses.id, e)} >
                                        Delete
                                    </Button>
                                </td>
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
                                <td>
                                    <Link variant="primary" to={"/editExpenses/" + expenses.id}   >
                                        <Button variant="primary" >
                                            Update
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={(e) => deleteExpenses(expenses.id, e)} >
                                        Delete
                                    </Button>
                                </td>
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
    )
}

export default ExpensesList
