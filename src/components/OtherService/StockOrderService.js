
// import http from "../../http-common";
import axios from "axios";
class StockOrderService {
    getAll() {
        return axios.get("/api/stockOrder");
    }
    get(id) {
        return axios.get(`/api/stockOrder/${id}`);
    }
    fetchById(id) {
        return axios.get(`/api/stockOrder/fetchById/${id}`);
    }
    fetchShopList() {
        return axios.get(`/api/stockOrder/fetchShopList`);
    }
    create(data) {
        return axios.post("/api/stockOrder", data);
    }
    update(id, data) {
        return axios.put(`/api/stockOrder/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/stockOrder/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/stockOrder`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/stockOrder/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new StockOrderService();