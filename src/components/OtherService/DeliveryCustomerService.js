// import http from "../../http-common";
import axios from "axios";
class DeliveryCustomerervice {
    getAll() {
        return axios.get("/api/deliveryCustomer");
    }
    get(id) {
        return axios.get(`/api/deliveryCustomer/${id}`);
    }
    fetchShopOrderDTO(id) {
        return axios.get(`/api/deliveryCustomer/fetchShopOrderDTO/${id}`);
    }
    fetchDeliveryById(id) {
        return axios.get(`/api/deliveryCustomer/fetchDeliveryById/${id}`);
    }
    create(data) {
        return axios.post("/api/deliveryCustomer", data);
    }
    update(id, data) {
        return axios.put(`/api/deliveryCustomer/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/deliveryCustomer/${brand}`);
    }
    deleteTransaction(id) {
        return axios.delete(`/api/deliveryCustomer/deleteTransaction/${id}`);
    }
    deleteAll() {
        return axios.delete(`/api/deliveryCustomer`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/deliveryCustomer/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new DeliveryCustomerervice();