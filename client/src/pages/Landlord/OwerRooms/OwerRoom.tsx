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
import { EyeIcon, Pencil, Trash2, UserPlus, UserPlus2Icon, UserPlusIcon } from "lucide-react"
import { deleteOrderAPIs, fetchOrders, fetchRooms, fetchTenants } from "@/apis"
import dayjs from "dayjs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Swal from "sweetalert2"
import ScrollUserDialog from "./components/DialogView"
import AddUserDialog from "./components/DialogAdd"

const ITEMS_PER_PAGE = 7

export const OwerRoom: React.FC = () => {
    const [orders, setOrders] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [page, setPage] = useState(1)
    const [open, setOpen] = useState(false)
    const [activeOrder, setActiveOrder] = useState(null)
    const [orderId, setOrderId] = useState(null)
    const [openAddUser, setOpenAddUser] = useState(false)
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetchOrders().then((res) => {
            setOrders(res.data)
        })
        fetchTenants().then((res) => {
            setUsers(res.data)
        })
    }, [])

    const fetchData = async () => {
        const orders = await fetchOrders();
        setOrders(orders.data);
    };

    const filteredOrders = orders.filter((tenant: any) => {
        const id = tenant?.room?.id?.toString()?.toLowerCase() || ""
        const name = tenant?.tenants?.name?.toLowerCase() || ""
        return (
            id.includes(searchTerm.toLowerCase()) ||
            name.includes(searchTerm.toLowerCase())
        )
    })

    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)

    const paginatedData = filteredOrders.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    )

    const handlePrev = () => setPage((p) => Math.max(p - 1, 1))
    const handleNext = () => setPage((p) => Math.min(p + 1, totalPages))

    const handleDelete = (order: any) => {
        Swal.fire({
            title: `Bạn muốn xóa ${order.tenants.name} khỏi phòng ${order.room.id} ?`,
            text: 'Hàng động không thể khôi phục !',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteOrderAPIs(order._id).then(() => {
                    fetchOrders().then((res) => {
                        setOrders(res.data)
                    })
                })

            }
        });
    }


    return (
        <div className="p-4">
            {/* Ô tìm kiếm */}
            <div className="mb-4 flex justify-between items-center ">
                <input
                    type="text"
                    placeholder="Tìm theo tên người thuê hoặc ID phòng"
                    className="w-full md:w-1/3 px-4 py-2 border rounded-md "
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setPage(1)
                    }}
                />
            </div>

            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto hidden md:block rounded-lg border shadow-lg">
                <Table className="min-w-[700px] bg-white">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID phòng</TableHead>
                            <TableHead>Người thuê</TableHead>
                            <TableHead>Ngày bắt đầu</TableHead>
                            <TableHead>Thời hạn</TableHead>
                            <TableHead>Hợp đồng</TableHead>
                            <TableHead className="text-right">Chức năng</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((tenant: any) => (
                            <TableRow key={tenant._id}>
                                <TableCell>{tenant?.room?.id}</TableCell>
                                <TableCell>{tenant?.tenants?.name}</TableCell>
                                <TableCell>{tenant?.startAt ? dayjs(tenant?.startAt).format('DD/MM/YYYY') : ""}</TableCell>
                                <TableCell>{tenant?.startAt ? dayjs(tenant?.duration).format('DD/MM/YYYY') : ""}</TableCell>
                                <TableCell>{tenant?.contract}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Tooltip >
                                        <TooltipTrigger>
                                            <Button variant="outline" size="icon" onClick={() => {
                                                setActiveOrder(tenant.history);
                                                setOpen(true)
                                            }}>
                                                <EyeIcon className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Xem lịch sử thuê trọ
                                        </TooltipContent>
                                    </Tooltip>

                                    <Button variant={tenant.tenants ? "destructive" : "secondary"} size="icon">
                                        {tenant.tenants ?
                                            <Tooltip >
                                                <TooltipTrigger>
                                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(tenant)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Xóa người thuê
                                                </TooltipContent>
                                            </Tooltip>
                                            :
                                            <Tooltip >
                                                <TooltipTrigger>
                                                    <Button variant="outline" size="icon" onClick={() => {
                                                        setOrderId(tenant._id);
                                                        setOpenAddUser(true)
                                                    }}>
                                                        <UserPlusIcon className="w-4 h-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Thêm người thuê
                                                </TooltipContent>
                                            </Tooltip>
                                        }
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile stacked version */}
            <div className="block md:hidden space-y-4">
                {paginatedData.map((tenant: any) => (
                    <div
                        key={tenant._id}
                        className="border rounded-xl p-4 shadow-sm bg-white"
                    >
                        <div className="text-sm mb-2">
                            <span className="font-semibold">ID:</span> {tenant?.room?.id}
                        </div>
                        <div className="text-sm mb-2">
                            <span className="font-semibold">Người thuê:</span> {tenant?.tenants?.name}
                        </div>
                        <div className="text-sm mb-2">
                            <span className="font-semibold">Thời hạn:</span> {dayjs(tenant?.duration).format('DD/MM/YYYY')}
                        </div>
                        <div className="text-sm mb-4">
                            <span className="font-semibold">Hợp đồng:</span> {tenant?.contract}
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Tooltip >
                                <TooltipTrigger>
                                    <Button variant="outline" size="icon" onClick={() => {
                                        setActiveOrder(tenant.history);
                                        setOpen(true)
                                    }}>
                                        <EyeIcon className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Xem lịch sử thuê trọ
                                </TooltipContent>
                            </Tooltip>

                            <Button variant={tenant.tenants ? "destructive" : "secondary"} size="icon">
                                {tenant.tenants ?
                                    <Tooltip >
                                        <TooltipTrigger>
                                            <Button variant="destructive" size="icon" onClick={() => handleDelete(tenant)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Xóa người thuê
                                        </TooltipContent>
                                    </Tooltip>
                                    :
                                    <Tooltip >
                                        <TooltipTrigger>
                                            <Button variant="outline" size="icon" onClick={() => {
                                                setOrderId(tenant._id);
                                                setOpenAddUser(true)
                                            }}>
                                                <UserPlusIcon className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Thêm người thuê
                                        </TooltipContent>
                                    </Tooltip>
                                }
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
                        className="rounded-full px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ← Trước
                    </Button>

                    <span className="text-sm font-medium text-muted-foreground">
                        Trang <span className="text-primary font-semibold">{page}</span> / {totalPages}
                    </span>

                    <Button
                        onClick={handleNext}
                        disabled={page === totalPages}
                        className="rounded-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Sau →
                    </Button>
                </div>
            )}
            {activeOrder && <ScrollUserDialog open={open} setOpen={setOpen} users={activeOrder} />}
            {orderId && <AddUserDialog open={openAddUser} setOpen={setOpenAddUser} users={users} orderId={orderId} fetchData={fetchData} />}
        </div>
    )
}
