import React from 'react'
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

const ExpensesList = (props) => {

    const expensesList = props.expensesList;
    const deleteExpenses = props.deleteExpenses;

    return (
        <div>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Expenses Name</th>
                        <th>Expenses Category</th>
                        <th>Amount</th>
                        <th>Details</th>
                        <th>Date</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        expensesList.map((expenses, index) => (
                            <tr key={expenses.id} >
                                <td>{expenses.id}</td>
                                <td>{expenses.expenses_name}</td>
                                <td>{expenses.expenses_category_name}</td>
                                <td>{expenses.amount}</td>
                                <td>{expenses.details}</td>
                                <td>{expenses.date}</td>
                                <td>
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
                                </td>
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ExpensesList
