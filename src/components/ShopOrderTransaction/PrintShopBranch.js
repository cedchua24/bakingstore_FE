import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import ShopOrderService from "../OtherService/ShopOrderService";
import ShopService from "../Shop/ShopService";
import "./PrintShopBranch.css";

const ITEMS_PER_PAGE = 15;

const firstValue = (...values) => values.find((value) => value !== undefined && value !== null && String(value).trim() !== "") || "";

const money = (value) => new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
}).format(Number(value || 0));

const formatDate = (value) => {
    if (!value) return "-";
    const parsed = new Date(String(value).replace(" ", "T"));
    return Number.isNaN(parsed.getTime())
        ? value
        : parsed.toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });
};

const PrintShopBranch = () => {
    const { id } = useParams();
    const [transaction, setTransaction] = useState({});
    const [items, setItems] = useState([]);
    const [activeShop, setActiveShop] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [printError, setPrintError] = useState("");
    const [printing, setPrinting] = useState(false);

    useEffect(() => {
        let active = true;
        Promise.all([
            ShopOrderTransactionService.fetchShopOrderTransaction(id),
            ShopOrderService.fetchShopOrderDTO(id),
            ShopService.fetchShopActive("active"),
        ])
            .then(([transactionResponse, orderResponse, shopResponse]) => {
                if (!active) return;
                const orderData = orderResponse.data || {};
                const transactionData = transactionResponse.data || orderData.shopOrderTransaction || {};
                const shopPayload = shopResponse.data?.data || shopResponse.data || {};
                setTransaction(transactionData);
                setItems(Array.isArray(orderData.shopOrderList) ? orderData.shopOrderList : []);
                setActiveShop(Array.isArray(shopPayload) ? (shopPayload[0] || {}) : shopPayload);
            })
            .catch(() => { if (active) setError("The inter-branch order could not be loaded."); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [id]);

    const handlePrint = useCallback(async () => {
        setPrinting(true);
        setPrintError("");

        try {
            const response = await ShopOrderTransactionService.incrementPrintCount(id);
            setTransaction((current) => ({
                ...current,
                print_count: response.data?.print_count ?? current.print_count,
            }));
            document.body.classList.add("tracked-print-authorized");
            window.print();
        } catch (requestError) {
            setPrintError(requestError.response?.data?.message || "The print count could not be updated. Please try again.");
        } finally {
            document.body.classList.remove("tracked-print-authorized");
            setPrinting(false);
        }
    }, [id]);

    useEffect(() => {
        const handlePrintShortcut = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "p") {
                event.preventDefault();
                handlePrint();
            }
        };

        window.addEventListener("keydown", handlePrintShortcut);
        return () => {
            window.removeEventListener("keydown", handlePrintShortcut);
            document.body.classList.remove("tracked-print-authorized");
        };
    }, [handlePrint]);

    const pages = items.length
        ? Array.from({ length: Math.ceil(items.length / ITEMS_PER_PAGE) }, (_, pageIndex) =>
            items.slice(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE))
        : [[]];
    const totalQuantity = Number(transaction.shop_order_transaction_total_quantity || 0)
        || items.reduce((sum, item) => sum + Number(item.shop_order_quantity || 0), 0);
    const totalAmount = Number(transaction.shop_order_transaction_total_price || 0)
        || items.reduce((sum, item) => sum + Number(item.shop_order_total_price || 0), 0);
    const issuingBranch = firstValue(activeShop.shop_name, "MDR Consumer Goods Trading");
    const requestingBranch = firstValue(transaction.shop_name, "-");

    if (loading) return <div className="branch-order-state"><CircularProgress /> Preparing inter-branch order...</div>;
    if (error) return <div className="branch-order-state"><Alert severity="error">{error}</Alert></div>;

    return (
        <main className="branch-order-page">
            {pages.map((pageItems, pageIndex) => {
                const isFirstPage = pageIndex === 0;
                const isLastPage = pageIndex === pages.length - 1;
                const itemOffset = pageIndex * ITEMS_PER_PAGE;

                return (
                    <article className="branch-order-sheet" key={`branch-order-page-${pageIndex}`}>
                        {isFirstPage ? <>
                            <header className="branch-order-header">
                                <div className="branch-order-brand">
                                    <img src="/mdr_nav_logo.png" alt="MDR" />
                                    <div>
                                        <strong>{issuingBranch}</strong>
                                        {activeShop.address && <span>{activeShop.address}</span>}
                                        {activeShop.contact_number && <span>Contact: {activeShop.contact_number}</span>}
                                    </div>
                                </div>
                                <div className="branch-order-title">
                                    <p>Inter-Branch Order</p>
                                    <strong>IBO-{String(transaction.id || id).padStart(6, "0")}</strong>
                                    <span>{formatDate(transaction.created_at)}</span>
                                </div>
                            </header>

                            <section className="branch-order-summary">
                                <div className="branch-order-route">
                                    <div><span>From · Issuing branch</span><strong>{issuingBranch}</strong></div>
                                    <b aria-hidden="true">→</b>
                                    <div><span>To · Requesting branch</span><strong>{requestingBranch}</strong></div>
                                </div>
                                <div className="branch-order-details">
                                    <div><span>Requested by</span><strong>{firstValue(transaction.requestor_name, "-")}</strong></div>
                                    <div><span>Request date</span><strong>{formatDate(transaction.created_at)}</strong></div>
                                    <div><span>Reference</span><strong>#{transaction.id || id}</strong></div>
                                    <div><span>Total quantity</span><strong>{totalQuantity}</strong></div>
                                </div>
                            </section>
                        </> : (
                            <header className="branch-order-continuation">
                                <strong>Inter-Branch Order — Items Continued</strong>
                                <span>IBO-{String(transaction.id || id).padStart(6, "0")}</span>
                            </header>
                        )}

                        <section className="branch-order-items">
                            <table>
                                <thead><tr><th>#</th><th>Product description</th><th>Unit</th><th>Qty</th><th>Unit price</th><th>Amount</th></tr></thead>
                                <tbody>
                                    {pageItems.map((item, index) => {
                                        const unitWeight = Number(item.quantity) ? Number(item.weight) / Number(item.quantity) : 0;
                                        return (
                                            <tr key={item.id || `${item.product_id}-${itemOffset + index}`}>
                                                <td>{itemOffset + index + 1}</td>
                                                <td>
                                                    <strong>{item.product_name || "Unnamed item"}</strong>
                                                    {item.business_type !== "WHOLESALE" && unitWeight > 0 && <small>{Number(unitWeight.toPrecision(3))}{item.variation || ""}</small>}
                                                </td>
                                                <td>{firstValue(item.unit, item.packaging, "-")}</td>
                                                <td>{item.shop_order_quantity || 0}</td>
                                                <td>{money(item.shop_order_price)}</td>
                                                <td>{money(item.shop_order_total_price)}</td>
                                            </tr>
                                        );
                                    })}
                                    {!items.length && <tr><td className="branch-order-empty" colSpan="6">No products found.</td></tr>}
                                </tbody>
                            </table>
                            {isLastPage && (
                                <div className="branch-order-totals">
                                    <span>Total items <strong>{items.length}</strong></span>
                                    <span>Total quantity <strong>{totalQuantity}</strong></span>
                                    <span>Grand total <strong>{money(totalAmount)}</strong></span>
                                </div>
                            )}
                        </section>

                        {isLastPage && <>
                            <section className="branch-order-notes">
                                <strong>Special instructions / discrepancies</strong>
                                <div />
                                <div />
                            </section>
                            <section className="branch-order-signatures">
                                <div><strong>{firstValue(transaction.requestor_name)}</strong><span>Requested by</span><small>Requesting branch</small></div>
                                <div><strong>{firstValue(transaction.sr_name)}</strong><span>Released by</span><small>Issuing branch</small></div>
                                <div><strong>&nbsp;</strong><span>Transported by</span><small>Driver name and signature</small></div>
                                <div><strong>&nbsp;</strong><span>Received by</span><small>Name, signature, and date</small></div>
                            </section>
                            <footer className="branch-order-footer">Please verify product descriptions and quantities before signing. Report discrepancies immediately.</footer>
                        </>}

                        <div className="branch-order-page-number">Page {pageIndex + 1} of {pages.length}</div>
                    </article>
                );
            })}

            <div className="branch-order-actions hide-on-print">
                {printError && <Alert severity="error" sx={{ mb: 2 }}>{printError}</Alert>}
                <Button variant="contained" size="large" onClick={handlePrint} disabled={printing}>
                    {printing ? "Preparing print..." : "Print inter-branch order"}
                </Button>
            </div>
        </main>
    );
};

export default PrintShopBranch;
