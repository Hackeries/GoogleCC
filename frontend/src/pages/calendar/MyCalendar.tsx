import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const MyCalendar = () => {
  const [events, setEvents] = useState([
    {
      title: "Demo Event",
      start: new Date(),
      end: new Date(new Date().setHours(new Date().getHours() + 1)),
    },
  ]);

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex items-center justify-between p-4 border-b bg-gray-50 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-700">My Calendar</h1>
        <button
          onClick={() =>
            setEvents([
              ...events,
              {
                title: "New Event",
                start: new Date(),
                end: new Date(new Date().setHours(new Date().getHours() + 1)),
              },
            ])
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Create Event
        </button>
      </header>

      <main className="flex-1 p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "90vh" }}
        />
      </main>
    </div>
  );
};

export default MyCalendar;