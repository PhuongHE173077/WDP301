import { useState, useMemo, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "react-toastify"
import { PlusCircle, XCircle } from "lucide-react"
import { createBillAPIs } from "@/apis"

interface Order {
    _id: string
    roomId: string
    room: {
        id: string
        price: number
        serviceFee: { _id: string; name: string; price: number }[]
    }
    tenants: { name: string }
    _destroy?: boolean
}

export default function SearchOrderDialog({
    open,
    setOpen,
    orders,
    fetchData
}: {
    open: boolean
    setOpen: (value: boolean) => void
    orders: Order[],
    fetchData: () => void
}) {
    const [search, setSearch] = useState("")
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [electricity, setElectricity] = useState<number>(0)
    const [water, setWater] = useState<number>(0)



    const filteredOrders = useMemo(() => {
        if (!search.trim()) return []
        return orders.filter(
            (order) =>
                order.room.id.toLowerCase().includes(search.toLowerCase()) &&
                !order._destroy
        )
    }, [search, orders])

    const handleSelect = async () => {
        if (!selectedOrder) {
            toast.warning("Vui lòng chọn order")
            return
        }
        const newData = {
            roomId: selectedOrder.room._id,
            tenantId: selectedOrder.tenants._id,
            priceRoom: selectedOrder.room.price,
            electricityBill: electricity * selectedOrder.room.serviceFee.find((f) => f.name === "điện")?.price,
            waterbill: water * selectedOrder.room.serviceFee.find((f) => f.name === "nước")?.price,
            electricityNumber: electricity,
            duration: selectedOrder.duration ? getTargetDateISO(selectedOrder.duration) : getTargetDateISO(selectedOrder.startAt),
            waterNumber: water,
            servicePrice: selectedOrder.room.serviceFee.filter((f) => f.name !== "điện" && f.name !== "nước"),
            total: electricity * selectedOrder.room.serviceFee.find((f) => f.name === "điện")?.price
                + water * selectedOrder.room.serviceFee.find((f) => f.name === "nước")?.price + selectedOrder.room.price
                + selectedOrder.room.serviceFee.filter((f) => f.name !== "điện" && f.name !== "nước").reduce((total, f) => total + f.price, 0),
        }
        await createBillAPIs(newData).then((res) => {
            toast.success("Đã thêm order")
            fetchData()
        })


        setOpen(false)
    }
    function getTargetDateISO(inputStr) {
        const inputDate = new Date(inputStr);
        const day = inputDate.getUTCDate();
        const targetDate = new Date(inputDate);

        if (day < 10) {
            targetDate.setUTCDate(5);
        } else {
            targetDate.setUTCDate(1);
            targetDate.setUTCMonth(targetDate.getUTCMonth() + 1);
            targetDate.setUTCDate(5);
        }

        return targetDate.toISOString();
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl w-[90%] max-h-[90vh] overflow-y-auto rounded-xl shadow-xl border border-gray-200 bg-white dark:bg-slate-900 scrollbar-custom2">
                <DialogTitle className="text-xl font-bold text-center text-blue-600 dark:text-white">
                    🔍 Tìm kiếm Order theo Room ID
                </DialogTitle>
                <DialogDescription className="space-y-4 mt-2">
                    <div>
                        <label className="font-medium dark:text-white">Nhập mã phòng:</label>
                        <Input
                            placeholder="Ví dụ: 001..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    {filteredOrders.length > 0 && (
                        <div className="border rounded p-3 bg-slate-50 dark:bg-slate-800 max-h-60 overflow-y-auto space-y-2">
                            {filteredOrders.map((order) => (
                                <Card
                                    key={order._id}
                                    onClick={() => {
                                        setSelectedOrder(order)
                                        setSearch("")
                                    }}
                                    className="p-3 cursor-pointer hover:shadow-lg hover:border-blue-500 transition rounded-lg border border-gray-300 dark:border-gray-600"
                                >
                                    <div className="font-semibold text-blue-700 dark:text-white">
                                        Room: {order.room.id}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        Người thuê: {order.tenants.name}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {selectedOrder && (
                        <>
                            <div className="mt-4 border rounded p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700">
                                <h3 className="font-semibold mb-2 text-blue-700 dark:text-white">
                                    ✅ Order được chọn:
                                </h3>
                                <div className="text-sm text-gray-800 dark:text-gray-200">
                                    <strong>Room ID:</strong> {selectedOrder.room.id}
                                </div>
                                <div className="text-sm text-gray-800 dark:text-gray-200">
                                    <strong>Người thuê:</strong> {selectedOrder.tenants.name}
                                </div>
                            </div>

                            <div className="mt-4 text-sm text-gray-800 dark:text-gray-200">
                                <strong>Tiền Phòng:</strong> {selectedOrder.room.price.toLocaleString()} VND
                            </div>

                            {/* Điện */}
                            <div className="mt-4 text-sm space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-1/5 font-medium">Số Điện:</div>
                                    <Input
                                        type="number"
                                        value={electricity}
                                        onChange={(e) => setElectricity(Number(e.target.value))}
                                        className="w-1/3"
                                    />
                                    <span className="text-xs">
                                        * {selectedOrder.room.serviceFee.find((f) => f.name === "điện")?.price} đ/kWh
                                    </span>
                                </div>
                                <div className="ml-2 text-sm">
                                    => Thành tiền:{" "}
                                    {(electricity *
                                        (selectedOrder.room.serviceFee.find((f) => f.name === "điện")?.price || 0)
                                    ).toLocaleString()}{" "}
                                    VND
                                </div>
                            </div>

                            {/* Nước */}
                            <div className="mt-4 text-sm space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-1/5 font-medium">Số Nước:</div>
                                    <Input
                                        type="number"
                                        value={water}
                                        onChange={(e) => setWater(Number(e.target.value))}
                                        className="w-1/3"
                                    />
                                    <span className="text-xs">
                                        * {selectedOrder.room.serviceFee.find((f) => f.name === "nước")?.price} đ/m³
                                    </span>
                                </div>
                                <div className="ml-2 text-sm">
                                    Thành tiền:{" "}
                                    {(water *
                                        (selectedOrder.room.serviceFee.find((f) => f.name === "nước")?.price || 0)
                                    ).toLocaleString()}{" "}
                                    VND
                                </div>
                            </div>

                            {/* Dịch vụ khác */}
                            <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-inner border border-gray-200 space-y-2">
                                <h4 className="font-semibold text-blue-700 dark:text-white mb-2">💼 Tiền dịch vụ khác:</h4>
                                {selectedOrder.room.serviceFee
                                    .filter(fee => fee.name !== "điện" && fee.name !== "nước")
                                    .map((fee) => (
                                        <div key={fee._id} className="flex justify-between text-sm text-gray-700 dark:text-gray-200 border-b pb-1">
                                            <span className="capitalize">{fee.name}</span>
                                            <span>{fee.price.toLocaleString()} VND</span>
                                        </div>
                                    ))}
                            </div>

                            {/* Tổng tiền */}
                            <div className="mt-4 text-base font-semibold text-green-600 dark:text-green-400">
                                <strong>Tổng tiền:</strong>{" "}
                                {(
                                    selectedOrder.room.price +
                                    electricity * (selectedOrder.room.serviceFee.find((f) => f.name === "điện")?.price || 0) +
                                    water * (selectedOrder.room.serviceFee.find((f) => f.name === "nước")?.price || 0) +
                                    selectedOrder.room.serviceFee
                                        .filter((f) => f.name !== "điện" && f.name !== "nước")
                                        .reduce((sum, f) => sum + f.price, 0)
                                ).toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <Button
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-xl shadow-md hover:opacity-90 transition"
                                    onClick={() => {
                                        setSearch("")
                                        setSelectedOrder(null)
                                        setElectricity(0)
                                        setWater(0)
                                    }}
                                >
                                    <XCircle className="w-5 h-5" /> Huỷ Hóa Đơn
                                </Button>

                                <Button
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-green-500 to-blue-600 text-white rounded-xl shadow-md hover:opacity-90 transition"
                                    onClick={handleSelect}
                                >
                                    <PlusCircle className="w-5 h-5" /> Tạo Hóa Đơn
                                </Button>
                            </div>
                        </>
                    )}
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}
