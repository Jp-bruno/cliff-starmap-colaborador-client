import axios from "axios";

const axiosBase = axios.create({
    baseURL: process.env.NODE_ENV === "development" ? "http://localhost:4000" : "https://api.colaborador.orionarquitetura.com.br",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export default axiosBase;
