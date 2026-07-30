import http from "../../http-common";
import axios from "axios";
class MarkUpPriceService {
    getAll() {
        return axios.get("/api/markUpPrice");
    }
    catalog(params = {}) {
        return axios.get("/api/markUpPrice/catalog", { params });
    }
    get(id) {
        return axios.get(`/api/markUpPrice/${id}`);
    }
    create(data) {
        return axios.post("/api/markUpPrice", data);
    }
    saveMarkUp(data) {
        return axios.post("/api/markUpPrice/saveMarkUp", data);
    }
    fetchMarkUpBySupplierId(id) {
        return axios.get(`/api/markUpPrice/fetchMarkUpBySupplierId/${id}`);
    }
    indexLimit100() {
        return axios.get("/api/markUpPrice/indexLimit100");
    }
    productsWithoutMarkup() {
        return axios.get("/api/markUpPrice/productsWithoutMarkup");
    }
    supplierPriceChanges(params = {}) {
        return axios.get("/api/markUpPrice/supplierPriceChanges", { params });
    }
    salesAvailability() {
        return axios.get("/api/markUpPrice/salesAvailability");
    }

    fetchMarkupByProductId(id) {
        return axios.get(`/api/markUpPrice/fetchMarkupByProductId/${id}`);
    }
    fetchMarkUpShoporder(id) {
        return axios.get(`/api/markUpPrice/fetchMarkUpShoporder/${id}`);
    }
    replace(data) {
        return axios.post("/api/markUpPrice/replace", data);
    }
    delete(brand) {
        return axios.delete(`/api/markUpPrice/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/markUpPrice`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/markUpPrice/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new MarkUpPriceService();
