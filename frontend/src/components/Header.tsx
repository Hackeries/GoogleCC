import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { useStore } from "@/store/store";
import { AUTH_ROUTES } from "@/routes/common/routePaths";
import { SidebarTrigger } from "./ui/sidebar";

const Header = () => {
  const navigate = useNavigate();
  const { user, setAccessToken, setUser } = useStore();

  const onLogout = () => {
    setUser(null);
    setAccessToken(null);
    navigate(AUTH_ROUTES.SIGN_IN);
  };

  return (
    <header className="flex min-h-12 pt-3 pb-4 shrink-0 items-center transition-[width,height] ease-linear">
      <div className="w-full flex items-center justify-between px-4">
        <SidebarTrigger className="-ml-5 cursor-pointer lg:hidden bg-white border transform rotate-180" />

        <Popover>
          <PopoverTrigger asChild>
            <button
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="User account menu"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Avatar className="active:border-1 active:border-primary">
                <AvatarFallback className="bg-[#e7edf6] uppercase">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="w-4 h-4 fill-black" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            className="w-[280px] rounded-md p-2 bg-white border border-[#D4E114] shadow-[0_1px_5px_rgba(0,74,16,0.15)]"
          >
            {/* ✅ Correct ARIA parent role */}
            <div
              role="menu"
              aria-label="User account actions"
              className="max-h-[calc(100vh-200px)] overflow-y-auto"
            >
              <div className="pb-2 px-4">
                <div className="flex flex-col text-xl font-bold">
                  <span className="capitalize">{user?.name}</span>
                  <span className="text-[#476788] text-sm font-normal">
                    Teams free trial
                  </span>
                </div>
              </div>

              <Separator />

              <div className="pt-2">
                <div className="px-4 pb-1">
                  <p className="text-xs font-bold tracking-[0.1em] text-[rgba(26,26,26,0.61)] uppercase">
                    Account settings
                  </p>
                </div>

                {/* ✅ role="menuitem" now has a proper parent */}
                <button
                  role="menuitem"
                  className="px-4 py-3 w-full font-bold text-sm text-[#0a2540] flex items-center gap-2 hover:bg-[#e5efff]"
                  onClick={onLogout}
                >
                  <LogOutIcon className="w-4 h-4 rotate-180 stroke-2" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Header;
