import axiosCustomize from "@/service/axios.customize"

export const createPaymentContract = async (data: any) => {
    return await axiosCustomize.post('api/v1/payment/create-qr?typePayment=contract', data)
}