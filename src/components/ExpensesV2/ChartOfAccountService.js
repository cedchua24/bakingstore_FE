// import http from "../../http-common";
import axios from "axios";
class ChartOfAccountService {
    getAll() {
        return axios.get("/api/chartOfAccounts");
    }
    get(id) {
        return axios.get(`/api/chartOfAccounts/${id}`);
    }
    getExpensesCategory() {
        // return axios.get(`/api/chartOfAccounts/getExpensesCategory/${id}`);
        return axios.get("/api/chartOfAccounts/getExpensesCategory");
    }
    fetchExpenseTypeTransaction(id) {
        return axios.get(`/api/chartOfAccounts/fetchExpenseTypeTransaction/${id}`);
    }
    fetchExpenseTypeById(id) {
        return axios.get(`/api/chartOfAccounts/fetchExpenseTypeById/${id}`);
    }
    fetchExpenseTypeCategoryById(id, id2) {
        return axios.get(`/api/chartOfAccounts/fetchExpenseTypeCategoryById/${id}/${id2}`);
    }
    create(data) {
        return axios.post("/api/chartOfAccounts", data);
    }
    update(id, data) {
        return axios.put(`/api/chartOfAccounts/${id}`, data);
    }
    delete(customer) {
        return axios.delete(`/api/chartOfAccounts/${customer}`);
    }
    deleteAll() {
        return axios.delete(`/api/chartOfAccounts`);
    }
    findByTitle(customerName) {
        return axios.get(`/api/chartOfAccounts/getId/${customerName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new ChartOfAccountService();