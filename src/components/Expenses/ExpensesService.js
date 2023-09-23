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
    fetchExpensesTransaction(id) {
        return axios.get(`/api/expenses/fetchExpensesTransaction/${id}`);
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