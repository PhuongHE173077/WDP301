import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import dayjs from "dayjs";

export const DialogView = ({
    open,
    setOpen,
    user,
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
    user: any;
}) => {
    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg bg-white shadow-xl rounded-2xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center text-gray-800">
                        Thông Tin Người Thuê
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center gap-3 mt-4">
                    <Avatar className="w-24 h-24 border-4 border-gray-300 shadow-md">
                        <AvatarImage src={user.image} alt={user.userName} />
                    </Avatar>

                    <div className="text-center mt-2">
                        <h2 className="text-xl font-semibold text-gray-900">{user.userName}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-6 text-sm">
                    <div>
                        <Label className="text-gray-600">Số điện thoại</Label>
                        <p className="text-gray-800 font-medium">{user.phone}</p>
                    </div>
                    <div>
                        <Label className="text-gray-600">CCCD</Label>
                        <p className="text-gray-800 font-medium">{user.CCCD}</p>
                    </div>
                    <div className="col-span-2">
                        <Label className="text-gray-600">Địa chỉ</Label>
                        <p className="text-gray-800 font-medium">{user.address}</p>
                    </div>
                    <div>
                        <Label className="text-gray-600">Ngày sinh</Label>
                        <p className="text-gray-800 font-medium">
                            {dayjs(user.dob).format("DD/MM/YYYY")}
                        </p>
                    </div>
                    <div>
                        <Label className="text-gray-600">Tạo hồ sơ</Label>
                        <p className="text-gray-800 font-medium">
                            {dayjs(user.createdAt).format("DD/MM/YYYY HH:mm")}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
