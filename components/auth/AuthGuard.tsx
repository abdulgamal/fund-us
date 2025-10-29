"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, checkAutoLogout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Check for auto-logout on mount and periodically
  useEffect(() => {
    // Check immediately
    checkAutoLogout();

    // Set up interval to check every minute
    const interval = setInterval(() => {
      const shouldLogout = checkAutoLogout();
      if (shouldLogout) {
        clearInterval(interval);
      }
    }, 60000); // Check every minute

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [checkAutoLogout]);

  return <>{children}</>;
}

