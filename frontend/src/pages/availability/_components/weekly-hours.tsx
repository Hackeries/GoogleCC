import React from "react";
import { DayAvailabilityType } from "@/types/api.type";
import { dayMapping } from "@/lib/availability";

type WeekPreviewGridProps = {
  days: DayAvailabilityType[];
  timeGap?: number;
  timezone?: string;
};

const WeekPreviewGrid: React.FC<WeekPreviewGridProps> = ({
  days,
  timezone = "UTC",
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (h: number, tz: string) => {
    const dt = new Date();
    dt.setHours(h, 0, 0, 0);
    return dt.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
      timeZone: tz,
    });
  };

  const normalizeTimeToIndex = (time: string): number => {
    const [hh, mm] = time.split(":").map(Number);
    return hh + mm / 60;
  };

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
      <h4 className="text-md font-semibold mb-3 text-gray-800">
        Weekly Availability ({timezone})
      </h4>

      <div className="space-y-3">
        {days.map((d) => {
          const start = normalizeTimeToIndex(d.startTime);
          const end = normalizeTimeToIndex(d.endTime);
          const startPercent = (start / 24) * 100;
          const widthPercent = ((end - start) / 24) * 100;

          return (
            <div key={d.day} className="flex items-center gap-3">
              <div className="w-24 text-sm font-medium text-gray-700">
                {dayMapping[d.day as keyof typeof dayMapping]}
              </div>

              <div className="relative flex-1 h-5 bg-gray-100 rounded-md overflow-hidden">
                {d.isAvailable && (
                  <div
                    className="absolute top-0 bottom-0 bg-blue-500/60 rounded-md transition-all duration-300"
                    style={{
                      transform: `translateX(${startPercent}%)`,
                      width: `${widthPercent}%`,
                    }}
                  />
                )}
              </div>

              <div className="w-36 text-xs text-gray-600 text-right">
                {d.isAvailable
                  ? `${d.startTime} - ${d.endTime}`
                  : "Unavailable"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 border-t pt-3 grid grid-cols-6 text-[10px] text-gray-500">
        {hours
          .filter((h) => h % 4 === 0)
          .map((h) => (
            <span key={h} className="text-center">
              {formatHour(h, timezone)}
            </span>
          ))}
      </div>
    </div>
  );
};

export default WeekPreviewGrid;
