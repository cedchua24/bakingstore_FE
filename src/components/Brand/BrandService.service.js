// import http from "../../http-common";
import axios from "axios";
class BrandService {
  getAll() {
    return axios.get("/api/brands");
  }
  get(id) {
    return axios.get(`/api/brands/${id}`);
  }
  create(data) {
    return axios.post("/api/brands", data);
  }
  update(id, data) {
    return axios.put(`/api/brands/${id}`, data);
  }
  delete(brand) {
    return axios.delete(`/api/brands/${brand}`);
  }
  deleteAll() {
    return axios.delete(`/api/brands`);
  }
  findByTitle(brandName) {
    return axios.get(`/api/brands/getId/${brandName}`);
  }
  sanctum() {
    return axios.get("/sanctum/csrf-cookie");
  }
}
export default new BrandService();