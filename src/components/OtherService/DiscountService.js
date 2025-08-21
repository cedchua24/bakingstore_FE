
// import http from "../../http-common";
import axios from "axios";
class DiscountService {
    getAll() {
        return axios.get("/api/discount");
    }
    get(id) {
        return axios.get(`/api/discount/${id}`);
    }
    fetchById(id) {
        return axios.get(`/api/discount/fetchById/${id}`);
    }
    fetchShopList() {
        return axios.get(`/api/discount/fetchShopList`);
    }
    create(data) {
        return axios.post("/api/discount", data);
    }
    fetchDiscountReport(data) {
        return axios.post("/api/discount/fetchDiscountReport", data);
    }
    fetchDiscountLossReport(data) {
        return axios.post("/api/discount/fetchDiscountLossReport", data);
    }
    update(id, data) {
        return axios.put(`/api/discount/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/discount/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/discount`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/discount/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new DiscountService();