import type { ReactNode } from "react";
import { SideNavigation, type SideNavigationItem } from "./sideNavigation";
import type { SiteHeaderUser } from "./siteHeader";
import { WorkspaceHeader } from "./workspaceHeader";
import layout from "./workspaceLayout.module.css";
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
      <div className={layout.page}>
        <div className={layout.shell}>
          <SideNavigation items={navigationItems} />
          <main className={layout.main}>
            <div className={layout.main__inner}>{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
