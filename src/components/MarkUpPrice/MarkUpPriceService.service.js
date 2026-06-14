import http from "../../http-common";
import axios from "axios";
class MarkUpPriceService {
    getAll() {
        return axios.get("/api/markUpPrice");
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

    fetchMarkupByProductId(id) {
        return axios.get(`/api/markUpPrice/fetchMarkupByProductId/${id}`);
    }
    fetchMarkUpShoporder(id) {
        return axios.get(`/api/markUpPrice/fetchMarkUpShoporder/${id}`);
    }
    update(id, data) {
        return axios.put(`/api/markUpPrice/${id}`, data);
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