"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Snackbar, Alert } from "@mui/material";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface RechargeRequest {
  id: string;
  mobileNumber: string;
  operator: string;
  simType: string;
  amount: string;
  status?: string;
  createdAt: string;
  user?: {
    fullName: string;
    email: string;
  };
}

export default function AdminRechargeRequests() {
  const [requests, setRequests] = useState<RechargeRequest[]>([]);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
  }>({
    open: false,
    message: "",
    type: "success",
  });

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "https://taskora-admin-backend.onrender.com/admin/mobile-recharge-requests",
        {
          withCredentials: true,
        }
      );
      setRequests(res.data);
    } catch {
      setToast({
        open: true,
        message: "Failed to fetch recharge requests",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await axios.post(
        "https://taskora-admin-backend.onrender.com/admin/update-mobile-recharge-status",
        { id, status: newStatus },
        { withCredentials: true }
      );
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
      );
      setToast({
        open: true,
        message: "Status updated successfully.",
        type: "success",
      });
    } catch (err) {
      setToast({
        open: true,
        message: "Failed to update status.",
        type: "error",
      });
    }
  };

  const getRowColor = (index: number) =>
    index % 2 === 0 ? "bg-white" : "bg-[#F6FAFD]";

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 pb-20 space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <h2 className="text-2xl font-bold text-[#09203F]">
          Mobile Recharge Requests
        </h2>
      </div>

      <Card className="rounded-3xl shadow-md border border-gray-200">
        <CardContent className="overflow-auto p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E3F2FD]">
                <TableHead className="font-bold">User</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold">Mobile</TableHead>
                <TableHead className="font-bold">Operator</TableHead>
                <TableHead className="font-bold">SIM Type</TableHead>
                <TableHead className="font-bold">Amount</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Requested At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500">
                    No recharge requests found.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req, index) => (
                  <TableRow
                    key={req.id}
                    className={`${getRowColor(
                      index
                    )} hover:bg-[#E0F7FA] transition-colors`}
                  >
                    <TableCell>{req.user?.fullName ?? "N/A"}</TableCell>
                    <TableCell>{req.user?.email ?? "N/A"}</TableCell>
                    <TableCell>{req.mobileNumber}</TableCell>
                    <TableCell>{req.operator}</TableCell>
                    <TableCell>{req.simType}</TableCell>
                    <TableCell>৳{parseFloat(req.amount).toFixed(2)}</TableCell>
                    <TableCell>
                      <Select
                        value={req.status || "Pending"}
                        onValueChange={(val) => handleStatusChange(req.id, val)}
                        disabled={req.status === "Completed"}
                      >
                        <SelectTrigger className="min-w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {new Date(req.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Toast Message */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={toast.type}
          onClose={() => setToast({ ...toast, open: false })}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
