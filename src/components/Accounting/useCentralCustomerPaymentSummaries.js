import { useCallback, useState } from "react";
import CentralCustomerPaymentService from "./CentralCustomerPaymentService";
import { ACCOUNTING_TOKEN_KEY } from "./accountingApi";

export const hasLegacyCustomerPayments = (transaction) => (
    Array.isArray(transaction?.mode_of_payment) && transaction.mode_of_payment.length > 0
);

export const centralCustomerPaymentLines = (summary) => {
    if (!Array.isArray(summary?.data)) return [];

    return summary.data
        .filter((payment) => payment.status === "posted")
        .flatMap((payment) => (payment.lines || []).map((line) => ({
            ...line,
            paymentId: payment.id,
            paymentDate: payment.payment_date,
            paymentStatus: payment.status,
        })));
};

export const centralCustomerPaymentLabel = (line) => {
    const account = line?.financial_account || {};
    const institutionName = String(account.institution?.name || "").trim();
    let accountName = String(account.name || "").trim();

    if (institutionName && accountName.toLowerCase() === institutionName.toLowerCase()) {
        accountName = "";
    }
    if (institutionName && accountName.toLowerCase().startsWith(`${institutionName.toLowerCase()} - `)) {
        accountName = accountName.slice(institutionName.length + 3).trim();
    }
    if (institutionName && accountName.toLowerCase().startsWith(`${institutionName.toLowerCase()} `)) {
        accountName = accountName.slice(institutionName.length + 1).trim();
    }

    return [
        line?.payment_method?.name,
        institutionName,
        accountName,
        account.masked_account_number || account.account_number,
    ]
        .filter((value) => value !== undefined && value !== null && String(value).trim() !== "")
        .filter((value, index, values) => values.findIndex(
            (candidate) => String(candidate).trim().toLowerCase() === String(value).trim().toLowerCase()
        ) === index)
        .join(" · ");
};

export const centralCustomerPaymentStatus = (transaction, summary) => {
    if (hasLegacyCustomerPayments(transaction) || !summary?.invoice) {
        return {
            className: transaction.status === 1 ? "status-success" : transaction.status === 2 ? "status-warning" : "status-danger",
            label: transaction.status === 1 ? "Completed" : transaction.status === 2 ? "Pending" : "Cancelled",
        };
    }

    const statuses = {
        paid: { className: "status-success", label: "Completed" },
        partially_paid: { className: "status-warning", label: "Partially Paid" },
        unpaid: { className: "status-warning", label: "Pending" },
        partially_refunded: { className: "status-warning", label: "Partial Refund" },
        refunded: { className: "status-danger", label: "Refunded" },
        cancelled: { className: "status-danger", label: "Cancelled" },
    };

    return statuses[summary.invoice.status] || { className: "status-warning", label: summary.invoice.status || "Pending" };
};

const useCentralCustomerPaymentSummaries = () => {
    const [accountingSummaries, setAccountingSummaries] = useState({});

    const loadAccountingSummaries = useCallback(async (transactions = []) => {
        const orderIds = transactions
            .map((transaction) => Number(transaction.id))
            .filter((orderId) => Number.isInteger(orderId) && orderId > 0);

        if (!localStorage.getItem(ACCOUNTING_TOKEN_KEY) || orderIds.length === 0) {
            setAccountingSummaries({});
            return;
        }

        try {
            setAccountingSummaries(await CentralCustomerPaymentService.summaries([...new Set(orderIds)]));
        } catch (error) {
            setAccountingSummaries({});
            console.log("Unable to load Central Accounting payments", error);
        }
    }, []);

    return { accountingSummaries, loadAccountingSummaries };
};

export default useCentralCustomerPaymentSummaries;
