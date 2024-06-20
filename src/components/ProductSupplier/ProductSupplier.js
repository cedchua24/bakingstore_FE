import React, { useState, useEffect } from "react";
import ProductSupplierService from "./ProductSupplierService";
import AddProductSupplier from "./AddProductSupplier";
import ProductSupplierList from "./ProductSupplierList";

const ProductSupplier = () => {

    useEffect(() => {
        fetchProductSupplierList();
    }, []);

    const [productSupplierList, setProductSupplierList] = useState([]);

    const saveProductSupplierDataHandler = (productSupplier) => {
        setProductSupplierList([...productSupplierList, productSupplier]);
    }


    const fetchProductSupplierList = () => {
        ProductSupplierService.getAll()
            .then(response => {
                setProductSupplierList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const deleteProductSupplier = (id, e) => {

        const index = productSupplierList.findIndex(productSupplier => productSupplier.id === id);
        const newSupplierProduct = [...productSupplierList];
        newSupplierProduct.splice(index, 1);

        ProductSupplierService.delete(id)
            .then(response => {
                setProductSupplierList(newSupplierProduct);
            })
            .catch(e => {
                console.log('error', e);
            });
    }



    return (
        <div>
            <AddProductSupplier
                onSaveProductSupplierData={saveProductSupplierDataHandler}
            />
            <ProductSupplierList
                productSupplierList={productSupplierList}
                deleteProductSupplier={deleteProductSupplier}
            />
        </div>
    )
}

export default ProductSupplier
