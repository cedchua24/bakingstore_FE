// import http from "../../http-common";
import axios from "axios";
class ModeOfPaymentPoService {
    getAll() {
        return axios.get("/api/modeOfPaymentPo");
    }
    get(id) {
        return axios.get(`/api/modeOfPaymentPo/${id}`);
    }
    fetchmodeOfPaymentPoDTO(id) {
        return axios.get(`/api/modeOfPaymentPo/fetchmodeOfPaymentPoDTO/${id}`);
    }
    fetchmodeOfPaymentPo(id) {
        return axios.get(`/api/modeOfPaymentPo/fetchmodeOfPaymentPo/${id}`);
    }
    create(data) {
        return axios.post("/api/modeOfPaymentPo", data);
    }
    fetchPaymentTypePoByShopTransactionId(id) {
        return axios.get(`/api/modeOfPaymentPo/fetchPaymentTypePoByShopTransactionId/${id}`);
    }
    fetchPaymentTypePoByShopTransactionId(id) {
        return axios.get(`/api/modeOfPaymentPo/fetchPaymentTypePoByShopTransactionId/${id}`);
    }
    update(id, data) {
        return axios.put(`/api/modeOfPaymentPo/${id}`, data);
    }
    delete(brand, data) {
        return axios.delete(`/api/modeOfPaymentPo/${brand}`, data);
    }
    deleteAll() {
        return axios.delete(`/api/modeOfPaymentPo`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/modeOfPaymentPo/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new ModeOfPaymentPoService();