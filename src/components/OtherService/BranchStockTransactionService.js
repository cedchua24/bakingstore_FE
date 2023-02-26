// import http from "../../http-common";
import axios from "axios";
class BranchStockTransactionService {
    getAll() {
        return axios.get("/api/branchStockTransaction");
    }
    get(id) {
        return axios.get(`/api/branchStockTransaction/${id}`);
    }
    fetchShopOrderDTO(id) {
        return axios.get(`/api/branchStockTransaction/fetchShopOrderDTO/${id}`);
    }
    fetchBranchStockWarehouseList(id) {
        return axios.get(`/api/branchStockTransaction/fetchBranchStockWarehouseList/${id}`);
    }
    create(data) {
        return axios.post("/api/branchStockTransaction", data);
    }
    update(id, data) {
        return axios.put(`/api/branchStockTransaction/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/branchStockTransaction/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/branchStockTransaction`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/branchStockTransaction/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new BranchStockTransactionService();