import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import secureAxios from "../../../utils/secureAxios";
import MonthCard from "./MonthCard";
import DayModal from "./DayModal";

// Optionally, use your own toast/notification system
function toast(msg) {
  alert(msg); // Replace with your preferred notification!
}

const CalendarGrid = ({ data, year, editable, country }) => {
  const [modal, setModal] = useState({
    open: false,
    monthIdx: null,
    dayIdx: null,
  });

  const queryClient = useQueryClient();

  // Always pull from latest data
  const currentDay =
    modal.open && data[modal.monthIdx]?.days[modal.dayIdx]
      ? data[modal.monthIdx].days[modal.dayIdx]
      : null;

  const handleDayClick = (monthIdx, dayIdx) => {
    if (!editable) return;
    setModal({ open: true, monthIdx, dayIdx });
  };

  // --- Add Event ---
  const handleAddEvent = async (eventData) => {
    if (!eventData?.title) return;
    try {
      await secureAxios.post(
        `/admin/calendars/${country}/${year}/${modal.monthIdx}/${modal.dayIdx}/events`,
        eventData
      );
      await queryClient.invalidateQueries(["calendar", country, year]);
      // DO NOT close the modal after add!
      // setModal({ open: false, monthIdx: null, dayIdx: null });
    } catch (e) {
      toast("Failed to add event", e);
    }
  };

  const handleEditEvent = async (eventId, newData) => {
    if (!eventId) {
      toast("Event ID not found.");
      return;
    }
    try {
      await secureAxios.patch(
        `/admin/calendars/${country}/${year}/${modal.monthIdx}/${modal.dayIdx}/events/${eventId}`,
        newData
      );
      await queryClient.invalidateQueries(["calendar", country, year]);
      // DO NOT close the modal after edit!
      // setModal({ open: false, monthIdx: null, dayIdx: null });
    } catch (e) {
      toast("Failed to edit event.", e);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!eventId) {
      toast("Event ID not found.");
      return;
    }
    try {
      await secureAxios.delete(
        `/admin/calendars/${country}/${year}/${modal.monthIdx}/${modal.dayIdx}/events/${eventId}`
      );
      await queryClient.invalidateQueries(["calendar", country, year]);
      // DO NOT close the modal after delete!
      // setModal({ open: false, monthIdx: null, dayIdx: null });
    } catch (e) {
      toast("Failed to delete event.", e);
    }
  };

  // Close modal
  const closeModal = () =>
    setModal({ open: false, monthIdx: null, dayIdx: null });

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        {data.map((month, i) => (
          <MonthCard
            key={month.name}
            month={month}
            year={year}
            editable={editable}
            onDayClick={(dayIdx) => handleDayClick(i, dayIdx)}
          />
        ))}
      </div>
      {editable && (
        <DayModal
          open={modal.open}
          onClose={closeModal}
          dateLabel={currentDay?.date}
          events={currentDay?.events || []}
          onAddEvent={handleAddEvent}
          onEditEvent={(eventIdx, newData) => {
            const eventId = currentDay?.events?.[eventIdx]?._id;
            handleEditEvent(eventId, newData);
          }}
          onDeleteEvent={(eventIdx) => {
            const eventId = currentDay?.events?.[eventIdx]?._id;
            handleDeleteEvent(eventId);
          }}
        />
      )}
    </>
  );
};

export default CalendarGrid;
