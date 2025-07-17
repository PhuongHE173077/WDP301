import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserAvatar } from "@/components/ui/UserAvatar";
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
            <DialogContent className="max-w-md bg-gradient-to-br from-blue-50 to-white shadow-2xl rounded-2xl p-0 overflow-hidden border border-blue-100">
                <div className="flex flex-col items-center py-8 px-6">
                    <div className="mb-3">
                        <UserAvatar src={user.avatar} alt={user.userName} size={64} />
                    </div>
                    <h2 className="text-lg font-bold text-blue-700 mb-1">{user.displayName || user.userName}</h2>
                    <p className="text-sm text-gray-500 mb-2">{user.email || <span className="text-gray-400">Chưa cập nhật</span>}</p>
                    <div className="w-full mt-4">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                            <div>
                                <Label className="text-gray-500">Số điện thoại</Label>
                                <p className="text-gray-800 font-medium">{user.phone || <span className="text-gray-400">Chưa cập nhật</span>}</p>
                            </div>
                            <div>
                                <Label className="text-gray-500">CCCD</Label>
                                <p className="text-gray-800 font-medium">{user.CCCD || <span className="text-gray-400">Chưa cập nhật</span>}</p>
                            </div>
                            <div className="col-span-2">
                                <Label className="text-gray-500">Địa chỉ</Label>
                                <p className="text-gray-800 font-medium">{user.address || <span className="text-gray-400">Chưa cập nhật</span>}</p>
                            </div>
                            <div>
                                <Label className="text-gray-500">Ngày sinh</Label>
                                <p className="text-gray-800 font-medium">
                                    {user.dob ? dayjs(user.dob).format("DD/MM/YYYY") : <span className="text-gray-400">Chưa cập nhật</span>}
                                </p>
                            </div>
                            <div>
                                <Label className="text-gray-500">Tạo hồ sơ</Label>
                                <p className="text-gray-800 font-medium">
                                    {user.createdAt ? dayjs(user.createdAt).format("DD/MM/YYYY HH:mm") : <span className="text-gray-400">Chưa cập nhật</span>}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
