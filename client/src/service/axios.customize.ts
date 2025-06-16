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

    return config;
}, function (error) {

    return Promise.reject(error);
});

let refreshTokenPromise: any = null;

axiosCustomize.interceptors.response.use(function (response) {


    return response;
}, function (error) {
    const originalRequest = error.config;
    if (error?.response?.status === 401) {
        toast.error('log out')
    } else if (error?.response?.status === 410 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!refreshTokenPromise) {
            // refreshTokenPromise = refreshTokenAPI()
            //     .then((data: any) => {
            //         return data?.data?.accessToken
            //     })
            //     .catch((error: any) => {
            //         // logout user
            //         return Promise.reject(error)
            //     })
            //     .finally(() => {
            //         refreshTokenPromise = null;
            //     });
        }

        return refreshTokenPromise.then(() => {
            return axiosCustomize(originalRequest); // retry
        });
    } else {

        toast.error(error?.response?.data?.message)
    }

    return Promise.reject(error);
});

export default axiosCustomize;