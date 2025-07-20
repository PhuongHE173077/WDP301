import { fetchOrders } from '@/apis/order.apis'
import { fetchTenantAPIs } from '@/apis/tenant.apis'
import Loader from '@/components/ui-customize/Loader'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import dayjs from "dayjs"
import { CirclePlusIcon, ClipboardPenLineIcon, EyeIcon, Trash2, UserPlus2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import AddUserDialog from './components/DialogAdd'
import { getDepartmentsByOwner } from '@/apis/departmentApi'
import { DialogExtension } from './components/DialogExtension'

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
    const [openExtension, setOpenExtension] = useState(false)

    const [departments, setDepartments] = useState<any[]>([]);

    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async () => {
        setLoading(true)
        const orders = await fetchOrders();
        const tenant = await fetchTenantAPIs();
        const department = await getDepartmentsByOwner();
        setOrders(orders.data);
        setUsers(tenant.data);
        setDepartments(department.data);
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

    // Helper function to render contract status beautifully
    const renderContractStatus = (tenant: any) => {
        if (tenant?.contract?.status === "pending_signature" && tenant?.contract?.paid) {
            return <span className="px-2 py-1 rounded bg-green-100 text-green-700 font-medium">Đã thanh toán</span>;
        }
        if (tenant?.contract?.status === "pending_signature") {
            return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 font-medium">Đang đợi phản hồi của người thuê</span>;
        }
        if (tenant?.contract?.status === "rejected") {
            return <span className="px-2 py-1 rounded bg-red-100 text-red-700 font-medium">Bị từ chối</span>;
        }
        if (tenant?.tenants) {
            return <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 font-medium">Chưa tạo hợp đồng</span>;
        }
        return "";
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
                                <TableCell>{renderContractStatus(tenant)}</TableCell>
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

                                    {tenant.tenants && tenant.tenants.length > 0
                                        ?
                                        <Button variant="outline" size="icon" onClick={() => {
                                            setActiveOrder(tenant);
                                            setOpenExtension(true)
                                        }}>
                                            <Tooltip >
                                                <TooltipTrigger>
                                                    <Button variant="outline" size="icon" onClick={() => {
                                                        setActiveOrder(tenant);
                                                        setOpenExtension(true)
                                                    }}>
                                                        <CirclePlusIcon className="w-4 h-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Gia hạn phòng
                                                </TooltipContent>
                                            </Tooltip>
                                        </Button>
                                        :
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
                                                        <UserPlus2Icon className="w-4 h-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Cho thuê phòng
                                                </TooltipContent>
                                            </Tooltip>
                                        </Button>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {openAddUser && <AddUserDialog open={openAddUser} setOpen={setOpenAddUser} order={activeOrder} users={users} fetchData={fetchData} />}
            {openExtension && <DialogExtension open={openExtension} setOpen={setOpenExtension} order={activeOrder} fetchData={fetchData} />}
        </div>

    )
}
