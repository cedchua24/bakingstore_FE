// import http from "../../http-common";
import axios from "axios";
class CheckListHistoryService {
    getAll() {
        return axios.get("/api/checkListHistory");
    }
    get(id) {
        return axios.get(`/api/checkListHistory/${id}`);
    }
    create(data) {
        return axios.post("/api/checkListHistory", data);
    }
    update(id, data) {
        return axios.put(`/api/checkListHistory/${id}`, data);
    }
    fetchByCheckListTransactionId(id) {
        return axios.get(`/api/checkListHistory/fetchByCheckListTransactionId/${id}`);
    }
    delete(id) {
        return axios.delete(`/api/checkListHistory/${id}`);
    }
    deleteAll() {
        return axios.delete(`/api/checkListHistory`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new CheckListHistoryService();
