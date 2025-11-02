import { useEffect } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Dedicated hook for real-time meeting updates
 * Listens to meeting table changes and provides live notifications
 */
export function useRealtimeMeetings() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const meetingsChannel = supabaseClient
      .channel("meetings-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "meetings" },
        (payload) => {
          console.log("?? Meeting realtime update:", payload);

          // Invalidate all meeting-related queries
          queryClient.invalidateQueries({ queryKey: ["user_meetings"] });
          queryClient.invalidateQueries({ queryKey: ["meetings"] });

          // Show user-friendly notifications
          if (payload.eventType === "INSERT") {
            const meeting = payload.new as Record<string, unknown>;
            toast.success("New meeting scheduled!", {
              description: `Meeting with ${meeting.guestName || "guest"}`,
            });
          } else if (payload.eventType === "UPDATE") {
            const oldMeeting = payload.old as Record<string, unknown>;
            const newMeeting = payload.new as Record<string, unknown>;

            if (newMeeting.status === "CANCELLED" && oldMeeting.status !== "CANCELLED") {
              toast.warning("Meeting cancelled", {
                description: "A meeting has been cancelled",
              });
            } else if (
              newMeeting.startTime !== oldMeeting.startTime ||
              newMeeting.endTime !== oldMeeting.endTime
            ) {
              toast.info("Meeting rescheduled", {
                description: "Meeting time has been updated",
              });
            }
          } else if (payload.eventType === "DELETE") {
            toast.error("Meeting deleted");
          }
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(meetingsChannel);
    };
  }, [queryClient]);
}
