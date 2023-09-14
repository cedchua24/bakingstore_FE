// import http from "../../http-common";
import axios from "axios";
class ExpensesTypeService {
    getAll() {
        return axios.get("/api/expensesType");
    }
    get(id) {
        return axios.get(`/api/expensesType/${id}`);
    }
    getExpensesCategory() {
        // return axios.get(`/api/expensesType/getExpensesCategory/${id}`);
        return axios.get("/api/expensesType/getExpensesCategory");
    }
    create(data) {
        return axios.post("/api/expensesType", data);
    }
    update(id, data) {
        return axios.put(`/api/expensesType/${id}`, data);
    }
    delete(customer) {
        return axios.delete(`/api/expensesType/${customer}`);
    }
    deleteAll() {
        return axios.delete(`/api/expensesType`);
    }
    findByTitle(customerName) {
        return axios.get(`/api/expensesType/getId/${customerName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new ExpensesTypeService();