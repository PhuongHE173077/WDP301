import axiosCustomize from "@/service/axios.customize";

export const addRoomToBlog = (roomId: string, force = false) => {
  return axiosCustomize.post(`/api/v1/blogs/${roomId}`, force ? {force : true} : {});
};
