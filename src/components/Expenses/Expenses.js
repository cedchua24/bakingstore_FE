import React, { useState, useEffect } from "react";
import ExpensesService from "./ExpensesService";
import ExpensesTypeService from "../ExpensesType/ExpensesTypeService";

import ExpensesList from "./ExpensesList";
import AddExpenses from "./AddExpenses";

const Expenses = () => {

    useEffect(() => {
        fetchExpensesList();
        fetchCategoryList();
    }, []);

    const [expensesList, setExpensesList] = useState([]);
    const [expensesTypeList, setExpensesTypeList] = useState([]);

    const saveExpensesTypeDataHandler = (expensesType) => {
        setExpensesList([...expensesList, expensesType]);
    }


    const fetchExpensesList = () => {
        ExpensesService.getAll()
            .then(response => {
                setExpensesList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchCategoryList = (id) => {
        ExpensesTypeService.getAll()
            .then(response => {
                setExpensesTypeList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const deleteExpensesType = (id, e) => {

        const index = expensesList.findIndex(expensesType => expensesType.id === id);
        const newExpensesType = [...expensesList];
        newExpensesType.splice(index, 1);

        ExpensesService.delete(id)
            .then(response => {
                setExpensesList(newExpensesType);
            })
            .catch(e => {
                console.log('error', e);
            });
    }



    return (
        <div>

            <AddExpenses
                onSaveExpensesTypeData={saveExpensesTypeDataHandler}
                expensesTypeList={expensesTypeList}
            />

            <ExpensesList
                expensesList={expensesList}
                deleteExpensesType={deleteExpensesType}
            />
        </div>
    )
}

export default Expenses
