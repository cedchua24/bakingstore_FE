
// import http from "../../http-common";
import axios from "axios";
class OutOfStockService {
    getAll() {
        return axios.get("/api/outOfStockHistory");
    }
    get(id) {
        return axios.get(`/api/outOfStockHistory/${id}`);
    }
    fetchById(id) {
        return axios.get(`/api/outOfStockHistory/fetchById/${id}`);
    }
    fetchShopList() {
        return axios.get(`/api/outOfStockHistory/fetchShopList`);
    }
    create(data) {
        return axios.post("/api/outOfStockHistory", data);
    }
    fetchOOSbyProductId(id) {
        return axios.get(`/api/outOfStockHistory/fetchOOSbyProductId/${id}`);
    }
    update(id, data) {
        return axios.put(`/api/outOfStockHistory/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/outOfStockHistory/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/outOfStockHistory`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/outOfStockHistory/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new OutOfStockService();