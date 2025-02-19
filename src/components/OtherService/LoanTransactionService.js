// import http from "../../http-common";
import axios from "axios";
class LoanTransactionService {
    getAll() {
        return axios.get("/api/loanTransaction");
    }
    get(id) {
        return axios.get(`/api/loanTransaction/${id}`);
    }

    fetchloanTransactionV2(id) {
        return axios.get(`/api/loanTransaction/fetchloanTransactionV2/${id}`);
    }
    create(data) {
        return axios.post("/api/loanTransaction", data);
    }
    update(id, data) {
        return axios.put(`/api/loanTransaction/${id}`, data);
    }
    delete(brand, data) {
        return axios.delete(`/api/loanTransaction/${brand}`, data);
    }
    deleteAll() {
        return axios.delete(`/api/loanTransaction`);
    }

    findByTitle(brandName) {
        return axios.get(`/api/loanTransaction/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new LoanTransactionService();