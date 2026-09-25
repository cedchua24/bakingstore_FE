import axios from "axios";

class PrintingTransactionService {
    getAll(params = {}) {
        return axios.get("/api/printingTransaction", { params });
    }

    get(id) {
        return axios.get(`/api/printingTransaction/${id}`);
    }

    update(id, data) {
        return axios.put(`/api/printingTransaction/${id}`, data);
    }

    create(data) {
        return axios.post("/api/printingTransaction", data);
    }

    delete(id) {
        return axios.delete(`/api/printingTransaction/${id}`);
    }

    getComments(printingTransactionId) {
        return axios.get("/api/printingTransactionComment", { params: { printing_transaction_id: printingTransactionId } });
    }

    createComment(data) {
        return axios.post("/api/printingTransactionComment", data);
    }
}

export default new PrintingTransactionService();
