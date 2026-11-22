import type { ReactNode } from "react";
import { SiteHeader } from "./siteHeader";
import styles from "./publicShell.module.css";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.frame}>
      <SiteHeader variant="public" />
      <div className={styles.main}>{children}</div>
    </div>
  );
}
