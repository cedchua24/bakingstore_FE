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
    fetchById(id) {
        return axios.get(`/api/products/fetchById/${id}`);
    }
    fetchProductByCategoryIdV2(id) {
        return axios.get(`/api/products/fetchProductByCategoryIdV2/${id}`);
    }
    fetchProductListV2(id) {
        return axios.get(`/api/products/fetchProductListV2/${id}`);
    }
    fetchProductToNotify(id) {
        return axios.get(`/api/products/fetchProductToNotify/${id}`);
    }
    fetchProductListNote(id) {
        return axios.get(`/api/products/fetchProductListNote/${id}`);
    }
    fetchProductListExpiration(id) {
        return axios.get(`/api/products/fetchProductListExpiration/${id}`);
    }
    fetchOrderSupplierExpirationList(id) {
        return axios.get(`/api/products/fetchOrderSupplierExpirationList/${id}`);
    }
    fetchProductValue(id) {
        return axios.get(`/api/products/fetchProductValue/${id}`);
    }
    fetchByStockWarning(id) {
        return axios.get(`/api/products/fetchByStockWarning/${id}`);
    }
    fetchNoStockWarning(id) {
        return axios.get(`/api/products/fetchNoStockWarning/${id}`);
    }
    fetchOutOfStock(id) {
        return axios.get(`/api/products/fetchOutOfStock/${id}`);
    }
    fetchStockWarningPerSupplier(id) {
        return axios.get(`/api/products/fetchStockWarningPerSupplier/${id}`);
    }
    fetchStockPerSupplier(id) {
        return axios.get(`/api/products/fetchStockPerSupplier/${id}`);
    }
    fetchProductListDisabled(id) {
        return axios.get(`/api/products/fetchProductListDisabled/${id}`);
    }
    fetchModifiedStockDaily(id) {
        return axios.get(`/api/products/fetchModifiedStockDaily/${id}`);
    }
    fetchPendingProduct(data) {
        return axios.post("/api/products/fetchPendingProduct", data);
    }
    fetchModifiedReportList(data) {
        return axios.post("/api/products/fetchModifiedReportList", data);
    }
    getUnsoldProducts(data) {
        return axios.post("/api/products/getUnsoldProducts", data);
    }
    create(data) {
        return axios.post("/api/products", data);
    }
    testController(data) {
        return axios.post("/api/products/testController", data);
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