'use client'

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { CalendarIcon } from "lucide-react"

type RentDateForm = {
    startDate: string
    endDate: string
}

export default function RentDateDialog({ open, setOpen }: any) {
    const { register, handleSubmit, reset } = useForm<RentDateForm>()

    const onSubmit = (data: RentDateForm) => {
        console.log("Ngày thuê:", data)
        setOpen(false)
        reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent className="sm:max-w-md rounded-xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Chọn ngày thuê trọ</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="startDate" className="text-sm font-medium">Ngày bắt đầu</Label>
                        <Input
                            type="date"
                            id="startDate"
                            {...register("startDate", { required: true })}
                            className="rounded-lg border p-2"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="endDate" className="text-sm font-medium">Ngày kết thúc</Label>
                        <Input
                            type="date"
                            id="endDate"
                            {...register("endDate", { required: true })}
                            className="rounded-lg border p-2"
                        />
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="submit" className="w-full rounded-full text-white bg-primary hover:bg-primary/90">
                            Xác nhận thuê
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
