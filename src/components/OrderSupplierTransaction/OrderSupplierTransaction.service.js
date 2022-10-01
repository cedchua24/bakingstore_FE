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