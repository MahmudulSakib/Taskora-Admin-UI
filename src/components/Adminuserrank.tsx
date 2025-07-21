"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Button } from "./ui/button";

export default function AdminUserRanks() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedRanks, setSelectedRanks] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(
      "https://taskora-admin-backend.onrender.com/admin/user-ranks",
      {
        withCredentials: true,
      }
    );
    setUsers(res.data);

    const initialRanks: { [key: string]: string } = {};
    res.data.forEach((user: any) => {
      initialRanks[user.id] = user.rank?.toString() || "";
    });
    setSelectedRanks(initialRanks);
  };

  const handleRankChange = (userId: string, rank: string) => {
    setSelectedRanks((prev) => ({ ...prev, [userId]: rank }));
  };

  const handleRankSubmit = async (userId: string) => {
    const rank = parseInt(selectedRanks[userId] || "1");
    await axios.post(
      "https://taskora-admin-backend.onrender.com/admin/user-ranks",
      { userId, rank },
      { withCredentials: true }
    );
    fetchUsers();
  };

  return (
    <Card className="bg-white/5 backdrop-blur-md  max-w-6xl mx-auto mt-10 shadow-lg">
      <CardHeader className="text-xl font-bold px-6 pt-6 pb-2">
        🏅 User Rankings
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Rank</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobileNumber}</TableCell>
                <TableCell>
                  <Select
                    value={selectedRanks[user.id] || ""}
                    onValueChange={(val) => handleRankChange(user.id, val)}
                  >
                    <SelectTrigger className="w-[100px] bg-white/10  border-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/10  max-h-60 overflow-y-auto backdrop-blur-md">
                      {[...Array(50)].map((_, i) => (
                        <SelectItem
                          key={i + 1}
                          value={(i + 1).toString()}
                          className="hover:bg-white/10"
                        >
                          Rank {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleRankSubmit(user.id)}
                    className="bg-green-600 hover:bg-green-700 "
                  >
                    Save
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
