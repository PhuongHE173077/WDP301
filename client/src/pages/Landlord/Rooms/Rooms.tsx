import { deleteRoomAPIs, fetchOrders, fetchRooms } from '@/apis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { CirclePlusIcon, MoveLeftIcon, MoveRight, MoveRightIcon, Pencil, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import DialogCreate from './components/DialogCreate';
import DialogUpdate from './components/DialogUpdate';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export const Rooms = () => {
    const [roomList, setRoomList] = useState([]);
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchId, setSearchId] = useState('');
    const [activeRoom, setActiveRoom] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const roomsPerPage = 5;

    const mobile = useIsMobile();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const rooms = await fetchRooms();
        const orders = await fetchOrders();
        setRoomList(rooms.data);
        setOrder(orders.data);
        setLoading(true);
    };

    const statusRoom = (id) => {
        const now = new Date();
        const findOrder = order.find((o) => o.roomId === id);

        if (!findOrder) return false;
        const startAt = new Date(findOrder.startAt);
        const endAt = new Date(findOrder.duration);
        return now <= endAt;
    };

    const handleDelete = async (room) => {
        Swal.fire({
            title: `Bạn muốn xóa phòng ${room.id} ?`,
            text: 'Bạn không thể khôi phục phòng này!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteRoomAPIs(room._id);
                fetchData();
            }
        });
    };

    const filteredRooms = roomList.filter((room) => {
        const matchId = room.id.toLowerCase().includes(searchId.toLowerCase());
        const isOccupied = statusRoom(room._id);
        if (filterStatus === 'occupied' && !isOccupied) return false;
        if (filterStatus === 'available' && isOccupied) return false;
        return matchId;
    });

    const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);
    const paginatedRooms = filteredRooms.slice(
        (currentPage - 1) * roomsPerPage,
        currentPage * roomsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="p-4 space-y-6">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex  gap-2 items-center">
                    <Input
                        placeholder="Tìm theo số phòng"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="lg:w-80"
                    />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="occupied">Đã thuê</SelectItem>
                            <SelectItem value="available">Trống</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button className="bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-700 text-white shadow-md" onClick={() => setOpen(true)}>
                    <CirclePlusIcon className="mr-2 h-4 w-4" />
                    Tạo phòng
                </Button>
            </div>

            {/* Room Table */}
            <div className="hidden md:block px-4">
                <Card className="overflow-x-auto rounded-2xl shadow-lg">
                    <table className="min-w-full text-sm table-auto border-separate border-spacing-y-2">
                        <thead className="text-left text-gray-600">
                            <tr>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Hình ảnh</th>
                                <th className="px-4 py-2">Diện tích</th>
                                <th className="px-4 py-2">Giá</th>
                                <th className="px-4 py-2">Trạng thái</th>
                                <th className="px-4 py-2">Tiện ích</th>
                                <th className="px-4 py-2 text-right">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRooms.map((room) => (
                                <tr key={room.id} className="bg-white hover:bg-gray-50 rounded-lg shadow-sm">
                                    <td className="px-4 py-3 font-medium text-gray-800">{room.id}</td>
                                    <td className="px-4 py-3">
                                        <img
                                            src={room.image}
                                            alt="Phòng"
                                            className="w-16 h-16 rounded-md object-cover border border-gray-200"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{room.area} </td>
                                    <td className="px-4 py-3 text-green-600 font-semibold">{room.price.toLocaleString()} đ</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={statusRoom(room._id) ? "default" : "destructive"}>
                                            {statusRoom(room._id) ? "✅ Đã thuê" : "❌ Trống"}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant="secondary" className="text-blue-700 bg-blue-100">
                                            {room.utilities}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <Button variant="outline" size="icon" onClick={() => {
                                            setActiveRoom(room);
                                            setOpen2(true);
                                        }}>
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button variant="destructive" size="icon" onClick={() => handleDelete(room)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
            {/* Mobile view */}
            <div className="block md:hidden space-y-4">
                {filteredRooms.map((room) => (
                    <div key={room.id} className="border rounded-xl p-4 shadow-sm bg-white">
                        <div className="text-sm mb-2">
                            <span className="font-semibold">ID:</span> {room.id}
                        </div>
                        <div className="mb-2">
                            <img src={room.image} alt="Phòng" className="w-full h-40 object-cover rounded" />
                        </div>
                        <div className="text-sm mb-2">
                            <span className="font-semibold">Diện tích:</span> {room.area}
                        </div>
                        <div className="text-sm mb-2 text-green-600 font-medium">
                            <span className="font-semibold text-gray-700">Giá:</span> {room.price.toLocaleString()}
                        </div>
                        <div className="text-sm mb-2">
                            <span className="font-semibold">Trạng thái:</span>{' '}
                            <span className={statusRoom(room._id) ? 'text-green-500' : 'text-red-500'}>
                                {statusRoom(room._id) ? '✅ Đã thuê' : '❌ Trống'}
                            </span>
                        </div>
                        <div className="text-sm mb-4">
                            <span className="font-semibold">Tiện ích:</span>{' '}
                            <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                                {room.utilities}
                            </span>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="icon">
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => handleDelete(room)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-2">
                <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <MoveLeftIcon className="mr-2 h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-700">
                    Trang <strong>{currentPage}</strong> / {totalPages}
                </span>
                <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <MoveRightIcon className="mr-2 h-4 w-4" />
                </Button>
            </div>

            {/* Dialog Create */}
            <DialogCreate open={open} setOpen={setOpen} fetchData={fetchData} />
            {activeRoom && <DialogUpdate open={open2} setOpen={setOpen2} fetchData={fetchData} room={activeRoom} />}
        </div>
    );
};