import axios from "axios";
class BranchStockService {
    getAll() {
        return axios.get("/api/branchStock");
    }
    get(id) {
        return axios.get(`/api/branchStock/${id}`);
    }
    create(data) {
        return axios.post("/api/branchStock", data);
    }
    update(id, data) {
        return axios.put(`/api/branchStock/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/branchStock/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/branchStock`);
    }
    findById(id) {
        return axios.get(`/api/branchStock/fetchOrderByTransactionId/${id}`);
    }
    fetchOrderBySupplierId(id) {
        return axios.get(`/api/branchStock/fetchOrderBySupplierId/${id}`);
    }
    fetchOrderByProductId(id) {
        return axios.get(`/api/branchStock/fetchOrderByProductId/${id}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new BranchStockService();