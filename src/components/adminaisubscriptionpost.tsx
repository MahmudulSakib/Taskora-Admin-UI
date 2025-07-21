"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";

export default function SubscriptionAdminPanel() {
  const [plans, setPlans] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
  });

  const fetchPlans = async () => {
    try {
      const res = await axios.get(
        "https://taskora-admin-backend.onrender.com/admin/ai-subscriptions",
        {
          withCredentials: true,
        }
      );
      setPlans(res.data || []);
    } catch {
      toast.error("Failed to fetch plans");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post(
        "https://taskora-admin-backend.onrender.com/admin/ai-subscriptions",
        form
      );
      toast.success("Plan created!");
      setForm({ title: "", description: "", duration: "", price: "" });
      fetchPlans();
    } catch {
      toast.error("Failed to create plan");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `https://taskora-admin-backend.onrender.com/admin/ai-subscriptions/${id}`
      );
      toast.success("Deleted!");
      fetchPlans();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create AI Subscription Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            placeholder="Duration (in days)"
            value={form.duration}
            type="number"
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          />
          <Input
            placeholder="Price (TK)"
            value={form.price}
            type="number"
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <Button className="w-full" onClick={handleSubmit}>
            Create Plan
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">All Plans</h2>
        {plans.length === 0 ? (
          <p className="text-gray-300">No plans found</p>
        ) : (
          plans.map((plan) => (
            <Card key={plan.id}>
              <CardContent className="space-y-1 p-4">
                <h3 className="text-md font-semibold">{plan.title}</h3>
                <p className="text-sm text-gray-400">{plan.description}</p>
                <p>Duration: {plan.duration} days</p>
                <p>Price: ৳{plan.price}</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(plan.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
