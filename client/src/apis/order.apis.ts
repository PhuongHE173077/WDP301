import axiosCustomize from "@/service/axios.customize";

export const fetchOrders = async () => {
    return await axiosCustomize.get('api/v1/orders');
};