import axios from "axios";
import { baseURL } from "@/general";

const userApi = axios.create({
    baseURL,
});

// User Login
export const userLogin = async (values) => {
    try {
        const response = await userApi.post("auth/login", values);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const obtenerEncuestaAsignadaService = async () => {
    try {
        let token = sessionStorage.getItem("token");
        const config = { headers: { "x-api-key": token } };
        const response = await userApi.post(
            "/encuestas/obtener-asignada",
            {},
            config
        );
        return response;
    } catch (error) {
        const response = error.response;
        return response;
    }
};

export const responderEncuestaService = async (values) => {
    try {
        let token = sessionStorage.getItem("token");
        const config = { headers: { "x-api-key": token } };
        const response = await userApi.post(
            "/respuestas",
            values,
            config
        );
        return response;
    } catch (error) {
        const response = error.response;
        return response;
    }
};

export const generarFirmaService = async (values) => {
    try {
        let token = sessionStorage.getItem("token");
        const config = { headers: { "x-api-key": token } };
        const response = await userApi.post(
            "/firma-ciega/generar-firma",
            values,
            config
        );
        return response;
    } catch (error) {
        const response = error.response;
        return response;
    }
};
