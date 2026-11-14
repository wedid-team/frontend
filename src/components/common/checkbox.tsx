"use client";

import { useId, type InputHTMLAttributes } from "react";
import styles from "./common.module.css";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> & {
  id?: string;
  label: string;
  description?: string;
};

export function Checkbox({ description, id, label, ...inputProps }: CheckboxProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <label className={styles.checkOption} htmlFor={fieldId}>
      <input className={styles.checkOption__control} id={fieldId} type="checkbox" {...inputProps} />
      <span className={styles.checkOption__copy}>
        <span className={styles.checkOption__label}>{label}</span>
        {description && <span className={styles.checkOption__description}>{description}</span>}
      </span>
    </label>
  );
}
