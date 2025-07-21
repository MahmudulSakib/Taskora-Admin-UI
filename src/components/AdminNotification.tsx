"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

interface Notification {
  id: string;
  description: string;
  createdAt: string;
}

export default function AdminNotifications() {
  const [desc, setDesc] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:8080/admin/notifications", {
        withCredentials: true,
      });
      setNotifications(res.data);
    } catch {
      toast.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handlePost = async () => {
    if (!desc.trim()) return toast.error("Description required");
    try {
      await axios.post(
        "http://localhost:8080/admin/notifications",
        { description: desc },
        { withCredentials: true }
      );
      toast.success("Posted!");
      setDesc("");
      fetchNotifications();
    } catch {
      toast.error("Failed to post");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/admin/notifications/${id}`, {
        withCredentials: true,
      });
      toast.success("Deleted");
      fetchNotifications();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Post Notification</h2>
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Write a message to notify users..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <Button onClick={handlePost}>Post</Button>
      </div>

      <div className="space-y-4">
        {notifications.map((note) => (
          <div
            key={note.id}
            className="border rounded-lg p-4 flex justify-between items-center hover:bg-muted/30 transition"
          >
            <div>
              <p>{note.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(note.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
