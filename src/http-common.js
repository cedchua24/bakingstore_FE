import axios from "axios";
export default axios.create({
  withCredentials: true,
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    "Content-type": "application/json",
    "Accept": "application/json",
  },

});

// axios.defaults.withCredentials = true;
// axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers.post['Accept'] = 'application/json';
// axios.defaults.baseURL = "http://localhost:8000";