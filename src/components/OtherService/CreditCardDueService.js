// import http from "../../http-common";
import axios from "axios";
class CreditCardDueService {
    getAll() {
        return axios.get("/api/creditCardDue");
    }
    get(id) {
        return axios.get(`/api/creditCardDue/${id}`);
    }
    fetallCreditDueById(id) {
        return axios.get(`/api/creditCardDue/fetallCreditDueById/${id}`);
    }
    fetchCreditCardDueList(id) {
        return axios.get(`/api/creditCardDue/fetchCreditCardDueList/${id}`);
    }
    fetchCreditCardPaidList(id) {
        return axios.get(`/api/creditCardDue/fetchCreditCardPaidList/${id}`);
    }
    fetchChequePaidList(id) {
        return axios.get(`/api/creditCardDue/fetchChequePaidList/${id}`);
    }
    fetchChequeDueList(id) {
        return axios.get(`/api/creditCardDue/fetchChequeDueList/${id}`);
    }
    fetchCreditCardDetail(id) {
        return axios.get(`/api/creditCardDue/fetchCreditCardDetail/${id}`);
    }
    fetchPaymentTypeDetail(id) {
        return axios.get(`/api/creditCardDue/fetchPaymentTypeDetail/${id}`);
    }
    saveCreditCardPay(data) {
        return axios.post("/api/creditCardDue/saveCreditCardPay", data);
    }

    fetchcreditCardDueCreditCard(id) {
        return axios.get(`/api/creditCardDue/fetchcreditCardDueCreditCard/${id}`);
    }
    fetchEnablecreditCardDue(id) {
        return axios.get(`/api/creditCardDue/fetchEnablecreditCardDue/${id}`);
    }
    fetchByPaymentTypePo(id) {
        return axios.get(`/api/creditCardDue/fetchByPaymentTypePo/${id}`);
    }
    fetchOrderSupplierByPaymentType(id) {
        return axios.get(`/api/creditCardDue/fetchOrderSupplierByPaymentType/${id}`);
    }
    fetchNotCashList(id) {
        return axios.get(`/api/creditCardDue/fetchNotCashList/${id}`);
    }
    fetchBycreditCardDue(id) {
        return axios.get(`/api/creditCardDue/fetchBycreditCardDue/${id}`);
    }
    fetchCreditCardPaymentList(id) {
        return axios.get(`/api/creditCardDue/fetchCreditCardPaymentList/${id}`);
    }
    fetchCreditCardPaymentListV2(id) {
        return axios.get(`/api/creditCardDue/fetchCreditCardPaymentListV2/${id}`);
    }
    fetchInstallmenttList(id) {
        return axios.get(`/api/creditCardDue/fetchInstallmenttList/${id}`);
    }
    create(data) {
        return axios.post("/api/creditCardDue", data);
    }
    createCreditDueYearly(data) {
        return axios.post("/api/creditCardDue/createCreditDueYearly", data);
    }
    update(id, data) {
        return axios.put(`/api/creditCardDue/${id}`, data);
    }
    delete(brand, data) {
        return axios.delete(`/api/creditCardDue/${brand}`, data);
    }
    deleteAll() {
        return axios.delete(`/api/creditCardDue`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/creditCardDue/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }

    // getAll() {
    //     return axios.get("https://mdrbakingsupplies.com/api/creditCardDue");
    // }
    // get(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/creditCardDue/${id}`);
    // }
    // fetallCreditDueById(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/creditCardDue/fetallCreditDueById/${id}`);
    // }
    // fetchCreditCardDueList(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/creditCardDue/fetchCreditCardDueList/${id}`);
    // }
    // fetchCreditCardPaidList(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/creditCardDue/fetchCreditCardPaidList/${id}`);
    // }
    // fetchChequePaidList(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/creditCardDue/fetchChequePaidList/${id}`);
    // }
    // fetchChequeDueList(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/creditCardDue/fetchChequeDueList/${id}`);
    // }
    // fetchCreditCardDetail(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/creditCardDue/fetchCreditCardDetail/${id}`);
    // }
    // fetchPaymentTypeDetail(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/creditCardDue/fetchPaymentTypeDetail/${id}`);
    // }
    // saveCreditCardPay(data) {
    //     return axios.post("https://mdrbakingsupplies.com/api/creditCardDue/saveCreditCardPay", data);
    // }

    // fetchcreditCardDueCreditCard(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/creditCardDue/fetchcreditCardDueCreditCard/${id}`);
    // }
    // fetchEnablecreditCardDue(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/creditCardDue/fetchEnablecreditCardDue/${id}`);
    // }
    // fetchByPaymentTypePo(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/creditCardDue/fetchByPaymentTypePo/${id}`);
    // }
    // fetchOrderSupplierByPaymentType(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/creditCardDue/fetchOrderSupplierByPaymentType/${id}`);
    // }
    // fetchNotCashList(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/creditCardDue/fetchNotCashList/${id}`);
    // }
    // fetchBycreditCardDue(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/creditCardDue/fetchBycreditCardDue/${id}`);
    // }
    // fetchCreditCardPaymentList(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/creditCardDue/fetchCreditCardPaymentList/${id}`);
    // }
    // fetchCreditCardPaymentListV2(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/creditCardDue/fetchCreditCardPaymentListV2/${id}`);
    // }
    // fetchInstallmenttList(id) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/creditCardDue/fetchInstallmenttList/${id}`);
    // }
    // create(data) {
    //     return axios.post("https://mdrbakingsupplies.com/api/creditCardDue", data);
    // }
    // createCreditDueYearly(data) {
    //     return axios.post("https://mdrbakingsupplies.com/api/creditCardDue/createCreditDueYearly", data);
    // }
    // update(id, data) {
    //     return axios.put(`https://mdrbakingsupplies.com/api/creditCardDue/${id}`, data);
    // }
    // delete(brand, data) {
    //     return axios.delete(`https://mdrbakingsupplies.com/api/creditCardDue/${brand}`, data);
    // }
    // deleteAll() {
    //     return axios.delete(`https://mdrbakingsupplies.com/api/creditCardDue`);
    // }
    // findByTitle(brandName) {
    //     return axios.get(`https://mdrbakingsupplies.com/api/creditCardDue/getId/${brandName}`);
    // }
    // sanctum() {
    //     return axios.get("/sanctum/csrf-cookie");
    // }
}
export default new CreditCardDueService();