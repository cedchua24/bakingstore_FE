// import http from "../../http-common";
import axios from "axios";
class CreditCardPayService {
    getAll() {
        return axios.get("https://mdrbakingsupplies.com/api/creditCardPay");
    }
    get(id) {
        return axios.get(`https://mdrbakingsupplies.com/api/creditCardPay/${id}`);
    }
    fetchCreditCardPayById(id) {
        return axios.get(`https://mdrbakingsupplies.com/api/creditCardPay/fetchCreditCardPayById/${id}`);
    }
    fetchCreditCardPayByPaymentType(id) {
        return axios.get(`https://mdrbakingsupplies.com/api/creditCardPay/fetchCreditCardPayByPaymentType/${id}`);
    }


    fetchcreditCardPayCreditCard(id) {
        return axios.get(`https://mdrbakingsupplies.com/api/creditCardPay/fetchcreditCardPayCreditCard/${id}`);
    }
    fetchEnablecreditCardPay(id) {
        return axios.get(`https://mdrbakingsupplies.com/api/creditCardPay/fetchEnablecreditCardPay/${id}`);
    }
    fetchByPaymentTypePo(id) {
        return axios.get(`https://mdrbakingsupplies.com/api/creditCardPay/fetchByPaymentTypePo/${id}`);
    }
    fetchOrderSupplierByPaymentType(id) {
        return axios.get(`https://mdrbakingsupplies.com/api/creditCardPay/fetchOrderSupplierByPaymentType/${id}`);
    }
    fetchNotCashList(id) {
        return axios.get(`https://mdrbakingsupplies.com/api/creditCardPay/fetchNotCashList/${id}`);
    }
    fetchBycreditCardPay(id) {
        return axios.get(`https://mdrbakingsupplies.com/api/creditCardPay/fetchBycreditCardPay/${id}`);
    }
    fetchCreditCardPaymentList(id) {
        return axios.get(`https://mdrbakingsupplies.com/api/creditCardPay/fetchCreditCardPaymentList/${id}`);
    }
    fetchCreditCardPaymentListV2(id) {
        return axios.get(`https://mdrbakingsupplies.com/api/creditCardPay/fetchCreditCardPaymentListV2/${id}`);
    }
    fetchCreditCardDueByInstallment(id) {
        return axios.get(`https://mdrbakingsupplies.com/api/creditCardPay/fetchCreditCardDueByInstallment/${id}`);
    }
    fetchInstallmenttList(id) {
        return axios.get(`https://mdrbakingsupplies.com/api/creditCardPay/fetchInstallmenttList/${id}`);
    }
    create(data) {
        return axios.post("https://mdrbakingsupplies.com/api/creditCardPay", data);
    }
    update(id, data) {
        return axios.put(`https://mdrbakingsupplies.com/api/creditCardPay/${id}`, data);
    }
    delete(brand, data) {
        return axios.delete(`https://mdrbakingsupplies.com/api/creditCardPay/${brand}`, data);
    }
    deleteAll() {
        return axios.delete(`https://mdrbakingsupplies.com/api/creditCardPay`);
    }
    findByTitle(brandName) {
        return axios.get(`https://mdrbakingsupplies.com/api/creditCardPay/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new CreditCardPayService();