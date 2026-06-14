// import http from "../../http-common";
import axios from "axios";

class VipCustomerService {
    getAll() {
        return axios.get("/api/vipCustomer");
    }

    get(id) {
        return axios.get(`/api/vipCustomer/${id}`);
    }

    create(data) {
        return axios.post("/api/vipCustomer", data);
    }

    update(id, data) {
        return axios.put(`/api/vipCustomer/${id}`, data);
    }

    delete(id) {
        return axios.delete(`/api/vipCustomer/${id}`);
    }

    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}

export default new VipCustomerService();
