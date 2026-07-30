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

const PriceHistoryCard = ({ record, type, paired = false }) => {
    const isRetail = type === "RETAIL";

    if (!record) {
        return <div className="markup-history-price-blank" aria-hidden="true" />;
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
                    {paired ? "Paired update" : (record.status === 1 ? "Active" : "Previous")}
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
            <div className="markup-history-price__meta">
                <span>Record #{record.id}</span>
                <strong>{formatDate(record.created_at)}</strong>
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

    const historyEvents = useMemo(() => {
        const byDate = markupPriceList.reduce((dates, record) => {
            const dateKey = String(record.created_at || "").slice(0, 10) || `record-${record.id}`;
            if (!dates.has(dateKey)) dates.set(dateKey, { wholesale: [], retail: [] });
            const type = record.business_type === "WHOLESALE" ? "wholesale" : "retail";
            dates.get(dateKey)[type].push(record);
            return dates;
        }, new Map());

        const events = [];
        byDate.forEach((records, dateKey) => {
            const availableRetail = [...records.retail];

            records.wholesale.forEach(wholesale => {
                const wholesaleTime = new Date(wholesale.created_at).getTime() || 0;
                let closestIndex = -1;
                let closestDistance = Infinity;

                availableRetail.forEach((retail, index) => {
                    const retailTime = new Date(retail.created_at).getTime() || 0;
                    const distance = Math.abs(wholesaleTime - retailTime);
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestIndex = index;
                    }
                });

                const retail = closestIndex >= 0 ? availableRetail.splice(closestIndex, 1)[0] : null;
                const retailTime = retail ? (new Date(retail.created_at).getTime() || 0) : 0;
                events.push({
                    key: `pair-${wholesale.id}-${retail?.id || "none"}`,
                    created_at: wholesaleTime >= retailTime ? wholesale.created_at : retail.created_at,
                    timestamp: Math.max(wholesaleTime, retailTime),
                    wholesale,
                    retail
                });
            });

            availableRetail.forEach(retail => {
                events.push({
                    key: `retail-${retail.id}-${dateKey}`,
                    created_at: retail.created_at,
                    timestamp: new Date(retail.created_at).getTime() || 0,
                    wholesale: null,
                    retail
                });
            });
        });

        return events.sort((a, b) =>
            b.timestamp - a.timestamp
            || Number(b.wholesale?.id || b.retail?.id || 0) - Number(a.wholesale?.id || a.retail?.id || 0)
        );
    }, [markupPriceList]);

    const productName = markupPriceList[0]?.product_name || "Product markup";
    const latestRecord = [...markupPriceList].sort((a, b) =>
        (new Date(b.created_at).getTime() || 0) - (new Date(a.created_at).getTime() || 0)
    )[0];

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
                    <p>History records<strong>{markupPriceList.length}</strong></p>
                </div>
                <div>
                    <span><LocalOfferOutlinedIcon /></span>
                    <p>Latest update<strong>{latestRecord ? formatDate(latestRecord.created_at) : "No updates yet"}</strong></p>
                </div>
            </section>

            <section className="markup-list-card">
                <header className="markup-list-card__header">
                    <div>
                        <h2>Price change timeline</h2>
                        <p>Wholesale and retail changes are tracked independently.</p>
                    </div>
                    <span><HistoryRoundedIcon /> Newest first</span>
                </header>

                {loading ? (
                    <div className="markup-history-state">
                        <CircularProgress size={28} />
                        <p>Loading price history…</p>
                    </div>
                ) : markupPriceList.length === 0 ? (
                    <div className="markup-list-empty">
                        <HistoryRoundedIcon />
                        <h3>No markup history yet</h3>
                        <p>Price changes for this product will appear here.</p>
                    </div>
                ) : (
                    <div className="markup-history-events">
                        <div className="markup-history-events__labels">
                            <span><WarehouseOutlinedIcon />Wholesale</span>
                            <span><StorefrontOutlinedIcon />Retail</span>
                        </div>
                        {historyEvents.map((event, index) => {
                            const paired = Boolean(event.wholesale && event.retail);
                            return (
                                <article className={`markup-history-event ${paired ? "is-paired" : ""}`} key={event.key}>
                                    <header>
                                        <span>{index + 1}</span>
                                        <div>
                                            <small>{paired ? "Paired price update" : "Single price update"}</small>
                                            <strong>{formatDate(event.created_at)}</strong>
                                        </div>
                                    </header>
                                    <div className="markup-history-event__prices">
                                        <PriceHistoryCard record={event.wholesale} type="WHOLESALE" paired={paired} />
                                        <PriceHistoryCard record={event.retail} type="RETAIL" paired={paired} />
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
};

export default ViewMarkUpHistory;
