import { useEffect } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Enhanced realtime listener for events, meetings, and availability changes
 * Automatically refreshes related queries when data changes in Supabase
 */
export function useRealtimeEvents() {
  const qc = useQueryClient();

  useEffect(() => {
    // Listen to events table changes
    const eventsChannel = supabaseClient
      .channel("realtime:events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        (payload) => {
          console.log("?? Event change detected:", payload);
          qc.invalidateQueries({ queryKey: ["events"] });
          qc.invalidateQueries({ queryKey: ["event_list"] });
          
          if (payload.eventType === "INSERT") {
            toast.info("New event type created!");
          } else if (payload.eventType === "UPDATE") {
            toast.info("Event type updated!");
          }
        }
      )
      .subscribe();

    // Listen to meetings table changes
    const meetingsChannel = supabaseClient
      .channel("realtime:meetings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "meetings" },
        (payload) => {
          console.log("?? Meeting change detected:", payload);
          qc.invalidateQueries({ queryKey: ["user_meetings"] });
          qc.invalidateQueries({ queryKey: ["meetings"] });
          
          if (payload.eventType === "INSERT") {
            toast.success("New meeting scheduled!");
          } else if (payload.eventType === "UPDATE") {
            const newStatus = (payload.new as any)?.status;
            if (newStatus === "CANCELLED") {
              toast.warning("Meeting cancelled");
            } else {
              toast.info("Meeting updated!");
            }
          }
        }
      )
      .subscribe();

    // Listen to availability changes
    const availabilityChannel = supabaseClient
      .channel("realtime:availability")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "availability" },
        (payload) => {
          console.log("?? Availability change detected:", payload);
          qc.invalidateQueries({ queryKey: ["user_availability"] });
          qc.invalidateQueries({ queryKey: ["availability"] });
          
          if (payload.eventType === "UPDATE") {
            toast.info("Availability updated!");
          }
        }
      )
      .subscribe();

    // Listen to day_availability changes
    const dayAvailabilityChannel = supabaseClient
      .channel("realtime:day_availability")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "day_availability" },
        (payload) => {
          console.log("?? Day availability change detected:", payload);
          qc.invalidateQueries({ queryKey: ["user_availability"] });
          qc.invalidateQueries({ queryKey: ["availability"] });
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(eventsChannel);
      supabaseClient.removeChannel(meetingsChannel);
      supabaseClient.removeChannel(availabilityChannel);
      supabaseClient.removeChannel(dayAvailabilityChannel);
    };
  }, [qc]);
}
