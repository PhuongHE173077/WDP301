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
    displayName: string;
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
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-lg border ">
                <Table className="min-w-[700px] bg-white">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10">#</TableHead>
                            <TableHead>Tên</TableHead>
                            <TableHead>SĐT</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Chức năng</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((user, idx) => (
                            <TableRow key={user.id}>
                                <TableCell>{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                                <TableCell>{user.displayName}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => {
                                            setActiveUser(user);
                                            setOpenDialog(true);
                                        }}>
                                            Xem
                                        </Button>                                        
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
