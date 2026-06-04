"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, BookOpen, BarChart3, Settings, GraduationCap } from "lucide-react";
import { useUser } from "@/lib/UserContext";

interface SidebarProps {
  activeId?: string;
  onActiveChange?: (id: string) => void;
}

const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "courses", label: "My Courses", icon: BookOpen },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useUser();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "GU";

  const displayName = user?.name || "Student";
  const displayEmail = user?.email || "guest@nexus.app";

  // Determine active tab based on pathname
  const routeMap: Record<string, string> = {
    "/": "dashboard",
    "/courses": "courses",
    "/analytics": "analytics",
    "/settings": "settings",
  };
  const currentActive = routeMap[pathname] ?? "dashboard";

  const handleSelect = (id: string, path: string) => {
    router.push(path);
  };

  return (
    <>
      {/* Desktop & Tablet Navigation (Aside) */}
      <aside
        className="hidden md:flex flex-col w-20 lg:w-64 bg-background/50 glass-panel p-4 justify-between h-screen transition-all duration-300 ease-in-out"
        aria-label="Sidebar Navigation"
      >
        <div className="flex flex-col gap-8">
          {/* Logo Brand area */}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-accent-primary to-accent-secondary shadow-lg shadow-accent-primary/20">
              <GraduationCap className="h-5 w-5 text-[#f4f4f7]" />
            </div>
            <span className="hidden lg:block font-bold tracking-wider bg-gradient-to-r from-white to-[#a3a3a3] bg-clip-text text-transparent text-lg">
              NEXUS
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentActive === item.id;
              const path = item.id === "dashboard" ? "/" : `/${item.id}`;

              return (
                <button
                  key={item.id}
                  id={`sidebar-link-${item.id}`}
                  onClick={() => handleSelect(item.id, path)}
                  className={`relative flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 outline-none group ${
                    isActive ? "text-[#f4f4f7]" : "text-neutral-400 hover:text-[#f4f4f7]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveBackground"
                      className="absolute inset-0 bg-[#ffffff08] rounded-xl border border-white/5 shadow-inner"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveIndicator"
                      className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-accent-primary to-accent-secondary rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center justify-center">
                    <Icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? "text-accent-primary" : "text-neutral-400 group-hover:text-accent-primary"
                    }`} />
                  </div>
                  <span className="hidden lg:block relative z-10 tracking-wide font-sans">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile tile in sidebar */}
        <div className="flex items-center gap-3 px-3 py-3 border-t border-white/5">
          <div className="h-9 w-9 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-accent-primary border border-white/10 relative overflow-hidden">
            <span className="text-xs">{initials}</span>
            <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/10 to-transparent" />
          </div>
          <div className="hidden lg:flex flex-col min-w-0">
            <span className="text-xs font-semibold text-[#f4f4f7] truncate">{displayName}</span>
            <span className="text-[10px] text-neutral-500 truncate">{displayEmail}</span>
          </div>
          <button
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="ml-auto rounded-md bg-red-600/70 px-3 py-1 text-sm text-white hover:bg-red-600/90"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Navigation (Bottom Nav) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden h-16 bg-[#050508b3] backdrop-blur-xl border-t border-white/5 items-center justify-around px-4"
        aria-label="Mobile Navigation"
      >
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentActive === item.id;
          const path = item.id === "dashboard" ? "/" : `/${item.id}`;

          return (
            <button
              key={item.id}
              id={`mobile-link-${item.id}`}
              onClick={() => handleSelect(item.id, path)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors duration-200 outline-none ${
                isActive ? "text-accent-primary" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {/* Highlight active tab on mobile with subtle text/icon glow */}
              {isActive && (
                <motion.div
                  layoutId="mobileActiveBackground"
                  className="absolute -inset-y-1 inset-x-0 bg-accent-primary/5 rounded-lg filter blur-[2px]"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                />
              )}

              <Icon className={`h-5 w-5 mb-0.5 relative z-10 transition-transform duration-200 ${
                isActive ? "text-accent-primary" : "text-neutral-500"
              }`} />

              <span className="relative z-10 font-sans tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
