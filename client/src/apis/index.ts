import axiosCustomize from "@/service/axios.customize"

export const fetchAllUserAPIs = async () => {
    return await axiosCustomize.get('api/v1/list')
}

export const fetchProfileAPIs = async () => {
    return await axiosCustomize.get('api/v1/profile')
}

export const fetchUpdateProfileAPIs = async (data: any) => {
    return await axiosCustomize.put('api/v1/profile', data)
}


