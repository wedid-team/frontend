"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import styles from "./sideNavigation.module.css";

export type SideNavigationItem = {
  href: string;
  label: string;
  icon?: ReactNode;
};

type SideNavigationProps = {
  items: SideNavigationItem[];
  ariaLabel?: string;
};

export function SideNavigation({ ariaLabel = "서비스 메뉴", items }: SideNavigationProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={ariaLabel} className={styles.navigation}>
      <ul className={styles.list}>
        {items.map((item) => {
          const isCurrent =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href + "/"));

          return (
            <li className={styles.item} key={item.href}>
              <Link
                aria-current={isCurrent ? "page" : undefined}
                className={[styles.link, isCurrent ? styles["link--current"] : ""].join(" ")}
                href={item.href}
              >
                {item.icon ? <span aria-hidden="true" className={styles.icon}>{item.icon}</span> : null}
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
