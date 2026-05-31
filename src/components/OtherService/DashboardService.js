// import http from "../../http-common";
import axios from "axios";
class DashboardService {
    getAll() {
        return axios.get("/api/dashboard");
    }
    get(id) {
        return axios.get(`/api/dashboard/${id}`);
    }
    create(data) {
        return axios.post("/api/dashboard", data);
    }
    update(id, data) {
        return axios.put(`/api/dashboard/${id}`, data);
    }
    // submitStartOfDay(id) {
    //     return axios.get(`/api/dashboard/submitStartOfDay/${id}`, {
    //         responseType: 'blob', // 👈 ensures Excel file is treated as binary
    //         withCredentials: true, // 👈 if using Laravel Sanctum or cookies
    //     });
    // }

    submitStartOfDay(id, data) {
        return axios.post(`/api/dashboard/submitStartOfDay/${id}`, data, {
            responseType: 'blob',
            withCredentials: true,
        });
    }

    submitExportPriceList(id, data) {
        return axios.post(`/api/dashboard/submitExportPriceList/${id}`, data, {
            responseType: 'blob',
            withCredentials: true,
        });
    }

    delete(brand, data) {
        return axios.delete(`/api/dashboard/${brand}`, data);
    }
    deleteAll() {
        return axios.delete(`/api/dashboard`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new DashboardService();