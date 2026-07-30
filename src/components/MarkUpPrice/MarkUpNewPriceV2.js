import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

import MarkUpPriceService from "./MarkUpPriceService.service";
import "./MarkUpPrice.css";
import "./MarkUpNewPriceV2.css";

const money = value => new Intl.NumberFormat("en-PH", {
    style: "currency", currency: "PHP", maximumFractionDigits: 2
}).format(Number(value || 0));

const number = value => new Intl.NumberFormat("en-PH", {
    maximumFractionDigits: 2
}).format(Number(value || 0));

const date = value => value
    ? new Intl.DateTimeFormat("en-PH", { year: "numeric", month: "short", day: "numeric" }).format(new Date(value))
    : "Not set";

const comparableProductCost = row => row.business_type === "RETAIL"
    ? Number(row.product_price || 0) / Math.max(Number(row.pieces_per_pack || 1), 1)
    : Number(row.product_price || 0);

const MarkUpNewPriceV2 = () => {
    const [searchParams] = useSearchParams();
    const requestedProductId = searchParams.get("product_id") || "";
    const [rows, setRows] = useState([]);
    const [productId, setProductId] = useState(requestedProductId);
    const [includeUnchanged, setIncludeUnchanged] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [asOfDate, setAsOfDate] = useState("");

    const loadChanges = useCallback(() => {
        setLoading(true);
        setError("");
        // The API filters products using the active WHOLESALE cost while
        // retaining both wholesale and retail rows for each returned product.
        const params = { include_unchanged: includeUnchanged ? 1 : 0 };
        if (productId.trim()) params.product_id = productId.trim();

        MarkUpPriceService.supplierPriceChanges(params)
            .then(response => {
                setRows(Array.isArray(response.data?.data) ? response.data.data : []);
                setAsOfDate(response.data?.as_of_date || "");
            })
            .catch(errorResponse => {
                const validationMessage = errorResponse.response?.data?.errors?.product_id?.[0];
                setError(validationMessage || "Unable to load price changes.");
            })
            .finally(() => setLoading(false));
    }, [includeUnchanged, productId]);

    useEffect(() => {
        loadChanges();
        // Filters are submitted explicitly through the Apply button.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const products = useMemo(() => {
        const groupedProducts = Array.from(rows.reduce((groups, row) => {
        if (!groups.has(row.product_id)) {
            groups.set(row.product_id, {
                product_id: row.product_id,
                product_name: row.product_name,
                product_price: row.product_price,
                current_stock: row.current_stock,
                current_stock_pieces: row.current_stock_pieces,
                new_stock: row.new_stock,
                new_stock_pieces: row.new_stock_pieces,
                old_stock_remaining: row.old_stock_remaining,
                old_stock_remaining_pieces: row.old_stock_remaining_pieces,
                pieces_per_pack: row.pieces_per_pack,
                packaging: row.packaging,
                product_variation: row.product_variation,
                can_change_selling_price: row.can_change_selling_price,
                latest_received_order: row.latest_received_order || null,
                markups: [],
                incoming_orders: Array.isArray(row.incoming_orders) ? row.incoming_orders : []
            });
        }
        const product = groups.get(row.product_id);
        product.markups.push(row);
        product.markups.sort((a, b) => {
            const order = { WHOLESALE: 0, RETAIL: 1 };
            return (order[a.business_type] ?? 2) - (order[b.business_type] ?? 2);
        });
        if (!product.incoming_orders.length && Array.isArray(row.incoming_orders)) {
            product.incoming_orders = row.incoming_orders;
        }
            return groups;
        }, new Map()).values());

        if (includeUnchanged) return groupedProducts;

        return groupedProducts.filter(product => {
            const wholesale = product.markups.find(markup => markup.business_type === "WHOLESALE");
            return wholesale
                && Math.abs(Number(product.product_price || 0) - Number(wholesale.mark_up_product_price || 0)) > 0.00001;
        });
    }, [includeUnchanged, rows]);

    const summary = useMemo(() => products.reduce((result, product) => {
        result.incomingPieces += product.incoming_orders.reduce(
            (total, order) => total + Number(order.incoming_stock_pieces || 0), 0
        );
        if (product.can_change_selling_price) result.ready += 1;
        return result;
    }, { ready: 0, incomingPieces: 0 }), [products]);

    const submitFilter = event => {
        event.preventDefault();
        loadChanges();
    };

    return (
        <div className="markup-page markup-v2">
            <section className="markup-hero markup-v2__hero">
                <div className="markup-hero__icon"><PriceChangeOutlinedIcon /></div>
                <div className="markup-hero__copy">
                    <span>Cost and selling-price review</span>
                    <h1>Supplier Price Changes</h1>
                    <p>Find saved markup costs that no longer match the product cost and review incoming supplier orders.</p>
                </div>
                <div className="markup-hero__summary">
                    <TrendingUpRoundedIcon />
                    <div><strong>{products.length}</strong><span>Products needing review</span></div>
                </div>
            </section>

            <section className="markup-v2__summary">
                <article><PriceChangeOutlinedIcon /><div><span>Products to review</span><strong>{products.length}</strong></div></article>
                <article><Inventory2OutlinedIcon /><div><span>Incoming pieces</span><strong>{number(summary.incomingPieces)}</strong></div></article>
                <article><StorefrontOutlinedIcon /><div><span>Ready to update</span><strong>{summary.ready} of {products.length}</strong></div></article>
                <article><EventOutlinedIcon /><div><span>As of</span><strong>{date(asOfDate)}</strong></div></article>
            </section>

            <form className="markup-v2__filters" onSubmit={submitFilter}>
                <div><strong>Filter price changes</strong><span>Enter a product ID or include matching costs.</span></div>
                <TextField size="small" type="number" label="Product ID" value={productId}
                    inputProps={{ min: 1 }} onChange={event => setProductId(event.target.value)} />
                <FormControlLabel
                    control={<Checkbox checked={includeUnchanged} onChange={event => setIncludeUnchanged(event.target.checked)} />}
                    label="Include unchanged"
                />
                <Button type="submit" variant="contained" disabled={loading} startIcon={<RefreshRoundedIcon />}>Apply</Button>
            </form>

            {error && <Alert severity="error" className="markup-v2__alert">{error}</Alert>}

            <section className="markup-list-card">
                <div className="markup-list-card__header">
                    <div><h2>Products with cost changes</h2><p>Product pack cost compared with the active wholesale markup cost.</p></div>
                    <span><PriceChangeOutlinedIcon />Grouped by product</span>
                </div>

                {loading ? (
                    <div className="markup-v2__state"><CircularProgress size={30} /><p>Loading price changes...</p></div>
                ) : products.length === 0 ? (
                    <div className="markup-list-empty"><Inventory2OutlinedIcon /><h3>No price changes found</h3><p>All active markup costs match their product costs.</p></div>
                ) : (
                    <div className="markup-v2__cards">
                        {products.map(product => {
                            const primaryMarkup = product.markups.find(markup => markup.business_type === "WHOLESALE")
                                || product.markups[0];
                            const oldPrice = Number(primaryMarkup?.mark_up_product_price || 0);
                            const newPrice = comparableProductCost(primaryMarkup || product);
                            const primaryDifference = newPrice - oldPrice;
                            const primaryPercentage = oldPrice ? primaryDifference / oldPrice * 100 : null;

                            return (
                            <article className="markup-v2__card" key={product.product_id}>
                                <header>
                                    <div className="markup-list-product">
                                        <span>{product.product_name?.charAt(0)?.toUpperCase() || "?"}</span>
                                        <div>
                                            <strong>{product.product_name}</strong>
                                            <small>Product #{product.product_id} · {product.packaging || "Packaging not set"} · {product.pieces_per_pack || 0} pcs per {String(product.packaging || "pack").toLowerCase()}</small>
                                        </div>
                                    </div>
                                    <span className={`markup-v2__status ${product.can_change_selling_price ? "is-ready" : "is-waiting"}`}>
                                        {product.can_change_selling_price ? "Old stock consumed — ready" : "Keep current selling price"}
                                    </span>
                                </header>

                                <div className="markup-v2__primary-change">
                                    <div className="markup-v2__primary-price is-old">
                                        <span>Old price</span>
                                        <strong>{money(oldPrice)}</strong>
                                        <small>Saved wholesale cost</small>
                                    </div>
                                    <div className="markup-v2__primary-arrow" aria-hidden="true">→</div>
                                    <div className="markup-v2__primary-price is-new">
                                        <span>New price</span>
                                        <strong>{money(newPrice)}</strong>
                                        <small>Current product cost</small>
                                    </div>
                                    <div className={`markup-v2__primary-difference ${primaryDifference >= 0 ? "is-up" : "is-down"}`}>
                                        <span>Price change</span>
                                        <strong>{primaryDifference >= 0 ? "+" : ""}{money(primaryDifference)}</strong>
                                        <small>{primaryPercentage == null ? "No percentage" : `${primaryPercentage >= 0 ? "+" : ""}${number(primaryPercentage)}%`}</small>
                                    </div>
                                    <div className="markup-v2__primary-stock">
                                        <span>Old stock remaining</span>
                                        <strong>{number(product.old_stock_remaining)} {product.packaging || "packs"}</strong>
                                        <small>{number(product.old_stock_remaining_pieces)} {Number(product.old_stock_remaining_pieces) === 1 ? "pc" : "pcs"}</small>
                                    </div>
                                </div>

                                <div className="markup-v2__fifo">
                                    <div className="markup-v2__fifo-heading">
                                        <strong>FIFO stock calculation</strong>
                                        <span>Current stock minus the latest received stock equals old stock remaining.</span>
                                    </div>
                                    <div>
                                        <span>Current total stock</span>
                                        <strong>{number(product.current_stock)} {product.packaging || "packs"}</strong>
                                        <small>{number(product.current_stock_pieces)} {Number(product.current_stock_pieces) === 1 ? "pc" : "pcs"}</small>
                                    </div>
                                    <div className="markup-v2__fifo-symbol">−</div>
                                    <div>
                                        <span>Latest received stock</span>
                                        <strong>{number(product.new_stock)} {product.packaging || "packs"}</strong>
                                        <small>{number(product.new_stock_pieces)} {Number(product.new_stock_pieces) === 1 ? "pc" : "pcs"}</small>
                                    </div>
                                    <div className="markup-v2__fifo-symbol">=</div>
                                    <div className={product.can_change_selling_price ? "is-zero" : ""}>
                                        <span>Old stock remaining</span>
                                        <strong>{number(product.old_stock_remaining)} {product.packaging || "packs"}</strong>
                                        <small>{number(product.old_stock_remaining_pieces)} {Number(product.old_stock_remaining_pieces) === 1 ? "pc" : "pcs"}</small>
                                    </div>
                                    <div className="markup-v2__fifo-order">
                                        <span>Latest received order</span>
                                        {product.latest_received_order ? (
                                            <>
                                                <strong>PO #{product.latest_received_order.order_supplier_transaction_id}</strong>
                                                <small>{date(product.latest_received_order.order_date)} · {money(product.latest_received_order.price)}</small>
                                            </>
                                        ) : (
                                            <strong>None recorded</strong>
                                        )}
                                    </div>
                                </div>

                                <div className="markup-v2__markups">
                                    <div className="markup-v2__markups-title">
                                        <div><strong>Selling-price details</strong><span>Wholesale and retail breakdown.</span></div>
                                        <Link to={`/viewMarkUpHistory/${product.product_id}`}>View history</Link>
                                    </div>
                                    {product.markups.map(markup => {
                                        const currentCost = comparableProductCost(markup);
                                        const savedCost = Number(markup.mark_up_product_price || 0);
                                        const difference = currentCost - savedCost;
                                        const percentage = savedCost ? difference / savedCost * 100 : null;
                                        return (
                                            <div className="markup-v2__markup-row markup-v2__markup-row--detailed" key={markup.mark_up_product_id}>
                                                <span className={`markup-type markup-type--${String(markup.business_type || "wholesale").toLowerCase()}`}>{markup.business_type}</span>
                                                <div><span>Current product cost / {markup.business_type === "RETAIL" ? "piece" : "pack"}</span><strong>{money(currentCost)}</strong></div>
                                                <div><span>Saved markup cost</span><strong>{money(savedCost)}</strong></div>
                                                <div className={difference >= 0 ? "markup-v2__difference is-up" : "markup-v2__difference is-down"}>
                                                    <span>Cost difference</span><strong>{difference >= 0 ? "+" : ""}{money(difference)}</strong>
                                                    <small>{percentage == null ? "No percentage" : `${percentage >= 0 ? "+" : ""}${number(percentage)}%`}</small>
                                                </div>
                                                <div><span>Current selling price</span><strong className="markup-selling-price">{money(markup.new_price)}</strong></div>
                                                <Link
                                                    className={product.can_change_selling_price ? "markup-v2__edit" : "markup-v2__edit is-disabled"}
                                                    to={product.can_change_selling_price
                                                        ? `/markUpPriceListV2?product_id=${product.product_id}&product_price=${product.product_price}&pieces_per_pack=${product.pieces_per_pack}`
                                                        : "#"}
                                                    onClick={event => { if (!product.can_change_selling_price) event.preventDefault(); }}
                                                    aria-disabled={!product.can_change_selling_price}
                                                ><EditOutlinedIcon /> Edit</Link>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="markup-v2__incoming">
                                    <div className="markup-v2__markups-title">
                                        <div><strong>Pending supplier orders</strong><span>Upcoming stock and supplier cost; this is separate from the saved markup mismatch above.</span></div>
                                        <LocalShippingOutlinedIcon />
                                    </div>
                                    {product.incoming_orders.length ? product.incoming_orders.map(order => (
                                        <div className="markup-v2__order-row" key={order.order_supplier_id}>
                                            <div><span>Supplier</span><strong>{order.supplier_name || "Not set"}</strong></div>
                                            <div><span>Purchase order</span><strong>PO #{order.order_supplier_transaction_id}</strong><small>{order.order_status}</small></div>
                                            <div><span>Upcoming cost / pack</span><strong>{money(order.upcoming_price_per_pack)}</strong><small>{money(order.upcoming_price)} per {String(order.upcoming_variation || "unit").toLowerCase()}</small></div>
                                            <div>
                                                <span>Incoming stock</span>
                                                <strong>{number(order.incoming_stock)} {product.packaging || "packs"}</strong>
                                                <small>{number(order.incoming_stock_pieces)} {Number(order.incoming_stock_pieces) === 1 ? "pc" : "pcs"}</small>
                                            </div>
                                            <div><span>Dates</span><strong>Ordered {date(order.order_date)}</strong><small>Sent {date(order.send_date)}</small></div>
                                        </div>
                                    )) : (
                                        <p className="markup-v2__no-markup">No pending supplier order for this product.</p>
                                    )}
                                </div>
                            </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default MarkUpNewPriceV2;
