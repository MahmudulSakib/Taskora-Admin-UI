"use client";

import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

interface AiSubscription {
  id: string;
  email: string;
  mobileNumber: string;
  status: string;
  subscribedAt: string;
  user: {
    fullName: string;
  };
  plan: {
    title: string;
    price: number;
    duration: number;
  };
}

export default function AdminAiSubscriptionRequests() {
  const [requests, setRequests] = useState<AiSubscription[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        "https://taskora-admin-backend.onrender.com/admin/ai-subscription-requests"
      );
      setRequests(res.data);
    };
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await axios.patch(
        `https://taskora-admin-backend.onrender.com/admin/ai-subscription-status/${id}`,
        { status: newStatus }
      );
      setRequests((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "#C8E6C9";
      case "rejected":
        return "#FFCDD2";
      case "pending":
        return "#FFF9C4";
      default:
        return "#E0E0E0";
    }
  };

  return (
    <Box sx={{ py: 6, backgroundColor: "#f4f7fb", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom fontWeight="bold">
          AI Subscription Requests
        </Typography>
        <Paper
          elevation={3}
          sx={{
            overflowX: "auto",
            borderRadius: 4,
            backgroundColor: "#ffffff",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                <TableCell>
                  <strong>User</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Mobile</strong>
                </TableCell>
                <TableCell>
                  <strong>Plan</strong>
                </TableCell>
                <TableCell>
                  <strong>Price</strong>
                </TableCell>
                <TableCell>
                  <strong>Duration</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Subscribed At</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((item, index) => (
                <TableRow
                  key={item.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#fdfdfd" : "#f6fafd",
                    transition: "background 0.2s",
                    "&:hover": { backgroundColor: "#e0f7fa" },
                  }}
                >
                  <TableCell>{item.user?.fullName}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.mobileNumber}</TableCell>
                  <TableCell>{item.plan.title}</TableCell>
                  <TableCell>{item.plan.price} TK</TableCell>
                  <TableCell>{item.plan.duration} days</TableCell>
                  <TableCell>
                    <Select
                      value={item.status}
                      size="small"
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value)
                      }
                      sx={{
                        backgroundColor: getStatusColor(item.status),
                        fontWeight: "bold",
                        borderRadius: 1,
                      }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="accepted">Accepted</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {new Date(item.subscribedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </Box>
  );
}
