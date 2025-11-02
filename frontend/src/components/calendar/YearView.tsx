import { useState } from "react";
import { format, startOfYear, endOfYear, eachMonthOfInterval, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

interface YearViewProps {
  events?: Event[];
  onDateClick?: (date: Date) => void;
  currentDate?: Date;
}

export function YearView({ events = [], onDateClick, currentDate = new Date() }: YearViewProps) {
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const yearStart = startOfYear(new Date(selectedYear, 0, 1));
  const yearEnd = endOfYear(new Date(selectedYear, 0, 1));
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start), date)
    );
  };

  const hasEventsOnDate = (date: Date) => {
    return getEventsForDate(date).length > 0;
  };

  const renderMiniMonth = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Get days to pad at the beginning (Sunday = 0)
    const startDay = monthStart.getDay();
    const paddingDays = Array(startDay).fill(null);
    
    return (
      <motion.div
        key={monthDate.toString()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow"
      >
        <h3 className="text-sm font-semibold text-gray-900 mb-2 text-center">
          {format(monthDate, "MMMM")}
        </h3>
        
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="text-center text-xs text-gray-500 font-medium">
              {day}
            </div>
          ))}
        </div>
        
        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {paddingDays.map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square" />
          ))}
          {daysInMonth.map((day) => {
            const isCurrentDay = isToday(day);
            const hasEvents = hasEventsOnDate(day);
            const dayEvents = getEventsForDate(day);
            const eventColor = dayEvents[0]?.color || "#1a73e8";
            
            return (
              <button
                key={day.toString()}
                onClick={() => onDateClick?.(day)}
                className={`
                  aspect-square flex items-center justify-center text-xs rounded-full
                  transition-all duration-150 relative
                  ${isCurrentDay 
                    ? "bg-[#1a73e8] text-white font-semibold" 
                    : isSameMonth(day, monthDate)
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-300"
                  }
                  ${hasEvents && !isCurrentDay ? "font-semibold" : ""}
                `}
              >
                {format(day, "d")}
                {hasEvents && !isCurrentDay && (
                  <span 
                    className="absolute bottom-0.5 w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: eventColor,
                    } as React.CSSProperties}
                  />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Year Navigation */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <button
          onClick={() => setSelectedYear(y => y - 1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Previous year"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-semibold text-gray-900">
          {selectedYear}
        </h2>
        
        <button
          onClick={() => setSelectedYear(y => y + 1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Next year"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 12-month grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {months.map(month => renderMiniMonth(month))}
        </div>
      </div>
    </div>
  );
}
