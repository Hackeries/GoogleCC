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
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
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
        .map((meeting) => ({
          id: meeting.id,
          title: meeting.event?.title || meeting.guestName,
          start: new Date(meeting.startTime),
          end: new Date(meeting.endTime),
          description: meeting.additionalInfo,
          color: "#1a73e8",
        }));
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
    ({
      event,
      start,
      end,
    }: {
      event: CalendarEvent;
      start: Date;
      end: Date;
    }) => {
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
    ({
      event,
      start,
      end,
    }: {
      event: CalendarEvent;
      start: Date;
      end: Date;
    }) => {
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
      <div className="flex flex-col md:flex-row h-screen w-full bg-white dark:bg-gray-900 overflow-hidden">
        <aside className="hidden md:block md:w-64 lg:w-72 border-r border-gray-200">
          <GoogleCalendarSidebar />
        </aside>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a73e8]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:block md:w-64 lg:w-72 border-r border-gray-200 dark:border-gray-700 overflow-y-auto bg-white dark:bg-gray-900 shadow-lg">
        <GoogleCalendarSidebar
          onCreateEvent={(type) => {
            toast.info(`Creating ${type}...`);
            setIsDialogOpen(true);
          }}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Navbar */}
        <GoogleCalendarNavbar
          currentDate={currentDate}
          currentView={currentView}
          onDateChange={handleDateChange}
          onViewChange={handleViewChange}
          onTodayClick={handleTodayClick}
        />

        {/* Calendar Content */}
        <div className="flex-1 overflow-auto p-2 sm:p-6">
          <AnimatePresence mode="wait">
            {currentView === "year" ? (
              <motion.div
                key="year-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
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
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full"
              >
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
                    <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></span>
                    Schedule
                  </h2>
                  <div className="space-y-3">
                    {events
                      .sort((a, b) => a.start.getTime() - b.start.getTime())
                      .map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
                          onClick={() => handleSelectEvent(event)}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className="w-1.5 h-full rounded-full shadow-md"
                              style={
                                {
                                  backgroundColor: event.color,
                                  boxShadow: `0 0 10px ${event.color}40`,
                                } as React.CSSProperties
                              }
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {event.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
                                <span className="font-medium">{format(event.start, "EEEE, MMMM d")}</span>
                                <span className="text-gray-400">?</span>
                                <span>{format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}</span>
                              </p>
                              {event.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    {events.length === 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 text-gray-500 dark:text-gray-400"
                      >
                        <div className="mb-4 text-6xl">??</div>
                        <p className="text-lg font-medium">No upcoming events</p>
                        <p className="text-sm mt-2">Create your first event to get started</p>
                      </motion.div>
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
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] min-h-[500px] overflow-hidden"
              >
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%", minHeight: "500px" }}
                  view={currentView as "month" | "week" | "day"}
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
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
              <DialogTitle className="text-2xl font-bold">? Create New Event</DialogTitle>
              <DialogDescription className="text-blue-100">
                {selectedSlot && (
                  <span className="flex items-center gap-2 mt-2">
                    <span className="text-lg">??</span>
                    <span className="font-medium">{format(selectedSlot.start, "EEEE, MMMM d, yyyy")}</span>
                    <span className="text-blue-200">?</span>
                    <span>{format(selectedSlot.start, "h:mm a")} - {format(selectedSlot.end, "h:mm a")}</span>
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-base font-semibold text-gray-700">Event Title *</Label>
                <Input
                  id="title"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g., Team Meeting, Client Call, Workshop"
                  className="text-base h-12 border-2 focus:border-blue-500 transition-colors"
                  autoFocus
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-semibold text-gray-700">Description</Label>
                <Textarea
                  id="description"
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  placeholder="Add details, agenda, meeting notes..."
                  rows={4}
                  className="text-base border-2 focus:border-blue-500 transition-colors resize-none"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-700">Event Color</Label>
                <div className="flex gap-3 flex-wrap">
                  {colors.map((color) => (
                    <motion.button
                      key={color.value}
                      onClick={() => setNewEventColor(color.value)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative w-10 h-10 rounded-full transition-all ${
                        newEventColor === color.value
                          ? "ring-4 ring-offset-2 ring-gray-400 shadow-lg"
                          : "hover:shadow-md"
                      }`}
                      style={
                        {
                          backgroundColor: color.value,
                        } as React.CSSProperties
                      }
                      title={color.name}
                    >
                      {newEventColor === color.value && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold"
                        >
                          ?
                        </motion.span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter className="bg-gray-50 p-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={createEventMutation.isPending}
                className="flex-1 h-12 text-base font-medium"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateEvent}
                disabled={createEventMutation.isPending || !newEventTitle.trim()}
                className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {createEventMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">?</span>
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>?</span>
                    Create Event
                  </span>
                )}
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={isEventDetailsOpen} onOpenChange={setIsEventDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <DialogHeader 
              className="text-white p-6 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${selectedEvent?.color || '#1a73e8'} 0%, ${selectedEvent?.color || '#1a73e8'}dd 100%)`,
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              <DialogTitle className="text-2xl font-bold relative z-10">{selectedEvent?.title}</DialogTitle>
              <DialogDescription className="text-white/90 relative z-10">
                {selectedEvent && (
                  <div className="space-y-2 mt-3">
                    <span className="flex items-center gap-2 text-base">
                      <span className="text-xl">??</span>
                      <span className="font-medium">{format(selectedEvent.start, "EEEE, MMMM d, yyyy")}</span>
                    </span>
                    <span className="flex items-center gap-2 text-base">
                      <span className="text-xl">?</span>
                      <span>{format(selectedEvent.start, "h:mm a")} - {format(selectedEvent.end, "h:mm a")}</span>
                    </span>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 space-y-6">
              {selectedEvent?.description && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
                    <span>??</span>
                    Description
                  </Label>
                  <p className="text-base text-gray-600 dark:text-gray-400 bg-gray-50 p-4 rounded-lg leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div
                  className="w-6 h-6 rounded-full shadow-md"
                  style={
                    {
                      backgroundColor: selectedEvent?.color,
                      boxShadow: `0 0 12px ${selectedEvent?.color}60`,
                    } as React.CSSProperties
                  }
                />
                <span className="text-sm font-medium text-gray-700">
                  Event Color
                </span>
              </div>
            </div>
            <DialogFooter className="bg-gray-50 p-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEventDetailsOpen(false)}
                className="flex-1 h-12 text-base font-medium"
              >
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  toast.info("Delete functionality coming soon");
                  setIsEventDetailsOpen(false);
                }}
                className="flex-1 h-12 text-base font-medium"
              >
                ??? Delete Event
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedCalendar;
