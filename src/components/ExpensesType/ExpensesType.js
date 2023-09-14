import React, { useState, useEffect } from "react";
import ExpensesTypeService from "./ExpensesTypeService";
import ExpensesCategoryService from "./ExpensesCategoryService";

import ExpensesTypeList from "./ExpensesTypeList";
import AddExpensesType from "./AddExpensesType";

const ExpensesType = () => {

    useEffect(() => {
        fetchExpensesTypeList();
        fetchCategoryList();
    }, []);

    const [expensesTypeList, setExpensesTypeList] = useState([]);
    const [expensesCategory, setExpensesCategory] = useState([]);

    const saveExpensesTypeDataHandler = (expensesType) => {
        setExpensesTypeList([...expensesTypeList, expensesType]);
    }


    const fetchExpensesTypeList = () => {
        ExpensesTypeService.getAll()
            .then(response => {
                setExpensesTypeList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchCategoryList = (id) => {
        ExpensesCategoryService.getAll()
            .then(response => {
                setExpensesCategory(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const deleteExpensesType = (id, e) => {

        const index = expensesTypeList.findIndex(expensesType => expensesType.id === id);
        const newExpensesType = [...expensesTypeList];
        newExpensesType.splice(index, 1);

        ExpensesTypeService.delete(id)
            .then(response => {
                setExpensesTypeList(newExpensesType);
            })
            .catch(e => {
                console.log('error', e);
            });
    }



    return (
        <div>

            <AddExpensesType
                onSaveExpensesTypeData={saveExpensesTypeDataHandler}
                expensesCategory={expensesCategory}
            />

            <ExpensesTypeList
                expensesTypeList={expensesTypeList}
                deleteExpensesType={deleteExpensesType}
            />
        </div>
    )
}

export default ExpensesType
