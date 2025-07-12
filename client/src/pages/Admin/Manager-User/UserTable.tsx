import React, { useEffect, useMemo, useState } from 'react';
import {
    Table, TableBody, TableCaption, TableCell,
    TableHead, TableHeader, TableRow
} from '@/components/ui/table';

import {
    Button
} from '@/components/ui/button';
import {
    Input
} from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { fetchAllUserAPIs } from '@/apis';
import { Search } from 'lucide-react';
import { deleteUserAPIs, restoreUserAPIs } from '@/apis/userAPIs';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { MdOutlineAutoDelete, MdRestore } from "react-icons/md";
type User = {
    _id: string;
    displayName: string;
    phone: string;
    dateOfBirth: string;
    email: string;
    address: string;
    isActive: boolean;
    role: string;
    timeExpired: string;
    _destroy?: boolean
};

const PAGE_SIZE = 5;
const MySwal = withReactContent(Swal);
const getRoleColor = (role: string) => {
    switch (role) {
        case 'owner1':
            return 'bg-blue-100 text-blue-700';
        case 'owner2':
            return 'bg-purple-100 text-purple-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const UserTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetchAllUserAPIs();
                const data = res.data ?? res;
                const filteredData = data.filter((user: User) => user.role !== 'admin');
                setUsers(filteredData);
            } catch (error) {
                console.error('Lỗi khi tải người dùng:', error);
            }
        };

        loadData();
    }, []);

    const filtered = useMemo(() => {
        return users.filter(user => {
            const matchSearch =
                user.displayName.toLowerCase().includes(search.toLowerCase()) ||
                user.phone.includes(search);
            const matchRole = roleFilter === 'all' || user.role === roleFilter;
            return matchSearch && matchRole;
        });
    }, [users, search, roleFilter]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const changePage = (page: number) => {
        setCurrentPage(page);
    };

const confirmSwal = (title: string, html: string, confirmText: string, confirmColor = '#d33') =>
    MySwal.fire({
      title,
      html,
      confirmButtonText: confirmText,
      confirmButtonColor: confirmColor,
      showCancelButton: true,
      cancelButtonText: 'Huỷ',
      focusCancel: true,
      customClass: { htmlContainer: 'text-left text-base' }
    });
const handleDelete = async (user: User) => {
    const ok = await confirmSwal(
      'Xác nhận khoá tài khoản?',
      `
        <p><strong>Tên:</strong> ${user.displayName}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p style="color:#dc2626;font-weight:500;margin-top:8px;">⚠️ Tài khoản sẽ bị vô hiệu hoá .</p>
      `,
      'Khoá tài khoản'
    );
    if (!ok.isConfirmed) return;

    try {
      await deleteUserAPIs(user._id);
      setUsers(prev =>
        prev.map(u => (u._id === user._id ? { ...u, _destroy: true } : u))
      );

      MySwal.fire({
        icon: 'success',
        title: 'Đã khoá tài khoản',
        timer: 1800,
        showConfirmButton: false
      });
    } catch (e) {
      console.error(e);
      MySwal.fire('Lỗi', 'Không thể xoá tài khoản.', 'error');
    }
  };

  const handleRestore = async (user: User) => {
    const ok = await confirmSwal(
      'Khôi phục tài khoản?',
      `<p>Bạn muốn khôi phục tài khoản <strong>${user.displayName}</strong>?</p>`,
      'Khôi phục',
      '#16a34a'
    );
    if (!ok.isConfirmed) return;

    try {
      await restoreUserAPIs(user._id);
      setUsers(prev =>
        prev.map(u => (u._id === user._id ? { ...u, _destroy: false } : u))
      );

      MySwal.fire({
        icon: 'success',
        title: 'Đã khôi phục tài khoản',
        timer: 1800,
        showConfirmButton: false
      });
    } catch (e) {
      console.error(e);
      MySwal.fire('Lỗi', 'Không thể khôi phục.', 'error');
    }
  };
    return (
        <div className="space-y-4">
            {/* Search + Filter */}
            <div className="flex flex-wrap items-center gap-4 justify-end">
                <div className="relative w-[280px] ">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm theo tên hoặc SĐT"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-9"
                    />
                </div>

                <Select
                    value={roleFilter}
                    onValueChange={(val) => {
                        setRoleFilter(val);
                        setCurrentPage(1);
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Lọc vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả vai trò</SelectItem>
                        <SelectItem value="owner1">Owner 1</SelectItem>
                        <SelectItem value="owner2">Owner 2</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Họ tên</TableHead>
                        <TableHead>SĐT</TableHead>
                        <TableHead>Ngày sinh</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Địa chỉ</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Vai trò</TableHead>
                        <TableHead>Thời gian hết hạn</TableHead>
                        <TableHead className="text-center">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginated.length > 0 ? (
                        paginated.map(user => (
                            <TableRow key={user._id}>
                                <TableCell>{user.displayName}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{new Date(user.dateOfBirth).toLocaleDateString('vi-VN')}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.address}</TableCell>
                                <TableCell>
                                    {user.isActive ? (
                                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                            Đã xác thực
                                        </span>
                                    ) : (
                                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                                            Chưa xác thực
                                        </span>
                                    )}
                                </TableCell>

                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell>{new Date(user.timeExpired).toLocaleDateString('vi-VN')}</TableCell>
                                <TableCell className="text-center">
                  {user._destroy ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRestore(user)}
                    >
                        <MdRestore />
                      Khôi phục
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(user)}
                    >
                        <MdOutlineAutoDelete />
                      Khoá
                    </Button>
                  )}
                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center py-10">
                                <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12h.01M12 12h.01M9 12h.01M9 16h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h2l1-2h4l1 2h2a2 2 0 012 2v12a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-sm">Không có người dùng nào</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    )
                    }
                </TableBody>
            </Table>

            {/* Phân trang */}
            <div className="flex justify-end gap-2 mt-2">
                {[...Array(totalPages)].map((_, idx) => {
                    const page = idx + 1;
                    return (
                        <Button
                            key={page}
                            variant={page === currentPage ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => changePage(page)}
                        >
                            {page}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};

export default UserTable;
