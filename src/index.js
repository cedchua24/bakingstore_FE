import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import axios from "axios";
import { clearAuthSession } from "./components/User/authSession";

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.baseURL = "http://localhost:8000/";
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('auth_token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
})

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseMessage = String(error.response?.data?.message || "");
    const isAuthenticationFailure = /expired|unauthenticated|invalid\s+token|token\s+is\s+invalid/i.test(
      responseMessage
    );

    if (
      error.response?.status === 401 &&
      isAuthenticationFailure &&
      localStorage.getItem("auth_token")
    ) {
      clearAuthSession();

      if (window.location.pathname !== "/login") {
        window.location.replace("/login?reason=session-expired");
      }
    }

    return Promise.reject(error);
  }
);

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
