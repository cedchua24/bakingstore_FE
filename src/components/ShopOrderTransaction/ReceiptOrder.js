import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import ShopOrderService from "../OtherService/ShopOrderService";
import "./ReceiptOrder.css";

// Larger customer-readable type needs fewer rows per thermal page.
const ITEMS_PER_PAGE = 6;

const money = (value) => new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
}).format(Number(value || 0));

const compactDate = (value) => {
    if (!value) return "-";
    const parsed = new Date(String(value).replace(" ", "T"));
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString("en-PH", {
        year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
    });
};

const itemDescription = (row) => {
    const discount = row.discount === "PERCENTAGE"
        ? `Disc ${row.discount_percentage}% - ${row.discount_amount}`
        : row.discount === "AMOUNT" ? `Disc - ${row.discount_amount}` : "";
    const unitWeight = Number(row.quantity) ? Number(row.weight) / Number(row.quantity) : 0;
    const weight = unitWeight
        ? `${Number.isInteger(unitWeight) ? unitWeight : Number(unitWeight.toPrecision(2))}${row.variation || ""}`
        : "";
    const packaging = row.business_type === "WHOLESALE"
        ? [row.packaging, weight && `${weight} x ${row.quantity}`].filter(Boolean).join(" · ")
        : weight;
    return { discount, packaging };
};

const ReceiptOrder = () => {
    const { id } = useParams();
    const [transaction, setTransaction] = useState({});
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [printError, setPrintError] = useState("");
    const [printing, setPrinting] = useState(false);
    const [activePrintNumber, setActivePrintNumber] = useState(null);

    useEffect(() => {
        let active = true;
        Promise.all([
            ShopOrderTransactionService.fetchShopOrderTransaction(id),
            ShopOrderService.fetchShopOrderDTO(id),
        ])
            .then(([transactionResponse, orderResponse]) => {
                if (!active) return;
                const orderData = orderResponse.data || {};
                const orderTransaction = orderData.shopOrderTransaction || {};
                setTransaction(transactionResponse.data || orderTransaction);
                setItems(Array.isArray(orderData.shopOrderList) ? orderData.shopOrderList : []);
                setTotal(Number(orderTransaction.shop_order_transaction_total_price || 0));
            })
            .catch(() => { if (active) setError("The receipt details could not be loaded."); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [id]);

    const handlePrint = useCallback(async () => {
        setPrinting(true);
        setPrintError("");

        try {
            const response = await ShopOrderTransactionService.incrementPrintCount(id);
            const updatedPrintCount = Number(
                response.data?.print_count
                ?? response.data?.data?.print_count
                ?? (Number(transaction.print_count || 0) + 1)
            );
            setTransaction((current) => ({
                ...current,
                print_count: updatedPrintCount,
            }));
            setActivePrintNumber(updatedPrintCount);
            // Allow React to paint the new print number before the browser captures the receipt.
            await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            document.body.classList.add("tracked-print-authorized");
            window.print();
        } catch (requestError) {
            setPrintError(requestError.response?.data?.message || "The print count could not be updated. Please try again.");
        } finally {
            document.body.classList.remove("tracked-print-authorized");
            setActivePrintNumber(null);
            setPrinting(false);
        }
    }, [id, transaction.print_count]);

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
    const displayPrintNumber = activePrintNumber ?? (Number(transaction.print_count || 0) + 1);

    if (loading) return <div className="thermal-receipt-state"><CircularProgress size={28} /> Preparing receipt...</div>;
    if (error) return <div className="thermal-receipt-state"><Alert severity="error">{error}</Alert></div>;

    return (
        <main className="thermal-receipt-page">
            {pages.map((pageItems, pageIndex) => {
                const isFirstPage = pageIndex === 0;
                const isLastPage = pageIndex === pages.length - 1;
                const itemOffset = pageIndex * ITEMS_PER_PAGE;
                return (
                    <article className="thermal-receipt" key={`receipt-${pageIndex}`}>
                        {isFirstPage ? (
                            <header className="thermal-receipt-header">
                                <h1>{transaction.shop_name}</h1>
                                {transaction.address && <p>{transaction.address}</p>}
                                {transaction.contact_number && <p>Contact: {transaction.contact_number}</p>}
                                <h2>ORDER RECEIPT</h2>
                                <strong>Reference #{transaction.id || id}</strong>
                            </header>
                        ) : (
                            <header className="thermal-receipt-continuation">
                                <strong>ITEMS CONTINUED</strong>
                                <span>Ref #{transaction.id || id}</span>
                            </header>
                        )}

                        {isFirstPage && (
                            <section className="thermal-receipt-meta">
                                <div><span>Customer</span><strong>{transaction.requestor_name || "-"}</strong></div>
                                <div><span>Type</span><strong>{transaction.customer_type || "-"}</strong></div>
                                <div><span>Date</span><strong>{compactDate(transaction.updated_at)}</strong></div>
                            </section>
                        )}

                        <table className="thermal-receipt-items">
                            <thead><tr><th>Qty</th><th>Item</th><th>Price</th><th>Total</th></tr></thead>
                            <tbody>
                                {pageItems.map((row, index) => {
                                    const details = itemDescription(row);
                                    return (
                                        <tr key={row.id || `${row.product_id}-${itemOffset + index}`}>
                                            <td>{row.shop_order_quantity}</td>
                                            <td>
                                                <strong>{row.product_name}</strong>
                                                {details.packaging && <small>{details.packaging}</small>}
                                                {details.discount && <small>{details.discount}</small>}
                                            </td>
                                            <td>{money(row.shop_order_price)}</td>
                                            <td>{money(row.shop_order_total_price)}</td>
                                        </tr>
                                    );
                                })}
                                {!items.length && <tr><td colSpan="4" className="thermal-receipt-empty">No items</td></tr>}
                            </tbody>
                        </table>

                        {isLastPage && <>
                            <section className="thermal-receipt-total"><span>GRAND TOTAL</span><strong>PHP {money(total)}</strong></section>
                            <section className="thermal-receipt-closing">
                                <p>Sales Representative</p><strong>{transaction.sr_name || "-"}</strong>
                                <h3>THANK YOU FOR YOUR ORDER</h3><b>THIS IS NOT AN OFFICIAL RECEIPT</b>
                            </section>
                        </>}
                        <footer className="thermal-receipt-page-number">
                            <span>Page {pageIndex + 1} of {pages.length}</span>
                            <span>Print No. {displayPrintNumber}</span>
                        </footer>
                    </article>
                );
            })}
            <div className="thermal-receipt-actions hide-on-print">
                {printError && <Alert severity="error" sx={{ mb: 2 }}>{printError}</Alert>}
                <Button variant="contained" size="large" onClick={handlePrint} disabled={printing}>
                    {printing ? "Preparing print..." : "Print receipt"}
                </Button>
            </div>
        </main>
    );
};

export default ReceiptOrder;
