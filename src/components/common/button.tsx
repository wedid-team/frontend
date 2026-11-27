"use client";

import type { ButtonHTMLAttributes } from "react";
import styles from "./common.module.css";

export type ButtonVariant =
  | "primary"
  | "outline"
  | "ghost"
  | "dark"
  | "soft"
  | "kakao"
  /** @deprecated Use `outline` instead. */
  | "secondary";

export type ButtonSize = "xl" | "lg" | "md" | "sm" | "xs";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  children,
  className,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const visualVariant = variant === "secondary" ? "outline" : variant;
  const classes = [
    styles.button,
    styles[`button--${visualVariant}`],
    styles[`button--${size}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
