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
import { fetchFeedback} from "@/apis";


const PAGE_SIZE = 5;

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const [activeFeedback, setActiveFeedback] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const totalPages = Math.ceil(feedbacks.length / PAGE_SIZE);

  const paginatedData = feedbacks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    fetchData();
  }, []);

 const fetchData = async () => {
         await fetchFeedback().then((res) => {
             setFeedbacks(res.data);
         })
     }


  return (
    <Card className="p-4 space-y-4">
      <div className="hidden md:block overflow-x-auto rounded-lg border ">
        <Table className="min-w-[700px] bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Tenant</TableHead>
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
                <TableCell>{fb.content}</TableCell>
                <TableCell>
                  <span className={`font-semibold ${fb.status === 'Pending' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {fb.status}
                  </span>
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
            <Button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
              Sau
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}