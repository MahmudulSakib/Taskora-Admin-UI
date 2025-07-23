"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";

type CarouselImage = {
  id: string;
  url: string;
};

export default function CarouselAdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<CarouselImage[]>([]);

  const fetchImages = async () => {
    const res = await axios.get(
      "https://taskora-admin-backend.onrender.com/admin/carousel-images",
      {
        withCredentials: true,
      }
    );
    setImages(res.data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async () => {
    if (!file) return toast.error("No image selected");

    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post(
        "https://taskora-admin-backend.onrender.com/admin/carousel-upload",
        formData,
        {
          withCredentials: true,
        }
      );
      toast.success("Image uploaded!");
      setFile(null);
      fetchImages();
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `https://taskora-admin-backend.onrender.com/admin/carousel-images/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Image deleted");
      fetchImages();
    } catch {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-xl mx-auto">
      <Input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <Button onClick={handleUpload}>Upload</Button>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {images.map((img) => (
          <div key={img.id} className="relative group">
            <img
              src={img.url}
              alt="carousel"
              className="rounded shadow w-full"
            />
            <Button
              variant="destructive"
              className="absolute top-1 right-1 text-xs opacity-80 group-hover:opacity-100"
              onClick={() => handleDelete(img.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
