// import http from "../../http-common";
import axios from "axios";
class CreditCardInstallmentDtailsService {
    getAll() {
        return axios.get("/api/creditCardInstallmentDtails");
    }
    get(id) {
        return axios.get(`/api/creditCardInstallmentDtails/${id}`);
    }
    fetchCreditCardByMOP(id) {
        return axios.get(`/api/creditCardInstallmentDtails/fetchCreditCardByMOP/${id}`);
    }
    fetchCreditCardInstallmentDetail(id) {
        return axios.get(`/api/creditCardInstallmentDtails/fetchCreditCardInstallmentDetail/${id}`);
    }
    create(data) {
        return axios.post("/api/creditCardInstallmentDtails", data);
    }
    update(id, data) {
        return axios.put(`/api/creditCardInstallmentDtails/${id}`, data);
    }
    delete(brand, data) {
        return axios.delete(`/api/creditCardInstallmentDtails/${brand}`, data);
    }
    deleteAll() {
        return axios.delete(`/api/creditCardInstallmentDtails`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/creditCardInstallmentDtails/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new CreditCardInstallmentDtailsService();