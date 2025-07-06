// pages / admin / todo / hooks / useToDo.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import secureAxios from "../../../../utils/secureAxios";

// Fetch all todos (active, not deleted)
// Add param for showing trashed
export function useToDos({
  refetchInterval = 5000,
  showTrashed = false,
  showAll = false,
} = {}) {
  return useQuery({
    queryKey: ["todos", { showTrashed, showAll }],
    queryFn: async () => {
      let url = "/admin/todos";
      if (showTrashed) url += "?trash=1";
      else if (showAll) url += "?all=1";
      // else just /admin/todos

      const res = await secureAxios.get(url);
      return res.data;
    },
    refetchInterval,
    staleTime: 2000,
  });
}

// Create new todo
export function useCreateToDo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await secureAxios.post("/admin/todos", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

// Update todo
export function useUpdateToDo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await secureAxios.put(`/admin/todos/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

// Soft delete todo
export function useSoftDeleteToDo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await secureAxios.delete(`/admin/todos/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useToDoStats({ refetchInterval = 10000 } = {}) {
  return useQuery({
    queryKey: ["todos", "stats"],
    queryFn: async () => {
      const res = await secureAxios.get("/admin/todos/stats");
      return res.data;
    },
    refetchInterval,
    staleTime: 5000,
  });
}

// Restore ToDo
export function useRestoreToDo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await secureAxios.post(`/admin/todos/${id}/restore`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

// Hard delete ToDo
export function useHardDeleteToDo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await secureAxios.delete(`/admin/todos/${id}/hard`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

// Fetch all assignable users (admins, moderators)
export function useAssignableUsers(currentUser) {
  return useQuery({
    queryKey: ["assignable-users"],
    queryFn: async () => {
      const roles =
        currentUser?.role === "admin" ? "admin,moderator" : "moderator";
      const res = await secureAxios.get(`/users?roles=${roles}`);
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data.users)) return res.data.users;
      if (Array.isArray(res.data.data)) return res.data.data;
      throw new Error(
        "Unexpected response format: " + JSON.stringify(res.data)
      );
    },
    staleTime: 60000,
  });
}
