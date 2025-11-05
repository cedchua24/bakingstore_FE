// import http from "../../http-common";
import axios from "axios";
class ProductSoldDailyService {
    getAll() {
        return axios.get("/api/productSoldDaily");
    }
    get(id) {
        return axios.get(`/api/productSoldDaily/${id}`);
    }
    create(data) {
        return axios.post("/api/productSoldDaily", data);
    }
    update(id, data) {
        return axios.put(`/api/productSoldDaily/${id}`, data);
    }

    updateMultiple(data) {
        return axios.post("/api/productSoldDaily/updateMultiple", { products: data });
    }

    fetchProductSoldListByDate(id) {
        return axios.get(`/api/productSoldDaily/fetchProductSoldListByDate/${id}`);
    }
    delete(brand, data) {
        return axios.delete(`/api/productSoldDaily/${brand}`, data);
    }
    deleteAll() {
        return axios.delete(`/api/productSoldDaily`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new ProductSoldDailyService();