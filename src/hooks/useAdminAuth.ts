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

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function useAdminAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(
          "https://taskora-admin-backend.onrender.com/admin/protected-data",
          {
            withCredentials: true,
          }
        );

        setIsAuthenticated(true);
      } catch (error) {
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { isAuthenticated, loading };
}
