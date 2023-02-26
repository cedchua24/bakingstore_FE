import React, { useState, useEffect } from "react";

import OrderSupplierTransactionService from "./OrderSupplierTransaction.service";
import AddOrderSupplierTransaction from "./AddOrderSupplierTransaction";
import SupplierServiceService from "../Supplier/SupplierService.service";

const OrderSupplierTransaction = () => {

    useEffect(() => {
        fetchOrderTransactionList();
        fetchSupplierList();
    }, []);

    const [orderTransactionList, setOrderTransactionList] = useState([]);
    const [supplierList, setSupplierList] = useState([]);

    const saveOrderTransactionDataHandler = (orderTransaction) => {
        setOrderTransactionList([...orderTransactionList, orderTransaction]);
    }


    const fetchOrderTransactionList = () => {
        OrderSupplierTransactionService.getAll()
            .then(response => {
                setOrderTransactionList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchSupplierList = () => {
        SupplierServiceService.getAll()
            .then(response => {
                setSupplierList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    return (
        <div>
            <AddOrderSupplierTransaction
                onSaveOrderTransactionData={saveOrderTransactionDataHandler}
                supplierList={supplierList}
            />
        </div>
    )
}

export default OrderSupplierTransaction
