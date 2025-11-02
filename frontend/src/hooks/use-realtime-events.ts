import { useEffect } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Automatically listens to Supabase realtime changes on "events" table
 * and refreshes the events query when something changes.
 */
export function useRealtimeEvents() {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabaseClient
      .channel("public:events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => {
          qc.invalidateQueries({ queryKey: ["events"] });
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [qc]);
}
