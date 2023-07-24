import http from "../../http-common";
import axios from "axios";
class ProductTransactionService {
    getAll() {
        return axios.get("/api/productTransactions");
    }
    get(id) {
        return axios.get(`/api/productTransactions/${id}`);
    }
    fetchProductTransactionList(id) {
        return axios.get(`/api/productTransactions/fetchProductTransactionList/${id}`);
    }
    create(data) {
        return axios.post("/api/productTransactions", data);
    }
    update(id, data) {
        return axios.put(`/api/productTransactions/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/productTransactions/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/productTransactions`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/productTransactions/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new ProductTransactionService();