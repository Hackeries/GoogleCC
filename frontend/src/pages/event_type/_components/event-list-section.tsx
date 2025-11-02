import { EventType } from "@/types/api.type";
import EventCard from "./event-card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleEventVisibilityMutationFn, deleteEventMutationFn } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import EditEventDialog from "./edit-event-dialog";

const EventListSection = (props: { events: EventType[]; username: string }) => {
  const { events, username } = props;
  const [pendingEventId, setPendingEventId] = useState<string | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutate: toggleMutate, isPending } = useMutation({
    mutationFn: toggleEventVisibilityMutationFn,
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteEventMutationFn,
  });

  const toggleEventVisibility = (eventId: string) => {
    setPendingEventId(eventId);
    toggleMutate(
      {
        eventId: eventId,
      },
      {
        onSuccess: (response) => {
          queryClient.invalidateQueries({
            queryKey: ["event_list"],
          });
          setPendingEventId(null);
          toast.success(`${response.message}`);
        },
        onError: () => {
          setPendingEventId(null);
          toast.error("Failed to switch event");
        },
      }
    );
  };

  const handleDeleteEvent = (eventId: string) => {
    setDeletingEventId(eventId);
    deleteMutate(eventId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["event_list"],
        });
        setDeletingEventId(null);
        toast.success("Event deleted successfully!");
      },
      onError: () => {
        setDeletingEventId(null);
        toast.error("Failed to delete event");
      },
    });
  };

  const handleEditEvent = (event: EventType) => {
    setEditingEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingEvent(null);
  };
  return (
    <>
      <div className="w-full">
        <div
          className="
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(min(calc(100%/3-24px),max(280px,calc(100%-48px)/3)),1fr))]
           gap-6 py-[10px] pb-[25px]
          "
        >
          {events?.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              slug={event.slug}
              duration={event.duration}
              description={event.description}
              isPrivate={event.isPrivate}
              username={username}
              isPending={pendingEventId === event.id ? isPending : false}
              isDeleting={deletingEventId === event.id}
              onToggle={() => toggleEventVisibility(event.id)}
              onDelete={() => handleDeleteEvent(event.id)}
              onEdit={() => handleEditEvent(event)}
            />
          ))}
        </div>
      </div>

      <EditEventDialog
        event={editingEvent}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
      />
    </>
  );}
};

export default EventListSection;
