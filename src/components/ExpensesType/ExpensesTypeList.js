import React from 'react'
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";

const ExpensesTypeList = (props) => {

    const expensesTypeList = props.expensesTypeList;
    const deleteExpensesType = props.deleteExpensesType;

    return (
        <div>
            <legend align="center" style={{ fontWeight: 'bold' }} > Expense Type   </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Expenses Name</th>
                        <th>Expenses Category</th>
                        <th>Details</th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        expensesTypeList.map((expensesType, index) => (
                            <tr key={expensesType.id} >
                                <td>{expensesType.id}</td>
                                <td>{expensesType.expenses_category_name}</td>
                                <td>{expensesType.expenses_name}</td>
                                <td>{expensesType.details}</td>
                                <td>
                                    <Link variant="primary" to={"/expensesTransactionList/" + expensesType.id}   >
                                        <Button variant="contained" >
                                            View Transaction
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Link variant="primary" to={expensesType.id}   >
                                        <Button variant="contained" disabled>
                                            Update
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Button variant="contained" onClick={(e) => deleteExpensesType(expensesType.id, e)} disabled>
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

export default ExpensesTypeList
