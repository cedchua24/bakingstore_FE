import http from "../../http-common";
import axios from "axios";
class ProductService {
    getAll() {
        return axios.get("/api/products");
    }
    get(id) {
        return axios.get(`/api/products/${id}`);
    }
    fetchProductByCategoryId(id) {
        return axios.get(`/api/products/fetchProductByCategoryId/${id}`);
    }
    fetchProductByCategoryIdV2(id) {
        return axios.get(`/api/products/fetchProductByCategoryIdV2/${id}`);
    }
    fetchByStockWarning(id) {
        return axios.get(`/api/products/fetchByStockWarning/${id}`);
    }

    create(data) {
        return axios.post("/api/products", data);
    }
    update(id, data) {
        return axios.put(`/api/products/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/products/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/products`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/products/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new ProductService();