import React, { useState, useEffect } from "react";

import AddOrderSupplierTransaction from "./AddOrderSupplierTransaction";
import SupplierServiceService from "../Supplier/SupplierService.service";
import "./OrderSupplierTransaction.css";

const OrderSupplierTransaction = () => {
    useEffect(() => {
        fetchSupplierList();
    }, []);

    const [supplierList, setSupplierList] = useState([]);
    const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true);
    const [supplierError, setSupplierError] = useState("");

    const fetchSupplierList = () => {
        setIsLoadingSuppliers(true);
        setSupplierError("");

        SupplierServiceService.getAll()
            .then(response => {
                setSupplierList(response.data);
            })
            .catch(e => {
                console.log("error", e);
                setSupplierError("We couldn't load the supplier list. Please refresh and try again.");
            })
            .finally(() => {
                setIsLoadingSuppliers(false);
            });
    };

    return (
        <main className="purchase-order-page">
            <AddOrderSupplierTransaction
                supplierList={supplierList}
                isLoadingSuppliers={isLoadingSuppliers}
                supplierError={supplierError}
                onRetrySuppliers={fetchSupplierList}
            />
        </main>
    );
};

export default OrderSupplierTransaction;
