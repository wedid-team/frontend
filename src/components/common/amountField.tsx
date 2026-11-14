"use client";

import { useId, type InputHTMLAttributes } from "react";
import styles from "./common.module.css";

type AmountFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> & {
  id?: string;
  label?: string;
  unit?: string;
};

export function AmountField({ id, label, unit = "만 원", ...inputProps }: AmountFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.field__label} htmlFor={fieldId}>
          {label}
        </label>
      )}
      <div className={styles.amountInput}>
        <input
          className={styles.amountInput__control}
          id={fieldId}
          inputMode="numeric"
          type="text"
          {...inputProps}
        />
        <span className={styles.amountInput__unit}>{unit}</span>
      </div>
    </div>
  );
}
