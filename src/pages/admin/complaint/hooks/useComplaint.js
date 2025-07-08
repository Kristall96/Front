// pages/admin/complaint/hooks/useComplaint.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import secureAxios from "../../../../utils/secureAxios";

// -------------------- ADMIN/MODERATOR HOOKS -------------------- //

// Get list of complaints (with filters and polling)
export function useComplaints(filters = {}, interval = 30000) {
  return useQuery({
    queryKey: ["complaints", filters],
    queryFn: async () => {
      const { data } = await secureAxios.get("/admin/complaints", {
        params: filters,
      });
      return data;
    },
    refetchInterval: interval,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

// Get a single complaint by ID (admin/mod view) — with polling!
export function useComplaintWithPolling(id, interval = 5000) {
  return useQuery({
    queryKey: ["complaint", id],
    queryFn: async () => {
      const { data } = await secureAxios.get(`/admin/complaints/${id}`);
      return data;
    },
    enabled: !!id,
    refetchInterval: interval, // default: 5 seconds for live chat feel
    refetchOnWindowFocus: true,
  });
}

// Assign a complaint to yourself (admin/mod)
export function useAssignComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await secureAxios.patch(
        `/admin/complaints/${id}/assign`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["complaints"]);
    },
  });
}

// Create new complaint (admin only)
export function useCreateComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (complaintData) => {
      const { data } = await secureAxios.post(
        "/admin/complaints",
        complaintData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["complaints"]);
    },
  });
}

// Add a message to a complaint (admin/mod)
// Use this for sending messages, not fetching!
export function useAdminComplaintMessage(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (msg) => {
      await secureAxios.post(`/admin/complaints/${id}/message`, {
        message: msg,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["complaint", id]);
    },
  });
}

// -------------------- USER HOOKS -------------------- //

// Get all complaints for current user (with polling)
export function useUserComplaints(interval = 60000) {
  return useQuery({
    queryKey: ["userComplaints"],
    queryFn: async () => {
      const { data } = await secureAxios.get("/complaints");
      return data;
    },
    refetchInterval: interval,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

// Get a single user complaint (for chat, with polling)
export function useUserComplaintWithPolling(id, interval = 5000) {
  return useQuery({
    queryKey: ["userComplaint", id],
    queryFn: async () => {
      const { data } = await secureAxios.get(`/complaints/${id}`);
      return data;
    },
    enabled: !!id,
    refetchInterval: interval,
    refetchOnWindowFocus: true,
  });
}

// Create a new complaint (user)
export function useCreateUserComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (complaintData) => {
      const { data } = await secureAxios.post("/complaints", complaintData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userComplaints"]);
    },
  });
}

// Add a message to user's complaint (user side)
export function useUserComplaintMessage(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (msg) => {
      await secureAxios.post(`/complaints/${id}/message`, { message: msg });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userComplaint", id]);
    },
  });
}

export function useUpdateComplaintStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await secureAxios.patch(
        `/admin/complaints/${id}/status`,
        { status }
      );
      return data;
    },
    onSuccess: (data, variables) => {
      // Instantly refetch the complaints list and the specific complaint
      queryClient.invalidateQueries(["complaints"]);
      queryClient.invalidateQueries(["complaint", variables.id]);
    },
  });
}
