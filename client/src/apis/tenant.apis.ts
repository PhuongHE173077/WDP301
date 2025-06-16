import axiosCustomize from "@/service/axios.customize";

export const fetchTenantAPIs = async () => {
    return await axiosCustomize.get('api/v1/tenants');
};