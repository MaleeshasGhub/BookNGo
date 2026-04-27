import axios from "axios";

// All API calls go to Spring Boot running on port 8080
const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;