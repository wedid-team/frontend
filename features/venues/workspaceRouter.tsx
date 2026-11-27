"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { WorkspaceShell } from "../../src/components/layout";
import { workspaceNavigationItems } from "../../src/components/layout/workspaceNavigation";
import { DiscoveryShell } from "./discoveryShell";

export function WorkspaceRouter({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (
    pathname === "/venues" ||
    pathname.startsWith("/venues/") ||
    pathname === "/sdm" ||
    ["/home", "/budget"].includes(pathname)
  ) {
    return <DiscoveryShell>{children}</DiscoveryShell>;
  }
  return <WorkspaceShell navigationItems={workspaceNavigationItems}>{children}</WorkspaceShell>;
}
