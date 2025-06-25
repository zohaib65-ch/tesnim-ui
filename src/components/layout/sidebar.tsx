import { NavLink } from "react-router-dom";
import { Home, CheckSquare, Calendar, Clock, Settings as SettingsIcon, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

export function Sidebar() {
  const { logout } = useAuthStore();

  const navItems = [
    {
      path: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      path: "/tasks",
      icon: <CheckSquare className="h-5 w-5" />,
      label: "Tasks",
    },
    {
      path: "/calendar",
      icon: <Calendar className="h-5 w-5" />,
      label: "Calendar",
    },
    {
      path: "/pomodoro",
      icon: <Clock className="h-5 w-5" />,
      label: "Pomodoro",
    },
    {
      path: "/settings",
      icon: <SettingsIcon className="h-5 w-5" />,
      label: "Settings",
    },
    { path: "/help", icon: <HelpCircle className="h-5 w-5" />, label: "Help" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card dark:bg-secondary">
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">T</div>
        <span className="text-xl font-bold text-foreground">Tesnim</span>
      </div>
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center text-sm gap-3 px-3 py-3 rounded-xl transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"}`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 mt-auto">
        <Button variant="outline" className="w-full flex items-center gap-2" onClick={() => logout()}>
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
