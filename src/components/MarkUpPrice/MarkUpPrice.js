import React, { useEffect, useState } from "react";
import MarkUpPriceService from "./MarkUpPriceService.service";
import ProductService from "../Product/ProductService.service";
import MarkUpPriceList from "./MarkUpPriceList";
import AddMarkUpPrice from "./AddMarkUpPrice";
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import './MarkUpPrice.css';

const MarkUpPrice = () => {
    const [markupPriceList, setMarkupPriceList] = useState([]);
    const [products, setProducts] = useState([]);
    const productCount = new Set(
        markupPriceList.map(record => record.product_id ?? `record-${record.id}`)
    ).size;

    const fetchMarkUpPriceList = () => {
        MarkUpPriceService.indexLimit100()
            .then(response => setMarkupPriceList(response.data))
            .catch(error => console.log("error", error));
    };

    useEffect(() => {
        fetchMarkUpPriceList();
        ProductService.getAll()
            .then(response => setProducts(response.data))
            .catch(error => console.log("error", error));
    }, []);

    return (
        <div className="markup-page">
            <section className="markup-hero">
                <div className="markup-hero__icon"><TrendingUpRoundedIcon /></div>
                <div className="markup-hero__copy">
                    <span>Pricing management</span>
                    <h1>Mark Up Price</h1>
                    <p>Create wholesale and retail selling prices from supplier costs.</p>
                </div>
                <div className="markup-hero__summary">
                    <Inventory2OutlinedIcon />
                    <div><strong>{productCount}</strong><span>Grouped products · {markupPriceList.length} prices</span></div>
                </div>
            </section>
            <AddMarkUpPrice products={products} onSaved={fetchMarkUpPriceList} />
            <MarkUpPriceList markupPriceList={markupPriceList} onUpdated={fetchMarkUpPriceList} />
        </div>
    );
};

export default MarkUpPrice;
