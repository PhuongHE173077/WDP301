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
import { fetchFeedback, updateFeedbackReply } from "@/apis"; // 👈 cần thêm hàm update

const PAGE_SIZE = 5;

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [replyDraft, setReplyDraft] = useState("");
  const totalPages = Math.ceil(feedbacks.length / PAGE_SIZE);

  const paginatedData = feedbacks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetchFeedback();
    setFeedbacks(res.data);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="hidden md:block overflow-x-auto rounded-lg border ">
        <Table className="min-w-[700px] bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reply</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((fb, idx) => (
              <TableRow key={fb._id}>
                <TableCell>{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                <TableCell>{fb.tenantName}</TableCell>
                <TableCell>{fb.description}</TableCell>
                <TableCell>
                  <div className="flex gap-2 max-w-[200px] overflow-x-auto">
                    {fb.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Ảnh ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-semibold ${fb.status === "Pending" ? "text-yellow-600" : "text-green-600"
                      }`}
                  >
                    {fb.status}
                  </span>
                </TableCell>
                <TableCell>
                  <input
                    type="text"
                    value={fb.reply || ""}
                    placeholder="Nhập phản hồi..."
                    className="text-sm text-gray-700 w-full border border-transparent focus:border-gray-300 px-2 py-1 rounded-md outline-none"
                    onChange={(e) => {
                      const updated = [...feedbacks];
                      updated[(page - 1) * PAGE_SIZE + idx].reply = e.target.value;
                      setFeedbacks(updated);
                    }}
                    onBlur={async (e) => {
                      const newReply = e.target.value.trim();

                      try {
                        await fetch(`/api/v1/feedback/${fb._id}/reply`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            reply: newReply,
                          }),
                        });

                        const updated = [...feedbacks];
                        updated[(page - 1) * PAGE_SIZE + idx].status = 'Replied';
                        setFeedbacks(updated);
                      } catch (error) {
                        console.error("Lỗi khi cập nhật phản hồi:", error);
                      }
                    }}
                  />
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
    </Card>
  );
}
