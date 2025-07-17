import axiosCustomize from "@/service/axios.customize";

export const fetchTenantAPIs = async () => {
    return await axiosCustomize.get('api/v1/tenants');
};

export const fetchUpdateTenantProfileAPIs = async (data: any) => {
    return await axiosCustomize.put('api/v1/tenants/profile', data);
};