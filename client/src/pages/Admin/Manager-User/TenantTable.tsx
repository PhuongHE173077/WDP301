import React, { useEffect, useMemo, useState } from 'react';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchTenantAPIs, deleteTenantAPIs, restoreTenantAPIs } from '@/apis/tenant.apis';
import { Search } from 'lucide-react';
import Swal from 'sweetalert2';
import { MdOutlineAutoDelete, MdRestore } from 'react-icons/md';

const PAGE_SIZE = 5;

type User = {
  _id: string;
  displayName: string;
  phone: string;
  dateOfBirth: string;
  email: string;
  address: string;
  _destroy?: boolean;
};

const TenantTable: React.FC = () => {
  const [tenants, setTenants] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async () => {
    try {
      const res = await fetchTenantAPIs();
      const data = res.data ?? res;
      setTenants(data);
    } catch (error) {
      console.error('Lỗi khi tải tenants:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    return tenants.filter(user =>
      (user.displayName.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search))
    );
  }, [tenants, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (tenant: User) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn?',
      html: `
        <div style="text-align:left; font-size: 15px;">
          <p><strong>Tên:</strong> ${tenant.displayName}</p>
          <p><strong>Email:</strong> ${tenant.email}</p>
          <p><strong>SĐT:</strong> ${tenant.phone}</p>
          <p style="color:red; font-weight:500">⚠️ Thao tác này sẽ khoá tài khoản!</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận khoá',
      cancelButtonText: 'Huỷ',
      confirmButtonColor: '#d33',
      focusCancel: true
    });

    if (result.isConfirmed) {
      try {
        await deleteTenantAPIs(tenant._id);
        setTenants(prev =>
          prev.map(u => u._id === tenant._id ? { ...u, _destroy: true } : u)
        );
        Swal.fire({
          icon: 'success',
          title: 'Đã khoá người thuê!',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Lỗi khoá:', error);
        Swal.fire('Lỗi!', 'Không thể khoá người thuê.', 'error');
      }
    }
  };

  const handleRestore = async (tenant: User) => {
    const result = await Swal.fire({
      title: 'Khôi phục người dùng?',
      text: `Bạn có chắc chắn muốn khôi phục lại ${tenant.displayName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Khôi phục',
      cancelButtonText: 'Huỷ',
      confirmButtonColor: '#10b981'
    });

    if (result.isConfirmed) {
      try {
        await restoreTenantAPIs(tenant._id);
        setTenants(prev =>
          prev.map(u => u._id === tenant._id ? { ...u, _destroy: false } : u)
        );
        Swal.fire({
          icon: 'success',
          title: 'Đã khôi phục!',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Lỗi khôi phục:', error);
        Swal.fire('Lỗi!', 'Không thể khôi phục người thuê.', 'error');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Search box */}
      <div className="flex flex-wrap items-center gap-4 justify-end">
        <div className="relative w-[280px]">
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
            <TableHead className="text-center">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map(tenant => (
            <TableRow key={tenant._id}>
              <TableCell>{tenant.displayName}</TableCell>
              <TableCell>{tenant.phone}</TableCell>
              <TableCell>{new Date(tenant.dateOfBirth).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell>{tenant.email}</TableCell>
              <TableCell>{tenant.address}</TableCell>
              <TableCell className="text-center space-x-2">
                {tenant._destroy ? (
                  <Button size="sm" variant="default" onClick={() => handleRestore(tenant)}>
                    <MdRestore />
                    Khôi phục
                  </Button>
                ) : (
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(tenant)}>
                    <MdOutlineAutoDelete />
                    Khoá
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
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

export default TenantTable;
