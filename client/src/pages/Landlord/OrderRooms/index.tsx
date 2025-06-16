import { fetchOrders } from '@/apis/order.apis'
import { fetchTenantAPIs } from '@/apis/tenant.apis'
import Loader from '@/components/ui-customize/Loader'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import dayjs from "dayjs"
import { ClipboardPenLineIcon, EyeIcon, Trash2, Upload, UserPlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import AddUserDialog from './components/DialogAdd'
import { useNavigate } from 'react-router-dom'

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
    const [openUpload, setOpenUpload] = useState(false)
    const [orderUpload, setOrderUpload] = useState(null)
    const [imagePreview, setImagePreview] = useState('')
    const [openView, setOpenView] = useState(false)
    const [loading, setLoading] = useState(false)
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
                                <TableCell>{tenant?.contract?.status === "pending_signature" ? "Đang đợi phản hồi người thuê" : tenant?.tenants ? "Chưa tạo hợp đồng" : ""}</TableCell>
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
                                                    <Button variant="destructive" size="icon" >
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
                                                        setActiveOrder(tenant);
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

            {openAddUser && <AddUserDialog open={openAddUser} setOpen={setOpenAddUser} order={activeOrder} users={users} fetchData={fetchData} />}


        </div>

    )
}
