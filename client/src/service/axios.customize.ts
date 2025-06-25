import axios from "axios";
import { toast } from "react-toastify";

const axiosCustomize = axios.create({
    baseURL: 'http://localhost:8081/',
    timeout: 20000,
    withCredentials: true
})

let axiosReduxStore: any;
export const injectStore = (mainStore: any) => {
    axiosReduxStore = mainStore;
};

axiosCustomize.interceptors.request.use(function (config) {
    // Add any request headers or modifications here
    return config;
}, function (error) {
    return Promise.reject(error);
});

let refreshTokenPromise: any = null;

axiosCustomize.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error?.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        // You can dispatch logout action here if needed
        return Promise.reject(error);
    }

    // Handle 410 Gone (Token expired)
    if (error?.response?.status === 410 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!refreshTokenPromise) {
            // Implement refresh token logic here if needed
            refreshTokenPromise = Promise.reject(error);
        }

        return refreshTokenPromise
            .then(() => {
                return axiosCustomize(originalRequest);
            })
            .catch((err) => {
                return Promise.reject(err);
            })
            .finally(() => {
                refreshTokenPromise = null;
            });
    }

    // Handle other errors
    const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
    toast.error(errorMessage);
    return Promise.reject(error);
});

export default axiosCustomize;