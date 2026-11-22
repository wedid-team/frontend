"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** 첫 방문의 질문/결과 헤더는 기능에서 조합하고, 다른 경로의 공통 헤더는 보존한다. */
export function FirstVisitHeaderBoundary({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname === "/" ? null : children;
}
