'use client'

import { useState, useMemo } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import dayjs from "dayjs"



export default function ScrollUserDialog({ open, setOpen, users }: { open: boolean, setOpen: (value: boolean) => void, users: any }) {
    console.log("🚀 ~ ScrollUserDialog ~ users:", users)
    const [searchTerm, setSearchTerm] = useState("")

    const filteredUsers = useMemo(() => {
        return users?.filter(u =>
            u?.user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        )
    }, [searchTerm])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl w-[90%] max-h-[90vh] overflow-y-auto">
                {users.length > 0 ? <> <DialogHeader>
                    <DialogTitle>Danh sách người dùng</DialogTitle>
                    <DialogDescription>
                        Tổng cộng {filteredUsers.length} người
                    </DialogDescription>
                </DialogHeader>

                    <div className="mb-4">
                        <Input
                            placeholder="Tìm theo tên..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="divide-y overflow-auto" style={{ maxHeight: "50vh" }}>
                        {filteredUsers.map((item, idx) => (
                            <div
                                key={item.user._id}
                                className="p-4 rounded-2xl border mt-2 border-gray-200 bg-gray-50 text-sm text-gray-700 space-y-2"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div><span className="font-medium">Họ tên:</span> {item.user.name}</div>
                                    <div><span className="font-medium">Email:</span> {item.user.email}</div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div><span className="font-medium">Bắt đầu:</span> {dayjs(item.startAt).format("DD/MM/YYYY HH:mm")}</div>
                                    <div><span className="font-medium">Kết thúc:</span> {dayjs(item.duration).format("DD/MM/YYYY HH:mm")}</div>

                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div><span className="font-medium">SĐT:</span> {item.user.phone}</div>
                                    <div><span className="font-medium">Hợp đồng:</span> {item.contract || "Không có"}</div>
                                </div>
                            </div>
                        ))}

                        {filteredUsers.length === 0 && (
                            <p className="text-center text-muted-foreground py-6">Không tìm thấy người dùng phù hợp.</p>
                        )}
                    </div></> :
                    <>
                        <DialogTitle>Danh sách người dùng</DialogTitle>
                        <DialogDescription>
                            Phòng trọ mới chưa có người dùng
                        </DialogDescription>
                    </>
                }
            </DialogContent>
        </Dialog>
    )
}
