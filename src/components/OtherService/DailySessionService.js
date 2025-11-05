// import http from "../../http-common";
import axios from "axios";
class DailySessionService {
    getAll() {
        return axios.get("/api/dailySession");
    }
    get(id) {
        return axios.get(`/api/dailySession/${id}`);
    }
    create(data) {
        return axios.post("/api/dailySession", data);
    }
    update(id, data) {
        return axios.put(`/api/dailySession/${id}`, data);
    }
    fetchDailySessionByDate(id) {
        return axios.get(`/api/dailySession/fetchDailySessionByDate/${id}`);
    }
    fetchDailySession(id) {
        return axios.get(`/api/dailySession/fetchDailySession/${id}`);
    }
    delete(brand, data) {
        return axios.delete(`/api/dailySession/${brand}`, data);
    }
    deleteAll() {
        return axios.delete(`/api/dailySession`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new DailySessionService();