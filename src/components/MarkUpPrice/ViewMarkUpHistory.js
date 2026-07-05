import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import MarkUpPriceServiceService from "./MarkUpPriceService.service";
import "./MarkUpPrice.css";

const money = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
});

const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Intl.DateTimeFormat("en-PH", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).format(new Date(date));
};

const formatPackage = (record, isRetail = false) => {
    if (!record) return "No price recorded";

    const quantity = Math.max(Number(record.quantity) || 1, 1);
    const unitWeight = (Number(record.weight) || 0) / quantity;
    const formattedWeight = Number.isInteger(unitWeight)
        ? unitWeight
        : Number(unitWeight.toFixed(2));

    if (isRetail) return `${formattedWeight}${record.variation || ""} per piece`;

    return `${formattedWeight}${record.variation || ""} × ${quantity} ${record.packaging || ""}`.trim();
};

const PriceHistoryCard = ({ record, type }) => {
    const isRetail = type === "RETAIL";

    if (!record) {
        return (
            <div className="markup-history-price markup-history-price--empty">
                <span>{isRetail ? <StorefrontOutlinedIcon /> : <WarehouseOutlinedIcon />}</span>
                <div>
                    <strong>{isRetail ? "Retail" : "Wholesale"}</strong>
                    <small>No price recorded for this date</small>
                </div>
            </div>
        );
    }

    const supplierPrice = Number(record.price) || 0;
    const sellingPrice = Number(record.new_price) || 0;
    const profit = sellingPrice - supplierPrice;
    const markup = record.mark_up_option === "PERCENTAGE"
        ? `${record.mark_up_price}%`
        : money.format(Number(record.mark_up_price) || 0);

    return (
        <div className={`markup-history-price markup-history-price--${isRetail ? "retail" : "wholesale"}`}>
            <div className="markup-history-price__heading">
                <span>{isRetail ? <StorefrontOutlinedIcon /> : <WarehouseOutlinedIcon />}</span>
                <div>
                    <strong>{isRetail ? "Retail" : "Wholesale"}</strong>
                    <small>{formatPackage(record, isRetail)}</small>
                </div>
                <span className={`markup-type markup-type--${isRetail ? "retail" : "wholesale"}`}>
                    {record.mark_up_option === "PERCENTAGE" ? "Percentage" : "Fixed"}
                </span>
            </div>

            <div className="markup-history-price__values">
                <div>
                    <span>Supplier price</span>
                    <strong>{money.format(supplierPrice)}</strong>
                </div>
                <div>
                    <span>Markup</span>
                    <strong>{markup}</strong>
                </div>
                <div>
                    <span>Profit</span>
                    <strong className="markup-profit">+{money.format(profit)}</strong>
                </div>
                <div className="markup-history-price__selling">
                    <span>Selling price</span>
                    <strong>{money.format(sellingPrice)}</strong>
                </div>
            </div>
        </div>
    );
};

const ViewMarkUpHistory = () => {
    const { id } = useParams();
    const [markupPriceList, setMarkupPriceList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        MarkUpPriceServiceService.fetchMarkupByProductId(id)
            .then((response) => setMarkupPriceList(Array.isArray(response.data) ? response.data : []))
            .catch((error) => {
                console.log("error", error);
                setMarkupPriceList([]);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const pairedMarkupList = useMemo(() => {
        const groupedByDate = markupPriceList.reduce((groups, item) => {
            const key = formatDate(item.created_at);

            if (!groups[key]) {
                groups[key] = {
                    date: key,
                    timestamp: new Date(item.created_at).getTime() || 0,
                    retail: null,
                    wholesale: null,
                };
            }

            if (item.business_type === "RETAIL") groups[key].retail = item;
            if (item.business_type === "WHOLESALE") groups[key].wholesale = item;
            return groups;
        }, {});

        return Object.values(groupedByDate).sort((a, b) => b.timestamp - a.timestamp);
    }, [markupPriceList]);

    const productName = markupPriceList[0]?.product_name || "Product markup";
    const latestEntry = pairedMarkupList[0];

    return (
        <main className="markup-page">
            <section className="markup-hero markup-hero--history">
                <div className="markup-hero__icon"><HistoryRoundedIcon /></div>
                <div className="markup-hero__copy">
                    <span>Pricing audit trail</span>
                    <h1>Markup History</h1>
                    <p>Review every retail and wholesale price change for {productName}.</p>
                </div>
                <Link className="markup-history-back" to="/markUpPriceListV2/">
                    <ArrowBackRoundedIcon /> Back to price list
                </Link>
            </section>

            <section className="markup-history-summary">
                <div>
                    <span><Inventory2OutlinedIcon /></span>
                    <p>Product<strong>{productName}</strong></p>
                </div>
                <div>
                    <span><HistoryRoundedIcon /></span>
                    <p>History entries<strong>{pairedMarkupList.length}</strong></p>
                </div>
                <div>
                    <span><LocalOfferOutlinedIcon /></span>
                    <p>Latest update<strong>{latestEntry?.date || "No updates yet"}</strong></p>
                </div>
            </section>

            <section className="markup-list-card">
                <header className="markup-list-card__header">
                    <div>
                        <h2>Price change timeline</h2>
                        <p>Retail and wholesale prices are paired by update date.</p>
                    </div>
                    <span><HistoryRoundedIcon /> Newest first</span>
                </header>

                {loading ? (
                    <div className="markup-history-state">
                        <CircularProgress size={28} />
                        <p>Loading price history…</p>
                    </div>
                ) : pairedMarkupList.length === 0 ? (
                    <div className="markup-list-empty">
                        <HistoryRoundedIcon />
                        <h3>No markup history yet</h3>
                        <p>Price changes for this product will appear here.</p>
                    </div>
                ) : (
                    <div className="markup-history-timeline">
                        {pairedMarkupList.map((row, index) => (
                            <article className="markup-history-entry" key={`${row.date}-${index}`}>
                                <div className="markup-history-entry__date">
                                    <span>{index + 1}</span>
                                    <div>
                                        <small>{index === 0 ? "Latest update" : "Previous update"}</small>
                                        <strong>{row.date}</strong>
                                    </div>
                                </div>
                                <div className="markup-history-entry__prices">
                                    <PriceHistoryCard record={row.retail} type="RETAIL" />
                                    <PriceHistoryCard record={row.wholesale} type="WHOLESALE" />
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default ViewMarkUpHistory;
