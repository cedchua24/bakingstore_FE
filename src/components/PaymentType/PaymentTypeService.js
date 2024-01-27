// import http from "../../http-common";
import axios from "axios";
class PaymentTypeService {
    getAll() {
        return axios.get("/api/paymentType");
    }
    get(id) {
        return axios.get(`/api/paymentType/${id}`);
    }
    fetchEnablePaymentType() {
        return axios.get(`/api/paymentType/fetchEnablePaymentType`);
    }
    create(data) {
        return axios.post("/api/paymentType", data);
    }
    update(id, data) {
        return axios.put(`/api/paymentType/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/paymentType/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/paymentType`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/paymentType/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new PaymentTypeService();