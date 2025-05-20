import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { fetchAllUserAPIs } from '@/apis'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { toast } from 'react-toastify'

export const Users = () => {
    const [users, setUsers] = useState<any[]>([])
    const [filteredUsers, setFilteredUsers] = useState<any[]>([])
    const [search, setSearch] = useState('')
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState<string>('owner1')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const res = await fetchAllUserAPIs()
        const list = res.data.filter((user: any) => user.role !== 'admin')
        setUsers(list)
        setFilteredUsers(list)
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase()
        setSearch(value)
        const filtered = users.filter(user =>
            user.userName?.toLowerCase().includes(value)
        )
        setFilteredUsers(filtered)
    }

    const handleDelete = (userId: string) => {
        Swal.fire({
            title: '❌ Xác nhận xóa người dùng?',
            text: "Bạn sẽ không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e74c3c',
            cancelButtonColor: '#7f8c8d',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                // await deleteUserAPI(userId)
                toast.success("Đã xóa người dùng")
                fetchData()
            }
        })
    }

    const handleUpdate = async () => {
        if (!selectedUser || !selectedRole) return
        // await updateUserRoleAPI(selectedUser._id.$oid, selectedRole)
        toast.success("Cập nhật role thành công")
        setUpdateDialogOpen(false)
        fetchData()
    }

    return (
        <div className="p-6 bg-gradient-to-br from-white via-slate-100 to-slate-200 min-h-screen rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">👥 Danh sách người dùng</h2>

            <div className="flex justify-between items-center mb-4">
                <Input
                    placeholder="🔍 Tìm theo userName..."
                    value={search}
                    onChange={handleSearch}
                    className="max-w-sm rounded-xl shadow-sm focus:ring-2 focus:ring-primary/40"
                />
            </div>

            <div className="overflow-x-auto rounded-lg shadow">
                <Table className="min-w-full border text-sm">
                    <TableHeader className="bg-primary/10 text-gray-700 uppercase">
                        <TableRow>
                            <TableHead className="p-3 border">ID</TableHead>
                            <TableHead className="p-3 border">User Name</TableHead>
                            <TableHead className="p-3 border">Email</TableHead>
                            <TableHead className="p-3 border">Role</TableHead>
                            <TableHead className="p-3 border">Time Expired</TableHead>
                            <TableHead className="p-3 border">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map(user => (
                            <TableRow key={user._id.$oid} className="hover:bg-slate-50 transition">
                                <TableCell className="p-3 border">{user._id}</TableCell>
                                <TableCell className="p-3 border">{user.userName}</TableCell>
                                <TableCell className="p-3 border">{user.email}</TableCell>
                                <TableCell className="p-3 border capitalize">{user.role}</TableCell>
                                <TableCell className="p-3 border text-xs">
                                    {new Date(user.timeExpired).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="p-3 border space-x-2">
                                    <Button size="sm" variant="outline"
                                        onClick={() => {
                                            setSelectedUser(user)
                                            setDialogOpen(true)
                                        }}>Xem</Button>

                                    <Button size="sm" variant="secondary"
                                        onClick={() => {
                                            setSelectedUser(user)
                                            setSelectedRole(user.role)
                                            setUpdateDialogOpen(true)
                                        }}
                                    >Sửa</Button>

                                    <Button size="sm" variant="destructive"
                                        onClick={() => handleDelete(user._id)}
                                    >Xóa</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Dialog xem chi tiết */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>📋 Thông tin chi tiết</DialogTitle>
                        <DialogDescription className="text-gray-700 mt-3 space-y-2 text-sm">
                            {selectedUser && (
                                <>
                                    <p><strong>Họ tên:</strong> {selectedUser.displayName}</p>
                                    <p><strong>User Name:</strong> {selectedUser.userName}</p>
                                    <p><strong>Email:</strong> {selectedUser.email}</p>
                                    <p><strong>Role:</strong> {selectedUser.role}</p>
                                    <p><strong>CCCD:</strong> {selectedUser.cccd}</p>
                                    <p><strong>Ngày sinh:</strong> {selectedUser.dateOfBirth}</p>
                                    <p><strong>Trạng thái:</strong> {selectedUser.status}</p>
                                    <p><strong>Active:</strong> {selectedUser.isActive ? '✅ Có' : '❌ Không'}</p>
                                    <p><strong>Ngày tạo:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
                                    <p><strong>Hết hạn mã xác thực:</strong> {new Date(selectedUser.verificationCodeExpired).toLocaleString()}</p>
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            {/* Dialog cập nhật role */}
            <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>🛠️ Cập nhật Role</DialogTitle>
                        <div className="mt-4 space-y-2">
                            <p className="text-sm text-gray-700 mb-2">Chọn role mới cho <strong>{selectedUser?.userName}</strong>:</p>
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="owner1">Owner 1</SelectItem>
                                    <SelectItem value="owner2">Owner 2</SelectItem>
                                    <SelectItem value="owner3">Owner 3</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center justify-center"> <Button onClick={handleUpdate} className="mt-4 w-3/4" >Cập nhật</Button></div>

                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}
