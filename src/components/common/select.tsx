"use client";

import { useId, type SelectHTMLAttributes } from "react";
import styles from "./common.module.css";

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type SelectSize = "default" | "stack" | "small";

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "size"> & {
  id?: string;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  size?: SelectSize;
};

export function Select({
  className,
  id,
  label,
  options,
  placeholder,
  size = "default",
  ...selectProps
}: SelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const selectClasses = [styles.select, styles[`select--${size}`], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.field__label} htmlFor={fieldId}>
          {label}
        </label>
      )}
      <div className={styles.selectWrap}>
        <select className={selectClasses} id={fieldId} {...selectProps}>
          {placeholder && (
            <option disabled value="">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option disabled={option.disabled} key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className={`${styles.selectWrap__chevron} ${styles[`selectWrap__chevron--${size}`]}`}
        />
      </div>
    </div>
  );
}
