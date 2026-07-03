import React, { useEffect, useState } from "react";
import AddVipProduct from "./AddVipProduct";
import VipProductList from "./VipProductList";
import VipProductTransactionService from "./VipProductTransactionService";

const VipProduct = () => {
    const [transactions, setTransactions] = useState([]);

    const fetchTransactions = () => {
        VipProductTransactionService.getAll()
            .then((response) => setTransactions(response.data))
            .catch((error) => console.log("Unable to fetch VIP Products", error));
    };

    useEffect(fetchTransactions, []);

    const deleteTransaction = (id) => {
        VipProductTransactionService.delete(id)
            .then(() => setTransactions(transactions.filter((item) => item.id !== id)))
            .catch((error) => console.log("Unable to delete VIP Product", error));
    };

    return (
        <div>
            <AddVipProduct onSaved={fetchTransactions} />
            <VipProductList transactions={transactions} onDelete={deleteTransaction} />
        </div>
    );
};

export default VipProduct;
