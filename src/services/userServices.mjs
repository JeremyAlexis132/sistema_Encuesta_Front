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
