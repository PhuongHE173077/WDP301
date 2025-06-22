import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Download, Edit, EyeIcon, Trash2 } from "lucide-react";
import { getContractsByTenantId } from '@/apis/contract.apis';
import Loader from '@/components/ui-customize/Loader';
import React, { useEffect, useState } from 'react'
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export const Contracts = () => {
    const [loading, setLoading] = useState(false);
    const [contracts, setContracts] = useState([]);
    useEffect(() => { fetchData() }, [])
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true)
        await getContractsByTenantId().then((res) => {
            setContracts(res.data);
            setLoading(false);
        })
    }
    if (loading) return <Loader />
    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                    Danh sách hợp đồng
                </h2>
                <div className="overflow-auto rounded-xl">
                    <Table className="min-w-full text-sm">
                        <TableHeader>
                            <TableRow className="bg-muted">
                                <TableHead className="font-semibold text-gray-700">Mã Phòng</TableHead>
                                <TableHead className="font-semibold text-gray-700">Chủ Phòng</TableHead>
                                <TableHead className="font-semibold text-gray-700">Người Thuê</TableHead>
                                <TableHead className="font-semibold text-gray-700">Hợp Đồng</TableHead>
                                <TableHead className="font-semibold text-gray-700">Trạng thái </TableHead>
                                <TableHead className="font-semibold text-gray-700">Chức Năng</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contracts.map((contract, index) => (
                                <TableRow
                                    key={index}
                                    className="hover:bg-muted/50 transition-colors"
                                >
                                    <TableCell>{contract.room.roomId}</TableCell>
                                    <TableCell>{contract.owner.userName}</TableCell>
                                    <TableCell>
                                        {contract.tenant.map((t) => t.displayName).join(", ")}
                                    </TableCell>

                                    <TableCell>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <a
                                                    href={contract.contractURI}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="hover:text-blue-600"
                                                    >
                                                        {contract.status === "pending_signature" ? <EyeIcon className="h-5 w-5" /> : <Download className="h-5 w-5" />}

                                                    </Button>
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Tải hợp đồng</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={cn(
                                                "font-semibold px-2 py-1 rounded text-sm",
                                                contract.status === "pending_signature" && "text-yellow-600 bg-yellow-100",
                                                contract.status === "pending_review" && "text-blue-600 bg-blue-100",
                                                contract.status === "approved" && "text-green-600 bg-green-100",
                                                contract.status === "rejected" && "text-red-600 bg-red-100"
                                            )}
                                        >
                                            {contract.status === "pending_signature"
                                                ? "Chưa Ký"
                                                : contract.status === "pending_review"
                                                    ? "Đang đợi duyệt"
                                                    : contract.status === "approved"
                                                        ? "Đã được duyệt"
                                                        : "Đã bị từ chối"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="hover:bg-primary/10"
                                            onClick={() => { navigate(`/contract-detail/${contract._id}`) }}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="hover:bg-red-600 hover:text-white"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
