import { EstimateShell } from "../../components/layout";
import type { ReactNode } from "react";

export default function EstimateLayout({ children }: { children: ReactNode }) {
  return <EstimateShell>{children}</EstimateShell>;
}
