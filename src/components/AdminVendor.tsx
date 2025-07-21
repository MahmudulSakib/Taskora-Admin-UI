"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export default function AdminVendorShipPanel() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await axios.get("http://localhost:8080/admin/vendor-requests", {
      withCredentials: true,
    });
    setRequests(res.data);
  };

  //   const handleStatusChange = async (id: string, status: string) => {
  //     await axios.patch(
  //       "http://localhost:8080/admin/vendor-requests/status",
  //       { id, status },
  //       { withCredentials: true }
  //     );

  //     fetchRequests();
  //   };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await axios.patch(
        "http://localhost:8080/admin/vendor-requests/status",
        { id, status },
        { withCredentials: true }
      );
      fetchRequests();

      toast.success("Status updated", {
        description: `Marked as '${status}'`,
        duration: 3000,
      });
    } catch (err) {
      toast.error("Update failed", {
        description: "Something went wrong while updating.",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <Card className="bg-white/5  backdrop-blur-md border border-white/10">
        <CardHeader className="text-xl font-bold">
          Vendor Ship Requests
        </CardHeader>
        <CardContent>
          <ScrollArea className="space-y-6 max-h-[70vh] pr-2">
            {requests.map((req, index) => (
              <Card
                key={req.id}
                className="bg-white/10 border border-white/10 p-4 rounded-xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-semibold">
                      #{index + 1} - {req.user.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {req.user.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Contact: {req.contactNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">{req.email}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Shop: {req.shopName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {req.shopAddress}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Select
                      defaultValue={req.status}
                      onValueChange={(val) => handleStatusChange(req.id, val)}
                    >
                      <SelectTrigger className="w-[150px] bg-white/10 border-white/20 ">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="  border-white/10">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      className="border-white/20 hover:bg-green-500"
                      onClick={() => handleStatusChange(req.id, req.status)}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
