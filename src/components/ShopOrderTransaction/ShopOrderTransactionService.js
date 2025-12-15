// import http from "../../http-common";
import axios from "axios";
class ShopOrderTransactionService {
    getAll() {
        return axios.get("/api/shopOrderTransaction");
    }
    get(id) {
        return axios.get(`/api/shopOrderTransaction/${id}`);
    }
    fetchShopOrderTransactionList() {
        return axios.get("/api/shopOrderTransaction/fetchShopOrderTransactionList");
    }
    fetchOnlineShopOrderTransactionList(data) {
        return axios.post("/api/shopOrderTransaction/fetchOnlineShopOrderTransactionList", data);
    }
    fetctProductOrderTransaction(id, data) {
        // return axios.post("/api/customers/customerLastOrderList", data);
        return axios.post(`/api/shopOrderTransaction/fetctProductOrderTransaction/${id}`, data);
    }
    fetchSortedProduct(id) {
        return axios.get(`/api/shopOrderTransaction/fetchSortedProduct/${id}`);
    }
    fetchProductSoldToday(data) {
        return axios.post("/api/shopOrderTransaction/fetchProductSoldToday", data);
    }
    fetchSortedCustomer(id) {
        return axios.get(`/api/shopOrderTransaction/fetchSortedCustomer/${id}`);
    }
    fetchPendingTransactionList(data) {
        return axios.post("/api/shopOrderTransaction/fetchPendingTransactionList", data);
    }
    fetchPendingDeliveryTransaction(data) {
        return axios.post("/api/shopOrderTransaction/fetchPendingDeliveryTransaction", data);
    }
    fetchDeliveryTransaction(data) {
        return axios.post("/api/shopOrderTransaction/fetchDeliveryTransaction", data);
    }
    fetchOnlineShopOrderTransactionListByIdDate(id, date) {
        return axios.get(`/api/shopOrderTransaction/fetchOnlineShopOrderTransactionListByIdDate/${id}/${date}`);
    }
    fetchPrev(id, today, type) {
        return axios.get(`/api/shopOrderTransaction/fetchPrev/${id}/${today}/${type}`);
    }
    fetchOnlineShopOrderTransactionListReport(id) {
        return axios.get(`/api/shopOrderTransaction/fetchOnlineShopOrderTransactionListReport/${id}`);
    }
    fetchOnlineShopOrderTransactionListByDate(date) {
        return axios.get(`/api/shopOrderTransaction/fetchOnlineShopOrderTransactionListByDate/${date}`);
    }
    fetchOnlineShopOrderTransactionListByStatus(status) {
        return axios.get(`/api/shopOrderTransaction/fetchOnlineShopOrderTransactionListByStatus/${status}`);
    }
    fetchOnlineShopOrderTransactionListReportByDate(data) {
        return axios.post("/api/shopOrderTransaction/fetchOnlineShopOrderTransactionListReportByDate", data);
    }
    fetchSalesList(data) {
        return axios.post("/api/shopOrderTransaction/fetchSalesList", data);
    }
    fetchSortedCustomerReport(data) {
        return axios.post("/api/shopOrderTransaction/fetchSortedCustomerReport", data);
    }
    fetchSortedProductReport(data) {
        return axios.post("/api/shopOrderTransaction/fetchSortedProductReport", data);
    }
    fetchSalesByCategory(data) {
        return axios.post("/api/shopOrderTransaction/fetchSalesByCategory", data);
    }

    fetchShopOrderTransactionListReportByDate(data) {
        return axios.post("/api/shopOrderTransaction/fetchShopOrderTransactionListReportByDate", data);
    }
    fetchShopOrderTransactionListByDate(date) {
        return axios.get(`/api/shopOrderTransaction/fetchShopOrderTransactionListByDate/${date}`);
    }
    fetchShopOrderTransaction(id) {
        return axios.get(`/api/shopOrderTransaction/fetchShopOrderTransaction/${id}`);
    }
    updateShopOrderTransactionStatus(id, data) {
        return axios.put(`/api/shopOrderTransaction/updateShopOrderTransactionStatus/${id}`, data);
    }

    // branch
    fetchBranchOrder(id) {
        return axios.get(`/api/shopOrderTransaction/fetchBranchOrder/${id}`);
    }
    create(data) {
        return axios.post("/api/shopOrderTransaction", data);
    }

    update(id, data) {
        return axios.put(`/api/shopOrderTransaction/${id}`, data);
    }
    delete(brand) {
        return axios.delete(`/api/shopOrderTransaction/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/shopOrderTransaction`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/shopOrderTransaction/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new ShopOrderTransactionService();