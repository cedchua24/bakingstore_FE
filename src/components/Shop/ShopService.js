// import http from "../../http-common";
import axios from "axios";
class ShopService {
    getAll() {
        return axios.get("/api/shop");
    }
    get(id) {
        return axios.get(`/api/shop/${id}`);
    }
    fetchShopList(id) {
        return axios.get(`/api/shop/fetchShopList/${id}`);
    }
    fetchOnlineOrderList(id) {
        return axios.get(`/api/shop/fetchOnlineOrderList/${id}`);
    }
    fetchShopActive(id) {
        return axios.get(`/api/shop/fetchShopActive/${id}`);
    }
    fetchPhysicalStoreList(id) {
        return axios.get(`/api/shop/fetchPhysicalStoreList/${id}`);
    }
    test(id) {
        return axios.get(`/api/shop/test/${id}`);
    }
    create(data) {
        return axios.post("/api/shop", data);
    }
    update(id, data) {
        return axios.put(`/api/shop/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/shop/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/shop`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/shop/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new ShopService();