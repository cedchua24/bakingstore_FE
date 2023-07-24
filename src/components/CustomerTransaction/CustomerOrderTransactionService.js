import axios from "axios";
class OrderCustomerTransactionService {
    getAll() {
        return axios.get("/api/orderCustomerTransaction");
    }
    get(id) {
        return axios.get(`/api/orderCustomerTransaction/${id}`);
    }
    create(data) {
        return axios.post("/api/orderCustomerTransaction", data);
    }
    update(id, data) {
        return axios.put(`/api/orderCustomerTransaction/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/orderCustomerTransaction/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/orderCustomerTransaction`);
    }
    findById(id) {
        return axios.get(`/api/orderCustomerTransaction/fetchOrderByTransactionId/${id}`);
    }
    fetchOrderBySupplierId(id) {
        return axios.get(`/api/orderCustomerTransaction/fetchOrderBySupplierId/${id}`);
    }
    fetchCustomerOrderTransaction(id) {
        return axios.get(`/api/orderCustomerTransaction/fetchCustomerOrderTransaction/${id}`);
    }
    fetchOrderByProductId(id) {
        return axios.get(`/api/orderCustomerTransaction/fetchOrderByProductId/${id}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new OrderCustomerTransactionService();