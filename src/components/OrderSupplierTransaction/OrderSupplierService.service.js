import axios from "axios";
class OrderSupplierService {
    getAll() {
        return axios.get("/api/orderSuppliers");
    }
    get(id) {
        return axios.get(`/api/orderSuppliers/${id}`);
    }
    create(data) {
        return axios.post("/api/orderSuppliers", data);
    }
    update(id, data) {
        return axios.put(`/api/orderSuppliers/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/orderSuppliers/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/orderSuppliers`);
    }
    findById(id) {
        return axios.get(`/api/orderSuppliers/fetchOrderByTransactionId/${id}`);
    }
    fetchOrderBySupplierId(id) {
        return axios.get(`/api/orderSuppliers/fetchOrderBySupplierId/${id}`);
    }
    fetchOrderByProductId(id) {
        return axios.get(`/api/orderSuppliers/fetchOrderByProductId/${id}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new OrderSupplierService();