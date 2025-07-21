"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Typography } from "@mui/material";

export default function QuizSubmissionsAdmin() {
  const [submissions, setSubmissions] = useState<any[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionMap, setActionMap] = useState<
    Record<string, { status: string; bonus: string }>
  >({});

  const fetchSubmissions = async (currentPage = 1) => {
    try {
      const res = await axios.get(
        `https://taskora-admin-backend.onrender.com/admin/quiz-submissions?page=${currentPage}&limit=50`
      );
      setSubmissions(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
      setPage(currentPage);
    } catch {
      toast.error("Failed to fetch submissions");
      setSubmissions([]);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleChange = (id: string, key: "status" | "bonus", value: string) => {
    setActionMap((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value,
      },
    }));
  };

  const handleUpdate = async (id: string) => {
    const { status, bonus } = actionMap[id] || {};
    if (!status || (status === "accepted" && !bonus)) {
      toast.error("Provide valid status and bonus");
      return;
    }

    try {
      await axios.post(
        `https://taskora-admin-backend.onrender.com/admin/quiz-submissions/${id}/action`,
        {
          status,
          bonusAmount: bonus,
        }
      );
      toast.success("Updated!");
      fetchSubmissions(page);
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 mt-0 px-4 pb-20">
      <Typography variant="h4" fontWeight="bold" color="#09203F">
        Clients Submitted Quiz Answers
      </Typography>

      {!submissions ? (
        <p className="text-center text-white">Loading submissions...</p>
      ) : submissions.length === 0 ? (
        <p className="text-center text-white">No submissions found</p>
      ) : (
        <div className="overflow-auto rounded border border-gray-300">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-muted text-gray-700 font-semibold">
              <tr className="">
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">Quiz</th>
                <th className="p-3">Submitted</th>
                <th className="p-3">Correct</th>
                <th className="p-3">Status</th>
                <th className="p-3">Bonus</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((item) => (
                <tr key={item.id} className="border-t text-center">
                  <td className="p-2">{item.userName}</td>
                  <td className="p-2">{item.userEmail}</td>
                  <td className="p-2">{item.userMobileNo}</td>
                  <td className="p-2 max-w-xs truncate">{item.quizQuestion}</td>
                  <td className="p-2 text-blue-500 font-medium">
                    {item.selectedAnswer}
                  </td>
                  <td className="p-2 text-green-600 font-medium">
                    {item.correctAnswer}
                  </td>
                  <td className="p-2">
                    <Select
                      onValueChange={(val) =>
                        handleChange(item.id, "status", val)
                      }
                      defaultValue={item.status}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accepted">Accept</SelectItem>
                        <SelectItem value="rejected">Reject</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      placeholder="Bonus"
                      className="w-24"
                      value={actionMap[item.id]?.bonus || ""}
                      onChange={(e) =>
                        handleChange(item.id, "bonus", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2">
                    <Button onClick={() => handleUpdate(item.id)} size="sm">
                      Save
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => fetchSubmissions(page - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-white">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => fetchSubmissions(page + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
