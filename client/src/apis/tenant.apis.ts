import axiosCustomize from "@/service/axios.customize";

export const fetchTenantAPIs = async () => {
    return await axiosCustomize.get('api/v1/tenants');
};

export const createTenantAndAssignAPI = async (data: any) => {
    return await axiosCustomize.post('api/v1/tenants/create-and-assign', data)
}