import { WorkspaceShell } from "../../components/layout";
import { workspaceNavigationItems } from "../../components/layout/workspaceNavigation";
import type { ReactNode } from "react";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <WorkspaceShell navigationItems={workspaceNavigationItems}>
      {children}
    </WorkspaceShell>
  );
}
