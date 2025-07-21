"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Button, Snackbar } from "@mui/material";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminAddMoneyRequests() {
  const [requests, setRequests] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "https://taskora-admin-backend.onrender.com/admin/add-money-requests",
        { withCredentials: true }
      );
      setRequests(res.data.requests);
    } catch (err) {
      setToastMessage("Failed to fetch requests.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      await axios.post(
        `https://taskora-admin-backend.onrender.com/admin/add-money-requests/${id}/${action}`,
        {},
        { withCredentials: true }
      );
      setToastMessage(`Request ${action}d successfully.`);
      fetchRequests();
    } catch {
      setToastMessage(`Failed to ${action} request.`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "approved":
      case "accepted":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 pb-20 space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <h2 className="text-2xl font-bold text-[#09203F]">
          Add Money Requests
        </h2>
      </div>

      <Card className="rounded-3xl shadow-md border border-gray-200">
        <CardContent className="overflow-auto p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E3F2FD]">
                <TableHead className="min-w-[150px] font-bold">
                  User Name
                </TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold">Mobile</TableHead>
                <TableHead className="font-bold">Payment Method</TableHead>
                <TableHead className="font-bold">Merchant Number</TableHead>
                <TableHead className="font-bold">Sender Number</TableHead>
                <TableHead className="font-bold">Amount</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-500">
                    No requests found.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req: any, index: number) => (
                  <TableRow
                    key={req.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-[#F6FAFD]"
                    } hover:bg-[#E0F7FA] transition-colors`}
                  >
                    <TableCell>{req.user?.fullName || "N/A"}</TableCell>
                    <TableCell>{req.user?.email || "N/A"}</TableCell>
                    <TableCell>{req.user?.mobileNumber || "N/A"}</TableCell>
                    <TableCell>{req.paymentMethod}</TableCell>
                    <TableCell>{req.merchantNumber}</TableCell>
                    <TableCell>{req.senderNumber}</TableCell>
                    <TableCell>৳ {req.amount}</TableCell>
                    <TableCell>
                      <span
                        className={`font-bold ${getStatusColor(req.status)}`}
                      >
                        {req.status.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      {req.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() => handleAction(req.id, "approve")}
                            sx={{ minWidth: 90 }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() => handleAction(req.id, "reject")}
                            sx={{ minWidth: 90 }}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">No Action</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={!!toastMessage}
        autoHideDuration={3000}
        onClose={() => setToastMessage("")}
        message={toastMessage}
      />
    </div>
  );
}
