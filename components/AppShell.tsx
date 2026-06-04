"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";
import { UserProvider } from "@/lib/UserContext";

const AUTH_ROUTES = ["/login", "/register"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_ROUTES.includes(pathname);

  return (
    <UserProvider>
      {isAuthPage ? (
        <>{children}</>
      ) : (
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 overflow-auto">
            <AuthGuard>{children}</AuthGuard>
          </div>
        </div>
      )}
    </UserProvider>
  );
}
