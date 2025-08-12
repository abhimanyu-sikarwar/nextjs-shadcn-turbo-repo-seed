"use client";

import { use, useCallback, useEffect, useState } from "react";

export const usePathname = () => {
  const [pathname, setPathname] = useState<string>("");

  useEffect(() => {
    // Set initial pathname
    setPathname(window.location.pathname);

    // Listen for pathname changes
    const handlePathChange = () => {
      setPathname(window.location.pathname);
    };

    // Listen to popstate event for browser back/forward navigation
    window.addEventListener("popstate", handlePathChange);

    // Listen to custom pathname change event
    window.addEventListener("pathchange", handlePathChange);

    return () => {
      // Cleanup listeners
      window.removeEventListener("popstate", handlePathChange);
      window.removeEventListener("pathchange", handlePathChange);
    };
  }, []);

  // Helper function to update pathname programmatically
  const updatePathname = useCallback((newPath: string) => {
    window.history.pushState({}, "", newPath);
    // Dispatch custom event to trigger pathname update
    window.dispatchEvent(new Event("pathchange"));
  }, []);

  return { pathname, updatePathname };
};
