
import { getDepartmentsByOwner } from '@/apis/departmentApi';
import { fetchOrders } from '@/apis/order.apis';
import { Button } from '@/components/ui/button';
import { ChevronDown, Delete, DeleteIcon, EditIcon, NotepadText, ViewIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DialogCreateBill } from './components/DialogCreateBill';
import { useNavigate } from 'react-router-dom';
import Loader from '@/components/ui-customize/Loader';
import { deleteBillAPIs, fetchBillsAPIs } from '@/apis/bill.apis';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';


export const Bills = () => {
    const [orderRooms, setOrderRooms] = useState<any[]>([]);
    const [month, setMonth] = useState('2024-02');
    const [departments, setDepartments] = useState<any[]>([]);
    const [house, setHouse] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [openDialogCreate, setOpenDialogCreate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bills, setBills] = useState<any[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        await fetchOrders().then(res => {
            setOrderRooms(res.data.filter((item: any) => item.startAt));
        });
        await getDepartmentsByOwner().then(res => {
            setDepartments(res.data);
        });
        await fetchBillsAPIs().then(res => {
            setBills(res.data);
        });
        setLoading(false);
    };

    const handleDeleteBill = async (id: string) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa hóa đơn này?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteBillAPIs(id).then(() => {
                    fetchBillsAPIs().then(res => {
                        setBills(res.data);
                    });
                })
            }
        });


    }

    if (loading) return <Loader />

    return (
        <div className="">
            <div className="flex justify-between items-center mb-2">
                <div className="flex">
                    <NotepadText className="text-2xl text-gray-700 mr-2" />
                    <h2 className="font-bold text-lg mb-4">Tính tiền</h2>
                </div>
                <div className="flex gap-10">
                    <Button className="bg-green-600 text-white px-4 py-1 rounded" size='sm' onClick={() => setOpenDialogCreate(true)}>Tạo hóa đơn</Button>
                    <Button className="bg-orange-500 text-white px-4 py-1 rounded" size='sm'>Xuất dữ liệu</Button>
                </div>
            </div>
            <div className="bg-white rounded shadow">
                <div className="font-semibold mb-2 rounded bg-gray-100 p-1 flex">
                    <ChevronDown className="text-2xl text-gray-700 mr-2" />
                    <span>Bộ lọc tìm kiếm</span>
                </div>
                <div className="mb-4 flex flex-wrap gap-6 p-4 items-center">
                    <div>
                        <label className="mr-2">Tháng/năm:</label>
                        <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="border rounded px-2 py-1" />
                    </div>
                    <div>
                        <label className="mr-2">Tòa:</label>
                        <select value={house} onChange={e => setHouse(e.target.value)} className="border rounded px-2 py-1 min-w-30">
                            <option value="">Tất cả</option>
                            {departments.map(h => (
                                <option key={h._id} value={h._id}>{h.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mr-2">Mã phòng:</label>
                        <input type="text" value={roomCode} onChange={e => setRoomCode(e.target.value)} placeholder="Nhập mã phòng ..." className="border rounded px-2 py-1" />
                    </div>

                </div>
            </div>
            <div className="p-6 bg-white rounded shadow mt-5">
                {bills.length === 0 ? (
                    <div className="text-center text-gray-500 " >Chưa tạo hóa đơn nào </div>
                ) :
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-2 py-1">STT</th>
                                        <th className="border px-2 py-1">Thời gian</th>
                                        <th className="border px-2 py-1">Nhà</th>
                                        <th className="border px-2 py-1">Phòng</th>
                                        <th className="border px-2 py-1">Tên khách</th>
                                        <th className="border px-2 py-1">Số tiền (VND)</th>
                                        <th className="border px-2 py-1">Đã trả (VND)</th>
                                        <th className="border px-2 py-1">Còn lại (VND)</th>
                                        <th className="border px-2 py-1">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bills.map((row: any, idx) => (
                                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="border px-2 py-1 text-center">{idx + 1}</td>
                                            <td className="border px-2 py-1 text-center">{dayjs(row?.time).format("MM/YYYY")}</td>
                                            <td className="border px-2 py-1 text-center">{departments.find(d => d._id === row?.roomId?.departmentId._id)?.name}</td>
                                            <td className="border px-2 py-1 text-center">{row?.roomId?.roomId}</td>
                                            <td className="border px-2 py-1">{row?.tenantId.displayName}</td>
                                            <td className="border px-2 py-1 text-right">{row?.status ? row?.total.toLocaleString() :
                                                <div className='bg-yellow-100 text-yellow-800 px-2 w-fit rounded'>
                                                    chưa cập nhật
                                                </div>
                                            } </td>
                                            <td className="border px-2 py-1 text-right">{row?.status ? row?.prepay.toLocaleString() : <div className='bg-yellow-100 text-yellow-800 px-2 w-fit rounded'>
                                                chưa cập nhật
                                            </div>
                                            }</td>
                                            <td className="border px-2 py-1 text-right">
                                                {row?.status ? (row?.total - row?.prepay).toLocaleString() : <div className='bg-yellow-100 text-yellow-800 px-2 w-fit rounded'>
                                                    chưa cập nhật
                                                </div>
                                                }
                                            </td>
                                            <td className="border px-2 py-1 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    {row.status && <button title="Xem" className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"><ViewIcon className='w-4 h-4' /></button>}
                                                    <button title="Sửa" onClick={() => navigate(`/calculate-bill/${row._id}`)} className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"><EditIcon className='w-4 h-4' /></button>
                                                    <button title="Xóa" onClick={() => handleDeleteBill(row._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"><Delete className='w-4 h-4' /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <div></div>
                            <div>Page 1 of 1</div>
                        </div>
                    </>}
            </div>
            <DialogCreateBill open={openDialogCreate} setOpen={setOpenDialogCreate} orderRooms={orderRooms} departments={departments} fetchData={fetchData} />
        </div>

    );
}
