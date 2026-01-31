import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5500/api",
});

export default axiosClient;
