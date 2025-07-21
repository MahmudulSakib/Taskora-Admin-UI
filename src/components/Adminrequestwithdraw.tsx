"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminBonusWithdrawRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const fetchData = async (pageNum = 1) => {
    try {
      const res = await axios.get(
        `https://taskora-admin-backend.onrender.com/admin/bonus-withdraw-requests?page=${pageNum}`,
        { withCredentials: true }
      );
      setRequests(res.data.requests);
      setHasNext(res.data.hasNext);
    } catch {
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.post(
        `https://taskora-admin-backend.onrender.com/admin/bonus-withdraw-requests/${id}/update`,
        { status },
        { withCredentials: true }
      );
      toast.success("Status updated");
      fetchData(page);
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Bonus Wallet Withdraw Requests
      </h2>

      <div className="overflow-x-auto rounded-md border">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="hover:bg-[#E3F2FD] bg-[#E3F2FD] transition-colors">
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow
                key={req.id}
                className="hover:bg-[#E0F7FA] transition-colors"
              >
                <TableCell>{req.user.fullName}</TableCell>
                <TableCell>{req.user.email}</TableCell>
                <TableCell>৳{req.amount}</TableCell>
                <TableCell>{req.method}</TableCell>
                <TableCell>
                  {req.method === "mobile_banking" ? (
                    <>
                      Mobile: {req.mobileNumber || "-"} <br />
                      Type: {req.mobileBankType || "-"}
                    </>
                  ) : req.method === "banking" ? (
                    <>
                      Bank: {req.bankName || "-"} <br />
                      Acc: {req.accountNumber || "-"} <br />
                      Branch: {req.branchName || "-"} <br />
                      Name: {req.accountName || "-"}
                    </>
                  ) : (
                    "Unknown"
                  )}
                </TableCell>
                <TableCell className="capitalize">{req.status}</TableCell>
                <TableCell>
                  {new Date(req.createdAt).toLocaleString("en-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    hour12: true,
                  })}
                </TableCell>
                <TableCell>
                  <Select
                    onValueChange={(val) => updateStatus(req.id, val)}
                    defaultValue={req.status}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="mr-1" size={16} />
          Previous
        </Button>
        <span className="font-medium text-muted-foreground">Page {page}</span>
        <Button
          variant="outline"
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasNext}
        >
          Next
          <ChevronRight className="ml-1" size={16} />
        </Button>
      </div>
    </div>
  );
}
