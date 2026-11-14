import Image from "next/image";
import Link from "next/link";
import styles from "./common.module.css";

type LogoProps = {
  href?: string;
  className?: string;
};

export function Logo({ href = "/", className }: LogoProps) {
  return (
    <Link
      aria-label="WEDID 홈"
      className={[styles.logo, className].filter(Boolean).join(" ")}
      href={href}
    >
      <Image alt="" height={32} src="/wedidLogo.svg" width={47} />
      <Image alt="" height={20} src="/wedidWordmark.svg" width={103} />
    </Link>
  );
}
