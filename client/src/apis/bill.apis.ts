import axiosCustomize from "@/service/axios.customize"

export const fetchBillsAPIs = async () => {
    return await axiosCustomize.get('/api/v1/bills')
}

export const createBillAPIs = async (data: any) => {
    return await axiosCustomize.post('/api/v1/bills', data)
}