import React, { useState, useEffect } from "react";
import ExpensesService from "./ExpensesService";
import ExpensesTypeService from "../ExpensesType/ExpensesTypeService";

import ExpensesList from "./ExpensesList";
import AddExpenses from "./AddExpenses";

const Expenses = () => {

    useEffect(() => {
        fetchExpensesList();
        fetchExpensesNonList();
        fetchExpenseTypeList();
    }, []);

    const [expensesList, setExpensesList] = useState([]);

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

    const [expensesTypeList, setExpensesTypeList] = useState([]);

    const saveExpensesTypeDataHandler = (expensesType) => {
        setExpensesList(...expensesList, expensesType);
    }


    const fetchExpensesList = () => {
        ExpensesService.fetchExpensesMandatoryToday()
            .then(response => {
                setExpensesMandatoryuList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchExpensesNonList = () => {
        ExpensesService.fetchExpensesNonMandatoryToday()
            .then(response => {
                setExpensesNonList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchExpenseTypeList = (id) => {
        ExpensesTypeService.getAll()
            .then(response => {
                setExpensesTypeList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const deleteExpenses = (id, e) => {

        const index = expensesList.findIndex(expensesType => expensesType.id === id);
        const newExpensesType = [...expensesList];
        newExpensesType.splice(index, 1);
        console.log("delete", id)
        ExpensesService.delete(id)
            .then(response => {
                setExpensesList(newExpensesType);
                fetchExpensesList();
                fetchExpensesNonList();
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
                expensesMandatoryList={expensesMandatoryList}
                expensesNonList={expensesNonList}
                deleteExpenses={deleteExpenses}
            />
        </div>
    )
}

export default Expenses
