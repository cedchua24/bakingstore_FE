// import http from "../../http-common";
import axios from "axios";
class PaymentTypePoService {
    getAll() {
        return axios.get("/api/paymentTypePo");
    }
    get(id) {
        return axios.get(`/api/paymentTypePo/${id}`);
    }
    fetchpaymentTypePoDTO(id) {
        return axios.get(`/api/paymentTypePo/fetchpaymentTypePoDTO/${id}`);
    }
    fetchEnablepaymentTypePo(id) {
        return axios.get(`/api/paymentTypePo/fetchEnablepaymentTypePo/${id}`);
    }
    findByCategory(id) {
        return axios.get(`/api/paymentTypePo/findByCategory/${id}`);
    }
    create(data) {
        return axios.post("/api/paymentTypePo", data);
    }
    update(id, data) {
        return axios.put(`/api/paymentTypePo/${id}`, data);
    }
    delete(brand, data) {
        return axios.delete(`/api/paymentTypePo/${brand}`, data);
    }
    deleteAll() {
        return axios.delete(`/api/paymentTypePo`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/paymentTypePo/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }



    // getAll() {
    //     return axios.get("https://mdrbakingsupplies.com/api/paymentTypePo");
    // }
    // get(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/paymentTypePo/${id}`);
    // }
    // fetchpaymentTypePoDTO(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/paymentTypePo/fetchpaymentTypePoDTO/${id}`);
    // }
    // fetchEnablepaymentTypePo(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/paymentTypePo/fetchEnablepaymentTypePo/${id}`);
    // }
    // findByCategory(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/paymentTypePo/findByCategory/${id}`);
    // }
    // create(data) {
    //     return axios.post("https://mdrbakingsupplies.com/api/paymentTypePo", data);
    // }
    // update(id, data) {
    //     return axios.put(`https://mdrbakingsupplies.com/api/paymentTypePo/${id}`, data);
    // }
    // delete(brand, data) {
    //     return axios.delete(`https://mdrbakingsupplies.com/api/paymentTypePo/${brand}`, data);
    // }
    // deleteAll() {
    //     return axios.delete(`https://mdrbakingsupplies.com/api/paymentTypePo`);
    // }
    // findByTitle(brandName) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/paymentTypePo/getId/${brandName}`);
    // }
    // sanctum() {
    //     return axios.get("/sanctum/csrf-cookie");
    // }
}
export default new PaymentTypePoService();