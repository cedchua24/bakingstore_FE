import axios from "axios";

export const ACCOUNTING_TOKEN_KEY = "accounting_auth_token";
const BAKINGSTORE_TOKEN_KEY = "auth_token";
const ACCOUNTING_API_URL = process.env.REACT_APP_ACCOUNTING_API_URL || "http://127.0.0.1:8081/api";
let accountingSessionRequest = null;

const accountingApi = axios.create({
    baseURL: ACCOUNTING_API_URL,
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

export const ensureAccountingSession = async () => {
    const currentToken = localStorage.getItem(ACCOUNTING_TOKEN_KEY);
    if (currentToken) return currentToken;

    const bakingStoreToken = localStorage.getItem(BAKINGSTORE_TOKEN_KEY);
    if (!bakingStoreToken) return null;

    if (!accountingSessionRequest) {
        accountingSessionRequest = accountingApi
            .post("/integrations/bakingstore/session", {}, {
                headers: { Authorization: `Bearer ${bakingStoreToken}` },
            })
            .then((response) => {
                const token = response.data?.token;
                if (!token) throw new Error("Central Accounting did not return an access token.");
                localStorage.setItem(ACCOUNTING_TOKEN_KEY, token);
                window.dispatchEvent(new Event("accounting-session-connected"));
                return token;
            })
            .finally(() => {
                accountingSessionRequest = null;
            });
    }

    return accountingSessionRequest;
};

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
