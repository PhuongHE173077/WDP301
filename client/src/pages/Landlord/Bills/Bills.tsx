import React, { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CircleCheckBigIcon, CirclePlusIcon, DollarSignIcon, Pencil, Trash2, XCircleIcon } from "lucide-react"
import { deleteBillAPIs, fetchBills, getOrderIsActiveAPIs, updateBillAPIs } from "@/apis"
import dayjs from "dayjs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "react-router-dom"
import { set } from "date-fns"
import SearchOrderDialog from "./components/DialogAdd"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import Swal from "sweetalert2"

const ITEMS_PER_PAGE = 7

export const Bills: React.FC = () => {
    const [bills, setBills] = useState([])
    const [page, setPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState("all")
    const [roomFilter, setRoomFilter] = useState("")
    const [monthFilter, setMonthFilter] = useState(String(dayjs().month() + 1))
    const [yearFilter, setYearFilter] = useState(String(dayjs().year()))
    const [showAllUnpaid, setShowAllUnpaid] = useState(false)
    const [orders, setOrders] = useState([])
    const [open, setOpen] = useState(false)

    const monthNames = [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ]
    const currentYear = dayjs().year()
    const yearOptions = Array.from({ length: 5 }, (_, i) => String(currentYear - i))

    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async () => {
        await fetchBills().then((res) => {
            setBills(res.data)
        })
        await getOrderIsActiveAPIs().then((res) => {
            setOrders(res.data)
        })
    };

    const calculate = (array: any) => {
        let total = 0
        array.forEach((item: any) => {
            if (item.name !== "điện" && item.name !== "nước") {
                total += item.price
            }
        })
        return total
    }

    const navigate = useNavigate();

    const filteredBills = bills.filter((bill: any) => {
        const billDate = dayjs(bill?.duration)

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "paid" && bill.status === "paid") ||
            (statusFilter === "unpaid" && bill.status !== "paid")

        const matchesRoom =
            roomFilter.trim() === "" ||
            bill?.room?.id?.toLowerCase().includes(roomFilter.trim().toLowerCase())

        const matchesMonth = billDate.month() + 1 === Number(monthFilter)
        const matchesYear = billDate.year() === Number(yearFilter)

        if (showAllUnpaid) {
            return bill.status !== "paid" && matchesRoom
        }

        return matchesStatus && matchesRoom && matchesMonth && matchesYear
    })

    const totalPages = Math.ceil(filteredBills.length / ITEMS_PER_PAGE)
    const paginatedData = filteredBills.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    )

    const handlePrev = () => setPage((p) => Math.max(p - 1, 1))
    const handleNext = () => setPage((p) => Math.min(p + 1, totalPages))

    useEffect(() => {
        setPage(1)
    }, [statusFilter, roomFilter, monthFilter, yearFilter, showAllUnpaid])


    const handlePayment = (bill: any) => {
        Swal.fire({
            title: bill?.status === 'unpaid'
                ? `🔔 Thanh toán phòng ${bill?.room?.id}?`
                : `❌ Hủy thanh toán phòng ${bill?.room?.id}?`,
            html: "<strong style='color:#555;'>Bạn sẽ không thể khôi phục hành động này!</strong>",
            icon: 'warning',
            iconColor: '#f39c12',
            showCancelButton: true,
            confirmButtonColor: '#1abc9c',    // xanh ngọc
            cancelButtonColor: '#e74c3c',     // đỏ đậm
            confirmButtonText: bill?.status === 'unpaid' ? '✅ Thanh toán' : '🗑️ Hủy thanh toán',
            cancelButtonText: '🚫 Đóng',
            background: '#fdfdfd',
            backdrop: `rgba(0,0,0,0.4)`,
            customClass: {
                title: 'text-xl font-semibold',
                confirmButton: 'px-5 py-2',
                cancelButton: 'px-5 py-2'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                await updateBillAPIs(bill._id, { status: bill?.status === 'unpaid' ? 'paid' : 'unpaid' }).then((res) => {
                    fetchData()
                })
            }
        });
    }

    const handleDelete = (bill: any) => {
        Swal.fire({
            title: `🗑️ Xóa hóa đơn phòng ${bill?.room?.id}?`,
            html: "<strong style='color:#d35400;'>Hành động này sẽ xóa vĩnh viễn và không thể khôi phục!</strong>",
            icon: 'warning',
            iconColor: '#e74c3c', // màu đỏ
            showCancelButton: true,
            confirmButtonColor: '#c0392b',      // đỏ đậm hơn
            cancelButtonColor: '#7f8c8d',       // xám tro
            confirmButtonText: '✔️ Xóa',
            cancelButtonText: '❌ Hủy',
            background: '#fffdfd',
            backdrop: `rgba(0, 0, 0, 0.5)`,
            customClass: {
                title: 'text-xl font-bold text-red-600',
                confirmButton: 'px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md',
                cancelButton: 'px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-md'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteBillAPIs(bill._id);
                    fetchData();
                    Swal.fire({
                        icon: 'success',
                        title: 'Đã xóa!',
                        text: 'Hóa đơn đã được xóa thành công.',
                        timer: 1500,
                        showConfirmButton: false,
                        background: '#f0f9f5',
                        iconColor: '#27ae60'
                    });
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: 'Không thể xóa hóa đơn. Vui lòng thử lại.',
                        background: '#fff0f0',
                        iconColor: '#c0392b'
                    });
                }
            }
        });

    }
    return (
        <div className="p-4 space-y-4">
            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex gap-2 items-center flex-wrap">
                    <Input
                        placeholder="Tìm theo số phòng"
                        value={roomFilter}
                        onChange={(e) => setRoomFilter(e.target.value)}
                        className="w-[160px]"
                    />

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="paid">Thanh toán</SelectItem>
                            <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={monthFilter} onValueChange={setMonthFilter} disabled={showAllUnpaid}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Tháng" />
                        </SelectTrigger>
                        <SelectContent>
                            {monthNames.map((name, index) => (
                                <SelectItem key={index} value={String(index + 1)}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={yearFilter} onValueChange={setYearFilter} disabled={showAllUnpaid}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Năm" />
                        </SelectTrigger>
                        <SelectContent>
                            {yearOptions.map((year) => (
                                <SelectItem key={year} value={year}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>


                </div>

                <div className="flex items-center gap-2">
                    {/* <Button className="bg-gradient-to-br from-pink-500 via-red-400 to-yellow-300 text-black" onClick={() => navigate("/Payments")}>
                        <DollarSignIcon className="mr-1" />
                        Thanh toán trước
                    </Button> */}
                    <Button className="bg-gradient-to-br from-pink-500 via-red-400 to-yellow-300 text-black" onClick={() => setOpen(true)}>
                        <CirclePlusIcon className="mr-2" />
                        Tạo hóa đơn
                    </Button>
                </div>

            </div>
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="showAllUnpaid"
                    checked={showAllUnpaid}
                    onChange={(e) => setShowAllUnpaid(e.target.checked)}
                />
                <label htmlFor="showAllUnpaid" className="text-sm">
                    Tất cả đơn chưa thanh toán
                </label>
            </div>
            {/* Table for desktop */}
            <div className="overflow-x-auto hidden md:block rounded-lg border">
                <Table className="min-w-[700px] bg-white">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-black">ID phòng</TableHead>
                            <TableHead className="text-black">Người thuê</TableHead>
                            <TableHead className="text-black">Tiền phòng</TableHead>
                            <TableHead className="text-black">Tiền Điện & nước </TableHead>
                            <TableHead className="text-black">Tiền dịch vụ</TableHead>
                            <TableHead className="text-black">Tổng tiền</TableHead>
                            <TableHead className="text-black">Trạng thái</TableHead>
                            <TableHead className="text-right text-black">Chức năng</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((bill: any) => (
                            <TableRow key={bill._id}>
                                <TableCell>{bill?.room?.id}</TableCell>
                                <TableCell>{bill?.tenants?.name}</TableCell>
                                <TableCell>{bill?.priceRoom?.toLocaleString()} đ</TableCell>
                                <TableCell>{(bill?.electricityBill + bill?.waterbill).toLocaleString()} đ  </TableCell>
                                <TableCell>{calculate(bill?.servicePrice).toLocaleString()} đ</TableCell>

                                <TableCell>
                                    {bill?.total.toLocaleString()} đ
                                </TableCell>
                                <TableCell>
                                    {bill?.status === "paid" ? (
                                        <div className="text-green-500 font-bold">Thanh toán</div>
                                    ) : (
                                        <div className="text-red-500 font-bold">Chưa thanh toán</div>
                                    )}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button variant="outline" size="icon" onClick={() => handlePayment(bill)}>
                                                {bill?.status !== "paid" ? <CircleCheckBigIcon className="w-4 h-4 text-green-500" /> : <XCircleIcon className="w-4 h-4 text-red-500" />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{bill?.status === "paid" ? "Hủy Thanh toán" : "Thanh toán"} </p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(bill)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile view */}
            <div className="block md:hidden space-y-4">
                {paginatedData.map((bill: any) => (
                    <div key={bill._id} className="border rounded-xl p-4 shadow-sm bg-white">
                        <div className="text-sm mb-2"><strong>ID:</strong> {bill?.room?.id}</div>
                        <div className="text-sm mb-2"><strong>Người thuê:</strong> {bill?.tenants?.name}</div>
                        <div className="text-sm mb-2"><strong>Tiền phòng:</strong> {bill?.priceRoom?.toLocaleString()} đ</div>
                        <div className="text-sm mb-2"><strong>Tiền dịch vụ:</strong> {calculate(bill?.room?.serviceFee).toLocaleString()} đ</div>
                        <div className="text-sm mb-2"><strong> Tiền điện & nước:</strong>{(bill?.electricityBill + bill?.waterbill).toLocaleString()} đ </div>
                        <div className="text-sm mb-2"><strong>Tổng tiền:</strong> {bill?.total.toLocaleString()} đ</div>
                        <div className="text-sm mb-2">
                            <strong>Trạng thái:</strong>{" "}
                            {bill?.status === "paid" ? (
                                <span className="text-green-500 font-bold">Thanh toán</span>
                            ) : (
                                <span className="text-red-500 font-bold">Chưa thanh toán</span>
                            )}
                        </div>
                        <div className="flex justify-end space-x-2 mt-2">
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button variant="outline" size="icon">
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{bill?.status === "paid" ? "Thanh toán" : "Chưa Thanh toán"} </p>
                                </TooltipContent>
                            </Tooltip>

                            <Button variant="destructive" size="icon">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <Button
                        onClick={handlePrev}
                        disabled={page === 1}
                        className="rounded-full px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                    >
                        ← Trước
                    </Button>
                    <span className="text-sm font-medium text-muted-foreground">
                        Trang <span className="text-primary font-semibold">{page}</span> / {totalPages}
                    </span>
                    <Button
                        onClick={handleNext}
                        disabled={page === totalPages}
                        className="rounded-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        Sau →
                    </Button>
                </div>
            )}
            <SearchOrderDialog open={open} setOpen={setOpen} orders={orders} fetchData={fetchData} />
        </div>
    )
}
