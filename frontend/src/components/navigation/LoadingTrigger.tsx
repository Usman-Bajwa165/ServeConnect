"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function LoadingTrigger() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor && anchor.href && anchor.href.startsWith(window.location.origin)) {
        // Only trigger for internal links that aren't '#' or current page (optional)
        const url = new URL(anchor.href);
        if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
          window.dispatchEvent(new Event("start-loading"));
        }
      }
      
      // Also for buttons that might be triggering navigation (if they have data-nav)
      const button = target.closest("button");
      if (button && (button.type === "submit" || button.dataset.nav)) {
          window.dispatchEvent(new Event("start-loading"));
      }
    };

    window.addEventListener("click", handleAnchorClick);
    return () => window.removeEventListener("click", handleAnchorClick);
  }, []);

  useEffect(() => {
    // Hide loading bar when route changes
    window.dispatchEvent(new Event("stop-loading"));
  }, [pathname, searchParams]);

  return null;
}
