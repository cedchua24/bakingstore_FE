// import http from "../../http-common";
import axios from "axios";
class PaymentTermService {
    getAll() {
        return axios.get("/api/paymentTerm");
    }
    get(id) {
        return axios.get(`/api/paymentTerm/${id}`);
    }
    fetchpaymentTermDTO(id) {
        return axios.get(`/api/paymentTerm/fetchpaymentTermDTO/${id}`);
    }
    fetchEnablepaymentTerm(id) {
        return axios.get(`/api/paymentTerm/fetchEnablepaymentTerm/${id}`);
    }
    create(data) {
        return axios.post("/api/paymentTerm", data);
    }
    update(id, data) {
        return axios.put(`/api/paymentTerm/${id}`, data);
    }
    delete(brand, data) {
        return axios.delete(`/api/paymentTerm/${brand}`, data);
    }
    deleteAll() {
        return axios.delete(`/api/paymentTerm`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/paymentTerm/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new PaymentTermService();