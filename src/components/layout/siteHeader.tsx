import Image from "next/image";
import Link from "next/link";
import { Logo } from "../common";
import { Breadcrumbs, type BreadcrumbItem } from "./breadcrumbs";
import styles from "./siteHeader.module.css";

export type SiteHeaderUser = {
  name: string;
  avatarSrc?: string;
  menuItems?: Array<{ href: string; label: string }>;
};

type SiteHeaderProps = {
  variant?: "public" | "workspace";
  user?: SiteHeaderUser | null;
  profileTone?: "soft" | "primary";
  loginHref?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
};

export function SiteHeader({
  breadcrumbs,
  className,
  loginHref = "/login",
  profileTone = "soft",
  user,
  variant = "public",
}: SiteHeaderProps) {
  const isWorkspace = variant === "workspace";
  const toneClass =
    profileTone === "primary"
      ? styles["account__trigger--primary"]
      : styles["account__trigger--soft"];

  return (
    <header
      className={[
        styles.header,
        isWorkspace ? styles["header--workspace"] : styles["header--public"],
        className,
      ].filter(Boolean).join(" ")}
    >
      <div className={styles.header__inner}>
        <Logo className={styles.header__logo} />
        {breadcrumbs?.length ? (
          <Breadcrumbs className={styles.breadcrumbs} items={breadcrumbs} />
        ) : null}

        {!isWorkspace || user ? (
          <nav aria-label="계정 메뉴" className={styles.navigation}>
            {user ? (
              <details className={styles.account}>
                <summary className={[styles.account__trigger, toneClass].join(" ")}>
                  {user.avatarSrc ? (
                    <Image
                      alt=""
                      className={styles.account__avatar}
                      height={36}
                      src={user.avatarSrc}
                      width={36}
                    />
                  ) : (
                    <span aria-hidden="true" className={styles.account__avatarFallback}>
                      {user.name.slice(0, 1)}
                    </span>
                  )}
                  <span className={styles.account__name}>{user.name}</span>
                  <span aria-hidden="true" className={styles.account__chevron} />
                </summary>
                <div className={styles.account__menu}>
                  <strong className={styles.account__menuTitle}>{user.name}</strong>
                  {user.menuItems?.map((item) => (
                    <Link className={styles.account__menuLink} href={item.href} key={item.href}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            ) : (
              <Link className={styles.navigation__login} href={loginHref}>
                로그인
              </Link>
            )}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
