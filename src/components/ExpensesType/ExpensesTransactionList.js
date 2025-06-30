import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import ExpensesTypeService from "./ExpensesTypeService";

const ExpensesTransactionList = () => {

    const { id } = useParams();

    useEffect(() => {
        fetchExpenseTypeTransaction(id);
    }, []);

    const [expenseTransaction, setExpenseTransaction] = useState({
        data: [],
        payment: [],
        name: '',
        code: '',
        message: '',
        total_amount: 0
    });

    const fetchExpenseTypeTransaction = (id) => {
        ExpensesTypeService.fetchExpenseTypeTransaction(id)
            .then(response => {
                setExpenseTransaction(response.data);
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

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');


    return (
        <div>
            <legend align="center" style={{ fontWeight: 'bold' }} > {expenseTransaction.name}  </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Amount</th>
                        <th>Details</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        expenseTransaction.data.map((expenses, index) => (
                            <tr key={expenses.id} >
                                <td>{expenses.id}</td>
                                <td>{expenses.amount}</td>
                                <td>{expenses.details}</td>
                                <td>{expenses.date}</td>

                            </tr>
                        )
                        )
                    }
                    <tr >

                        <td style={{ fontWeight: 'bold', }}>Total Amount: </td>
                        <td style={{ fontWeight: 'bold', }}> {numberFormat(expenseTransaction.total_amount)}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default ExpensesTransactionList
