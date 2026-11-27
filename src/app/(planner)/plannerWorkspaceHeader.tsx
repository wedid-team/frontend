"use client";

import { usePathname } from "next/navigation";
import { WorkspaceHeader } from "@/src/components/layout/workspaceHeader";
import { PLANNER_ROUTES } from "@/src/features/planner/routes";
import { usePlannerStore } from "@/src/features/planner/stores/plannerStore";
import { useUtAuthStore } from "@/src/stores/utAuthStore";

export function PlannerWorkspaceHeader() {
  const pathname = usePathname();
  const signedIn = useUtAuthStore((state) => state.provider !== null);
  const hasSavedPlan = usePlannerStore((state) => state.hasSavedPlan);
  const name = usePlannerStore((state) => state.me.name);
  const user =
    signedIn && hasSavedPlan
      ? {
          name: `${name}님`,
          avatarSrc: "/images/avatars/avatar-joongeun.png",
          menuItems: [{ href: PLANNER_ROUTES.myInfo, label: "내 정보" }],
        }
      : null;

  return <WorkspaceHeader key={pathname} user={user} />;
}
