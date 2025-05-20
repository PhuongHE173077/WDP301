import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";
import { updateInfoAPIs } from "@/apis";
import { toast } from "react-toastify";
import { useState } from "react";

export default function UserInfoForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [success, setSuccess] = useState(false);

    const onSubmit = async (data) => {
        const newData = { data: data, verifyToken: token };
        await updateInfoAPIs(id, newData).then((res) => {
            toast.success('Update information successfully');
            setSuccess(true);
        });
    };

    const [searchParam] = useSearchParams();
    const id = searchParam.get("id");
    const token = searchParam.get("token");
    const email = searchParam.get("email");

    if (success) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-lg shadow-xl rounded-2xl">
                    <CardContent className="p-6 sm:p-10">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                            Hoàn Thiện Thông Tin Cá Nhân Thành Công
                        </h2>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg shadow-xl rounded-2xl">
                <CardContent className="p-6 sm:p-10">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Hoàn Thiện Thông Tin Cá Nhân
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <Input type="email" disabled defaultValue={email} className="bg-gray-200" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <Input {...register("name", { required: true })} placeholder="Nguyễn Văn A" />
                            {errors.name && <span className="text-sm text-red-500">Vui lòng nhập họ tên</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <Input {...register("phone", { required: true })} placeholder="0123456789" />
                            {errors.phone && <span className="text-sm text-red-500">Vui lòng nhập số điện thoại</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                            <Input type="date" {...register("dob", { required: true })} />
                            {errors.dob && <span className="text-sm text-red-500">Vui lòng chọn ngày sinh</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CCCD/CMND</label>
                            <Input {...register("cccd", { required: true })} placeholder="123456789012" />
                            {errors.cccd && <span className="text-sm text-red-500">Vui lòng nhập CCCD</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <Input {...register("address", { required: true })} placeholder="Số 1 Đường ABC, Quận 1, TP.HCM" />
                            {errors.address && <span className="text-sm text-red-500">Vui lòng nhập địa chỉ</span>}
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full text-white font-semibold">
                                Gửi thông tin
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 