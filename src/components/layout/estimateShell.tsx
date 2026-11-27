import type { ReactNode } from "react";
import { Logo } from "../common";
import styles from "./estimateShell.module.css";

export function EstimateShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.frame}>
      <header className={styles.header}><Logo /></header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
