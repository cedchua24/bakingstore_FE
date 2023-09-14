// import http from "../../http-common";
import axios from "axios";
class ExpensesCategoryService {
    getAll() {
        return axios.get("/api/expensesCategory");
    }
    get(id) {
        return axios.get(`/api/expensesCategory/${id}`);
    }
    create(data) {
        return axios.post("/api/expensesCategory", data);
    }
    update(id, data) {
        return axios.put(`/api/expensesCategory/${id}`, data);
    }
    delete(customer) {
        return axios.delete(`/api/expensesCategory/${customer}`);
    }
    deleteAll() {
        return axios.delete(`/api/expensesCategory`);
    }
    findByTitle(customerName) {
        return axios.get(`/api/expensesCategory/getId/${customerName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new ExpensesCategoryService();