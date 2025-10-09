// import http from "../../http-common";
import axios from "axios";
class OutOfStockUpdateService {
    getAll() {
        return axios.get("/api/outOfStockUpdate");
    }
    get(id) {
        return axios.get(`/api/outOfStockUpdate/${id}`);
    }
    create(data) {
        return axios.post("/api/outOfStockUpdate", data);
    }

    fetchCustomerToNotify(id) {
        return axios.get(`/api/outOfStockUpdate/fetchCustomerToNotify/${id}`);
    }

    update(id, data) {
        return axios.put(`/api/outOfStockUpdate/${id}`, data);
    }
    delete(brand, data) {
        return axios.delete(`/api/outOfStockUpdate/${brand}`, data);
    }
    deleteAll() {
        return axios.delete(`/api/outOfStockUpdate`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new OutOfStockUpdateService();