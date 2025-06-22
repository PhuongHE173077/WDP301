import axiosCustomize from "@/service/axios.customize"
export const fetchFeedback = async () => {
    return await axiosCustomize.get('api/v1/feedbacks')
}

export const updateFeedbackReply = (feedbackId: string, data: { reply: string }) => {
  return axiosCustomize.put(`/api/v1/feedbacks/${feedbackId}/reply`, data);
}