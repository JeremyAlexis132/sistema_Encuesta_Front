import axios from "axios";
import { baseURL } from "@/general";

const userApi = axios.create({
    baseURL,
});

// User Login
export const adminLogin = async (values) => {
    try {
        const response = await userApi.post("admin/login", values);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const obtenerUsuariosService = async () => {
    try {
        let token = sessionStorage.getItem("token");
        const config = { headers: { "x-api-key": token } };
        const response = await userApi.get(
            "/admin/usuarios",
            config
        );
        return response;
    } catch (error) {
        const response = error.response;
        return response;
    }
};

export const crearUsuarioService = async (values) => {
    try {
        let token = sessionStorage.getItem("token");
        const config = { headers: { "x-api-key": token } };
        const response = await userApi.post(
            "/admin/crear-usuario",
            values,
            config
        );
        return response;
    } catch (error) {
        const response = error.response;
        return response;
    }
};

export const obtenerEncuestasService = async () => {
    try {
        let token = sessionStorage.getItem("token");
        const config = { headers: { "x-api-key": token } };
        const response = await userApi.get(
            "/encuestas",
            config
        );
        return response;
    } catch (error) {
        const response = error.response;
        return response;
    }
};

export const crearEncuestaService = async (values) => {
    try {
        let token = sessionStorage.getItem("token");
        const config = { headers: { "x-api-key": token } };
        const response = await userApi.post(
            "/encuestas/crear",
            values,
            config
        );
        return response;
    } catch (error) {
        const response = error.response;
        return response;
    }
};

export const asignarEncuestaService = async (values) => {
    try {
        let token = sessionStorage.getItem("token");
        const config = { headers: { "x-api-key": token } };
        const response = await userApi.post(
            "/encuestas/asignar",
            values,
            config
        );
        return response;
    } catch (error) {
        const response = error.response;
        return response;
    }
};

export const obtenerRespuestasService = async (values) => {
    try {
        let token = sessionStorage.getItem("token");
        const config = { headers: { "x-api-key": token } };
        const response = await userApi.post(
            "/respuestas/obtener-encuesta",
            values,
            config
        );
        return response;
    } catch (error) {
        const response = error.response;
        return response;
    }
};