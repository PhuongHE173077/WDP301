import axiosCustomize from "@/service/axios.customize";

export const fetchOrders = async () => {
    return await axiosCustomize.get('api/v1/orders');
};

export const updateOrderAPIs = async (id: string, data: any) => {
    return await axiosCustomize.put(`api/v1/orders/${id}`, data);
};

export const fetchOrderByIdAPIs = async (id: string) => {
    return await axiosCustomize.get(`api/v1/orders/${id}`);
};

export const fetchOrderByContractIdAPIs = async (id: string) => {
    return await axiosCustomize.get(`api/v1/orders/${id}?findBy=contract`);
};