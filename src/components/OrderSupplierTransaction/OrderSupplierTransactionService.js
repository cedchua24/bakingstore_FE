import axios from "axios";

class OrderSupplierTransactionService {
    getAll() {
        return axios.get("/api/orderSupplierTransaction");
    }
    get(id) {
        return axios.get(`/api/orderSupplierTransaction/${id}`);
    }
    create(data) {
        return axios.post("/api/orderSupplierTransaction", data);
    }
    update(id, data) {
        return axios.put(`/api/orderSupplierTransaction/${id}`, data);
    }
    setToCompleteTransaction(id) {
        return axios.put(`/api/orderSupplierTransaction/setToCompleteTransaction/${id}`);
    }
    fetchOrderSupplierByDateV2(id) {
        return axios.get(`/api/orderSupplierTransaction/fetchOrderSupplierByDateV2/${id}`);
    }

    fetchOrderSupplierByDate(id) {
        return axios.get(`/api/orderSupplierTransaction/fetchSpoilageReportByDate/${id}`);
    }

    fetchOrderSupplierReport(data) {
        return axios.post("/api/orderSupplierTransaction/fetchOrderSupplierReport", data);
    }

    setToCompletePaymentTransaction(id) {
        return axios.put(`/api/orderSupplierTransaction/setToCompletePaymentTransaction/${id}`);
    }
    setToCancelTransaction(id) {
        return axios.put(`/api/orderSupplierTransaction/setToCancelTransaction/${id}`);
    }
    delete(brand) {
        return axios.delete(`/api/orderSupplierTransaction/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/orderSupplierTransaction`);
    }
    findById(id) {
        return axios.get(`/api/orderSupplierTransaction/fetchByOrderSupplierTransactionId/${id}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new OrderSupplierTransactionService();