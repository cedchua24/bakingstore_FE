// import http from "../../http-common";
import axios from "axios";
class CheckListTransactionService {
    getAll() {
        return axios.get("/api/checkListTransaction");
    }
    get(id) {
        return axios.get(`/api/checkListTransaction/${id}`);
    }
    create(data) {
        return axios.post("/api/checkListTransaction", data);
    }
    update(id, data) {
        return axios.put(`/api/checkListTransaction/${id}`, data);
    }
    fetchCheckListByDate(data) {
        return axios.post("/api/checkListTransaction/fetchCheckListByDate", data);
    }
    rejectPending() {
        return axios.patch("/api/checkListTransaction/rejectPending");
    }
    delete(category) {
        return axios.delete(`/api/checkListTransaction/${category}`);
    }
    deleteAll() {
        return axios.delete(`/api/checkListTransaction`);
    }
    findByTitle(categoryName) {
        return axios.get(`/api/checkListTransaction/getId/${categoryName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new CheckListTransactionService();
