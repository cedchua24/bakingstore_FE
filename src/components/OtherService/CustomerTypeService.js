// import http from "../../http-common";
import axios from "axios";
class CustomerTypeService {
    getAll() {
        return axios.get("/api/customerTypes");
    }
    get(id) {
        return axios.get(`/api/customerTypes/${id}`);
    }
    fetchShopOrderDTO(id) {
        return axios.get(`/api/customerTypes/fetchShopOrderDTO/${id}`);
    }
    fetchBranchStockWarehouseList(id) {
        return axios.get(`/api/customerTypes/fetchBranchStockWarehouseList/${id}`);
    }
    create(data) {
        return axios.post("/api/customerTypes", data);
    }
    update(id, data) {
        return axios.put(`/api/customerTypes/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/customerTypes/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/customerTypes`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/customerTypes/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new CustomerTypeService();