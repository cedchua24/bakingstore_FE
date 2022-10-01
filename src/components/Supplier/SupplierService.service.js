// import http from "../../http-common";
import axios from "axios";
class SupplierService {
    getAll() {
        return axios.get("/api/suppliers");
    }
    get(id) {
        return axios.get(`/api/suppliers/${id}`);
    }
    create(data) {
        return axios.post("/api/suppliers", data);
    }
    update(id, data) {
        return axios.put(`/api/suppliers/${id}`, data);
    }
    delete(supplier) {
        return axios.delete(`/api/suppliers/${supplier}`);
    }
    deleteAll() {
        return axios.delete(`/api/suppliers`);
    }
    findByTitle(supplierName) {
        return axios.get(`/api/suppliers/getId/${supplierName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new SupplierService();