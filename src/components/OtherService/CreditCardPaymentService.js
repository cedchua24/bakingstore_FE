// import http from "../../http-common";
import axios from "axios";
class CreditCardPaymentService {
    getAll() {
        return axios.get("/api/creditCardPayment");
    }
    get(id) {
        return axios.get(`/api/creditCardPayment/${id}`);
    }
    fetchCreditCardByMOP(id) {
        return axios.get(`/api/creditCardPayment/fetchCreditCardByMOP/${id}`);
    }
    create(data) {
        return axios.post("/api/creditCardPayment", data);
    }
    update(id, data) {
        return axios.put(`/api/creditCardPayment/${id}`, data);
    }
    delete(brand, data) {
        return axios.delete(`/api/creditCardPayment/${brand}`, data);
    }
    deleteAll() {
        return axios.delete(`/api/creditCardPayment`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/creditCardPayment/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new CreditCardPaymentService();