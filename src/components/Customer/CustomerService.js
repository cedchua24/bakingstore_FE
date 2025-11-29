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
  fetchAllCustomer(id) {
    return axios.get(`/api/customers/fetchAllCustomer/${id}`);
  }
  customerLastOrderList(id, data) {
    // return axios.post("/api/customers/customerLastOrderList", data);
    return axios.post(`/api/customers/customerLastOrderList/${id}`, data);
  }
  customerBacklogList(id, data) {
    // return axios.post("/api/customers/customerLastOrderList", data);
    return axios.post(`/api/customers/customerBacklogList/${id}`, data);
  }
  customerConvoList(id, data) {
    // return axios.post("/api/customers/customerLastOrderList", data);
    return axios.post(`/api/customers/customerConvoList/${id}`, data);
  }
  customerReorder(id, data) {
    // return axios.post("/api/customers/customerLastOrderList", data);
    return axios.post(`/api/customers/customerReorder/${id}`, data);
  }
  fetchCustomerByDate(data) {
    return axios.post("/api/customers/fetchCustomerByDate", data);
  }
  fetchCustomerAds(data) {
    return axios.post("/api/customers/fetchCustomerAds", data);
  }
  fetchCustomerTransactionListByDate(data) {
    return axios.post("/api/customers/fetchCustomerTransactionListByDate", data);
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