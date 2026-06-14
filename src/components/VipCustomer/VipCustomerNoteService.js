// import http from "../../http-common";
import axios from "axios";

class VipCustomerNoteService {
    getAll() {
        return axios.get("/api/vipCustomerNote");
    }

    get(id) {
        return axios.get(`/api/vipCustomerNote/${id}`);
    }

    create(data) {
        return axios.post("/api/vipCustomerNote", data);
    }

    update(id, data) {
        return axios.put(`/api/vipCustomerNote/${id}`, data);
    }

    delete(id) {
        return axios.delete(`/api/vipCustomerNote/${id}`);
    }

    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}

export default new VipCustomerNoteService();
