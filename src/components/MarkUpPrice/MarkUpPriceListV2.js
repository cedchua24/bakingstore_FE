import React, { useEffect, useState } from "react";
import MarkUpPriceService from "./MarkUpPriceService.service";
import MarkUpPriceList from "./MarkUpPriceList";
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';
import './MarkUpPrice.css';

const MarkUpPriceListV2 = () => {
    const [markupPriceList, setMarkupPriceList] = useState([]);

    const fetchMarkUpPriceList = () => {
        MarkUpPriceService.getAll()
            .then(response => setMarkupPriceList(response.data))
            .catch(error => console.log("error", error));
    };

    useEffect(fetchMarkUpPriceList, []);

    return (
        <div className="markup-page">
            <section className="markup-hero markup-hero--list">
                <div className="markup-hero__icon"><PriceChangeOutlinedIcon /></div>
                <div className="markup-hero__copy">
                    <span>Pricing catalogue</span>
                    <h1>Mark Up Price List</h1>
                    <p>Review current wholesale and retail prices across warehouses.</p>
                </div>
                <div className="markup-hero__summary">
                    <PriceChangeOutlinedIcon />
                    <div><strong>{markupPriceList.length}</strong><span>Price records</span></div>
                </div>
            </section>
            <MarkUpPriceList markupPriceList={markupPriceList} onUpdated={fetchMarkUpPriceList} />
        </div>
    );
};

export default MarkUpPriceListV2;
