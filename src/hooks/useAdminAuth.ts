// // /hooks/useAdminAuth.ts
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// export default function useAdminAuth() {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios
//       .get("https://taskora-admin-backend.onrender.com/admin/me", {
//         withCredentials: true, // ✅ ensure cookies go with the request
//       })
//       .then((res) => {
//         if (res.data?.admin) {
//           setIsAuthenticated(true);
//         } else {
//           router.push("/admin-login");
//         }
//       })
//       .catch(() => {
//         router.push("/admin-login"); // ⛔️ cookie not present = redirect
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [router]);

//   return { isAuthenticated, loading };
// }

// /hooks/useAdminAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError, CancelTokenSource } from "axios";

export default function useAdminAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const source: CancelTokenSource = axios.CancelToken.source();

    const checkAuth = async () => {
      try {
        const res = await axios.get(
          "https://taskora-admin-backend.onrender.com/admin/me",
          {
            withCredentials: true,
            cancelToken: source.token,
          }
        );

        if (res.status === 200 && res.data?.admin) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.replace("/admin-login");
        }
      } catch (err) {
        if (axios.isCancel(err)) return;
        const axiosErr = err as AxiosError<any>;
        // Optional: log axiosErr.response?.data for debugging
        setIsAuthenticated(false);
        router.replace("/admin-login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    return () => source.cancel("Admin auth check canceled on unmount.");
  }, [router]);

  return { isAuthenticated, loading };
}
