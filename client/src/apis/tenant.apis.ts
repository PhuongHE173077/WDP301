import axiosCustomize from "@/service/axios.customize";

export const fetchTenantAPIs = async () => {
    return await axiosCustomize.get('api/v1/tenants');
};

export const createTenantAPI = async (data: {
    displayName: string
    email: string
    password: string
}) => {
    return await axiosCustomize.post("api/v1/tenants", data)
}