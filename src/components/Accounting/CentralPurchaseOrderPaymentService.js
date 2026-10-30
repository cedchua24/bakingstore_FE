import { v4 as uuidv4 } from "uuid";
import accountingApi, { fetchAllAccountingPages } from "./accountingApi";

const source = process.env.REACT_APP_ACCOUNTING_SOURCE || "bakingstore-branch-1";

const CentralPurchaseOrderPaymentService = {
    source,

    async paymentMethods() {
        const methods = await fetchAllAccountingPages("/payment-methods");
        return methods.filter((method) => method.is_active && method.type !== "other");
    },

    accounts() {
        return fetchAllAccountingPages("/financial-accounts", {
            application: "purchase_order_payment",
            payments: 1,
            active: 1,
        });
    },

    async summary(externalOrderId) {
        const response = await accountingApi.get("/integrations/purchase-order", {
            params: { source, external_order_id: externalOrderId },
        });
        return response.data;
    },

    async summaries(externalOrderIds) {
        const response = await accountingApi.post("/integrations/purchase-orders/summaries", {
            source,
            external_order_ids: externalOrderIds,
        });
        return response.data?.data || {};
    },

    async createPayment(payload) {
        const response = await accountingApi.post("/integrations/purchase-order/payments", {
            ...payload,
            source,
            idempotency_key: uuidv4(),
        });
        return response.data;
    },

    async voidPayment(paymentId) {
        const response = await accountingApi.post(`/payments/${paymentId}/void`, {
            reason: "Voided from branch supplier payment page",
        });
        return response.data;
    },
};

export default CentralPurchaseOrderPaymentService;
