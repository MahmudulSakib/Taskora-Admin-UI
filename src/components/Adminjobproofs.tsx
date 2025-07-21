"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Proof {
  id: string;
  jobId: string;
  userId: string;
  status: string;
  imageUrls: string[];
  user: {
    fullName: string;
    email: string;
    mobileNumber: string;
  };
  job: {
    title: string;
    link: string;
    limit: number;
    leftLimit: number;
    costPerLimit: number;
  };
}

export default function AdminJobProofs() {
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [bonusAmount, setBonusAmount] = useState<{ [key: string]: string }>({});
  const [actionStatus, setActionStatus] = useState<{ [key: string]: string }>(
    {}
  );
  const [completedProofs, setCompletedProofs] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const proofsPerPage = 50;
  const totalPages = Math.ceil(proofs.length / proofsPerPage);
  const paginatedProofs = proofs.slice(
    (currentPage - 1) * proofsPerPage,
    currentPage * proofsPerPage
  );

  const fetchProofs = async () => {
    try {
      const res = await axios.get(
        "https://taskora-admin-backend.onrender.com/admin/job-proofs"
      );
      setProofs(res.data);
      const completed: { [key: string]: boolean } = {};
      res.data.forEach((proof: Proof) => {
        if (proof.status === "accepted" || proof.status === "rejected") {
          completed[proof.id] = true;
        }
      });
      setCompletedProofs(completed);
    } catch (err) {
      console.error("Failed to fetch proofs", err);
    }
  };

  const handleAction = async (proofId: string) => {
    const status = actionStatus[proofId];
    const amount = bonusAmount[proofId];

    if (!status) return toast.warning("Please select a status.");
    try {
      await axios.post(
        `https://taskora-admin-backend.onrender.com/admin/job-proofs/${proofId}/action`,
        {
          status,
          bonusAmount: amount || "0",
        }
      );
      toast.success("Proof updated successfully.");
      setCompletedProofs((prev) => ({ ...prev, [proofId]: true }));
      fetchProofs();
    } catch (err) {
      console.error("Failed to update proof", err);
      toast.error("Failed to update proof.");
    }
  };

  useEffect(() => {
    fetchProofs();
  }, []);

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto space-y-10">
      <h1 className="text-3xl font-semibold text-[#09203F]">
        Submitted Job Proofs
      </h1>

      <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
        <table className="min-w-full border-collapse text-sm text-gray-700">
          <thead className="bg-gray-100 text-left">
            <tr className="border-b">
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Job</th>
              <th className="p-3">Limit / Left</th>
              <th className="p-3">Cost</th>
              <th className="p-3">Proof Images</th>
              <th className="p-3">Status</th>
              <th className="p-3">Bonus</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProofs.map((proof) => {
              const isCompleted = completedProofs[proof.id];
              const isLimitOver = proof.job.leftLimit <= 0;

              return (
                <tr key={proof.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{proof.user.fullName}</td>
                  <td className="p-3">{proof.user.email}</td>
                  <td className="p-3">{proof.user.mobileNumber}</td>
                  <td className="p-3">
                    <a
                      href={proof.job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {proof.job.title}
                    </a>
                  </td>
                  <td className="p-3">
                    {proof.job.limit} / {proof.job.leftLimit}
                  </td>
                  <td className="p-3">{proof.job.costPerLimit}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 justify-start">
                      {proof.imageUrls.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt="proof"
                          onClick={() => setSelectedImage(url)}
                          className="h-14 w-14 object-cover rounded cursor-pointer hover:scale-105 transition duration-150"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <Select
                      disabled={isCompleted || isLimitOver}
                      value={actionStatus[proof.id] || ""}
                      onValueChange={(val) =>
                        setActionStatus((prev) => ({
                          ...prev,
                          [proof.id]: val,
                        }))
                      }
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accepted">Accept</SelectItem>
                        <SelectItem value="rejected">Reject</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.5"
                      className="w-24"
                      disabled={isCompleted || isLimitOver}
                      value={bonusAmount[proof.id] || ""}
                      onChange={(e) =>
                        setBonusAmount((prev) => ({
                          ...prev,
                          [proof.id]: e.target.value,
                        }))
                      }
                    />
                  </td>
                  <td className="p-3 text-center">
                    {isLimitOver ? (
                      <Button variant="outline" size="sm" disabled>
                        Limit Over
                      </Button>
                    ) : isCompleted ? (
                      <Button variant="secondary" size="sm" disabled>
                        Completed
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => handleAction(proof.id)}>
                        Confirm
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="bg-black p-0 border-0 max-w-5xl">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="preview"
              className="w-full max-h-[90vh] object-contain rounded"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
