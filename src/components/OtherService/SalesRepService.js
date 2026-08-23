// import http from "../../http-common";
import axios from "axios";
class SalesRepervice {

    getAll() {
        return axios.get("/api/salesRep");
    }
    fetchRequests() {
        return axios.get("/api/salesRep/fetchRequests");
    }
    get(id) {
        return axios.get(`/api/salesRep/${id}`);
    }
    create(data) {
        return axios.post("/api/salesRep", data);
    }
    update(id, data) {
        return axios.put(`/api/salesRep/${id}`, data);
    }
    delete(brand, data) {
        return axios.delete(`/api/salesRep/${brand}`, data);
    }
    deleteAll() {
        return axios.delete(`/api/salesRep`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new SalesRepervice();
