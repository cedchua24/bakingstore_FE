// import http from "../../http-common";
import axios from "axios";
class CheckListService {
    getAll() {
        return axios.get("/api/checkList");
    }
    get(id) {
        return axios.get(`/api/checkList/${id}`);
    }
    create(data) {
        return axios.post("/api/checkList", data);
    }
    update(id, data) {
        return axios.put(`/api/checkList/${id}`, data);
    }
    delete(category) {
        return axios.delete(`/api/checkList/${category}`);
    }
    deleteAll() {
        return axios.delete(`/api/checkList`);
    }
    findByTitle(categoryName) {
        return axios.get(`/api/checkList/getId/${categoryName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new CheckListService();