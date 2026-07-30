import axios from "axios";
class OrderSupplierService {
    getAll() {
        return axios.get("/api/orderSuppliers");
    }
    get(id) {
        return axios.get(`/api/orderSuppliers/${id}`);
    }
    create(data) {
        return axios.post("/api/orderSuppliers", data);
    }
    update(id, data) {
        return axios.put(`/api/orderSuppliers/${id}`, data);
    }
    setToActiveExpiration(data) {
        return axios.post("/api/orderSuppliers/setToActiveExpiration", data);
    }
    saveAutoPo(data) {
        return axios.post("/api/orderSuppliers/saveAutoPo", data);
    }
    delete(brand) {
        return axios.delete(`/api/orderSuppliers/${brand}`);
    }
    deleteAll() {
        return axios.delete(`/api/orderSuppliers`);
    }
    findById(id) {
        return axios.get(`/api/orderSuppliers/fetchOrderByTransactionId/${id}`);
    }
    fetchApprovalPO(id) {
        return axios.get(`/api/orderSuppliers/fetchApprovalPO/${id}`);
    }
    fetchApprovalPOBranch(id) {
        return axios.get(`/api/orderSuppliers/fetchApprovalPOBranch/${id}`);
    }
    fetchApprovalPOByDateRanges(id, data) {
        return axios.post(`/api/orderSuppliers/fetchApprovalPOByDateRanges/${id}`, data);
    }
    fetchApprovalPOBranchByDateRanges(id, data) {
        return axios.post(`/api/orderSuppliers/fetchApprovalPOBranchByDateRanges/${id}`, data);
    }
    fetchOrderBySupplierId(id) {
        return axios.get(`/api/orderSuppliers/fetchOrderBySupplierId/${id}`);
    }
    fetchOrderByProductId(id) {
        return axios.get(`/api/orderSuppliers/fetchOrderByProductId/${id}`);
    }
    fetchPriceHistory(productId) {
        return axios.get(`/api/orderSuppliers/priceHistory/${productId}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}
export default new OrderSupplierService();
