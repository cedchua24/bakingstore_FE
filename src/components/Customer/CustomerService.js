// import http from "../../http-common";
import axios from "axios";
class CustomerService {
  getAll() {
    return axios.get("/api/customers");
  }
  get(id) {
    return axios.get(`/api/customers/${id}`);
  }
  create(data) {
    return axios.post("/api/customers", data);
  }
  update(id, data) {
    return axios.put(`/api/customers/${id}`, data);
  }
  delete(customer) {
    return axios.delete(`/api/customers/${customer}`);
  }
  deleteAll() {
    return axios.delete(`/api/customers`);
  }
  findByTitle(customerName) {
    return axios.get(`/api/customers/getId/${customerName}`);
  }
  sanctum() {
    return axios.get("/sanctum/csrf-cookie");
  }
}
export default new CustomerService();