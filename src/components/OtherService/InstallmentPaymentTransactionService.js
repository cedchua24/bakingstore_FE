// import http from "../../http-common";
import axios from "axios";
class InstallmentPaymentTransactionService {
    getAll() {
        return axios.get("/api/installmentPaymentTransaction");
    }
    get(id) {
        return axios.get(`/api/installmentPaymentTransaction/${id}`);
    }
    fetchInstallmentTransactionByMOP(id) {
        return axios.get(`/api/installmentPaymentTransaction/fetchInstallmentTransactionByMOP/${id}`);
    }
    fetchPromoInstallmentList(id) {
        return axios.get(`/api/installmentPaymentTransaction/fetchPromoInstallmentList/${id}`);
    }
    create(data) {
        return axios.post("/api/installmentPaymentTransaction", data);
    }
    update(id, data) {
        return axios.put(`/api/installmentPaymentTransaction/${id}`, data);
    }
    delete(brand, data) {
        return axios.delete(`/api/installmentPaymentTransaction/${brand}`, data);
    }
    deleteAll() {
        return axios.delete(`/api/installmentPaymentTransaction`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/installmentPaymentTransaction/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new InstallmentPaymentTransactionService();