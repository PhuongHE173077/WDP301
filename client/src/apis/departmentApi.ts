import axiosCustomize from "@/service/axios.customize"

export const getDepartmentsByOwner = (ownerId: string) => {
  return axiosCustomize.get(`/api/v1/departments/owner/${ownerId}`)
}

export const getDepartmentById = (id: string) => {
  return axiosCustomize.get(`/api/v1/departments/${id}`);
};

export const updateDepartment = (id: string, updatedData: any) => {
  return axiosCustomize.put(`/api/v1/departments/${id}`, updatedData)
}

export const deleteDepartment = (id: string) => {
  return axiosCustomize.delete(`/api/v1/departments/${id}`)
}

