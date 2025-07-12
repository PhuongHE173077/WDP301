import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, PlusCircle, RotateCcw, PackageX } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { deletePackageAPIs, getPackagesAPIs } from '@/apis/package.apis';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';


const MySwal = withReactContent(Swal);
const PackageTable = () => {
    const [packages, setPackages] = useState([]);
    const navigate = useNavigate();

    const fetchPackages = async () => {
        try {
            const res = await getPackagesAPIs();
            setPackages(res.data);
        } catch (error) {
            console.error("Error fetching packages:", error);
        }
    };

    const handleDelete = async (id) => {
        const confirm = await MySwal.fire({
            title: 'Xác nhận xoá',
            text: 'Bạn có chắc chắn muốn xoá gói này không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Huỷ'
        });

        if (confirm.isConfirmed) {
            try {
                await deletePackageAPIs(id);
                fetchPackages();
                MySwal.fire('Đã xoá!', 'Gói đã được xoá thành công.', 'success');
            } catch (err) {
                console.error("Delete failed:", err);
                MySwal.fire('Lỗi', 'Không thể xoá gói.', 'error');
            }
        }
    };


    useEffect(() => {
        fetchPackages();
    }, []);

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4 w-full">
                <h2 className="text-3xl font-semibold text-center flex-1">Danh sách gói dịch vụ</h2>

            </div>
            <div className="w-full flex justify-end mb-4">
                <Button
                    variant="default"
                    onClick={() => navigate('/packages/create')}
                >
                    <PlusCircle className="w-4 h-4 mr-2" /> Thêm gói mới
                </Button>
            </div>



            {packages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <PackageX className="w-16 h-16 mb-4" />
                    <p className="text-lg font-medium">Hiện chưa có gói dịch vụ nào.</p>
                    <Button className="mt-4" onClick={() => navigate('/packages/create')}>
                        <PlusCircle className="w-4 h-4 mr-2" /> Thêm gói mới ngay
                    </Button>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên gói</TableHead>
                            <TableHead>Mô tả</TableHead>
                            <TableHead>Giá (VNĐ)</TableHead>
                            <TableHead>Thời gian (tháng)</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {packages.map((pkg) => (
                            <TableRow key={pkg._id}>
                                <TableCell>{pkg.name}</TableCell>
                                <TableCell>
                                    <ul className="list-disc pl-4">
                                        {pkg.description.map((desc, index) => (
                                            <li key={index}>{desc}</li>
                                        ))}
                                    </ul>
                                </TableCell>
                                <TableCell>{pkg.price.toLocaleString()}</TableCell>
                                <TableCell>{pkg.availableTime}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" size="icon"
                                        onClick={() => navigate(`/packages/edit/${pkg._id}`)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(pkg._id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};

export default PackageTable;
