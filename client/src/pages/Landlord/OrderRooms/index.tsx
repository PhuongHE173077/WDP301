import { fetchOrders } from '@/apis/order.apis'
import { fetchTenantAPIs } from '@/apis/tenant.apis'
import Loader from '@/components/ui-customize/Loader'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import dayjs from "dayjs"
import { ClipboardPenLineIcon, EyeIcon, Trash2, UserPlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import AddUserDialog from './components/DialogAdd'

export const OrderRooms = () => {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [page, setPage] = useState(1)
    const [open, setOpen] = useState(false)
    const [activeOrder, setActiveOrder] = useState(null)
    const [orderId, setOrderId] = useState(null)
    const [openAddUser, setOpenAddUser] = useState(false)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async () => {
        setLoading(true)
        const orders = await fetchOrders();
        const tenant = await fetchTenantAPIs();
        setOrders(orders.data);
        setUsers(tenant.data);
        setLoading(false)
    };

    const handleDelete = async (data: any) => {
        Swal.fire({
            title: `Bạn có muốn xóa người thuê ra khỏi phòng ${data.room.roomId}? `,
            text: data.contract ? `Phòng này đã tạo hợp đồng khi xóa trước hết hạn thì có thể đền hợp đồng!` : "Hành động này không thể phục hồi! ",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa!",
            cancelButtonText: "Hủy"
        }).then((result) => {
            if (result.isConfirmed) {
                if (data.contract) {

                }

            }
        });
    }






    if (loading) return <Loader />
    return (
        <div className="p-4">
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

            <div className="overflow-x-auto hidden md:block rounded-lg border shadow-lg">
                <Table className="min-w-[700px] bg-white">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID phòng</TableHead>
                            <TableHead>Người thuê</TableHead>
                            <TableHead>Ngày bắt đầu</TableHead>
                            <TableHead>Thời hạn</TableHead>
                            <TableHead>Hợp đồng</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Chức năng</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((tenant: any) => (
                            <TableRow key={tenant._id}>
                                <TableCell>
                                    <strong>{tenant?.room?.roomId}</strong>
                                </TableCell>
                                <TableCell>
                                    <ul>
                                        {tenant?.tenants?.map((t: any) => (

                                            <li key={t._id} className='mb-2'>
                                                {t?.displayName}
                                            </li>
                                        ))}
                                    </ul>
                                </TableCell>
                                <TableCell>{tenant?.startAt ? dayjs(tenant?.startAt).format('DD/MM/YYYY') : ""}</TableCell>
                                <TableCell>{tenant?.startAt ? dayjs(tenant?.endAt).format('DD/MM/YYYY') : ""}</TableCell>
                                <TableCell>{tenant?.tenants ?
                                    <Tooltip >
                                        <TooltipTrigger>
                                            <Button variant="outline" size="icon" onClick={() => navigate(`/landlord/contract?orderId=${tenant._id}`)}>
                                                <ClipboardPenLineIcon className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            hợp đồng
                                        </TooltipContent>
                                    </Tooltip> : ""
                                }</TableCell>
                                <TableCell>{tenant?.contract?.status === "pending_signature" ? "Đang đợi phản hồi người thuê"
                                    : tenant?.contract?.status === "pending_review" ? "Đang đợi đuyệt" :
                                        tenant?.contract?.status === "approved" ? "Đã duyệt hợp đồng" :
                                            tenant?.contract?.status === "rejected" ? "Bị từ chối" :
                                                tenant?.tenants ? "Chưa tạo hợp đồng" :
                                                    ""}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    {tenant.tenants && <Button variant={"destructive"} size="icon" onClick={() => handleDelete(tenant)}>

                                        <Tooltip >
                                            <TooltipTrigger>
                                                <Button variant="destructive" size="icon" >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Xóa người thuê
                                            </TooltipContent>
                                        </Tooltip>
                                    </Button>}

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

                                    <Button variant="outline" size="icon" onClick={() => {
                                        setActiveOrder(tenant);
                                        setOpenAddUser(true)
                                    }}>
                                        <Tooltip >
                                            <TooltipTrigger>
                                                <Button variant="outline" size="icon" onClick={() => {
                                                    setActiveOrder(tenant);
                                                    setOpenAddUser(true)
                                                }}>
                                                    <UserPlusIcon className="w-4 h-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {tenant.tenants && tenant.tenants.length > 0
                                                    ? "Thêm người thuê cho phòng này"
                                                    : "Cho thuê phòng"}
                                            </TooltipContent>
                                        </Tooltip>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {openAddUser && <AddUserDialog open={openAddUser} setOpen={setOpenAddUser} order={activeOrder} users={users} fetchData={fetchData} />}

        </div>

    )
}
