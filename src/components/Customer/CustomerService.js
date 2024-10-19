// import http from "../../http-common";
import axios from "axios";
class CustomerService {
  getAll() {
    return axios.get("/api/customers");
  }
  fetchCustomerEnabled(date) {
    return axios.get(`/api/customers/fetchCustomerEnabled/${date}`);
  }
  get(id) {
    return axios.get(`/api/customers/${id}`);
  }
  fetchCustomerTransaction(id) {
    return axios.get(`/api/customers/fetchCustomerTransaction/${id}`);
  }
  fetchCustomerTransactionList(id) {
    return axios.get(`/api/customers/fetchCustomerTransactionList/${id}`);
  }
  fetchCustomerProduct(id) {
    return axios.get(`/api/customers/fetchCustomerProduct/${id}`);
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