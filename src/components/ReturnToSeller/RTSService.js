// import http from "../../http-common";
import axios from "axios";
class RTSService {
    getAll() {
        return axios.get("/api/rts");
    }
    get(id) {
        return axios.get(`/api/rts/${id}`);
    }
    fetchById(id) {
        return axios.get(`/api/rts/fetchById/${id}`);
    }
    fetchrtsStock(id) {
        return axios.get(`/api/rts/fetchrtsStock/${id}`);
    }
    fetchrtsToday(id) {

        return axios.get(`/api/rts/fetchrtsToday/${id}`);
    }
    fetchrtsReportByDate(id) {
        return axios.get(`/api/rts/fetchrtsReportByDate/${id}`);
    }

    fetchrtsReport(data) {
        return axios.post("/api/rts/fetchrtsReport", data);
    }
    create(data) {
        return axios.post("/api/rts", data);
    }
    update(id, data) {
        return axios.put(`/api/rts/${id}`, data);
    }
    delete(id) {
        return axios.delete(`/api/rts/${id}`);
    }
    deleteAll() {
        return axios.delete(`/api/rts`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/rts/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new RTSService();