import styles from "./common.module.css";

export type StatusBadgeStatus = "upcoming" | "in-progress" | "complete";

type StatusBadgeProps = {
  status: StatusBadgeStatus;
  children: string;
};

export function StatusBadge({ children, status }: StatusBadgeProps) {
  return <span className={`${styles.badge} ${styles[`badge--${status}`]}`}>{children}</span>;
}
