import type { ReactNode } from "react";
import { WorkspaceRouter } from "../../../features/venues/workspaceRouter";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <WorkspaceRouter>{children}</WorkspaceRouter>;
}
