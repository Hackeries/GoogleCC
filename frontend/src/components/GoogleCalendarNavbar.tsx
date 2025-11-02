import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Settings,
  Grid3x3,
  HelpCircle,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

interface GoogleCalendarNavbarProps {
  currentDate: Date;
  currentView: "month" | "week" | "day" | "year" | "schedule";
  onDateChange: (date: Date) => void;
  onViewChange: (view: "month" | "week" | "day" | "year" | "schedule") => void;
  onTodayClick: () => void;
}

export function GoogleCalendarNavbar({
  currentDate,
  currentView,
  onDateChange,
  onViewChange,
  onTodayClick,
}: GoogleCalendarNavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (currentView) {
      case "day":
        newDate.setDate(newDate.getDate() - 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case "year":
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (currentView) {
      case "day":
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case "year":
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
    }
    onDateChange(newDate);
  };

  const getDateTitle = () => {
    switch (currentView) {
      case "day":
        return format(currentDate, "MMMM d, yyyy");
      case "week":
        return format(currentDate, "MMMM yyyy");
      case "month":
        return format(currentDate, "MMMM yyyy");
      case "year":
        return format(currentDate, "yyyy");
      case "schedule":
        return "Schedule";
      default:
        return format(currentDate, "MMMM yyyy");
    }
  };

  const viewLabels = {
    day: "Day",
    week: "Week",
    month: "Month",
    year: "Year",
    schedule: "Schedule",
  };

  return (
    <nav className="h-14 sm:h-16 bg-white border-b border-gray-200 px-2 sm:px-4 flex items-center justify-between flex-shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-1 min-w-0">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#1a73e8] flex-shrink-0" />
          <h1 className="text-base sm:text-xl font-normal text-gray-700 hidden sm:block">
            Calendar
          </h1>
        </div>

        {/* Today Button */}
        <Button
          variant="outline"
          onClick={onTodayClick}
          className="h-8 sm:h-9 px-2 sm:px-4 text-xs sm:text-sm rounded-md border-gray-300 hover:bg-gray-50"
        >
          Today
        </Button>

        {/* Navigation Arrows */}
        <div className="flex items-center">
          <button
            onClick={handlePrevious}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
          <button
            onClick={handleNext}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>

        {/* Current Date Display */}
        <h2 className="text-sm sm:text-xl font-normal text-gray-700 truncate min-w-0">
          {getDateTitle()}
        </h2>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Search */}
        <div className="hidden xl:block relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="pl-9 w-48 lg:w-64 h-9 rounded-full border-gray-300 bg-gray-50 focus:bg-white"
          />
        </div>

        {/* Search Icon (mobile) */}
        <button className="xl:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-full">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>

        {/* Help */}
        <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-full">
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </button>

        {/* Settings */}
        <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-full">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>

        {/* Apps Grid */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="hidden md:block p-2 hover:bg-gray-100 rounded-full">
              <Grid3x3 className="w-5 h-5 text-gray-600" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="mb-3">
              <h3 className="font-semibold text-sm text-gray-900">Google apps</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: "Gmail", icon: "??", color: "bg-red-100" },
                { name: "Drive", icon: "??", color: "bg-blue-100" },
                { name: "Meet", icon: "??", color: "bg-green-100" },
                { name: "Chat", icon: "??", color: "bg-purple-100" },
                { name: "Docs", icon: "??", color: "bg-blue-100" },
                { name: "Sheets", icon: "??", color: "bg-green-100" },
                { name: "Slides", icon: "???", color: "bg-yellow-100" },
                { name: "Keep", icon: "???", color: "bg-yellow-100" },
                { name: "Tasks", icon: "?", color: "bg-blue-100" },
              ].map((app) => (
                <button
                  key={app.name}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-lg ${app.color} flex items-center justify-center text-2xl`}>
                    {app.icon}
                  </div>
                  <span className="text-xs text-gray-700">{app.name}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* View Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-8 sm:h-9 px-2 sm:px-4 text-xs sm:text-sm rounded-md border-gray-300 hover:bg-gray-50"
            >
              <span className="hidden sm:inline">{viewLabels[currentView]}</span>
              <span className="sm:hidden">{viewLabels[currentView].charAt(0)}</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1 -rotate-90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => onViewChange("day")}>
              Day
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange("week")}>
              Week
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange("month")}>
              Month
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange("year")}>
              Year
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewChange("schedule")}>
              Schedule
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
