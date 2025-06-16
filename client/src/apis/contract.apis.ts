import axiosCustomize from "@/service/axios.customize";

export const createContactApis = async (data: any) => {
    return await axiosCustomize.post('api/v1/contracts', data);
};