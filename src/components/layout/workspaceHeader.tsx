"use client";

import { usePathname } from "next/navigation";
import { type BreadcrumbItem } from "./breadcrumbs";
import { SiteHeader, type SiteHeaderUser } from "./siteHeader";
import { workspaceNavigationItems } from "./workspaceNavigation";

type WorkspaceHeaderProps = {
  user?: SiteHeaderUser | null;
};

export function WorkspaceHeader({ user }: WorkspaceHeaderProps) {
  const pathname = usePathname();
  const currentItem = workspaceNavigationItems.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(item.href + "/")),
  );

  const breadcrumbs: BreadcrumbItem[] = currentItem
    ? currentItem.href === "/home"
      ? [{ label: currentItem.label }]
      : [
          { label: "홈", href: "/home" },
          { label: currentItem.label },
        ]
    : [];

  return <SiteHeader breadcrumbs={breadcrumbs} variant="workspace" user={user} />;
}
