// import http from "../../http-common";
import axios from "axios";

class VipCustomerTransactionService {
    getAll() {
        return axios.get("/api/vipCustomerTransaction");
    }

    get(id) {
        return axios.get(`/api/vipCustomerTransaction/${id}`);
    }

    fetchVipTransactionByVipId(id) {
        return axios.get(`/api/vipCustomerTransaction/fetchVipTransactionByVipId/${id}`);
    }

    fetchVipCustomerLastOrder(id, dateFrom, dateTo) {
        return axios.get(`/api/vipCustomerTransaction/fetchVipCustomerLastOrder/${id}`, {
            params: {
                date_from: dateFrom,
                date_to: dateTo,
            }
        });
    }

    fetchVipCustomerDebt(id, dateFrom, dateTo) {
        const params = {};
        if (dateFrom) {
            params.date_from = dateFrom;
        }
        if (dateTo) {
            params.date_to = dateTo;
        }

        return axios.get(`/api/vipCustomerTransaction/fetchVIPCustomerDebt/${id}`, {
            params,
        });
    }

    create(data) {
        return axios.post("/api/vipCustomerTransaction", data);
    }

    update(id, data) {
        return axios.put(`/api/vipCustomerTransaction/${id}`, data);
    }

    delete(id) {
        return axios.delete(`/api/vipCustomerTransaction/${id}`);
    }

    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }
}

export default new VipCustomerTransactionService();
