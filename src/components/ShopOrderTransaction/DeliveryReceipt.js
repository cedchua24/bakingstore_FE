import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import DeliveryCustomerService from "../OtherService/DeliveryCustomerService";
import ShopOrderService from "../OtherService/ShopOrderService";
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import UserService from "../User/UserService.service";
import ModeOfPaymentService from "../OtherService/ModeOfPaymentService";
import ShopService from "../Shop/ShopService";
import { getPaymentLabelParts } from "./shopOrderPaymentHelpers";
import "./DeliveryReceipt.css";

const firstValue = (...values) => values.find((value) => value !== undefined && value !== null && String(value).trim() !== "") || "";

const formatStaffName = (value) => {
    const nameParts = String(value || "").trim().split(/\s+/).filter(Boolean);
    if (nameParts.length < 2) return nameParts[0] || "";
    const lastName = nameParts.pop();
    return `${nameParts.join(" ")} ${lastName.charAt(0).toUpperCase()}.`;
};

const formatDate = (value) => {
    if (!value) return "-";
    const normalized = String(value).replace(" ", "T");
    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime())
        ? value
        : new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(parsed);
};

const DeliveryReceipt = () => {
    const { id } = useParams();
    const [transaction, setTransaction] = useState({});
    const [delivery, setDelivery] = useState({});
    const [customerDetails, setCustomerDetails] = useState({});
    const [users, setUsers] = useState([]);
    const [paymentSummary, setPaymentSummary] = useState({ data: [] });
    const [activeShop, setActiveShop] = useState({});
    const [orderDTO, setOrderDTO] = useState({ shopOrderList: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        Promise.all([
            DeliveryCustomerService.fetchDeliveryById(id),
            ShopOrderTransactionService.fetchShopOrderTransaction(id),
            ShopOrderService.fetchShopOrderDTO(id),
            ShopOrderTransactionService.fetchCustomerDetails(id),
            UserService.fetchUserList(),
            ModeOfPaymentService.fetchPaymentTypeByShopTransactionIdV2(id),
            ShopService.fetchShopActive("active"),
        ])
            .then(([deliveryResponse, transactionResponse, orderResponse, customerDetailsResponse, usersResponse, paymentResponse, shopResponse]) => {
                if (!active) return;
                setDelivery(deliveryResponse.data || {});
                setTransaction(transactionResponse.data || {});
                setOrderDTO(orderResponse.data || { shopOrderList: [] });
                setCustomerDetails(customerDetailsResponse.data || {});
                setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
                const paymentData = paymentResponse.data || {};
                setPaymentSummary({
                    ...paymentData,
                    data: Array.isArray(paymentData.data) ? paymentData.data : [],
                });
                const shopPayload = shopResponse.data?.data || shopResponse.data || {};
                setActiveShop(Array.isArray(shopPayload) ? (shopPayload[0] || {}) : shopPayload);
            })
            .catch(() => {
                if (active) setError("The delivery receipt details could not be loaded. Please try again.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => { active = false; };
    }, [id]);

    const items = Array.isArray(orderDTO.shopOrderList) ? orderDTO.shopOrderList : [];
    const customerName = firstValue(transaction.requestor_name, "-");
    const businessName = firstValue(customerDetails.store_name, transaction.store_name, transaction.business_name);
    const address = firstValue(delivery.address, transaction.customer_address, transaction.address, "-");
    const contactNumber = firstValue(delivery.contact_number, transaction.customer_contact_number, transaction.contact_number, "-");
    const receiptDate = delivery.date;
    const paymentRows = paymentSummary.data;
    const hasInitialPayment = Number(paymentSummary.total_payment || 0) > 0;
    const paymentStatus = Number(transaction.status) === 1
        ? { label: "Paid", className: "is-paid" }
        : Number(transaction.status) === 2 && hasInitialPayment
            ? { label: "Initial Payment", className: "is-partial" }
            : Number(transaction.status) === 2
                ? { label: "Payment Pending", className: "is-pending" }
                : { label: "Cancelled", className: "is-cancelled" };
    const paymentMethodLabel = (payment) => {
        const labelParts = getPaymentLabelParts(payment);
        if (!labelParts.length) return "";

        const paymentMethod = String(labelParts[0]).trim();
        return paymentMethod.toLowerCase() === "cash"
            ? "Cash"
            : labelParts.join(" · ");
    };
    const userName = (userId) => users.find((user) => String(user.id) === String(userId))?.name;
    const preparedBy = formatStaffName(firstValue(transaction.sr_name));
    const checkedBy = formatStaffName(firstValue(
        userName(customerDetails.checker_id),
        customerDetails.checker_name,
        customerDetails.checker?.name,
        customerDetails.checker_full_name
    ));
    const deliveredBy = formatStaffName(firstValue(
        userName(delivery.driver_id),
        delivery.driver_name,
        transaction.rider_name,
        transaction.dispatcher_name
    ));
    const itemsPerPage = 12;
    const itemPages = items.length
        ? Array.from({ length: Math.ceil(items.length / itemsPerPage) }, (_, pageIndex) =>
            items.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage))
        : [[]];
    const totalQuantity = transaction.shop_order_transaction_total_quantity
        || items.reduce((sum, item) => sum + Number(item.shop_order_quantity || 0), 0);

    if (loading) {
        return <div className="delivery-receipt-state"><CircularProgress /><span>Preparing delivery receipt...</span></div>;
    }

    if (error) {
        return <div className="delivery-receipt-state"><Alert severity="error">{error}</Alert></div>;
    }

    return (
        <main className="delivery-receipt-page">
            {itemPages.map((pageItems, pageIndex) => {
                const isLastPage = pageIndex === itemPages.length - 1;
                const itemOffset = pageIndex * itemsPerPage;

                return (
                    <article className="delivery-receipt-sheet" key={`receipt-page-${pageIndex}`}>
                        {pageIndex === 0 ? <>
                            <header className="delivery-receipt-header">
                                <div className="delivery-receipt-brand">
                                    <img src="/mdr_nav_logo.png" alt="MDR Consumer Goods Trading" />
                                    <strong>{activeShop.shop_name || "MDR Consumer Goods Trading"}</strong>
                                    {activeShop.address && <span>{activeShop.address}</span>}
                                    {activeShop.contact_number && <span>Contact: {activeShop.contact_number}</span>}
                                </div>
                                <div className="delivery-receipt-title">
                                    <p>Delivery Receipt</p>
                                    <h1>DR-{String(transaction.id || id).padStart(6, "0")}</h1>
                                    <span>{formatDate(receiptDate)}</span>
                                </div>
                            </header>

                            <section className="delivery-receipt-recipient">
                                <dl>
                                    <div><dt>Customer</dt><dd className="delivery-receipt-customer-name">{customerName}</dd></div>
                                    {businessName && <div><dt>Business name</dt><dd className="delivery-receipt-business">{businessName}</dd></div>}
                                </dl>
                                <dl>
                                    <div><dt>Address</dt><dd>{address}</dd></div>
                                    <div><dt>Contact</dt><dd>{contactNumber}</dd></div>
                                    {delivery.note && <div><dt>Delivery note</dt><dd>{delivery.note}</dd></div>}
                                </dl>
                            </section>
                        </> : (
                            <header className="delivery-receipt-continuation">
                                <strong>Product items continued</strong>
                                <span>DR-{String(transaction.id || id).padStart(6, "0")}</span>
                            </header>
                        )}

                        <section className="delivery-receipt-items">
                            <table>
                                <thead>
                                    <tr><th>#</th><th>Product item</th><th>Unit</th><th>Qty</th></tr>
                                </thead>
                                <tbody>
                                    {pageItems.map((item, index) => (
                                        <tr key={item.id || `${item.product_id}-${itemOffset + index}`}>
                                            <td>{itemOffset + index + 1}</td>
                                            <td>
                                                <strong>{item.product_name || "Unnamed item"}</strong>
                                                {item.business_type !== "WHOLESALE" && item.weight && item.quantity
                                                    ? <small>{Number(item.weight) / Number(item.quantity)}{item.variation || ""}</small>
                                                    : null}
                                            </td>
                                            <td>{firstValue(item.unit, item.packaging, "-")}</td>
                                            <td>{item.shop_order_quantity || 0}</td>
                                        </tr>
                                    ))}
                                    {!items.length && <tr><td colSpan="4" className="delivery-receipt-empty">No items found for this transaction.</td></tr>}
                                </tbody>
                            </table>
                            {isLastPage && <p className="delivery-receipt-total">Total quantity <strong>{totalQuantity}</strong></p>}
                        </section>

                        {isLastPage && <>
                            <section className="delivery-receipt-payment">
                                <div className="delivery-receipt-payment-heading">
                                    <span className="delivery-receipt-label">Mode of payment</span>
                                    <span className={`delivery-receipt-payment-status ${paymentStatus.className}`}>{paymentStatus.label}</span>
                                </div>
                                {paymentRows.length
                                    ? paymentRows.map((payment, index) => <p key={payment.id || index}>{paymentMethodLabel(payment) || "Payment recorded"}</p>)
                                    : <p>Not specified</p>}
                            </section>

                            <section className="delivery-receipt-signatures">
                                <div><strong>{preparedBy}</strong><span>Prepared by</span></div>
                                <div><strong>{checkedBy}</strong><span>Checked by</span></div>
                                <div><strong>{deliveredBy}</strong><span>Driver</span></div>
                                <div className="delivery-receipt-received"><strong>&nbsp;</strong><span>Received by - name, signature, and date</span></div>
                            </section>

                            <footer>
                                <strong>Please check all items upon receipt.</strong>
                                <p>Report missing, incorrect, or damaged items immediately. Keep this delivery receipt as your record of goods received.</p>
                                <span>This document acknowledges delivery only and is not an official sales invoice.</span>
                            </footer>
                        </>}

                        {itemPages.length > 1 && (
                            <div className="delivery-receipt-page-number">Page {pageIndex + 1} of {itemPages.length}</div>
                        )}
                    </article>
                );
            })}

            <div className="delivery-receipt-actions hide-on-print">
                <Button variant="contained" size="large" onClick={() => window.print()}>Print delivery receipt</Button>
            </div>
        </main>
    );
};

export default DeliveryReceipt;
