"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // If Supabase client is not initialized (e.g., missing env vars), skip auth guard for preview mode
  if (!supabase) {
    return <>{children}</>;
  }

  useEffect(() => {
    const check = async () => {
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session && pathname !== "/login") {
        router.replace("/login");
      }
    };
    check();
  }, [pathname, router]);

  // While checking, render nothing to avoid flash of protected content
  return <>{children}</>;
}
