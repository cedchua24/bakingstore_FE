// import http from "../../http-common";
import axios from "axios";
class balanceTypeService {
    getAll() {
        return axios.get("/api/balanceType");
    }
    get(id) {
        return axios.get(`/api/balanceType/${id}`);
    }
    fetchShopOrderDTO(id) {
        return axios.get(`/api/balanceType/fetchShopOrderDTO/${id}`);
    }
    fetchbalanceTypeById(data) {
        return axios.post("/api/balanceType/fetchbalanceTypeById", data);
    }
    create(data) {
        return axios.post("/api/balanceType", data);
    }
    update(id, data) {
        return axios.put(`/api/balanceType/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/balanceType/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/balanceType`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/balanceType/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new balanceTypeService();