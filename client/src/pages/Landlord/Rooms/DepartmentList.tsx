import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getDepartmentsByOwner, deleteDepartment } from '@/apis/departmentApi'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { selectCurrentUser } from '@/store/slice/userSlice'
import { toast } from 'react-toastify'
const DepartmentList: React.FC = () => {
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteName, setDeleteName] = useState<string>("")
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (currentUser?._id) {
      fetchDepartments()
    }
  }, [currentUser])

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const res = await getDepartmentsByOwner()
      setDepartments(res.data)
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách tòa nhà")
    } finally {
      setLoading(false)
    }
  }

  const handleDetail = (id: string) => {
    navigate(`/departments/${id}`)
  }

  const handleEdit = (id: string) => {
    navigate(`/departments/edit/${id}`)
  }

  const handleDelete = (id: string, name: string) => {
    setDeleteId(id)
    setDeleteName(name)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await deleteDepartment(deleteId)
      toast.success("Xóa tòa nhà thành công")
      setDepartments(prev => prev.filter(dep => dep._id !== deleteId))
    } catch (err) {
      toast.error("Xóa thất bại")
    } finally {
      setConfirmOpen(false)
      setDeleteId(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <>
      {!loading && departments.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-4">
          <img
            src="/images/departments.svg"
            alt="Empty departments"
            className="w-64 h-64 object-contain mb-6"
          />

          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Bạn không có tòa nhà nào!
          </h2>
          <p className="text-gray-500 mb-4">
            Hãy tạo ngay để bắt đầu quản lý phòng trọ hiệu quả.
          </p>
          <Button onClick={() => navigate('/departments/create')} className="bg-blue-600 hover:bg-blue-700 text-white">
            + Tạo tòa nhà mới
          </Button>
        </div>
      ) : (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map(dep => (
            <Card key={dep._id} className="relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                <h3 className="text-lg font-semibold truncate">{dep.name}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDetail(dep._id)}>Xem / Chỉnh sửa</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(dep._id, dep.name)}>Xoá</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}


      {/* Modal xác nhận xoá */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xoá</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xoá tòa nhà <strong>{deleteName}</strong>? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Hủy
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
            >
              Xác nhận xoá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DepartmentList
