import http from "../http-common";
class TutorialDataService {
  getAll() {
    return http.get("/categories");
  }
  get(id) {
    return http.get(`/categories/${id}`);
  }
  create(data) {
    return http.post("/categories", data);
  }
  update(id, data) {
    return http.put(`/categories/${id}`, data);
  }
  delete(category) {
    return http.delete(`/categories/${category}`);
  }
  deleteAll() {
    return http.delete(`/categories`);
  }
  findByTitle(categoryName) {
    return http.get(`/categories/getId/${categoryName}`);
  }
}
export default new TutorialDataService();