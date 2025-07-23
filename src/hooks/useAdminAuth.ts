"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  // Add other fields if needed
}

export default function useAdminAuth() {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          "https://taskora-admin-backend.onrender.com/admin/profile",
          {
            withCredentials: true,
          }
        );

        if (res.status === 200 && res.data?.admin) {
          setAdmin(res.data.admin);
        } else {
          setAdmin(null);
          router.replace("/admin-login");
        }
      } catch (err) {
        setAdmin(null);
        router.replace("/admin-login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { admin, loading };
}
