import axiosCustomize from "@/service/axios.customize";

export const fetchTenantAPIs = async () => {
    return await axiosCustomize.get('api/v1/tenants');
};

export const deleteTenantAPIs = async(userId : string) => {
    return await axiosCustomize.delete(`api/v1/tenants/${userId}`)
}

export const restoreTenantAPIs = async(userId : string) => {
    return await axiosCustomize.patch(`api/v1/tenants/${userId}`)
}