import {
  CalendarRange,
  ClockIcon,
  Command,
  LayoutGrid,
  LinkIcon,
  LucideIcon,
  Settings,
  BarChart3,
  Users2,
  HelpCircle,
  LogOut,
  Home,
  CalendarCheck,
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
  section?: string;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { state } = useSidebar();
  const pathname = location.pathname;

  // ✅ Updated navigation list
  const items: ItemType[] = [
    // 📁 Dashboard Section
    {
      title: "Dashboard",
      url: "/app/dashboard",
      icon: Home,
      section: "Dashboard",
    },

    // 📅 Events Section
    {
      title: "Event Types",
      url: PROTECTED_ROUTES.EVENT_TYPES,
      icon: LinkIcon,
      section: "Events",
    },
    {
      title: "Meetings",
      url: PROTECTED_ROUTES.MEETINGS,
      icon: CalendarRange,
      section: "Events",
    },
    {
      title: "Availability",
      url: PROTECTED_ROUTES.AVAILBILITIY,
      icon: ClockIcon,
      section: "Events",
    },
    {
      title: "My Calendar",
      url: PROTECTED_ROUTES.CALENDER,
      icon: CalendarCheck,
      section: "Events",
      separator: true,
    },

    // 🔗 Integrations & Tools
    {
      title: "Integrations & Apps",
      url: PROTECTED_ROUTES.INTEGRATIONS,
      icon: LayoutGrid,
      section: "Integrations",
    },
    {
      title: "Analytics",
      url: "/app/analytics",
      icon: BarChart3,
      section: "Integrations",
    },
    {
      title: "Team Members",
      url: "/app/team",
      icon: Users2,
      section: "Integrations",
      separator: true,
    },

    // ⚙️ Settings Section
    {
      title: "Settings",
      url: "/app/settings",
      icon: Settings,
      section: "Settings",
    },
    {
      title: "Help & Support",
      url: "/app/help",
      icon: HelpCircle,
      section: "Settings",
    },
  ];

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className={`transition-all duration-300 ease-in-out ${
        state !== "collapsed" ? "w-[270px]" : ""
      } !bg-white !border-gray-200 shadow-sm`}
      {...props}
    >
      {/* ================= HEADER ================= */}
      <SidebarHeader
        className={`!py-3 border-b border-gray-200 relative ${
          state !== "collapsed" ? "!px-5" : "!px-3"
        }`}
      >
        <div className="flex h-[52px] items-center gap-2 justify-start">
          <div className="flex aspect-square size-7 items-center justify-center rounded-md bg-[#1a73e8] text-white">
            <Command className="size-4" />
          </div>

          {state !== "collapsed" && (
            <div className="grid flex-1 text-left leading-tight ml-1">
              <h2 className="truncate font-semibold text-lg text-gray-800">
                Google Cal 1.1
              </h2>
              <span className="text-xs text-gray-500">
                Smart Scheduling App
              </span>
            </div>
          )}

          <SidebarTrigger
            className={`-ml-1 cursor-pointer ${
              state === "collapsed" &&
              "absolute -right-5 z-20 rounded-full bg-white border transform rotate-180"
            }`}
          />
        </div>
      </SidebarHeader>

      {/* ================= MENU CONTENT ================= */}
      <SidebarContent className="!p-[6px_10px] dark:bg-background">
        <SidebarMenu>
          {items.map((item, index) => (
            <div key={item.title}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={`
                    group flex items-center gap-3 text-[15px] font-medium rounded-lg
                    hover:!bg-[#e8f0fe] data-[active=true]:!bg-[#dbeafe]
                    transition-all duration-200 ease-in-out
                  `}
                  isActive={item.url === pathname}
                  asChild
                >
                  <Link
                    to={item.url}
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-[#1a73e8] w-full"
                  >
                    <item.icon
                      className={`!w-5 !h-5 transition-all duration-200 ${
                        item.url === pathname
                          ? "text-[#1a73e8]"
                          : "text-gray-600 group-hover:text-[#1a73e8]"
                      }`}
                    />
                    {state !== "collapsed" && <span>{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {item.separator && index !== items.length - 1 && (
                <hr className="my-3 border-gray-200" />
              )}
            </div>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* ================= FOOTER ================= */}
      <div className="border-t border-gray-200 p-3 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:!bg-[#fee2e2] rounded-lg">
              <Link
                to="/logout"
                className="flex items-center gap-3 text-red-600 font-medium px-3 py-2"
              >
                <LogOut className="w-5 h-5" />
                {state !== "collapsed" && <span>Logout</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>

      <SidebarRail />
    </Sidebar>
  );
}
