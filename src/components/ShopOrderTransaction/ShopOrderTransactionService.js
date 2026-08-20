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
    fetchOnlineShopOrderTransactionListV2(data) {
        return axios.post("/api/shopOrderTransaction/fetchOnlineShopOrderTransactionListV2", data);
    }
    fetctProductOrderTransaction(id, data) {
        // return axios.post("/api/customers/customerLastOrderList", data);
        return axios.post(`/api/shopOrderTransaction/fetctProductOrderTransaction/${id}`, data);
    }
    fetctProductOrderTransactionV2(id, data) {
        return axios.post(`/api/shopOrderTransaction/fetctProductOrderTransactionV2/${id}`, data);
    }
    fetchProductSoldHistory(id, data) {
        return axios.post(`/api/shopOrderTransaction/fetchProductSoldHistory/${id}`, data);
    }
    fetctPendingProductOrderTransaction(id, data) {
        // return axios.post("/api/customers/customerLastOrderList", data);
        return axios.post(`/api/shopOrderTransaction/fetctPendingProductOrderTransaction/${id}`, data);
    }
    fetctPendingProductOrderTransactionV2(id, data) {
        return axios.post(`/api/shopOrderTransaction/fetctPendingProductOrderTransactionV2/${id}`, data);
    }
    fetchSortedProduct(id) {
        return axios.get(`/api/shopOrderTransaction/fetchSortedProduct/${id}`);
    }
    fetchCustomerDetails(id) {
        return axios.get(`/api/shopOrderTransaction/fetchCustomerDetails/${id}`);
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
    fetchPendingTransactionListV2(data) {
        return axios.post("/api/shopOrderTransaction/fetchPendingTransactionListV2", data);
    }
    fetchPendingDeliveryTransaction(data) {
        return axios.post("/api/shopOrderTransaction/fetchPendingDeliveryTransaction", data);
    }
    fetchPendingDeliveryTransactionV2(data) {
        return axios.post("/api/shopOrderTransaction/fetchPendingDeliveryTransactionV2", data);
    }
    fetchDeliveryTransaction(data) {
        return axios.post("/api/shopOrderTransaction/fetchDeliveryTransaction", data);
    }
    fetchDeliveryTransactionV2(data) {
        return axios.post("/api/shopOrderTransaction/fetchDeliveryTransactionV2", data);
    }
    fetchOnlineShopOrderTransactionListByIdDate(id, date) {
        return axios.get(`/api/shopOrderTransaction/fetchOnlineShopOrderTransactionListByIdDate/${id}/${date}`);
    }
    fetchOnlineShopOrderTransactionListByIdDateV2(id, date) {
        return axios.get(`/api/shopOrderTransaction/fetchOnlineShopOrderTransactionListByIdDateV2/${id}/${date}`);
    }
    fetchPrev(id, today, type) {
        return axios.get(`/api/shopOrderTransaction/fetchPrev/${id}/${today}/${type}`);
    }
    fetchPrevV2(id, today, type) {
        return axios.get(`/api/shopOrderTransaction/fetchPrevV2/${id}/${today}/${type}`);
    }
    fetchOnlineShopOrderTransactionListReport(id) {
        return axios.get(`/api/shopOrderTransaction/fetchOnlineShopOrderTransactionListReport/${id}`);
    }
    fetchOnlineShopOrderTransactionListByDate(date) {
        return axios.get(`/api/shopOrderTransaction/fetchOnlineShopOrderTransactionListByDate/${date}`);
    }
    fetchOnlineShopOrderTransactionListByDateV2(date) {
        return axios.get(`/api/shopOrderTransaction/fetchOnlineShopOrderTransactionListByDateV2/${date}`);
    }
    fetchOnlineShopOrderTransactionListByDateRangeV2(data) {
        return axios.post("/api/shopOrderTransaction/fetchOnlineShopOrderTransactionListByDateRangeV2", data);
    }
    fetchPendingPickUp(data) {
        return axios.post("/api/shopOrderTransaction/fetchPendingPickUp", data);
    }
    fetchPendingPickUpV2(data) {
        return axios.post("/api/shopOrderTransaction/fetchPendingPickUpV2", data);
    }
    fetchOnlineShopOrderTransactionListByStatus(status) {
        return axios.get(`/api/shopOrderTransaction/fetchOnlineShopOrderTransactionListByStatus/${status}`);
    }
    fetchOnlineShopOrderTransactionListByStatusV2(status) {
        return axios.get(`/api/shopOrderTransaction/fetchOnlineShopOrderTransactionListByStatusV2/${status}`);
    }
    fetchOnlineShopOrderTransactionListReportByDate(data) {
        return axios.post("/api/shopOrderTransaction/fetchOnlineShopOrderTransactionListReportByDate", data);
    }
    fetchSalesList(data) {
        return axios.post("/api/shopOrderTransaction/fetchSalesList", data);
    }
    fetchSalesListV2(data) {
        return axios.post("/api/shopOrderTransaction/fetchSalesListV2", data);
    }
    fetchEmployeePrepare(data) {
        return axios.post("/api/shopOrderTransaction/fetchEmployeePrepare", data);
    }
    fetchEmployeeChecker(data) {
        return axios.post("/api/shopOrderTransaction/fetchEmployeeChecker", data);
    }
    fetchEmployeeDispatcher(data) {
        return axios.post("/api/shopOrderTransaction/fetchEmployeeDispatcher", data);
    }
    fetchEmployeeSales(data) {
        return axios.post("/api/shopOrderTransaction/fetchEmployeeSales", data);
    }
    fetchSortedCustomerReport(data) {
        return axios.post("/api/shopOrderTransaction/fetchSortedCustomerReport", data);
    }
    fetchSortedProductReport(data) {
        return axios.post("/api/shopOrderTransaction/fetchSortedProductReport", data);
    }
    fetchMonthlyProductSalesComparison(data) {
        return axios.post("/api/shopOrderTransaction/fetchMonthlyProductSalesComparison", data);
    }
    fetchMonthlyProductCustomerImpact(data) {
        return axios.post("/api/shopOrderTransaction/fetchMonthlyProductCustomerImpact", data);
    }
    fetchMonthlyCustomerSalesComparison(data) {
        return axios.post("/api/shopOrderTransaction/fetchMonthlyCustomerSalesComparison", data);
    }
    fetchSalesByCategory(data) {
        return axios.post("/api/shopOrderTransaction/fetchSalesByCategory", data);
    }
    pickUpAndCustomerUpdate(data) {
        return axios.post("/api/shopOrderTransaction/pickUpAndCustomerUpdate", data);
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
    updateShopOrderTransactionStatusV2(id, data) {
        return axios.put(`/api/shopOrderTransaction/updateShopOrderTransactionStatusV2/${id}`, data);
    }
    updateShopBranchStatus(id, data) {
        return axios.put(`/api/shopOrderTransaction/updateShopBranchStatus/${id}`, data);
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
