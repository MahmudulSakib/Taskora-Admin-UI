"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminUserWalletTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (currentPage = 1, query = "") => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://taskora-admin-backend.onrender.com/admin/user/details?page=${currentPage}&limit=50&search=${query}`,
        { withCredentials: true }
      );
      setUsers(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
      setPage(currentPage);
    } catch (err) {
      toast.error("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = () => {
    fetchUsers(1, search);
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 pb-20 space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <h2 className="text-2xl font-bold text-[#09203F]">
          All Users Wallet Overview
        </h2>
        <div className="flex gap-2 w-full sm:max-w-sm ml-auto">
          <Input
            placeholder="Search by mobile or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      <Card className="rounded-3xl shadow-md border border-gray-200">
        <CardContent className="overflow-auto p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E3F2FD]">
                <TableHead className="min-w-[150px] font-bold">Name</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold">Mobile</TableHead>
                <TableHead className="font-bold">Address</TableHead>
                <TableHead className="font-bold">Referral Code</TableHead>
                <TableHead className="font-bold">Fund (৳)</TableHead>
                <TableHead className="font-bold">Bonus (৳)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-[#F6FAFD]"
                    } hover:bg-[#E0F7FA] transition-colors`}
                  >
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.mobileNumber}</TableCell>
                    <TableCell>{user.address || "-"}</TableCell>
                    <TableCell>{user.referCode || "-"}</TableCell>
                    <TableCell className="text-blue-700 font-semibold">
                      ৳ {user.fund || "0.00"}
                    </TableCell>
                    <TableCell className="text-green-700 font-semibold">
                      ৳ {user.bonus || "0.00"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => fetchUsers(page - 1, search)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-white bg-[#09203F] px-3 py-1 rounded">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => fetchUsers(page + 1, search)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
