import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/theme-provider";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-9 h-9 border-gray-300"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4 text-gray-600" />
      ) : (
        <Sun className="w-4 h-4 text-gray-600" />
      )}
    </Button>
  );
}
