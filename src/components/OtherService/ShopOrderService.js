// import http from "../../http-common";
import axios from "axios";
class ShopOrderService {
    getAll() {
        return axios.get("/api/shopOrder");
    }
    get(id) {
        return axios.get(`/api/shopOrder/${id}`);
    }
    fetchShopOrderDTO(id) {
        return axios.get(`/api/shopOrder/fetchShopOrderDTO/${id}`);
    }
    fetchShopOrder(id) {
        return axios.get(`/api/shopOrder/fetchShopOrder/${id}`);
    }
    create(data) {
        return axios.post("/api/shopOrder", data);
    }
    update(id, data) {
        return axios.put(`/api/shopOrder/${id}`, data);
    }
    delete(brand, data) {
        return axios.delete(`/api/shopOrder/${brand}`, data);
    }
    deleteAll() {
        return axios.delete(`/api/shopOrder`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/shopTyshopOrderpe/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new ShopOrderService();