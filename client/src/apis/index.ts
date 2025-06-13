import axiosCustomize from "@/service/axios.customize"

export const fetchAllUserAPIs = async () => {
    return await axiosCustomize.get('api/v1/list')
}
export const fetchTenants = async () => {
    return await axiosCustomize.get('api/v1/orders/users')
}
