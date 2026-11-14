import Image from "next/image";
import Link from "next/link";
import { Logo } from "../common";
import styles from "./siteHeader.module.css";

export type SiteHeaderUser = {
  name: string;
  avatarSrc?: string;
  menuItems?: Array<{ href: string; label: string }>;
};

type SiteHeaderProps = {
  user?: SiteHeaderUser | null;
  profileTone?: "soft" | "primary";
  roadmapHref?: string;
  loginHref?: string;
  className?: string;
};

export function SiteHeader({
  className,
  loginHref = "/login",
  profileTone = "soft",
  roadmapHref = "/roadmap",
  user,
}: SiteHeaderProps) {
  return (
    <header className={[styles.header, className].filter(Boolean).join(" ")}>
      <div className={styles.header__inner}>
        <Logo className={styles.header__logo} />

        <nav aria-label="주요 메뉴" className={styles.navigation}>
          <Link className={styles.navigation__roadmap} href={roadmapHref}>
            내 로드맵
          </Link>

          {user ? (
            <details className={styles.account}>
              <summary
                className={`${styles.account__trigger} ${styles[`account__trigger--${profileTone}`]}`}
              >
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
      </div>
    </header>
  );
}
