import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getDepartmentsByOwner } from '@/apis/departmentApi'
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
import { selectCurrentUser } from '@/store/slice/userSlice'

const DepartmentList: React.FC = () => {
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser?._id) {
      getDepartmentsByOwner()
        .then(res => setDepartments(res.data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [currentUser])

  const handleDetail = (id: string) => {
    navigate(`/departments/${id}`)
  }

  const handleEdit = (id: string) => {
    navigate(`/departments/edit/${id}`)
  }

  const handleDelete = (id: string) => {
    // Có thể mở modal xác nhận xoá ở đây
    console.log("Delete department", id)
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
                <DropdownMenuItem onClick={() => handleDetail(dep._id)}>Xem chi tiết</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(dep._id)}>Chỉnh sửa</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(dep._id)}>Xoá</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>

        </Card>
      ))}
    </div>
  )
}

export default DepartmentList
