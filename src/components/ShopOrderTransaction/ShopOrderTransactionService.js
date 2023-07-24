// import http from "../../http-common";
import axios from "axios";
class ShopOrderTransactionService {
    getAll() {
        return axios.get("/api/shopOrderTransaction");
    }
    get(id) {
        return axios.get(`/api/shopOrderTransaction/${id}`);
    }
    fetchShopOrderTransactionList() {
        return axios.get("/api/shopOrderTransaction/fetchShopOrderTransactionList");
    }
    fetchOnlineShopOrderTransactionList(id) {
        return axios.get(`/api/shopOrderTransaction/fetchOnlineShopOrderTransactionList/${id}`);
    }
    fetchShopOrderTransaction(id) {
        return axios.get(`/api/shopOrderTransaction/fetchShopOrderTransaction/${id}`);
    }
    updateShopOrderTransactionStatus(id, data) {
        return axios.put(`/api/shopOrderTransaction/updateShopOrderTransactionStatus/${id}`, data);
    }

    create(data) {
        return axios.post("/api/shopOrderTransaction", data);
    }
    update(id, data) {
        return axios.put(`/api/shopOrderTransaction/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/shopOrderTransaction/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/shopOrderTransaction`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/shopOrderTransaction/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new ShopOrderTransactionService();