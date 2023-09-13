import React, { useState, useEffect } from "react";
import SupplierServiceService from "./SupplierService.service";
import SupplierList from "./SupplierList";
import AddSupplier from "./AddSupplier";

const SupplierListV2 = () => {

    useEffect(() => {
        fetchSupplierList();
    }, []);

    const [supplierList, setSupplierList] = useState([]);

    const saveSupplierDataHandler = (supplier) => {
        setSupplierList([...supplierList, supplier]);
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

    const deleteSupplier = (id, e) => {

        const index = supplierList.findIndex(supplier => supplier.id === id);
        const newSupplier = [...supplierList];
        newSupplier.splice(index, 1);

        SupplierServiceService.delete(id)
            .then(response => {
                setSupplierList(newSupplier);
            })
            .catch(e => {
                console.log('error', e);
            });
    }



    return (
        <div>
            <SupplierList
                supplierList={supplierList}
                deleteSupplier={deleteSupplier}
            />
        </div>
    )
}

export default SupplierListV2
