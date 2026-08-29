// import http from "../../http-common";
import axios from "axios";
class ExpenseTransactionService {
    getAll() {
        return axios.get("/api/expenseTransaction");
    }
    get(id) {
        return axios.get(`/api/expenseTransaction/${id}`);
    }
    getExpensesCategory() {
        // return axios.get(`/api/expenseTransaction/getExpensesCategory/${id}`);
        return axios.get("/api/expenseTransaction/getExpensesCategory");
    }
    fetchExpenseTransactionList(id) {
        return axios.get(`/api/expenseTransaction/fetchExpenseTransactionList/${id}`);
    }
    fetchExpenseTransactionById(id) {
        return axios.get(`/api/expenseTransaction/fetchExpenseTransactionById/${id}`);
    }
    fetchExpenseV2ById(id) {
        return axios.get(`/api/expenseTransaction/fetchExpenseV2ById/${id}`);
    }
    searchExpenseTransactionList(data) {
        return axios.post("/api/expenseTransaction/searchExpenseTransactionList", data);
    }
    searchExpenseTransactionListV2(data) {
        return axios.post("/api/expenseTransaction/searchExpenseTransactionListV2", data);
    }
    getMonthlyExpenseComparisonV2(data) {
        return axios.post("/api/expenseTransaction/getMonthlyExpenseComparisonV2", data);
    }
    searchAllExpenseTransactionList(data) {
        return axios.post("/api/expenseTransaction/searchAllExpenseTransactionList", data);
    }
    getTotalExpense(data) {
        return axios.post("/api/expenseTransaction/getTotalExpense", data);
    }
    getTotalExpenseWithFilters(data) {
        return axios.post("/api/expenseTransaction/getTotalExpenseWithFilters", data);
    }
    create(data) {
        return axios.post("/api/expenseTransaction", data);
    }
    update(id, data) {
        return axios.put(`/api/expenseTransaction/${id}`, data);
    }
    delete(customer) {
        return axios.delete(`/api/expenseTransaction/${customer}`);
    }
    deleteAll() {
        return axios.delete(`/api/expenseTransaction`);
    }
    findByTitle(customerName) {
        return axios.get(`/api/expenseTransaction/getId/${customerName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new ExpenseTransactionService();
