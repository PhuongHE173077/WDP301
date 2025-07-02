import React, { useEffect, useMemo, useState } from 'react';
import {
    Table, TableBody, TableCaption, TableCell,
    TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
    Badge
} from '@/components/ui/badge';
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

type User = {
    _id: string;
    displayName: string;
    phone: string;
    dateOfBirth: string;
    email: string;
    address: string;
    isActive: boolean;
    role: string;
};

const PAGE_SIZE = 5;

const getRoleColor = (role: string) => {
    switch (role) {
        case 'admin':
            return 'bg-pink-100 text-pink-700';
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
                setUsers(data);
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
                        <SelectItem value="admin">Admin</SelectItem>
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
                        <TableHead className="text-center">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginated.map(user => (
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
                            <TableCell className="text-center space-x-2">
                                <Button size="sm" variant="destructive">Xóa</Button>
                            </TableCell>
                        </TableRow>
                    ))}
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
