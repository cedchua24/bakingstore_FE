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
  fetchCustomerTransaction(data) {
    return axios.post("/api/customers/fetchCustomerTransaction", data);
  }
  fetchCustomerTransactionV2(data) {
    return axios.post("/api/customers/fetchCustomerTransactionV2", data);
  }
  fetchCustomerToDelete(id) {
    return axios.get(`/api/customers/fetchCustomerToDelete/${id}`);
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
  customerLastOrderListV2(data) {
    return axios.post("/api/v2/customers/customerLastOrderList", data);
  }
  customerLastOrderAllListV2(data) {
    return axios.post("/api/customers/customerLastOrderAllListV2", data);
  }
  updateAndDeleteCustomer(data) {
    return axios.post("/api/customers/updateAndDeleteCustomer", data);
  }
  customerBacklogList(id, data) {
    // return axios.post("/api/customers/customerLastOrderList", data);
    return axios.post(`/api/customers/customerBacklogList/${id}`, data);
  }
  customerConvoList(id, data) {
    // return axios.post("/api/customers/customerLastOrderList", data);
    return axios.post(`/api/customers/customerConvoList/${id}`, data);
  }
  customerConvoListV2(data) {
    return axios.post("/api/v2/customers/customerConvoList", data);
  }
  customerReorder(id, data) {
    // return axios.post("/api/customers/customerLastOrderList", data);
    return axios.post(`/api/customers/customerReorder/${id}`, data);
  }
  customerReorderV2(data) {
    return axios.post("/api/customers/customerReorderV2", data);
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

  searchVipCustomerList(data) {
    return axios.post("/api/customers/searchVipCustomerList", data);
  }

  fetchCustomerSalesHistory(id, data) {
    return axios.post(`/api/customers/fetchCustomerSalesHistory/${id}`, data);
  }


  fetchCustomerProduct(data) {
    return axios.post("/api/customers/fetchCustomerProduct", data);
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
