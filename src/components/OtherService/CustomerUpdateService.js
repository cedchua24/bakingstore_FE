
// import http from "../../http-common";
import axios from "axios";
class CustomerUpdatetService {
    getAll() {
        return axios.get("/api/customerUpdate");
    }
    get(id) {
        return axios.get(`/api/customerUpdate/${id}`);
    }
    fetchById(id) {
        return axios.get(`/api/customerUpdate/fetchById/${id}`);
    }
    fetchShopList() {
        return axios.get(`/api/customerUpdate/fetchShopList`);
    }
    create(data) {
        return axios.post("/api/customerUpdate", data);
    }
    fetchcustomerUpdateReport(data) {
        return axios.post("/api/customerUpdate/fetchcustomerUpdateReport", data);
    }
    fetchcustomerUpdateLossReport(data) {
        return axios.post("/api/customerUpdate/fetchcustomerUpdateLossReport", data);
    }
    update(id, data) {
        return axios.put(`/api/customerUpdate/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/customerUpdate/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/customerUpdate`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/customerUpdate/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new CustomerUpdatetService();