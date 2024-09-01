// import http from "../../http-common";
import axios from "axios";
class ExpensesService {
    getAll() {
        return axios.get("/api/expenses");
    }
    get(id) {
        return axios.get(`/api/expenses/${id}`);
    }
    create(data) {
        return axios.post("/api/expenses", data);
    }
    update(id, data) {
        return axios.put(`/api/expenses/${id}`, data);
    }
    delete(customer) {
        return axios.delete(`/api/expenses/${customer}`);
    }
    deleteAll() {
        return axios.delete(`/api/expenses`);
    }
    findByTitle(customerName) {
        return axios.get(`/api/expenses/getId/${customerName}`);
    }
    fetchExpenseById(id) {
        return axios.get(`/api/expenses/fetchExpenseById/${id}`);
    }
    fetchExpensesTransaction(id) {
        return axios.get(`/api/expenses/fetchExpensesTransaction/${id}`);
    }
    fetchExpensesTransactionToday(id) {
        return axios.get(`/api/expenses/fetchExpensesTransactionToday/${id}`);
    }
    fetchExpensesByDate(id) {
        return axios.get(`/api/expenses/fetchExpensesByDate/${id}`);
    }
    fetchExpensesNonMandatoryToday(id) {
        return axios.get(`/api/expenses/fetchExpensesNonMandatoryToday/${id}`);
    }
    fetchExpensesMandatoryToday(id) {
        return axios.get(`/api/expenses/fetchExpensesMandatoryToday/${id}`);
    }

    fetchExpensesTransactionById(id) {
        return axios.get(`/api/expenses/fetchExpensesTransactionById/${id}`);
    }
    fetchExpensesTransactionByDate(data) {
        return axios.post("/api/expenses/fetchExpensesTransactionByDate", data);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new ExpensesService();