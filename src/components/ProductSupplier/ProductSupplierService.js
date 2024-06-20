// import http from "../../http-common";
import axios from "axios";
class ProductSupplierService {
    getAll() {
        return axios.get("/api/productSupplier");
    }
    get(id) {
        return axios.get(`/api/productSupplier/${id}`);
    }
    fetchShopList() {
        return axios.get(`/api/productSupplier/fetchShopList`);
    }
    fetchProductSupplierById(id) {
        return axios.get(`/api/productSupplier/fetchProductSupplierById/${id}`);
    }
    create(data) {
        return axios.post("/api/productSupplier", data);
    }
    update(id, data) {
        return axios.put(`/api/productSupplier/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/productSupplier/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/productSupplier`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/productSupplier/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new ProductSupplierService();