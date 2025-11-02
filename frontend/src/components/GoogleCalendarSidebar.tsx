import { useState } from "react";
import { Plus, ChevronDown, Search, Calendar, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

interface CalendarItem {
  id: string;
  name: string;
  color: string;
  visible: boolean;
}

interface GoogleCalendarSidebarProps {
  onCreateEvent?: (type: "event" | "task" | "appointment") => void;
  onCalendarToggle?: (id: string, visible: boolean) => void;
}

export function GoogleCalendarSidebar({ 
  onCreateEvent,
  onCalendarToggle 
}: GoogleCalendarSidebarProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createType, setCreateType] = useState<"event" | "task" | "appointment">("event");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [myCalendars, setMyCalendars] = useState<CalendarItem[]>([
    { id: "1", name: "Personal", color: "#1a73e8", visible: true },
    { id: "2", name: "Work", color: "#e67c73", visible: true },
    { id: "3", name: "Birthdays", color: "#f6bf26", visible: true },
    { id: "4", name: "Holidays", color: "#33b679", visible: false },
  ]);

  const handleCalendarToggle = (id: string) => {
    setMyCalendars(cals =>
      cals.map(cal =>
        cal.id === id ? { ...cal, visible: !cal.visible } : cal
      )
    );
    const calendar = myCalendars.find(c => c.id === id);
    if (calendar) {
      onCalendarToggle?.(id, !calendar.visible);
    }
  };

  const handleCreate = (type: "event" | "task" | "appointment") => {
    setCreateType(type);
    setIsCreateDialogOpen(true);
    onCreateEvent?.(type);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Create Button */}
      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="w-full justify-start gap-3 h-14 rounded-full shadow-md hover:shadow-lg transition-all bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            >
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Plus className="w-5 h-5 text-[#1a73e8]" />
              </div>
              <span className="font-medium text-base">Create</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => handleCreate("event")}>
              <Calendar className="w-4 h-4 mr-2" />
              Event
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreate("task")}>
              <Check className="w-4 h-4 mr-2" />
              Task
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreate("appointment")}>
              <Calendar className="w-4 h-4 mr-2" />
              Appointment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search */}
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for people"
            className="pl-9 rounded-full border-gray-300"
          />
        </div>
      </div>

      {/* My Calendars */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 px-2">
            My calendars
          </h3>
          
          {myCalendars.map((calendar) => (
            <motion.div
              key={calendar.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-md cursor-pointer group"
              onClick={() => handleCalendarToggle(calendar.id)}
            >
              <Checkbox
                checked={calendar.visible}
                onCheckedChange={() => handleCalendarToggle(calendar.id)}
                className="border-gray-400"
                style={{
                  backgroundColor: calendar.visible ? calendar.color : "transparent",
                  borderColor: calendar.color,
                }}
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {calendar.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Other Calendars */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 px-2 flex items-center justify-between">
            <span>Other calendars</span>
            <button className="text-gray-400 hover:text-gray-600">
              <Plus className="w-4 h-4" />
            </button>
          </h3>
          <div className="text-xs text-gray-500 px-2">
            Add calendars from URL, contacts, or public calendars
          </div>
        </div>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create {createType}</DialogTitle>
            <DialogDescription>
              Add a new {createType} to your calendar
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder={`${createType} title`} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add description..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
