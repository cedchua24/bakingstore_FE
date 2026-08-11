// import http from "../../http-common";
import axios from "axios";
class ExpensesCategoryV2Service {
    getAll() {
        return axios.get("/api/expensesCategoryV2");
    }
    get(id) {
        return axios.get(`/api/expensesCategoryV2/${id}`);
    }
    getExpensesCategory() {
        // return axios.get(`/api/expensesCategoryV2/getExpensesCategory/${id}`);
        return axios.get("/api/expensesCategoryV2/getExpensesCategory");
    }
    fetchExpenseCategoryById(id) {
        return axios
            .get(`/api/expensesCategoryV2/fetchExpenseCategoryById/${id}`)
            .then((response) => ({
                ...response,
                data: Array.isArray(response.data)
                    ? [...response.data].sort((a, b) =>
                        String(a.expense_category_name || "").localeCompare(
                            String(b.expense_category_name || ""),
                            undefined,
                            { sensitivity: "base", numeric: true }
                        )
                    )
                    : response.data,
            }));
    }
    create(data) {
        return axios.post("/api/expensesCategoryV2", data);
    }
    update(id, data) {
        return axios.put(`/api/expensesCategoryV2/${id}`, data);
    }
    delete(customer) {
        return axios.delete(`/api/expensesCategoryV2/${customer}`);
    }
    deleteAll() {
        return axios.delete(`/api/expensesCategoryV2`);
    }
    findByTitle(customerName) {
        return axios.get(`/api/expensesCategoryV2/getId/${customerName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new ExpensesCategoryV2Service();
