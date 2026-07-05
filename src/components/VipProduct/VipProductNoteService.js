import axios from "axios";

class VipProductNoteService {
    getAll() {
        return axios.get("/api/vipProductNote");
    }

    get(id) {
        return axios.get(`/api/vipProductNote/${id}`);
    }

    create(data) {
        return axios.post("/api/vipProductNote", data);
    }

    update(id, data) {
        return axios.put(`/api/vipProductNote/${id}`, data);
    }

    delete(id) {
        return axios.delete(`/api/vipProductNote/${id}`);
    }

    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}

export default new VipProductNoteService();
