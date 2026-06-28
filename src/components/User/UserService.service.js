// import http from "../../http-common";

import axios from "axios";

class UserService {
    getAll() {
        return axios.get("/api/register");
    }
    get(id) {
        return axios.get(`/api/register/${id}`);
    }
    get(id) {
        return axios.get(`/api/register/${id}`);
    }
    create(user) {
        return axios.post(`/api/register`, user);
    }
    login(user) {
        return axios.post(`/api/login`, user);
    }
    changePassword(data) {
        return axios.put(`/api/change-password`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        });
    }
    forgotPassword(email) {
        return axios.post(`/api/forgot-password`, { email });
    }
    resetPassword(data) {
        return axios.post(`/api/reset-password`, data);
    }
    // logout(user) {
    //     return axios.post(`/api/logout`, user);
    // }
    logout() {
        return axios.post('/api/logout', {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                Accept: 'application/json',
            }
        });
    }
    update(id, data) {
        return axios.put(`/api/register/${id}`, data);
    }
    delete(user) {
        return axios.delete(`/api/register/${user}`);
    }
    deleteAll() {
        return axios.delete(`/api/register`);
    }
    findByTitle(brandName) {
        return axios.get(`/api/register/getId/${brandName}`);
    }
    sanctum() {
        return axios.get("/sanctum/csrf-cookie");
    }

}
export default new UserService();
