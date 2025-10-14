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
    fetchPaymentTermCreditCard(id) {
        return axios.get(`/api/paymentTerm/fetchPaymentTermCreditCard/${id}`);
    }
    fetchEnablepaymentTerm(id) {
        return axios.get(`/api/paymentTerm/fetchEnablepaymentTerm/${id}`);
    }
    fetchCashAndOnline(id) {
        return axios.get(`/api/paymentTerm/fetchCashAndOnline/${id}`);
    }
    fetchByPaymentTypePo(id) {
        return axios.get(`/api/paymentTerm/fetchByPaymentTypePo/${id}`);
    }
    fetchOrderSupplierByPaymentType(id) {
        return axios.get(`/api/paymentTerm/fetchOrderSupplierByPaymentType/${id}`);
    }
    fetchNotCashList(id) {
        return axios.get(`/api/paymentTerm/fetchNotCashList/${id}`);
    }
    fetchByPaymentTerm(id) {
        return axios.get(`/api/paymentTerm/fetchByPaymentTerm/${id}`);
    }
    fetchCreditCardPaymentList(id) {
        return axios.get(`/api/paymentTerm/fetchCreditCardPaymentList/${id}`);
    }
    fetchCreditCardPaymentListV2(id) {
        return axios.get(`/api/paymentTerm/fetchCreditCardPaymentListV2/${id}`);
    }
    // fetchCreditCardPaymentListV2(id) {
    //     return axios.get(`/api/paymentTerm/fetchCreditCardPaymentListV2/${id}`);
    // }
    fetchCreditCardPaymentListV3(id) {
        return axios.get(`/api/paymentTerm/fetchCreditCardPaymentListV3/${id}`);
    }

    fetchInstallmenttList(id) {
        return axios.get(`/api/paymentTerm/fetchInstallmenttList/${id}`);
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


    // getAll() {
    //     return axios.get("https://mdrbakingsupplies.com/api/paymentTerm");
    // }
    // get(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/paymentTerm/${id}`);
    // }
    // fetchpaymentTermDTO(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/paymentTerm/fetchpaymentTermDTO/${id}`);
    // }
    // fetchPaymentTermCreditCard(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/paymentTerm/fetchPaymentTermCreditCard/${id}`);
    // }
    // fetchEnablepaymentTerm(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/paymentTerm/fetchEnablepaymentTerm/${id}`);
    // }
    // fetchCashAndOnline(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/paymentTerm/fetchCashAndOnline/${id}`);
    // }
    // fetchByPaymentTypePo(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/paymentTerm/fetchByPaymentTypePo/${id}`);
    // }
    // fetchOrderSupplierByPaymentType(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/paymentTerm/fetchOrderSupplierByPaymentType/${id}`);
    // }
    // fetchNotCashList(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/paymentTerm/fetchNotCashList/${id}`);
    // }
    // fetchByPaymentTerm(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/paymentTerm/fetchByPaymentTerm/${id}`);
    // }
    // fetchCreditCardPaymentList(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/paymentTerm/fetchCreditCardPaymentList/${id}`);
    // }
    // fetchCreditCardPaymentListV2(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/paymentTerm/fetchCreditCardPaymentListV2/${id}`);
    // }
    // // fetchCreditCardPaymentListV2(id) {
    // //     return axios.get(`/api/paymentTerm/fetchCreditCardPaymentListV2/${id}`);
    // // }
    // fetchCreditCardPaymentListV3(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/paymentTerm/fetchCreditCardPaymentListV3/${id}`);
    // }

    // fetchInstallmenttList(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/paymentTerm/fetchInstallmenttList/${id}`);
    // }
    // create(data) {
    //     return axios.post("https://mdrbakingsupplies.com/api/paymentTerm", data);
    // }
    // update(id, data) {
    //     return axios.put(`https://mdrbakingsupplies.com/api/paymentTerm/${id}`, data);
    // }
    // delete(brand, data) {
    //     return axios.delete(`https://mdrbakingsupplies.com/api/paymentTerm/${brand}`, data);
    // }
    // deleteAll() {
    //     return axios.delete(`https://mdrbakingsupplies.com/api/paymentTerm`);
    // }
    // findByTitle(brandName) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/paymentTerm/getId/${brandName}`);
    // }
    // sanctum() {
    //     return axios.get("/sanctum/csrf-cookie");
    // }
}
export default new PaymentTermService();