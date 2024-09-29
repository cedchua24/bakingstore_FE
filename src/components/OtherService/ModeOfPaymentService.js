// import http from "../../http-common";
import axios from "axios";
class ModeOfPaymentService {
    getAll() {
        return axios.get("/api/modeOfPayment");
    }
    get(id) {
        return axios.get(`/api/modeOfPayment/${id}`);
    }
    fetchmodeOfPaymentDTO(id) {
        return axios.get(`/api/modeOfPayment/fetchmodeOfPaymentDTO/${id}`);
    }
    fetchmodeOfPayment(id) {
        return axios.get(`/api/modeOfPayment/fetchmodeOfPayment/${id}`);
    }
    create(data) {
        return axios.post("/api/modeOfPayment", data);
    }
    fetchPaymentTypeByShopTransactionId(id) {
        return axios.get(`/api/modeOfPayment/fetchPaymentTypeByShopTransactionId/${id}`);
    }
    update(id, data) {
        return axios.put(`/api/modeOfPayment/${id}`, data);
    }
    updatePaidStatus(id, data) {
        return axios.put(`/api/modeOfPayment/updatePaidStatus/${id}`, data);
    }
    delete(brand, data) {
        return axios.delete(`/api/modeOfPayment/${brand}`, data);
    }
    deleteAll() {
        return axios.delete(`/api/modeOfPayment`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/modeOfPayment/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new ModeOfPaymentService();