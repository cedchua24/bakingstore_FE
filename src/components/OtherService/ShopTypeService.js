// import http from "../../http-common";
import axios from "axios";
class ShopTypeService {
    getAll() {
        return axios.get("/api/shopType");
    }
    get(id) {
        return axios.get(`/api/shopType/${id}`);
    }
    fetchShopList() {
        return axios.get(`/api/shopType/fetchShopList`);
    }
    create(data) {
        return axios.post("/api/shopType", data);
    }
    update(id, data) {
        return axios.put(`/api/shopType/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/shopType/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/shopType`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/shopType/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new ShopTypeService();