import {
  CalendarRange,
  ClockIcon,
  Command,
  LayoutGrid,
  LinkIcon,
  LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarRail,
  useSidebar,
} from "./ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePaths";

type ItemType = {
  title: string;
  url: string;
  icon: LucideIcon;
  separator?: boolean;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { state } = useSidebar();
  const pathname = location.pathname;

  const items: ItemType[] = [
    { title: "Event Types", url: PROTECTED_ROUTES.EVENT_TYPES, icon: LinkIcon },
    { title: "Meetings", url: PROTECTED_ROUTES.MEETINGS, icon: CalendarRange },
    {
      title: "Integrations & Apps",
      url: PROTECTED_ROUTES.INTEGRATIONS,
      icon: LayoutGrid,
    },
    {
      title: "Availability",
      url: PROTECTED_ROUTES.AVAILBILITIY,
      icon: ClockIcon,
    },
    {
      title: "My Calendar",
      url: PROTECTED_ROUTES.CALENDER,
      icon: CalendarRange,
    },
  ];

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className={`transition-all duration-300 ease-in-out shadow-sm border-r border-gray-200 ${
        state !== "collapsed" ? "w-[260px]" : "w-[72px]"
      } bg-white`}
      {...props}
    >
      {/* HEADER */}
      <SidebarHeader
        className={`!py-3 relative flex items-center justify-between border-b border-gray-100 ${
          state !== "collapsed" ? "!px-5" : "!px-3"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#E8F0FE] text-[#1A73E8]">
            <Command className="size-4" />
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col">
              <h2 className="truncate text-lg font-semibold text-gray-900">
                Google Cal 1.1
              </h2>
              <span className="text-xs text-gray-500">
                Smarter event scheduling
              </span>
            </div>
          )}
        </div>

        <SidebarTrigger
          className={`cursor-pointer ${
            state === "collapsed"
              ? "absolute -right-4 bg-white border rounded-full shadow transform rotate-180"
              : ""
          }`}
        />
      </SidebarHeader>

      {/* MENU */}
      <SidebarContent className="!p-2 dark:bg-background">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = item.url === pathname;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 font-medium ${
                    isActive
                      ? "bg-[#E8F0FE] text-[#1A73E8]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Link to={item.url}>
                    <item.icon
                      className={`w-5 h-5 ${
                        isActive ? "text-[#1A73E8]" : "text-gray-500"
                      } group-hover:text-[#1A73E8]`}
                    />
                    <span className="truncate">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
