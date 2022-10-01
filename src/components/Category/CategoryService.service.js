// import http from "../../http-common";
import axios from "axios";
class CategoryService {
    getAll() {
        return axios.get("/api/categories");
    }
    get(id) {
        return axios.get(`/api/categories/${id}`);
    }
    create(data) {
        return axios.post("/api/categories", data);
    }
    update(id, data) {
        return axios.put(`/api/categories/${id}`, data);
    }
    delete(category) {
        return axios.delete(`/api/categories/${category}`);
    }
    deleteAll() {
        return axios.delete(`/api/categories`);
    }
    findByTitle(categoryName) {
        return axios.get(`/api/categories/getId/${categoryName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new CategoryService();