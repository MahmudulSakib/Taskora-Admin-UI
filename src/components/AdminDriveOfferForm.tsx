"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Offer = {
  id: string;
  title: string;
  isSimType: boolean;
  simType: string | null;
  duration: string;
  validation: string;
  purchaseAmount: string;
  createdAt: string;
};

const PAGE_LIMIT = 50;

export default function AdminDriveOfferPage() {
  const [form, setForm] = useState({
    title: "",
    isSimType: false,
    simType: "",
    duration: "",
    validation: "",
    purchaseAmount: "",
  });

  const [offers, setOffers] = useState<Offer[]>([]);
  const [page, setPage] = useState(1);
  const [totalOffers, setTotalOffers] = useState(0);

  const fetchOffers = async (pg: number) => {
    try {
      const res = await axios.get("http://localhost:8080/admin/drive-offers", {
        params: { limit: PAGE_LIMIT, offset: (pg - 1) * PAGE_LIMIT },
        withCredentials: true,
      });
      setOffers(res.data.offers || []);
      setTotalOffers(res.data.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch offers");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/admin/create-drive-offer", form, {
        withCredentials: true,
      });
      toast.success("Offer created");
      setForm({
        title: "",
        isSimType: false,
        simType: "",
        duration: "",
        validation: "",
        purchaseAmount: "",
      });
      fetchOffers(page);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create offer");
    }
  };

  const deleteOffer = async (id: string) => {
    try {
      await axios.delete(
        `http://localhost:8080/admin/delete-drive-offer/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Offer deleted");
      fetchOffers(page);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete offer");
    }
  };

  useEffect(() => {
    fetchOffers(page);
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 pb-20 space-y-10">
      {/* FORM */}
      <Card className="shadow-md border border-gray-200">
        <CardContent className="space-y-6 pt-6">
          <h1 className="text-2xl font-bold text-[#09203F]">
            Create Drive Offer
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Offer Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="flex flex-col">
                <Label className="mb-1">Is SIM Type?</Label>
                <Switch
                  checked={form.isSimType}
                  onCheckedChange={(val) =>
                    setForm({ ...form, isSimType: val })
                  }
                />
              </div>

              {form.isSimType && (
                <div>
                  <Label>SIM Type</Label>
                  <Input
                    value={form.simType}
                    onChange={(e) =>
                      setForm({ ...form, simType: e.target.value })
                    }
                  />
                </div>
              )}

              <div>
                <Label>Duration</Label>
                <Input
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Validation</Label>
                <Input
                  value={form.validation}
                  onChange={(e) =>
                    setForm({ ...form, validation: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Purchase Amount</Label>
                <Input
                  type="number"
                  value={form.purchaseAmount}
                  onChange={(e) =>
                    setForm({ ...form, purchaseAmount: e.target.value })
                  }
                />
              </div>
            </div>
            <Button type="submit">Create Offer</Button>
          </form>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="shadow-md border border-gray-200">
        <CardContent className="pt-6 overflow-auto">
          <h2 className="text-xl font-semibold text-[#09203F] mb-4">
            All Drive Offers
          </h2>
          {offers.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No offer to show</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E3F2FD]">
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>SIM Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Validation</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer, index) => (
                  <TableRow
                    key={offer.id}
                    className={index % 2 ? "bg-[#F6FAFD]" : ""}
                  >
                    <TableCell>{offer.title}</TableCell>
                    <TableCell>{offer.isSimType ? "SIM" : "General"}</TableCell>
                    <TableCell>{offer.simType || "-"}</TableCell>
                    <TableCell>{offer.duration}</TableCell>
                    <TableCell>{offer.validation}</TableCell>
                    <TableCell>৳ {offer.purchaseAmount}</TableCell>
                    <TableCell>
                      {format(
                        new Date(offer.createdAt),
                        "dd MMM yyyy, hh:mm a"
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteOffer(offer.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
