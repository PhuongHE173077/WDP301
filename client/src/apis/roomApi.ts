import axiosCustomize from "@/service/axios.customize"

export const createRoom = (data: any) => {
    return axiosCustomize.post(`/api/v1/rooms`, data)
}