import http from "../../http-common";
import axios from "axios";
class MarkUpPriceService {
    getAll() {
        return axios.get("/api/markUpPrice");
    }
    get(id) {
        return axios.get(`/api/markUpPrice/${id}`);
    }
    create(data) {
        return axios.post("/api/markUpPrice", data);
    }
    update(id, data) {
        return axios.put(`/api/markUpPrice/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/markUpPrice/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/markUpPrice`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/markUpPrice/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new MarkUpPriceService();