// src/pages/admin/calendar/useCalendar.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import secureAxios from "../../../utils/secureAxios";

export const useCalendarQuery = (countryCode, year) =>
  useQuery({
    queryKey: ["calendar", countryCode, year],
    queryFn: async () => {
      const res = await secureAxios.get(
        `/admin/calendars/${countryCode}/${year}`
      );
      return res.data;
    },
  });

export const useSaveCalendar = (countryCode, year) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (calendarData) => {
      await secureAxios.put(`/admin/calendars/${countryCode}/${year}`, {
        calendar: calendarData.calendar,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["calendar", countryCode, year]);
    },
  });
};
