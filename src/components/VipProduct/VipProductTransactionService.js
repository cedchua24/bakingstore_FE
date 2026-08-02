import axios from "axios";

class VipProductTransactionService {
    getAll() {
        return axios.get("/api/vipProductTransaction");
    }

    get(id) {
        return axios.get(`/api/vipProductTransaction/${id}`);
    }

    fetchVipTransactionByVipId(id) {
        return axios.get(`/api/vipProductTransaction/fetchVipTransactionByVipId/${id}`);
    }

    fetchVipProductLastOrder(id, dateFrom, dateTo) {
        return axios.get(`/api/vipProductTransaction/fetchVipProductLastOrder/${id}`, {
            params: {
                date_from: dateFrom,
                date_to: dateTo,
            },
        });
    }

    fetchVipProductMonthlySold(id, month, filters = {}) {
        return axios.get(`/api/vipProductTransaction/fetchVIPProductMonthlySold/${id}`, {
            params: { ...(month ? { month } : {}), ...filters },
        });
    }

    create(data) {
        return axios.post("/api/vipProductTransaction", data);
    }

    update(id, data) {
        return axios.put(`/api/vipProductTransaction/${id}`, data);
    }

    delete(id) {
        return axios.delete(`/api/vipProductTransaction/${id}`);
    }

    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}

export default new VipProductTransactionService();
