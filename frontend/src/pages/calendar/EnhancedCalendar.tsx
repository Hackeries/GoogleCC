import { useState, useCallback, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserMeetingsQueryFn,
  createEventMutationFn,
  rescheduleMeetingMutationFn,
} from "@/lib/api";
import { toast } from "sonner";
import { GoogleCalendarNavbar } from "@/components/GoogleCalendarNavbar";
import { GoogleCalendarSidebar } from "@/components/GoogleCalendarSidebar";
import { YearView } from "@/components/calendar/YearView";
import { useRealtimeMeetings } from "@/hooks/use-realtime-meetings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VideoConferencingPlatform } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  color?: string;
}

interface SlotInfo {
  start: Date;
  end: Date;
  slots: Date[];
  action: "select" | "click" | "doubleClick";
}

type CalendarView = "month" | "week" | "day" | "year" | "schedule";

const EnhancedCalendar = () => {
  const queryClient = useQueryClient();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>("month");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventColor, setNewEventColor] = useState("#1a73e8");

  // Enable real-time meeting updates
  useRealtimeMeetings();

  // Fetch meetings from API
  const { data: meetingsData, isLoading } = useQuery({
    queryKey: ["user_meetings", "UPCOMING"],
    queryFn: () => getUserMeetingsQueryFn("UPCOMING"),
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: createEventMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_meetings"] });
      queryClient.invalidateQueries({ queryKey: ["event_list"] });
      toast.success("Event created successfully!");
      setIsDialogOpen(false);
      setNewEventTitle("");
      setNewEventDescription("");
      setNewEventColor("#1a73e8");
    },
    onError: () => {
      toast.error("Failed to create event");
    },
  });

  // Reschedule meeting mutation
  const rescheduleMutation = useMutation({
    mutationFn: rescheduleMeetingMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_meetings"] });
      toast.success("Meeting rescheduled successfully!");
    },
    onError: () => {
      toast.error("Failed to reschedule meeting");
    },
  });

  // Convert meetings to calendar events
  useEffect(() => {
    if (meetingsData?.meetings) {
      const calendarEvents: CalendarEvent[] = meetingsData.meetings
        .filter((meeting) => meeting.id) // Only include meetings with IDs
        .map(
          (meeting) => ({
            id: meeting.id,
            title: meeting.event?.title || meeting.guestName,
            start: new Date(meeting.startTime),
            end: new Date(meeting.endTime),
            description: meeting.additionalInfo,
            color: "#1a73e8",
          })
        );
      setEvents(calendarEvents);
    }
  }, [meetingsData]);

  // Handle slot selection (when user clicks on calendar)
  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo);
    setIsDialogOpen(true);
  }, []);

  // Handle event click
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  }, []);

  // Handle event drop (drag and drop)
  const handleEventDrop = useCallback(
    ({ event, start, end }: { event: CalendarEvent; start: Date; end: Date }) => {
      if (!event.id) {
        toast.error("Cannot reschedule this event");
        return;
      }

      // Optimistically update UI
      setEvents((prev) =>
        prev.map((ev) => (ev.id === event.id ? { ...ev, start, end } : ev))
      );

      // Call backend to reschedule
      rescheduleMutation.mutate({
        meetingId: event.id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });
    },
    [rescheduleMutation]
  );

  // Handle event resize
  const handleEventResize = useCallback(
    ({ event, start, end }: { event: CalendarEvent; start: Date; end: Date }) => {
      if (!event.id) {
        toast.error("Cannot resize this event");
        return;
      }

      // Optimistically update UI
      setEvents((prev) =>
        prev.map((ev) => (ev.id === event.id ? { ...ev, start, end } : ev))
      );

      // Call backend to reschedule with new duration
      rescheduleMutation.mutate({
        meetingId: event.id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });
    },
    [rescheduleMutation]
  );

  // Handle create event form submission
  const handleCreateEvent = () => {
    if (!newEventTitle.trim() || !selectedSlot) {
      toast.error("Please enter an event title");
      return;
    }

    const duration = Math.round(
      (selectedSlot.end.getTime() - selectedSlot.start.getTime()) / (1000 * 60)
    );

    createEventMutation.mutate({
      title: newEventTitle,
      description: newEventDescription,
      duration: duration > 0 ? duration : 30,
      locationType: VideoConferencingPlatform.GOOGLE_MEET_AND_CALENDAR,
    });
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleViewChange = (view: CalendarView) => {
    setCurrentView(view);
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color || "#1a73e8",
        borderRadius: "4px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  const colors = [
    { name: "Blue", value: "#1a73e8" },
    { name: "Red", value: "#e67c73" },
    { name: "Green", value: "#33b679" },
    { name: "Yellow", value: "#f6bf26" },
    { name: "Orange", value: "#f4511e" },
    { name: "Purple", value: "#8e24aa" },
    { name: "Gray", value: "#616161" },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <GoogleCalendarSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a73e8]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <GoogleCalendarSidebar
        onCreateEvent={(type) => {
          toast.info(`Creating ${type}...`);
          setIsDialogOpen(true);
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <GoogleCalendarNavbar
          currentDate={currentDate}
          currentView={currentView}
          onDateChange={handleDateChange}
          onViewChange={handleViewChange}
          onTodayClick={handleTodayClick}
        />

        {/* Calendar Content */}
        <div className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            {currentView === "year" ? (
              <motion.div
                key="year-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <YearView
                  events={events}
                  currentDate={currentDate}
                  onDateClick={(date) => {
                    setCurrentDate(date);
                    setCurrentView("day");
                  }}
                />
              </motion.div>
            ) : currentView === "schedule" ? (
              <motion.div
                key="schedule-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                    Schedule
                  </h2>
                  <div className="space-y-4">
                    {events
                      .sort((a, b) => a.start.getTime() - b.start.getTime())
                      .map((event) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleSelectEvent(event)}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className="w-1 h-full rounded"
                              style={{
                                backgroundColor: event.color,
                              } as React.CSSProperties}
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {event.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {format(event.start, "EEEE, MMMM d")} ?{" "}
                                {format(event.start, "h:mm a")} -{" "}
                                {format(event.end, "h:mm a")}
                              </p>
                              {event.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    {events.length === 0 && (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        No upcoming events
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="calendar-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm h-full"
              >
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%" }}
                  view={(currentView === "year" || currentView === "schedule" ? "month" : currentView) as "month" | "week" | "day"}
                  onView={() => {}} // Controlled by our custom view selector
                  date={currentDate}
                  onNavigate={setCurrentDate}
                  selectable
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  onEventDrop={handleEventDrop}
                  onEventResize={handleEventResize}
                  resizable
                  draggableAccessor={() => true}
                  eventPropGetter={eventStyleGetter}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              {selectedSlot && `For ${format(selectedSlot.start, "PPP")}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="e.g., Team Meeting"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
                placeholder="Add details about this event..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setNewEventColor(color.value)}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      newEventColor === color.value ? "scale-110 ring-2 ring-offset-2 ring-gray-400" : ""
                    }`}
                    style={{
                      backgroundColor: color.value,
                    } as React.CSSProperties}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={createEventMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateEvent}
              disabled={createEventMutation.isPending}
            >
              {createEventMutation.isPending ? "Creating..." : "Create Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={isEventDetailsOpen} onOpenChange={setIsEventDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              {selectedEvent &&
                `${format(selectedEvent.start, "EEEE, MMMM d, yyyy")} ? ${format(
                  selectedEvent.start,
                  "h:mm a"
                )} - ${format(selectedEvent.end, "h:mm a")}`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedEvent?.description && (
              <div className="space-y-2">
                <Label>Description</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedEvent.description}
                </p>
              </div>
            )}
            <div className="mt-4 flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{
                  backgroundColor: selectedEvent?.color,
                } as React.CSSProperties}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Event color
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEventDetailsOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                toast.info("Delete functionality coming soon");
                setIsEventDetailsOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedCalendar;
