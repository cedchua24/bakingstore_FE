// import http from "../../http-common";
import axios from "axios";
class InstallmentPaymentService {
    getAll() {
        return axios.get("/api/installmentPayment");
    }
    get(id) {
        return axios.get(`/api/installmentPayment/${id}`);
    }
    fetchInstallmentPayment(id) {
        return axios.get(`/api/installmentPayment/fetchInstallmentPayment/${id}`);
    }
    create(data) {
        return axios.post("/api/installmentPayment", data);
    }
    update(id, data) {
        return axios.put(`/api/installmentPayment/${id}`, data);
    }
    delete(brand, data) {
        return axios.delete(`/api/installmentPayment/${brand}`, data);
    }
    deleteAll() {
        return axios.delete(`/api/installmentPayment`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/installmentPayment/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new InstallmentPaymentService();