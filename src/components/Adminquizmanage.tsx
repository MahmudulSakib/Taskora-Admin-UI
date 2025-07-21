"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { toast } from "sonner";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export default function QuizAdminPanel() {
  const [form, setForm] = useState({
    question: "",
    A: "",
    B: "",
    C: "",
    D: "",
    correct: "",
  });

  const [quizzes, setQuizzes] = useState<any[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchQuizzes = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/admin/all-quizzes?page=${currentPage}&limit=50`
      );
      setQuizzes(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
      setPage(currentPage);
    } catch {
      toast.error("Failed to fetch quizzes");
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handlePost = async () => {
    try {
      await axios.post("http://localhost:8080/admin/post-quiz", {
        question: form.question,
        optionA: form.A,
        optionB: form.B,
        optionC: form.C,
        optionD: form.D,
        correctAnswer: form.correct,
      });
      toast.success("Quiz posted");
      setForm({ question: "", A: "", B: "", C: "", D: "", correct: "" });
      fetchQuizzes(page);
    } catch {
      toast.error("Failed to post quiz");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/admin/delete-quiz/${id}`);
      toast.success("Quiz deleted");
      fetchQuizzes(page);
    } catch {
      toast.error("Failed to delete quiz");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-0 space-y-10">
      <h1 className="text-3xl font-bold text-[#09203F]">Post New Quiz</h1>

      <Card className="p-6 border border-gray-300 shadow-md space-y-2">
        <Textarea
          placeholder="Quiz question"
          value={form.question}
          onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
        />
        {["A", "B", "C", "D"].map((opt) => (
          <Input
            key={opt}
            placeholder={`Option ${opt}`}
            className="mt-2"
            value={(form as any)[opt]}
            onChange={(e) => setForm((f) => ({ ...f, [opt]: e.target.value }))}
          />
        ))}
        <Input
          placeholder="Correct Answer (A/B/C/D)"
          className="mt-2"
          value={form.correct}
          onChange={(e) => setForm((f) => ({ ...f, correct: e.target.value }))}
        />
        <Button className="mt-4 w-full" onClick={handlePost}>
          Submit Quiz
        </Button>
      </Card>

      <div>
        <h2 className="text-xl font-semibold text-[#09203F] mb-4">
          All Quizzes
        </h2>

        {loading ? (
          <Skeleton className="h-40 w-full bg-gray-200 rounded-md" />
        ) : !quizzes || quizzes.length === 0 ? (
          <p className="text-gray-500">No quizzes found</p>
        ) : (
          <div className="overflow-x-auto border rounded shadow-sm">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100 text-[#09203F]">
                <tr>
                  <th className="px-4 py-2 text-left">Question</th>
                  <th className="px-4 py-2">A</th>
                  <th className="px-4 py-2">B</th>
                  <th className="px-4 py-2">C</th>
                  <th className="px-4 py-2">D</th>
                  <th className="px-4 py-2">Correct</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {quizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 max-w-xs break-words">
                      {quiz.question}
                    </td>
                    <td className="px-4 py-2">{quiz.optionA}</td>
                    <td className="px-4 py-2">{quiz.optionB}</td>
                    <td className="px-4 py-2">{quiz.optionC}</td>
                    <td className="px-4 py-2">{quiz.optionD}</td>
                    <td className="px-4 py-2 font-bold text-green-600">
                      {quiz.correctAnswer}
                    </td>
                    <td className="px-4 py-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(quiz.id)}
                      >
                        Delete
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
              onClick={() => fetchQuizzes(page - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => fetchQuizzes(page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
