import axios from "axios";
class OrderCustomerService {
    getAll() {
        return axios.get("/api/orderCustomers");
    }
    get(id) {
        return axios.get(`/api/orderCustomers/${id}`);
    }
    create(data) {
        return axios.post("/api/orderCustomers", data);
    }
    saveCustomerTransaction(data) {
        return axios.post("/api/orderCustomers/saveCustomerTransaction", data);
    }
    update(id, data) {
        return axios.put(`/api/orderCustomers/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/orderCustomers/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/orderCustomers`);
    }
    findById(id) {
        return axios.get(`/api/orderCustomers/fetchOrderByTransactionId/${id}`);
    }
    fetchOrderBySupplierId(id) {
        return axios.get(`/api/orderCustomers/fetchOrderBySupplierId/${id}`);
    }
    fetchOrderByProductId(id) {
        return axios.get(`/api/orderCustomers/fetchOrderByProductId/${id}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new OrderCustomerService();