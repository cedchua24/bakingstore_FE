import { v4 as uuidv4 } from "uuid";
import accountingApi, { fetchAllAccountingPages } from "./accountingApi";

const source = process.env.REACT_APP_ACCOUNTING_SOURCE || "bakingstore-branch-1";

const CentralExpenseService = {
    source,

    newIdempotencyKey() {
        return uuidv4();
    },

    async paymentMethods() {
        const methods = await fetchAllAccountingPages("/payment-methods");
        return methods.filter((method) => method.is_active && method.type !== "other");
    },

    accounts() {
        return fetchAllAccountingPages("/financial-accounts", {
            application: "expense_payment",
            payments: 1,
            active: 1,
        });
    },

    async record(payload) {
        const response = await accountingApi.post("/integrations/expenses", {
            ...payload,
            source,
            idempotency_key: payload.record_payment
                ? (payload.idempotency_key || this.newIdempotencyKey())
                : undefined,
        });
        return response.data;
    },

    async summaries(externalExpenseIds) {
        const uniqueIds = [...new Set(externalExpenseIds.map(Number).filter((id) => id > 0))];
        if (uniqueIds.length === 0) return {};

        const chunks = [];
        for (let index = 0; index < uniqueIds.length; index += 500) {
            chunks.push(uniqueIds.slice(index, index + 500));
        }
        const responses = await Promise.all(chunks.map((ids) => accountingApi.post(
            "/integrations/expenses/summaries",
            { source, external_expense_ids: ids }
        )));

        return Object.assign({}, ...responses.map((response) => response.data?.data || {}));
    },

    async summary(externalExpenseId) {
        const summaries = await this.summaries([externalExpenseId]);
        return summaries[String(externalExpenseId)] || null;
    },

    async cancel(externalExpenseId, reason) {
        const response = await accountingApi.post('/integrations/expenses/cancel', {
            source,
            external_expense_id: externalExpenseId,
            reason,
        });
        return response.data;
    },
};

export default CentralExpenseService;
