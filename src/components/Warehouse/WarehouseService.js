// import http from "../../http-common";
import axios from "axios";
class WarehouseService {
    getAll() {
        return axios.get("/api/warehouse");
    }
    get(id) {
        return axios.get(`/api/warehouse/${id}`);
    }
    create(data) {
        return axios.post("/api/warehouse", data);
    }
    update(id, data) {
        return axios.put(`/api/warehouse/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/warehouse/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/warehouse`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/warehouse/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new WarehouseService();