import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fetchTransactionByAdmin } from "@/apis/transaction";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface User {
  fullName: string;
  email: string;
  displayName: string;
}

interface Transaction {
  _id: string;
  senderId: User;
  receiverId: User;
  amount: number;
  bank: string;
  cardType: string;
  description?: string;
  status: "pending" | "success" | "failed";
  createdAt: string;
}

const HistoryPayment = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetchTransactionByAdmin();
        setTransactions(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy giao dịch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const senderName = tx.senderId?.displayName?.toLowerCase() || "";
      const senderEmail = tx.senderId?.email?.toLowerCase() || "";
      return (
        senderName.includes(searchQuery.toLowerCase()) ||
        senderEmail.includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, transactions]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  return (
    <Card className="p-6 shadow-lg border rounded-xl">
      <h2 className="text-2xl font-bold text-center text-primary mb-6">
        Lịch sử nâng cấp gói
      </h2>

      <div className="flex items-center justify-between mb-4">
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          className="w-full max-w-sm"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // reset về trang đầu khi tìm
          }}
        />
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>Người gửi</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Ngân hàng</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thời gian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((tx) => (
                <TableRow key={tx._id}>
                  <TableCell className="font-medium">
                    {tx.senderId?.displayName || "N/A"}
                  </TableCell>
                  <TableCell>{tx.senderId?.email || "N/A"}</TableCell>
                  <TableCell className="text-green-600 font-semibold">
                    {tx.amount.toLocaleString()} VND
                  </TableCell>
                  <TableCell className="italic text-sm text-muted-foreground">
                    {tx.bank || "Ví nội bộ"}
                  </TableCell>
                  <TableCell>{tx.description || "Không có"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tx.status === "success"
                          ? "default"
                          : tx.status === "failed"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {tx.status === "success"
                        ? "Thành công"
                        : tx.status === "failed"
                        ? "Thất bại"
                        : "Đang xử lý"}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(tx.createdAt), "dd/MM/yyyy HH:mm")}</TableCell>
                </TableRow>
              ))}
              {paginatedTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground italic">
                    Không tìm thấy giao dịch nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">
              Trang {currentPage} / {totalPages || 1}
            </span>
            <div className="space-x-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Trước
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              >
                Sau <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default HistoryPayment;
