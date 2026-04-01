// import http from "../../http-common";
import axios from "axios";
class BalanceTransactionService {
    getAll() {
        return axios.get("/api/balanceTransaction");
    }
    get(id) {
        return axios.get(`/api/balanceTransaction/${id}`);
    }
    fetchEnablebalanceTransaction() {
        return axios.get(`/api/balanceTransaction/fetchEnablebalanceTransaction`);
    }
    create(data) {
        return axios.post("/api/balanceTransaction", data);
    }
    update(id, data) {
        return axios.put(`/api/balanceTransaction/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/balanceTransaction/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/balanceTransaction`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/balanceTransaction/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new BalanceTransactionService();