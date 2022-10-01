import React, { useState, useEffect } from "react";
import ProductServiceService from "../Product/ProductService.service";
import StockList from "./StockList";

const Stock = () => {

    useEffect(() => {
        fetchProductList();
    }, []);

    const [productList, setProductList] = useState([]);

    const saveSupplierDataHandler = (supplier) => {
        setProductList([...productList, supplier]);
    }


    const fetchProductList = () => {
        ProductServiceService.getAll()
            .then(response => {
                setProductList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }




    return (
        <div>
            {/* <AddSupplier
                onSaveSupplierData={saveSupplierDataHandler}
            /> */}
            <StockList
            // productList={productList}
            />
        </div>
    )
}

export default Stock
