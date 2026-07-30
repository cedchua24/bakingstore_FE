import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MarkUpPriceService from "./MarkUpPriceService.service";
import MarkUpPriceList from "./MarkUpPriceList";
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import './MarkUpPrice.css';

const MarkUpPriceListV2 = () => {
    const [markupPriceList, setMarkupPriceList] = useState([]);
    const [v2RequiredProductIds, setV2RequiredProductIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [profitSort, setProfitSort] = useState('');
    const [searchParams] = useSearchParams();
    const selectedProductId = searchParams.get("product_id");
    const replacementProductPrice = searchParams.get("product_price");
    const replacementPiecesPerPack = searchParams.get("pieces_per_pack");
    const productFilteredPrices = selectedProductId
        ? markupPriceList.filter(record => String(record.product_id) === selectedProductId)
        : markupPriceList;
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const visibleMarkupPrices = productFilteredPrices.filter(record =>
        !normalizedSearch || [
            record.id,
            record.product_id,
            record.product_name,
            record.business_type,
            record.packaging,
            record.variation
        ].some(value => String(value ?? '').toLowerCase().includes(normalizedSearch))
    );
    const productCount = new Set(
        visibleMarkupPrices.map(record => record.product_id ?? `record-${record.id}`)
    ).size;

    const fetchMarkUpPriceList = () => {
        const params = profitSort
            ? { sort: 'highest_profit', profit_type: profitSort }
            : {};

        MarkUpPriceService.catalog(params)
            .then(response => {
                const records = Array.isArray(response.data?.data)
                    ? response.data.data
                    : response.data;
                setMarkupPriceList(Array.isArray(records) ? records : []);
            })
            .catch(error => console.log("error", error));
    };

    const fetchV2RequiredProducts = () => {
        MarkUpPriceService.supplierPriceChanges({ include_unchanged: 1 })
            .then(response => {
                const rows = Array.isArray(response.data?.data) ? response.data.data : [];
                const requiredIds = rows
                    .filter(record =>
                        record.business_type === "WHOLESALE"
                        && (
                            record.can_change_selling_price === true
                            || Number(record.can_change_selling_price) === 1
                        )
                        && Math.abs(
                            Number(record.product_price || 0)
                            - Number(record.mark_up_product_price || 0)
                        ) > 0.00001
                    )
                    .map(record => Number(record.product_id));
                setV2RequiredProductIds([...new Set(requiredIds)]);
            })
            .catch(error => console.log("error", error));
    };

    useEffect(() => {
        fetchMarkUpPriceList();
        fetchV2RequiredProducts();
    }, [profitSort]);

    const refreshPrices = () => {
        fetchMarkUpPriceList();
        fetchV2RequiredProducts();
    };

    return (
        <div className="markup-page">
            <section className="markup-hero markup-hero--list">
                <div className="markup-hero__icon"><PriceChangeOutlinedIcon /></div>
                <div className="markup-hero__copy">
                    <span>Pricing catalogue</span>
                    <h1>Mark Up Price List</h1>
                    <p>Review current wholesale and retail prices.</p>
                </div>
                <div className="markup-hero__summary">
                    <PriceChangeOutlinedIcon />
                    <div><strong>{productCount}</strong><span>Grouped products · {visibleMarkupPrices.length} prices</span></div>
                </div>
            </section>
            <section className="markup-list-search">
                <div>
                    <strong>Search prices</strong>
                    <span>Find a product, price type, or record ID.</span>
                </div>
                <TextField
                    size="small"
                    value={searchQuery}
                    onChange={event => setSearchQuery(event.target.value)}
                    placeholder="Search mark up prices..."
                    inputProps={{ 'aria-label': 'Search mark up prices' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />
                <TextField
                    select
                    size="small"
                    value={profitSort}
                    onChange={event => setProfitSort(event.target.value)}
                    label="Sort"
                    sx={{ minWidth: 190 }}
                >
                    <MenuItem value="">Default</MenuItem>
                    <MenuItem value="amount">Highest profit amount</MenuItem>
                    <MenuItem value="margin">Highest profit margin</MenuItem>
                </TextField>
            </section>
            <MarkUpPriceList
                markupPriceList={visibleMarkupPrices}
                onUpdated={refreshPrices}
                replacementProductPrice={replacementProductPrice}
                replacementPiecesPerPack={replacementPiecesPerPack}
                v2RequiredProductIds={replacementProductPrice == null ? v2RequiredProductIds : []}
            />
        </div>
    );
};

export default MarkUpPriceListV2;
