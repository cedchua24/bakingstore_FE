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
    logout(user) {
        return axios.post(`/api/logout`, user);
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