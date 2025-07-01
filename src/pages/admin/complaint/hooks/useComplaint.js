// pages/admin/complaint/hooks/useComplaints.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import secureAxios from "../../../../utils/secureAxios";

// get complaints from server, with optional filters
export function useComplaints(filters = {}) {
  return useQuery({
    queryKey: ["complaints", filters],
    queryFn: async () => {
      // Send filters as query params (e.g., { assignedTo: userId })
      const { data } = await secureAxios.get("/admin/complaints", {
        params: filters,
      });
      return data;
    },
    // Poll every 60 seconds (or adjust as needed)
    refetchInterval: 60000,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

// mutation to assign a complaint
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

// mutation to create a new complaint (NEW)
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
      queryClient.invalidateQueries(["complaints"]); // Refetch the list
    },
  });
}
