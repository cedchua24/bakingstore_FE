import axios from "axios";

class VipProductService {
    getAll() {
        return axios.get("/api/vipProduct");
    }

    get(id) {
        return axios.get(`/api/vipProduct/${id}`);
    }

    create(data) {
        return axios.post("/api/vipProduct", data);
    }

    update(id, data) {
        return axios.put(`/api/vipProduct/${id}`, data);
    }

    delete(id) {
        return axios.delete(`/api/vipProduct/${id}`);
    }

    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}

export default new VipProductService();
