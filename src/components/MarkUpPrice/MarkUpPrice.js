import React, { useState, useEffect } from "react";
import MarkUpPriceServiceService from "./MarkUpPriceService.service";
import ProductServiceService from "../Product/ProductService.service";
import MarkUpPriceList from "./MarkUpPriceList";
import AddMarkUpPrice from "./AddMarkUpPrice";

const MarkUpPrice = () => {

    useEffect(() => {
        fetchMarkUpPriceList();
        fetchProductList();
    }, []);

    const [markupPriceList, setMarkupPriceList] = useState([]);

    const [products, setProducts] = useState([]);

    const saveMarkUpPriceDataHandler = (markupPrice) => {
        // this.fetchMarkUpPriceList();
        setMarkupPriceList([...markupPriceList, markupPrice]);
    }


    const fetchMarkUpPriceList = () => {
        MarkUpPriceServiceService.getAll()
            .then(response => {
                setMarkupPriceList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchProductList = () => {
        ProductServiceService.getAll()
            .then(response => {
                setProducts(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const deleteMarkUpPrice = (id, e) => {

        const index = setMarkupPriceList.findIndex(markUpPrice => markUpPrice.id === id);
        const newMarkUpPrice = [...markupPriceList];
        newMarkUpPrice.splice(index, 1);

        MarkUpPriceServiceService.delete(id)
            .then(response => {
                setMarkupPriceList(newMarkUpPrice);
            })
            .catch(e => {
                console.log('error', e);
            });
    }



    return (
        <div>
            <AddMarkUpPrice
                onSaveMarkUpPriceData={saveMarkUpPriceDataHandler}
                products={products}
            />
            <MarkUpPriceList
                markupPriceList={markupPriceList}
                deleteMarkUpPrice={deleteMarkUpPrice}
            />
        </div>
    )
}

export default MarkUpPrice
