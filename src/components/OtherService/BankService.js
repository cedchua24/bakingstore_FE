// import http from "../../http-common";
import axios from "axios";
class BankService {
    getAll() {
        return axios.get("/api/banks");
    }
    get(id) {
        return axios.get(`/api/banks/${id}`);
    }
    create(data) {
        return axios.post("/api/banks", data);
    }
    update(id, data) {
        return axios.put(`/api/banks/${id}`, data);
    }
    delete(brand, data) {
        return axios.delete(`/api/banks/${brand}`, data);
    }
    deleteAll() {
        return axios.delete(`/api/banks`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new BankService();