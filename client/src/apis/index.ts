import axiosCustomize from "@/service/axios.customize"

export const fetchAllUserAPIs = async () => {
    return await axiosCustomize.get('api/v1/list')
}
export const fetchTenants = async () => {
    return await axiosCustomize.get('api/v1/orders/tenant')
}

export const fetchFeedback = async () => {
    return await axiosCustomize.get('api/v1/feedbacks')
}

export const updateFeedbackReply = ({ feedbackId, reply }) =>
  axiosCustomize.put(`/api/v1/feedbacks/${feedbackId}/reply`, { reply });
