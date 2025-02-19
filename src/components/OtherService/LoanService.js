// import http from "../../http-common";
import axios from "axios";
class LoanService {
    getAll() {
        return axios.get("/api/loan");
    }
    get(id) {
        return axios.get(`/api/loan/${id}`);
    }
    fetchloan(id) {
        return axios.get(`/api/loan/fetchloan/${id}`);
    }
    fetchInstallmentList(id) {
        return axios.get(`/api/loan/fetchInstallmentList/${id}`);
    }
    create(data) {
        return axios.post("/api/loan", data);
    }
    update(id, data) {
        return axios.put(`/api/loan/${id}`, data);
    }
    delete(brand, data) {
        return axios.delete(`/api/loan/${brand}`, data);
    }
    deleteAll() {
        return axios.delete(`/api/loan`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/loan/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new LoanService();