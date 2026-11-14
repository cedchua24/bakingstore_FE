import axios from "axios";

class DatabaseExportService {
  exportDatabase() {
    return axios.get("/api/database/export", {
      responseType: "blob",
      withCredentials: true,
    });
  }
}

export default new DatabaseExportService();
