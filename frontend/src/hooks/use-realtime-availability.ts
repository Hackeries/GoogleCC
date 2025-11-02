import { useEffect } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Dedicated hook for real-time availability updates
 * Listens to availability and day_availability table changes
 */
export function useRealtimeAvailability() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Listen to main availability table
    const availabilityChannel = supabaseClient
      .channel("availability-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "availability" },
        (payload) => {
          console.log("?? Availability realtime update:", payload);
          
          queryClient.invalidateQueries({ queryKey: ["user_availability"] });
          queryClient.invalidateQueries({ queryKey: ["availability"] });
          queryClient.invalidateQueries({ queryKey: ["public_availability"] });

          if (payload.eventType === "UPDATE") {
            toast.info("Availability settings updated");
          }
        }
      )
      .subscribe();

    // Listen to day-specific availability
    const dayAvailabilityChannel = supabaseClient
      .channel("day-availability-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "day_availability" },
        (payload) => {
          console.log("?? Day availability realtime update:", payload);
          
          queryClient.invalidateQueries({ queryKey: ["user_availability"] });
          queryClient.invalidateQueries({ queryKey: ["availability"] });
          queryClient.invalidateQueries({ queryKey: ["public_availability"] });
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(availabilityChannel);
      supabaseClient.removeChannel(dayAvailabilityChannel);
    };
  }, [queryClient]);
}
