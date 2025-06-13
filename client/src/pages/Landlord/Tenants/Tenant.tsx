import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { CirclePlusIcon, Eye, EyeIcon } from "lucide-react";
import { fetchTenants } from "@/apis";
import Swal from "sweetalert2";
import { DialogView } from "./components/DialogView";

type User = {
    id: number;
    name: string;
    phone: string;
    email: string;
    birthYear: number;
};



const PAGE_SIZE = 5;

export default function Tenant() {
    const [tenants, setTenants] = useState([]);
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const totalPages = Math.ceil(tenants.length / PAGE_SIZE);
    const [activeUser, setActiveUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const paginatedData = tenants.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        await fetchTenants().then((res) => {
            setTenants(res.data);
        })
    }



    return (
        <Card className="p-4 space-y-4">
            <Button className="w-full md:w-auto bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-700 text-black" onClick={() => setOpen(true)}>
                <CirclePlusIcon className="mr-2 h-4 w-4 " />
                Thêm người dùng</Button>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-lg border ">
                <Table className="min-w-[700px] bg-white">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10">#</TableHead>
                            <TableHead>Tên</TableHead>
                            <TableHead>SĐT</TableHead>
                            <TableHead className="hidden lg:table-cell">Email</TableHead>
                            <TableHead>Chức năng</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((user, idx) => (
                            <TableRow key={user.id}>
                                <TableCell>{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell className="hidden lg:table-cell">{user.email}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => {
                                            setActiveUser(user);
                                            setOpenDialog(true);
                                        }}>
                                            xem
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            Sửa
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4">
                {paginatedData.map((user, idx) => (
                    <div
                        key={user.id}
                        className="border rounded-lg p-4 bg-white shadow-sm space-y-2"
                    >
                        <p className="text-sm">
                            <strong>STT:</strong> {(page - 1) * PAGE_SIZE + idx + 1}
                        </p>
                        <p className="text-sm">
                            <strong>Tên:</strong> {user.name}
                        </p>
                        <p className="text-sm">
                            <strong>SĐT:</strong> {user.phone}
                        </p>
                        <p className="text-sm">
                            <strong>Email:</strong> {user.email}
                        </p>
                        <p className="text-sm">
                            <strong>Năm Sinh:</strong> {user.birthYear}
                        </p>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button size="sm" variant="outline">
                                Sửa
                            </Button>

                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                    <p className="text-sm">
                        Trang <strong>{page}</strong> / {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
                            Trước
                        </Button>
                        <Button
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            disabled={page === totalPages}
                        >
                            Sau
                        </Button>
                    </div>
                </div>
            )}
            <DialogView open={openDialog} setOpen={setOpenDialog} user={activeUser} />
        </Card>
    );
}
