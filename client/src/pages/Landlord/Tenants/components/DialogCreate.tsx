// components/UserFormDialog.tsx
import * as React from "react"
import { useForm } from "react-hook-form"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createTenantAPIs } from "@/apis"
import { toast } from "react-toastify"

type FormValues = {
    name: string
    phone: string
    email: string
}

export default function UserFormDialog({ open, setOpen, fetchData }: any) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>()

    const onSubmit = async (data: FormValues) => {
        toast.promise(
            createTenantAPIs(data),
            {
                pending: 'Đang tạo người thuê...',
                success: 'Tạo người thuê thành công',
                error: 'Tạo người thuê thất bại'
            }
        ).then(() => {
            fetchData()
            setOpen(false)
            reset()
        })


    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent className="sm:max-w-md w-[90vw]">
                <DialogHeader>
                    <DialogTitle>Thông tin người dùng</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input
                            id="name"
                            placeholder="Nhập họ và tên"
                            {...register("name", { required: "Họ tên là bắt buộc" })}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                            id="phone"
                            placeholder="Nhập số điện thoại"
                            {...register("phone", {
                                required: "Số điện thoại là bắt buộc",
                                pattern: {
                                    value: /^[0-9]{9,11}$/,
                                    message: "Số điện thoại không hợp lệ"
                                }
                            })}
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Nhập email"
                            {...register("email", {
                                required: "Email là bắt buộc",
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: "Email không hợp lệ"
                                }
                            })}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="submit">Gửi thông tin</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
