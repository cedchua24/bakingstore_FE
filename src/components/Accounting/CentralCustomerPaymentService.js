import { v4 as uuidv4 } from "uuid";
import accountingApi, { fetchAllAccountingPages } from "./accountingApi";

const source = process.env.REACT_APP_ACCOUNTING_SOURCE || "bakingstore-branch-1";

const CentralCustomerPaymentService = {
    source,

    async paymentMethods() {
        const methods = await fetchAllAccountingPages("/payment-methods");
        return methods.filter((method) => method.is_active && !["credit_card", "cheque"].includes(method.type));
    },

    accounts() {
        return fetchAllAccountingPages("/financial-accounts", {
            application: "customer_receipt",
            receipts: 1,
            active: 1,
        });
    },

    async summary(externalOrderId) {
        const response = await accountingApi.get("/integrations/customer-order", {
            params: { source, external_order_id: externalOrderId },
        });
        return response.data;
    },

    async summaries(externalOrderIds) {
        const uniqueIds = [...new Set(externalOrderIds.map(Number).filter((id) => id > 0))];
        if (uniqueIds.length === 0) return {};
        const chunks = [];
        for (let index = 0; index < uniqueIds.length; index += 500) {
            chunks.push(uniqueIds.slice(index, index + 500));
        }
        const responses = await Promise.all(chunks.map((ids) => accountingApi.post(
            "/integrations/customer-orders/summaries",
            { source, external_order_ids: ids }
        )));
        return Object.assign({}, ...responses.map((response) => response.data?.data || {}));
    },

    async refundCandidates(filters = {}) {
        const payload = { source };
        if (filters.date_from) payload.date_from = filters.date_from;
        if (filters.date_to) payload.date_to = filters.date_to;

        const response = await accountingApi.post(
            "/shopOrderTransaction/fetchOnlineShopOrderRefundTransactionListV2",
            payload
        );

        return Array.isArray(response.data?.data) ? response.data.data : [];
    },

    async paymentReport(dateFrom, dateTo) {
        const response = await accountingApi.get('/integrations/customer-payment-report', {
            params: { source, date_from: dateFrom, date_to: dateTo },
        });
        return response.data || { data: [], total_cash: 0, total_online: 0, total_sales: 0 };
    },

    async reconciliation(financialAccountId, orderDate) {
        const response = await accountingApi.get("/integrations/customer-payment-reconciliation", {
            params: {
                source,
                financial_account_id: financialAccountId,
                order_date: orderDate,
            },
        });
        return response.data;
    },

    async updateLineConfirmation(paymentLineId, confirmed) {
        const response = await accountingApi.put(`/integrations/customer-payment-lines/${paymentLineId}/confirmation`, {
            confirmed,
        });
        return response.data;
    },

    async createPayment(payload) {
        const response = await accountingApi.post("/integrations/customer-order/payments", {
            ...payload,
            source,
            idempotency_key: uuidv4(),
        });
        return response.data;
    },

    async voidPayment(paymentId) {
        const response = await accountingApi.post(`/payments/${paymentId}/void`, {
            reason: "Voided from branch shop-order finalization",
        });
        return response.data;
    },
};

export default CentralCustomerPaymentService;
