import type { ReactNode } from "react";
import { SideNavigation, type SideNavigationItem } from "./sideNavigation";
import type { SiteHeaderUser } from "./siteHeader";
import { WorkspaceHeader } from "./workspaceHeader";
import styles from "./workspaceShell.module.css";

type WorkspaceShellProps = {
  children: ReactNode;
  navigationItems?: SideNavigationItem[];
  user?: SiteHeaderUser | null;
};

export function WorkspaceShell({ children, navigationItems = [], user }: WorkspaceShellProps) {
  return (
    <div className={styles.frame}>
      <WorkspaceHeader user={user} />
      <div className={styles.body}>
        <SideNavigation items={navigationItems} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
