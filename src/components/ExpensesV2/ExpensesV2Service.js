// import http from "../../http-common";
import axios from "axios";
class ExpensesV2Service {
    getAll() {
        return axios.get("/api/expensesV2");
    }
    get(id) {
        return axios.get(`/api/expensesV2/${id}`);
    }
    getExpensesCategory() {
        // return axios.get(`/api/expensesV2/getExpensesCategory/${id}`);
        return axios.get("/api/expensesV2/getExpensesCategory");
    }
    fetchExpenseTypeTransaction(id) {
        return axios.get(`/api/expensesV2/fetchExpenseTypeTransaction/${id}`);
    }
    fetchExpenseV2ById(id) {
        return axios.get(`/api/expensesV2/fetchExpenseV2ById/${id}`);
    }
    fetchExpenseByTypeaAndCategory(data) {
        return axios.post("/api/expensesV2/fetchExpenseByTypeaAndCategory", data);
    }

    create(data) {
        return axios.post("/api/expensesV2", data);
    }
    update(id, data) {
        return axios.put(`/api/expensesV2/${id}`, data);
    }
    delete(customer) {
        return axios.delete(`/api/expensesV2/${customer}`);
    }
    deleteAll() {
        return axios.delete(`/api/expensesV2`);
    }
    findByTitle(customerName) {
        return axios.get(`/api/expensesV2/getId/${customerName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new ExpensesV2Service();