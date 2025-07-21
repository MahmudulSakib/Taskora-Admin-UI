"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import AdminAddMoneyRequests from "@/components/AdminaddMoney";
import axios from "axios";
import useAdminAuth from "@/hooks/useAdminAuth";
import AdminRechargeRequests from "@/components/AdminMobileRechrage";
import AdminDriveOfferForm from "@/components/AdminDriveOfferForm";
import AdminJobPostPanel from "@/components/AdminJobPanel";
import AdminJobProofs from "@/components/Adminjobproofs";
import QuizAdminPanel from "@/components/Adminquizmanage";
import QuizSubmissionsAdmin from "@/components/Adminquizsubmissioncheck";
import AdminUserWalletTable from "@/components/Clientsdetails";
import SubscriptionAdminPanel from "@/components/adminaisubscriptionpost";
import AdminAiSubscriptionRequests from "@/components/AdminAirequest";
import AdminBonusWithdrawRequests from "@/components/Adminrequestwithdraw";
import AdminNotifications from "@/components/AdminNotification";
import AdminUserRanks from "@/components/Adminuserrank";
import AdminVendorShipPanel from "@/components/AdminVendor";
import CarouselAdminPage from "@/components/AdminCarousel";

const menuItems = [
  { label: "Dashboard", key: "dashboard" },
  { label: "Carousel", key: "carousel" },
  { label: "Clients Fund Approval", key: "clientsfund" },
  { label: "Clients Mobile Reacharge", key: "clientsmobilerecharge" },
  { label: "Drive Offer", key: "driveoffer" },
  { label: "Job Post Panel", key: "jobpostpanel" },
  { label: "Clients Job Proof", key: "jobsproof" },
  { label: "Quiz Post", key: "quizpost" },
  { label: "Quiz Check", key: "quizcheck" },
  { label: "Clients Details", key: "clientsdetails" },
  { label: "Post AI Subscription", key: "postaisubs" },
  { label: "Request for AI Subscription", key: "reqaisubs" },
  { label: "Money Withdraw Request", key: "reqclwithdraw" },
  { label: "Post Notification", key: "postnotification" },
  { label: "User Ranks", key: "userrank" },
  { label: "Request for Vendorship", key: "vendorship" },
  { label: "Logout", key: "logout" },
];

export default function AdminPanel() {
  const { isAuthenticated, loading } = useAdminAuth();
  const [activeKey, setActiveKey] = useState<string>("dashboard");
  const router = useRouter();

  if (loading)
    return <p className="text-center mt-20">Checking authentication...</p>;
  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/admin/log-out",
        {},
        { withCredentials: true }
      );

      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const contentMap: Record<string, ReactNode> = {
    dashboard: <p>Welcome to Admin Dashboard</p>,
    carousel: <CarouselAdminPage />,
    clientsfund: <AdminAddMoneyRequests />,
    clientsmobilerecharge: <AdminRechargeRequests />,
    driveoffer: <AdminDriveOfferForm />,
    jobpostpanel: <AdminJobPostPanel />,
    jobsproof: <AdminJobProofs />,
    quizpost: <QuizAdminPanel />,
    quizcheck: <QuizSubmissionsAdmin />,
    clientsdetails: <AdminUserWalletTable />,
    postaisubs: <SubscriptionAdminPanel />,
    reqaisubs: <AdminAiSubscriptionRequests />,
    reqclwithdraw: <AdminBonusWithdrawRequests />,
    postnotification: <AdminNotifications />,
    userrank: <AdminUserRanks />,
    vendorship: <AdminVendorShipPanel />,
    logout: (
      <div className="flex flex-col items-center justify-center h-48">
        <p className="mb-4 text-lg font-semibold">
          Are you sure you want to log out?
        </p>
        <Button onClick={handleLogout}>Log Out</Button>
      </div>
    ),
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-100 border-r p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.key}>
              <Button
                variant={activeKey === item.key ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveKey(item.key)}
              >
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-6">
        <Card>
          <CardContent className="p-6">{contentMap[activeKey]}</CardContent>
        </Card>
      </div>
    </div>
  );
}
