import axios from "axios";

export const ACCOUNTING_TOKEN_KEY = "accounting_auth_token";

const accountingApi = axios.create({
    baseURL: process.env.REACT_APP_ACCOUNTING_API_URL || "http://127.0.0.1:8081/api",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
});

accountingApi.interceptors.request.use((config) => {
    const token = localStorage.getItem(ACCOUNTING_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

accountingApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(ACCOUNTING_TOKEN_KEY);
            window.dispatchEvent(new Event("accounting-session-expired"));
        }
        return Promise.reject(error);
    }
);

export const fetchAllAccountingPages = async (path, params = {}) => {
    let page = 1;
    let records = [];
    do {
        const response = await accountingApi.get(path, { params: { ...params, page } });
        const payload = response.data;
        if (!Array.isArray(payload?.data)) return Array.isArray(payload) ? payload : [];
        records = records.concat(payload.data);
        if (page >= payload.last_page) break;
        page += 1;
    } while (true);
    return records;
};

export default accountingApi;
