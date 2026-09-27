import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import { getPaymentLabelParts } from "../ShopOrderTransaction/shopOrderPaymentHelpers";

const money = (value) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(Number(value || 0));

const DeliveryReportTable = ({ transactions = [], role, date, onDate, onPickup, onDelivery, onDeleteDelivery, onCancel }) => (
    <section className="customer-report-table-card">
        <div className="customer-report-table-header"><div><span className="customer-report-eyebrow">Details</span><h2>Delivery Orders</h2></div><span>{transactions.length} records</span></div>
        <div className="customer-report-table-wrap">
            <table className="customer-report-table customer-report-online-orders-table">
                <thead><tr><th>ID</th><th>Shop</th><th>Customer</th><th>Qty</th><th>Account</th><th>Total</th>{role == 2 && <th>Profit</th>}<th>Date</th><th>Payment</th><th className="customer-report-pickup-col">Pick Up</th><th className="customer-report-delivery-col">Delivery</th><th className="customer-report-actions-col">Actions</th></tr></thead>
                <tbody>
                    {transactions.length === 0 ? <tr><td className="customer-report-empty" colSpan={role == 2 ? 12 : 11}>No Data Available</td></tr> : transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td className="customer-report-id customer-report-id-cell"><span className="customer-report-id-stack"><span className="customer-report-order-id">#{transaction.id}</span>{transaction.delivery_customer_id != 0 && <span className="customer-report-delivery-order-badge">Delivery Order</span>}</span></td>
                            <td><strong>{transaction.shop_name}</strong><span>{transaction.customer_type}</span></td>
                            <td><strong>{transaction.requestor_name}</strong>{transaction.store_name && <span>{transaction.store_name.toUpperCase()}</span>}</td>
                            <td>{transaction.shop_order_transaction_total_quantity || "-"}</td>
                            <td><div className="customer-report-bank-list">{(transaction.mode_of_payment || []).map((payment, index) => <div className="customer-report-payment-account" key={payment.id || index}><strong>{money(payment.amount)}</strong>{getPaymentLabelParts(payment).map((part) => <small key={part}>{part}</small>)}</div>)}</div></td>
                            <td className="customer-report-amount">{money(transaction.shop_order_transaction_total_price)}</td>
                            {role == 2 && <td className="customer-report-amount">{money(transaction.profit)}</td>}
                            <td><div className="customer-report-date-cell"><span>{transaction.date}</span><IconButton size="small"><UpdateIcon color="primary" onClick={(event) => onDate(transaction.id, event)} /></IconButton></div></td>
                            <td><span className={`status-pill ${transaction.status === 1 ? "status-success" : transaction.status === 2 ? "status-warning" : "status-danger"}`}>{transaction.status === 1 ? "Completed" : transaction.status === 2 ? "Pending" : "Cancelled"}</span></td>
                            <td className="customer-report-pickup-col"><div className="customer-report-status-action customer-report-pickup-action"><span className={`status-pill ${transaction.is_pickup === 1 ? "status-success" : "status-warning"}`}>{transaction.is_pickup === 1 ? "Done" : "Waiting"}</span><IconButton size="small"><UpdateIcon color="primary" onClick={(event) => onPickup(transaction.id, event)} /></IconButton></div></td>
                            <td className="customer-report-delivery-col"><div className="customer-report-status-action customer-report-delivery-action">{transaction.delivery_status == 1 ? <span className="status-pill status-success">Delivered</span> : <Tooltip title="Delete"><span className="customer-report-delivery-pending"><span className="status-pill status-warning">Pending Delivery</span><IconButton size="small"><DeleteIcon color="error" onClick={(event) => onDeleteDelivery(transaction.id, event)} /></IconButton></span></Tooltip>}<IconButton size="small"><UpdateIcon color="primary" onClick={(event) => onDelivery(transaction.id, event)} /></IconButton></div></td>
                            <td className="customer-report-actions-col"><div className="customer-report-actions">
                                <Link to={"../shopOrderTransaction/addProductShopOrderTransaction/" + transaction.id}><Button className="customer-report-update-btn" size="sm" variant="success">Update</Button></Link>
                                <Link to={"../shopOrderTransaction/completedShopOrderTransaction/" + transaction.id + "+" + date}><Button size="sm" variant="outline-primary">View</Button></Link>
                                <Link to={"../shopOrderTransaction/receiptOrder/" + transaction.id}><Button size="sm" variant="outline-secondary">Receipt</Button></Link>
                                {Number(transaction.is_pickup) === 1 ? <Link to={"../shopOrderTransaction/deliveryReceipt/" + transaction.id}><Button size="sm" variant="outline-secondary">Delivery Receipt</Button></Link> : <Tooltip title="Complete pick-up to enable"><span><Button size="sm" variant="outline-secondary" disabled>Delivery Receipt</Button></span></Tooltip>}
                                {transaction.status != 3 && <Button size="sm" variant="outline-danger" onClick={() => onCancel(transaction)}>Cancel</Button>}
                            </div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </section>
);

export default DeliveryReportTable;
