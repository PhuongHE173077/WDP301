import axiosCustomize from "@/service/axios.customize"

export const fetchRooms = async () => {
    return await axiosCustomize.get('api/v1/rooms')
}

export const fetchOrders = async () => {
    return await axiosCustomize.get('api/v1/orders')
}

export const fetchTenants = async () => {
    return await axiosCustomize.get('api/v1/tenants')
}

export const fetchBills = async () => {
    return await axiosCustomize.get('api/v1/bills')
}
export const uploadImageAPIs = async (image: any) => {
    return await axiosCustomize.post('api/v1/image/upload', image)
}

export const createRoomAPIs = async (room: any) => {
    return await axiosCustomize.post('api/v1/rooms', room)
}

export const deleteRoomAPIs = async (roomId: any) => {
    return await axiosCustomize.delete(`api/v1/rooms/${roomId}`)
}

export const updateRoomAPIs = async (roomId: any, room: any) => {
    return await axiosCustomize.put(`api/v1/rooms/${roomId}`, room)
}

export const deleteOrderAPIs = async (orderId: any) => {
    return await axiosCustomize.delete(`api/v1/orders/${orderId}`)
}

export const updateOrderAPIs = async (orderId: any, order: any) => {
    return await axiosCustomize.put(`api/v1/orders/${orderId}`, order)
}

export const createTenantAPIs = async (tenant: any) => {
    return await axiosCustomize.post('api/v1/tenants', tenant)
}

export const deleteTenantAPIs = async (tenantId: any) => {
    return await axiosCustomize.delete(`api/v1/tenants/${tenantId}`)
}

export const getOrderIsActiveAPIs = async () => {
    return await axiosCustomize.get(`api/v1/orders/isActive`)
}

export const createBillAPIs = async (bill: any) => {
    return await axiosCustomize.post('api/v1/bills', bill)
}

export const updateBillAPIs = async (billId: any, data: any) => {
    return await axiosCustomize.put(`api/v1/bills/${billId}`, data)
}

export const deleteBillAPIs = async (billId: any) => {
    return await axiosCustomize.delete(`api/v1/bills/${billId}`)
}

export const createFeedbackAPIs = async (feedback: any) => {
    return await axiosCustomize.post('api/v1/feedbacks', feedback)
}

export const updateInfoAPIs = async (id: any, info: any) => {
    return await axiosCustomize.put('api/v1/tenants/' + id, info)
}

export const fetchAllUserAPIs = async () => {
    return await axiosCustomize.get('api/v1/users/list')
}