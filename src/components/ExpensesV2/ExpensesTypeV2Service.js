// import http from "../../http-common";
import axios from "axios";
class ExpensesTypeV2Service {
    getAll() {
        return axios.get("/api/expensesTypeV2");
    }
    get(id) {
        return axios.get(`/api/expensesTypeV2/${id}`);
    }
    getExpensesCategory() {
        // return axios.get(`/api/expensesTypeV2/getExpensesCategory/${id}`);
        return axios.get("/api/expensesTypeV2/getExpensesCategory");
    }
    fetchExpenseTypeTransaction(id) {
        return axios.get(`/api/expensesTypeV2/fetchExpenseTypeTransaction/${id}`);
    }
    fetchExpenseTypeById(id) {
        return axios.get(`/api/expensesTypeV2/fetchExpenseTypeById/${id}`);
    }
    fetchExpenseTypeCategoryById(id, id2) {
        return axios.get(`/api/expensesTypeV2/fetchExpenseTypeCategoryById/${id}/${id2}`);
    }
    fetchTypeByChart(id) {
        return axios.get(`/api/expensesTypeV2/fetchTypeByChart/${id}`);
    }
    create(data) {
        return axios.post("/api/expensesTypeV2", data);
    }
    update(id, data) {
        return axios.put(`/api/expensesTypeV2/${id}`, data);
    }
    delete(customer) {
        return axios.delete(`/api/expensesTypeV2/${customer}`);
    }
    deleteAll() {
        return axios.delete(`/api/expensesTypeV2`);
    }
    findByTitle(customerName) {
        return axios.get(`/api/expensesTypeV2/getId/${customerName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new ExpensesTypeV2Service();