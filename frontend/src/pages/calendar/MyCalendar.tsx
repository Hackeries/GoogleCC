import { useState, useCallback, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserMeetingsQueryFn, createEventMutationFn, rescheduleMeetingMutationFn } from "@/lib/api";
import { toast } from "sonner";
import { Loader } from "@/components/loader";
import PageTitle from "@/components/PageTitle";
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
import { useRealtimeMeetings } from "@/hooks/use-realtime-meetings";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

interface SlotInfo {
  start: Date;
  end: Date;
  slots: Date[];
  action: "select" | "click" | "doubleClick";
}

const MyCalendar = () => {
  const queryClient = useQueryClient();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");

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
      const calendarEvents: CalendarEvent[] = meetingsData.meetings.map(
        (meeting) => ({
          id: meeting.id,
          title: meeting.event?.title || meeting.guestName,
          start: new Date(meeting.startTime),
          end: new Date(meeting.endTime),
          description: meeting.additionalInfo,
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

  // Handle event drop (drag and drop)
  const handleEventDrop = useCallback(
    ({ event, start, end }: { event: CalendarEvent; start: Date; end: Date }) => {
      if (!event.id) {
        toast.error("Cannot reschedule this event");
        return;
      }

      // Optimistically update UI
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === event.id ? { ...ev, start, end } : ev
        )
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
        prev.map((ev) =>
          ev.id === event.id ? { ...ev, start, end } : ev
        )
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" color="black" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="My Calendar"
        subtitle="View and manage your scheduled meetings"
      />

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "70vh" }}
          selectable
          onSelectSlot={handleSelectSlot}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          resizable
          draggableAccessor={() => true}
        />
      </div>

      {/* Create Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Create an event type for {selectedSlot && format(selectedSlot.start, "PPP")}
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
              {createEventMutation.isPending ? (
                <Loader size="sm" color="white" />
              ) : (
                "Create Event"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyCalendar;