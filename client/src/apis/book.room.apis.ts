import axiosCustomize from "@/service/axios.customize";

export const createBookRoomAPIs = async (data: any) => {
    return await axiosCustomize.post('api/v1/book-rooms', data);
}

export const fetchBookRoomInTenantAPIs = async () => {
    return await axiosCustomize.get("api/v1/book-rooms?isRole=tenant")
}