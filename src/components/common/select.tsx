"use client";

import { useId, type SelectHTMLAttributes } from "react";
import styles from "./common.module.css";

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
  id?: string;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
};

export function Select({ id, label, options, placeholder, ...selectProps }: SelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.field__label} htmlFor={fieldId}>
          {label}
        </label>
      )}
      <div className={styles.selectWrap}>
        <select className={styles.select} id={fieldId} {...selectProps}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option disabled={option.disabled} key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span aria-hidden="true" className={styles.selectWrap__chevron} />
      </div>
    </div>
  );
}
