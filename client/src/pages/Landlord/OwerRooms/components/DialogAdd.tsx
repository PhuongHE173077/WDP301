import { useState, useMemo, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateOrderAPIs } from "@/apis"
import { toast } from "react-toastify"
import { Search, User, CalendarCheck, CheckCircle2 } from "lucide-react"

export default function AddUserDialog({ open, setOpen, users, orderId, fetchData }: {
    open: boolean,
    setOpen: (value: boolean) => void,
    users: any[],
    orderId: any,
    fetchData: any
}) {
    const [search, setSearch] = useState("")
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [startDate, setStartDate] = useState("")

    useEffect(() => {
        setSelectedUser(null)
        setStartDate("")
    }, [open])

    const filteredUsers = useMemo(() => {
        if (!search.trim()) return []
        return users.filter(user =>
            user.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, users])

    const handleAddUser = async () => {
        if (!selectedUser || !startDate) {
            alert("Vui lòng chọn người dùng và ngày bắt đầu.")
            return
        }

        const updateData = {
            userId: selectedUser._id,
            startDate,
            endDate: null,
            contract: ''
        }

        await updateOrderAPIs(orderId, updateData).then(() => {
            toast.success("Thêm người dùng thành công")
            fetchData()
            setOpen(false)
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl w-[90%] max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" /> Cho người dùng thuê trọ
                </DialogTitle>

                <DialogDescription className="space-y-5 mt-4">
                    <div>
                        <label className="font-medium flex items-center gap-2">
                            <Search className="w-4 h-4 text-gray-500" />
                            Tìm người dùng
                        </label>
                        <Input
                            placeholder="Nhập tên người dùng..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="mt-2"
                        />
                    </div>

                    {/* Danh sách kết quả tìm kiếm */}
                    {filteredUsers.length > 0 && (
                        <div className="border rounded-lg p-3 max-h-60 overflow-y-auto space-y-2 bg-white shadow-sm">
                            {filteredUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className="cursor-pointer hover:bg-blue-50 border border-transparent hover:border-blue-400 p-3 rounded-lg transition"
                                    onClick={() => {
                                        setSelectedUser(user)
                                        setSearch("")
                                    }}
                                >
                                    <div className="font-semibold">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Hiển thị thông tin người dùng đã chọn */}
                    {selectedUser && (
                        <>
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm space-y-2">
                                <div className="flex items-center gap-2 text-blue-700 font-semibold">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Người dùng đã chọn
                                </div>
                                <div><strong>Tên:</strong> {selectedUser.name}</div>
                                <div><strong>Email:</strong> {selectedUser.email}</div>
                                <div><strong>SĐT:</strong> {selectedUser.phone}</div>
                                <div><strong>Địa chỉ:</strong> {selectedUser.address}</div>
                            </div>

                            <div className="flex items-center gap-3 mt-4">
                                <label className="w-1/3 flex items-center gap-2 font-medium">
                                    <CalendarCheck className="w-4 h-4 text-gray-600" />
                                    Ngày bắt đầu:
                                </label>
                                <Input
                                    type="date"
                                    className="w-2/3"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    onClick={handleAddUser}
                                    className="mt-4 bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold hover:opacity-90 rounded-xl px-6 py-2"
                                >
                                    ➕ Thêm
                                </Button>
                            </div>
                        </>
                    )}
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}
