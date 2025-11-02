import { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import type {
  EventInput,
  EventChangeArg,
  EventSourceFunc,
  DateSelectArg,
} from "@fullcalendar/core";
import { API } from "@/lib/axios-client";
import { useQueryClient } from "@tanstack/react-query";
import { formatISO } from "date-fns";

interface CalendarEvent {
  id: string | number;
  title: string;
  start_time: string;
  end_time: string;
  color?: string;
  [key: string]: unknown;
}

export default function CalendarView() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const queryClient = useQueryClient();

  // ✅ Fetch events for current visible range
  const fetchEvents: EventSourceFunc = async (
    fetchInfo,
    successCallback,
    failureCallback
  ) => {
    try {
      const start = fetchInfo.startStr;
      const end = fetchInfo.endStr;

      const res = await API.get(
        `/events/all?start=${encodeURIComponent(
          start
        )}&end=${encodeURIComponent(end)}`
      );

      const rawEvents = (res.data?.data?.events ?? []) as CalendarEvent[];

      const events: EventInput[] = rawEvents.map((e) => ({
        id: String(e.id),
        title: e.title,
        start: e.start_time,
        end: e.end_time,
        backgroundColor: e.color || "#3b82f6",
        extendedProps: { ...e },
      }));

      successCallback(events);
    } catch (err) {
      failureCallback(err instanceof Error ? err : new Error(String(err)));
    }
  };

  // ✅ Create event when date is selected
  const handleDateSelect = async (selectInfo: DateSelectArg) => {
    const { startStr, endStr } = selectInfo;
    const title = prompt("Enter event title:");
    if (!title) return;

    try {
      await API.post("/events/create", {
        title,
        description: "",
        start_time: formatISO(new Date(startStr)),
        end_time: formatISO(new Date(endStr)),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        color: "#3b82f6",
        location_type: null,
        is_public: false,
      });

      queryClient.invalidateQueries({ queryKey: ["events"] });
      calendarRef.current?.getApi().refetchEvents();
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  // ✅ Update event when dragged or resized
  const handleEventChange = async ({ event }: EventChangeArg) => {
    try {
      await API.put(`/events/${event.id}`, {
        start_time: formatISO(event.start!),
        end_time: formatISO(event.end!),
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  };

  return (
    <div className="p-4">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        events={fetchEvents}
        selectable
        select={handleDateSelect}
        editable
        eventDrop={handleEventChange}
        eventResize={handleEventChange}
        height="auto"
      />
    </div>
  );
}
