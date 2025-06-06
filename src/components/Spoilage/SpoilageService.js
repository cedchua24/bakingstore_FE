// import http from "../../http-common";
import axios from "axios";
class SpoilageService {
    getAll() {
        return axios.get("/api/spoilage");
    }
    get(id) {
        return axios.get(`/api/spoilage/${id}`);
    }
    fetchById(id) {
        return axios.get(`/api/spoilage/fetchById/${id}`);
    }
    fetchspoilageStock(id) {
        return axios.get(`/api/spoilage/fetchspoilageStock/${id}`);
    }
    fetchSpoilageToday(id) {
        return axios.get(`/api/spoilage/fetchSpoilageToday/${id}`);
    }
    fetchSpoilageReportByDate(id) {
        return axios.get(`/api/spoilage/fetchSpoilageReportByDate/${id}`);
    }

    fetchSpoilageReport(data) {
        return axios.post("/api/spoilage/fetchSpoilageReport", data);
    }
    create(data) {
        return axios.post("/api/spoilage", data);
    }
    update(id, data) {
        return axios.put(`/api/spoilage/${id}`, data);
    }
    delete(id) {
        return axios.delete(`/api/spoilage/${id}`);
    }
    deleteAll() {
        return axios.delete(`/api/spoilage`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/spoilage/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new SpoilageService();