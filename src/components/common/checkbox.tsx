"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./common.module.css";

type CheckboxContentProps =
  { label: string; children?: never } | { label?: never; children: ReactNode };

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "children" | "id" | "type"
> & {
  id?: string;
  description?: string;
} & CheckboxContentProps;

export function Checkbox({
  "aria-describedby": externalDescribedBy,
  children,
  description,
  disabled,
  id,
  label,
  ...inputProps
}: CheckboxProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const describedBy = [externalDescribedBy, descriptionId].filter(Boolean).join(" ");
  const classes = [styles.checkOption, disabled && styles["checkOption--disabled"]]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <input
        {...inputProps}
        aria-describedby={describedBy || undefined}
        className={styles.checkOption__control}
        disabled={disabled}
        id={fieldId}
        type="checkbox"
      />
      <span className={styles.checkOption__copy}>
        <label className={styles.checkOption__label} htmlFor={fieldId}>
          {label ?? children}
        </label>
        {description && (
          <span className={styles.checkOption__description} id={descriptionId}>
            {description}
          </span>
        )}
      </span>
    </div>
  );
}

export const ChecklistItem = Checkbox;
