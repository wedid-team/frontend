import Link from "next/link";
import styles from "./breadcrumbs.module.css";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="현재 위치"
      className={[styles.breadcrumbs, className].filter(Boolean).join(" ")}
    >
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li className={styles.item} key={item.label + "-" + index}>
              {index > 0 ? <span aria-hidden="true" className={styles.separator}>›</span> : null}
              {item.href && !isCurrent ? (
                <Link className={styles.link} href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={isCurrent ? "page" : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
